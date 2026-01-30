
# Hệ thống Phản ánh Bệnh viện Đa khoa Ninh Thuận

Ứng dụng web chuyên nghiệp dành cho việc tiếp nhận và xử lý phản ánh của bệnh nhân.

## 🚀 Cách chạy trên máy cục bộ (Local)
1. Cài đặt [Node.js](https://nodejs.org/)
2. Mở terminal tại thư mục dự án và chạy:
   ```bash
   npm install
   npm run dev
   ```

## 🌐 Triển khai lên GitHub Pages
1. Push code lên một repository GitHub tên là `main`.
2. Vào tab **Settings** > **Pages** của Repository.
3. Tại mục **Build and deployment** > **Source**, chọn **GitHub Actions**.
4. Chờ vài phút để quy trình tự động chạy (tab **Actions**).

## ⚡ Triển khai lên Vercel (Khuyên dùng)
1. Kết nối repository GitHub với Vercel.
2. Trong phần **Environment Variables**, thêm `API_KEY` (Mã Gemini API của bạn).
3. Vercel sẽ tự động nhận diện cấu hình Vite và deploy.
