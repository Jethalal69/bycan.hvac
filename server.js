const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') {
    reqUrl = '/index.html';
  }

  const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  const serveFile = (targetFile) => {
    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(targetFile, (err, content) => {
      if (err) {
        serve404();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  };

  const serve404 = () => {
    const errorPage = path.join(PUBLIC_DIR, '404.html');
    fs.readFile(errorPage, (err, content) => {
      if (!err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Page Not Found - ByCan HVAC Engineering');
      }
    });
  };

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return serveFile(filePath);
    }

    if (!err && stats.isDirectory()) {
      const indexFile = path.join(filePath, 'index.html');
      return fs.existsSync(indexFile) ? serveFile(indexFile) : serve404();
    }

    // Try appending .html
    const htmlFile = filePath + '.html';
    if (fs.existsSync(htmlFile)) {
      return serveFile(htmlFile);
    }

    serve404();
  });
});

server.listen(PORT, () => {
  console.log(`HVAC Website server running at http://localhost:${PORT}`);
});
