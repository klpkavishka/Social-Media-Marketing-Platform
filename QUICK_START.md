# Analytics API Integration - Quick Start Guide

## Overview

The Platform Analytics API Integration is now implemented! This guide will help you get started with testing and using the analytics features.

## What's Been Implemented

### ✅ Completed Features

1. **Platform-Specific Services**
   - Instagram Analytics Service
   - Facebook Analytics Service
   - Twitter Analytics Service
   - LinkedIn Analytics Service
   - TikTok Analytics Service

2. **Platform Analytics Aggregator**
   - Unified service to fetch data from all platforms
   - Multi-account aggregation
   - Cross-platform analytics comparison

3. **Analytics API Endpoints**
   - Overview analytics (`GET /api/analytics/overview`)
   - Platform-specific analytics (`GET /api/analytics/platform/:accountId`)
   - Post analytics (`POST /api/analytics/posts`)
   - Audience insights (`GET /api/analytics/audience/:accountId`)
   - Follower metrics (`GET /api/analytics/followers/:accountId`)
   - Follower growth (`GET /api/analytics/followers/:accountId/growth`)
   - Engagement metrics (`GET /api/analytics/engagement`)
   - Content performance (`GET /api/analytics/content-performance`)
   - Account comparison (`GET /api/analytics/compare`)
   - Manual refresh (`POST /api/analytics/refresh/:accountId`)

4. **DTOs & Validation**
   - Request DTOs with validation
   - Response DTOs for consistent API responses
   - Swagger/OpenAPI documentation

5. **Documentation**
   - Comprehensive API documentation
   - Architecture diagrams
   - Usage examples
   - Error handling guide

## Quick Setup

### 1. Install Dependencies

Dependencies are already configured in package.json:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Meta (Facebook/Instagram)
META_APP_ID=your_actual_app_id
META_APP_SECRET=your_actual_app_secret

# Twitter
TWITTER_API_KEY=your_actual_key
TWITTER_API_SECRET=your_actual_secret
TWITTER_BEARER_TOKEN=your_actual_token

# LinkedIn
LINKEDIN_CLIENT_ID=your_actual_client_id
LINKEDIN_CLIENT_SECRET=your_actual_secret

# TikTok
TIKTOK_CLIENT_KEY=your_actual_key
TIKTOK_CLIENT_SECRET=your_actual_secret
```

### 3. Start the Backend Server

```bash
npm run start:dev
```

The server will start on `http://localhost:4000`

### 4. Access API Documentation

Open your browser and navigate to:
```
http://localhost:4000/api-docs
```

(You may need to configure Swagger in main.ts if not already done)

## Testing the API

### Using cURL

#### 1. Get Analytics Overview

```bash
curl -X GET "http://localhost:4000/api/analytics/overview?startDate=2026-01-01&endDate=2026-02-15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Get Platform-Specific Analytics

```bash
curl -X GET "http://localhost:4000/api/analytics/platform/ACCOUNT_UUID?startDate=2026-01-01&endDate=2026-02-15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Get Post Analytics

```bash
curl -X POST "http://localhost:4000/api/analytics/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountId": "ACCOUNT_UUID",
    "postIds": ["post123", "post456"]
  }'
```

#### 4. Get Audience Insights

```bash
curl -X GET "http://localhost:4000/api/analytics/audience/ACCOUNT_UUID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Thunder Client

1. Import the API endpoints from Swagger/OpenAPI spec
2. Set up environment variables for:
   - Base URL: `http://localhost:4000`
   - Auth Token: Your JWT token
3. Test each endpoint with different parameters

### Using Frontend (Next Steps)

Once you implement the frontend dashboard:

```typescript
// Example: Fetch analytics overview
const response = await fetch('/api/analytics/overview?' + new URLSearchParams({
  startDate: '2026-01-01',
  endDate: '2026-02-15'
}), {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Total Engagement:', data.aggregated.engagement);
```

## Data Flow

```
1. Frontend Request → 
2. Analytics Controller → 
3. Analytics Service → 
4. Platform Analytics Service → 
5. Platform-Specific Service (Instagram/Facebook/etc.) → 
6. Social Media API → 
7. Response transformed and cached → 
8. Stored in Database → 
9. Returned to Frontend
```

## Key Files Created

### Backend Services
- `backend/src/modules/social/platforms/base-platform.service.ts`
- `backend/src/modules/social/platforms/instagram.service.ts`
- `backend/src/modules/social/platforms/facebook.service.ts`
- `backend/src/modules/social/platforms/twitter.service.ts`
- `backend/src/modules/social/platforms/linkedin.service.ts`
- `backend/src/modules/social/platforms/tiktok.service.ts`
- `backend/src/modules/social/platforms/platform-analytics.service.ts`

