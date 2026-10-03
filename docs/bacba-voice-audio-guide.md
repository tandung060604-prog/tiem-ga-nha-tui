# HƯỚNG DẪN TÀI NGUYÊN VOICE AUDIO & MÔ HÌNH GIỌNG NÓI BÁC BA NAM BỘ
# Dự Án: Tiệm Gà Nhà Tui (F&B Retro Pixel Simulation)

---

## 1. TỔNG QUAN YÊU CẦU & ĐỊNH VỊ GIỌNG NÓI BÁC BA

Nhân vật **Bác Ba Nam Bộ** (62 tuổi) là linh hồn cốt lõi của Tiệm Gà Nhà Tui — người truyền nghề bí truyền chảo gang dầu sôi từ thập niên 1990 tại Chợ Lớn.
- **Tính cách**: Đôn hậu, khẳng khái, thương người, hóm hỉnh, mộc mạc đậm chất Nam Bộ.
- **Chất giọng**: Trầm ấm, hơi khàn tự nhiên của người lớn tuổi từng trải, âm phát ra từ vòm họng và lồng ngực dày dặn, nhịp điệu thủ thỉ như người ông trong gia đình.
- **Tiêu chuẩn chất lượng**: **Tuyệt đối KHÔNG sử dụng Google Translate hay các giọng đọc TTS mặc định vô hồn** vì sẽ làm phá vỡ hoàn toàn bầu không khí ấm cúng (cozy atmosphere) của tiệm gà Hẻm 1102.

---

## 2. CÁC NGUỒN TÀI NGUYÊN & PHƯƠNG ÁN TẠO VOICE MODEL CHUYÊN NGHIỆP

### Phương án 1: Voice Cloning bằng AI Hiện Đại (Fish Audio / ElevenLabs) — *Khuyên Dùng Nhất*
Đây là phương án cho chất lượng âm thanh điện ảnh, tự nhiên và xúc cảm nhất hiện nay cho các tựa game indie:
1. **Thu thập mẫu giọng (Voice Sample)**:
   - Tìm kiếm 2–5 phút âm thanh sạch (không nhạc nền) của nghệ sĩ/người lớn tuổi miền Nam (ví dụ: các đoạn phát thanh đọc truyện đêm khuya đài VOH, trích đoạn cải lương xã hội, kịch Kim Cương/Bắc Sơn, hoặc thu âm người thân lớn tuổi).
2. **Tải lên Fish Audio (fish.audio) hoặc ElevenLabs (elevenlabs.io)**:
   - Tạo **Custom Voice Clone** với tên `BacBa_NamBo_Elderly`.
   - Thiết lập thông số:
     - Stability: 0.70 – 0.75 (giữ ngữ điệu ổn định, tránh vỡ tiếng).
     - Similarity: 0.85 – 0.90 (sao chép trung thực âm sắc trầm khàn).
     - Style Exaggeration: 0.15 (thêm chút hóm hỉnh đời thường).
3. **Bộ kịch bản xuất file (Prompt Voice Lines)**:
   - `bacba_intro`: *"Nè con! Vô phụ bác một tay nghen!"*
   - `bacba_khen`: *"Khà khà khà! Tay nghề vàng giòn được đó nghen con!"*
   - `bacba_canhbao`: *"Mèn đét ơi! Coi chừng chảo dầu khét lẹt kìa bay ơi!"*
   - `bacba_loikhuyen`: *"Nghe bác dặn nè: Làm đồ ăn là phải có cái tâm, dầu sạch gà tươi khách mới thương nghen con!"*
   - `bacba_chuckle`: *"Khà khà khà... Mùi gà chiên thơm nức cái hẻm này rồi!"*

---

### Phương án 2: Huấn Luyện Voice Model Offline Miễn Phí (F5-TTS & RVC)
Nếu muốn làm chủ hoàn toàn dữ liệu offline không phụ thuộc dịch vụ trả phí:
1. **RVC (Retrieval-based Voice Conversion)**:
   - Tải bộ công cụ RVC v2 mã nguồn mở từ GitHub.
   - Cung cấp dataset 10–20 phút giọng nam già miền Nam đã qua lọc tiếng ồn (tách bằng UVR5 - Ultimate Vocal Remover).
   - Huấn luyện khoảng 200–300 epochs để model học trọn vẹn đặc trưng thanh quản Nam Bộ.
2. **Datasets Tiếng Việt Mở**:
   - **VIVOS Dataset** (Hệ thống dữ liệu tiếng Việt mở chuẩn âm vị học).
   - **FOSD (FPT Open Speech Dataset)**: Chứa nhiều mẫu giọng vùng miền miền Nam.
   - **VietVoice-TTS**: Thư viện GitHub hỗ trợ voice synthesis tiếng Việt chất lượng cao.

