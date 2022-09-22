const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withOffline = require('next-offline');
const withPlugins = require('next-compose-plugins');
const withOptimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [
    withOptimizedImages,
    {
      handleImages: ['jpeg', 'svg', 'webp'],
      mozjpeg: {
        quality: 90,
      },
      webp: {
        preset: 'default',
        quality: 90,
      },
    },
  ],
  withCSS,
  withFonts,
  withImages,
  withOffline,
]);
