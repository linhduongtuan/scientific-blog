// Simple script to create placeholder icon files for PWA
// In a real project, you'd use proper icon generation tools

const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Create a simple SVG icon as base64
const createSVGIcon = (size) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="#2563eb">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Create placeholder files (in a real app, you'd generate actual PNG files)
iconSizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // Create a simple text file as placeholder
  const content = `# Placeholder for ${filename}
# In a real application, this would be a ${size}x${size} PNG icon
# Generated from SVG: ${createSVGIcon(size)}
`;
  
  fs.writeFileSync(filepath, content);
  console.log(`Created placeholder: ${filename}`);
});

// Create screenshot placeholders
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

fs.writeFileSync(path.join(screenshotsDir, 'desktop.png'), '# Desktop screenshot placeholder');
fs.writeFileSync(path.join(screenshotsDir, 'mobile.png'), '# Mobile screenshot placeholder');

console.log('Icon and screenshot placeholders created successfully!');
console.log('In a production app, replace these with actual PNG images.');