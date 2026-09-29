---
name: game-performance-opt
description: "Chuyên gia tối ưu hiệu năng 60-120 FPS, GPU Compositing, loại bỏ Layout Thrashing, cache DOM node và tối ưu trải nghiệm cảm ứng siêu mượt trên Web Mobile cho Tiệm Gà Nhà Tui."
---

# Game Performance & Smooth Animation Engineering — Tiệm Gà Nhà Tui

Skill này hướng dẫn toàn bộ đội ngũ Agent (**Gemini 1 - Visuals**, **Gemini 2 - Core Gameplay**, **Claude - Lead & Auditor**) cách duy trì tốc độ khung hình chuẩn mực **60 FPS cố định và 120 FPS trên màn hình ProMotion (iPhone / iPad / Android 120Hz)**, triệt tiêu hoàn toàn giật lag (frame drops / layout thrashing) trên nền tảng Web Mobile.

---

## 1. NGUYÊN TẮC VÀNG: GPU COMPOSITING (ZERO REFLOW)

Trong một game vòng lặp thời gian thực (requestAnimationFrame / 60-120 FPS), **tuyệt đối không bao giờ animate các thuộc tính kích hoạt Layout Reflow**:
* ❌ **CẤM:** `top`, `left`, `bottom`, `right`, `width`, `height`, `margin`, `padding`. (Ép CPU tính lại toàn bộ cây DOM).
* ✅ **BẮT BUỘC DÙNG:** `transform: translate3d(x, y, 0)`, `transform: scale(x, y)`, `transform: rotate(deg)` và `opacity`. (GPU xử lý độc lập trên Compositor thread).

### Ví dụ quy chuẩn:
```ts
// ❌ SAI: Gây giật lag mỗi frame
pointer.style.left = `${progress}%`;
patienceBar.style.width = `${percent}%`;

// ✅ ĐÚNG: Siêu mượt trên GPU
pointer.style.transform = `translate3d(${progress}%, 0, 0)`;
patienceBar.style.transform = `scaleX(${percent / 100})`;
```

---

## 2. KỸ THUẬT CACHE DOM NODES (ZERO QUERYSELECTOR IN LOOP)

* **Vấn đề:** Gọi `root.querySelector(...)` 15-20 lần mỗi frame (tương đương 1.200 phép duyệt DOM mỗi giây) gây nghẽn CPU và sụt giảm pin điện thoại.
* **Giải pháp:** Sử dụng `WeakMap` hoặc khởi tạo cấu trúc cache một lần duy nhất khi dựng khung (render/mount):

```ts
interface SellingDomCache {
  clock: HTMLElement | null;
  pointer: HTMLElement | null;
  fryPot: HTMLElement | null;
  timers: Map<string, HTMLElement>;
  orders: Map<string, { card: HTMLElement; fill: HTMLElement; mood: HTMLElement }>;
}

const domCacheMap = new WeakMap<HTMLElement, SellingDomCache>();

export function getOrCreateDomCache(root: HTMLElement): SellingDomCache {
  let cache = domCacheMap.get(root);
  if (!cache) {
    cache = {
      clock: root.querySelector('.clock b'),
      pointer: root.querySelector('.cook-gauge-pointer'),
      fryPot: root.querySelector('#btn-fry-pot'),
      timers: new Map(),
      orders: new Map(),
    };
    domCacheMap.set(root, cache);
  }
  return cache;
}
```

---

## 3. ZERO-TOUCH LATENCY & CSS CONTAINMENT

Để game phản hồi tức thì dưới đầu ngón tay mà không bị trình duyệt can thiệp:

```css
/* Tắt độ trễ 300ms double-tap zoom và cử chỉ kéo mặc định của mobile */
.selling-screen,
.kitchen-counter,
.fry-pot,
.action-btn,
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}

/* Cô lập vùng render của các phần tử thay đổi liên tục */
.fry-pot,
.customer-card,
.cook-gauge {
  contain: layout paint;
  will-change: transform;
}
```

---

## 4. TỐI ƯU HÓA WEB AUDIO & BỘ THU GOM RÁC (GC FREE SOUNDS)

* Với âm thanh Typewriter hội thoại nhảy 25-35 ký tự/giây, không tạo mới `createOscillator()` vô tội vạ gây tràn bộ nhớ rác (Garbage Collector Pause).
* Tái sử dụng Gain Node hoặc kiểm tra cờ tắt âm `isMuted` ngay đầu hàm trước khi khởi tạo AudioContext.

---

## 5. BẢNG CHECKLIST NGHIỆM THU HIỆU NĂNG

Mỗi khi bàn giao tính năng đồ họa hoặc ca bán:
1. `Performance Tab (DevTools)`: 0 lần xuất hiện thanh cảnh báo màu đỏ (Long Frame > 16.6ms).
2. `FPS Meter`: Cố định 60 FPS trên Chrome Android và 120 FPS trên iPhone 13 Pro trở lên.
3. Không có memory leak khi chuyển đổi qua lại giữa Màn Chuẩn Bị ↔ Màn Bán Hàng 10 lần liên tục.
