const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // API TẢI ẢNH MỚI CHO KHUNG TRANH (TỪ MÁY TÍNH)
  if (req.method === 'POST' && reqPath === '/api/upload-frame-photo') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { dataUrl, filename } = JSON.parse(body);
        const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (!matches) {
          throw new Error('Dữ liệu ảnh không hợp lệ.');
        }
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const cleanName = (filename || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');
        const finalName = `${cleanName}_${Date.now()}.${ext}`;
        const savePath = path.join(__dirname, 'assets', 'wall_frames', 'custom', finalName);
        fs.writeFileSync(savePath, buffer);

        const relUrl = `assets/wall_frames/custom/${finalName}`;
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, url: relUrl, filename: finalName }));
      } catch (err) {
        console.error('[Upload Error]', err);
        res.writeHead(500, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API LƯU TỌA ĐỘ TỪ CHẾ ĐỘ KÉO THẢ TRỰC QUAN
  if (req.method === 'POST' && reqPath === '/api/save-coordinates') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const hotspots = payload.hotspots || {};

        // 1. Ghi file backup JSON
        fs.writeFileSync(
          path.join(__dirname, 'hotspots_config.json'),
          JSON.stringify(payload, null, 2),
          'utf8'
        );

        // 2. Cập nhật trực tiếp vào file index.html
        const indexPath = path.join(__dirname, 'index.html');
        let html = fs.readFileSync(indexPath, 'utf8');

        for (const [key, data] of Object.entries(hotspots)) {
          const styleStr = `top: ${data.top}; left: ${data.left}; width: ${data.width}; height: ${data.height};`;

          // 1. Cập nhật Style
          const tagRegex = new RegExp(
            `(<div[^>]*(?:data-hotspot=["']${key}["']|id=["']${key}["'])[^>]*style=["'])([^"']*)(["'][^>]*>)`,
            'i'
          );
          if (tagRegex.test(html)) {
            html = html.replace(tagRegex, `$1${styleStr}$3`);
          } else {
            const tagRegexRev = new RegExp(
              `(<div[^>]*style=["'])([^"']*)(["'][^>]*(?:data-hotspot=["']${key}["']|id=["']${key}["'])[^>]*>)`,
              'i'
            );
            if (tagRegexRev.test(html)) {
              html = html.replace(tagRegexRev, `$1${styleStr}$3`);
            }
          }

          // 2. Cập nhật data-dialogue
          if (data.dialogue) {
            const escapedDialogue = data.dialogue.replace(/"/g, '&quot;');
            const diagRegex = new RegExp(
              `(<div[^>]*(?:data-hotspot=["']${key}["']|id=["']${key}["'])[^>]*data-dialogue=["'])([^"']*)(["'][^>]*>)`,
              'i'
            );
            if (diagRegex.test(html)) {
              html = html.replace(diagRegex, `$1${escapedDialogue}$3`);
            } else {
              const insertRegex = new RegExp(
                `(<div[^>]*data-hotspot=["']${key}["'])`,
                'i'
              );
              if (insertRegex.test(html)) {
                html = html.replace(insertRegex, `$1 data-dialogue="${escapedDialogue}"`);
              }
            }
          }

          // 2b. Cập nhật data-dialogue-after
          if (data.dialogue_after) {
            const escapedAfter = data.dialogue_after.replace(/"/g, '&quot;');
            const diagAfterRegex = new RegExp(
              `(<div[^>]*(?:data-hotspot=["']${key}["']|id=["']${key}["'])[^>]*data-dialogue-after=["'])([^"']*)(["'][^>]*>)`,
              'i'
            );
            if (diagAfterRegex.test(html)) {
              html = html.replace(diagAfterRegex, `$1${escapedAfter}$3`);
            } else {
              const insertRegex = new RegExp(
                `(<div[^>]*data-hotspot=["']${key}["'])`,
                'i'
              );
              if (insertRegex.test(html)) {
                html = html.replace(insertRegex, `$1 data-dialogue-after="${escapedAfter}"`);
              }
            }
          }

          // 3. Cập nhật nhãn hotspot-label
          if (data.label) {
            const blockRegex = new RegExp(
              `(<div[^>]*data-hotspot=["']${key}["'][\\s\\S]*?<div class=["']hotspot-label["']>)([^<]*)(<\\/div>)`,
              'i'
            );
            if (blockRegex.test(html)) {
              html = html.replace(blockRegex, `$1${data.label}$3`);
            }
          }

          // 4. Cập nhật src của img nếu có
          if (data.src) {
            const imgRegex = new RegExp(
              `(<div[^>]*data-hotspot=["']${key}["'][\\s\\S]*?<img[^>]*src=["'])([^"']*)(["'][^>]*>)`,
              'i'
            );
            if (imgRegex.test(html)) {
              html = html.replace(imgRegex, `$1${data.src}$3`);
            }
          }
        }

        fs.writeFileSync(indexPath, html, 'utf8');
        console.log('[Server] Đã lưu thành công tọa độ, nhãn & lời thoại vào index.html & hotspots_config.json');

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true, message: 'Đã lưu và cập nhật tọa độ thành công!' }));
      } catch (err) {
        console.error('[Server Error] Không thể lưu tọa độ:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