### Analytics Module
- `backend/src/modules/analytics/analytics.service.ts` (Updated)
- `backend/src/modules/analytics/analytics.controller.ts` (Updated)
- `backend/src/modules/analytics/analytics.module.ts` (Updated)

### DTOs
- `backend/src/modules/analytics/dto/get-analytics-query.dto.ts`
- `backend/src/modules/analytics/dto/get-post-analytics.dto.ts`
- `backend/src/modules/analytics/dto/analytics-response.dto.ts`
- `backend/src/modules/analytics/dto/index.ts`

### Configuration
- `backend/.env.example` (Updated with TikTok credentials)
- `backend/src/modules/social/social.module.ts` (Updated with platform services)
- `backend/src/modules/analytics/analytics.module.ts` (Updated)

### Documentation
- `backend/src/modules/analytics/ANALYTICS_API_INTEGRATION.md`
- `QUICK_START.md` (This file)

## Common Issues & Solutions

### Issue: "Account not connected"
**Solution**: Ensure you have connected social accounts with valid access tokens in the database.

```sql
-- Check connected accounts
SELECT id, platform, account_name, status FROM social_accounts WHERE status = 'connected';
```

### Issue: "Invalid authentication"
**Solution**: Verify your API credentials in `.env` file match those in your platform developer consoles.

### Issue: "Rate limit exceeded"
**Solution**: The services have built-in rate limiting handling. If you're hitting limits, reduce the frequency of API calls or implement caching.

### Issue: TypeScript compilation warnings
**Solution**: The code uses `any` types for external API responses. While these show as warnings, they don't prevent compilation. For production, consider adding proper type definitions for each platform's API responses.

## Next Steps

### Immediate Tasks (Recommended Order):

1. **Add MongoDB for Time-Series Data** ✨ NEXT
   - Install MongoDB and Mongoose
   - Create schemas for analytics time-series data
   - Implement aggregation pipelines

2. **Create Data Collection Scheduler** 
   - Set up Bull Queue for scheduled jobs
   - Implement automated data fetching (every hour/day)
   - Add retry logic and error handling

3. **Implement Real-Time Metrics**
   - Add WebSocket support
   - Stream live analytics updates to frontend
   - Implement push notifications for significant changes

4. **Historical Data Backfill**
   - Create backfill scripts to fetch historical data
   - Store in MongoDB for trend analysis
   - Generate historical reports

5. **Frontend Analytics Dashboard**
   - Create analytics page with Recharts
   - Implement line charts for engagement over time
   - Add bar charts for platform comparison
   - Create pie charts for content type performance
   - Add key metrics cards
   - Implement date range filters

6. **Export Functionality**
   - PDF report generation
   - CSV export for raw data
   - Scheduled email reports

## Testing Checklist

- [ ] All platform services instantiate without errors
- [ ] Can fetch Instagram analytics for a connected account
- [ ] Can fetch Facebook analytics for a connected account
- [ ] Can fetch Twitter analytics for a connected account
- [ ] Can fetch LinkedIn analytics for a connected account
- [ ] Can fetch TikTok analytics for a connected account
- [ ] Analytics overview aggregates data from all platforms
- [ ] Post analytics returns correct metrics
- [ ] Audience insights return demographic data
- [ ] Follower growth tracking works
- [ ] Error handling works for disconnected accounts
- [ ] Rate limiting is respected
- [ ] Data is stored in PostgreSQL
- [ ] API documentation is accessible

## Performance Considerations

1. **Caching**: Implement Redis caching for frequently accessed analytics
2. **Batch Requests**: Group multiple API calls when possible
3. **Database Indexes**: Add indexes on frequently queried fields
4. **Pagination**: Implement pagination for large datasets
5. **Background Jobs**: Use Bull Queue for long-running analytics tasks

## Security Checklist

- [ ] API credentials stored securely in .env
- [ ] Access tokens encrypted in database
- [ ] JWT authentication required for all endpoints
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using TypeORM parameterized queries)
- [ ] CORS configured properly
- [ ] Sensitive data (tokens) not logged

## Support

For issues or questions:
1. Check the main documentation: `ANALYTICS_API_INTEGRATION.md`
2. Review platform-specific API documentation
3. Check server logs for detailed error messages
4. Verify database connection and migrations

## Conclusion

The Platform Analytics API Integration is ready for testing and further development! You can now fetch real-time analytics from all major social media platforms and aggregate them into meaningful insights.

Happy coding! 🚀
