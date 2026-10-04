import { KarmaState, KarmaArchetype, KarmaArchetypeId } from '../types/game';

// Lựa chọn trong truyện và sự cố (karma) có tác dụng THẬT trong ca bán, không chỉ quyết định kết thúc.
// Mỗi chỉ số 0–100, mốc trung tính 50. Lệch khỏi 50 → hiệu ứng tỉ lệ, cả chiều tốt lẫn xấu:
//  • Tình Hẻm (community): khách quen kiên nhẫn hơn (hẻm thương quán) — thấp thì khách dễ quạu
//  • Nghệ Nhân (craftsmanship): tiếng lành "gà ngon" — sao Hương vị nhích dần mỗi ngày
//  • Tham Vọng (ambition): thêm khách (quảng bá mạnh) nhưng chi phí mặt bằng/điện nước đội lên

export interface KarmaEffects {
  patiencePct: number;       // cộng vào độ kiên nhẫn của khách (%)
  customersPct: number;      // cộng vào số khách mỗi ngày (%)
  overheadPct: number;       // cộng vào mặt bằng + điện nước (%), chỉ khi tham vọng > 50
  tasteDriftPerDay: number;  // sao Hương vị cộng/trừ mỗi ngày
}

export const KARMA_LIMITS = { patiencePct: 12, customersPct: 15, overheadPct: 12, tasteDriftPerDay: 0.05 } as const;

// -1 … +1 quanh mốc 50
const lean = (v: number) => Math.max(-1, Math.min(1, (v - 50) / 50));

export function karmaEffects(k: KarmaState | undefined): KarmaEffects {
  const c = lean(k?.community ?? 50);
  const a = lean(k?.ambition ?? 50);
  const m = lean(k?.craftsmanship ?? 50);
  return {
    patiencePct: Math.round(KARMA_LIMITS.patiencePct * c),
    customersPct: Math.round(KARMA_LIMITS.customersPct * a),
    overheadPct: Math.round(KARMA_LIMITS.overheadPct * Math.max(0, a)),
    tasteDriftPerDay: Math.round(KARMA_LIMITS.tasteDriftPerDay * m * 100) / 100
  };
}

// Dòng mô tả cho giao diện (bảng kế hoạch / cảnh truyện). Chỉ liệt kê hiệu ứng khác 0.
export function describeKarmaEffects(k: KarmaState | undefined): string[] {
  const e = karmaEffects(k);
  const sign = (v: number) => (v > 0 ? `+${v}` : `${v}`);
  const out: string[] = [];
  if (e.patiencePct) out.push(`🏘️ Tình Hẻm: khách ${e.patiencePct > 0 ? 'kiên nhẫn hơn' : 'dễ quạu hơn'} ${sign(e.patiencePct)}%`);
  if (e.tasteDriftPerDay) out.push(`👨‍🍳 Nghệ Nhân: sao Hương vị ${sign(e.tasteDriftPerDay)}/ngày`);
  if (e.customersPct) out.push(`🚀 Tham Vọng: khách ${sign(e.customersPct)}%${e.overheadPct ? `, chi phí mặt bằng +${e.overheadPct}%` : ''}`);
  return out;
}

export const KARMA_ARCHETYPES: Record<KarmaArchetypeId, KarmaArchetype> = {
  alley_soul: {
    id: 'alley_soul',
    title: 'Hồn Hẻm Nghĩa Tình',
    tagline: 'Quán gà ruột gắn bó máu thịt với bà con Hẻm 1102',
    icon: '❤️',
    description: 'Bạn chọn đặt cái tình làng nghĩa xóm lên trên doanh số. Khách quen xem tiệm như gian bếp thân thuộc của gia đình.',
    badgeColor: '#e05353',
    dominantStat: 'community',
    perks: ['Khách quen hẻm kiên nhẫn tăng đến +12%', 'Dễ kích hoạt trợ lực từ bà con láng giềng']
  },
  artisan_flame: {
    id: 'artisan_flame',
    title: 'Bậc Thầy Lửa Vàng',
    tagline: 'Nâng tầm gà rán vỉa hè thành kiệt tác ẩm thực',
    icon: '🔥',
    description: 'Bạn tỉ mỉ canh chuẩn từng giọt dầu, lớp bột giòn tan và công thức sốt bí truyền. Tiếng lành đồn xa khắp phố.',
    badgeColor: '#f59e0b',
    dominantStat: 'craftsmanship',
    perks: ['Sao Hương vị nhích dần +0.05/ngày', 'Tăng tỷ lệ thực khách sành ăn chấm 5 sao']
  },
  street_tycoon: {
    id: 'street_tycoon',
    title: 'Doanh Nhân Phố Hẻm',
    tagline: 'Khát vọng xây dựng chuỗi thương hiệu gà rán nức tiếng',
    icon: '🚀',
    description: 'Bạn nhạy bén với cơ hội kinh doanh, tối ưu từng đồng vốn và mở rộng quy mô phục vụ đông đảo thực khách.',
    badgeColor: '#3b82f6',
    dominantStat: 'ambition',
    perks: ['Lượng khách kéo đến tăng đến +15%', 'Chi phí mặt bằng & điện nước tăng nhẹ tương ứng']
  },
  alley_heart: {
    id: 'alley_heart',
    title: 'Trái Tim Hẻm 1102',
    tagline: 'Hài hòa trọn vẹn giữa tình nghĩa, tay nghề và khát vọng',
    icon: '⭐',
    description: 'Đỉnh cao của người làm nghề: tiệm vừa đậm đà hương vị truyền thống, vừa được cả hẻm yêu quý, vừa vững vàng tài chính.',
    badgeColor: '#10b981',
    dominantStat: 'balanced',
    perks: ['Hưởng đồng thời lợi thế kiên nhẫn, hương vị và khách', 'Mở cánh cửa dẫn tới Kết Thúc Viên Mãn (Happy Ending)']
  },
  novice_dreamer: {
    id: 'novice_dreamer',
    title: 'Người Trẻ Khởi Nghiệp',
    tagline: 'Đang định hình phong cách trên từng mẻ gà đầu tiên',
    icon: '🌱',
    description: 'Những bước đi chập chững nhưng đầy nhiệt huyết. Mọi ngả rẽ vận mệnh của tiệm gà vẫn đang nằm trong tay bạn.',
    badgeColor: '#8b5cf6',
    dominantStat: 'neutral',
    perks: ['Các chỉ số vận hành cân bằng quanh mức trung tính', 'Tự do lựa chọn định hình phong cách riêng']
  }
};

