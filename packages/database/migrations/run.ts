#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';
import { getPool, closePool } from '../index';

async function runMigrations() {
  console.log('Running database migrations...');

  try {
    const pool = getPool();

    // Read and execute schema.sql
    const schemaPath = join(__dirname, '..', 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');

    console.log('Executing schema.sql...');
    await pool.query(schemaSql);

    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await closePool();
  }
}

runMigrations();
