# Story Bible v2 — Hẻm 1102

Thay thế nội dung trong [storyNovel.ts](../src/content/storyNovel.ts), [mysteryBunny.ts](../src/content/mysteryBunny.ts), [mysteryGuests.ts](../src/content/mysteryGuests.ts). Giữ lại phần lớn nhân vật và cảm xúc đã viết; sửa dòng thời gian, động cơ và vai trò của người chơi.

---

## 1. Vấn đề của tuyến truyện hiện tại

| Vấn đề | Chi tiết | Hướng sửa |
|---|---|---|
| **Lộ kết thúc** | Thư Thỏ Cam gắn theo ngày cố định 2/5/9/14/20/28. Ngày 14–20 kể vụ khủng hoảng MegaChicken (chương 4), ngày 28 kể lễ trao cúp Gà Vàng (ngày 210). Người chơi đang ở chương 1–2 | Mọi nội dung gắn **chương + % tiến độ chương**, không gắn ngày tuyệt đối |
| **Nhiệm vụ lệch chương** | Môi giới MegaChicken xuất hiện ngày 30 (chương 2), đối thủ chỉ có ở chương 4 | Dời sang chương 4, biến thành lựa chọn thật có hệ quả |
| **Người chơi đứng ngoài cao trào** | Hồi 4: Đức Huy, Quỳnh Anh, Food Reviewer giải quyết khủng hoảng; chủ tiệm không làm gì | Cao trào giải quyết bằng **gameplay của người chơi** (ngày livestream bếp mở) |
| **Thỏ Cam là ai?** | Biết mọi chuyện của mọi người, viết thư như người kể chuyện toàn tri, không bao giờ được giải thích | Cho Thỏ Cam một danh tính, lý do để viết thư, và màn lộ diện ở chương 5 |
| **Lệch giọng** | GDD: GenZ, meme, "mỗi review 1 sao là một content". Truyện: bi kịch văn xuôi dài, hiển thị như tường chữ | Giữ trái tim, thêm tiếng cười; cảnh ngắn dạng hội thoại, văn xuôi dài thành đồ sưu tập |
| **Trùng nhân vật** | Generator khách ngẫu nhiên sinh "Chị Mai Kế Toán", "Bác Ba Tổ Trưởng", "Đức Huy Cày Rank", "Bé Bắp Chill"; "Tuấn Shipper" vừa là khách quen vừa là ứng viên nhân viên ngẫu nhiên | Tên nhân vật cốt truyện nằm trong danh sách cấm của generator; Tuấn vào làm qua sự kiện truyện |
| **Mâu thuẫn chi tiết** | Na học trường múa nhưng cuối truyện đỗ Sư phạm; Bắp gọi chủ tiệm là "chú" (chủ tiệm không có giới tính cố định); "Anh/chị ơi" để nguyên; Hồi 2 có Trà Đào (mở chương 3), Hồi 3 có Kem Sundae (mở chương 4); Hồi 3 gọi là "khai trương chi nhánh" dù là dọn tiệm | Sửa theo bảng nhân vật mục 3; món xuất hiện trong truyện phải đã mở; cách xưng hô theo lựa chọn avatar ("anh"/"chị"/"bạn chủ tiệm") |
| **Chi tiết nhạy cảm** | Đức Huy "truy vết địa chỉ IP" tài khoản review (gợi ý doxxing); chị Lan tự kiện, livestream mắng | Huy phát hiện review ảo qua dấu vết công khai (cùng giờ đăng, cùng câu chữ, tài khoản mới tạo) |

---

## 2. Xương sống mới

**Chủ đề một câu:** *Giữ lửa nhỏ mà không để lửa tắt khi quán lớn.* Mỗi chương đặt người chơi trước cám dỗ "làm nhanh, làm rẻ" và cho họ chứng minh điều ngược lại bằng chính cách chơi.

**Câu hỏi bí ẩn xuyên suốt:** *Ai là Thỏ Cam, và vì sao bạn ấy biết về tiệm gà Chợ Lớn của Bác Ba?*

### Danh tính Thỏ Cam (lộ diện chương 5)

