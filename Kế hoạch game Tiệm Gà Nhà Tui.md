# Kế hoạch game: Tiệm Gà Nhà Tui

Sep 26, 2026 · @Haru Nguyễn

**Tiệm Gà Nhà Tui** là game quản lý tiệm gà rán chạy trên trình duyệt điện thoại, lấy cảm hứng từ vòng lặp của Tiệm Trà Nhỏ, nhưng thêm nhân viên, đánh giá sao và nội dung đủ 20–30 giờ để phá đảo.

Người chơi đi từ một xe đẩy gà rán vỉa hè đến chuỗi 5 chi nhánh, cạnh tranh với các chuỗi gà rán lớn (hư cấu, mô phỏng phong cách KFC, Jollibee, Texas). Mỗi ngày gồm ba pha: chuẩn bị, mở bán và tổng kết. Tiền lời dùng để nâng cấp tiệm, thuê người và mở món mới.

Điểm khác biệt để viral trên Threads: review của khách viết bằng giọng GenZ, và mọi khoảnh khắc hài (1 sao vì "gà ngon nhưng anh thu ngân không cười") đều xuất được thành ảnh để đăng.

Mọi con số trong kế hoạch này là giả định ban đầu, sẽ chỉnh qua công cụ mô phỏng cân bằng (mục Kiến trúc).

## Phân tích game tham khảo: Tiệm Trà Nhỏ

