import 'dotenv/config';
import { AppDataSource } from './data-source.js';

async function runMigrations() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    console.log('🔄 Running pending migrations...');
    const migrations = await AppDataSource.runMigrations({ transaction: 'all' });

    if (migrations.length === 0) {
      console.log('✅ No pending migrations - database is up to date\n');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):\n`);
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
      console.log('');
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
