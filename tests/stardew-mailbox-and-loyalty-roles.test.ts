import { describe, it, expect, vi } from 'vitest';
import { GameState } from '../src/types/game';
import { LOYALTY_ROLE_CATEGORIES } from '../src/ui/components/LoyaltyHandbookModal';
import { openStardewMailboxModal } from '../src/ui/components/StardewMailboxModal';
import { renderChalkboard } from '../src/ui/components/Chalkboard';
import { ASSETS } from '../src/content/assets';
import { CHARACTERS_36 } from '../src/content/characters36';

function createMockState(overrides: Partial<GameState> = {}): GameState {
  return {
    day: 3,
    currentChapter: 1,
    money: 250000,
    reputation: 15,
    ratings: { overall: 4.8, speed: 4.8, taste: 4.9, service: 4.7 },
    unlockedBunnyLetters: [],
    achievedEndings: [],
    seenIncidentIds: ['inc_01', 'inc_02'],
    loyaltyState: {
      residents: {
        char_01_owner: {
          characterId: 'char_01_owner',
          heartLevel: 3,
          exp: 280,
          totalVisits: 5,
          perfectDishesServed: 4,
          specialRequestsFulfilled: 3,
          unlockedGifts: []
        }
      },
      pendingAlleyGifts: [
        {
          id: 'gift_test_1',
          characterId: 'char_01_owner',
          senderName: 'Bác Ba Béo',
          giftLabel: 'Hũ Mỡ Gà Thơm',
          letterContent: 'Mỡ gà này đem chiên cơm hay ướp sốt là thơm nức mũi nghen!',
          heartLevel: 2,
          dateReceived: 3,
          claimed: false
        }
      ],
      claimedAlleyGiftsHistory: []
    },
    menu: [],
    inventory: [],
    activeUpgrades: [],
    staffList: [],
    ...overrides
  } as unknown as GameState;
}

describe('Stardew Mailbox & Loyalty Role Tabs Polish Suite', () => {
  it('1. ASSETS.ui.mailboxStardew exists and points to valid asset', () => {
    expect(ASSETS.ui.mailboxStardew).toBeDefined();
    expect(ASSETS.ui.mailboxStardew).toContain('mailbox_stardew.png');
  });

  it('2. LOYALTY_ROLE_CATEGORIES covers all required resident roles', () => {
    expect(LOYALTY_ROLE_CATEGORIES).toHaveLength(7);
    const ids = LOYALTY_ROLE_CATEGORIES.map(c => c.id);
    expect(ids).toContain('all');
    expect(ids).toContain('staff');
    expect(ids).toContain('regular');
    expect(ids).toContain('street_worker');
    expect(ids).toContain('authority');
    expect(ids).toContain('transit');
    expect(ids).toContain('animal');

    // Every character belongs to one of these categories
    for (const char of CHARACTERS_36) {
      expect(ids).toContain(char.category);
    }
  });

  it('3. Chalkboard renders Stardew Mailbox with Pixel Wax Seal and Cozy Cooking Cabinet', () => {
    const state = createMockState();
    const html = renderChalkboard(state, 'Trời Đêm');

    // Hòm Thư Trước Nhà
    expect(html).toContain('id="btn-open-stardew-mailbox"');
    expect(html).toContain('mailbox-pixel-sprite');
    expect(html).toContain('mailbox-pixel-wax-seal');
    expect(html).toContain('(1 TIN MỚI)'); // Có 1 quà chờ

    // Nút tắt trong Hòm Thư
    expect(html).toContain('id="btn-open-loyalty-handbook"');
    expect(html).toContain('id="btn-open-memories"');
    expect(html).toContain('id="btn-open-incidents"');

    // Tủ Bếp & Đồ Nghề Nấu Nướng Cozy
    expect(html).toContain('cozy-cooking-cabinet');
    expect(html).toContain('HỘC TỦ ĐỒ NGHỀ BẾP GÀ');
    expect(html).toContain('Gia Vị & Nồi Sốt');
    expect(html).toContain('id="btn-secret-sauce"');
  });

  it('4. Chalkboard renders (ĐÃ ĐỌC HẾT) seal when no unread mail is pending', () => {
    const state = createMockState({
      loyaltyState: {
        residents: {},
        pendingAlleyGifts: [],
        claimedAlleyGiftsHistory: []
      }
    });
    const html = renderChalkboard(state);
    expect(html).toContain('(ĐÃ ĐỌC HẾT)');
    expect(html).not.toContain('(1 TIN MỚI)');
  });

  it('5. openStardewMailboxModal renders 3 big decision cards and triggers callbacks', () => {
    const state = createMockState();
    const callbacks = {
      openMemories: vi.fn(),
      openLoyalty: vi.fn(),
      openIncidents: vi.fn()
    };

    let appendedElement: any = null;
    (globalThis as any).document = {
      getElementById: () => null,
      createElement: () => ({
        id: '',
        className: '',
        innerHTML: '',
        querySelector: (sel: string) => {
          if (sel === '#btn-open-loyalty-handbook') {
            return {
              set onclick(fn: any) {
                // Trigger callback when clicked
                fn({ stopPropagation: () => {} });
              }
            };
          }
          return null;
        },
        querySelectorAll: () => [],
        remove: () => {}
      }),
      body: {
        appendChild: (el: any) => { appendedElement = el; }
      }
    };

    openStardewMailboxModal(state, callbacks);
    expect(appendedElement).not.toBeNull();
    expect(appendedElement.innerHTML).toContain('HÒM THƯ TRƯỚC NHÀ');
    expect(appendedElement.innerHTML).toContain('TRI KỶ HẺM 1102');
    expect(appendedElement.innerHTML).toContain('KỶ NIỆM HẺM');
    expect(appendedElement.innerHTML).toContain('SỔ TAY HẺM 1102');
    expect(callbacks.openLoyalty).toHaveBeenCalledTimes(1);

    // Cleanup mock
    delete (globalThis as any).document;
  });
});
