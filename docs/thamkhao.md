Role: Bạn là một Kiến trúc sư phần mềm kiêm Chuyên gia phát triển Web-game cao cấp.
Task: Hãy thiết kế cấu trúc thư mục, kiến trúc hệ thống và lập trình một dự án Web-game giáo dục (vừa học vừa chơi) môn Toán cấp 3 (THPT) tại Việt Nam.(nút bấm chuyển tiếng Anh/Việt)

MÔ HÌNH VẬN HÀNH HỆ THỐNG (TỐI ƯU CHI PHÍ & TRÁNH PHÁT SINH PHÍ AI KHI GAME CHẠY)

1. Cơ chế Lưu trữ: Không gọi API của AI theo thời gian thực khi học sinh đang chơi game nhằm tránh rủi ro tài chính phát sinh. Toàn bộ câu hỏi, đáp án, và phân tích lời giải chi tiết phải được lưu trữ sẵn trong cơ sở dữ liệu quan hệ (PostgreSQL).
2. Tính năng tạo thư viện câu hỏi, nạp câu hỏi hàng loạt cho Admin (AI Bulk Generator & Moderation Queue):
   - Tại trang quản trị Admin, thiết kế một tính năng cho phép Admin nhập số lượng câu hỏi mong muốn (Ví dụ: 100 câu, 500 câu) và chọn Phần kiến thức (Phần I, II, hoặc III theo cấu trúc Bộ GD&ĐT mới nhất).
   - Khi bấm nút, Backend Node.js sẽ gọi đến API của OpenAI/Anthropic để tự động sinh hàng loạt câu hỏi chuẩn hóa dưới dạng JSON.
   - Các câu hỏi mới sinh này sẽ nằm ở một bảng tạm gọi là Hàng đợi kiểm duyệt (Moderation Queue). Admin có quyền xem trước nội dung, đáp án, lời giải chi tiết để chỉnh sửa, bấm [Xóa/Làm lại] hoặc bấm [Phê duyệt] để chính thức nạp câu hỏi vào Database chính của game.
3. Thuật toán tạo đề thi (Matrix Exam Generator): Khi học sinh bấm nút làm bài, Backend Node.js sử dụng thuật toán bốc ngẫu nhiên câu hỏi từ Database chính dựa trên ma trận đề thi chuẩn (12 câu Phần I, 4 câu Phần II, 6 câu Phần III) tạo thành một đề thi hoàn chỉnh nhưng phong phú, không trùng lặp cho học sinh làm một cách hoàn toàn miễn phí.

TIÊU CHUẨN CẤU TRÚC ĐỀ THI & RÀNG BUỘC TOÀN VẸN DATABASE
Hệ thống Database phải được thiết kế chuẩn chỉnh để lưu trữ cấu trúc đề thi THPT mới nhất (đặc biệt là dạng toán thực tế không gian Oxyz/Xác suất). Hãy tự động thiết kế các bảng dữ liệu đáp ứng:

- Bảng `questions`: Lưu thân bài, ngữ cảnh (context_text), chủ đề, khối lớp, hình ảnh minh họa (image_url).
- Bảng `question_sub_items`: Lưu chi tiết các lệnh hỏi phụ, áp dụng nghiêm ngặt cho Phần II (gồm 4 ý nhỏ a, b, c, d độc lập trong cùng một câu hỏi lớn). Mỗi ý nhỏ chứa văn bản câu hỏi, đáp án đúng/sai (boolean), và đoạn văn phân tích lời giải chi tiết cho riêng ý đó. Thiết lập ràng buộc khóa ngoại FOREIGN KEY kết hợp ON DELETE CASCADE với bảng chính để bảo đảm toàn vẹn, tránh rác dữ liệu.
- Thuật toán chấm điểm lũy tiến (Scoring Engine): Viết hàm JavaScript ở Backend để tự động tính điểm chuẩn cho Phần II Đúng/Sai (Đúng 1/4 ý = 0.1 điểm; Đúng 2/4 ý = 0.25 điểm; Đúng 3/4 ý = 0.5 điểm; Đúng 4/4 ý = 1.0 điểm) để lưu vào bảng lịch sử làm bài của User (`exam_sessions` và `student_sub_answers`).
- Trang Admin xem lại: Cho phép Admin tra cứu thông tin của mọi User, bấm xem chi tiết từng bài thi để đối chiếu giao diện trực quan (Đề bài, đáp án học sinh chọn, các câu bị sai, và bảng phân tích lời giải chi tiết).

VẬN HÀNH GAME & ĐỒNG BỘ DOANH THU QUẢNG CÁO (FRONTEND HTML/CSS/JS)

- Thiết kế giao diện game mượt mà bằng HTML, CSS, JavaScript thuần (hoặc Framework tùy bạn đề xuất).
- Xây dựng file cấu trúc Frontend dạng Modular (Ví dụ: `PlatformManager.js`) để quản lý các hàm trung gian, giúp dễ dàng bật/tắt hoặc cấu hình SDK quảng cáo của các nền tảng game quốc tế như Poki, CrazyGames, GamePix, itch.io.
- Tích hợp các điểm ngắt tự nhiên (Natural Break Points) để gọi SDK quảng cáo video (Rewarded Video / Interstitial Ad) khi học sinh bấm vào các nút thưởng mang tính giáo dục:
  - Nút "Xem Đáp Án" (Mở khóa khi đạt cột mốc/combo làm bài).
  - Nút "Xem Phân Tích Lời Giải Chi Tiết" (Tạo khoảng trống thời gian cho học sinh đọc hiểu và chạy quảng cáo).
  - Tính năng "Sổ Tay Sửa Sai" (Mistake Notebook): Tự động gom các câu làm sai của user để họ có thể vào làm lại và xem AI phân tích nguyên nhân lỗi sai.

QUY TRÌNH THỰC THI (HÃY PHÁT HUY TỐI ĐA SỰ SÁNG TẠO VÀ SỰ THÔNG MINH CỦA BẠN)
Bước 1: Phân tích toàn bộ yêu cầu trên, đề xuất cấu trúc thư mục dự án tối ưu và xuất ra Bản thiết kế chi tiết (SQL Schema) các bảng Cơ sở dữ liệu có đầy đủ các ràng buộc toàn vẹn dữ liệu.
Bước 2: Sau khi hiển thị bản thiết kế cấu trúc, hãy tự động tiến hành lập trình viết toàn bộ các file code cốt lõi cho cả Backend Node.js (API kết nối, Module AI Routing sinh đề hàng loạt, thuật toán bốc đề ma trận, thuật toán chấm điểm Phần II) và Frontend (Giao diện game, Trang quản trị Admin, logic tương tác nút thưởng kết hợp SDK quảng cáo mẫu) để tạo thành một bộ khung xương hoàn chỉnh (Boilerplate) chạy được ngay cho dự án này.
