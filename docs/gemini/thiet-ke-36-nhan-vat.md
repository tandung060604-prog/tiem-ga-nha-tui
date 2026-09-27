# THIẾT KẾ CHI TIẾT HỆ THỐNG 36 NHÂN VẬT HẺM 1102 & TIỆM GÀ NHÀ TUI

Tài liệu này được biên soạn bởi **Gemini** (Frontend & Visual Specialist) dựa trên bảng mô hình 36 nhân vật đời thực Nam Bộ / Sài Gòn, chuyển hóa thành hệ thống nhân vật sống động cho game **Tiệm Gà Nhà Tui**.

---

## 1. TỔNG QUAN MA TRẬN 36 NHÂN VẬT (6×6 GRID)

Toàn bộ 36 nhân vật được chia thành 6 nhóm đặc trưng cho hệ sinh thái Hẻm 1102:

| Nhóm | Số lượng | Vai trò cốt lõi | Tác động chính |
|---|:---:|---|---|
| **I. Ban Quản Trị & Nhân Sự Bếp** | 4 | Chủ quán & Thợ chiên, Phụ bếp | Quyết định tốc độ, năng suất và tay nghề quán |
| **II. Cư Dân Ruột & Thực Khách Tiêu Biểu** | 6 | Trẻ em, Cụ già, Khách sành ăn, Khách hối | Nguồn doanh thu thường xuyên và thử thách tốc độ |
| **III. Hệ Sinh Thái Vé Số & May Mắn** | 4 | Bán dạo, Mua vé, Trúng độc đắc, Mối sỉ | Tuyến sự kiện "Đổi Đời" và bùng nổ doanh số bất ngờ |
| **IV. Nhịp Sống Hàng Rong & Dịch Vụ Hẻm** | 8 | Bánh mì, Tàu hũ, Ve chai, Lao công, Gom rác, Giao hàng, Bốc vác, Xe tải | Trao đổi hàng hóa, nguyên liệu và tình làng nghĩa xóm (Karma) |
| **V. Kỹ Thuật Đô Thị & Trật Tự Xã Hội** | 8 | Thợ điện, Thợ hồ, Tạp hóa, Công an, CSGT, Dân phòng, Bảo kê, Khách ATM/Bus | Các sự cố kiểm tra giấy tờ, an toàn PCCC, lấn vỉa hè và bảo kê |
| **VI. Đời Sống Hẻm & Tuyến Động Vật Đặc Biệt** | 6 | Hàng xóm, Chạy bộ, Cặp đôi + **Chó Cỏ, Mèo Mướp, Chuột Cống** | Lan truyền danh tiếng (Word-of-mouth) và hệ thống thú cưng/dịch hại |

---

## 2. CHI TIẾT 36 NHÂN VẬT — PROFILE, HÀNH VI & SỰ KIỆN

---

### HÀNG 1: BAN QUẢN TRỊ BẾP & TUYẾN GIA ĐÌNH

#### 1. Chủ Quầy (Bạn - Nhân vật chính) — `char_01_owner`
* **Hình tượng:** Chàng trai trẻ Sài Gòn ôm ước mơ khởi nghiệp tiệm gà giòn, tạp dề đỏ, nón bếp trắng, ánh mắt quyết tâm.
* **Vai trò cốt truyện:** Người kế thừa công thức chiên gà bí truyền của Bác Ba, chèo lái tiệm từ chiếc chảo gang đơn sơ ở Chương 1 đến chuỗi nhà hàng Chương 5.
* **Tác động:** Trung tâm đưa ra mọi quyết định quản lý, đầu tư và lựa chọn đạo đức (Karma).

#### 2. Cô Bảy Bán Vé Số — `char_02_lottery_lady`
* **Hình tượng:** Người mẹ miền Tây tảo tần, áo bà ba hoa, nón lá che nghiêng, xấp vé số kẹp nách cùng nụ cười hiền hậu.
* **Hành vi gọi món:** Thường ghé xin ly nước đá lạnh vào trưa nắng, thi thoảng gom tiền lẻ mua 1 que phô mai hoặc 1 xiên gà popcorn cho con nhỏ ở nhà.
* **Sự kiện liên quan (Incident):** *"Vé Số Chiều Mưa"* — Trời đổ mưa dầm, cô còn 15 tờ vé số ế. Bạn có mua giúp cô không?
  * *Mua ủng hộ (-150k):* `karma.community +2`, cô cảm động chúc phúc. Hôm sau có cơ hội trúng giải an ủi +1.000k!
  * *Tặng cô cánh gà nóng (Miễn phí):* `karma.community +1`, `reputation +0.2`.

