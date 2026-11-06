import { spawn } from 'child_process';

console.log('\n======================================================');
console.log('🚀 Starting AarviCloud Full-Stack Environment');
console.log('  ● Backend Server : http://localhost:5000');
console.log('  ● Frontend Client: http://localhost:5173');
console.log('======================================================\n');

// 1. Start Express backend on port 5000
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite frontend on port 5173
const viteProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('Server process error:', err);
});

viteProcess.on('error', (err) => {
  console.error('Vite process error:', err);
});

function handleExit() {
  try {
    serverProcess.kill();
    viteProcess.kill();
  } catch {}
  process.exit();
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