- **Mimi (Võ Minh Mi), 22 tuổi**, làm nghề **mặc đồ thú bông phát tờ rơi** quanh các con hẻm quận (nghề rất Sài Gòn). Bộ đồ là chú thỏ đội mũ trùm áo hoodie cam.
- Vì sao viết giấy: người mặc đồ thú bông không được nói chuyện khi đang làm (giữ hình tượng). Mimi lại nhút nhát, nên viết giấy.
- Vì sao biết mọi người: cả ngày đi phát tờ rơi khắp hẻm, ai cũng quen "con thỏ cam".
- Liên hệ Bác Ba: Mimi là cháu ngoại **ông Võ Hòa**, chủ tiệm "Gà Chợ Lớn" năm 1990 nơi Bác Ba làm bếp chính. Tiệm đóng cửa sau khi ông Hòa mất. Mimi lớn lên với mùi gà chiên ấy và nhận ra nó ở xe đẩy của người chơi (Bác Ba đã truyền bí quyết).
- Nút thắt chương 4: MegaChicken thuê công ty sự kiện của Mimi đóng mascot phát voucher giảm 50% ngay trước cửa tiệm người chơi. Mimi phải chọn giữa việc làm và tiệm mình thương.
- Kết: Mimi cởi mũ thỏ trên sân khấu Gà Vàng, người chơi có thể mời Mimi làm **Quản lý chi nhánh Chợ Lớn**, mở lại biển hiệu "Gà Chợ Lớn" như một chi nhánh.

### Ba đối thủ hư cấu (theo GDD: 3 chuỗi, phản diện hài, không nhại linh vật có thật)

| Chuỗi | Mặt tiền | Phản diện | Giọng hài | Xuất hiện |
|---|---|---|---|---|
| **MegaChicken** | Tòa kính 3 tầng, màu xanh lạnh | **Mr. Mega (Mạc Gia Khang)**, CEO nói tiếng Anh xen kẽ, KPI là tôn giáo | "Synergy! Scale! Gà là data!" | Chương 4 (chính), 5 |
| **Oppa Crunch** | Gà Hàn neon hồng | **Chị Kim Bảo Ngọc**, trend-chaser đổi menu mỗi tuần | Đu trend nhanh hơn trend | Chương 3 (phụ), 4 |
| **Gà Nướng Sếp Lớn** | Chuỗi cơm văn phòng | **Anh Sếp Lớn**, hứa giao 7 phút nhưng luôn trễ | Tự tin sai chỗ | Chương 5 (thị phần chi nhánh) |

---

## 3. Bảng nhân vật (chốt để tránh mâu thuẫn)

| Nhân vật | Tuổi / vai | Chi tiết cố định | Vào game ở | Vai trò gameplay |
|---|---|---|---|---|
| Chủ tiệm (người chơi) | 24–28, tự chọn avatar | Xưng hô theo avatar: "anh", "chị" hoặc trung tính "bạn chủ tiệm" | Chương 1 | — |
| **Gà Bông** | Linh vật | Gà con đội mũ đầu bếp, giọng meme, bình luận hài cuối mỗi cảnh | Chương 1 | Nhân vật hướng dẫn phụ, sticker |
| **Bác Ba** (Lương Văn Ba) | 68, tổ trưởng dân phố | Cựu bếp chính "Gà Chợ Lớn" của ông Võ Hòa | Chương 1 | Dạy tutorial chiên; giải cứu khi hết vốn (1 lần/chương) |
| **Minh Trí + nhóm bàn cuối** | 17, lớp 12A1 | 3 bạn: Minh Trí, Gia Hân, Khôi | Chương 1 | Khách quen đầu tiên; mở combo học sinh |
| **Na** (Lê Bảo Na) | 18, học **múa** | Thi vào **Học viện Múa**, không phải Sư phạm | Chương 2 | Cặp đôi bàn số 2 |
| **Dũng** (Trần Dũng) | 18, vẽ truyện tranh | Nhà khó khăn, thi Đại học Mỹ thuật | Chương 2 | Vẽ logo tiệm (mở tùy biến logo) |
| **Anh Long** (Lê Hoàng Long) | 32, anh trai Na | Trưởng phòng kinh doanh | Chương 2 | Xung đột; sau thành khách đặt bucket công ty |
| **Chị Mai** (Phạm Thu Mai) | 34, kế toán, mẹ đơn thân | Làm ở tòa văn phòng đối diện mặt tiền | Chương 3 | Khách trưa; chương 5 thành kế toán chuỗi |
| **Bé Bắp** | 7, con chị Mai | Gọi chủ tiệm theo xưng hô avatar ("anh chủ"/"chị chủ") | Chương 3 | "Góc học tập" bàn số 1 |
| **Anh Tuấn** (Hồ Minh Tuấn) | 27, shipper | Vào làm nhân viên giao hàng **qua sự kiện truyện**, không có trong pool ứng viên ngẫu nhiên | Chương 3 | Mở trạm giao hàng; đội trưởng vận chuyển chương 5 |
| **Chị Lan** (Đỗ Ngọc Lan) | 45, bán vải chợ | Khó tính vì đang lo viện phí cho mẹ | Chương 3 (khách), 4 (cao trào) | Khách khó tính "chuẩn Perfect" |
| **Quỳnh Anh** | 23, TikToker ẩm thực | Từng bị tiệm từ chối quảng cáo trả tiền | Chương 3 | Mở nhánh Marketing livestream |
| **Đức Huy** | 20, sinh viên IT, cú đêm | Game thủ, ca tối | Chương 3 | Phát hiện review ảo (chương 4) |
| **Food Reviewer "Ông Kính Tròn"** | Ẩn danh | Không bao giờ lộ mặt, chỉ thấy cặp kính | Chương 2 (sự kiện), 4 | Sự kiện ngày chấm điểm |
| **Thỏ Cam / Mimi** | 22 | Như mục 2 | Chương 1 (thỏ), 5 (lộ diện) | Thư theo tiến độ; nhân viên quản lý sau cùng |

