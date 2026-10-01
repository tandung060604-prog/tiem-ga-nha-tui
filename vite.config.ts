import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false
  },
  build: {
    // iOS Safari 14+ (iPhone 6s trở lên chạy được iOS 15): không để cú pháp quá mới làm trắng màn hình
    target: ['es2020', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/content/dailyIncidents')) {
            return 'content-incidents';
          }
          if (id.includes('src/content/reviews') || id.includes('src/content/reviewLabels')) {
            return 'content-reviews';
          }
          if (id.includes('src/content/gachaStaffPool')) {
            return 'content-staff-pool';
          }
          if (id.includes('src/content/upgrades')) {
            return 'content-upgrades';
          }
          if (id.includes('src/content/changelog')) {
            return 'content-changelog';
          }
        }
      }
    }
  }
});
