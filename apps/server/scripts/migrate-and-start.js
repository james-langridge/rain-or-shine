#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('[Startup] Starting application...');
console.log('[Startup] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Run migrations
console.log('[Startup] Running database migrations...');

const migrate = spawn('npm', ['run', 'migrate'], {
  cwd: __dirname + '/..',
  stdio: 'inherit',
  env: process.env
});

migrate.on('error', (err) => {
  console.error('[Startup] Failed to start migration process:', err);
  process.exit(1);
});

migrate.on('close', (code) => {
  if (code !== 0) {
    console.error(`[Startup] Migration process exited with code ${code}`);
    console.error('[Startup] Continuing anyway to prevent deployment hang...');
  } else {
    console.log('[Startup] Migrations completed successfully');
  }
  
  // Start the server regardless of migration result
  console.log('[Startup] Starting server...');
  const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname + '/..',
    stdio: 'inherit',
    env: process.env
  });
  
  server.on('error', (err) => {
    console.error('[Startup] Failed to start server:', err);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    console.log(`[Startup] Server process exited with code ${code}`);
    process.exit(code);
  });
});

// Add timeout to prevent hanging
setTimeout(() => {
  console.error('[Startup] Startup timeout after 30 seconds');
  console.error('[Startup] Starting server anyway...');
  const server = spawn('node', ['dist/index.js'], {
    cwd: __dirname + '/..',
    stdio: 'inherit',
    env: process.env
  });
}, 30000);