Quy tắc: nhân vật cốt truyện **không** được sinh ra bởi `CharacterGenerator`; đưa tên vào danh sách loại trừ.

---

## 4. Tuyến theo chương

Mỗi chương có 3 nhịp: **Mở** (cutscene khi vào chương), **Giữa** (sự kiện ở ~50% tiến độ), **Chốt** (thử thách gameplay để qua chương). Thư Thỏ Cam: 2 thư mỗi chương, ở ~25% và ~75% tiến độ.

### Chương 1 — Xe Đẩy Đầu Hẻm (ngày 1–15)
- **Mở (ngày 1, là tutorial):** Chiều mưa, 850.000đ vốn. Bác Ba đứng sau lưng: "Dầu chưa tới mà thả là ngấy, quá lửa là đắng." Bác dạy chiên → vớt đúng vùng vàng → giao. Nhóm Minh Trí trú mưa, gom 30 nghìn, mua phần khoai đầu tiên. Gà Bông: "Doanh thu ngày đầu: 30k. Cảm xúc: vô giá. Tiền nhà: vẫn phải trả 🥲".
- **Thư 1 (25%):** Thỏ Cam dán giấy lên thùng xe: "Mùi gà này… giống một tiệm ở Chợ Lớn mình từng biết." (gieo bí ẩn, không kể thêm).
- **Giữa:** Minh Trí rủ cả lớp tới sau giờ thi thử → ngày đông khách đầu tiên (sự kiện +50% khách học sinh).
- **Thư 2 (75%):** "Bác Ba đứng xa nhìn bạn chiên lâu lắm. Bác ấy không khen ai dễ đâu."
- **Chốt:** Nút hành động **"Đặt cọc mặt bằng hẻm 14 — 5.000.000đ"** + sao ≥ 3,5. Bấm là trừ tiền, cutscene dọn tiệm.

### Chương 2 — Tiệm Trong Hẻm (ngày 16–50)
- **Mở:** Tiệm số 14, 4 bàn gỗ, giàn hoa giấy. Thuê 2 nhân viên đầu (Bảo Anh thu ngân, Minh Khang bếp). Mở combo và 5 tiêu chí sao.
- **Thư 3:** "Bàn số 2 có hai bạn chia nhau nửa miếng gà mật ong. Bạn nam vẽ tặng mình một con thỏ." (Na & Dũng).
- **Giữa — lựa chọn đầu tiên:** Anh Long xông vào kéo Na về. Người chơi chọn:
  1. *Mời anh Long ngồi, đặt đĩa gà sốt cay* → cảnh gốc được giữ (ký ức hai anh em chia mì tôm). Long ra điều kiện thi thử cho Dũng. Mở khách "Long đặt bucket công ty" chương 3.
  2. *Không can thiệp* → Na về, bàn số 2 trống 7 ngày; Dũng quay lại một mình và vẽ logo tặng tiệm (vẫn mở tùy biến logo, nhưng mất khách bucket).
