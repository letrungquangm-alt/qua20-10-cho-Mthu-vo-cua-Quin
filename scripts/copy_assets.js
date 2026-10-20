const fs = require('fs');
const path = require('path');

function copyRecursive(src, dst) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dst)) {
      fs.mkdirSync(dst, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    fs.copyFileSync(src, dst);
    console.log(`Copied: ${path.basename(dst)} (${stat.size} bytes)`);
  }
}

try {
  const srcDir = 'C:\\Users\\letru\\OneDrive\\Hình ảnh\\Cuộn phim\\ảnh cần thiết';
  console.log('Copying assets...');
  copyRecursive(path.join(srcDir, 'assets'), 'g:\\ẻm\\assets');
  console.log('Copying wall frames...');
  copyRecursive(path.join(srcDir, 'nghiên nhiều hướng', '05_Tuy_Chon_Doi_Vi_Tri_Tat_Ca_6_Anh'), 'g:\\ẻm\\assets\\wall_frames');
  console.log('DONE ALL COPYING!');
} catch (e) {
  console.error('Fatal error:', e);
}
