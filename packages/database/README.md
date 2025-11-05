# @repo/database

Shared database package for QuoteMaster. Provides PostgreSQL connection pooling, schema, and query helpers.

## Setup

1. Ensure PostgreSQL is installed and running
2. Create a database: `createdb quotemaster`
3. Set environment variables:

```bash
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DB=quotemaster
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=your_password
```

4. Run migrations:

```bash
npm run migrate
```

## Usage

```typescript
import { getPool, query, queryOne } from '@repo/database';
import { getAllClients, getClientById, createClient } from '@repo/database/schema';

// Direct queries
const clients = await query('SELECT * FROM clients');
const client = await queryOne('SELECT * FROM clients WHERE id = $1', [1]);

// Using schema helpers
const allClients = await getAllClients();
const specificClient = await getClientById(1);
const newClient = await createClient({
  name: 'Acme Corp',
  email: 'contact@acme.com'
});
```

## Connection Pool

The package uses `pg` connection pooling. Pool is automatically created on first use and should be closed on app shutdown:

```typescript
import { closePool } from '@repo/database';

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});
```