- **Sự kiện:** "Ông Kính Tròn" ghé một ngày ngẫu nhiên, chấm điểm theo Perfect + dầu sạch (thay quest Thanh Tra cũ).
- **Thư 4:** "Tuần sau có người sẽ tới mời bạn một thứ rất hời. Hời quá thì cẩn thận nha." (tiền đề cho chương 4, không nói ai).
- **Chốt:** Đặt cọc mặt tiền **30.000.000đ** + sao ≥ 4,0.

### Chương 3 — Mặt Tiền Phố (ngày 51–100)
- **Mở:** Dọn ra mặt tiền 12 bàn, đèn neon, máy in đơn app kêu "ting ting". Gà Bông: "Tiệm to rồi, stress cũng to theo 📈".
- **Tuyến Mai & Bắp:** Bắp ngồi chờ mẹ ở phòng bảo vệ tòa đối diện. Sự kiện truyện: Tuấn (shipper đang chạy đơn cho tiệm) xin nghỉ app để **vào làm cho tiệm**, chiều nào cũng tiện đón Bắp về bàn số 1. → Mở trạm giao hàng + Tuấn là nhân viên giao hàng đặc biệt.
- **Thư 5:** "Hôm nay mưa to, chị Mai về trễ. Trên bàn có hộp gà giữ nóng và mảnh giấy của anh Tuấn." (giữ cảnh cảm động gốc).
- **Giữa:** Quỳnh Anh đề nghị quảng cáo trả tiền 3 triệu. Người chơi chọn nhận hoặc từ chối (từ chối: Quỳnh Anh tò mò, theo dõi tiệm; nhận: +khách ngắn hạn, mất đồng minh ở chương 4).
- **Oppa Crunch** mở gần đó, đổi trend liên tục (mini đối thủ, dạy cơ chế món limited).
- **Thư 6:** "Chị Lan hay gắt vì mẹ chị ấy đang nằm viện. Nếu chị ghé, bạn thử tặng một ly trà đào nhé." → Nhiệm vụ nhỏ: tặng trà đào khi chị Lan tới (trà đào đã mở ở chương 3).
- **Chốt:** 4,5 sao + top 3 bảng xếp hạng quận + quỹ **90.000.000đ** cho chiến dịch mở rộng.

### Chương 4 — Tiệm Hot Trend (ngày 101–150)
- **Mở:** MegaChicken xây tòa kính 3 tầng đối diện. Mr. Mega tới chào: "Your little shop is… cute. Bán công thức cho tôi 15 triệu, win-win."
- **Lựa chọn lớn (có hệ quả kết thúc):**
  1. *Bán công thức:* +15.000.000đ, nhưng Bác Ba thất vọng rời khỏi truyện; mất kết thúc tốt nhất.
  2. *Từ chối:* Mr. Mega tuyên chiến.
- **Nút thắt Thỏ Cam:** MegaChicken thuê công ty sự kiện của Mimi đứng trước cửa tiệm người chơi phát voucher -50%. Thư 7: "Xin lỗi. Hôm nay mình phải đứng đây. Mình không muốn." Người chơi có thể mang gà ra cho con thỏ (tăng độ thân với Mimi).
- **Khủng hoảng:** Loạt review 1 sao ảo "dầu đen như hắc ín". Chị Lan đọc được, tới tiệm chất vấn.
- **Cao trào do người chơi giải quyết — "Ngày Bếp Mở":** Một ca livestream đặc biệt: camera quay bếp suốt ca. Điều kiện thắng: dầu sạch cả ca (thay dầu đúng lúc), tỉ lệ Perfect ≥ 70%, không khách nào bỏ về. Đồng minh **hỗ trợ theo lựa chọn trước đó**: Quỳnh Anh livestream (nếu chương 3 đã từ chối quảng cáo trả tiền), Đức Huy đăng bằng chứng review ảo (cùng giờ đăng, câu chữ giống nhau, tài khoản mới tạo), chị Lan quay lại xin lỗi (nếu đã tặng trà đào).
  - Thắng: minh oan, khách xếp hàng, Mr. Mega rút bớt quảng cáo.
  - Thua: vẫn qua được nhưng chương 5 bắt đầu với sao thấp hơn và ít đồng minh hơn (không có game over cứng).
- **Thư 8:** "Mình nghỉ làm ở công ty sự kiện rồi. Mai mình sẽ đứng ở đây, không mặc đồ thỏ nữa." (chưa lộ mặt, chỉ báo trước).
- **Chốt:** thắng thị phần quận trước MegaChicken + 4,6 sao.

