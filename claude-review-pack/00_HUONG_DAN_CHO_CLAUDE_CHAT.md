# HƯỚNG DẪN REVIEW TOÀN DIỆN CHO CLAUDE CHAT (CLAUDE.AI)
# Dự Án: Tiệm Gà Nhà Tui (Game Quản Lý Bán Gà Rán Sài Gòn & Visual Novel Mini)

---

## 🎯 VAI TRÒ CỦA CLAUDE CHAT
Bạn là **Lead Game Designer & Narrative Director** cho dự án game indie *"Tiệm Gà Nhà Tui"* (Web Mobile, TypeScript thuần, Vite). Người dùng gửi bộ hồ sơ này để bạn review, góp ý và hoàn thiện 2 trọng tâm lớn:

1. **Review & Tối ưu Gameplay Logic:**
   - Cơ chế mua hàng và hoàn trả vốn (`-5`) ở kho nguyên liệu.
   - Cơ chế phân tầng mở khóa nguyên liệu (Progression): Ngày 1 chỉ mở 5 món cơ bản, các món sau mở theo mốc ngày kết hợp phí mở khóa đại lý (Unlock fee).
   - Đánh giá sự cân bằng kinh tế giữa tiền vốn khởi đầu (850k), tiền cọc mặt bằng (5tr), hạn dùng của kho FIFO và giá bán món ăn.

2. **Thiết kế Hệ Thống Hội Thoại Phân Nhánh & Ma Trận Đa Kết Thúc (Multi-Ending):**
   - Cách xây dựng các cây hội thoại (Dialogue Trees) trong Visual Novel Mini: Người chơi chọn các option ra sao thì ảnh hưởng tới chỉ số ngầm (`KarmaState`: Tình thân hẻm, Bản sắc nghệ nhân, Tham vọng quy mô).
   - Lựa chọn ở quá khứ/chương trước sẽ dẫn tới hiệu ứng cánh bướm (Butterfly Effects) thế nào khi nổ ra khủng hoảng ở chương sau (cuộc chiến cạnh tranh với chuỗi MegaChicken).
   - Hoàn thiện kịch bản chi tiết cho 4 đại kết cục:
     * **🏆 Happy Ending (Đại Viên Mãn):** Chuỗi gà tri kỷ, Mimi cởi mũ mascot Thỏ Cam nhận chức điều hành chi nhánh Chợ Lớn, khôi phục bảng hiệu 1990 của ông ngoại.
     * **🌱 Open Ending (Bình Dị An Yên):** Quán nhỏ êm đềm đầu hẻm, Mimi sống bình dị, không mở chuỗi lớn.
     * **💀 Bad Ending 3A (Phá Sản):** Vỡ nợ tiền cọc mặt bằng, bị dẹp xe đẩy trong chiều mưa.
     * **💔 Bad Ending 3B (Mất Chất):** Bán mình cho tập đoàn, mở 50 chi nhánh đồ ăn công nghiệp dở tệ, Bác Ba và Thỏ Cam thất vọng rời đi.
     * **🌟 Secret Ending (Nghệ Nhân 1975):** Đạt 5.0 sao tuyệt đối, nhận chiếc vá dát đồng thau gia truyền.

---

## 📂 DANH MỤC TỆP TIN TRONG GÓI REVIEW NÀY

1. `01_DE_XUAT_GAMEPLAY_VA_ENDINGS.md`: Bản đề xuất chi tiết của Gemini về kho, tiến trình mở khóa và ma trận kết thúc.
2. `02_STORY_BIBLE_HEM_1102.md`: Cốt truyện trung tâm Hẻm 1102, danh tính Mimi Thỏ Cam, 3 chuỗi đối thủ.
3. `03_GDD_KE_HOACH_TONG_QUAN.md`: Thiết kế game gốc (GDD), các giai đoạn nâng cấp tiệm.
4. `04_TYPES_GAME_CONTRACT.ts`: Toàn bộ định nghĩa interface dữ liệu của game.
5. `05_STATE_VA_VONG_LAP_NGAY.ts`: Khởi tạo state, quản lý 3 pha trong ngày (chuẩn bị, bán hàng, tổng kết).
6. `06_ECONOMY_KINH_TE.ts`: Thuật toán tính tiền, tip, phạt, đánh giá điểm sao.
7. `07_COOKING_NAU_AN.ts`: Thuật toán 5 vùng chín của gà chiên và chất lượng dầu.
8. `08_INVENTORY_KHO_FIFO.ts`: Logic quản lý kho theo lô hàng FIFO có hạn dùng.
9. `09_INVENTORY_CONTENT_10_MON.ts`: Dữ liệu 10 nguyên liệu trong game.
10. `10_MENU_CONG_THUC.ts`: Bảng công thức món ăn và giá bán.
11. `11_CUSTOMERS_12_NHAN_VAT.ts`: Hồ sơ tính cách, tiểu sử của 12 nhân vật quen thuộc.
12. `12_INVENTORY_TAB_UI.ts`: Giao diện và sự kiện mua hàng hiện tại.
13. `13_MENU_TAB_UI.ts`: Giao diện menu và sổ ký ức Thỏ Cam.
14. `14_SKILL_NARRATIVE_DIRECTOR.md`: Cẩm nang giọng văn GenZ và phương pháp biên kịch.

---

## 💬 YÊU CẦU ĐẦU RA CHO CLAUDE CHAT:
Hãy đọc toàn bộ tài liệu trên và đưa ra:
1. Đánh giá nhận xét & đề xuất cải tiến cụ thể về Gameplay Logic & Tiến trình kho.
2. Bản phác thảo kịch bản phân nhánh mẫu cho 1 cuộc hội thoại then chốt giữa Chủ tiệm, Bác Ba và Bé Thỏ Cam Mimi (thể hiện rõ các lựa chọn và biến số thay đổi).
3. Đề xuất hoàn thiện kịch bản 4 kết thúc sao cho giàu cảm xúc, đậm chất đời sống Sài Gòn và mang tính giáo dục/nhân văn cao.
