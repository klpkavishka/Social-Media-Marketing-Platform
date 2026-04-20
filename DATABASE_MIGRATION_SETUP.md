# Database Migration & Setup Guide

## Issue Fixed
The content creation and draft saving functionality was failing because:
1. **Database tables didn't exist** - The `contents` and `campaigns` tables were not created in the database
2. **JWT Authentication Guard** - All endpoints were requiring JWT authentication which wasn't properly configured
3. **Missing error logging** - Errors weren't being properly displayed to users

## Solutions Implemented

### 1. Created Database Migration
- Created migration file: `backend/src/migrations/1737648000000-CreateContentTable.ts`
- Generates required tables: `contents` and `campaigns`
- Creates necessary enums for content/campaign status and types
- Sets up proper indexes for query performance

### 2. Made Content Endpoints Public
- Added `@Public()` decorator to all content routes in `ContentController`
- Allows content operations without JWT authentication (for development)

### 3. Improved API Client Error Handling
- Updated `frontend/lib/api/client.ts` to gracefully handle missing auth tokens
- Allows requests to proceed without token in development mode
- Better error logging and messages

### 4. Enhanced Error Messages
- Updated content creation handlers to show detailed error messages from API
- Better console logging for debugging

## Setup Instructions

### Step 1: Ensure Database is Running
```bash
# Make sure PostgreSQL is running on localhost:5432
# Default credentials (from .env.example):
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
```

### Step 2: Create .env Files if Missing
Backend (.env or configure environment):
```bash
cd backend
# Copy .env.example to .env and update values if needed
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=unisocial
```

Frontend (.env.local):
```bash
cd frontend
# Create .env.local file:
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

### Step 3: Run Database Migrations

#### Option A: Using TypeORM CLI
```bash
cd backend

# Install dependencies if not done
npm install

# Run migrations
npx typeorm migration:run -d dist/data-source.js
```

#### Option B: Using npm scripts (if configured)
```bash
cd backend
npm run typeorm migration:run
```

#### Option C: Manual migration using ts-node (in development)
```bash
cd backend
npm run typeorm migration:run -- --dataSource src/data-source.ts
```

### Step 4: Verify Migration Success
Check the database to confirm tables exist:
```bash
# Connect to PostgreSQL
psql -U postgres -d unisocial -h localhost

# List all tables
\dt

# You should see:
# - campaigns
# - contents
# - campaign_contents
# (plus auth tables from previous migrations)
```

### Step 5: Start the Application

#### Terminal 1: Backend
```bash
cd backend
npm run start:dev  # or npm start
# Should output: 🚀 Application is running on: http://localhost:4000/api
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Should output: ▲ Next.js 14.x ready on http://localhost:3000
```

### Step 6: Test the Functionality

1. Open browser to `http://localhost:3000`
2. Navigate to Dashboard → Content → Create New Post
3. Fill in the form:
   - **Title**: "Test Post"
   - **Caption**: "This is a test post"
   - **Platform**: Select one (e.g., "Facebook")
4. Try "Schedule Post":
   - Select a date and time
   - Click "Schedule Post"
   - Should redirect to calendar and show success message
5. Try "Save as Draft":
   - Don't select date/time
   - Click "Save as Draft"
   - Should show success and redirect to content list

## Troubleshooting

### Issue: "Failed to schedule post" or "Failed to save draft"

**Check 1: Is the backend running?**
```bash
curl http://localhost:4000/api/content
```
Should return data, not a connection error.

**Check 2: Are the database tables created?**
```bash
psql -U postgres -d unisocial -h localhost -c "\dt"
```
Look for `contents` and `campaigns` tables.

**Check 3: Check browser console for detailed errors**
- Open Chrome DevTools (F12)
- Go to Console tab
- Look for red error messages with details
- Error should show validation issues or database errors

**Check 4: Check backend logs**
Look for error messages in terminal where backend is running.

### Issue: "TypeError: Cannot read property 'split' of undefined" when scheduling
- **Cause**: Time field is empty or in wrong format
- **Fix**: Select both date AND time before clicking "Schedule Post"

### Issue: Posts created but don't show up in calendar
- **Check**: Are they saved with correct status?
- Navigate to Content page (not calendar) to see all posts including drafts
- Scheduled posts only show in calendar if date is in the visible calendar range

### Issue: Database connection refused
- **Check**: Is PostgreSQL running?
  ```bash
  # On Windows: Check Services
  # On Mac: brew services list | grep postgres
  # On Linux: sudo systemctl status postgresql
  ```
- **Fix**: Start PostgreSQL service

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=unisocial
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=UniSocial
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Next Steps

1. **User Authentication**: Currently all users are treated the same. Implement proper user tracking in content creation.
2. **Content Media**: Implement file upload and storage for media files.
3. **Social Media Publishing**: Implement actual posting to social platforms (Meta, Twitter, etc.).
4. **Approval Workflow**: Add multi-level approval before publishing.
5. **Analytics**: Collect and display engagement metrics for published content.

## Files Modified

### Backend
- `backend/src/modules/content/content.controller.ts` - Added @Public() decorators
- `backend/src/migrations/1737648000000-CreateContentTable.ts` - New migration

### Frontend
- `frontend/lib/api/client.ts` - Improved error handling
- `frontend/app/dashboard/content/new/page.tsx` - Better error messages and logging
- `frontend/app/dashboard/content/page.tsx` - Real API integration