Tiệm Trà Nhỏ là game quản lý tiệm trà sữa chạy trên trình duyệt, không cần cài đặt, tối ưu cho điện thoại dọc. Bản bạn gửi chạy trên Cloudflare Workers; màn hình đầu hiển thị "Ngày 1 · Chuẩn bị", tiền (0đ) và điểm đánh giá khởi điểm 4,0 sao. Mình không đọc được mã nguồn (trang nạp bằng JavaScript), nên phần dưới dựa vào màn hình đầu, [hướng dẫn chính thức trên GitHub](https://github.com/tiemtranho/tiemtranho) và [trang chủ tiemtranho.com](https://tiemtranho.com).

**Vòng lặp 5 bước của họ:**

1. Nhập hàng: vào Kho, chọn số phần trà, topping, ly; nấu rồi nhập. Nguyên liệu có hạn dùng, mua dư là lỗ.
2. Đọc order: loại trà, cỡ M/L, topping, đường, đá.
3. Pha chế: chọn ly, rót đúng vạch, thêm topping.
4. Giao: kiểm tra, dán nắp, giao trước khi khách hết kiên nhẫn; sai thì làm lại.
5. Phát triển: xem đánh giá và tổng kết ngày, dùng lời để mở món và nâng cấp.

**Điểm nên học:**

- Không cài đặt, mở link là chơi: rất hợp với luồng chia sẻ từ Threads.
- Thao tác tay có cảm giác (rót đến vạch) tạo kỹ năng, không chỉ bấm nút.
- Quản lý tồn kho có hạn dùng dạy tư duy kinh doanh ("đừng mua nhiều hơn mức bạn có thể bán").
- Lưu bằng trình duyệt hoặc đăng nhập Google để đồng bộ; có Discord cộng đồng.

**Khoảng trống để mình vượt lên:**

- Hướng dẫn công khai không nhắc tới nhân viên, sự kiện, chương truyện hay kết thúc: chiều sâu dài hạn là cơ hội.
- Không thấy cơ chế chia sẻ/viral trong game ngoài Discord: mình đưa việc chia sẻ vào ngay thiết kế.
- Đánh giá chỉ là một con số sao: mình tách thành 5 tiêu chí và review bằng chữ để người chơi biết cần nâng cấp gì.

## Tầm nhìn, đối tượng và concept viral

**Tầm nhìn một câu:** "Từ xe đẩy gà rán đầu hẻm đến chuỗi gà quốc dân, và mỗi review 1 sao là một content."

**Đối tượng chính:** GenZ 16–26 tuổi tại Việt Nam, chơi trên điện thoại, phiên ngắn 5–15 phút (giờ ra chơi, trên xe buýt, trước khi ngủ). Họ quen thương hiệu gà rán, meme, và thích các game "cozy" nhưng có chút thao tác.

**Trụ cảm xúc:**

- *Sướng tay:* chiên gà vàng giòn đúng lúc, tiếng xèo xèo, đóng hộp combo gọn.
- *Giàu dần lên:* số tiền tăng mỗi ngày, tiệm đẹp dần lên nhìn thấy được.
- *Cười:* khách, nhân viên và review đều có tính cách, nói giọng GenZ.
- *Khoe:* mọi thành tích có thể xuất thành ảnh đẹp khung dọc.

**Cơ chế viral cho Threads (xếp theo ưu tiên):**

1. **Thẻ review chia sẻ:** cuối ngày, game chọn review hài nhất và tạo ảnh giống ảnh chụp màn hình app review ("⭐ 1/5 – gà ngon nhưng chờ lâu tới mức mình chia tay người yêu luôn"). Nút "Đăng lên Threads" mở Web Share API kèm link chơi.
2. **"Gà Wrapped" cuối tuần:** 7 ngày trong game → thẻ tổng kết: món bán chạy, nhân viên "tệ nhất tuần", số gà bị cháy.
3. **Thử thách ngày chung:** mỗi ngày thật có một "ca đặc biệt" cùng seed cho mọi người, xếp hạng doanh thu. Người chơi so điểm bằng ảnh giống Wordle.
4. **Ghé tiệm bạn bè:** link `?visit=mã` cho người khác xem tiệm mình và để lại 1 review thật (có lọc từ).
5. **Khoảnh khắc hỗn loạn có chủ đích:** sự kiện như "TikToker ghé quán", "mất điện giờ cao điểm", "nhân viên đăng story nói xấu sếp" để người chơi quay lại kể.

**Tháo gỡ thương hiệu:** không dùng tên, logo, linh vật của KFC, Jollibee, Texas Chicken. Menu lấy cảm hứng từ các món phổ biến của họ (gà rán giòn, gà sốt cay, mì Ý sốt bò bằm, bánh quy bơ...) với tên riêng; các chuỗi đối thủ là hư cấu (xem mục Rủi ro).

## Core loop theo ngày và kinh tế

Một ngày trong game kéo dài khoảng 6–8 phút thật, chia ba pha. Giờ mở cửa 10:00–22:00 trong game, có hai giờ cao điểm trưa (11:30–13:00) và tối (18:00–20:00).

| Pha | Thời lượng thật | Người chơi làm gì |
| --- | --- | --- |
| Chuẩn bị | 1–2 phút | Nhập gà tươi, bột, dầu, khoai, nước ngọt; tẩm ướp trước; xếp ca nhân viên; chọn khuyến mãi ngày; xem dự báo thời tiết và sự kiện |
| Mở bán | 4–5 phút | Nhận order, chiên, đóng hộp combo, giao tại bàn hoặc cho shipper; xử lý sự cố |
| Tổng kết | 1 phút | Doanh thu, chi phí, lương, hàng hỏng, review mới, sao trung bình; mua nâng cấp; chia sẻ thẻ review |

**Minigame chiên (kỹ năng cốt lõi):** kéo miếng gà đã tẩm vào chảo, thanh màu chạy từ Sống → Vàng giòn → Cháy. Nhấc đúng vùng vàng = "Perfect" (+ điểm hương vị, có hiệu ứng giòn rụm). Dầu chiên xuống cấp sau mỗi mẻ; dầu đen làm giảm sao Vệ sinh, người chơi phải chọn thay dầu (tốn tiền) hay “ráng thêm một ca” (một lựa chọn đạo đức hài hước).

**Khách hàng có thanh kiên nhẫn** và order gồm: món chính, phần (miếng/combo), vị (giòn/cay/mật ong), nước, ăn tại chỗ hay mang về. Khi có nhân viên, người chơi chuyển dần từ tự tay làm sang điều phối (chỉ vào các điểm nghẽn).

**Công thức lợi nhuận ngày:**

```latex
Lãi = \sum_{đơn} (Giá \times HệsốTip) - Nguyên liệu - Hànghỏng - Lương - Tiềnmặtbằng - Điệnnước - Hoahồngapp
```

Lượng khách mỗi ngày = khách nền của vị trí × hệ số sao × hệ số marketing × hệ số thời tiết/sự kiện. Hệ số sao là đòn bẩy chính: 3 sao ≈ 0,6×, 4 sao ≈ 1,0×, 4,8 sao trở lên ≈ 1,6×, nên review tốt trực tiếp thành tiền.

**Đơn vị tiền:** VNĐ trong game, giá món gần đời thực (1 miếng gà \~35.000đ, combo \~89.000đ) để người chơi thấy quen và dễ so sánh.

## Menu, nâng cấp, nhân viên và đánh giá

### Menu (mở khóa theo chương)

Tên món là tên riêng của game; cột "Cảm hứng" chỉ dùng nội bộ cho team, không hiển thị.

| Món trong game | Cảm hứng | Giá bán | Mở ở | Độ khó thao tác |
| --- | --- | --- | --- | --- |
| Gà Giòn Nhà Tui | Gà rán truyền thống (KFC, Texas) | 35.000đ | Chương 1 | Chiên 1 bước |
| Khoai Lắc Phô Mai | Khoai tây chiên | 25.000đ | Chương 1 | Chiên + lắc bột |
| Gà Sốt Cay Xé Lưỡi | Gà sốt cay (Jollibee, KFC) | 42.000đ | Chương 2 | Chiên + sốt |
| Gà Mật Ong Bơ Tỏi | Gà sốt mật ong (Texas) | 45.000đ | Chương 2 | Chiên + sốt |
| Mì Ý Sốt Bò Ngọt | Mì Ý kiểu Jollibee | 39.000đ | Chương 2 | Trụng mì + rưới sốt |
| Bánh Quy Bơ Mật | Biscuit kiểu Texas | 18.000đ | Chương 3 | Nướng hẹn giờ |
| Burger Gà Giòn | Burger gà (Zinger, Chickenjoy burger) | 55.000đ | Chương 3 | Ghép lớp |
| Gà Popcorn | Gà viên | 32.000đ | Chương 3 | Chiên mẻ nhỏ |
| Cơm Gà Sốt | Cơm gà (Việt hóa) | 49.000đ | Chương 4 | Xới cơm + gà + sốt |
| Gà Trộn Tokbokki / Gà Hàn | Trend GenZ | 69.000đ | Chương 4 | Chiên 2 lần + sốt |
| Kem Sundae, Trà Đào, Nước ngọt | Món phụ | 12–29.000đ | Rải đều | Máy tự động |
| Combo, Bucket gia đình | Combo các chuỗi | 89–299.000đ | Chương 2+ | Người chơi tự thiết kế combo |

Người chơi tự đặt giá và tự thiết kế combo (tên + ảnh). Giá cao hơn thị trường làm tụt sao Giá cả; giá thấp làm mỏng lãi.

### Nâng cấp tiệm (4 nhánh)

| Nhánh | Ví dụ cấp | Tác động chính |
| --- | --- | --- |
| Bếp | Chảo → nồi chiên 2 giỏ → nồi áp suất → dây chuyền; tủ giữ nóng; máy lọc dầu | Tốc độ, Hương vị, Vệ sinh |
| Không gian | Ghế nhựa → bàn gỗ → máy lạnh → góc sống ảo → khu vui chơi trẻ em; decor theo chủ đề | Không gian, sức chứa |
| Vận hành | Máy POS → kiosk tự order → màn hình gọi số → app giao hàng riêng | Tốc độ, giảm sai order |
| Marketing | Tờ rơi → fanpage → livestream → hợp tác KOL → món limited | Lượng khách, loại khách |

### Nhân viên và lương

Năm vai: Thu ngân, Bếp chiên, Phục vụ/dọn, Giao hàng, Quản lý ca. Mỗi người có 4 chỉ số (Tốc độ, Tay nghề, Thái độ, Thể lực), 1–2 tính cách và một mức lương theo giờ.

- **Tuyển dụng:** đăng tin trên "nhóm tìm việc" trong game, phỏng vấn 3 câu hỏi vui, trả lương theo mức người đó đòi (đàm phán được).
- **Lương đàng hoàng:** lương trả cuối ngày, không dưới sàn tối thiểu của game (\~25.000đ/giờ, gần mức part-time thật). Thưởng, tăng lương, ngày nghỉ làm tăng Tâm trạng; trả trễ hoặc bắt làm quá giờ thì Tâm trạng giảm, nhân viên có thể nghỉ việc hoặc “đăng story bóc phốt” làm tụt sao.
- **Tính cách vui:** Idol TikTok (hút khách, hay lười), Cú đêm (mạnh ca tối), Vụng về (hay làm rơi khay), Nghện điện thoại, Sếp tương lai (tăng cấp nhanh).
- **Phát triển:** nhân viên lên cấp theo số ca làm, có thể đề bạt làm quản lý chi nhánh ở chương 5.

### Đánh giá sao (trục chính của game)

Mỗi khách chấm 5 tiêu chí; sao tiệm = trung bình có trọng số của 50 review gần nhất, nên tiệm hồi phục được sau ngày tệ.

| Tiêu chí | Trọng số | Phụ thuộc vào | Nâng cấp gợi ý khi thấp |
| --- | --- | --- | --- |
| Hương vị | 30% | Perfect chiên, dầu sạch, công thức, tay nghề bếp | Nồi chiên, máy lọc dầu, đào tạo bếp |
| Tốc độ | 25% | Thời gian chờ, số nhân viên, POS/kiosk | Thuê thêm, kiosk, tủ giữ nóng |
| Vệ sinh | 15% | Dọn bàn, rác, dầu, sự kiện gián | Phục vụ/dọn, lịch vệ sinh |
| Không gian | 15% | Decor, máy lạnh, chỗ ngồi, nhạc | Nhánh Không gian |
| Giá cả | 15% | Giá so với thị trường, khuyến mãi | Điều chỉnh giá, combo |

Mỗi review có dòng chữ sinh từ mẫu theo tiêu chí yếu nhất, ví dụ: "gà giòn xỉu up xỉu down nhưng đợi lâu muốn mọc rễ" (Hương vị cao, Tốc độ thấp). Màn tổng kết có biểu đồ radar 5 tiêu chí và một dòng "Cố vấn gợi ý" chỉ thẳng nâng cấp nên mua tiếp. Cần viết sẵn khoảng 300–500 mẫu review để không bị lặp.

### Tính năng khác

- **Sự kiện ngẫu nhiên:** mưa (khách ăn tại chỗ giảm, đơn app tăng), mất điện, kiểm tra vệ sinh, trận bóng đá (bucket bán chạy), food reviewer bí mật.
- **Khách quen:** 12 khách có cốt truyện nhỏ (cặp đôi hẹn hò, học sinh ôn thi, shipper), mở thêm đoạn hội thoại khi quay lại.
- **Đối thủ:** 3 chuỗi hư cấu mở cửa hàng gần, chạy khuyến mãi để giành khách; người chơi phản công bằng món limited.
- **Bộ sưu tập:** sổ công thức, album review hay, thành tích ("Chiên 1.000 miếng không cháy").
- **Tùy biến:** avatar chủ tiệm, đồng phục, logo tự vẽ từ bộ mẫu.

## Tiến trình 20–30 giờ phá đảo

Cốt truyện chính dài khoảng 210 ngày trong game × \~7 phút/ngày ≈ 24,5 giờ; thêm nội dung phụ (khách quen, thành tích, sưu tập) đưa tổng lên 20–30 giờ tùy người chơi. Nguyên tắc nhịp độ: cứ 30–45 phút chơi phải mở một thứ mới (món, máy, nhân viên, sự kiện), và mỗi chương thêm một cơ chế chứ không chỉ tăng số.

| Chương | Ngày | Giờ chơi | Bối cảnh | Cơ chế mới | Doanh thu/ngày | Mục tiêu qua chương |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Xe đẩy đầu hẻm | 1–15 | \~1,5 | Vỉa hè, 1 chảo | Chiên, order, nhập hàng | 0,5–1,5 triệu | Gom 5 triệu thuê mặt bằng |
| 2. Tiệm trong hẻm | 16–50 | \~4 | 4 bàn, 1–3 nhân viên | Thuê người, lương, combo, 5 tiêu chí sao | 2–6 triệu | Đạt 4,0 sao + 30 triệu |
| 3. Mặt tiền phố | 51–100 | \~6 | 12 bàn, 4–8 nhân viên | App giao hàng, marketing, khách quen | 8–20 triệu | 4,5 sao, top 3 bảng xếp hạng quận |
| 4. Tiệm hot trend | 101–150 | \~6 | Đối thủ mở đối diện | Chiến giá, món limited, KOL, khủng hoảng truyền thông | 20–50 triệu | Thắng thị phần quận trước đối thủ |
| 5. Chuỗi gà quốc dân | 151–210 | \~7 | 5 chi nhánh, 25+ nhân viên | Quản lý chi nhánh, bếp trung tâm, nhượng quyền | 50–200 triệu (cả chuỗi) | 5 chi nhánh ≥ 4,7 sao, giải "Gà Vàng" |

**Từ thợ chiên thành CEO:** chương 1–2 người chơi tự làm hầu hết; chương 3–4 chuyển sang điều phối; chương 5 là quản lý vĩ mô, nhưng luôn có nút "xuống bếp" để tự chiên lấy bonus. Điều này giữ cảm giác tay không bị mất khi game chuyển sang quản lý.

**Sau khi phá đảo:** chế độ vô tận, Thử thách ngày, New Game+ "Khách khó tính" (kiên nhẫn giảm 30%), và bảng xếp hạng tốc độ phá đảo.

**Chống cày nhàm chán:** từ chương 3 có nút tua nhanh ngày "êm" (để nhân viên tự chạy, nhận 80% doanh thu), nên người chơi giỏi có thể phá đảo gần 20 giờ, người chơi thích làm kỹ đến 30 giờ.

## Phong cách mỹ thuật, nhân vật và nguồn asset

**Phong cách:** 2D chibi, nét viền dày, màu ấm "gà rán": đỏ cà chua, vàng giòn, cam sốt, kem bơ, nền pastel. Góc nhìn chính là mặt quầy nhìn thẳng (như Tiệm Trà Nhỏ) cho pha bán hàng, và một góc isometric nhỏ cho màn xây dựng/trang trí tiệm. Khung dọc 9:16, thiết kế cho một ngón cái.

**Bảng màu gợi ý:** `#E63946` đỏ, `#F4A261` cam sốt, `#FFD166` vàng giòn, `#FDF3E4` nền kem, `#3D2C2E` nâu viền.

**Nhân vật:**

- **Gà Bông** – linh vật riêng của game: một chú gà con đội mũ đầu bếp, biểu cảm meme (khóc, xỉu, "ổn áp"). Dùng làm sticker, icon, thẻ chia sẻ.
- **Chủ tiệm** – avatar tùy biến (tóc, da, trang phục), 6 biểu cảm.
- **Nhân viên** – hệ thống ghép phần (đầu, tóc, mặt, đồng phục) để tạo hàng trăm người từ ít asset.
- **Khách hàng** – 8 nhóm nhận diện bằng dáng và phụ kiện: học sinh áo dài/đồng phục, dân văn phòng, shipper áo xanh/cam (màu chung, không logo), cặp đôi, gia đình, food reviewer, "khách Karen", TikToker cầm điện thoại.
- **Chủ chuỗi đối thủ** – 3 nhân vật phản diện hài, thiết kế riêng, không nhại linh vật có thật.

**Nguồn asset (ưu tiên tự thiết kế cho nhân vật và món ăn, dùng nguồn mở cho phần nền):**

| Loại | Nguồn | Ghi chú |
| --- | --- | --- |
| UI, icon, nội thất tạm | [Kenney](https://kenney.nl/assets) | CC0, dùng thương mại tự do; tốt cho prototype |
| Pack đồ ăn, nội thất pixel/chibi | [itch.io game assets](https://itch.io/game-assets) | Giấy phép từng pack khác nhau; lưu lại bẳng chứng mua |
| Âm thanh (xèo xèo, tiền, chuông) | [Freesound](https://freesound.org) | Chỉ lấy file CC0 hoặc CC-BY có ghi công |
| Font hỗ trợ tiếng Việt | [Google Fonts](https://fonts.google.com): Be Vietnam Pro, Baloo 2 | Giấy phép OFL |
| Nhân vật, món ăn, linh vật | Tự vẽ (Aseprite / Procreate / Figma) hoặc thuê họa sĩ | AI tạo ảnh chỉ dùng cho concept, vẽ lại bản cuối để chắc bản quyền |

**Art bible cần có trước khi sản xuất:** tỉ lệ đầu/thân, độ dày nét, 3 cấp độ bóng đổ, quy tắc vẽ món ăn (luôn có hơi nóng, ánh dầu), kích thước sprite chuẩn (nhân vật 256px cao, món 128px).

## Kiến trúc kỹ thuật và cấu trúc repo

**Quyết định:** web game (PWA) viết bằng TypeScript, render bằng Phaser 3, backend nhỏ trên Cloudflare Workers – cùng hạ tầng game tham khảo đang dùng, rẻ và mở link là chơi. Sau này đóng gói lên App Store/Google Play bằng Capacitor mà không viết lại.

| Lớp | Công nghệ | Lý do |
| --- | --- | --- |
| Logic game | TypeScript thuần (`packages/core`) | Không phụ thuộc engine, test được, chạy mô phỏng cân bằng không cần màn hình |
| Render, animation | Phaser 3 + Vite | Engine 2D web phổ biến, tài liệu nhiều, nhẹ trên mobile |
| UI menu, bảng | HTML/CSS phủ trên canvas (Preact) | Chữ tiếng Việt sắc nét, dễ làm bảng nâng cấp, nhân viên |
| Nội dung | JSON/YAML + schema Zod (`packages/content`) | Game designer chỉnh số không cần sửa code |
| Lưu game | localStorage/IndexedDB; đồng bộ mây tùy chọn | Chơi offline, không bắt đăng nhập |
| Backend | Cloudflare Workers + D1 (SQLite) + R2 | Sync save, bảng xếp hạng, thử thách ngày, ảnh chia sẻ |
| Phân tích | PostHog hoặc Cloudflare Analytics | Đo funnel, retention, tỉ lệ chia sẻ |

**Nguyên tắc kiến trúc:**

- **Logic tách khỏi hình:** `core` nhận lệnh (`fryStart`, `serveOrder`, `hireStaff`) và trả state mới; Phaser chỉ vẽ state. Nhờ vậy chạy được 210 ngày trong vài giây để kiểm tra đường cong 20–30 giờ.
- **Tất định bằng seed:** mọi ngẫu nhiên qua một RNG có seed, để Thử thách ngày giống hệt cho mọi người và server kiểm tra lại điểm chống gian lận.
- **Dữ liệu hóa nội dung:** món, khách, nhân viên, nâng cấp, sự kiện, mẫu review, chương đều là file dữ liệu. Thêm chi nhánh mới hay sự kiện Tết = thêm file, không sửa engine.
- **Save có version:** mỗi bản save có `saveVersion` và hàm migrate, để cập nhật lâu dài không làm mất tiến độ người chơi.

**Cấu trúc repo (monorepo pnpm):**

```
tiem-ga-nha-tui/
├─ apps/
│  ├─ game/                  # client Phaser + Preact (PWA)
│  │  ├─ src/
│  │  │  ├─ main.ts
│  │  │  ├─ scenes/          # Boot, Preload, Title, Prep, Service, Summary, Build, Chain
│  │  │  ├─ views/           # sprite nhân vật, chảo, quầy, khách (chỉ vẽ state)
│  │  │  ├─ ui/              # Preact: HUD, bảng nâng cấp, tuyển dụng, review, settings
│  │  │  ├─ share/           # tạo ảnh thẻ review, Gà Wrapped, Web Share API
│  │  │  ├─ audio/
│  │  │  ├─ i18n/            # vi.json, en.json
│  │  │  └─ platform/        # save local, cloud sync, analytics, Capacitor bridge
│  │  ├─ public/            # manifest.webmanifest, icons, service worker
│  │  └─ vite.config.ts
│  ├─ api/                   # Cloudflare Worker
│  │  ├─ src/routes/        # save, leaderboard, daily, visit, share-card
│  │  ├─ migrations/        # D1 SQL
│  │  └─ wrangler.toml
│  └─ balance-sim/           # CLI chạy 1.000 ván × 210 ngày, xuất CSV/biểu đồ
├─ packages/
│  ├─ core/                  # logic thuần TS
│  │  ├─ src/
│  │  │  ├─ state/           # GameState, SaveData, migrate
│  │  │  ├─ systems/         # day-cycle, cooking, orders, customers, staff, payroll,
│  │  │  │                    # reviews, economy, upgrades, events, rivals, chain
│  │  │  ├─ rng.ts
│  │  │  └─ commands.ts
│  │  └─ test/
│  ├─ content/               # dữ liệu game + schema
│  │  ├─ menu/*.yaml
│  │  ├─ customers/*.yaml
│  │  ├─ staff/traits.yaml
│  │  ├─ upgrades/*.yaml
│  │  ├─ events/*.yaml
│  │  ├─ reviews/vi/*.yaml  # mẫu review GenZ theo tiêu chí và mức sao
│  │  ├─ chapters/*.yaml
│  │  └─ schema.ts          # Zod, CI báo lỗi nếu dữ liệu sai
│  └─ shared/                # kiểu dữ liệu dùng chung client/api
├─ assets-src/                # file gốc .aseprite, .psd, .fig, âm thanh gốc
├─ tools/                     # pack sprite atlas, nén ảnh, xuất font
├─ docs/
│  ├─ GDD.md                 # tài liệu thiết kế game (bản này)
│  ├─ art-bible.md
│  ├─ balance.md
│  └─ licenses.md            # nguồn và giấy phép từng asset
├─ .github/workflows/         # lint, test, validate content, deploy preview
└─ package.json, pnpm-workspace.yaml, tsconfig.base.json
```

**Quy trình:** mỗi pull request chạy test `core`, kiểm tra schema nội dung, chạy balance-sim rút gọn và deploy bản xem trước lên Cloudflare Pages để chơi thử ngay trên điện thoại.

## Lộ trình phát triển và mở rộng

Với đội 1–2 người (1 lập trình, 1 họa sĩ bán thời gian), bản đầy đủ 5 chương mất khoảng 7–9 tháng. Chiến lược là tung Chương 1–2 lên Threads sớm (tháng 3–4) để đo độ viral trước khi đầu tư nội dung dài.

| Giai đoạn | Thời gian | Kết quả | Điều kiện qua cửa |
| --- | --- | --- | --- |
| M0 – Prototype xám | Tuần 1–3 | Chiên + order + tổng kết ngày, hình khối | 5 người chơi thử nói chiên "sướng tay" và muốn chơi ngày tiếp |
| M1 – Vertical slice | Tuần 4–9 | Chương 1 hoàn chỉnh, art thật, âm thanh, thẻ review chia sẻ | Phiên trung bình ≥ 12 phút với 30 người test |
| M2 – Soft launch Threads | Tuần 10–16 | Chương 1–2, nhân viên, lương, 5 tiêu chí sao, PWA | Retention ngày 1 ≥ 35%, ≥ 5% phiên có chia sẻ |
| M3 – Alpha nội dung | Tháng 5–6 | Chương 3–4, marketing, đối thủ, khách quen, Thử thách ngày | Balance-sim cho 20–30 giờ; không có đoạn "kẹt" > 45 phút |
| M4 – Bản 1.0 | Tháng 7–9 | Chương 5, chuỗi chi nhánh, kết thúc, New Game+, sync mây | 20 người phá đảo bình thường trong 20–30 giờ |
| M5 – Live ops | Sau 1.0 | Sự kiện mùa, bản app store, mở rộng | Cập nhật 4–6 tuần/lần |

**Hướng mở rộng dài hạn** (mỗi hướng chủ yếu là thêm dữ liệu nhờ kiến trúc `content`):

- **Sự kiện theo mùa VN:** Tết (gà cúng, lì xì nhân viên), Trung thu, mùa thi, World Cup/SEA Games, Black Friday.
- **Ngành hàng mới:** mở thêm tiệm trà sữa, pizza, bánh mì trong cùng thế giới – từng cái là một DLC mini.
- **Thành phố mới:** Hà Nội, Đà Nẵng, Sài Gòn với khẩu vị và khách khác nhau.
- **Xã hội:** ghé tiệm bạn bè, giải đấu tuần theo trường/khu vực, bảng xếp hạng mùa.
- **Mod nội dung:** cho cộng đồng gửi mẫu review hài, duyệt rồi đưa vào game kèm tên tác giả – vừa là nội dung vừa là marketing.
- **Kiếm tiền (tùy chọn, không pay-to-win):** trang phục/decor, chương mở rộng trả phí một lần, quảng cáo tự nguyện nhân đôi thưởng cuối ngày; sau này có thể hợp tác thương hiệu thật khi có hợp đồng.

## Rủi ro và chỉ số đo lường

| Rủi ro | Mức | Cách xử lý |
| --- | --- | --- |
| Dùng tên, logo, linh vật KFC/Jollibee/Texas Chicken bị khiếu nại nhãn hiệu | Cao | Chỉ dùng tên món chung chung và tên riêng; đối thủ hư cấu; không nhại màu + hình đặc trưng; hỏi luật sư trước khi làm nội dung nhắc tới thương hiệu thật |
| Quá giống Tiệm Trà Nhỏ | Trung bình | Khác ngành, khác minigame (chiên), thêm nhân viên/chuỗi/review; tự vẽ UI, không sao chép asset hay bố cục |
| Review người chơi viết (ghé tiệm bạn) bị lạm dụng | Trung bình | Lọc từ, giới hạn ký tự, nút báo cáo, mặc định chỉ hiện cho chủ tiệm |
| Hiệu năng trên điện thoại Android tầm trung | Trung bình | Sprite atlas, giới hạn số khách trên màn, test trên máy \~3 triệu từ M0 |
| Giữa game nhàm (chương 3–4) | Trung bình | Mỗi chương một cơ chế mới, tua nhanh ngày êm, balance-sim đo đoạn kẹt |
| Viral 1 lần rồi tắt | Trung bình | Thử thách ngày + sự kiện mùa giữ nhịp quay lại |

**Chỉ số mục tiêu khi soft launch:**

| Chỉ số | Mục tiêu |
| --- | --- |
| Hoàn thành ngày 1 | ≥ 80% người mở game |
| Quay lại ngày 1 / ngày 7 | ≥ 35% / ≥ 12% |
| Phiên trung bình | 12–15 phút |
| Phiên có bấm chia sẻ | ≥ 5% |
| Lượt chơi mới từ link chia sẻ | ≥ 30% tổng người chơi mới |

**Việc cần làm ngay:**

- [ ] Chốt tên game và kiểm tra tên miền, tài khoản Threads còn trống
- [ ] Vẽ phác Gà Bông và 3 khách hàng mẫu
- [ ] Dựng repo theo cấu trúc trên, làm prototype chiên xám (M0)
- [ ] Viết 50 mẫu review GenZ đầu tiên để thử giọng văn

## Nguồn

- [Tiệm Trà Nhỏ – bản chơi bạn gửi](https://trongnhi.trongnhi110266.workers.dev/)
- [Hướng dẫn chơi Tiệm Trà Nhỏ trên GitHub](https://github.com/tiemtranho/tiemtranho)
- [Trang chủ tiemtranho.com](https://tiemtranho.com)
