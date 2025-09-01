import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, '../src/ui/icons/logo.png');
const outputDir = path.join(__dirname, '../public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Icon sizes needed for different purposes
const iconSizes = {
  favicon: 32,
  'favicon-16x16': 16,
  'favicon-32x32': 32,
  'apple-touch-icon': 180,
  'android-chrome-192x192': 192,
  'android-chrome-512x512': 512,
  'mstile-150x150': 150,
};

async function generateIcons() {
  try {
    console.log('🔄 Generating icons from logo...');

    for (const [name, size] of Object.entries(iconSizes)) {
      const outputPath = path.join(outputDir, `${name}.png`);

      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name}.png (${size}x${size})`);
    }

    // For now, we'll create a simple favicon.ico using the 32x32 version
    // Note: Creating a proper multi-size ICO file requires additional packages
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✅ Generated favicon.ico');

    // Note: SVG generation removed as Sharp doesn't support PNG to SVG conversion
    // The PNG favicon will work for all modern browsers

    console.log('\n🎉 All icons generated successfully!');
    console.log('📁 Icons saved to:', outputDir);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
