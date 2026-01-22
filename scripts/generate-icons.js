// 生成 PWA 图标
// 运行: node scripts/generate-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 圆角矩形（如果有 roundRect API）
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.15);
    ctx.clip();
  }

  // 绘制 ✓ 符号
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', size / 2, size / 2);

  // 保存为 PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon-${size}.png`, buffer);
  console.log(`✓ Generated icon-${size}.png`);
}

// 确保目录存在
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// 生成两个尺寸
generateIcon(192);
generateIcon(512);

console.log('\n✅ Icons generated successfully!');
console.log('📁 Location: public/icon-192.png, public/icon-512.png');
