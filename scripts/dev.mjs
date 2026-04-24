// @ts-check
import { execSync, spawn, exec } from 'child_process';
import { platform } from 'os';
import http from 'http';

const OPEN_BROWSER = process.env.OPEN_BROWSER !== 'false';

const openUrl = (url) => {
  const cmd =
    platform() === 'win32'
      ? `cmd /c start ${url}`
      : platform() === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
};

const waitForUrl = (url) =>
  new Promise((resolve) => {
    const check = () =>
      http.get(url, () => resolve()).on('error', () => setTimeout(check, 2000));
    check();
  });

execSync('docker compose up -d', { stdio: 'inherit' });

if (OPEN_BROWSER) {
  const urls = [
    'http://localhost:4200',
    'http://localhost:3001/api/docs',
    'http://localhost:8081',
  ];

  (async () => {
    for (const url of urls) {
      await waitForUrl(url);
      openUrl(url);
    }
  })();
}

const child = spawn('turbo', ['run', 'dev', 'studio'], {
  stdio: 'inherit',
  shell: true,
});
child.on('exit', (code) => process.exit(code ?? 0));
