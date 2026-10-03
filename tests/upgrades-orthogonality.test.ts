import { describe, it, expect } from 'vitest';
import { INITIAL_UPGRADES } from '../src/content/upgrades';
import { upgradeEffects } from '../src/core/upgrades';
import { createInitialState } from '../src/core/state';

describe('Đảm bảo nội tại các nhánh nâng cấp không bị trùng lặp (Strict Passive Orthogonality)', () => {
  const ALLOWED_BRANCH_BONUSES: Record<string, string[]> = {
    cart: ['speed', 'taste', 'hygiene'],
    kitchen: ['speed', 'taste'],
    space: ['space', 'capacity'],
    operations: ['speed'],
    marketing: ['customers'],
    storage: ['shelfLife', 'discount'],
    service: ['sauceTip', 'autoDrink'],
    hygiene: ['hygiene', 'pestImmunity']
  };

  it('tất cả 7 nhánh chỉ chứa đúng các chỉ số nội tại chuyên biệt được phép, không bị trùng lặp', () => {
    for (const [branchId, branch] of Object.entries(INITIAL_UPGRADES)) {
      const allowed = ALLOWED_BRANCH_BONUSES[branchId] ?? [];
      for (const tier of branch.tiers) {
        for (const bonusKey of Object.keys(tier.bonus)) {
          expect(
            allowed.includes(bonusKey),
            `Nhánh ${branchId} (cấp ${tier.level}: ${tier.name}) chứa chỉ số '${bonusKey}' vi phạm tính độc lập nội tại! Chỉ được phép: ${allowed.join(', ')}`
          ).toBe(true);
        }
      }
    }
  });

  it('giá nâng cấp và yêu cầu ngày/chương tăng tiến hợp lý, không đảo ngược', () => {
    for (const [branchId, branch] of Object.entries(INITIAL_UPGRADES)) {
      let prevCost = -1;
      let prevChapter = 1;
      let prevDay = 1;

      for (const tier of branch.tiers) {
        expect(tier.cost).toBeGreaterThanOrEqual(prevCost);
        prevCost = tier.cost;

        if (tier.minChapter) {
          expect(tier.minChapter).toBeGreaterThanOrEqual(prevChapter);
          prevChapter = tier.minChapter;
        }

        if (tier.minDay) {
          expect(tier.minDay).toBeGreaterThanOrEqual(prevDay);
          prevDay = tier.minDay;
        }
      }
    }
  });

  it('mỗi nhánh tác động độc lập vào đúng thuộc tính của UpgradeEffects', () => {
    const baseState = createInitialState();
    const emptyEffects = upgradeEffects(baseState.upgrades);

    // Test kitchen tác động fryRampPct, tastePct
    const kState = createInitialState();
    kState.upgrades.kitchen!.currentLevel = 2;
    const kEffects = upgradeEffects(kState.upgrades);
    expect(kEffects.fryRampPct).toBe(40);
    expect(kEffects.tastePct).toBe(35);
    expect(kEffects.customersPct).toBe(0);
    expect(kEffects.pricePremiumPct).toBe(0);
    expect(kEffects.traySlots).toBe(0);

    // Test marketing tác động DUY NHẤT customersPct
    const mState = createInitialState();
    mState.upgrades.marketing!.currentLevel = 2;
    const mEffects = upgradeEffects(mState.upgrades);
    expect(mEffects.customersPct).toBe(35);
    expect(mEffects.pricePremiumPct).toBe(0);
    expect(mEffects.fryRampPct).toBe(0);

    // Test space tác động DUY NHẤT pricePremiumPct và traySlots
    const sState = createInitialState();
    sState.upgrades.space!.currentLevel = 2;
    const sEffects = upgradeEffects(sState.upgrades);
    expect(sEffects.pricePremiumPct).toBe(15);
    expect(sEffects.traySlots).toBe(1);
    expect(sEffects.customersPct).toBe(0);

    // Test storage tác động DUY NHẤT shelfLifeBonus và discountWholesale
    const stState = createInitialState();
    stState.upgrades.storage!.currentLevel = 2;
    const stEffects = upgradeEffects(stState.upgrades);
    expect(stEffects.shelfLifeBonus).toBe(3);
    expect(stEffects.discountWholesale).toBe(10);
    expect(stEffects.tastePct).toBe(0);

    // Test hygiene tác động DUY NHẤT oilLifePct, hygieneBoost, pestImmunity
    const hState = createInitialState();
    hState.upgrades.hygiene!.currentLevel = 3;
    const hEffects = upgradeEffects(hState.upgrades);
    expect(hEffects.oilLifePct).toBe(100);
    expect(hEffects.pestImmunity).toBe(true);
    expect(hEffects.pricePremiumPct).toBe(0);

    // Test service tác động DUY NHẤT sauceTipBonus và autoDrink
    const svState = createInitialState();
    svState.upgrades.service!.currentLevel = 2;
    const svEffects = upgradeEffects(svState.upgrades);
    expect(svEffects.sauceTipBonus).toBe(4000);
    expect(svEffects.autoDrink).toBe(true);
    expect(svEffects.traySlots).toBe(0);
    expect(svEffects.patiencePct).toBe(0);

    // Test operations tác động DUY NHẤT patiencePct, selfServe, ownDeliveryApp
    const opState = createInitialState();
    opState.upgrades.operations!.currentLevel = 3;
    const opEffects = upgradeEffects(opState.upgrades);
    expect(opEffects.patiencePct).toBe(70);
    expect(opEffects.selfServe).toBe(true);
    expect(opEffects.ownDeliveryApp).toBe(true);
    expect(opEffects.customersPct).toBe(0);
    expect(opEffects.traySlots).toBe(0);
  });
});
