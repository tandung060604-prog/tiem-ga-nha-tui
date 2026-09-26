import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false
  },
  build: {
    // iOS Safari 14+ (iPhone 6s trở lên chạy được iOS 15): không để cú pháp quá mới làm trắng màn hình
    target: ['es2020', 'safari14']
  }
});
