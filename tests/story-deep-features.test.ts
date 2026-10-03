import { describe, it, expect } from 'vitest';
import { GameState, CustomerOrder } from '../src/types/game';
import { getUnlockedCurios, CURIOS_AND_RELICS } from '../src/content/curiosAndRelics';
import { getResidentAffinity, getAllResidentAffinities } from '../src/content/residentAffinity';
import { getTonightRadioBroadcast, NIGHT_RADIO_BROADCASTS } from '../src/content/nightRadio';
import { getUnlockedSignatureDishes, SIGNATURE_STORY_DISHES } from '../src/content/signatureStoryDishes';
import { renderMemoriesAlbumModal } from '../src/ui/components/MemoriesAlbumModal';
import { renderNightRadioModal } from '../src/ui/components/NightRadioModal';
import { renderCharacterEpisodeModal } from '../src/ui/components/CharacterStoryModal';
import { CHARACTER_EPISODES } from '../src/content/characterNarrativeArcs';
import { calculateCustomerTip } from '../src/core/day';
import { renderMenuTab } from '../src/ui/components/MenuTab';
import { createInitialState, migrateSave } from '../src/core/state';

function createMockState(overrides?: Partial<GameState>): GameState {
  return {
    version: 2,
    day: 1,
    phase: 'prep',
    money: 1000000,
    shopName: 'Tiệm Gà Thử Nghiệm',
    currentChapter: 1,
    isFastForward: false,
    soundEnabled: true,
    inventory: {},
    menu: [],
    upgrades: {},
    staff: [],
    candidates: [],
    ratings: { taste: 5, speed: 5, hygiene: 5, space: 5, pricing: 5, overall: 5 },
    recentReviews: [],
    oilCondition: 'clean',
    oilBatchesCooked: 0,
    dayHistory: [],
    bestReviews: [],
    unlockedStoryActs: [1],
    completedQuests: [],
    bunnyVisitsCount: 0,
    unlockedBunnyLetters: [],
    karma: { community: 50, craftsmanship: 50, ambition: 50 },
    lifetimeStats: { totalFried: 0, totalBurnt: 0, totalRevenue: 0, perfectFriedCount: 0 },
    ...overrides,
  };
}