export function getKarmaArchetype(k: KarmaState | undefined): KarmaArchetype {
  const comm = k?.community ?? 50;
  const craft = k?.craftsmanship ?? 50;
  const amb = k?.ambition ?? 50;

  // Nếu cả 3 đều đạt ngưỡng xuất sắc >= 60
  if (comm >= 60 && craft >= 60 && amb >= 60) {
    return KARMA_ARCHETYPES.alley_heart;
  }

  // Tìm chỉ số cao nhất vượt trội (>= 60)
  const maxVal = Math.max(comm, craft, amb);
  if (maxVal >= 60) {
    if (comm === maxVal && comm > craft && comm > amb) {
      return KARMA_ARCHETYPES.alley_soul;
    }
    if (craft === maxVal && craft > comm && craft > amb) {
      return KARMA_ARCHETYPES.artisan_flame;
    }
    if (amb === maxVal && amb > comm && amb > craft) {
      return KARMA_ARCHETYPES.street_tycoon;
    }
  }

  return KARMA_ARCHETYPES.novice_dreamer;
}

export function renderKarmaCompassHtml(k: KarmaState | undefined): string {
  const comm = Math.round(k?.community ?? 50);
  const craft = Math.round(k?.craftsmanship ?? 50);
  const amb = Math.round(k?.ambition ?? 50);
  const archetype = getKarmaArchetype(k);
  const effects = describeKarmaEffects(k);

  return `
    <div class="karma-compass-card" style="
      background: linear-gradient(135deg, rgba(30, 27, 46, 0.95), rgba(15, 14, 23, 0.95));
      border: 2px solid ${archetype.badgeColor};
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      color: #fff;
    ">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <div style="
          width: 52px;
          height: 52px;
          border-radius: 8px;
          border: 2px solid ${archetype.badgeColor};
          background: #111;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 0 10px ${archetype.badgeColor}44;
        ">
          <img src="/assets/characters/char_01_owner.png" alt="Chủ Quán" style="width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated;" />
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">${archetype.icon}</span>
            <span style="font-weight: 700; font-size: 13px; color: ${archetype.badgeColor}; text-shadow: 0 0 6px ${archetype.badgeColor}66;">
              ${archetype.title}
            </span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px; line-height: 1.3;">
            ${archetype.tagline}
          </div>
        </div>
      </div>

      <!-- 3 Thanh Ngọn Lửa Karma -->
      <div style="display: flex; flex-direction: column; gap: 6px; background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <!-- Tình Hẻm -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
            <span style="color: #fca5a5;">❤️ Tình Thân Hẻm (Lòng Dân)</span>
            <span style="font-weight: 700; color: #fca5a5;">${comm}/100</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${comm}%; background: linear-gradient(90deg, #ef4444, #f87171); transition: width 0.3s;"></div>
          </div>
        </div>

        <!-- Nghệ Nhân -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
            <span style="color: #fde047;">🔥 Bản Sắc Nghệ Nhân (Tay Nghề)</span>
            <span style="font-weight: 700; color: #fde047;">${craft}/100</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${craft}%; background: linear-gradient(90deg, #f59e0b, #fbbf24); transition: width 0.3s;"></div>
          </div>
        </div>

        <!-- Tham Vọng -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
            <span style="color: #93c5fd;">🚀 Tham Vọng Quy Mô (Kinh Doanh)</span>
            <span style="font-weight: 700; color: #93c5fd;">${amb}/100</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${amb}%; background: linear-gradient(90deg, #3b82f6, #60a5fa); transition: width 0.3s;"></div>
          </div>
        </div>
      </div>

      <!-- Tác động ca bán thực tế -->
      ${effects.length > 0 ? `
        <div style="margin-top: 8px; font-size: 10.5px; color: #94a3b8; display: flex; flex-direction: column; gap: 2px;">
          ${effects.map(e => `<div>• ${e}</div>`).join('')}
        </div>
      ` : `
        <div style="margin-top: 8px; font-size: 10.5px; color: #64748b; font-style: italic;">
          • Các chỉ số đang ở mức cân bằng, vận hành bình ổn.
        </div>
      `}
    </div>
  `;
}