#### 3. Bé Linh Phụ Bếp (Staff) — `char_03_helper_linh`
* **Hình tượng:** Cô bé sinh viên nhanh nhảu, tóc búi củ tỏi, khăn quàng cổ caro, tay thoăn thoắt lắc khoai và rót soda.
* **Vai trò:** Nhân viên phụ bếp ca sáng/chiều. Tự động lắc phô mai và rót nước khi khách đông.
* **Tuyến tình cảm:** Hay đấu khẩu chí chóe nhưng lại ngấm ngầm quan tâm anh Khang thợ chiên.

#### 4. Anh Khang Thợ Chiên (Staff) — `char_04_fryer_khang`
* **Hình tượng:** Chàng trai lực lưỡng, nón kết đội ngược, tay cầm vá chiên inox, cực kỳ nhạy cảm với nhiệt độ dầu và tiếng xèo xèo.
* **Vai trò:** Nhân viên đứng bếp chiên chính. Tăng 20% vùng Perfect trên thanh đo nhiệt độ khi làm việc.
* **Sự kiện:** *"Tỏ Tình Trong Bếp"* — Anh Khang nhờ bạn tư vấn tặng quà sinh nhật cho bé Linh.

#### 5. Bé Bo Mê Gà Giòn — `char_05_kid_bo`
* **Hình tượng:** Cậu nhóc 6 tuổi tròn trĩnh, áo thun khủng long, hay kiễng chân vịn mép quầy ngóng nhìn khay gà bốc khói.
* **Hành vi:** Luôn đòi ăn đùi gà to nhất và khoai tây lắc nhiều phô mai. Rất thiếu kiên nhẫn (thanh kiên nhẫn tụt nhanh 1.5x) nhưng khi được phục vụ sẽ nhảy chân sáo và thả tim.
* **Đặc quyền:** Nếu chiên mẻ Perfect cho bé Bo, mẹ bé sẽ quay clip lên TikTok khen tiệm, thu hút thêm 5 khách nhí vào ngày hôm sau.

#### 6. Cụ Ba Quạt Nón (Bô lão Hẻm 1102) — `char_06_granny_ba`
* **Hình tượng:** Cụ bà tóc bạc phơ vấn khăn rằn, tay phe phẩy chiếc quạt mo cau, ngồi trên chiếc ghế xếp đầu hẻm.
* **Vai trò:** "Pho từ điển sống" của hẻm. Khách quen chỉ ăn gà rán da mềm hoặc xúp gà thanh đạm.
* **Sự kiện:** Cụ kể lại nguồn gốc Hẻm 1102 ("Nhất Nhất Không Nhì"), mở ra các manh mối lịch sử dẫn tới các công thức gia vị cổ truyền quý hiếm.

---

### HÀNG 2: THỰC KHÁCH ĐIỂN HÌNH & VẬN MAY SÀI GÒN

#### 7. Vy Thư Ký (Khách sành điệu) — `char_07_trendy_vy`
* **Hình tượng:** Nữ nhân viên văn phòng thời thượng, kính mát gài tóc, túi xách kẹp nách, tay cầm ly trà sữa hoặc soda.
* **Hành vi:** Thường soi kỹ độ sạch của dầu chiên và bao bì. Thích combo gà không xương sốt bơ tỏi + salad coleslaw.
* **Tác động:** Nếu dầu chiên bị đen (Dirty Oil), Vy sẽ chụp ảnh và trừ điểm danh tiếng nặng nề (`reputation -0.5`). Ngược lại, nếu phục vụ nhanh và sạch sẽ, tip cực hào phóng (+15k-25k).

#### 8. Bác Hai Nghiêm Nghị (Khách khó tính) — `char_08_grumpy_hai`
* **Hình tượng:** Cựu chiến binh về hưu, áo sơ mi cũ cài kín cổ, mặt nghiêm nghị, đi đứng đúng giờ giấc quân đội.
* **Hành vi:** Cực ghét chờ đợi. Khi giận sẽ khoanh tay dậm chân. Nhưng là người trọng chữ tín: chỉ cần món đúng giờ và giòn rụm đúng điệu, bác sẽ trở thành "hộ pháp" bênh vực tiệm trước mọi điều tiếng.

