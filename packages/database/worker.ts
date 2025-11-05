#!/usr/bin/env node
/**
 * Background job worker process
 * Run this separately from the web app to process background jobs
 *
 * Usage: node -r esbuild-register worker.ts
 */

import { registerJobWorkers, stopJobQueue } from './jobs';

async function startWorker() {
  console.log('🚀 Starting background job worker...');

  try {
    await registerJobWorkers();
    console.log('✅ Worker is running and processing jobs');
    console.log('Press Ctrl+C to stop');
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down worker...');
  await stopJobQueue();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down worker...');
  await stopJobQueue();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the worker
startWorker();