describe('Hệ Thống Tính Năng Chiều Sâu Cốt Truyện & Visual Novel (Story Deep Features)', () => {

  // =========================================================================
  // 1. TỦ KỶ VẬT & BẢO VẬT LỊCH SỬ HẺM 1102 (CURIOS & RELICS)
  // =========================================================================
  describe('1. Tủ Kỷ Vật & Hiện Vật Lịch Sử (Curios & Relics)', () => {
    it('1.1. Chưa có cờ nhân quả: danh sách kỷ vật mở khóa rỗng', () => {
      const state = createMockState();
      const unlocked = getUnlockedCurios(state);
      expect(unlocked.length).toBe(0);
    });

    it('1.2. Mở khóa kỷ vật Vá Gỗ 1990 khi có cờ bacba_housewarming_honored', () => {
      const state = createMockState({
        characterStoryState: {
          characterProgress: {
            bac_ba: {
              characterId: 'bac_ba',
              currentEpisodeIndex: 4,
              completedEpisodeIds: ['bac_ba_ep_01', 'bac_ba_ep_02', 'bac_ba_ep_03', 'bac_ba_ep_04'],
              chosenOptionIds: {},
              causalityFlags: ['bacba_housewarming_honored'],
            },
          },
          pendingEpisodeId: null,
          readEpisodeHistory: [],
        },
      });

      const unlocked = getUnlockedCurios(state);
      expect(unlocked.some(r => r.id === 'relic_va_go_1990')).toBe(true);
      const relic = unlocked.find(r => r.id === 'relic_va_go_1990')!;
      expect(relic.sourceCharacter).toContain('Bác Ba');
      expect(relic.passiveBuffText).toContain('Perfect');
    });

    it('1.3. Mở khóa nhiều kỷ vật xuyên suốt qua các chương', () => {
      const state = createMockState({
        unlockedCurioIds: ['relic_giay_mua_canh', 'relic_hop_dong_tu_choi_2_ty', 'relic_cup_ga_vang'],
      });

      const unlocked = getUnlockedCurios(state);
      expect(unlocked.length).toBe(3);
      expect(unlocked.map(r => r.id)).toEqual(
        expect.arrayContaining(['relic_giay_mua_canh', 'relic_hop_dong_tu_choi_2_ty', 'relic_cup_ga_vang'])
      );
    });
  });

  // =========================================================================
  // 2. HỒ SƠ CƯ DÂN & CẤP ĐỘ THÂN THIẾT (RESIDENT AFFINITY DOSSIER)
  // =========================================================================
  describe('2. Hồ Sơ Cư Dân & Cấp Thân Thiết (Resident Affinity)', () => {
    it('2.1. Nhân vật chưa đọc tập nào: đạt Rank 1 (Khách Vãng Lai)', () => {
      const state = createMockState();
      const aff = getResidentAffinity(state, 'bac_ba');
      expect(aff.rank).toBe(1);
      expect(aff.rankTitle).toContain('Người Lạ');
      expect(aff.favoriteDish).toBeDefined();
    });

    it('2.2. Hoàn thành 1-3 tập: thăng hạng Rank 2 & Rank 3', () => {
      const state = createMockState({
        characterStoryState: {
          characterProgress: {
            tho_cam: {
              characterId: 'tho_cam',
              currentEpisodeIndex: 2,
              completedEpisodeIds: ['tho_cam_ep_01', 'tho_cam_ep_02'],
              chosenOptionIds: {},
              causalityFlags: [],
            },
          },
          pendingEpisodeId: null,
          readEpisodeHistory: [],
        },
      });

      const aff = getResidentAffinity(state, 'tho_cam');
      expect(aff.rank).toBe(3);
      expect(aff.rankTitle).toContain('Bạn Hữu');
      expect(aff.name).toContain('Mimi');
    });

    it('2.3. Hoàn thành 6 tập trở lên: đạt Rank 5 tối thượng (Người Một Nhà)', () => {
      const state = createMockState({
        characterStoryState: {
          characterProgress: {
            le_bao_na: {
              characterId: 'le_bao_na',
              currentEpisodeIndex: 7,
              completedEpisodeIds: ['na_ep_01', 'na_ep_02', 'na_ep_03', 'na_ep_04', 'na_ep_05', 'na_ep_06', 'na_ep_07'],
              chosenOptionIds: {},
              causalityFlags: ['na_shoes_wings_drawn', 'community_academy_founded'],
            },
          },
          pendingEpisodeId: null,
          readEpisodeHistory: [],
        },
      });

      const aff = getResidentAffinity(state, 'le_bao_na');
      expect(aff.rank).toBe(5);
      expect(aff.rankTitle).toContain('Người Một Nhà');
      expect(aff.secretBio).toContain('học viện');
    });

    it('2.4. getAllResidentAffinities trả về toàn bộ danh sách dossier', () => {
      const state = createMockState();
      const all = getAllResidentAffinities(state);
      expect(all.length).toBeGreaterThanOrEqual(6);
      expect(all.some(a => a.characterId === 'bac_ba')).toBe(true);
      expect(all.some(a => a.characterId === 'anh_long')).toBe(true);
    });
  });

  // =========================================================================
  // 3. BẢN TIN PHÁT THANH ĐÊM SÀI GÒN (LATE NIGHT RADIO CASSETTE)
  // =========================================================================
  describe('3. Bản Tin Phát Thanh Đêm Sài Gòn (Late Night Radio)', () => {
    it('3.1. Ngày 1 Chương 1: phát bản tin mở màn tiếng chuông leng keng', () => {
      const state = createMockState({ day: 1, currentChapter: 1 });
      const broadcast = getTonightRadioBroadcast(state);
      expect(broadcast).not.toBeNull();
      expect(broadcast!.channelName).toContain('FM 99.9 MHz');
      expect(broadcast!.headline).toContain('Bác Ba Mách Nước');
    });

    it('3.2. Ngày 20 Chương 2: phát bản tin căn nhà số 14 giàn hoa giấy', () => {
      const state = createMockState({ day: 20, currentChapter: 2 });
      const broadcast = getTonightRadioBroadcast(state);
      expect(broadcast).not.toBeNull();
      expect(broadcast!.chapter).toBe(2);
      expect(broadcast!.headline).toContain('Bốn Chiếc Bàn Gỗ Sồi');
    });

    it('3.3. Ngày 180 Chương 5: phát bản tin vinh quang cúp Gà Vàng', () => {
      const state = createMockState({ day: 180, currentChapter: 5 });
      const broadcast = getTonightRadioBroadcast(state);
      expect(broadcast).not.toBeNull();
      expect(broadcast!.headline).toContain('Bản Lĩnh Đất Sài Gòn');
    });
  });

  // =========================================================================
  // 4. MÓN ĂN KỶ NIỆM GẮN LIỀN CỐT TRUYỆN (SIGNATURE STORY DISHES)
  // =========================================================================
  describe('4. Món Ăn Kỷ Niệm (Signature Story Dishes)', () => {
    it('4.1. Mở khóa Cháo Gà Gừng khi có cờ bacba_health_restored', () => {
      const state = createMockState({
        characterStoryState: {
          characterProgress: {
            bac_ba: {
              characterId: 'bac_ba',
              currentEpisodeIndex: 5,
              completedEpisodeIds: ['bac_ba_ep_05'],
              chosenOptionIds: {},
              causalityFlags: ['bacba_health_restored'],
            },
          },
          pendingEpisodeId: null,
          readEpisodeHistory: [],
        },
      });

      const dishes = getUnlockedSignatureDishes(state);
      expect(dishes.some(d => d.id === 'dish_chao_ga_gung_bac_ba')).toBe(true);
      const dish = dishes.find(d => d.id === 'dish_chao_ga_gung_bac_ba')!;
      expect(dish.associatedCharacter).toContain('Bác Ba');
      expect(dish.priceBonusPercent).toBeGreaterThanOrEqual(15);
    });

    it('4.2. calculateCustomerTip kích hoạt buff tiền tip từ món ăn kỷ niệm', () => {
      const mockOrder: CustomerOrder = {
        id: 'ord_test_sig',
        customerName: 'Bác Ba Tổ Trưởng',
        avatar: '👴',
        personality: 'family',
        items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }],
        totalPrice: 40000,
        patienceMax: 30,
        patienceCurrent: 25,
      };

      // Chưa mở khóa món kỷ niệm
      const tipWithoutSig = calculateCustomerTip(mockOrder, false, [], []);
      expect(tipWithoutSig.tip).toBe(5000); // Fast service tip

      // Đã mở khóa Cháo Gà Bác Ba
      const tipWithSig = calculateCustomerTip(mockOrder, false, [], ['dish_chao_ga_gung_bac_ba']);
      expect(tipWithSig.tip).toBe(5000 + 2500); // 7500đ
      expect(tipWithSig.feedbackNotes.some(n => n.includes('Cháo Gà Bác Ba'))).toBe(true);
    });

    it('4.3. renderMenuTab hiển thị section Món Kỷ Niệm Cốt Truyện', () => {
      const state = createInitialState();
      state.customSignatureDishesUnlocked = ['dish_chao_ga_gung_bac_ba'];
      const html = renderMenuTab(state);

      expect(html).toContain('Món Kỷ Niệm Cốt Truyện');
      expect(html).toContain('Cháo Gà Gừng Tía Tô Bác Ba');
      expect(html).toContain('+20% Tip/Doanh Thu');
      expect(html).toContain('Gà Lắc Phô Mai Mật Ong Thỏ Cam');
    });
  });

  // =========================================================================
  // 5. GIAO DIỆN MODAL VISUAL NOVEL & SỔ KÝ ỨC (UI RENDERING)
  // =========================================================================
  describe('5. Kiểm Tra Render Giao Diện Modal (UI Rendering)', () => {
    it('5.1. renderMemoriesAlbumModal render đầy đủ 5 tabs', () => {
      const state = createMockState();
      
      const htmlResidents = renderMemoriesAlbumModal(state, 'residents');
      expect(htmlResidents).toContain('👥 Cư Dân');

      const htmlAffinity = renderMemoriesAlbumModal(state, 'affinity');
      expect(htmlAffinity).toContain('💖 Thân Thiết (Dossier)');
      expect(htmlAffinity).toContain('Món khoái khẩu');

      const htmlCurios = renderMemoriesAlbumModal(state, 'curios');
      expect(htmlCurios).toContain('🏺 Tủ Kỷ Vật');

      const htmlEndings = renderMemoriesAlbumModal(state, 'endings');
      expect(htmlEndings).toContain('🏆 Kết Cục');

      const htmlBunny = renderMemoriesAlbumModal(state, 'bunny');
      expect(htmlBunny).toContain('💌 Thư Thỏ Cam');
    });

    it('5.2. renderNightRadioModal hiển thị cassette FM 99.9 MHz chuẩn xác', () => {
      const state = createMockState();
      const broadcast = NIGHT_RADIO_BROADCASTS[0]!;
      const html = renderNightRadioModal(state, broadcast);

      expect(html).toContain('FM 99.9 MHz');
      expect(html).toContain('ON AIR');
      expect(html).toContain('BĂNG CASSETTE');
      expect(html).toContain('Bác Ba Mách Nước');
    });

    it('5.3. renderCharacterEpisodeModal hiển thị mood badges sinh động', () => {
      const state = createMockState();
      const ep = CHARACTER_EPISODES[0]!;
      const html = renderCharacterEpisodeModal(state, ep);

      expect(html).toContain('Ký Sự Hẻm 1102');
      expect(html).toContain('Bác Ba');
      expect(html).toContain('btn-char-story-choice');
    });
  });

  // =========================================================================
  // 6. KIỂM TRA BẢO LƯU DỮ LIỆU & SAVE MIGRATION (DATA INTEGRITY)
  // =========================================================================
  describe('6. Kiểm Tra Khôi Phục Lưu Trữ (Save Persistence & Migration)', () => {
    it('6.1. migrateSave bảo lưu đầy đủ kỷ vật, món kỷ niệm, góc thú cưng và đài đêm', () => {
      const initial = createInitialState();
      initial.unlockedCurioIds = ['relic_va_go_1990', 'relic_cup_ga_vang'];
      initial.customSignatureDishesUnlocked = ['dish_chao_ga_gung_bac_ba'];
      initial.residentAffinityLevels = { tho_cam: 3, bac_ba: 4 };
      initial.heardRadioBroadcastIds = ['broadcast_ch1_d1'];
      initial.todayWeather = 'sudden_rain';

      const jsonStr = JSON.stringify(initial);
      const migrated = migrateSave(JSON.parse(jsonStr));

      expect(migrated).not.toBeNull();
      const savedState = migrated!.state;
      expect(savedState.unlockedCurioIds).toEqual(['relic_va_go_1990', 'relic_cup_ga_vang']);
      expect(savedState.customSignatureDishesUnlocked).toEqual(['dish_chao_ga_gung_bac_ba']);
      expect(savedState.residentAffinityLevels).toEqual({ tho_cam: 3, bac_ba: 4 });
      expect(savedState.heardRadioBroadcastIds).toEqual(['broadcast_ch1_d1']);
      expect(savedState.todayWeather).toBe('sudden_rain');
      expect(savedState.petPatio).toBeDefined();
      expect(savedState.petPatio?.pets).toHaveLength(2);
    });

    it('6.2. migrateSave an toàn với save phiên bản cũ không có trường mới', () => {
      const legacyRaw = JSON.parse(JSON.stringify(createInitialState()));
      delete (legacyRaw as any).unlockedCurioIds;
      delete (legacyRaw as any).customSignatureDishesUnlocked;
      delete (legacyRaw as any).petPatio;

      const migrated = migrateSave(legacyRaw);
      expect(migrated).not.toBeNull();
      const savedState = migrated!.state;
      expect(Array.isArray(savedState.unlockedCurioIds)).toBe(true);
      expect(Array.isArray(savedState.customSignatureDishesUnlocked)).toBe(true);
      expect(savedState.petPatio).toBeDefined();
      expect(savedState.petPatio?.pets).toHaveLength(2);
    });
  });
});