#### 9. Chú Tám Xe Ôm (Người mua vé số) — `char_09_buyer_tam`
* **Hình tượng:** Chú tài xế xe ôm truyền thống, chiếc Honda 67 dựng góc hẻm, áo khoác bạc màu, hay vừa ăn gà vừa cầm cây bút bi dò kết quả xổ số đài TP.HCM lúc 4h30 chiều.
* **Món ưa thích:** Cơm đùi gà xối mỡ + ly Coca mát lạnh nhiều đá.

#### 10. Anh Hưng Thợ Hồ (Người trúng số) — `char_10_winner_hung`
* **Hình tượng:** Khuôn mặt sạm nắng bừng sáng nụ cười rạng rỡ, tay cầm tờ vé số trúng giải đặc biệt, vung tiền bao trọn quán.
* **Sự kiện ngẫu nhiên:** Xuất hiện với tỷ lệ 2% mỗi tuần: Đặt ngay lập tức **3 Xô Gà Gia Đình (36 miếng)** và trả gấp đôi tiền mặt để đãi cả xóm!

#### 11. Bà Năm Đại Lý Sỉ — `char_11_wholesale_nam`
* **Hình tượng:** Người phụ nữ trung niên đeo túi bao tử trước bụng, tay thoăn thoắt đếm cọc tiền và vé số, giọng nói sang sảng vang cả góc phố.
* **Hành vi:** Mua số lượng lớn mang về cho nhân viên đại lý ăn trưa, luôn yêu cầu đóng gói hộp giấy giữ nhiệt cẩn thận.

#### 12. Cậu Út Giao Vé Tốc Hành — `char_12_courier_ut`
* **Hình tượng:** Cậu thanh niên trẻ nhanh nhẹn cưỡi chiếc xe đạp chở giỏ vé số, đầu đội nón bảo hiểm lưỡi trai.
* **Hành vi:** Ăn nhanh uống vội trong 3 phút, chuộng món gà viên popcorn xiên que dễ cầm ăn khi đang đạp xe.

---

### HÀNG 3: NHỊP SỐNG HÀNG RONG & LAO ĐỘNG ĐÊM

#### 13. Chị Thắm Gánh Tàu Hũ — `char_13_vendor_tham`
* **Hình tượng:** Đôi quang gánh trĩu nặng hai đầu với nồi nước đường gừng bốc khói thơm lừng và chén sành sạch bóng.
* **Sự kiện giao lưu:** *"Hàng Xóm Tối Lửa Tắt Đèn"* — Chị Thắm đề xuất đổi một âu tàu hũ gừng ấm bụng lấy 2 cánh gà giòn cho con trai. Chấp nhận giúp tăng `karma.community +2` và phục hồi tâm trạng nhân viên bếp.

#### 14. Bác Năm Ve Chai — `char_14_scrap_nam`
* **Hình tượng:** Chiếc xe cút kít gỗ kêu cọt kẹt, chất đầy thùng bìa carton và bao tải vỏ lon bia, nước ngọt.
* **Hành vi:** Tiệm gà mỗi ngày tích lũy vỏ lon Coca/7Up/Fanta và vỏ thùng bột chiên. Bạn có thể chọn gom lại cho bác Năm miễn phí để nhận điểm Karma và những lời chỉ dẫn quý giá về các thợ sửa đồ cũ giá rẻ.

#### 15. Chú Bảy Bánh Mì Dạo — `char_15_bread_bay`
* **Hình tượng:** Chiếc xe đạp gắn tủ kính đựng bánh mì vàng ươm giòn rụm với chiếc loa rao quen thuộc.
* **Cơ hội hợp tác:** Kết hợp mở khóa món mới độc quyền: *"Bánh Mì Kẹp Gà Giòn Sốt Yangnyeom"* gây sốt toàn quận!

#### 16. Anh Tư Kem Ống Tuổi Thơ — `char_16_icecream_tu`
* **Hình tượng:** Thùng kem inox tròn sau yên xe máy, tiếng kèn bóp "pin pin" thu hút bầy trẻ con trong hẻm.
* **Sự kiện Mùa Hè:** Vào những ngày nắng nóng đỉnh điểm (Nhiệt độ > 38°C), anh Tư đỗ xe trước quán hợp tác bán combo "Gà Cay Lửa Đỏ + Kem Dừa Mát Lạnh", tăng 40% doanh thu buổi chiều.

