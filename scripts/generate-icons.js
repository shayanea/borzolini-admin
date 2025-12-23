import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceImage =
  '/Users/shayan/.gemini/antigravity/brain/290867ce-f234-4abf-a187-5cdeb359f3d6/borzolini_modern_app_icon_1766513122990.png';
const outputDir = '/Users/shayan/Desktop/Projects/ideas/clinic/admin/public';

const icons = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'android-icon-36x36.png', size: 36 },
  { name: 'android-icon-48x48.png', size: 48 },
  { name: 'android-icon-72x72.png', size: 72 },
  { name: 'android-icon-96x96.png', size: 96 },
  { name: 'android-icon-144x144.png', size: 144 },
  { name: 'android-icon-192x192.png', size: 192 },
  { name: 'apple-icon-57x57.png', size: 57 },
  { name: 'apple-icon-60x60.png', size: 60 },
  { name: 'apple-icon-72x72.png', size: 72 },
  { name: 'apple-icon-76x76.png', size: 76 },
  { name: 'apple-icon-114x114.png', size: 114 },
  { name: 'apple-icon-120x120.png', size: 120 },
  { name: 'apple-icon-144x144.png', size: 144 },
  { name: 'apple-icon-152x152.png', size: 152 },
  { name: 'apple-icon-180x180.png', size: 180 },
  { name: 'apple-icon.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'ms-icon-70x70.png', size: 70 },
  { name: 'ms-icon-144x144.png', size: 144 },
  { name: 'ms-icon-150x150.png', size: 150 },
  { name: 'ms-icon-310x310.png', size: 310 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

async function generateIcons() {
  if (!fs.existsSync(sourceImage)) {
    console.error('Source image not found');
    return;
  }

  for (const icon of icons) {
    const outputPath = path.join(outputDir, icon.name);
    await sharp(sourceImage).resize(icon.size, icon.size).toFile(outputPath);
    console.log(`Generated: ${icon.name}`);
  }

  // Generate favicon.ico (simplified, 32x32)
  await sharp(sourceImage).resize(32, 32).toFile(path.join(outputDir, 'favicon.ico'));
  console.log('Generated: favicon.ico');

  // Also copy to app-icon.png for general use
  await sharp(sourceImage).resize(1024, 1024).toFile(path.join(outputDir, 'app-icon.png'));
  console.log('Generated: app-icon.png');
}

generateIcons().catch(console.error);