---

### Phương án 3: Thu Âm Thực Tế Cùng Diễn Viên Lồng Tiếng (Voice Actor)
- Đăng bài tìm kiếm cộng tác viên trên nhóm **"Cộng Đồng Voice Acting Việt Nam"** hoặc các nền tảng lồng tiếng như VNVO Studio.
- Yêu cầu: Diễn viên lồng tiếng nói chuẩn giọng phương Nam (Sài Gòn / Tây Nam Bộ), giả giọng hoặc là nghệ sĩ lớn tuổi thực thụ.
- Chi phí cho gói game voiceover 10–15 câu ngắn thường rất dễ chịu và mang lại giá trị độc quyền 100% cho thương hiệu game.

---

## 3. CẤU TRÚC TÀI NGUYÊN ÂM THANH TRONG GAME

Toàn bộ các file âm thanh giọng nói của Bác Ba được lưu trữ tại thư mục:
```text
public/assets/audio/bacba/
├── bacba_intro.wav (hoặc .mp3)      # "Nè con!" - Chào mừng, bắt đầu ngày mới, bước đầu hướng dẫn
├── bacba_khen.wav (hoặc .mp3)       # "Khà khà! Được đó nghen!" - Khen chuỗi Perfect, đạt mốc doanh thu
├── bacba_canhbao.wav (hoặc .mp3)   # "Mèn ơi! Coi chừng kìa!" - Dầu đen, cháy gà, trật tự đô thị, khách quạu
├── bacba_loikhuyen.wav (hoặc .mp3) # "Nghe bác dặn nè!" - Mẹo làm bếp, cẩm nang truyền nghề, tiếp tế
├── bacba_chuckle.wav (hoặc .mp3)   # "Khà khà khà..." - Cười ấm áp, thư thái uống trà
└── bacba_babble.wav (hoặc .mp3)    # Tiếng lầm bầm ấm áp nhịp nhàng theo từng ký tự gõ chữ
```

> **Ghi chú về định dạng**: Hệ thống hỗ trợ cả `.wav` và `.mp3`. Khi dev hoặc người chơi thả file `.mp3` thu âm thật vào thư mục này, game sẽ tự động ưu tiên nạp và phát ngay lập tức.

---

## 4. KIẾN TRÚC HỆ THỐNG DUAL-ENGINE TRONG CODEBASE (`src/core/bacBaVoice.ts`)

Động cơ giọng nói `BacBaVoiceEngine` được thiết kế theo chuẩn **Dual-Engine tự động**:
1. **Lớp 1 (Authentic Audio Loader)**:
   - Tự động nạp trước các file âm thanh vào `AudioBuffer` của Web Audio API ngay khi có tương tác đầu tiên của người dùng (`onFirstUserTap`).
   - Phát âm thanh tức thời 0 độ trễ (0 latency), không cần nạp lại.
2. **Lớp 2 (Procedural Formant Uncle Synthesizer - Fallback An Toàn)**:
   - Khi chạy ở môi trường offline, hoặc khi chưa tải xong file tĩnh, hệ thống **không bao giờ bị câm tiếng hay báo lỗi**.
   - Bộ lọc Formant sinh tần số gốc $F_0 = 115\text{Hz} - 130\text{Hz}$ kết hợp bộ lọc khoang họng ($F_1 \approx 380\text{Hz}$) và khoang miệng ($F_2 \approx 1150\text{Hz}$), tái tạo trọn vẹn ngữ điệu người già Nam Bộ.
3. **Lớp 3 (Typewriter Vocal Babble)**:
   - Khi các dòng văn bản của Bác Ba xuất hiện trên màn hình, từng âm tiết tự động kích hoạt tiếng nhấp giọng nhẹ nhàng phong cách *Animal Crossing / Celeste*, mang lại cảm giác Bác Ba đang trò chuyện sống động trước mặt người chơi.
4. **Lớp 4 (Tự Động Kích Hoạt Đa Điểm)**:
   - **Onboarding Guide Ngày 1** (`OnboardingGuide.ts`): Bác Ba tự động cất tiếng gọi khi hướng dẫn các bước thả gà, chiên giòn, bán hàng.
   - **Bác Ba Live Tips** (`main.ts: triggerBacBaTipBanner`): Tự động phát âm thanh cảnh báo khi chảo dầu đen hoặc khách sắp hết kiên nhẫn; tự động khen ngợi khi đạt chuỗi Perfect.
   - **Cẩm Nang Bác Ba** (`BacBaManualModal.ts`): Tự động phát giọng truyền nghề khi mở sổ tay.
   - **Ký Ức Đêm & Cốt Truyện** (`StoryletModal.ts` & `StoryModal.ts`): Tự động cất tiếng chào và nhịp babble theo từng đoạn văn.