#### 17. Cô Lan Lao Công Ca Đêm — `char_17_sweeper_lan`
* **Hình tượng:** Người phụ nữ mặc áo phản quang cam, cầm cây chổi tre quét từng chiếc lá trên lòng đường lúc 11h đêm.
* **Sự kiện:** Khi tiệm sắp đóng cửa, cô Lan ghé qua. Nếu bạn tặng cô phần gà rán cuối ngày còn dư trong khay thay vì vứt bỏ, chỉ số may mắn ngày hôm sau sẽ tăng vọt, tránh được sự cố thanh tra môi trường.

#### 18. Chú Hùng Xe Rác Dân Lập — `char_18_garbage_hung`
* **Hình tượng:** Người đàn ông lực lưỡng đẩy chiếc xe rác thùng xanh chuyên dụng của hẻm.
* **Tác động:** Thu gom rác thải nhà bếp và dầu ăn đã qua sử dụng. Nếu bạn đối đãi tốt (mời nước, tip nhỏ), chú sẽ dọn sạch rác đúng giờ, không bao giờ để rác ứ đọng bốc mùi trước cửa tiệm.

---

### HÀNG 4: HỘI THỢ NGHỀ & DỊCH VỤ ĐÔ THỊ

#### 19. Anh Tuấn Shipper Ruột (App Driver) — `char_19_shipper_tuan`
* **Hình tượng:** Tài xế công nghệ áo xanh lá, nón bảo hiểm 3/4 có gắn giá đỡ điện thoại, thùng giữ nhiệt to sau xe.
* **Vai trò:** Nhận các đơn hàng online. Điểm kiên nhẫn cao hơn shipper vãng lai 30%. Nếu quán chuẩn bị đơn nhanh, anh Tuấn sẽ ưu tiên nhận đơn của quán đầu tiên trên hệ thống.

#### 20. Anh Cường Bốc Vác — `char_20_mover_cuong`
* **Hình tượng:** Thanh niên cơ bắp cuồn cuộn, áo thun ba lỗ xám, chuyên bốc xếp hàng hóa, bàn ghế nặng.
* **Vai trò nâng cấp:** Khi bạn mua sắm trang thiết bị mới (chảo chiên đôi, tủ đông, bàn ghế gỗ), anh Cường sẽ xuất hiện khuân vác lắp đặt tận nơi với chi phí hạt dẻ.

#### 21. Bác Tài Long (Xe tải đông lạnh) — `char_21_trucker_long`
* **Hình tượng:** Tài xế xe tải đường dài trung niên, dáng người bệ vệ, cầm vô lăng giao thịt gà sạch từ trang trại nông thôn vào nội thành.
* **Tác động:** Đảm bảo chuỗi cung ứng nguyên liệu không bị đứt gãy. Khi có sự cố kẹt xe cầu Sài Gòn, bác sẽ gọi điện báo trước để quán chủ động chuẩn bị kho.

#### 22. Anh Dũng Thợ Điện Lực — `char_22_electrician_dung`
* **Hình tượng:** Thợ điện áo cam bảo hộ, thắt lưng đeo đầy kìm, bút thử điện và cuộn băng keo cách điện.
* **Sự kiện khẩn cấp:** Chuyên gia xử lý sự cố *"Chập Điện Bếp Chiên"*. Cứu nguy cho quán khỏi cảnh mất điện giữa giờ cao điểm.

#### 23. Chú Bảy Thợ Hồ — `char_23_builder_bay`
* **Hình tượng:** Người thợ xây dựng đội nón bảo hộ vàng lấm lem vôi vữa, chiếc khăn rằn vắt ngang vai.
* **Hành vi:** Luôn gọi phần ăn nhiều tinh bột (Cơm gà xối mỡ hoặc đùi gà kèm khoai tây cỡ lớn), ăn no để lấy sức làm việc ca chiều.

#### 24. Dì Sáu Tạp Hóa Đối Diện — `char_24_grocer_sau`
* **Hình tượng:** Người phụ nữ phố thị phúc hậu, đeo tạp dề hoa, bán từ cây kim sợi chỉ đến chai nước mắm đầu hẻm.
* **Kho Cứu Trợ Khẩn Cấp:** Khi kho tiệm hết sạch dầu ăn, tương cà hoặc tương ớt giữa ca bán, người chơi có thể bấm nút "Cầu Cứu Dì Sáu" để mua nóng nguyên liệu với giá chênh lệch 10%, không làm gián đoạn ca bán.

