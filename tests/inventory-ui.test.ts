import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createInitialState } from '../src/core/state';
import { renderInventoryTab, bindInventoryEvents } from '../src/ui/components/InventoryTab';
import { audio } from '../src/core/audio';

beforeAll(() => audio.setMuted(true));

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
  it('renderInventoryTab sinh HTML chứa đúng giá sỉ đã giảm và các nút mua +5, +10, -5 trực tiếp', () => {
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
  });

  it('bindInventoryEvents: Mua trực tiếp +5 trừ tiền ngay và hoàn tiền -5 trực tiếp', () => {
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

    (globalThis as any).document = {
      getElementById: () => null,
      querySelectorAll: (sel: string) => {
        if (sel.includes('.btn-buy')) return [buy5Btn];
        if (sel.includes('.btn-refund')) return [refund5Btn];
        if (sel.includes('.btn-unlock')) return [];
        return [];
      },
      querySelector: () => null,
    };

    let toastMsg = '';
    bindInventoryEvents(
      state,
      fn => fn(state),
      msg => { toastMsg = msg; }
    );

    // 1. Click +5: Trực tiếp nhập kho và trừ tiền ngay lập tức
    buy5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken + 5);
    expect(state.money).toBe(initialMoney - 14000 * 5);
    expect(toastMsg).toContain('Đã nhập +5 Đùi gà tươi tẩm ướp');

    // 2. Click -5: Hoàn trả 5 miếng vừa mua hôm nay
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(state.money).toBe(initialMoney);
    expect(toastMsg).toContain('Đã trả lại 5 Đùi gà tươi tẩm ướp');

    // 3. Click -5 lần nữa khi hết hàng mua hôm nay: Báo từ chối
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(toastMsg).toContain('Chỉ đổi trả được hàng vừa nhập hôm nay');
  });
});
