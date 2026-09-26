// Tên riêng của nhân vật cốt truyện Hẻm 1102 (docs/02-story-bible-v2.md).
// Họ chỉ xuất hiện qua truyện / khách quen, KHÔNG được sinh ra như khách ngẫu nhiên hay ứng viên
// nhân viên (test tests/story-characters.test.ts kiểm tra).
export const STORY_CHARACTER_NAMES = [
  'Bác Ba', 'Minh Trí', 'Na', 'Dũng', 'Long', 'Mai', 'Bắp', 'Tuấn', 'Lan', 'Quỳnh Anh', 'Đức Huy', 'Mimi', 'Thỏ Cam'
] as const;

// "Mai" không được khớp "Mai Anh"… nên so theo từ trọn vẹn
export function mentionsStoryCharacter(name: string): string | null {
  const words = name.normalize('NFC');
  for (const n of STORY_CHARACTER_NAMES) {
    if (new RegExp(String.raw`(^|[^\p{L}])${n}([^\p{L}]|$)`, 'u').test(words)) return n;
  }
  return null;
}