---

### HÀNG 5: TRẬT TỰ ĐÔ THỊ & DRAMA HẺM PHỐ

#### 25. Đồng Chí Nam (Công an khu vực) — `char_25_police_nam`
* **Hình tượng:** Cán bộ công an trẻ trung, quân phục xanh lá nghiêm trang, tác phong đàng hoàng, chuẩn mực.
* **Sự kiện Kiểm Tra:** Định kỳ ghé thăm kiểm tra giấy phép kinh doanh, an toàn PCCC bình gas và giấy khám sức khỏe nhân viên. Nếu quán tuân thủ đầy đủ sẽ được cấp huy hiệu *"Tiệm Ăn Văn Hóa An Toàn"*.

#### 26. Đại Úy Hoàng (Cảnh sát giao thông) — `char_26_traffic_hoang`
* **Hình tượng:** Cán bộ CSGT quân phục vàng cát, còi đeo ngực, thường làm nhiệm vụ điều tiết nút giao đầu hẻm.
* **Sự kiện Trật Tự:** Nhắc nhở shipper đậu xe ngay ngắn, không lấn chiếm lòng hẻm gây ùn tắc giao thông.

#### 27. Anh Hải Dân Phòng — `char_27_warden_hai`
* **Hình tượng:** Nam thanh niên dân phòng áo xanh dương, đội mũ mềm, đi tuần tra đô thị hàng ngày.
* **Sự kiện Vỉa Hè:** *"Chiến Dịch Lòng Lề Đường"* — Nhắc nhở quán kê bàn ghế lùi vào trong vạch sơn quy định. Người chơi cần chấp hành để tránh bị thu bàn ghế.

#### 28. Đại Ca Beo (Giang hồ hẻm) — `char_28_tough_beo`
* **Hình tượng:** Gã đàn ông xăm trổ kín tay, đeo dây chuyền bạc to bản, mặt mũi bặm trợn hay dắt đàn em đi nghênh ngang.
* **Tuyến Sự Kiện Thử Thách:** Đòi thu "tiền rác, tiền an ninh" 500k/tháng.
  * *Nhượng bộ nộp tiền:* Mất tiền hàng tháng, `karma.ambition -1`.
  * *Báo Bác Ba & Công An:* Nhờ sự can thiệp của cộng đồng xóm giềng để giải quyết triệt để, củng cố `karma.community +3`.
  * *Nuôi Chó Cỏ Vàng:* Chú chó dũng cảm sủa vang đuổi gã chạy mất dép!

#### 29. Chị Nga Rút Tiền ATM — `char_29_atm_nga`
* **Hình tượng:** Cô gái trẻ đứng xếp hàng ở cây ATM đầu hẻm, tay cầm bóp tiền, ngửi thấy mùi gà rán thơm phức bèn ghé vào mua ăn tối.

#### 30. Nữ Sinh Chờ Xe Buýt — `char_30_student_bus`
* **Hình tượng:** Nữ sinh áo dài trắng thướt tha mang ba lô hồng, đứng đợi chuyến xe buýt số 08 trước hẻm, khách ruột của món gà viên popcorn lắc phô mai.

---

### HÀNG 6: GIAO LƯU HẺM & 3 ĐỘNG VẬT ĐẶC BIỆT

#### 31. Bà Tám Hóng Mát — `char_31_gossip_tam`
* **Hình tượng:** Người phụ nữ trung niên ngồi trên ghế nhựa đỏ, tay cầm quạt giấy, đôi mắt tinh anh quan sát mọi động tĩnh trong hẻm.
* **Cơ Chế "Camera Chạy Bằng Cơm":** Nếu bạn phục vụ tốt, bà Tám sẽ khen nức nở với cả xóm, tăng 25% lượng khách vãng lai. Nếu bạn bán gà sống hoặc cháy khét, tin đồn sẽ lan khắp hẻm chỉ sau 1 tiếng!

#### 32. Anh Tuấn Chạy Bộ (Fitness Guy) — `char_32_jogger_tuan`
* **Hình tượng:** Chàng trai yêu thể thao, băng đô thấm mồ hôi, áo thun sát nách, đồng hồ thông minh đo calo.
* **Yêu cầu đặc biệt:** Chỉ ăn ức gà áp chảo không da, không bột chiên, bổ sung đạm healthy sau buổi tập.

