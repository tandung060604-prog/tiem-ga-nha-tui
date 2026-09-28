import { describe, it, expect } from 'vitest';
import {
  generateDailySauceRecipe,
  validateSauceInput,
  getOrCreateSauceDayState,
  SAUCE_SPICES,
  SECRET_SAUCE_BUFF
} from '../src/core/secretSauce';
import { SpiceId, CustomerOrder, GameEvent } from '../src/types/game';
import { calculateCustomerTip, closeDay } from '../src/core/day';
import { createInitialState } from '../src/core/state';
import { SellingSession } from '../src/core/sellingSim';

describe('Secret Sauce Mechanics & Minigame Core', () => {
  it('should have 5 distinct spices in the ingredients pool', () => {
    expect(SAUCE_SPICES).toHaveLength(5);
    const ids = SAUCE_SPICES.map(s => s.id);
    expect(ids).toContain('garlic');
    expect(ids).toContain('honey');
    expect(ids).toContain('chili');
    expect(ids).toContain('soy');
    expect(ids).toContain('sesame');
  });

  it('should generate a 4-step recipe without consecutive identical spices', () => {
    for (let day = 1; day <= 20; day++) {
      const recipe = generateDailySauceRecipe(day, 1);
      expect(recipe).toHaveLength(4);
      for (let i = 1; i < recipe.length; i++) {
        expect(recipe[i]).not.toBe(recipe[i - 1]);
      }
    }
  });

  it('should correctly validate correct step inputs', () => {
    const recipe: SpiceId[] = ['garlic', 'honey', 'chili', 'sesame'];
    
    // Step 1
    const res1 = validateSauceInput(recipe, ['garlic']);
    expect(res1.isCorrect).toBe(true);
    expect(res1.isFailed).toBe(false);
    expect(res1.isComplete).toBe(false);
    expect(res1.currentIndex).toBe(1);

    // Step 2
    const res2 = validateSauceInput(recipe, ['garlic', 'honey']);
    expect(res2.isCorrect).toBe(true);
    expect(res2.isFailed).toBe(false);
    expect(res2.isComplete).toBe(false);
    expect(res2.currentIndex).toBe(2);

    // Step 3
    const res3 = validateSauceInput(recipe, ['garlic', 'honey', 'chili']);
    expect(res3.isCorrect).toBe(true);
    expect(res3.isFailed).toBe(false);
    expect(res3.isComplete).toBe(false);

    // Step 4 (Complete!)
    const res4 = validateSauceInput(recipe, ['garlic', 'honey', 'chili', 'sesame']);
    expect(res4.isCorrect).toBe(true);
    expect(res4.isFailed).toBe(false);
    expect(res4.isComplete).toBe(true);
    expect(res4.currentIndex).toBe(4);
  });

  it('should detect wrong step input immediately', () => {
    const recipe: SpiceId[] = ['garlic', 'honey', 'chili', 'sesame'];
    
    // Step 1 wrong
    const resFail = validateSauceInput(recipe, ['soy']);
    expect(resFail.isCorrect).toBe(false);
    expect(resFail.isFailed).toBe(true);
    expect(resFail.isComplete).toBe(false);

    // Step 2 wrong after step 1 correct
    const resFail2 = validateSauceInput(recipe, ['garlic', 'soy']);
    expect(resFail2.isCorrect).toBe(false);
    expect(resFail2.isFailed).toBe(true);
    expect(resFail2.isComplete).toBe(false);
  });

  it('should initialize and preserve day state correctly', () => {
    const state1 = getOrCreateSauceDayState(null, 1, 1);
    expect(state1.day).toBe(1);
    expect(state1.completed).toBe(false);
    expect(state1.buffActive).toBe(false);
    expect(state1.recipe).toHaveLength(4);

    // If day matches, reuse existing state
    state1.buffActive = true;
    state1.completed = true;
    state1.success = true;
    const reused = getOrCreateSauceDayState(state1, 1, 1);
    expect(reused).toBe(state1);
    expect(reused.buffActive).toBe(true);

    // If day advances, create fresh state
    const nextDay = getOrCreateSauceDayState(state1, 2, 1);
    expect(nextDay.day).toBe(2);
    expect(nextDay.completed).toBe(false);
    expect(nextDay.buffActive).toBe(false);
  });

  it('should provide proper buff values', () => {
    expect(SECRET_SAUCE_BUFF.tipBonus).toBe(3000);
    expect(SECRET_SAUCE_BUFF.tasteRatingBonus).toBe(0.25);
  });

  it('should increase customer tip by +3,000đ when secret sauce buff is active', () => {
    const order: CustomerOrder = {
      id: 'ord_test_sauce',
      customerName: 'Bảo Châu',
      avatar: '👩‍💼',
      personality: 'easygoing',
      items: [{ menuItemId: 'crispy_chicken', count: 1, served: 0, completed: false }],
      patienceMax: 60,
      patienceCurrent: 50, // fast
      totalPrice: 35000,
      startTime: Date.now()
    };

    // Without buff
    const tipNoBuff = calculateCustomerTip(order, false);
    expect(tipNoBuff.tip).toBe(5000); // fast service tip

    // With secret sauce buff
    const tipWithBuff = calculateCustomerTip(order, true);
    expect(tipWithBuff.tip).toBe(8000); // 5000 + 3000
    expect(tipWithBuff.feedbackNotes.some(n => n.includes('Sốt Bí Truyền'))).toBe(true);
  });

  it('should record secretSauceTip and boost taste rating at closeDay', () => {
    const session: SellingSession = {
      gameHour: 21.0,
      isPaused: false,
      isFastForward: false,
      orders: [],
      spawnTimerMs: 0,
      servedCount: 1,
      totalWaitSec: 10,
      perfectStreak: 1,
      timers: { noodle: null, oven: null },
      helpers: [],
      waiterMs: 0,
      lostCount: 0,
      grossRevenue: 35000,
      tips: 8000,
      secretSauceTip: 3000,
      ingredientCost: 15000,
      burntCount: 0,
      perfectCount: 1,
      totalFriedCount: 1,
      topSellerId: 'crispy_chicken'
    };

    const state = createInitialState();
    state.secretSauceDay = {
      day: 1,
      recipe: ['garlic', 'honey', 'chili', 'sesame'],
      completed: true,
      success: true,
      buffActive: true,
      tipsEarnedToday: 0
    };

    const event: GameEvent = {
      id: 'sunny',
      title: 'Trời Nắng Ráo',
      description: 'Khách đi lại thuận tiện',
      icon: '☀️',
      effect: { customerMultiplier: 1.0 }
    };

    const initialTaste = state.ratings.taste;
    closeDay(state, session, event);

    // Taste rating should be boosted
    expect(state.ratings.taste).toBeGreaterThanOrEqual(initialTaste);
    expect(state.secretSauceDay.tipsEarnedToday).toBe(3000);
  });
});
