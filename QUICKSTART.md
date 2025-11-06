# Universal App Starter - Quick Start

Get running in 5 minutes!

## 1. Install Dependencies

```bash
git clone https://github.com/YOUR_USERNAME/universal-app-starter.git my-app
cd my-app
npm install
```

## 2. Set Up Database

```bash
# Create database
createdb myapp

# Create .env file
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```bash
POSTGRES_HOST=localhost
POSTGRES_DB=myapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

## 3. Run Migrations

```bash
cd apps/api
npm run migration:run
```

## 4. Start Development

```bash
# From root
npm run dev
```

**Done!**
- API: http://localhost:3001
- Web: http://localhost:5173

## Next Steps

- Add Clerk keys to `.env` for authentication
- See [README.md](./README.md) for full documentation
- See [TODO.md](./TODO.md) for planned features
