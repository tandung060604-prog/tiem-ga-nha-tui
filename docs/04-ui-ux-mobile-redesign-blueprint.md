# BẢN THIẾT KẾ KIẾN TRÚC UI/UX WEB MOBILE (BLUEPRINT V2.0)
## DỰ ÁN: TIỆM GÀ NHÀ TUI — PHONG CÁCH RETRO PIXEL ART SÀI GÒN & STARDEW VALLEY
*Tài liệu nghiên cứu, đối soát 10 tựa game mẫu, giải quyết vấn đề quá tải chữ (Text Overload), xung đột đè lớp giao diện (Overlay Collisions) và hệ thống Icon độc bản.*

---

## MỤC LỤC
1. [Khảo Sát & Phân Tích 10 Tựa Game Tycoon / Cozy Pixel Art Điển Hình](#1-khảo-sát--phân-tích-10-tựa-game-tycoon--cozy-pixel-art-điển-hình)
2. [Chẩn Đoán "Bệnh Lý" Giao Diện Hiện Tại Của Tiệm Gà Nhà Tui](#2-chẩn-đoán-bệnh-lý-giao-diện-hiện-tại-của-tiệm-gà-nhà-tui)
3. [Kiến Trúc Giao Diện 5 Phân Vùng Neo Bất Khả Xâm Phạm (Zero-Collision Zones)](#3-kiến-trúc-giao-diện-5-phân-vùng-neo-bất-khả-xâm-phạm-zero-collision-zones)
4. [Tái Thiết Kế Thẻ Đơn Hàng & Hệ Thống Bong Bóng Cảm Xúc (Emote Balloons)](#4-tái-thiết-kế-thẻ-đơn-hàng--hệ-thống-bong-bóng-cảm-xúc-emote-balloons)
5. [Tối Giản Màn Chuẩn Bị: Tinh Gọn Bảng Đen & Hộc Dụng Cụ (Prep De-Cluttering)](#5-tối-giản-màn-chuẩn-bị-tinh-gọn-bảng-đen--hộc-dụng-cụ-prep-de-cluttering)
6. [Bộ Icon Độc Bản Thuần Việt (Custom Saigon Pixel Icon Set) Thay Thế 100% Emoji](#6-bộ-icon-độc-bản-thuần-việt-custom-saigon-pixel-icon-set-thay-thế-100-emoji)
7. [Lộ Trình Triển Khai 4 Giai Đoạn & Phân Công Multi-Agent](#7-lộ-trình-triển-khai-4-giai-đoạn--phân-công-multi-agent)

---

## 1. KHẢO SÁT & PHÂN TÍCH 10 TỰA GAME TYCOON / COZY PIXEL ART ĐIỂN HÌNH

Để tìm ra công thức chuẩn mực cho trải nghiệm di động màn hình dọc 9:16 (360×800px & 390×844px), chúng ta nghiên cứu cách 10 tựa game quản lý hàng đầu giải quyết bài toán giao diện:

| STT | Tựa Game | Thể Loại / Nền Tảng | Cách Thiết Kế UI / HUD & Xử Lý Chữ | Bài Học Áp Dụng Cho Tiệm Gà Nhà Tui |
|:---:|---|---|---|---|
| **1** | **Stardew Valley** | Farming / Life Sim (PC/Mobile) | • Khung viền gỗ 9-slice (`wood-frame`), nền giấy da mộc (`parchment`).<br>• Hộp thoại đặt cố định đáy màn hình kèm ảnh chân dung 64×64.<br>• **Không có chữ nổi lơ lửng trên đầu nhân vật**; chỉ dùng **Emote Balloons** dạng biểu tượng hình ảnh (Tim, Chấm hỏi, Giọt mồ hôi, Ngôi sao). | Loại bỏ toàn bộ câu thoại dài bay trên đầu khách khi bán hàng; chuyển 100% thành **Emote Balloon 16×16** kiểu Stardew. Hộp thoại cốt truyện đặt cố định đáy. |
| **2** | **Dave the Diver** | Restaurant / Tycoon (PC/Switch) | • Ca tối quầy Sushi: HUD cực kỳ thanh mảnh ở 4 góc.<br>• Đơn khách chỉ là **1 đĩa sushi thu nhỏ** trên đầu kèm thanh kiên nhẫn màu trà.<br>• Không hề có chữ giải thích món ăn trong lúc phục vụ. | Đơn hàng của khách hàng chỉ cần **Icon món ăn 28×28 + Vạch màu kiên nhẫn**, xóa bỏ các dòng chữ "Đang chờ món này", "Đợi mẻ sau". |
| **3** | **Good Pizza, Great Pizza** | Cooking Mobile (iOS/Android) | • Phân tầng 2 nửa màn hình tuyệt đối: Nửa trên (Khách & Lời gọi món), Nửa dưới (Mặt bàn chế biến).<br>• Lời gọi món chỉ xuất hiện 1 lần rồi thu vào nút "Hỏi lại?" (`What?`).<br>• Các khay nguyên liệu hình tròn hoàn toàn không dán nhãn chữ (nhìn hình xúc xích, phô mai tự hiểu). | Phân định ranh giới cứng: Nửa trên (Khách hàng & Phiếu gọi món), Nửa dưới (Chảo chiên & Khay thành phẩm). Không để phần tử này tràn sang phần tử kia. |
| **4** | **Cat Snack Bar** | Idle Restaurant (Mobile) | • 100% biểu đạt bằng hình ảnh (Icon-driven UI).<br>• Bong bóng order nổi bật: `[Icon Món] × [Số Lượng]`.<br>• Khi khách ăn xong, bong bóng tự biến thành túi tiền lấp lánh để người chơi chạm thu tiền. | Tối giản định dạng order: chỉ hiển thị thẻ gỗ mini kẹp `[Ảnh món] × [Số lượng]` và vạch kiên nhẫn. |
| **5** | **Papa's Freezeria To Go** | Time-Management (Mobile) | • Bố trí phím chuyển trạm (Order, Build, Mix, Top) dạng thanh tab to ở đáy ngón cái.<br>• **Phiếu Order (Ticket Rail)** kẹp trên một thanh ray trượt ở cạnh trên màn hình, kéo qua lại mượt mà, **không bao giờ rơi vào vùng thao tác bếp**. | Thiết kế **Ray Kẹp Đơn Hàng (Order Rail)** cố định phía trên quầy, tách rời hoàn toàn khỏi chảo chiên gà và khay ra món. |
| **6** | **Cook, Serve, Delicious!** | Fast-Paced Cooking Sim | • Màu sắc cảnh báo áp lực cao: Xanh (An toàn) → Vàng (Gấp) → Đỏ (Khẩn cấp).<br>• Các trạm phụ thu gọn thành phím tắt icon rõ ràng.<br>• Thao tác bếp ưu tiên nhịp điệu (Rhythm). | Thanh đo nhiệt chảo dầu (Fry Gauge) sử dụng màu sắc tương phản cao (Xanh non - Vàng kim - Đỏ cháy) với kim chỉ rõ ràng, bỏ hết các chữ số % rườm rà. |
| **7** | **Potion Permit** | Cozy Pixel RPG (Mobile/PC) | • Thanh đo trạng thái dạng ống nghiệm 16-bit viền đen đôi.<br>• Bảng chọn nguyên liệu dạng lưới lưới tổ ong / ô vuông, chạm vào ô nào mới nhảy tooltip ở góc. | Chuyển toàn bộ danh sách nguyên liệu và nâng cấp từ dạng "cuộn dọc danh sách chữ dài" thành **Lưới Ô Vuông Pixel (Grid Slot 4×3)**. |
| **8** | **Cafeteria Nipponica (Kairosoft)** | Restaurant Sim (Mobile/Pixel) | • Nén thông tin tối đa: Thay toàn bộ thuật ngữ kinh tế bằng ký hiệu ngắn gọn: Tiền (`$`), Uy tín (`⭐`), Độ ngon (`🍗`), Tốc độ (`⚡`).<br>• Bố cục dạng bảng lưới gọn ghẽ, không giải thích dài dòng. | Tinh giản HUD: Thay vì hiển thị "Doanh thu: 1.200.000đ - Đánh giá: 4.8 sao", chỉ hiển thị `[Icon Tiền Giấy] 1.200k` và `[Icon Sao Vàng] 4.8★`. |
| **9** | **Moonlighter** | Shopkeeper Sim (Pixel Art) | • Khách vào cửa hàng xem giá và phản ứng hoàn toàn bằng 4 Emote biểu cảm: Quá rẻ (`🤑`), Hợp lý (`😊`), Đắt (`😐`), Bỏ đi (`😡`).<br>• Không có chữ thoại phàn nàn chiếm diện tích. | Phản ứng khách hàng với giá cả và chất lượng gà rán được biểu đạt 100% qua bong bóng cảm xúc pixel ngắn gọn. |
| **10** | **Coffee Talk** | Narrative & Brewing Sim | • Phân lớp giao diện: Khung cảnh tiệm và nhân vật ở phía trên; máy pha chế 3 ngăn ở phía dưới.<br>• Chế độ đọc truyện và chế độ pha chế tách bạch, không bao giờ để chữ đối thoại đè lên nút nguyên liệu. | Tách bạch tuyệt đối giữa Ca Bán Hàng thao tác nhanh và Ký Sự Cư Dân (Story Arc). Khi mở thoại cốt truyện thì dừng game (Pause/Overlay sạch), không đè chồng chéo lên ca chiên. |

---

## 2. CHẨN ĐOÁN "BỆNH LÝ" GIAO DIỆN HIỆN TẠI CỦA TIỆM GÀ NHÀ TUI

Qua quá trình rà soát trực tiếp mã nguồn giao diện (`Header.ts`, `SellingView.ts`, `Chalkboard.ts`, `StaffTab.ts`, `main.css`, `kitchen.css`), chúng ta phát hiện 3 nhóm vấn đề cốt lõi:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HIỆN TRẠNG QUÁ TẢI (CHAOS UI)                   │
├────────────────────────────────────────────────────────────────────────┤
│ [Header]: 5 nút con chen chúc + Tiền + Ngày + Ca + Tên Quán + Sao + Review │ ◄── Quá chật chội
├────────────────────────────────────────────────────────────────────────┤
│ [Bong Bóng Khách]: Thoại dài 20-30 chữ bay tự do                       │
│    "Bếp trưởng chiên Perfect liên hoàn đỉnh nóc kịch trần luôn 🔥!"   │ ◄── ĐÈ LÊN NHAU!
│ ┌──────────────────────┐  ┌──────────────────────┐                     │
│ │ Khách 1: Tên + Badges│  │ Khách 2: Tên + Badges│                     │
│ │ Order: Đùi gà x1     │  │ Order: Cánh sốt x2   │                     │
│ │ + Tương cà / ớt      │  │ + Tương cà / ớt      │                     │
│ │ [LÊN MÓN] [HỦY ĐƠN]  │  │ [LÊN MÓN] [HỦY ĐƠN]  │                     │
│ └──────────────────────┘  └──────────────────────┘                     │
├────────────────────────────────────────────────────────────────────────┤
│ [Toast Thông Báo]: Nảy ra giữa màn hình đúng lúc vớt gà                 │ ◄── CHE KHUẤT CHẢO!
├────────────────────────────────────────────────────────────────────────┤
│ [Chảo Chiên] + [Thanh Đo 5 Vùng] + [Khay Inox] + [Dải Nhân Viên 6 Người]│
│ [Nút Chiên/Vớt] to đè lên đáy màn hình                                 │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1. Bệnh 1: Bội Thực Chữ (Text Obesity & Cognitive Overload)
- **Hàng đợi khách hàng**: Mỗi thẻ khách đang chứa quá nhiều chữ: Tên khách, chức danh, trait tính cách, tên combo, tên từng món ăn, ghi chú nước sốt, trạng thái (`○ Đợi`, `⏳ 0/1`, `✓ Đủ`), kèm theo một câu bong bóng suy nghĩ dài từ 15 đến 35 chữ (`"Dầu thơm quá trời nghen..."`, `"Mùi dầu hơi khét rồi đó..."`).
- **Màn Chuẩn Bị (Prep Screen)**: Bảng đen Chalkboard chiếm tới gần 50% chiều cao màn hình chỉ để trình bày chữ (Mục tiêu ngày, thời tiết, tiền nhà, sổ nợ, điểm karma...). Phía dưới là một "ma trận" gồm 8 nút bấm chức năng phụ nằm rải rác.
- **Thẻ Nhân Viên & Nâng Cấp**: Mỗi nhân viên hiển thị 5 dòng text thông số (`⚡ Tốc độ`, `🎯 Tay nghề`, `💤 Lười`, `⚠️ Sai`, `⚙️ Hiệu ứng`, `✨ Nội tại`, `🌟 Duyên nợ`...).

### 2.2. Bệnh 2: Xung Đột Đè Lớp & Che Khuất Tầm Nhìn (Overlay Collisions & Z-Index Wars)
- **Bong bóng suy nghĩ trôi nổi (`.thought-bubble`)**: Được định vị tuyệt đối phía trên đầu khách. Khi có từ 2 đến 3 khách đứng gần nhau, các bong bóng chữ đè chồng lên nhau, che mất thanh kiên nhẫn (`.patience-bar`) và che cả nút Menu ở Header.
- **Toast thông báo (`.toast`)**: Xuất hiện ở khoảng giữa màn hình (Y: 300px - 450px), đúng ngay tọa độ của **Chảo Dầu Chiên Gà** và **Thanh Đo Độ Chín**. Người chơi đang tập trung căn giây để nhấc gà "Vàng Giòn" thì bị một thông báo "Đã nhận tiền bo 15k" hoặc "Mèo Mướp đang ngắm tiệm" che khuất tầm nhìn, dẫn đến cháy khét gà!
- **Dải nút chức năng Header**: Cột trái (`.h-l`) nhồi nhét tới 5 nút bấm (`Audio`, `Settings`, `Leaderboard`, `Changelog`, `Cẩm nang Bác Ba`) cùng với khối ngày giờ, khiến trên màn hình hẹp 360px các nút bị co rúm hoặc tràn dòng.

### 2.3. Bệnh 3: Pha Tạp Biểu Tượng Emoji Hệ Thống (Icon Inconsistency)
- Trò chơi mang phong cách Retro Pixel Art thuần Việt rất đẹp, nhưng vẫn còn vướng rất nhiều ký tự Unicode Emoji hệ thống (ví dụ: 🍗, 🍟, 🥤, 👨‍🍳, 💰, 🤖, ⭐, 💡, 🛵, 🛡️, 👔, 🍱, 🍅, 🌶️, ⏱️, 🚪, 💢, 💦, 🏆...).
- Emoji hiển thị không đồng nhất giữa iOS (Apple Color Emoji tròn bóng), Android (Noto Color) và Windows (Segoe UI Emoji phẳng), làm phá vỡ nét mộc mạc cổ điển của đồ họa 16-bit Stardew Valley.

---

## 3. KIẾN TRÚC GIAO DIỆN 5 PHÂN VÙNG NEO BẤT KHẢ XÂM PHẠM (ZERO-COLLISION ZONES)

Để giải quyết triệt để sự lộn xộn, chúng ta áp dụng nguyên tắc **Fixed Viewport Partitioning (Phân Vùng Cố Định Tuyệt Đối)** trên khung dọc chuẩn di động (390×844pt / 360×800pt). Không một phần tử nổi nào được phép vượt ra khỏi phân vùng của nó:

```
┌────────────────────────────────────────────────────────┐ 0px
│ ZONE 1: TOP HUD BANNER (Cố định Y: 0 - 56px)           │
│ [⚙️ Menu Gộp]  [🪙 Tiền: 1.250k]  [🛢️ Dầu 95%]  [⏰ 11:30]│
├────────────────────────────────────────────────────────┤ 56px
│ ZONE 2: QUẦY PHỤC VỤ & PHIẾU ORDER (Y: 56 - 280px)    │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ KHÁCH 1 (VIP) │ │ KHÁCH 2       │ │ KHÁCH 3       │ │
│  │  [Actor 2D]   │ │  [Actor 2D]   │ │  [Actor 2D]   │ │
│  │  (Emote: 😋)  │ │  (Emote: ⏳)  │ │  (Emote: 💡)  │ │
│  │ ┌───────────┐ │ │ ┌───────────┐ │ │ ┌───────────┐ │ │
│  │ │🍗x1  🥤x1 │ │ │ │🍗x2       │ │ │ │🍟x1       │ │ │
│  │ │[■■■■■■■■] │ │ │ │[■■■■■□□□] │ │ │ │[■■■□□□□□] │ │ │
│  │ └───────────┘ │ │ └───────────┘ │ │ └───────────┘ │ │
│  └───────────────┘ └───────────────┘ └───────────────┘ │
├────────────────────────────────────────────────────────┤ 280px
│ ZONE 3: KHÔNG GIAN BẾP & CHẢO DẦU (Y: 280 - 510px)    │
│           ┌────────────────────────────────┐           │
│           │       NỒI CHIÊN GANG 16-BIT    │           │
│           │      (Dầu sôi sủi tăm pixel)   │           │
│           └────────────────────────────────┘           │
│  [Xanh Non 42%] ─── [VÀNG KIM 22%] ─── [Đỏ Cháy 36%]   │
│                 ▲ (Kim chỉ nhiệt độ)                   │
├────────────────────────────────────────────────────────┤ 510px
│ ZONE 4: BÀN SỐT & KHAY THÀNH PHẨM (Y: 510 - 650px)    │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ [Máy Nước]   │
│  │ Ô 1   │ │ Ô 2   │ │ Ô 3   │ │ Ô 4   │              │
│  │🍗Giòn │ │🍗Cay  │ │🍟Lắc  │ │ (Trống│ [Chai Tương] │
│  └───────┘ └───────┘ └───────┘ └───────┘              │
├────────────────────────────────────────────────────────┤ 650px
│ ZONE 5: VÙNG NGÓN CÁI HOÀNG KIM (Y: 650 - 780px)      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  🔔 NÚT HÀNH ĐỘNG ĐA NĂNG LỚN (CHIÊN / VỚT / GIAO) │  │
│  └──────────────────────────────────────────────────┘  │
│  [🗑️ Đổ bỏ khay]                       [🛵 Ship App] │
├────────────────────────────────────────────────────────┤ 780px
│ NOTIFICATION TICKER RAIL (Băng tin LED đáy Y: 780-810) │
│ 📣 Bác Ba vừa ghé tiệm • Dầu đang vàng ươm chuẩn ATVSTP│
└────────────────────────────────────────────────────────┘ 844px
```

### Chi tiết các phân vùng:
1. **Zone 1: Top HUD Banner (Y: 0 - 56px)**:
   - **Góc trái**: Nút Hamburger Menu gộp duy nhất (thay vì 5 nút con). Khi chạm vào sẽ mở modal tổng hợp chứa: Cài đặt âm thanh, Bảng tin cập nhật, Bảng xếp hạng và Cẩm nang Bác Ba.
   - **Chính giữa**: Cọc tiền Polymer retro rút gọn (`1.450k`) + Bình dầu đổi màu theo phẩm chất kèm vạch % (Xanh lá = sạch, Vàng = vừa, Đen = cần lọc).
   - **Góc phải**: Đồng hồ quả quýt retro hiển thị giờ mở bán + Biểu tượng Giờ cao điểm (Ngọn lửa animated nhỏ khi Rush Hour).
2. **Zone 2: Quầy Phục Vụ & Hàng Đợi (Y: 56 - 280px)**:
   - Cố định tối đa 3 vị trí đứng của khách (Slot 1: Đang phục vụ, Slot 2: Kế tiếp, Slot 3: Chờ).
   - Khách hàng không di chuyển lung tung đè lên nhau.
3. **Zone 3: Trạm Chiên & Đồng Hồ Đo Nhiệt (Y: 280 - 510px)**:
   - Nồi chiên gang retro nằm chính diện.
   - Cột đo độ chín thiết kế như một **Nhiệt Kế Thủy Ngân Cổ Điển** với vạch kim chạy từ trái sang phải: Vùng Sống (Xanh ngọc) → Vùng Ngon (Vàng kim nhấp nháy) → Vùng Cháy (Đỏ cảnh báo).
4. **Zone 4: Khay GN Lắp Ráp & Trạm Nước (Y: 510 - 650px)**:
   - Khay inox 4 ô rõ ràng, hiển thị món đã chiên chín và bốc khói nhẹ.
   - Bấm vào món trong khay -> Món tự động bay lên ghép vào đơn hàng của khách đang cần.
5. **Zone 5: Vùng Ngón Cái Hoàng Kim (Golden Thumb Zone, Y: 650 - 780px)**:
   - Nằm trọn trong vùng ngón tay cái quét tới dễ dàng nhất theo công thái học di động.
   - Sử dụng **1 Nút Bấm Chính Ngữ Cảnh (Contextual Mega-Button)**:
     - Khi chảo trống: Hiển thị `[🍗 THẢ GÀ VÀO CHẢO]`.
     - Khi gà đang chín: Hiển thị `[⏳ CANH LỬA VÀNG KIM]`.
     - Khi gà đạt Perfect: Rung haptic nhấp nháy `[✨ VỚT GÀ NGAY!]`.
     - Khi khay đã đủ món cho khách đầu: Hiển thị `[🔔 GIAO MÓN NGAY!]`.

---

## 4. TÁI THIẾT KẾ THẺ ĐƠN HÀNG & HỆ THỐNG BONG BÓNG CẢM XÚC (EMOTE BALLOONS)

### 4.1. Khai Tử Bong Bóng Thoại Chữ Dài Trong Ca Bán
- **Vấn đề**: Các câu thoại dài như *"Bếp trưởng chiên Perfect đỉnh nóc kịch trần luôn!"* hay *"Trễ giờ chấm công rồi, nhanh giùm tui!"* vừa gây rối mắt, vừa che mất đồng hồ đo nhiệt.
- **Giải Pháp Stardew Emote**: Chuyển toàn bộ 100% cảm xúc của khách thành **Bong Bóng Biểu Tượng 16×16 Pixel** bật nảy phía trên đỉnh đầu nhân vật (Animation `popIn` rồi nổi nhẹ):

```
  ┌────────────────────────────────────────────────────────┐
  │         HỆ THỐNG EMOTE BALLOON THAY THẾ CHỮ NỔI        │
  ├────────────────────────────────────────────────────────┤
  │ [Icon Emote]  │ Ý Nghĩa Trạng Thái Khách Hàng          │
  ├───────────────┼────────────────────────────────────────┤
  │   ❤️ (Heart)   │ Khách VIP, rất hài lòng, chuẩn bị bo tiền │
  │   😋 (Yum)     │ Ngửi mùi gà thơm, kiên nhẫn > 70%      │
  │   ⏳ (Hourglass)│ Đang sốt ruột chờ món, kiên nhẫn 40-70%│
  │   💦 (Sweat)   │ Sắp hết kiên nhẫn, kiên nhẫn 20-40%    │
  │   💢 (Anger)   │ Quá giận dữ, kiên nhẫn < 20%           │
  │   💵 (Money)   │ Đang mở ví chuẩn bị thanh toán         │
  │   ✨ (Sparkle) │ Khen gà chiên giòn tan đạt điểm Perfect│
  │   🛢️ (Oil Alert)│ Phát hiện mùi dầu cũ/bẩn              │
  └────────────────────────────────────────────────────────┘
```

### 4.2. Thiết Kế Phiếu Order Gỗ Mini (Wooden Order Ticket)
Thay vì thẻ chữ cồng kềnh, mỗi khách chỉ mang theo một Phiếu Gỗ nhỏ (Compact Ticket) gắn liền dưới chân hoặc trên đầu:

```
┌──────────────────────────────────────┐
│  🎫 PHIẾU ORDER GỖ COMPACT (STARDEW) │
├──────────────────────────────────────┤
│  [Ảnh Đùi Gà] ×1   [Ảnh Nước Ngọt] ×1│ ◄── Chỉ có Icon Món 24x24 + Số Lượng
│  [■■■■■■■■■■■■■■■■□□□□] 75%          │ ◄── Vạch kiên nhẫn 16-bit (Xanh/Vàng/Đỏ)
└──────────────────────────────────────┘
```
- Khi món nào trong khay trùng khớp với món trên phiếu: Icon món đó **phát sáng viền vàng (Glow Pulse)** và hiện dấu tick xanh nhỏ `✓`.
- Chạm vào phiếu order: Lập tức giao toàn bộ món đã có trong khay cho khách đó.

### 4.3. Thanh Ticker Đáy Chạy Tin Tức (Non-Intrusive Bottom Rail)
- Toàn bộ các thông báo sự kiện, câu thoại bình luận của cư dân hẻm hay lời khen ngợi của khách được chuyển xuống **Băng Chữ LED Chạy Ngang (Ticker Bar)** đặt sát đáy màn hình (dưới cả nút bấm chính).
- Chiều cao chỉ 24px, nền đen chữ vàng pixel, cuộn êm dịu từ phải sang trái. Không bao giờ che khuất bất kỳ thao tác bấm hay chảo chiên nào!

---

## 5. TỐI GIẢN MÀN CHUẨN BỊ: TINH GỌN BẢNG ĐEN & HỘC DỤNG CỤ (PREP DE-CLUTTERING)

### 5.1. Bảng Đen Treo Gập/Mở (Collapsible Wooden Chalkboard)
- **Trước đây**: Bảng Chalkboard chiếm gần nửa màn hình với hàng chục dòng chữ thống kê, tiền nợ, thời tiết.
- **Thiết kế mới**:
  - Ở trạng thái thu gọn mặc định: Là một thanh gỗ mỏng thanh lịch hiển thị:
    `[☀️ Ca Trưa: Nắng Đẹp] • [🎯 Mục Tiêu: 1.500.000đ] • [Tiền Nhà: Còn 2 ngày] [▼ Xem Chi Tiết]`
  - Chỉ khi người chơi bấm nút `[▼]`, bảng mới bung nhẹ xuống như một cuộn mành sáo tre xưa để hiển thị chi tiết sổ nợ, điểm Karma và tình hình an ninh trật tự.

### 5.2. Hộc Tủ Đồ Nghề (Toolbox Drawer) Gom Cụm 8 Nút Rải Rác
- Thay vì để 8 nút bấm dài dòng (`Sổ tay`, `Bằng khen`, `Nấu sốt bí truyền`, `Thử thách tuần`, `Đài đêm`, `Ca đêm`, `Biển hiệu vintage`...) dàn trải làm rối màn hình:
- Gom lại thành **"Kệ Dụng Cụ Tiệm Gà"** với 4 icon lớn trực quan có huy hiệu chấm đỏ khi có tính năng mới:
  1. 📜 **Sổ Tay & Bằng Khen** (Gộp Ký sự cư dân + Thành tựu).
  2. 🍲 **Bếp Trưởng Sáng Tạo** (Gộp Nấu sốt bí truyền + Biển hiệu).
  3. 📻 **Góc Hẻm 1102** (Gộp Đài radio đêm + Thú cưng hiên quán).
  4. 🏆 **Thử Thách & Đua Top** (Gộp Thử thách tuần + Ca đêm bất tận + Lobby 4 máy).

### 5.3. Tab Kho Hàng & Nâng Cấp: Chuyển Sang Lưới Ô Stardew (Item Grid 4×3)
- Thay thế danh sách cuộn dọc text dài bằng **Lưới 12 Ô Vật Phẩm Vuông (4×3 Grid)**:
  - Mỗi ô là hình ảnh 32×32 pixel của nguyên liệu (Gà tươi, Bột chiên, Khoai tây, Dầu ăn, Nước ngọt...).
  - Góc dưới mỗi ô có số lượng tồn kho (ví dụ: `25`).
  - Ô nào sắp hết hàng (< 5 món) tự động nhấp nháy viền cam cảnh báo.
  - Chạm vào ô nào -> Mới hiển thị khung mua hàng nhỏ gọn trượt lên từ đáy (`+5`, `-5`, `Mua Tối Đa`).

---

## 6. BỘ ICON ĐỘC BẢN THUẦN VIỆT (CUSTOM SAIGON PIXEL ICON SET) THAY THẾ 100% EMOJI

Để đưa linh hồn "Sài Gòn Thập Niên 90 - 2000" vào game và đồng bộ thẩm mỹ với Stardew Valley, toàn bộ Emoji hệ thống sẽ được thay thế bằng bộ icon 16×16, 24×24 và 32×32 pixel art vẽ độc bản:

### Bảng Đặc Tả Hệ Thống 48 Icon Pixel Art Độc Bản:

| Nhóm Icon | Tên Icon Asset | Mã Emoji Cần Thay | Mô Tả Ý Tưởng Thiết Kế Retro Sài Gòn | Kích Thước |
|---|---|:---:|---|:---:|
| **Bếp & Nấu Nướng** | `icon_pan_cast_iron` | 🍳 | Nồi chiên gang đen bóng có dầu sôi vàng ươm | 32×32 |
| | `icon_fry_basket` | 🍗 | Rổ lưới inox vớt gà ráo dầu cán gỗ mộc | 24×24 |
| | `icon_tongs` | 🥢 | Kẹp gắp inox gắp đùi gà | 24×24 |
| | `icon_oil_clean` | 🛢️ | Bình dầu nhôm sáng bóng, giọt dầu vàng óng | 24×24 |
| | `icon_oil_dirty` | ⚠️ | Bình dầu ám khói đen, giọt dầu nâu sẫm cảnh báo | 24×24 |
| | `icon_gauge_needle` | ⏱️ | Mặt đồng hồ đo nhiệt kim đồng hồ cổ điển | 24×24 |
| **Món Ăn & Gia Vị** | `icon_chicken_crispy`| 🍗 | Đùi gà rán bọc bột xù vàng rộm, có vệt khói bốc lên | 32×32 |
| | `icon_chicken_spicy` | 🌶️ | Đùi gà phủ lớp sốt đỏ cam Yangnyeom óng ánh | 32×32 |
| | `icon_chicken_honey` | 🍯 | Cánh gà sốt bơ tỏi vàng nâu có hạt mè rắc | 32×32 |
| | `icon_shake_fries`   | 🍟 | Túi giấy xi măng đựng khoai tây rắc phô mai cam | 28×28 |
| | `icon_soda_cup`      | 🥤 | Ly nhựa sọc đỏ trắng cắm ống hút xoắn | 28×28 |
| | `icon_chili_bottle`  | 🌶️ | Chai tương ớt thủy tinh nắp đỏ Sài Gòn xưa | 24×24 |
| | `icon_ketchup_bottle`| 🍅 | Chai tương cà chua nắp xanh lá cổ điển | 24×24 |
| | `icon_pickled_radish`| 🥗 | Đĩa củ cải muối vàng vuông vức chấm mè | 24×24 |
| **Kinh Tế & Chỉ Số** | `icon_vnd_cash`      | 💵 | Xấp tiền giấy polymer/tiền cotton Việt Nam xưa | 24×24 |
| | `icon_gold_coin`     | 💰 | Đồng xu kim loại có hình hoa sen dập nổi | 20×20 |
| | `icon_star_viet`     | ⭐ | Ngôi sao vàng 5 cánh viền gỗ Stardew | 20×20 |
| | `icon_heart_cozy`    | ❤️ | Trái tim pixel đỏ thắm có viền bóng 3D | 20×20 |
| | `icon_clock_pocket`  | ⏰ | Đồng hồ quả quýt dây xích đồng | 24×24 |
| | `icon_fire_rush`     | 🔥 | Ngọn lửa pixel rực cháy giờ cao điểm | 20×20 |
| **Nhân Sự & Quán Xá**| `icon_role_cook`     | 👨‍🍳 | Nón bếp trưởng vải trắng xếp nếp | 24×24 |
| | `icon_role_waiter`   | 🧹 | Khăn lau sọc caro vắt vai & tạp dề xanh | 24×24 |
| | `icon_role_cashier`  | 💰 | Bàn tính gảy gỗ cổ điển của tiệm tạp hóa | 24×24 |
| | `icon_role_delivery` | 🛵 | Chiếc xe Cub 50 màu xanh rêu chở thùng hàng | 24×24 |
| | `icon_role_manager`  | 👔 | Cuốn sổ tay bìa da cài bút chì | 24×24 |
| | `icon_role_security` | 🛡️ | Nón cối xanh bộ đội & chiếc còi sắt Bác Ba | 24×24 |
| **Hệ Thống & Menu**  | `icon_hamburger_menu`| ☰ | 3 thanh gỗ xếp tầng phong cách Stardew | 24×24 |
| | `icon_sound_horn`    | 🔊 | Chiếc loa phóng thanh phường retro | 24×24 |
| | `icon_gear_wood`     | ⚙️ | Bánh răng gỗ mộc mạc | 24×24 |
| | `icon_trophy_cup`    | 🏆 | Chiếc cúp thi đua tổ dân phố mạ vàng | 24×24 |
| | `icon_newspaper_old` | 📰 | Tờ báo Tiền Phong / Tuổi Trẻ gấp góc giấy ngả vàng | 24×24 |
| | `icon_bell_brass`    | 🔔 | Chiếc chuông đồng quầy thu ngân ấn kêu "Keng" | 28×28 |
| | `icon_trash_basket`  | 🗑️ | Sọt rác tre đan truyền thống | 24×24 |
| **Stardew Emotes**   | `emote_yum`          | 😋 | Miệng cười há há thèm ăn | 16×16 |
| | `emote_sweat`        | 💦 | 3 giọt mồ hôi xanh ngọc lo lắng | 16×16 |
| | `emote_anger`        | 💢 | Ký hiệu gân chữ thập đỏ bừng giận dữ | 16×16 |
| | `emote_question`     | ❓ | Dấu hỏi chấm gỗ thắc mắc | 16×16 |
| | `emote_sparkle`      | ✨ | Bốn tia sáng vàng lấp lánh | 16×16 |

---

## 7. LỘ TRÌNH TRIỂN KHAI 4 GIAI ĐOẠN & PHÂN CÔNG MULTI-AGENT

Chiến dịch cải tạo toàn diện UI/UX được chia làm 4 Sprint kế tiếp nhau để bảo đảm không gián đoạn tiến trình gameplay và luôn vượt qua bộ test kiểm thử tự động kép (`vitest` + `ui:check`):

### 📅 GIAI ĐOẠN 1: CỐ ĐỊNH 5 ZONE & TRIỆT TIÊU TOAST ĐÈ LỚP (Sprint 1)
- **Mục tiêu**: Xóa bỏ hoàn toàn hiện tượng che khuất chảo chiên và dồn ép Header.
- **Tác vụ cụ thể**:
  1. Cấu trúc lại `src/ui/components/SellingView.ts` theo 5 Zone kích thước cố định (`vh` / `px`).
  2. Gộp 5 nút Header trong `src/ui/components/Header.ts` thành 1 nút Menu thả mành (`#btn-main-menu-drawer`).
  3. Chuyển đổi `.toast` thông báo từ vị trí trôi nổi giữa màn hình thành **Thanh Băng Ticker Đáy Quán (Bottom Ticker Rail)**.
  4. Đảm bảo chạy `npm run ui:check` PASS 100% trên cả 360px & 390px.

### 📅 GIAI ĐOẠN 2: THAY THẾ ORDER TEXT BẰNG PHIẾU GỖ & EMOTE BALLOONS (Sprint 2)
- **Mục tiêu**: Cắt giảm 70% lượng chữ trong ca bán hàng, tạo cảm giác game nhịp độ mượt mà.
- **Tác vụ cụ thể**:
  1. Xóa bỏ thẻ `thought-bubble` chữ dài trong ca bán; thay bằng `stardew-emote-balloon` hiển thị icon 16×16 tương ứng với tâm trạng khách.
  2. Thiết kế lại `speech-bubble` thành **Phiếu Order Gỗ Mini (Wooden Order Ticket)**: Chỉ hiển thị icon món ăn 24×24 kèm số lượng và thanh kiên nhẫn vạch màu.
  3. Tích hợp Mega-Button ngón cái ngữ cảnh tại Zone 5 (`Chiên` / `Vớt` / `Giao`).

### 📅 GIAI ĐOẠN 3: SẢN XUẤT & TÍCH HỢP BỘ ICON ĐỘC BẢN THUẦN VIỆT (Sprint 3)
- **Mục tiêu**: Thay thế 100% Unicode Emoji bằng bộ Icon Pixel Art chuẩn Sài Gòn Retro.
- **Tác vụ cụ thể**:
  1. Chạy script sinh asset và xử lý thuật toán Nearest-Neighbor sắc nét cho 48 icon pixel mới vào `public/assets/icons/`.
  2. Khai báo định tuyến trong `src/content/assets.ts` với hàm `saigonIcon(key)`.
  3. Quét sạch toàn bộ emoji trong `SellingView.ts`, `Header.ts`, `StaffTab.ts`, `InventoryTab.ts` và thay bằng thẻ `<img class="pixel-icon" ... />`.

### 📅 GIAI ĐOẠN 4: TINH GỌN MÀN CHUẨN BỊ (PREP SCREEN DE-CLUTTERING) (Sprint 4)
- **Mục tiêu**: Biến màn Chuẩn Bị thành không gian ấm cúng, trực quan, dễ quản lý kho.
- **Tác vụ cụ thể**:
  1. Tinh gọn Chalkboard thành thanh gập/mở (Collapsible Board).
  2. Gom cụm 8 nút chức năng thành Hộc Tủ Đồ Nghề (Toolbox Drawer) 4 ngăn.
  3. Tái cấu trúc Tab Kho Hàng & Nâng Cấp thành Lưới Ô Vật Phẩm Stardew (Item Grid 4×3).
  4. Kiểm toán toàn diện: Vitest 60/60 files PASS, Vite Build PASS, Monkey Test 100 ngày không xung đột giao diện.

---

### BẢNG MA TRẬN PHÂN CÔNG NHIỆM VỤ MULTI-AGENT

| Tác Tử (Agent) | Vai Trò | Trách Nhiệm Cụ Thể Trong Chiến Dịch |
|---|---|---|
| **🎨 GEMINI 1** | **UI & Visual Specialist** | • Chịu trách nhiệm chính tái cấu trúc CSS 5 Zone, animation Emote Balloon, 9-slice wood frame.<br>• Nạp và xử lý bộ 48 icon pixel art vào `public/assets/icons/` qua pipeline `npm run assets`.<br>• Bảo đảm `npm run ui:check` 0 FAIL, 0 WARN trên 360px & 390px. |
| **⚙️ GEMINI 2** | **Core Gameplay & Logic** | • Tái cấu trúc state tương tác: Chuyển đổi logic order thành Ticket mini, tích hợp Mega-Button ngữ cảnh.<br>• Tối ưu hiệu năng DOM: Giảm 40% số lượng DOM node trong ca bán nhờ dẹp bỏ các chuỗi text thừa.<br>• Bảo đảm 100% test Vitest PASS. |
| **📖 GEMINI 3** | **Narrative & UX Writing** | • Rút gọn các đoạn text mô tả kỹ năng nhân viên, nâng cấp thành dạng icon + chỉ số súc tích.<br>• Biên tập kho câu thoại ngữ cảnh của khách hàng chuyển sang thanh Bottom Ticker chạy chữ.<br>• Giữ nguyên chiều sâu tâm lý của 12 nhân vật Hẻm 1102 mà không làm rác màn hình chính. |
| **👑 CLAUDE LEAD** | **Chủ Dự Án & Tổng Kiểm Toán** | • Review toàn bộ data contract trong `src/types/game.ts` và `assets.ts`.<br>• Thực thi nghiệm thu kép 5 chốt chất lượng trước khi sáp nhập từng Sprint vào nhánh `main`. |
