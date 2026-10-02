import { staffEffects } from '../../core/staff';
import { GameState, CustomerOrder, QualityRating } from '../../types/game';
import { cookingEngine } from '../../core/cooking';
import { SellingSession, FxEvent } from '../../core/sellingSim';
import { isRushHour } from '../../core/clock';
import { foodImage, ASSETS, staffImage } from '../../content/assets';
import { TIMER_RECIPES, TimerStationId, timerPhase, DRINK_RECIPES, DrinkId, ASSEMBLY_RECIPES, AssemblyId, assemblyBaseIndex } from '../../core/stations';
import { stationOpen, perfectTip } from '../../core/day';
import { escapeHtml } from '../escapeHtml';
import { renderPrepStation, prepStationKey } from './PrepStation';
import { getWeatherForDay } from '../../content/saigonWeather';
import { renderWeatherAtmosphereStrip } from './WeatherAtmosphere';

export type { SellingSession };

function formatClock(gameHour: number): string {
  const h = Math.floor(gameHour);
  const m = Math.floor((gameHour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function patienceLevel(order: CustomerOrder): { percent: number; cls: '' | 'mid' | 'low'; angry: boolean } {
  const percent = Math.max(0, Math.round((order.patienceCurrent / order.patienceMax) * 100));
  return { percent, cls: percent > 50 ? '' : percent > 25 ? 'mid' : 'low', angry: percent <= 25 };
}

export type CustomerMood = 'happy' | 'waiting' | 'impatient' | 'leaving';

export function getCustomerMood(order: CustomerOrder): CustomerMood {
  const p = patienceLevel(order);
  if (p.angry) return 'leaving';
  if (p.cls === 'low') return 'impatient';
  if (p.cls === 'mid') return 'waiting';
  return 'happy';
}

export function getMoodThought(mood: CustomerMood, order?: CustomerOrder, state?: GameState): string {
  // 1. Phản xạ ngữ cảnh theo trạng thái quán realtime (Dầu, Lobby 4P, Streak)
  if (state) {
    // Ngữ cảnh Dầu đen / bẩn
    const isDirtyOil = state.oilCondition === 'dirty' || (state as any).oilQuality === 'black' || (typeof (state as any).oilQuality === 'number' && (state as any).oilQuality < 35);
    const isCleanOil = state.oilCondition === 'clean' || (state as any).oilQuality === 'clean' || (typeof (state as any).oilQuality === 'number' && (state as any).oilQuality >= 90);

    if (isDirtyOil) {
      if (mood === 'waiting' && Math.random() < 0.4) {
        return 'Mùi dầu hơi khét rồi đó chủ tiệm ơi... thay dầu đi nè! 🛢️';
      }
      if (mood === 'impatient') {
        return 'Dầu đen kịt vầy ăn có đau bụng hông ta... lo quá! 🥺';
      }
    } else if (isCleanOil && mood === 'waiting' && Math.random() < 0.3) {
      return 'Dầu vàng ươm thơm phức nghen, nhìn là ưng cái bụng liền ✨!';
    }

    // Ngữ cảnh Đua Top Lobby 4 Người
    if (state.roomId && mood === 'waiting' && Math.random() < 0.25) {
      return `Phòng ${state.roomId.toUpperCase()} đang đua top gắt lắm, quán mình ráng giật cúp nha 🏆!`;
    }

    // Ngữ cảnh Chuỗi Perfect cao
    if (((state as any)?.perfectStreak ?? 0) >= 3 && mood === 'happy' && Math.random() < 0.4) {
      return 'Bếp trưởng chiên Perfect liên hoàn đỉnh nóc kịch trần luôn 🔥!';
    }
  }

  // Ngữ cảnh dặn kèm tương dặn
  if (order?.items?.some(it => it.condiment) && mood === 'waiting' && Math.random() < 0.35) {
    return 'Nhớ xịt đúng tương dặn kèm nha, thiếu tương là hờn á 🍅!';
  }

  if (order?.isBunny) {
    if (mood === 'leaving') return 'Em đói lả người rồi tiệm ơi... 🥺';
    if (mood === 'impatient') return 'Chờ thêm xíu nữa thui nè! 🐰';
    if (mood === 'waiting') return 'Mùi gà chiên thơm nức mũi luôn á! 🤤';
    return 'Gà giòn rụm đỉnh nóc kịch trần! 💖';
  }

  const p = order?.personality;
  if (p === 'vip_generous' || order?.isVip) {
    switch (mood) {
      case 'leaving': return 'Thời gian là vàng bạc! Anh xin kiếu lần này! 🚪';
      case 'impatient': return 'Lâu quá anh sốt ruột nha, nhanh tay là có thưởng đậm! ⏱️';
      case 'waiting': return 'Tiền nong không quan trọng, làm chuẩn giòn rụm anh bo hết nấc! 💵';
      case 'happy': return 'Gà ngon xuất sắc! Khỏi thối tiền thừa nha em! 👑✨';
    }
  }

  if (p === 'foodie') {
    switch (mood) {
      case 'leaving': return 'Chờ mòn mỏi chưa có, trừ sạch sao nha! 💢';
      case 'impatient': return 'Canh lửa chuẩn nha, chiên non lửa là tui biết đó! ⏱️';
      case 'waiting': return 'Nghe tiếng dầu réo là biết tay nghề cứng rồi! 🍗';
      case 'happy': return 'Da gà ráo dầu, giòn rụm đúng chuẩn! ⭐';
    }
  }

  if (p === 'impatient') {
    switch (mood) {
      case 'leaving': return 'Trễ giờ chấm công rồi! Bỏ đi đây! 😤';
      case 'impatient': return 'Sắp trễ giờ họp rồi, nóng ruột quá trời! ⏳';
      case 'waiting': return 'Gói lẹ giùm em nha chủ tiệm ơi! 🏃';
      case 'happy': return 'Nhanh như chớp, kịp giờ làm rồi! ⚡';
    }
  }

  if (p === 'driver') {
    switch (mood) {
      case 'leaving': return 'Trễ giờ đơn app phạt tiền, huỷ đơn thôi! ❌';
      case 'impatient': return 'Khách réo nổ máy điện thoại luôn rồi anh ơi! ⏳';
      case 'waiting': return 'App báo đơn gấp, tiệm làm liền giùm em nha! 📦';
      case 'happy': return 'Cảm ơn tiệm, em phóng đi giao cho kịp đây! 🛵';
    }
  }

  if (p === 'student') {
    switch (mood) {
      case 'leaving': return 'Đói lả người rồi, qua quán bánh mì ăn cho lẹ! 🏃';
      case 'impatient': return 'Bụng réo ầm ầm rồi đại ca ơi... 🥺';
      case 'waiting': return 'Ăn xong cái đùi này về giải tích phân mới vô! 📖';
      case 'happy': return 'Gà sốt cay ở đây dính vãi chưởng! 🍟';
    }
  }

  if (p === 'easygoing') {
    switch (mood) {
      case 'leaving': return 'Có việc bận rồi, hẹn tiệm mai ghé lại nhen! 🚶';
      case 'impatient': return 'Nay đông khách dữ ta ơi, ráng đợi thêm chút! ⏳';
      case 'waiting': return 'Tiệm cứ chiên từ từ, em đứng đợi được nhen! 😊';
      case 'happy': return 'Gà nóng hổi thơm ngon, ưng cái bụng ghê! 🍵';
    }
  }

  if (p === 'generous') {
    switch (mood) {
      case 'leaving': return 'Thôi chịu hết nổi rồi, hẹn tiệm dịp khác vậy! 🚪';
      case 'impatient': return 'Cũng hơi lâu xíu rồi đó nha tiệm! 🕒';
      case 'waiting': return 'Cứ làm kỹ càng nha em, anh không vội đâu! ✨';
      case 'happy': return 'Quá ngon! Bữa nay tip đậm cho chủ quán! 💵';
    }
  }

  if (p === 'frugal') {
    switch (mood) {
      case 'leaving': return 'Giá rẻ mà đợi lâu vầy thì thôi xin kiếu! 🏃';
      case 'impatient': return 'Lâu quá chừng, xin thêm gói tương nha! 🍅';
      case 'waiting': return 'Đợi combo rẻ mà ngon bõ công ghê! 🍗';
      case 'happy': return 'Combo giá hời mà gà chất lượng thiệt! 🪙';
    }
  }

  switch (mood) {
    case 'leaving':
      return 'Lâu quá mức! Bỏ về đây! 💢';
    case 'impatient':
      return 'Chờ sốt ruột ghê, nhanh giùm em nha! 🥺';
    case 'waiting':
      return 'Mùi gà thơm nức mũi, thèm chảy nước miếng! 🤤';
    case 'happy':
    default:
      return 'Tiệm này đỉnh chóp hẻm 1102! ✨';
  }
}

// Tiền bay / khách bỏ về: vẽ từ hàng đợi hiệu ứng của core (drainFx trong main.ts), trên một lớp cố định
// NGOÀI #main-view → không bị mất khi màn bán hàng dựng lại HTML (mỗi lần giao món).
// Class cho CSS: .money-float, .tip-float, .lost-float (layer: .fx-layer)
export function renderFx(events: readonly FxEvent[]): void {
  let layer = document.getElementById('fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'fx-layer';
    layer.className = 'fx-layer floating-money-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  const spawn = (cls: string, text: string, left: number, top: string) => {
    const el = document.createElement('div');
    el.className = cls;
    el.style.left = `${left}%`;
    el.style.top = top;
    el.textContent = text;
    layer!.appendChild(el);
    setTimeout(() => el.remove(), 1150);
  };
  for (const fx of events) {
    const left = 20 + Math.random() * 35;
    if (fx.kind === 'cash') {
      spawn('money-float', `+${fx.paid.toLocaleString('vi-VN')}đ 💵`, left, 'calc(env(safe-area-inset-top) + 72px)');
      if (fx.tip > 0) {
        spawn('money-float tip-float', `+${fx.tip.toLocaleString('vi-VN')}đ tip ✨`, left + 4, 'calc(env(safe-area-inset-top) + 102px)');
        spawn('money-float heart-float', '💖 Cảm ơn tiệm!', left - 2, 'calc(env(safe-area-inset-top) + 132px)');
      }
    } else if (fx.kind === 'lost') {
      spawn('money-float lost-float', '😤 Khách bỏ về', left, 'calc(env(safe-area-inset-top) + 140px)');
    }
  }
}

// Tip của mẻ Perfect kế tiếp (đúng công thức core/day.ts perfectTip), hiển thị dạng "6,3k"
const streakTipLabel = (streak: number) => `+${(perfectTip(streak) / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}k tip`;

// Mọi thứ làm thay đổi CẤU TRÚC màn bán hàng. Khác key cũ → dựng lại HTML; giống → chỉ patch.
export function sellingStructureKey(state: GameState, session: SellingSession): string {
  const cook = cookingEngine.getCookState();
  return JSON.stringify([
    session.orders.map(o => [o.id, o.items.map(it => it.served)]),
    (session.departingCustomers || []).map(d => [d.order.id, d.phase]),
    cookingEngine.getTray().map(t => t.id + (t.condiment ?? '')),
    cook.isFrying, cook.fryingType, cookingEngine.getActiveSeasoning(),
    state.oilCondition, state.currentChapter,
    session.isFastForward, isRushHour(session.gameHour),
    session.perfectStreak >= 2,
    Boolean(session.activeThief),
    stationStripKey(state, session),
    staffStripKey(state, session),
    prepStationKey(state)
  ]);
}

interface CachedCustomerCard {
  card: HTMLElement;
  fill: HTMLElement | null;
  ringFill: SVGCircleElement | null;
  moodEmoji: HTMLElement | null;
  emoteBubble: HTMLElement | null;
  thoughtEl: HTMLElement | null;
  thoughtText: HTMLElement | null;
  img: HTMLImageElement | null;
}

interface SellingDomCache {
  clock: HTMLElement | null;
  pointer: HTMLElement | null;
  hint: HTMLElement | null;
  fryPot: HTMLElement | null;
  oilDot: HTMLElement | null;
  oilLabel: HTMLElement | null;
  foodPanImg: HTMLImageElement | null;
  foodStatusBadge: HTMLElement | null;
  fryingFoodItem: HTMLElement | null;
  streakContainer: HTMLElement | null;
  helpers: (HTMLElement | null)[];
  timers: Map<TimerStationId, HTMLElement | null>;
  cards: Map<string, CachedCustomerCard>;
}

const sellingDomCacheMap = new WeakMap<HTMLElement, SellingDomCache>();

function getSellingDomCache(root: HTMLElement): SellingDomCache {
  let cache = sellingDomCacheMap.get(root);
  if (!cache || !cache.clock?.isConnected || !cache.fryPot?.isConnected) {
    cache = {
      clock: root.querySelector('.clock b'),
      pointer: root.querySelector('.cook-gauge-pointer'),
      hint: root.querySelector('.pot-hint'),
      fryPot: root.querySelector('#btn-fry-pot'),
      oilDot: root.querySelector('.oil-dot'),
      oilLabel: root.querySelector('.oil-status-label'),
      foodPanImg: root.querySelector('.food-pan-img'),
      foodStatusBadge: root.querySelector('.food-status-badge'),
      fryingFoodItem: root.querySelector('.frying-food-item'),
      streakContainer: root.querySelector('#streak-flame-container'),
      helpers: [],
      timers: new Map(),
      cards: new Map()
    };
    sellingDomCacheMap.set(root, cache);
  }
  return cache;
}

// Cập nhật tại chỗ các giá trị chạy theo thời gian; dùng SellingDomCache để đạt 60-120 FPS.
export function patchSellingView(root: HTMLElement, session: SellingSession, state?: GameState): void {
  const cache = getSellingDomCache(root);

  if (state) {
    const cooks = staffEffects(state.staff, session.gameHour).cooks;
    cooks.forEach((c, i) => {
      let el = cache.helpers[i];
      if (el === undefined) {
        el = root.querySelector<HTMLElement>(`.helper-progress[data-helper="${i}"]`);
        cache.helpers[i] = el;
      }
      const slot = session.helpers?.[i];
      if (el && slot) el.textContent = `${Math.min(100, Math.round((slot.elapsedMs / c.cycleMs) * 100))}%`;
    });
  }

  if (cache.clock) cache.clock.textContent = formatClock(session.gameHour);

  for (const id of Object.keys(TIMER_RECIPES) as TimerStationId[]) {
    let el = cache.timers.get(id);
    if (el === undefined) {
      el = root.querySelector<HTMLElement>(`.timer-progress[data-timer="${id}"]`);
      cache.timers.set(id, el);
    }
    const elapsed = session.timers[id];
    if (el && elapsed !== null) {
      const r = TIMER_RECIPES[id];
      const pct = Math.min(100, Math.round((elapsed / r.cookMs) * 100));
      el.textContent = timerPhase(r, elapsed) === 'cooking' ? `${pct}%` : '';
    }
  }

  for (const order of session.orders) {
    let c = cache.cards.get(order.id);
    if (!c || !c.card.isConnected) {
      const card = root.querySelector<HTMLElement>(`.customer-card[data-order-id="${order.id}"]`);
      if (!card) continue;
      c = {
        card,
        fill: card.querySelector<HTMLElement>('.patience-fill'),
        ringFill: card.querySelector<SVGCircleElement>('.ring-fill'),
        moodEmoji: card.querySelector<HTMLElement>('.mood-indicator'),
        emoteBubble: card.querySelector<HTMLElement>('.stardew-emote-bubble'),
        thoughtEl: card.querySelector<HTMLElement>('.thought-bubble'),
        thoughtText: card.querySelector<HTMLElement>('.thought-text'),
        img: card.querySelector<HTMLImageElement>('.char-sprite-img')
      };
      cache.cards.set(order.id, c);
    }

    const p = patienceLevel(order);
    c.card.classList.toggle('angry', p.angry);
    const mood = getCustomerMood(order);
    c.card.dataset.mood = mood;

    if (c.fill) {
      c.fill.style.width = `${p.percent}%`;
      c.fill.classList.toggle('mid', p.cls === 'mid');
      c.fill.classList.toggle('low', p.cls === 'low');
    }
    if (c.ringFill) {
      const offset = (138.23 * (1 - p.percent / 100)).toFixed(1);
      c.ringFill.style.strokeDashoffset = `${offset}`;
      c.ringFill.classList.toggle('mid', p.cls === 'mid');
      c.ringFill.classList.toggle('low', p.cls === 'low');
    }
    if (c.moodEmoji) {
      c.moodEmoji.innerHTML = p.angry 
        ? `<img src="${ASSETS.icons.emoteAnger}" class="badge-pixel-star-xs" alt="💢" />`
        : p.cls === 'low' 
        ? `<img src="${ASSETS.icons.emoteSweat}" class="badge-pixel-star-xs" alt="💦" />`
        : p.cls === 'mid' 
        ? `<img src="${ASSETS.icons.emoteYum}" class="badge-pixel-star-xs" alt="😋" />`
        : `<img src="${ASSETS.icons.sparkle}" class="badge-pixel-star-xs" alt="✨" />`;
    }
    if (c.emoteBubble) {
      const thoughtMsg = getMoodThought(mood, order, state);
      c.emoteBubble.title = thoughtMsg;
      const targetIcon = p.angry
        ? ASSETS.icons.emoteAnger
        : p.cls === 'low'
        ? ASSETS.icons.emoteSweat
        : order.isVip || order.isBunny
        ? ASSETS.icons.heart
        : p.cls === 'mid'
        ? ASSETS.icons.emoteQuestion
        : ASSETS.icons.emoteYum;

      const img = c.emoteBubble.querySelector<HTMLImageElement>('img');
      if (img) {
        if (!img.src.endsWith(targetIcon)) img.src = targetIcon;
      } else {
        c.emoteBubble.innerHTML = `<img src="${targetIcon}" class="emote-pixel-img" alt="${mood}" width="16" height="16" />`;
      }
    }

    // Dynamic 2D sprite expression swap
    if (c.img) {
      const standSrc = c.card.dataset.standSrc;
      const angrySrc = c.card.dataset.angrySrc;
      const walkSrc = c.card.dataset.walkSrc;
      const isNew = Date.now() - order.startTime < 750;

      if (p.angry && angrySrc) {
        if (!c.img.src.endsWith(angrySrc)) c.img.src = angrySrc;
        c.img.classList.remove('standing', 'walking');
        c.img.classList.add('angry');
      } else if (isNew && walkSrc) {
        if (!c.img.src.endsWith(walkSrc)) c.img.src = walkSrc;
        c.img.classList.remove('standing', 'angry');
        c.img.classList.add('walking');
      } else if (standSrc) {
        if (!c.img.src.endsWith(standSrc)) c.img.src = standSrc;
        c.img.classList.remove('angry', 'walking');
        c.img.classList.add('standing');
      }
    }
  }

  // Cập nhật dòng chữ chạy LED đáy quán theo khách hàng đầu tiên
  if (session.orders.length > 0) {
    const liveTicker = root.querySelector<HTMLElement>('#ticker-live-text');
    const activeOrd = session.orders[0];
    if (liveTicker && activeOrd) {
      const activeVisual = getCustomerVisual(activeOrd);
      const activeMood = getCustomerMood(activeOrd);
      const activeThought = getMoodThought(activeMood, activeOrd, state);
      const msg = `${activeVisual.name}: "${activeThought}" • Hẻm 1102 phục vụ chu đáo!`;
      if (liveTicker.textContent !== msg) {
        liveTicker.textContent = msg;
      }
    }
  }

  const cook = cookingEngine.getCookState();
  if (cache.pointer) {
    const progress = Math.min(100, Math.max(0, cook.progress));
    cache.pointer.style.left = `${progress.toFixed(2)}%`;
  }
  if (cache.hint) cache.hint.textContent = potHint();

  const currentOil = state?.oilCondition ?? 'clean';
  if (cache.oilDot) {
    cache.oilDot.className = `oil-dot ${currentOil}`;
  }
  if (cache.oilLabel) {
    const label = currentOil === 'clean' ? 'Vàng óng' : currentOil === 'medium' ? 'Nâu sẫm' : 'Đen khét';
    if (cache.oilLabel.textContent !== label) cache.oilLabel.textContent = label;
  }

  if (cache.fryPot) {
    cache.fryPot.classList.toggle('oil-clean', currentOil === 'clean');
    cache.fryPot.classList.toggle('oil-medium', currentOil === 'medium');
    cache.fryPot.classList.toggle('oil-dirty', currentOil === 'dirty');

    if (cook.isFrying) {
      const quality = cookingEngine.calculateCurrentQuality();
      cache.fryPot.classList.toggle('perfect-glow', quality === 'perfect');
      cache.fryPot.classList.toggle('burnt-smoke', quality === 'burnt');

      if (cache.foodStatusBadge) {
        cache.foodStatusBadge.className = `food-status-badge ${quality}`;
        const qualityTag = quality === 'perfect' ? '⭐ VÀNG GIÒN' : quality === 'burnt' ? '💥 CHÁY KHÉT' : quality === 'good' ? 'VỪA CHÍN' : 'SỐNG';
        let foodLabel = '🍗 GÀ GIÒN';
        if (cook.fryingType === 'thigh') foodLabel = '🍗 MÁ ĐÙI CAY';
        else if (cook.fryingType === 'fries') foodLabel = '🍟 KHOAI LẮC';
        else if (cook.fryingType === 'popcorn') foodLabel = '🍿 GÀ VIÊN';
        else if (cook.fryingType === 'cheese') foodLabel = '🧀 PHÔ MAI QUE';
        cache.foodStatusBadge.textContent = `${foodLabel} · ${qualityTag}`;
      }

      if (cache.fryingFoodItem) {
        cache.fryingFoodItem.className = `frying-food-item ${quality} sizzle-active`;
      }

      if (cache.foodPanImg) {
        let foodImg = ASSETS.food.crispyChickenPerfect;
        if (cook.fryingType === 'thigh') {
          foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepThighRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.spicyThigh;
        } else if (cook.fryingType === 'fries') {
          foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepFriesRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.shakeFries;
        } else if (cook.fryingType === 'popcorn') {
          foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepPopcornRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.popcornChicken;
        } else if (cook.fryingType === 'cheese') {
          foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepCheeseStickRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.cheeseStick;
        } else {
          foodImg = quality === 'raw' ? ASSETS.food.crispyChickenRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.crispyChickenPerfect;
        }
        if (!cache.foodPanImg.src.endsWith(foodImg)) {
          cache.foodPanImg.src = foodImg;
        }
      }
    }
    cache.fryPot.classList.toggle('streak-fire', (session.perfectStreak || 0) >= 2);
  }

  // Dynamic Perfect Streak Flame update
  if (cache.streakContainer) {
    const streak = session.perfectStreak || 0;
    const currentStreak = cache.streakContainer.dataset.streak ? parseInt(cache.streakContainer.dataset.streak, 10) : 0;
    if (streak !== currentStreak) {
      cache.streakContainer.dataset.streak = String(streak);
      if (streak >= 2) {
        cache.streakContainer.innerHTML = `
          <div class="streak-flame ${streak >= 5 ? 'super-fire' : ''}" data-streak="${streak}">
            <span class="flame-icon">🔥</span>
            <span class="streak-count">Chuỗi x${streak} PERFECT!</span>
            <span class="streak-bonus">${streakTipLabel(streak)}</span>
          </div>
        `;
      } else {
        cache.streakContainer.innerHTML = '';
      }
    }
  }

  // Cập nhật đếm ngược tên trộm
  const thiefTimerEl = root.querySelector('#thief-banner-time');
  if (thiefTimerEl && session.activeThief) {
    thiefTimerEl.textContent = `⏳ ${Math.ceil(session.activeThief.timeRemaining)}s`;
  }
}

function potHint(): string {
  const cook = cookingEngine.getCookState();
  if (!cook.isFrying) return '👉 Chạm để thả gà tươi / khoai vào chảo!';
  const quality = cookingEngine.calculateCurrentQuality();
  if (quality === 'perfect') return '⭐ VÀNG GIÒN RỒI! BẤM VỚT NGAY!';
  if (quality === 'burnt') return '💥 CHÁY KHÉT! BẤM VỚT BỎ NGAY!';
  if (quality === 'good') return '🔥 Dầu sôi xèo xèo... Canh vàng giòn!';
  return '🍗 Đang chiên ngập dầu... Chờ chín!';
}

const TRAY_QUALITY_LABEL: Record<QualityRating, string> = {
  raw: 'CÒN SỐNG',
  good: 'VỪA CHÍN',
  perfect: 'VÀNG GIÒN ⭐',
  burnt: 'CHÁY KHÉT'
};

export interface CustomerVisualModel {
  stand: string;
  walk: string;
  angry: string;
  leave: string;
  name: string;
  badge: string;
  badgeClass: string;
}

function getCustomerVisual(order: CustomerOrder): CustomerVisualModel {
  // Ưu tiên sử dụng model sprite từ bộ 36 nhân vật Hẻm 1102
  if (order.avatar && (order.avatar.includes('assets/') || order.avatar.endsWith('.png'))) {
    return {
      stand: order.avatar,
      walk: order.avatar,
      angry: order.avatar,
      leave: order.avatar,
      name: order.customerName,
      badge: order.archetypeBadge || 'Cư Dân Hẻm',
      badgeClass: order.isDelivery ? 'delivery-badge' : 'genz-badge'
    };
  }
  if (order.isBunny) {
    return {
      stand: ASSETS.thocam.front,
      walk: ASSETS.thocam.side,
      angry: ASSETS.thocam.buon,
      leave: ASSETS.thocam.vui,
      name: 'Bé Thỏ Cam 🐰',
      badge: 'Khách Tri Kỷ',
      badgeClass: 'bunny-badge'
    };
  }
  if (order.customerName.includes('Bác Ba')) {
    return {
      stand: ASSETS.bacba.front,
      walk: ASSETS.bacba.threeQuarter,
      angry: ASSETS.bacba.front,
      leave: ASSETS.bacba.threeQuarter,
      name: order.customerName,
      badge: 'Trưởng Ban Hẻm',
      badgeClass: 'vip-badge'
    };
  }
  if (order.customerName.includes('Gà Bông') || order.isMysteryGuest) {
    return {
      stand: ASSETS.gabong.front,
      walk: ASSETS.gabong.side,
      angry: ASSETS.gabong.hoang,
      leave: ASSETS.gabong.vui,
      name: order.customerName,
      badge: 'Khách Bí Ẩn',
      badgeClass: 'mystery-badge'
    };
  }
  if (order.isDelivery || order.customerName.includes('Shipper') || order.customerName.includes('Giao Hàng') || order.customerName.includes('[App]')) {
    return {
      stand: ASSETS.shipper.stand,
      walk: ASSETS.shipper.walk,
      angry: ASSETS.shipper.angry,
      leave: ASSETS.shipper.leave,
      name: order.customerName,
      badge: 'Shipper Ruột',
      badgeClass: 'delivery-badge'
    };
  }

  const n = order.customerName;
  if (n.includes('Học Sinh') || n.includes('Sinh Viên') || n.includes('Kiệt') || n.includes('Vy') || n.includes('Khôi') || n.includes('Nguyên')) {
    return {
      stand: ASSETS.hocsinh.stand,
      walk: ASSETS.hocsinh.walk,
      angry: ASSETS.hocsinh.angry,
      leave: ASSETS.hocsinh.leave,
      name: order.customerName,
      badge: 'Học Sinh Ôn Thi',
      badgeClass: 'student-badge'
    };
  }
  if (n.includes('Game') || n.includes('Huy') || n.includes('Rank') || n.includes('Cú Đêm') || n.includes('Bảo')) {
    return {
      stand: ASSETS.gamethu.stand,
      walk: ASSETS.gamethu.walk,
      angry: ASSETS.gamethu.angry,
      leave: ASSETS.gamethu.leave,
      name: order.customerName,
      badge: 'Cú Đêm Cày Rank',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Review') || n.includes('Tiktok') || n.includes('Mukbang') || n.includes('Quỳnh Anh') || n.includes('Hân') || n.includes('Trend')) {
    return {
      stand: ASSETS.tiktoker.stand,
      walk: ASSETS.tiktoker.walk,
      angry: ASSETS.tiktoker.angry,
      leave: ASSETS.tiktoker.leave,
      name: order.customerName,
      badge: 'Tiktoker Triệu View',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Khó Tính') || n.includes('Karen') || n.includes('Lan') || n.includes('Hằng') || n.includes('Soi')) {
    return {
      stand: ASSETS.karen.stand,
      walk: ASSETS.karen.walk,
      angry: ASSETS.karen.angry,
      leave: ASSETS.karen.leave,
      name: order.customerName,
      badge: 'Thực Khách Kỹ Tính',
      badgeClass: 'demanding-badge'
    };
  }
  if (n.includes('Bắp') || n.includes('Bé') || n.includes('Mít') || n.includes('Cháu')) {
    return {
      stand: ASSETS.becon.stand,
      walk: ASSETS.becon.walk,
      angry: ASSETS.becon.angry,
      leave: ASSETS.becon.leave,
      name: order.customerName,
      badge: 'Khách Hàng Nhí',
      badgeClass: 'kid-badge'
    };
  }
  if (n.includes('Trưởng Phòng') || n.includes('Long') || n.includes('Khải') || n.includes('Sếp')) {
    return {
      stand: ASSETS.truongphong.stand,
      walk: ASSETS.truongphong.walk,
      angry: ASSETS.truongphong.angry,
      leave: ASSETS.truongphong.leave,
      name: order.customerName,
      badge: 'Sếp Khao Team',
      badgeClass: 'office-badge'
    };
  }
  if (n.includes('Bảy') || n.includes('Bà') || n.includes('Chợ Cũ') || n.includes('Cô Tư') || n.includes('Bác Hạc')) {
    return {
      stand: ASSETS.babay.stand,
      walk: ASSETS.babay.walk,
      angry: ASSETS.babay.angry,
      leave: ASSETS.babay.leave,
      name: order.customerName,
      badge: 'Bà Bảy Nam Bộ',
      badgeClass: 'local-badge'
    };
  }
  if (n.includes('Cặp Đôi') || n.includes('Bé Na') || n.includes('Bạn Trai') || n.includes('Hẹn Hò')) {
    return {
      stand: ASSETS.capdoi.stand,
      walk: ASSETS.capdoi.walk,
      angry: ASSETS.capdoi.angry,
      leave: ASSETS.capdoi.leave,
      name: order.customerName,
      badge: 'Cặp Đôi Hẹn Hò',
      badgeClass: 'genz-badge'
    };
  }
  if (n.includes('Su Su') || n.includes('Mẹ Con') || n.includes('Gia Đình') || n.includes('Nhà')) {
    return {
      stand: ASSETS.mecon.stand,
      walk: ASSETS.mecon.walk,
      angry: ASSETS.mecon.angry,
      leave: ASSETS.mecon.leave,
      name: order.customerName,
      badge: 'Gia Đình Ấm Cúng',
      badgeClass: 'family-badge'
    };
  }

  // Default: Office Lady
  return {
    stand: ASSETS.vanphong.stand,
    walk: ASSETS.vanphong.walk,
    angry: ASSETS.vanphong.angry,
    leave: ASSETS.vanphong.leave,
    name: order.customerName,
    badge: order.archetypeBadge || 'Dân Văn Phòng',
    badgeClass: 'office-badge'
  };
}

export function renderSellingView(state: GameState, session: SellingSession): string {
  const formattedTime = formatClock(session.gameHour);
  const rush = isRushHour(session.gameHour);
  const hourNum = session.gameHour;
  const timePeriodLabel = hourNum < 14 ? '☀️ Ca Trưa Hẻm 1102 · Nắng Vàng Giòn Rụm' : '🌙 Ca Tối Hẻm 1102 · Đèn Dầu Bập Bùng';
  const tray = cookingEngine.getTray();

  // 1. Khách Hàng Hoàn Tất Đang Diễn Hoạt Nhận Món & Bước Đi Rời Quán (The 4-Beat Serving Cadence)
  const departingCardsHtml = (session.departingCustomers || []).map((dep) => {
    const visual = getCustomerVisual(dep.order);
    const isReceiving = dep.phase === 'receiving';
    const isLeaving = dep.phase === 'leaving';
    const initialSrc = isLeaving ? visual.walk : visual.stand;

    return `
      <div class="customer-card departing ${isReceiving ? 'receiving' : 'leaving'} ${dep.isDelighted ? 'delighted' : ''}" 
           data-order-id="${dep.order.id}" 
           aria-hidden="true"
           style="pointer-events: none;">
        <!-- Stardew Floating Emote Bubble -->
        <div class="stardew-emote-bubble ${dep.isDelighted ? 'happy' : 'leaving'}">
          <img src="${dep.isDelighted ? ASSETS.icons.sparkle : ASSETS.icons.emoteYum}" class="emote-pixel-img" alt="✨" width="16" height="16" />
        </div>

        <!-- 2D Character Walking & Standing Stage -->
        <div class="cust-stage">
          <div class="char-actor ${isReceiving ? 'char-hop-delight' : 'char-flip-exit'}">
            <img src="${initialSrc}" alt="${visual.name}" class="char-sprite-img ${isLeaving ? 'walking-out' : 'happy-hop'}" />
            <div class="char-shadow ${isLeaving ? 'shadow-walk' : ''}"></div>
            <!-- Túi giấy Kraft mang về trên tay khách -->
            <div class="prop-takeaway-bag" title="Đã đóng gói mang về">
              <span class="bag-steam">♨️</span>
              <span class="bag-icon">🛍️</span>
            </div>
          </div>
          <div class="cust-info-col">
            <div class="cust-name-row">
              <span class="cust-name">${visual.name}</span>
              <span class="mood-indicator"><img src="${ASSETS.icons.sparkle}" class="badge-pixel-star-xs" alt="✨" /></span>
            </div>
            <div class="cust-badges-row">
              <span class="cust-badge served-success-badge"><img src="${ASSETS.icons.check}" class="badge-pixel-star-xs" alt="" /> ĐÃ LÊN MÓN</span>
            </div>
          </div>
        </div>

        <!-- Phiếu hoàn tất đơn hàng đóng gói xinh xắn -->
        <div class="speech-bubble wooden-order-ticket is-takeaway-served">
          <div class="bubble-arrow"></div>
          <div class="served-bag-notice">
            <span class="served-bag-title">🎁 ĐÃ LÊN MÓN</span>
            <span class="served-bag-sub">${escapeHtml(dep.takeawayItemName || 'Gà Rán Giòn')} · Cảm ơn quán!</span>
          </div>
        </div>

        <!-- Thanh hoàn thành xanh lá đầy 100% -->
        <div class="patience-container">
          <div class="patience-bar">
            <div class="patience-fill" style="width: 100%; background: var(--mint);"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Customer Queue Lane
  const customerCardsHtml = session.orders.map((ord, idx) => {
    const { percent: patiencePercent, cls: patienceColorClass, angry: isAngry } = patienceLevel(ord);
    const visual = getCustomerVisual(ord);
    const mood = getCustomerMood(ord);
    const thought = getMoodThought(mood, ord, state);
    const hasMatchInTray = tray.some(t => ord.items.some(it => it.menuItemId === t.menuItemId && !it.completed));

    const comboHtml = ord.comboName ? `<div class="order-combo"><img src="${ASSETS.icons.gift}" class="btn-pixel-icon-xs" alt="" /> ${escapeHtml(ord.comboName)}</div>` : '';
    const itemsHtml = comboHtml + ord.items.map(it => {
      const menuItem = state.menu.find(m => m.id === it.menuItemId);
      const name = menuItem ? menuItem.name : it.menuItemId;
      const img = foodImage(it.menuItemId, 'perfect');
      const qtyText = it.count > 1 ? (it.served > 0 ? `${it.served}/${it.count}` : `${it.count}×`) : '1×';
      const isItemInTray = tray.some(t => t.menuItemId === it.menuItemId && !it.completed);
      const statusClass = it.completed ? 'done' : isItemInTray ? 'ready' : it.served > 0 ? 'partial' : 'pending';
      const statusText = it.completed ? '✓ Đủ' : isItemInTray ? '✨ Sẵn sàng!' : it.served > 0 ? `⏳ ${it.served}/${it.count}` : '○ Đợi';
      return `
        <div class="order-row ${it.completed ? 'is-completed' : ''} ${isItemInTray ? 'is-ready-in-tray' : ''}">
          <span class="order-item-title">
            ${img ? `<img src="${img}" class="order-food-thumb ${isItemInTray ? 'pulse-thumb' : ''}" alt="${escapeHtml(name)}" width="28" height="28" />` : `<span class="order-food-emoji">${menuItem ? menuItem.icon : '🍗'}</span>`}
            <span class="order-qty">${qtyText}</span>
            <span class="order-food-name">${escapeHtml(name)}</span>
            ${it.condiment ? `<span class="order-condiment" data-condiment="${it.condiment}">${it.condiment === 'ketchup' ? `<img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-xs" alt="" /> + tương cà` : `<img src="${ASSETS.icons.chickenSpicy}" class="btn-pixel-icon-xs" alt="" /> + tương ớt`}</span>` : ''}
          </span>
          <span class="order-check ${statusClass}" title="${it.completed ? 'Món đã giao đủ' : isItemInTray ? 'Khay đã có sẵn món này, chạm để giao ngay!' : 'Đang chờ món này'}">${statusText}</span>
        </div>
      `;
    }).join('');

    const isNew = Date.now() - ord.startTime < 750;
    const initialSrc = isAngry ? visual.angry : isNew ? visual.walk : visual.stand;
    const initialCls = isAngry ? 'angry' : isNew ? 'walking' : 'standing';
    const actorHtml = `<img src="${initialSrc}" alt="${visual.name}" class="char-sprite-img ${initialCls}" />`;
    const queueBadge = idx === 0 
      ? `<span class="queue-pos-badge first"><img src="${ASSETS.icons.star}" class="badge-pixel-star-xs" alt="" /> Đang phục vụ</span>` 
      : idx === 1 
      ? '<span class="queue-pos-badge next"><span class="queue-num-badge">2</span> Kế tiếp</span>' 
      : `<span class="queue-pos-badge wait"><span class="queue-num-badge">${idx + 1}</span> Xếp hàng</span>`;

    const emoteIcon = isAngry
      ? ASSETS.icons.emoteAnger
      : patiencePercent < 25
      ? ASSETS.icons.emoteSweat
      : ord.isBunny || ord.isVip
      ? ASSETS.icons.heart
      : hasMatchInTray
      ? ASSETS.icons.sparkle
      : patiencePercent < 55
      ? ASSETS.icons.emoteQuestion
      : ASSETS.icons.emoteYum;

    return `
      <div class="customer-card ${ord.isBunny ? 'bunny-card' : ''} ${ord.isVip ? 'vip-card' : ''} ${isAngry ? 'angry' : ''} ${idx === 0 ? 'active' : ''}" 
           data-order-id="${ord.id}" 
           data-mood="${mood}" 
           data-is-bunny="${ord.isBunny ? 'true' : 'false'}" 
           data-is-vip="${ord.isVip ? 'true' : 'false'}"
           data-letter-id="${ord.bunnyLetterId || ''}"
           data-stand-src="${visual.stand}"
           data-walk-src="${visual.walk}"
           data-angry-src="${visual.angry}"
           data-leave-src="${visual.leave}">
        <!-- Stardew Floating Emote Bubble (16x16 Pixel Emote) -->
        <div class="stardew-emote-bubble ${mood}" data-mood="${mood}" title="${escapeHtml(thought)}">
          <img src="${emoteIcon}" class="emote-pixel-img" alt="${mood}" width="16" height="16" />
        </div>

        <!-- 2D Character Walking & Standing Stage -->
        <div class="cust-stage">
          <div class="char-actor">
            <!-- Vòng thời gian kiên nhẫn quanh khách (aenhatrang report #51) -->
            <svg class="patience-ring-svg" viewBox="0 0 52 52" aria-hidden="true">
              <circle class="ring-track" cx="26" cy="26" r="22" />
              <circle class="ring-fill ${patienceColorClass}" cx="26" cy="26" r="22"
                      stroke-dasharray="138.23"
                      stroke-dashoffset="${(138.23 * (1 - patiencePercent / 100)).toFixed(1)}" />
            </svg>
            ${actorHtml}
            <div class="char-shadow"></div>
            <div class="stardew-emote-bubble" title="Cảm xúc">
              ${isAngry 
                ? `<img src="${ASSETS.icons.emoteAnger}" class="emote-pixel-img" alt="💢" />` 
                : patienceColorClass === 'low' 
                ? `<img src="${ASSETS.icons.emoteSweat}" class="emote-pixel-img" alt="💦" />` 
                : (ord.isVip 
                  ? `<img src="${ASSETS.icons.heart}" class="emote-pixel-img" alt="VIP" />` 
                  : (patienceColorClass === 'mid' 
                    ? `<img src="${ASSETS.icons.emoteQuestion}" class="emote-pixel-img" alt="⏳" />` 
                    : `<img src="${ASSETS.icons.emoteYum}" class="emote-pixel-img" alt="😋" />`))}
            </div>
          </div>
          <div class="cust-info-col">
            <div class="cust-name-row">
              <span class="cust-name">${visual.name}</span>
              <span class="mood-indicator">${isAngry 
                ? `<img src="${ASSETS.icons.emoteAnger}" class="badge-pixel-star-xs" alt="💢" />` 
                : patienceColorClass === 'low' 
                ? `<img src="${ASSETS.icons.emoteSweat}" class="badge-pixel-star-xs" alt="🥺" />` 
                : (ord.isVip 
                  ? `<img src="${ASSETS.icons.heart}" class="badge-pixel-star-xs" alt="" />` 
                  : `<img src="${ASSETS.icons.sparkle}" class="badge-pixel-star-xs" alt="" />`)}</span>
            </div>
            <div class="cust-badges-row">
              ${queueBadge}
              ${ord.isVip ? `<span class="cust-badge vip-gold-badge"><img src="${ASSETS.icons.star}" class="badge-pixel-star-xs" alt="" /> KHÁCH SỘP</span>` : ''}
              <span class="cust-badge ${visual.badgeClass}">${visual.badge}</span>
              ${ord.personalityLabel ? `<span class="cust-badge trait-badge" title="${escapeHtml(ord.personalityDesc || '')}">${escapeHtml(ord.personalityLabel)}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Speech Bubble Order / Wooden Order Ticket -->
        <div class="speech-bubble wooden-order-ticket ${hasMatchInTray ? 'has-match' : ''}" data-order-id="${ord.id}" title="${hasMatchInTray ? 'Khay đã sẵn món! Chạm để lên món ngay.' : 'Phiếu Order Khách Hàng'}">
          <div class="bubble-arrow"></div>
          ${itemsHtml}
        </div>

        <!-- Patience Bar -->
        <div class="patience-container">
          <div class="patience-bar">
            <div class="patience-fill ${patienceColorClass}" style="width: ${patiencePercent}%;"></div>
          </div>
        </div>

        <!-- Actions Row: Lên món nhanh & Hủy đơn xin lỗi -->
        <div class="cust-card-actions">
          ${hasMatchInTray ? `
            <button class="btn-serve-cust" data-order-id="${ord.id}" title="Khay đã có món, lên món ngay cho khách này">
              <img src="${ASSETS.icons.bell}" class="btn-pixel-icon-sm" alt="" /> LÊN MÓN
            </button>
          ` : ''}
          <button class="btn-cancel-order" data-order-id="${ord.id}" title="Hết món/nguyên liệu, hủy đơn và xin lỗi khách">
            <img src="${ASSETS.icons.trash}" class="btn-pixel-icon-sm" alt="" /> Hết món · Xin lỗi
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Fryer Pot State
  const cookState = cookingEngine.getCookState();
  const quality = cookingEngine.calculateCurrentQuality();
  const oilCondition = state.oilCondition;

  const drinkStock = state.inventory.soft_drink?.amount ?? 0;

  const potProgressPercent = Math.min(100, Math.round(cookState.progress));
  const oilLabel = oilCondition === 'clean' ? 'Vàng óng' : oilCondition === 'medium' ? 'Nâu sẫm' : 'Đen khét';

  // Render food in pan: hiển thị đúng asset của từng loại món (gà giòn, má đùi cay, khoai lắc, gà viên, phô mai que)
  let panFoodHtml = '';
  if (cookState.isFrying) {
    let foodImg = ASSETS.food.crispyChickenPerfect;
    let foodLabel = '🍗 GÀ RÁN';

    if (cookState.fryingType === 'thigh') {
      foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepThighRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.spicyThigh;
      foodLabel = '🍗 MÁ ĐÙI CAY';
    } else if (cookState.fryingType === 'fries') {
      foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepFriesRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.shakeFries;
      foodLabel = '🍟 KHOAI LẮC';
    } else if (cookState.fryingType === 'popcorn') {
      foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepPopcornRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.popcornChicken;
      foodLabel = '🍿 GÀ VIÊN';
    } else if (cookState.fryingType === 'cheese') {
      foodImg = quality === 'raw' ? ASSETS.kitchen.gnPrepCheeseStickRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.cheeseStick;
      foodLabel = '🧀 PHÔ MAI QUE';
    } else {
      foodImg = quality === 'raw' ? ASSETS.food.crispyChickenRaw : quality === 'burnt' ? ASSETS.food.crispyChickenBurnt : ASSETS.food.crispyChickenPerfect;
      foodLabel = '🍗 GÀ GIÒN';
    }

    const qualityTag = quality === 'perfect' ? '⭐ VÀNG GIÒN' : quality === 'burnt' ? '💥 CHÁY KHÉT' : quality === 'good' ? 'VỪA CHÍN' : 'SỐNG';

    panFoodHtml = `
      <div class="frying-food-item ${quality} sizzle-active">
        <img src="${foodImg}" alt="${foodLabel}" class="food-pan-img" />
        <div class="food-status-badge ${quality}">${foodLabel} · ${qualityTag}</div>
        ${quality === 'perfect' ? '<div class="perfect-sparkles">✨</div>' : ''}
        ${quality === 'burnt' ? '<div class="burnt-smoke-puff">💨</div>' : ''}
      </div>
    `;
  } else {
    panFoodHtml = `
      <div class="pot-idle-view">
        <img src="${ASSETS.icons.pan}" class="pan-big-pixel-img" alt="🍳" />
        <div class="pan-idle-text">Chảo dầu sôi 180°C sẵn sàng</div>
      </div>
    `;
  }

  // Tray HTML
  const traySlotsHtml = Array.from({ length: cookingEngine.getTraySize() }, (_, i) => i).map(slotIdx => {
    const item = tray[slotIdx];
    if (item) {
      const isDrink = item.menuItemId === 'soda' || item.menuItemId === 'seven_up' || item.menuItemId === 'fanta_orange';
      const img = foodImage(item.menuItemId, item.quality);
      const qClass = isDrink ? 'good' : item.quality;
      const drinkTag = item.menuItemId === 'soda'
        ? '🔴 COCA ĐÁ ❄️'
        : item.menuItemId === 'seven_up'
        ? '🟢 7UP CHANH ❄️'
        : item.menuItemId === 'fanta_orange'
        ? '🟠 FANTA CAM ❄️'
        : 'ƯỚP LẠNH ❄️';
      const qText = isDrink ? drinkTag : TRAY_QUALITY_LABEL[item.quality];
      const condimentHtml = item.condiment === 'ketchup'
        ? `<span class="tray-condiment-tag ketchup"><img src="${ASSETS.icons.sauce}" class="btn-pixel-icon-xs" alt="" /> Tương Cà</span>`
        : item.condiment === 'chili'
        ? `<span class="tray-condiment-tag chili"><img src="${ASSETS.icons.chickenSpicy}" class="btn-pixel-icon-xs" alt="" /> Tương Ớt</span>`
        : '';
      const drinkClass = item.menuItemId === 'soda' ? 'drink-coca' : item.menuItemId === 'seven_up' ? 'drink-7up' : item.menuItemId === 'fanta_orange' ? 'drink-fanta' : '';
      return `
        <div class="tray-item ${drinkClass}" data-tray-idx="${slotIdx}" title="Bấm để vớt hoặc vứt">
          <div class="tray-food-frame">
            ${img ? `<img class="t-icon t-img" src="${img}" alt="${item.name}" width="52" height="52" />` : `<span class="t-icon">${item.icon}</span>`}
            ${condimentHtml}
          </div>
          <span class="t-name">${item.name}</span>
          <span class="t-quality ${qClass}">${qText}</span>
        </div>
      `;
    }
    return `
      <div class="tray-slot-empty">
        <span class="empty-wire-icon">▤</span>
        <span class="empty-wire-label">Vỉ ráo dầu</span>
      </div>
    `;
  }).join('');

  return `
    <div class="selling-screen">
      <!-- Floating Money Layer -->
      <div id="floating-money-layer" class="floating-money-layer"></div>

      <!-- HUD Time & Sài Gòn Ambience -->
      <div class="kitchen-hud">
        <div class="clock">
          <img src="${ASSETS.icons.clock}" class="hud-pixel-icon" alt="" />
          <span>Giờ mở bán: <b>${formattedTime}</b></span>
        </div>
        ${rush ? `<span class="rush-badge"><img src="${ASSETS.icons.fireRush}" class="hud-pixel-icon" alt="" /> CA CAO ĐIỂM!</span>` : `<span class="session-ambience">${timePeriodLabel}</span>`}
        ${state.secretSauceDay?.buffActive ? `<span class="sauce-buff-hud-badge" title="Sốt Bí Truyền đang kích hoạt: +3k tip mỗi đơn!"><img src="${ASSETS.icons.sauce}" class="hud-pixel-icon" alt="" /> Sốt Vàng</span>` : ''}
        <div class="hud-actions">
          <button id="btn-toggle-fast" class="btn-sm btn-toggle-fast">
            ${session.isFastForward ? '⏩ Tua x2' : '▶️ 1x'}
          </button>
        </div>
      </div>

      <!-- DẢI BẦU KHÔNG KHÍ THỜI TIẾT SÀI GÒN ĐỘNG -->
      ${renderWeatherAtmosphereStrip(getWeatherForDay(state.day))}

      <!-- THIEF ALERT BANNER (Tên Trộm Đang Rình Mò Trong Quán) -->
      ${session.activeThief && !session.activeThief.isCaught && !session.activeThief.isEscaped ? `
        <div id="btn-open-thief-bust" class="thief-alert-strip" style="background: linear-gradient(135deg, #b91c1c, #991b1b); color: #fff; padding: 7px 10px; margin: 4px 6px; border-radius: 8px; border: 2px solid #f87171; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(220,38,38,0.4); cursor: pointer; animation: pulse 1s infinite;">
          <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
            <img src="${session.activeThief.disguiseAvatar}" style="width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid #fef08a; object-fit: contain; background: #fff;" alt="" />
            <div style="min-width: 0;">
              <div style="font-size: 0.76rem; font-weight: 900; color: #fef08a; display: flex; align-items: center; gap: 4px;">
                <span>🚨 KẺ GIAN ĐÓNG GIẢ: "${escapeHtml(session.activeThief.disguiseName)}"</span>
              </div>
              <div style="font-size: 0.65rem; color: #fecaca; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                Đang rình Bàn ${session.activeThief.targetTable} (${escapeHtml(session.activeThief.targetCustomerName)})!
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span id="thief-banner-time" style="font-size: 0.72rem; font-weight: 800; background: #7f1d1d; color: #fef08a; padding: 2px 6px; border-radius: 4px; border: 1px solid #ef4444; white-space: nowrap;">
              ⏳ ${Math.ceil(session.activeThief.timeRemaining)}s
            </span>
            <button class="btn-sm" style="padding: 4px 8px; font-size: 0.7rem; font-weight: 900; background: #fbbf24; color: #78350f; border: 1px solid #d97706; border-radius: 5px; cursor: pointer; white-space: nowrap;">
              ✋ BẮT NGAY!
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Customer Queue Lane (Khách vào/ra quán) -->
      <div class="customer-lane">
        ${(session.orders.length > 0 || (session.departingCustomers && session.departingCustomers.length > 0)) ? `${departingCardsHtml}${customerCardsHtml}` : (
          (session.disruptionTimerSec ?? 0) > 0 ? `
            <div class="empty-queue disruption-alert" style="background: #fff1f0; border: 1.5px solid #ff4d4f; color: #cf1322; padding: 12px 14px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(255,77,79,0.15);">
              <div style="font-weight: 800; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>💥</span> <span>QUÁN ĐANG HỖN LOẠN: KHÁCH CHẠY HẾT!</span>
              </div>
              <div style="font-size: 0.78rem; margin-top: 4px; color: #595959;">
                Giang hồ vừa quậy phá! Đang dọn dẹp bàn ghế và trấn an bà con lối xóm...
              </div>
              <div style="margin-top: 6px; font-weight: 800; font-size: 0.85rem; color: #d4380d;">
                ⏳ Chờ lứa khách mới sau: <b>${Math.ceil(session.disruptionTimerSec ?? 0)}s</b> 🧹
              </div>
            </div>
          ` : '<div class="empty-queue">🍗 Mùi gà thơm phức bay khắp hẻm... Khách đang tấp nập tới! 🏃</div>'
        )}
      </div>

      <!-- Wood Kitchen Counter (Quầy Bếp Gỗ Chiên Gà) -->
      <div class="kitchen-counter">
        <div class="kitchen-counter-topbar">
          <div class="counter-brand">
            <img src="${ASSETS.icons.pan}" class="pixel-section-icon" alt="" />
            <span>QUẦY BẾP HẺM 1102</span>
          </div>
          ${renderStaffCornerCard(state, session)}
        </div>

        <div class="work-grid">
          <!-- Real Cast Iron Fryer Card (Bếp Chiên Ngập Dầu Chợ Lớn) -->
          <div class="fryer-card">
            <!-- Hướng Dẫn Công Thức Sốt Trực Quan Cho Gà Rán -->
            <div class="sauce-recipe-banner ${cookingEngine.getActiveSeasoning() ? 'active ' + cookingEngine.getActiveSeasoning() : ''}">
              ${cookingEngine.getActiveSeasoning() === 'spicy' ? `
                <span class="recipe-hint-badge spicy">🌶️ ĐÃ ƯỚP SỐT CAY! ➔ Chạm [Gà Tẩm Bột] để chiên mẻ Gà Sốt Cay!</span>
                <span class="cancel-sauce-hint">(Chạm lại khay sốt để hủy)</span>
              ` : cookingEngine.getActiveSeasoning() === 'honey' ? `
                <span class="recipe-hint-badge honey">🧄 ĐÃ ƯỚP BƠ TỎI! ➔ Chạm [Gà Tẩm Bột] để chiên Gà Bơ Tỏi Đậu Nành!</span>
                <span class="cancel-sauce-hint">(Chạm lại khay sốt để hủy)</span>
              ` : `
                <span class="recipe-hint-badge">💡 MẸO SỐT: Chạm [🌶️ Sốt Cay / 🧄 Bơ Tỏi] ➔ Thả [🍗 Gà Bột] = Gà Sốt!</span>
              `}
            </div>

            <!-- Kệ Topping & Nguyên Liệu Tươi Cố Định Tại Chỗ (Docked Materials) -->
            <div class="prep-baskets-section docked-materials">
              <div class="prep-baskets-header">
                <span class="prep-baskets-title">
                  <img src="${ASSETS.icons.inventory}" class="pixel-section-icon" alt="" /> Khay Sơ Chế GN
                </span>
                <span class="prep-baskets-sub">Chạm để thả chảo hoặc ướp sốt</span>
              </div>
              ${renderPrepStation(state)}
              <!-- Hai chai tương xịt lên món trong khay -->
              <div class="food-shelf-grid prep-bottles">
                <!-- Slot 4: Chai Tương Cà -->
                <button id="btn-squeeze-ketchup" class="shelf-tile condiment ketchup" title="Xịt Tương Cà đỏ tươi thơm ngọt lên món (+Tip & Hương vị)">
                  <div class="shelf-badge sauce">+Tip</div>
                  <img src="${ASSETS.kitchen.bottleKetchup}" alt="Tương Cà" class="shelf-img bottle" />
                  <span class="shelf-label">Tương Cà</span>
                </button>

                <!-- Slot 5: Chai Tương Ớt -->
                <button id="btn-squeeze-chili" class="shelf-tile condiment chili" title="Xịt Tương Ớt cay nồng giòn rụm lên món (+Tip & Hương vị)">
                  <div class="shelf-badge sauce">+Tip</div>
                  <img src="${ASSETS.kitchen.bottleChili}" alt="Tương Ớt" class="shelf-img bottle" />
                  <span class="shelf-label">Tương Ớt</span>
                </button>
              </div>
            </div>

            <div class="fryer-header">
              <span class="fryer-title">
                <img src="${ASSETS.icons.bell}" class="pixel-card-title-icon" alt="" /> Bếp Chiên
              </span>
              <button id="btn-change-oil" class="oil-change-btn ${oilCondition === 'dirty' ? 'dirty-alert' : ''}" title="Dầu: ${oilLabel} - Chạm để thay chảo mới (150.000đ)">
                <span class="oil-dot ${oilCondition}"></span>
                <span class="oil-status-label">${oilLabel}</span>
                <span class="oil-sep">|</span>
                <img src="${ASSETS.icons.oilCan}" class="btn-pixel-icon-xs" alt="" />
                <span>150k</span>
              </button>
            </div>

            <!-- The Boiling Pot with Real Food Asset -->
            <div id="btn-fry-pot" class="fry-pot ${'oil-' + oilCondition} ${cookState.isFrying && quality === 'perfect' ? 'perfect-glow' : ''} ${session.perfectStreak >= 2 ? 'streak-fire' : ''}">
              <div class="bubble" style="left: 15%; animation-delay: 0s;"></div>
              <div class="bubble" style="left: 38%; animation-delay: 0.3s;"></div>
              <div class="bubble" style="left: 65%; animation-delay: 0.6s;"></div>
              <div class="bubble" style="left: 82%; animation-delay: 0.9s;"></div>
              
              <div class="pot-chicken">
                ${panFoodHtml}
              </div>
              <div class="pot-hint">${potHint()}</div>
            </div>

            <!-- Perfect Streak Flame Banner -->
            <div class="streak-flame-container" id="streak-flame-container" data-streak="${session.perfectStreak || 0}">
              ${session.perfectStreak >= 2 ? `
                <div class="streak-flame ${session.perfectStreak >= 5 ? 'super-fire' : ''}" data-streak="${session.perfectStreak}">
                  <span class="flame-icon">🔥</span>
                  <span class="streak-count">Chuỗi x${session.perfectStreak} PERFECT!</span>
                  <span class="streak-bonus">${streakTipLabel(session.perfectStreak)}</span>
                </div>
              ` : ''}
            </div>

            <!-- Cooking Progress Gauge -->
            <div class="cook-gauge-container">
              <div class="gauge-labels">
                <span class="gauge-label-raw">SỐNG</span>
                <span class="gauge-label-perfect">VÀNG GIÒN (PERFECT)</span>
                <span class="gauge-label-burnt">CHÁY</span>
              </div>
              <div class="cook-gauge">
                <div class="cook-gauge-zones">
                  <div class="zone-raw"></div>
                  <div class="zone-good"></div>
                  <div class="zone-perfect"></div>
                  <div class="zone-good"></div>
                  <div class="zone-burnt"></div>
                </div>
                <div class="cook-gauge-pointer" style="left: ${potProgressPercent}%;"></div>
              </div>
            </div>
          </div>

          <!-- Tray & Assemble Card (Quầy Giữ Nhiệt Giòn Tan) -->
          <div class="assemble-card">
            <div class="tray-title">
              <span><img src="${ASSETS.icons.book}" class="pixel-section-icon" alt="" /> Khay (${tray.length}/${cookingEngine.getTraySize()})</span>
            </div>

            <div class="tray-slots">
              ${traySlotsHtml}
            </div>

            <!-- Quầy Máy Rót Nước Đa Vị & Hiệu Ứng Đổ Đầy Cốc Nước -->
            <div class="fountain-station">
              <div class="fountain-header">
                <span class="fountain-title"><img src="${ASSETS.food.soda}" class="pixel-section-icon" alt="" /> Máy Rót Nước</span>
                <span class="fountain-stock">Kho: <b>${drinkStock}</b></span>
              </div>

              <!-- Khu vực mô phỏng dòng nước rót và cốc dâng đầy nước -->
              <div class="fountain-pour-stage" id="fountain-pour-stage">
                <div class="fountain-nozzle-row">
                  <div class="nozzle-tap tap-coca" title="Vòi Coca"></div>
                  <div class="nozzle-tap tap-7up" title="Vòi 7Up"></div>
                  <div class="nozzle-tap tap-fanta" title="Vòi Fanta"></div>
                </div>
                <div class="pour-stream-line" id="pour-stream-line"></div>
                <div class="glass-cup-wrap" id="glass-cup-wrap">
                  <div class="glass-cup-rim"></div>
                  <div class="glass-cup-body">
                    <div class="cup-ice-cube ice-1">🧊</div>
                    <div class="cup-ice-cube ice-2">🧊</div>
                    <div class="cup-liquid-fill" id="cup-liquid-fill">
                      <div class="liquid-foam"></div>
                      <div class="soda-bubble b1"></div>
                      <div class="soda-bubble b2"></div>
                      <div class="soda-bubble b3"></div>
                    </div>
                  </div>
                  <span class="glass-cup-label" id="glass-cup-label">💧 Chạm vòi để rót</span>
                </div>
              </div>

              <!-- Hàng 3 vòi bấm rót nước đa vị -->
              <div class="fountain-taps-grid">
                <button id="btn-add-drink" class="fountain-tap-btn tap-coca" data-action="pour-coca" title="Rót đầy một cốc Coca-Cola sủi bọt caramel mát lạnh">
                  <div class="tap-badge">🔴 Cola</div>
                  <img src="${ASSETS.food.soda}" alt="Coca-Cola" class="tap-cup-img" />
                  <span class="tap-name">Cola</span>
                </button>

                <button id="btn-pour-7up" class="fountain-tap-btn tap-7up" data-action="pour-7up" title="Rót đầy một cốc 7Up Chanh đá mát lạnh">
                  <div class="tap-badge">🟢 7Up</div>
                  <img src="${ASSETS.food.sevenUp}" alt="7Up Chanh" class="tap-cup-img" />
                  <span class="tap-name">7Up</span>
                </button>

                <button id="btn-pour-fanta" class="fountain-tap-btn tap-fanta" data-action="pour-fanta" title="Rót đầy một cốc Fanta Cam bùng nổ hương vị">
                  <div class="tap-badge">🟠 Fanta</div>
                  <img src="${ASSETS.food.fantaOrange}" alt="Fanta Cam" class="tap-cup-img" />
                  <span class="tap-name">Fanta</span>
                </button>
              </div>
            </div>

            ${renderStationStrip(state, session)}

            <!-- Serve Button -->
            <button id="btn-serve-order" class="btn-serve" ${session.orders.length === 0 || tray.length === 0 ? 'disabled' : ''}>
              <img src="${ASSETS.icons.bell}" class="btn-pixel-icon-lg" alt="" /> KENG! LÊN MÓN (SERVE)
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Street Ticker Rail (Băng Tin LED Đáy Quán) -->
      <div id="selling-ticker-rail" class="selling-ticker-rail">
        <div class="ticker-content">
          <span class="ticker-dot">●</span>
          <span id="ticker-live-text" class="ticker-text">Hẻm 1102: Mùi gà rán thơm giòn nức mũi • Khách đang tấp nập ghé tiệm • Chúc bà con ngon miệng!</span>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Dải trạm nấu mở theo chương: nồi mì, lò bánh, bàn ráp, máy nước (luật ở core/stations.ts + core/day.ts)
// ---------------------------------------------------------------------------
const TIMER_LABEL: Record<TimerStationId, { idle: string; ready: string }> = {
  noodle: { idle: 'Trụng mì', ready: 'Vớt mì!' },
  oven: { idle: 'Nướng bánh', ready: 'Lấy bánh!' }
};

function openDrinks(state: GameState): DrinkId[] {
  return (Object.keys(DRINK_RECIPES) as DrinkId[])
    .filter(id => id !== 'soda' && id !== 'seven_up' && stationOpen(state, DRINK_RECIPES[id].chapter, [DRINK_RECIPES[id].stock]));
}
function openTimers(state: GameState): TimerStationId[] {
  return (Object.keys(TIMER_RECIPES) as TimerStationId[]).filter(id => stationOpen(state, TIMER_RECIPES[id].chapter, TIMER_RECIPES[id].stock));
}
function openAssembly(state: GameState): AssemblyId[] {
  return (Object.keys(ASSEMBLY_RECIPES) as AssemblyId[]).filter(id => stationOpen(state, ASSEMBLY_RECIPES[id].chapter, ASSEMBLY_RECIPES[id].stock));
}

function stationStripKey(state: GameState, session: SellingSession): string {
  const tray = cookingEngine.getTray();
  return [
    openDrinks(state).join(','),
    openTimers(state).map(id => `${id}:${timerPhase(TIMER_RECIPES[id], session.timers[id])}`).join(','),
    openAssembly(state).map(id => `${id}:${assemblyBaseIndex(tray, ASSEMBLY_RECIPES[id]) >= 0}`).join(',')
  ].join('|');
}

function renderStationStrip(state: GameState, session: SellingSession): string {
  const tray = cookingEngine.getTray();
  const buttons = [
    ...openTimers(state).map(id => {
      const r = TIMER_RECIPES[id];
      const phase = timerPhase(r, session.timers[id]);
      const label = phase === 'idle' ? TIMER_LABEL[id].idle : phase === 'cooking' ? 'Đang nấu' : phase === 'ready' ? TIMER_LABEL[id].ready : 'Hỏng rồi! Dọn';
      return `<button id="btn-timer-${id}" class="btn-sm station-btn timer-${phase}" ${phase === 'cooking' ? 'disabled' : ''}>
        ${r.icon} ${label} <small class="timer-progress" data-timer="${id}"></small></button>`;
    }),
    ...openAssembly(state).map(id => {
      const r = ASSEMBLY_RECIPES[id];
      const ready = assemblyBaseIndex(tray, r) >= 0;
      return `<button id="btn-assemble-${id}" class="btn-sm station-btn" ${ready ? '' : 'disabled'} title="Cần ${r.base === 'crispy_chicken' ? 'Gà Giòn' : 'Gà Sốt Cay'} trong khay">${r.icon} Ráp ${r.name.split(' ')[0]}</button>`;
    }),
    ...openDrinks(state).map(id => `<button id="btn-drink-${id}" class="btn-sm station-btn">${DRINK_RECIPES[id].icon} ${DRINK_RECIPES[id].label}</button>`)
  ];
  if (buttons.length === 0) return '';
  return `<div class="station-strip">${buttons.join('')}</div>`;
}

// ---------------------------------------------------------------------------
// Dải nhân viên: hiển thị trực quan toàn bộ đội ngũ nhân sự trực chiến và trạng thái realtime
// ---------------------------------------------------------------------------
function staffStripKey(state: GameState, session: SellingSession): string {
  return state.staff.map(m => `${m.id}-${m.mood}`).join(',') + '|' + (session.helpers ?? []).map(h => h?.menuItemId ?? '-').join(',');
}

export function renderStaffStrip(state: GameState, session: SellingSession): string {
  if (state.staff.length === 0) return '';
  const eff = staffEffects(state.staff, session.gameHour);
  let cookIndex = 0;

  const chips = state.staff.map(member => {
    const roleIconMap: Record<string, string> = {
      cook: '👨‍🍳',
      waiter: '🧹',
      cashier: '💰',
      delivery: '🛵',
      manager: '👔',
      security: '🛡️'
    };
    const roleIcon = roleIconMap[member.role] || '👤';
    const modelSrc = staffImage(member);
    const fallbackSrc = staffImage({ role: member.role, rarity: member.rarity });
    const shortName = member.name.split(' ')[0] || member.name;
    const rarityClass = member.rarity ? `rarity-${member.rarity}` : '';

    let actionHtml = '';
    let isBusy = false;

    if (member.role === 'cook') {
      const slot = session.helpers?.[cookIndex];
      if (slot) {
        isBusy = true;
        const fryIcon = FRY_ICON[slot.menuItemId] ?? '🍗';
        actionHtml = `<span class="staff-action busy">${fryIcon} Chiên <b class="helper-progress" data-helper="${cookIndex}">0%</b></span>`;
      } else {
        actionHtml = `<span class="staff-action idle">Chờ chảo</span>`;
      }
      cookIndex++;
    } else if (member.role === 'waiter') {
      actionHtml = `<span class="staff-action waiter">Rót nước & dọn khay</span>`;
    } else if (member.role === 'cashier') {
      actionHtml = `<span class="staff-action cashier">Tươi cười (+Tip)</span>`;
    } else if (member.role === 'delivery') {
      actionHtml = `<span class="staff-action delivery">Giảm phí App</span>`;
    } else if (member.role === 'manager') {
      actionHtml = `<span class="staff-action manager">+20% Tốc độ</span>`;
    } else if (member.role === 'security') {
      actionHtml = `<span class="staff-action security">Canh xe an toàn</span>`;
    }

    return `
      <div class="staff-chip ${isBusy ? 'busy' : ''} ${rarityClass}" title="${roleIcon} ${member.name} (${member.title || member.role})">
        <div class="staff-chip-avatar">
          <img src="${modelSrc}" alt="${member.name}" class="staff-chip-img" onerror="this.onerror=null;this.src='${fallbackSrc}';"/>
        </div>
        <div class="staff-chip-info">
          <span class="staff-chip-name">${shortName}</span>
          ${actionHtml}
        </div>
      </div>
    `;
  });

  // Nếu có robot chiên từ Bếp cấp 6
  const robot = eff.cooks.find(c => c.staffId === 'robot');
  if (robot) {
    const slot = session.helpers?.[cookIndex];
    chips.push(`
      <div class="staff-chip ${slot ? 'busy' : ''} rarity-SSR" title="Robot Chiên Tự Động">
        <div class="staff-chip-avatar">🤖</div>
        <div class="staff-chip-info">
          <span class="staff-chip-name">Robot</span>
          ${slot ? `<span class="staff-action busy">🍗 <b class="helper-progress" data-helper="${cookIndex}">0%</b></span>` : '<span class="staff-action idle">Chờ mẻ</span>'}
        </div>
      </div>
    `);
  }

  if (chips.length === 0) return '';
  return `<div class="staff-strip">${chips.join('')}</div>`;
}

// ---------------------------------------------------------------------------
// Card bo tròn nhân viên trên góc quầy bếp: nhỏ gọn, tinh tế, tiết kiệm không gian
// ---------------------------------------------------------------------------
export function renderStaffCornerCard(state: GameState, session: SellingSession): string {
  if (state.staff.length === 0) return '';
  const eff = staffEffects(state.staff, session.gameHour);
  const totalStaff = state.staff.length;
  let helperStatusHtml = '';

  const avatarBadges = state.staff.slice(0, 3).map((m, idx) => {
    const modelSrc = staffImage(m);
    const fallbackSrc = staffImage({ role: m.role, rarity: m.rarity });
    return `
      <div class="staff-corner-avatar" style="z-index: ${10 - idx};" title="${escapeHtml(m.name)} (${m.role})">
        <img src="${modelSrc}" alt="${escapeHtml(m.name)}" onerror="this.onerror=null;this.src='${fallbackSrc}';" />
      </div>
    `;
  }).join('');

  const firstCook = eff.cooks[0];
  if (firstCook) {
    const slot = session.helpers?.[0];
    if (slot) {
      const fryIcon = FRY_ICON[slot.menuItemId] ?? '🍗';
      helperStatusHtml = `<span class="staff-corner-status busy">${fryIcon} Chiên <b class="helper-progress" data-helper="0">0%</b></span>`;
    } else {
      helperStatusHtml = `<span class="staff-corner-status idle">👨‍🍳 Trực chiến</span>`;
    }
  } else {
    helperStatusHtml = `<span class="staff-corner-status">${totalStaff} NV</span>`;
  }

  const teamTooltip = state.staff.map(m => `${m.name} (${m.role})`).join(' • ');

  return `
    <div class="staff-corner-card" title="Đội ngũ nhân sự trực chiến: ${escapeHtml(teamTooltip)}">
      <div class="staff-corner-avatars-stack">
        ${avatarBadges}
        ${totalStaff > 3 ? `<span class="staff-corner-more">+${totalStaff - 3}</span>` : ''}
      </div>
      <div class="staff-corner-meta">
        ${helperStatusHtml}
      </div>
    </div>
  `;
}

const FRY_ICON: Record<string, string> = { crispy_chicken: '🍗', spicy_chicken: '🌶️', honey_garlic_chicken: '🍯', shake_fries: '🍟', popcorn_chicken: '🍿' };

