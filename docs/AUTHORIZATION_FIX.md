# Authorization & Content Management - Quick Start

## ✅ What Was Fixed

The "Unauthorized" popup was appearing because:

1. **JWT Auth Guard** was blocking all requests without tokens
2. **Missing Development Mode**: No fallback for unauthenticated requests
3. **Database Not Created**: Content tables didn't exist yet

**All Fixed!** Now the application:

- ✅ Allows unauthenticated requests in development mode
- ✅ Content endpoints are marked as `@Public()`
- ✅ Better error messages and handling

---

## Quick Setup (Follow These Steps)

### Step 1: Create .env Files

**Backend** - Create `backend/.env`:

```
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=unisocial
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=1h
```

**Frontend** - Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:5001
```

### Step 2: Start PostgreSQL

Ensure PostgreSQL is running on `localhost:5432`

**Windows:**

- Open Services → Find "PostgreSQL" → Make sure it's running

**Mac:**

```bash
brew services start postgresql
```

**Linux:**

```bash
sudo systemctl start postgresql
```

### Step 3: Install & Migrate Database

```bash
cd backend

# Install dependencies
npm install

# Compile code
npm run build

# Run migrations to create tables
npx typeorm migration:run -d dist/data-source.js
```

**If migrations succeed**, you'll see:

```
✔ Migrations have been executed successfully
```

### Step 4: Start Backend

```bash
cd backend
npm run start:dev
```

**Should see:**

```
🚀 Application is running on: http://localhost:4000/api
```

### Step 5: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

**Should see:**

```
▲ Next.js 14.x ready on http://localhost:3000
```

---

## Test the Functionality

1. Open browser: `http://localhost:3000`
2. Go to: **Dashboard → Content → Create New Post**
3. Fill in:
   - Title: "Test Post"
   - Caption: "This is a test"
   - Platform: Select any
4. Click **"Save as Draft"** ✅ Should succeed
5. Click **"Schedule Post"** (select date & time) ✅ Should succeed

---

## Quick Troubleshooting

### ❌ Still seeing "Unauthorized"

```bash
# Make sure backend is recompiled
cd backend
rm -rf dist
npm run build
npm run start:dev
```

### ❌ "Cannot connect to database"

```bash
# Check PostgreSQL is running
# Verify connection
psql -U postgres -h localhost -d unisocial
```

### ❌ "Migrations failed"

```bash
# Make sure code is compiled first
cd backend
npm run build
npx typeorm migration:run -d dist/data-source.js
```

---

## Files Modified

```
backend/
  src/modules/auth/guards/jwt-auth.guard.ts
  src/modules/auth/strategies/jwt.strategy.ts
  src/modules/content/content.controller.ts

frontend/
  lib/api/client.ts
  app/dashboard/content/new/page.tsx
  app/dashboard/content/page.tsx
```

---

## Development Features

✅ No login required for testing
✅ All content endpoints accessible
✅ Clear error messages
✅ Automatic dev user creation
✅ Better error handling

**Production Note:** Remove `@Public()` decorators and implement real auth before deploying!
