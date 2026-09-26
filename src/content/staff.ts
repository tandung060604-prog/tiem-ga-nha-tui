import { StaffMember, StaffRole } from '../types/game';
import { pick, random } from '../core/rng';

export const STAFF_ROLES_INFO: { [key in StaffRole]: { name: string; desc: string; icon: string } } = {
  cashier: {
    name: 'Thu Ngân',
    desc: 'Bấm order nhanh nhẹn, tươi cười chào đón khách.',
    icon: '💁'
  },
  cook: {
    name: 'Bếp Chiên',
    desc: 'Tẩm bột, canh độ vàng giòn chuẩn Perfect.',
    icon: '👨‍🍳'
  },
  waiter: {
    name: 'Phục Vụ & Dọn Bàn',
    desc: 'Lau dọn bàn ghế sạch bóng, giữ điểm Vệ sinh cao.',
    icon: '🧹'
  },
  delivery: {
    name: 'Giao Hàng (Shipper)',
    desc: 'Chạy đơn app nhanh như chớp, không để khách đói.',
    icon: '🛵'
  },
  manager: {
    name: 'Quản Lý Ca',
    desc: 'Điều phối toàn bộ tiệm, tăng 20% hiệu suất đồng đội.',
    icon: '👔'
  },
  security: {
    name: 'Bảo Vệ Giữ Xe & An Ninh',
    desc: 'Trông xe an toàn, dẹp loạn, tóm gọn kẻ trộm và quỵt tiền.',
    icon: '👮'
  }
};

export const STAFF_TRAITS = [
  {
    id: 'tiktok_idol',
    name: 'Idol TikTok',
    desc: 'Hút khách hâm mộ ghé quán (+15% khách), nhưng thỉnh thoảng mải quay clip.',
    icon: '📱'
  },
  {
    id: 'night_owl',
    name: 'Cú Đêm',
    desc: 'Tăng 40% Tốc độ trong ca tối (sau 18:00).',
    icon: '🦉'
  },
  {
    id: 'clumsy',
    name: 'Vụng Về Đáng Yêu',
    desc: 'Thi thoảng làm rớt khay, nhưng tính cách dễ thương khách không nỡ chấm 1 sao.',
    icon: '😅'
  },
  {
    id: 'phone_addict',
    name: 'Nghiện Threads',
    desc: 'Cập nhật drama cực nhanh, phản hồi review cho khách cực mặn.',
    icon: '💬'
  },
  {
    id: 'future_boss',
    name: 'Sếp Tương Lai',
    desc: 'Tiếp thu siêu nhanh, tăng cấp x2, phù hợp làm Quản lý chi nhánh.',
    icon: '🌟'
  }
];

export const INITIAL_CANDIDATES: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Bảo Anh (Zét-bi)',
    role: 'cashier',
    avatar: '👧',
    speed: 78,
    skill: 70,
    attitude: 92,
    stamina: 80,
    traits: ['tiktok_idol'],
    hourlyWage: 27000,
    mood: 100,
    shiftsWorked: 0
  },
  {
    id: 'staff_2',
    name: 'Minh Khang (Bếp Chiến)',
    role: 'cook',
    avatar: '👦',
    speed: 85,
    skill: 88,
    attitude: 75,
    stamina: 85,
    traits: ['night_owl'],
    hourlyWage: 30000,
    mood: 100,
    shiftsWorked: 0
  },
  {
    id: 'staff_3',
    name: 'Thảo Linh',
    role: 'waiter',
    avatar: '👩',
    speed: 80,
    skill: 72,
    attitude: 88,
    stamina: 78,
    traits: ['future_boss'],
    hourlyWage: 26000,
    mood: 100,
    shiftsWorked: 0
  },
  {
    id: 'staff_4',
    name: 'Hoàng Shipper',
    role: 'delivery',
    avatar: '🧑',
    speed: 90,
    skill: 82,
    attitude: 80,
    stamina: 92,
    traits: ['phone_addict'],
    hourlyWage: 28000,
    mood: 100,
    shiftsWorked: 0
  },
  {
    id: 'staff_5',
    name: 'Chú Tư Dân Phòng',
    role: 'security',
    avatar: '👮‍♂️',
    speed: 75,
    skill: 85,
    attitude: 90,
    stamina: 88,
    traits: ['night_owl'],
    hourlyWage: 25000,
    mood: 100,
    shiftsWorked: 0
  }
];

export function generateCandidate(chapter: number): StaffMember {
  const names = ['Thành Nam', 'Huyền Trang', 'Quốc Bảo', 'Ngọc Ánh', 'Việt Anh', 'Phương Nhi', 'Minh Đức', 'Khánh Vy', 'Chú Tư Giữ Xe', 'Anh Quyết An Ninh'];
  const roles: StaffRole[] = ['cashier', 'cook', 'waiter', 'delivery', 'manager', 'security'];
  const avatars = ['👦', '👧', '🧑', '👩', '👱‍♂️', '👱‍♀️'];
  
  const name = pick(names);
  const role = pick(roles);
  const avatar = pick(avatars);
  const trait = pick(STAFF_TRAITS).id;

  const baseStat = 55 + chapter * 7;
  const speed = Math.min(98, Math.floor(baseStat + random() * 25));
  const skill = Math.min(98, Math.floor(baseStat + random() * 25));
  const attitude = Math.min(98, Math.floor(65 + random() * 30));
  const stamina = Math.min(98, Math.floor(60 + random() * 35));
  
  const hourlyWage = Math.floor(20000 + (speed + skill) * 40 + chapter * 1500); // ~26–32k/giờ

  return {
    id: 'staff_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    name,
    role,
    avatar,
    speed,
    skill,
    attitude,
    stamina,
    traits: [trait],
    hourlyWage,
    mood: 100,
    shiftsWorked: 0
  };
}