#### 33. Cặp Đôi Bách & Diệp (GenZ Hẹn Hò) — `char_33_couple_genz`
* **Hình tượng:** Đôi bạn trẻ nắm tay nhau dạo phố, chụp ảnh check-in bên ánh đèn vàng ấm cúng của quán.
* **Tác động Mạng Xã Hội:** Luôn chụp ảnh món ăn đăng lên Threads và Instagram Story, kích hoạt hiệu ứng viral thu hút giới trẻ tìm đến quán check-in.

---

## 3. TUYẾN SỰ KIỆN RIÊNG DÀNH CHO 3 ĐỘNG VẬT (ANIMAL ECOSYSTEM)

Theo đúng yêu cầu nghiệp vụ, 3 loài động vật không phải là khách mua hàng thông thường mà cấu thành một **Hệ Thống Tương Tác Bếp & Sự Kiện Môi Trường Độc Lập**:

```
                       ┌─────────────────────────┐
                       │   CHUỘT CỐNG ĐỘT NHẬP   │
                       │ (Dịch hại & Rủi ro ATTP)│
                       └────────────┬────────────┘
                                    │ Bị săn bắt
                                    ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│     CHÓ CỎ VÀNG         │    │    MÈO MƯỚP TAM THỂ     │
│ (Vệ sĩ trông quán & trộm│    │(Thần tài diệt chuột bếp)│
└─────────────────────────┘    └─────────────────────────┘
```

### 34. Chó Cỏ Vàng (Vệ Sĩ Cửa Tiệm) — `pet_01_dog_vang`
* **Nguồn gốc:** Chú chó cỏ lông vàng mượt, tai cụp thông minh, vốn là chó hoang hay lảng vảng trước hẻm tìm thức ăn.
* **Cơ chế thu nhận (Adoption Quest):**
  * Ngày 3: Chú chó đứng thập thò trước cửa với ánh mắt đói lả.
  * Nếu người chơi chọn: *Cho ăn mẩu sụn gà giòn + tô nước sạch*, chú chó sẽ chính thức ở lại làm "Thần giữ của" cho quán.
* **Tác dụng Gameplay:**
  * **Trông giữ tài sản:** Giảm 100% nguy cơ bị kẻ gian cạy két tiền lúc nửa đêm.
  * **Xua đuổi bảo kê:** Khi Đại Ca Beo đến hách dịch, Vàng sẽ sủa vang cảnh báo khiến kẻ xấu chùn bước.
  * **Tăng thiện cảm:** Khách quen ghé quán thích xoa đầu Vàng, tăng 10% độ kiên nhẫn khi phải xếp hàng đợi gà.

### 35. Mèo Mướp Tam Thể (Thần Tài Bắt Chuột) — `pet_02_cat_muop`
* **Nguồn gốc:** Nàng mèo tam thể duyên dáng với đôi mắt xanh biếc, hay leo trèo trên mái tôn quán gà ngửi mùi cá và gà chiên.
* **Cơ chế giữ chân:**
  * Sau khi mở khóa món cá viên hoặc vụn gà giòn, người chơi đặt một chiếc đĩa sứ nhỏ sau góc bếp.
  * Mèo Mướp sẽ định cư trong bếp, cuộn tròn ngủ bên cạnh bao bột.
* **Tác dụng Gameplay:**
  * **Khắc tinh số 1 của Chuột Cống:** Tự động triệt tiêu 90% các sự cố chuột xuất hiện trong kho thực phẩm.
  * **Thần tài hút lộc:** Biểu tượng may mắn giúp tăng 8% tiền Tip từ thực khách yêu động vật.
  * **Tăng điểm Vệ Sinh An Toàn Thực Phẩm:** Giúp quán đạt chứng nhận ATTP loại A dễ dàng.

### 36. Chuột Cống Đột Nhập (Sự Cố Khẩn Cấp Bếp) — `pest_01_rat_cong`
* **Hình tượng:** Con chuột cống lông xám mắt ti hí, chuyên rình rập ban đêm chui qua đường cống vào bếp cắn phá.
* **Cơ chế kích hoạt sự cố:**
  * Nếu người chơi không dọn rác cuối ngày hoặc để dầu chiên bẩn qua đêm, tỷ lệ chuột xuất hiện là 35%.
