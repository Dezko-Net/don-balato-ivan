const http = require('http');
const fs = require('fs');
const path = require('path');

const session = 'whatsapp-ia-silence';
const outdir = path.join(process.cwd(), '.dbg');
const logFile = path.join(outdir, `trae-debug-log-${session}.ndjson`);
const envFile = path.join(outdir, `${session}.env`);
const port = 7777;

fs.mkdirSync(outdir, { recursive: true });
fs.writeFileSync(logFile, '');
fs.writeFileSync(
  envFile,
  `DEBUG_SERVER_URL=http://127.0.0.1:${port}/event\nDEBUG_SESSION_ID=${session}\n`,
  'utf8'
);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, session, port }));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/logs') {
    const raw = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
    const logs = raw.trim() ? raw.trim().split(/\r?\n/).map((line) => JSON.parse(line)) : [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(logs));
    return;
  }

  if (req.method === 'DELETE' && url.pathname === '/logs') {
    fs.writeFileSync(logFile, '');
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname === '/event') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        if (!data.ts) data.ts = Date.now();
        fs.appendFileSync(logFile, `${JSON.stringify(data)}\n`);
        res.writeHead(204);
        res.end();
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(error) }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`debug server ${session} on ${port}\n`);
});

setInterval(() => {}, 1 << 30);
