import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { renderInventoryTab, bindInventoryEvents, getDraftCart, resetDraftCart } from '../src/ui/components/InventoryTab';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));
beforeEach(() => resetDraftCart());

// Lightweight DOM mock for Vitest Node environment
class MockNode {
  tagName: string;
  attributes: Record<string, string> = {};
  listeners: Record<string, ((e: any) => void)[]> = {};
  children: MockNode[] = [];
  innerHTML: string = '';
  textContent: string = '';
  style: Record<string, string> = {};
  disabled: boolean = false;
  classList = {
    classes: new Set<string>(),
    add: (c: string) => this.classList.classes.add(c),
    remove: (c: string) => this.classList.classes.delete(c),
    contains: (c: string) => this.classList.classes.has(c),
  };

  constructor(tagName: string) {
    this.tagName = tagName;
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null;
  }

  setAttribute(name: string, val: string) {
    this.attributes[name] = val;
  }

  hasAttribute(name: string): boolean {
    return name in this.attributes;
  }

  addEventListener(event: string, fn: (e: any) => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
  }

  click() {
    const handlers = this.listeners['click'] || [];
    for (const h of handlers) {
      h({
        preventDefault() {},
        currentTarget: this
      });
    }
  }
}

describe('InventoryTab HTML render & click interaction', () => {
  it('renderInventoryTab sinh HTML chứa đúng giá sỉ đã giảm, quầy thanh toán xấp tiền và các nút +5, +10, -5', () => {
    const state = createInitialState();
    state.todayMarketBargained = true;
    state.todayMarketDiscount = 20; // Giảm 20%
    const chickenBase = state.inventory.chicken_meat.cost; // 14.000
    const discounted = Math.round(chickenBase * 0.8); // 11.200

    const html = renderInventoryTab(state);

    // Chứa thông tin sỉ đúng 11.200đ
    expect(html).toContain('11.200đ');
    expect(html).toContain('(-20%)');
    expect(html).toContain('data-id="chicken_meat"');
    expect(html).toContain('data-qty="5"');
    expect(html).toContain('data-qty="10"');
    expect(html).toContain('class="btn-sm btn-refund');
    expect(html).toContain('inv-cash-checkout-banner');
    expect(html).toContain('btn-inventory-cash-checkout');
  });

  it('bindInventoryEvents: Lên đơn giỏ hàng dự kiến, bấm thanh toán xấp tiền trừ tiền 1 lần và hoàn trả kho', () => {
    const state = createInitialState();
    const initialMoney = state.money;
    const initialChicken = state.inventory.chicken_meat.amount; // 8

    // Giả lập mock buttons
    const buy5Btn = new MockNode('BUTTON');
    buy5Btn.setAttribute('class', 'btn-sm btn-buy');
    buy5Btn.setAttribute('data-id', 'chicken_meat');
    buy5Btn.setAttribute('data-qty', '5');

    const refund5Btn = new MockNode('BUTTON');
    refund5Btn.setAttribute('class', 'btn-sm btn-refund btn-refund-chicken_meat');
    refund5Btn.setAttribute('data-id', 'chicken_meat');
    refund5Btn.setAttribute('data-qty', '5');

    const checkoutBtn = new MockNode('BUTTON');
    checkoutBtn.setAttribute('id', 'btn-inventory-cash-checkout');

    const resetBtn = new MockNode('BUTTON');
    resetBtn.setAttribute('id', 'btn-reset-draft-cart');

    const bannerEl = new MockNode('DIV');
    bannerEl.setAttribute('id', 'inv-cash-checkout-banner');

    const statusTextEl = new MockNode('DIV');
    statusTextEl.setAttribute('id', 'inv-checkout-status-text');

    const labelEl = new MockNode('SPAN');
    labelEl.setAttribute('id', 'btn-cash-checkout-label');

    // Mock document
    (globalThis as any).document = {
      getElementById: (id: string) => {
        if (id === 'btn-inventory-cash-checkout') return checkoutBtn;
        if (id === 'btn-reset-draft-cart') return resetBtn;
        if (id === 'inv-cash-checkout-banner') return bannerEl;
        if (id === 'inv-checkout-status-text') return statusTextEl;
        if (id === 'btn-cash-checkout-label') return labelEl;
        return null;
      },
      querySelectorAll: (sel: string) => {
        if (sel.includes('.btn-buy')) return [buy5Btn];
        if (sel.includes('.btn-refund')) return [refund5Btn];
        if (sel.includes('.btn-unlock')) return [];
        return [];
      },
      querySelector: (sel: string) => null,
    };

    let toastMsg = '';
    bindInventoryEvents(
      state,
      fn => fn(state),
      msg => { toastMsg = msg; }
    );

    // 1. Click +5: Chưa trừ tiền ngay, ghi nhận vào giỏ hàng dự kiến
    buy5Btn.click();
    expect(getDraftCart().chicken_meat).toBe(5);
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken); // Chưa nhập kho
    expect(state.money).toBe(initialMoney); // Chưa trừ tiền
    expect(toastMsg).toContain('Đã chọn +5');

    // 2. Click -5 khi đang có trong giỏ dự kiến: Bớt số lượng giỏ dự kiến
    refund5Btn.click();
    expect(getDraftCart().chicken_meat).toBeUndefined(); // Đã bớt hết về 0
    expect(toastMsg).toContain('Đã bớt 5');

    // 3. Chọn lại +5 và bấm Nút Thanh Toán Xấp Tiền
    buy5Btn.click();
    expect(getDraftCart().chicken_meat).toBe(5);

    checkoutBtn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken + 5); // Đã nhập kho
    expect(state.money).toBe(initialMoney - 14000 * 5); // Đã trừ tiền 1 lần
    expect(toastMsg).toContain('ĐÃ THANH TOÁN');
    expect(getDraftCart().chicken_meat).toBeUndefined(); // Giỏ đã được reset về 0

    // 4. Click -5 sau khi đã nhập kho hôm nay: Hoàn vốn 5 miếng vừa mua
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(state.money).toBe(initialMoney);
    expect(toastMsg).toContain('Đã trả lại 5');

    // 5. Click -5 lần nữa khi không còn hàng mua hôm nay: Báo toast từ chối, không trừ tiền
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(toastMsg).toContain('Chỉ đổi trả được hàng vừa nhập hôm nay');
  });

  it('Nút đặt lại (Reset) xóa sạch giỏ hàng dự kiến', () => {
    const state = createInitialState();

    const buy5Btn = new MockNode('BUTTON');
    buy5Btn.setAttribute('class', 'btn-sm btn-buy');
    buy5Btn.setAttribute('data-id', 'chicken_meat');
    buy5Btn.setAttribute('data-qty', '5');

    const resetBtn = new MockNode('BUTTON');
    resetBtn.setAttribute('id', 'btn-reset-draft-cart');

    (globalThis as any).document = {
      getElementById: (id: string) => {
        if (id === 'btn-reset-draft-cart') return resetBtn;
        return null;
      },
      querySelectorAll: (sel: string) => {
        if (sel.includes('.btn-buy')) return [buy5Btn];
        return [];
      },
      querySelector: () => null,
    };

    let toastMsg = '';
    bindInventoryEvents(state, fn => fn(state), msg => { toastMsg = msg; });

    buy5Btn.click();
    expect(getDraftCart().chicken_meat).toBe(5);

    resetBtn.click();
    expect(getDraftCart().chicken_meat).toBeUndefined();
    expect(toastMsg).toContain('Đã xóa đơn hàng dự kiến');
  });
});
