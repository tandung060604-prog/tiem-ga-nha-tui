import { GameState, CharacterEpisode, CharacterStoryChoice, CharacterStoryState } from '../types/game';
import { CHARACTER_EPISODES, getEpisodeById } from '../content/characterNarrativeArcs';
import { applyKarmaChange } from '../content/endings';

/**
 * ĐỘNG CƠ ĐIỀU PHỐI BIÊN NIÊN KÝ PHÂN NHÁNH HẺM 1102 (EPISODIC NARRATIVE ENGINE)
 * Quản lý trạng thái, kiểm tra mở khóa tập truyện, lưu trữ cờ nhân quả liên ngày (Multi-day Causality)
 * và đảm bảo 100% không lặp lại kịch bản.
 */

/**
 * Đảm bảo GameState luôn có đối tượng CharacterStoryState hợp lệ
 */
export function ensureCharacterStoryState(state: GameState): CharacterStoryState {
  if (!state.characterStoryState) {
    state.characterStoryState = {
      characterProgress: {},
      pendingEpisodeId: null,
      readEpisodeHistory: [],
    };
  }
  return state.characterStoryState;
}

/**
 * Kiểm tra xem một tập truyện có đủ điều kiện mở khóa tại thời điểm hiện tại hay không
 */
export function isEpisodeUnlocked(state: GameState, episode: CharacterEpisode): boolean {
  const storyState = ensureCharacterStoryState(state);
  const charProg = storyState.characterProgress[episode.characterId] ?? {
    characterId: episode.characterId,
    currentEpisodeIndex: 1,
    completedEpisodeIds: [],
    chosenOptionIds: {},
    causalityFlags: [],
  };

  // 1. Tập truyện đã hoàn thành thì KHÔNG xuất hiện lại (100% Non-repeating)
  if (charProg.completedEpisodeIds.includes(episode.id)) {
    return false;
  }

  // 2. Kiểm tra điều kiện ngày bán tối thiểu
  if (state.day < episode.unlockDay) {
    return false;
  }

  // 3. Kiểm tra điều kiện chương tối thiểu (nếu có)
  const currentChapter = state.currentChapter || 1;
  if (episode.unlockChapter && currentChapter < episode.unlockChapter) {
    return false;
  }

  // 4. Kiểm tra điều kiện hoàn thành tập trước (Prerequisite Episode)
  if (episode.prerequisiteEpisodeId && !charProg.completedEpisodeIds.includes(episode.prerequisiteEpisodeId)) {
    return false;
  }

  // 5. Kiểm tra các cờ nhân quả tiên quyết (Prerequisite Causality Flags)
  if (episode.prerequisiteFlags && episode.prerequisiteFlags.length > 0) {
    const allFlags = getAllCausalityFlags(state);
    const hasAll = episode.prerequisiteFlags.every(flag => allFlags.includes(flag));
    if (!hasAll) return false;
  }

  return true;
}

/**
 * Lấy toàn bộ các cờ nhân quả đã được thiết lập trong game
 */
export function getAllCausalityFlags(state: GameState): string[] {
  const storyState = ensureCharacterStoryState(state);
  const flags = new Set<string>();
  for (const prog of Object.values(storyState.characterProgress)) {
    for (const f of prog.causalityFlags) {
      flags.add(f);
    }
  }
  return Array.from(flags);
}

/**
 * Kiểm tra xem một cờ nhân quả cụ thể đã được kích hoạt chưa
 */
export function hasCausalityFlag(state: GameState, flag: string): boolean {
  return getAllCausalityFlags(state).includes(flag);
}

/**
 * Lấy danh sách toàn bộ các tập truyện đang khả dụng để chơi hôm nay
 */
export function getAvailableCharacterEpisodes(state: GameState): CharacterEpisode[] {
  return CHARACTER_EPISODES.filter(ep => isEpisodeUnlocked(state, ep));
}

/**
 * Lấy tập truyện ưu tiên nhất để xuất hiện hôm nay (nếu có)
 */
