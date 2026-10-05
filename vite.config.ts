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
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('node_modules')) {
            return 'vendor';
          }
          if (norm.includes('/content/dailyIncidents')) {
            return 'content-incidents';
          }
          if (norm.includes('/content/reviews') || norm.includes('/content/reviewLabels')) {
            return 'content-reviews';
          }
          if (norm.includes('/content/gachaStaffPool')) {
            return 'content-staff-pool';
          }
          if (norm.includes('/content/upgrades')) {
            return 'content-upgrades';
          }
          if (norm.includes('/content/changelog')) {
            return 'content-changelog';
          }
          if (norm.includes('/content/storyNovel') || norm.includes('/content/endings') || norm.includes('/content/storyEpisodes')) {
            return 'content-story-endings';
          }
          if (norm.includes('/content/characters36') || norm.includes('/content/bunnyLetters')) {
            return 'content-characters-lore';
          }
          if (
            norm.includes('/content/characterNarrative') ||
            norm.includes('/ui/components/CharacterStoryModal') ||
            norm.includes('/ui/components/LeaderboardModal') ||
            norm.includes('/ui/components/MemoriesAlbumModal') ||
            norm.includes('/ui/components/MemoryGalleryModal') ||
            norm.includes('/ui/components/LoyaltyHandbookModal') ||
            norm.includes('/ui/components/WrappedCard') ||
            norm.includes('/ui/components/EndingModal') ||
            norm.includes('/ui/components/GachaResultModal')
          ) {
            return 'ui-lore-and-modals';
          }
        }
      }
    }
  },
  test: {
    testTimeout: 15000
  }
});
