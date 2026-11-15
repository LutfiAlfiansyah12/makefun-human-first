import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const directory = new URL('./', import.meta.url);
const allowed = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/ad.png', ['ad.png', 'image/png']],
]);
const port = Number(process.env.PORT || 8094);
createServer(async (request, response) => {
  const path = new URL(request.url || '/', 'http://localhost').pathname;
  const item = allowed.get(path);
  if (!item) { response.writeHead(404).end('Not found'); return; }
  try {
    const bytes = await readFile(fileURLToPath(new URL(item[0], directory)));
    response.writeHead(200, { 'Content-Type': item[1], 'Content-Length': bytes.length, 'Cache-Control': 'no-store' });
    response.end(bytes);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Human First ad: http://127.0.0.1:${port}/`));