* **Hậu quả nếu không ngăn chặn:**
  * Cắn rách 1–3 bao bột chiên và bao khoai tây tươi (thiệt hại 300k–500k COGS).
  * Nếu chuột chạy ngang qua chân khách ban ngày: Khách hét toáng bỏ về, danh tiếng tụt dốc thảm hại (`reputation -1.5`).
* **Các phương án hóa giải:**
  1. *Nuôi Mèo Mướp:* Mèo tự động rình bắt chuột ngay khi vừa chui vào ống cống (Hiệu quả 100%, có cảnh hoạt họa mèo ngoạm chuột cực hài hước).
  2. *Đặt Bẫy Dính / Bẫy Lồng Inox:* Tốn 50k mua bẫy từ tiệm Dì Sáu.
  3. *Vệ sinh nhà bếp định kỳ:* Dùng hóa chất khử mùi và đậy kín nắp cống thoát nước.

---

## 4. TÀI LIỆU HÌNH ẢNH & PROMPT TẠO ASSET CHUẨN

Ảnh concept tổng thể 36 nhân vật đã được tạo và lưu trữ an toàn tại:
`characters_36_sheet_1790485603450.jpg`

### Quy Chuẩn Đồ Họa Cho Toàn Bộ 36 Sprite:
* **Phong cách:** 2D Flat Vector Sticker, nét viền nâu đậm ấm áp (#4a2810), màu sắc tươi sáng retro Sài Gòn.
* **Tỷ lệ cơ thể:** Chibi đầu to thân nhỏ (tỷ lệ 1:2), biểu cảm mắt to tròn, miệng cười rạng rỡ.
* **Bộ khung Animation (3 Frame chuẩn cho mỗi nhân vật):**
  1. `stand.png`: Đứng yên nhấp nhô thở nhẹ (Idle bob).
  2. `walk.png`: Bước đi chân sáo vào tiệm.
  3. `angry.png`: Nhăn mặt, giậm chân hoặc khoanh tay khi đợi lâu.
  4. `happy.png`: Cười tít mắt, giơ ngón tay cái khi nhận món giòn rụm.

---

## 5. ĐỀ XUẤT DATA CONTRACT BÀN GIAO CHO CLAUDE LEAD

Để tích hợp 36 nhân vật này vào hệ thống mã nguồn mà không phá vỡ logic cũ, Gemini đề xuất Claude bổ sung các type sau vào `src/types/game.ts`:

```typescript
// Định danh mở rộng cho 36 nhân vật Hẻm 1102
export type CharacterId =
  | 'char_01_owner' | 'char_02_lottery_lady' | 'char_03_helper_linh' | 'char_04_fryer_khang'
  | 'char_05_kid_bo' | 'char_06_granny_ba' | 'char_07_trendy_vy' | 'char_08_grumpy_hai'
  | 'char_09_buyer_tam' | 'char_10_winner_hung' | 'char_11_wholesale_nam' | 'char_12_courier_ut'
  | 'char_13_vendor_tham' | 'char_14_scrap_nam' | 'char_15_bread_bay' | 'char_16_icecream_tu'
  | 'char_17_sweeper_lan' | 'char_18_garbage_hung' | 'char_19_shipper_tuan' | 'char_20_mover_cuong'
  | 'char_21_trucker_long' | 'char_22_electrician_dung' | 'char_23_builder_bay' | 'char_24_grocer_sau'
  | 'char_25_police_nam' | 'char_26_traffic_hoang' | 'char_27_warden_hai' | 'char_28_tough_beo'
  | 'char_29_atm_nga' | 'char_30_student_bus' | 'char_31_gossip_tam' | 'char_32_jogger_tuan'
  | 'char_33_couple_genz'
  // Tuyến động vật & dịch hại
  | 'pet_01_dog_vang' | 'pet_02_cat_muop' | 'pest_01_rat_cong';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  roleTitle: string;
  category: 'staff' | 'regular' | 'street_worker' | 'authority' | 'transit' | 'animal';
  unlockChapter: number;
  favoriteOrder: string[];
  patienceMultiplier: number;
  tipTendency: 'low' | 'normal' | 'generous';
  karmaAffinity: 'community' | 'craftsmanship' | 'ambition';
  incidentIds: string[];
}
```

---

*Tài liệu được lập và chịu trách nhiệm chuyên môn bởi: **Gemini (Frontend & Visual Specialist)***
