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
  it('renderInventoryTab sinh HTML chứa đúng giá sỉ đã giảm và các nút +5, +10, -5', () => {
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
    expect(html).toContain('class="btn-sm btn-refund"');
  });

  it('bindInventoryEvents gán sự kiện click mua hàng và hoàn vốn chính xác 1:1', () => {
    const state = createInitialState();
    const initialMoney = state.money;
    const initialChicken = state.inventory.chicken_meat.amount; // 8

    // Giả lập mock button +5
    const buy5Btn = new MockNode('BUTTON');
    buy5Btn.setAttribute('class', 'btn-sm btn-buy');
    buy5Btn.setAttribute('data-id', 'chicken_meat');
    buy5Btn.setAttribute('data-qty', '5');

    // Giả lập mock button -5
    const refund5Btn = new MockNode('BUTTON');
    refund5Btn.setAttribute('class', 'btn-sm btn-refund');
    refund5Btn.setAttribute('data-id', 'chicken_meat');
    refund5Btn.setAttribute('data-qty', '5');

    // Mock document.querySelectorAll
    (globalThis as any).document = {
      getElementById: (id: string) => null,
      querySelectorAll: (sel: string) => {
        if (sel.includes('.btn-buy')) return [buy5Btn];
        if (sel.includes('.btn-refund')) return [refund5Btn];
        if (sel.includes('.btn-unlock')) return [];
        return [];
      }
    };

    let toastMsg = '';
    bindInventoryEvents(
      state,
      fn => fn(state),
      msg => { toastMsg = msg; }
    );

    // 1. Click +5 đúng 1 lần
    buy5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken + 5);
    expect(state.money).toBe(initialMoney - 14000 * 5);
    expect(toastMsg).toContain('Đã nhập +5');

    // 2. Click -5 đúng 1 lần (hoàn vốn 5 miếng vừa mua)
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(state.money).toBe(initialMoney);
    expect(toastMsg).toContain('Đã trả lại 5');

    // 3. Click -5 lần nữa khi không còn hàng mua hôm nay -> báo toast từ chối, không trừ tiền
    refund5Btn.click();
    expect(state.inventory.chicken_meat.amount).toBe(initialChicken);
    expect(toastMsg).toContain('Chỉ đổi trả được hàng vừa nhập hôm nay');
  });
});