export function getNextAvailableCharacterEpisode(state: GameState): CharacterEpisode | null {
  const available = getAvailableCharacterEpisodes(state);
  if (available.length === 0) return null;

  // Ưu tiên theo thứ tự: Episode Index nhỏ nhất -> unlockDay nhỏ nhất
  available.sort((a, b) => {
    if (a.episodeIndex !== b.episodeIndex) return a.episodeIndex - b.episodeIndex;
    return a.unlockDay - b.unlockDay;
  });

  return available[0] || null;
}

/**
 * Giải quyết lựa chọn của người chơi cho một tập truyện
 * Áp dụng Karma, tiền thưởng, uy tín và ghi nhận cờ nhân quả liên ngày
 */
export function resolveCharacterChoice(
  state: GameState,
  episodeId: string,
  choiceId: string
): { episode: CharacterEpisode; choice: CharacterStoryChoice } {
  const episode = getEpisodeById(episodeId);
  if (!episode) {
    throw new Error(`Episode not found with id: ${episodeId}`);
  }

  const choice = episode.choices.find(c => c.id === choiceId);
  if (!choice) {
    throw new Error(`Choice not found with id: ${choiceId} in episode: ${episodeId}`);
  }

  const storyState = ensureCharacterStoryState(state);
  if (!storyState.characterProgress[episode.characterId]) {
    storyState.characterProgress[episode.characterId] = {
      characterId: episode.characterId,
      currentEpisodeIndex: 1,
      completedEpisodeIds: [],
      chosenOptionIds: {},
      causalityFlags: [],
    };
  }

  const prog = storyState.characterProgress[episode.characterId]!;

  // 1. Ghi nhận hoàn thành và lựa chọn
  if (!prog.completedEpisodeIds.includes(episode.id)) {
    prog.completedEpisodeIds.push(episode.id);
  }
  prog.chosenOptionIds[episode.id] = choice.id;
  prog.currentEpisodeIndex = Math.max(prog.currentEpisodeIndex, episode.episodeIndex + 1);

  // 2. Kích hoạt cờ nhân quả (Causality Flag) nếu có
  if (choice.setsFlag && !prog.causalityFlags.includes(choice.setsFlag)) {
    prog.causalityFlags.push(choice.setsFlag);
  }

  // 3. Tác động chỉ số Nghiệp Cảm Karma
  if (choice.karmaEffect) {
    state.karma = applyKarmaChange(state.karma, choice.karmaEffect);
  }

  // 4. Phần thưởng kinh tế / uy tín
  if (choice.rewardMoney) {
    state.money += choice.rewardMoney;
  }

  // 5. Lưu vào lịch sử đọc
  storyState.readEpisodeHistory.push({
    episodeId: episode.id,
    choiceId: choice.id,
    day: state.day,
  });

  // 6. Xóa pending nếu khớp
  if (storyState.pendingEpisodeId === episode.id) {
    storyState.pendingEpisodeId = null;
  }

  return { episode, choice };
}

/**
 * Lấy lịch sử tiến trình câu chuyện của một nhân vật để hiển thị trong Sổ Ký Ức
 */
export function getCharacterProgressDetails(
  state: GameState,
  characterId: string
): {
  totalEpisodes: number;
  completedCount: number;
  history: { episode: CharacterEpisode; chosenOption: CharacterStoryChoice }[];
} {
  const storyState = ensureCharacterStoryState(state);
  const prog = storyState.characterProgress[characterId];
  const allEpisodes = CHARACTER_EPISODES.filter(ep => ep.characterId === characterId);

  const history: { episode: CharacterEpisode; chosenOption: CharacterStoryChoice }[] = [];
  if (prog) {
    for (const epId of prog.completedEpisodeIds) {
      const ep = getEpisodeById(epId);
      const choiceId = prog.chosenOptionIds[epId];
      const opt = ep?.choices.find(c => c.id === choiceId);
      if (ep && opt) {
        history.push({ episode: ep, chosenOption: opt });
      }
    }
  }

  return {
    totalEpisodes: allEpisodes.length,
    completedCount: prog?.completedEpisodeIds.length || 0,
    history,
  };
}