### Chương 5 — Chuỗi Gà Quốc Dân (ngày 151–210)
- **Mở:** Bếp trung tâm, 5 chi nhánh, 25+ nhân viên. Đề bạt quản lý chi nhánh từ nhân viên lâu năm. Gà Nướng Sếp Lớn cạnh tranh giao hàng.
- **Thư 9:** "Bạn có muốn biết mình là ai không? Hãy hỏi Bác Ba về ông Võ Hòa."
- **Giữa — lộ diện:** Bác Ba kể về tiệm "Gà Chợ Lớn" và ông Võ Hòa. Hôm sau một cô gái mặc hoodie cam, tay cầm mũ thỏ, đứng trước quầy: Mimi. Mời Mimi làm Quản lý chi nhánh Chợ Lớn → mở chi nhánh thứ 5 mang biển "Gà Chợ Lớn".
- **Thư 10 (thư cuối, viết khi không còn là thỏ):** Lời cảm ơn, ký tên "Mi".
- **Chốt / Kết thúc (theo lựa chọn và chỉ số):**
  | Kết thúc | Điều kiện | Nội dung |
  |---|---|---|
  | **Gà Vàng Hẻm 1102** (tốt nhất) | Không bán công thức, thắng Ngày Bếp Mở, 5 chi nhánh ≥ 4,7 sao | Lễ Gà Vàng; Bác Ba trao chiếc vá chiên gia truyền của ông Võ Hòa; đủ dàn nhân vật lên sân khấu |
  | **Tiệm Tử Tế** | Không bán công thức, chưa đủ 4,7 sao | Không đoạt cúp, nhưng cả hẻm tổ chức tiệc tại tiệm số 14. Mở New Game+ |
  | **Đại Gia Lạnh Lùng** | Đã bán công thức | Chuỗi giàu nhất nhưng thiếu Bác Ba; cảnh cuối là xe đẩy cũ phủ bạt. Gợi ý chơi lại |

**Sửa chi tiết cảnh cuối cũ:** Na đỗ **Học viện Múa**, Dũng đỗ **Mỹ thuật**; Long làm nhà đầu tư nhỏ; Mai kế toán chuỗi; Tuấn đội trưởng giao hàng; Bắp ôm gấu bông Gà Bông.

---

## 5. Cách trình bày trong game

- **Cảnh hội thoại** (visual novel mini): nền cảnh theo chương + chân dung 2 nhân vật + khung thoại. 4–10 câu, chạm để tiếp, nút "Bỏ qua" luôn hiện. Mỗi cảnh kết bằng 1 câu hài của Gà Bông.
- **Thư Thỏ Cam**: tờ giấy note màu cam dán trên thùng xe/quầy, 2–4 câu, chữ viết tay. Không kể chuyện hộ nhân vật khác; chỉ quan sát và đặt câu hỏi.
- **Sổ Hẻm 1102**: văn xuôi dài (tái dùng phần hay trong `storyNovel.ts` đã sửa mâu thuẫn) mở sau khi xem cảnh, để ai thích đọc thì đọc.
- **Định dạng nội dung**: viết cảnh bằng ink (`.ink` → biên dịch sang JSON, chạy bằng inkjs), biến truyện (`sold_recipe`, `helped_lan`, `refused_paid_ad`, `mimi_affinity`) đồng bộ hai chiều với `GameState`.

## 6. Kiểu dữ liệu đề xuất

```ts
type ChapterNo = 1 | 2 | 3 | 4 | 5;
type StoryTrigger =
  | { kind: 'chapterStart'; chapter: ChapterNo }
  | { kind: 'chapterProgress'; chapter: ChapterNo; atLeast: 0.25 | 0.5 | 0.75 }
  | { kind: 'flag'; flag: StoryFlag };
type StoryFlag = 'sold_recipe' | 'helped_lan' | 'refused_paid_ad' | 'won_open_kitchen' | 'long_reconciled';
interface StoryBeat { id: StoryBeatId; trigger: StoryTrigger; inkKnot: string; reward?: Reward }
type Reward =
  | { kind: 'criteriaBoost'; criteria: Criteria; value: number } // cộng vào tiêu chí, không cộng overall
  | { kind: 'buff'; effect: 'customers' | 'patience'; pct: number; days: number }
  | { kind: 'unlock'; feature: FeatureId }
  | { kind: 'money'; amount: VND };
```

Tiến độ chương (`0..1`) tính từ mốc hành động của chương (tiền quỹ đã góp + sao), dùng chung cho thanh tiến độ trên bảng phấn và cho trigger truyện.
