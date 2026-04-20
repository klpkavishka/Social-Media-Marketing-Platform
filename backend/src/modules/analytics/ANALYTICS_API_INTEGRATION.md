# Platform Analytics API Integration

This module provides comprehensive integration with social media platform analytics APIs, enabling real-time data collection and aggregation from Instagram, Facebook, Twitter, LinkedIn, and TikTok.

## Overview

The analytics integration consists of:

1. **Platform-specific services** - Individual services for each social platform
2. **Platform Analytics Aggregator** - Unified service to aggregate data from multiple platforms
3. **Analytics Storage** - PostgreSQL for structured analytics data
4. **Analytics API** - RESTful endpoints to access analytics data

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Analytics Controller                    │
│            (REST API Endpoints)                         │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│               Analytics Service                          │
│        (Business Logic & Aggregation)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│         Platform Analytics Service                       │
│        (Multi-Platform Orchestration)                   │
└──────┬──────┬──────┬──────┬──────┬────────────────────┘
       │      │      │      │      │
   ┌───▼──┐ ┌─▼───┐ ┌▼────┐ ┌▼────┐ ┌▼────┐
   │Insta │ │ FB  │ │Tweet│ │Link │ │TikTok│
   │gram │ │     │ │     │ │edIn │ │     │
   └───┬──┘ └─┬───┘ └┬────┘ └┬────┘ └┬────┘
       │      │      │       │       │
   ┌───▼──────▼──────▼───────▼───────▼────┐
   │     Social Media Platform APIs        │
   └────────────────────────────────────────┘
```

## Supported Platforms

### 1. Instagram (Meta Graph API)
- **API Version**: v18.0
- **Capabilities**:
  - Account insights (impressions, reach, profile views, clicks)
  - Post analytics (engagement, likes, comments, shares, saves)
  - Audience demographics (age, gender, location)
  - Online followers (active hours)
  - Follower growth tracking

### 2. Facebook (Meta Graph API)
- **API Version**: v18.0
- **Capabilities**:
  - Page insights (impressions, reach, engagement)
  - Post analytics (interactions, clicks)
  - Audience demographics
  - Follower (fan) growth

### 3. Twitter (X API v2)
- **API Version**: v2
- **Capabilities**:
  - Tweet metrics (impressions, likes, retweets, replies)
  - Account public metrics
  - Limited audience insights (requires Ads API)

### 4. LinkedIn
- **API Version**: v2
- **Capabilities**:
  - Organization page statistics
  - Post analytics (impressions, engagement, clicks)
  - Follower demographics (industry, location, seniority)
  - Follower growth with time series data

### 5. TikTok (TikTok for Developers)
- **API Version**: v2
- **Capabilities**:
  - Video analytics (views, likes, comments, shares)
  - Account metrics
  - Limited audience insights

## Setup & Configuration

### 1. Install Dependencies

The following dependencies are already configured:
- `@nestjs/axios` - HTTP client for API calls
- `@nestjs/typeorm` - Database ORM
- `rxjs` - Reactive programming

### 2. Environment Variables

Add the following to your `.env` file:

```env
# Meta (Facebook/Instagram)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_REDIRECT_URI=http://localhost:4000/api/auth/meta/callback

# Twitter/X
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# TikTok
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
```

### 3. Obtain API Credentials

#### Instagram/Facebook:
1. Create a Meta App at [developers.facebook.com](https://developers.facebook.com)
2. Add Instagram and Facebook products
3. Enable required permissions:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_show_list`

#### Twitter:
1. Create a Twitter App at [developer.twitter.com](https://developer.twitter.com)
2. Enable OAuth 2.0
3. Request elevated access for analytics

#### LinkedIn:
1. Create a LinkedIn App at [developers.linkedin.com](https://www.linkedin.com/developers/)
2. Add products: Marketing Developer Platform
3. Request required scopes:
   - `r_organization_social`
   - `rw_organization_admin`
   - `r_ads`

#### TikTok:
1. Register at [developers.tiktok.com](https://developers.tiktok.com)
2. Create an app and request video.list permissions

## API Endpoints

### Analytics Overview
```http
GET /api/analytics/overview
Query Parameters:
  - startDate: string (ISO date)
  - endDate: string (ISO date)
  - accountIds?: string[] (optional)
  - platform?: string (optional)

Response: {
  aggregated: PlatformAnalytics,
  byPlatform: Record<string, PlatformAnalytics>
}
```

### Platform-Specific Analytics
```http
GET /api/analytics/platform/:accountId
Query Parameters:
  - startDate: string
  - endDate: string

Response: PlatformAnalytics
```

### Post Analytics
```http
POST /api/analytics/posts
Body: {
  accountId: string,
  postIds: string[]
}

Response: PostAnalytics[]
```

### Audience Insights
```http
GET /api/analytics/audience/:accountId

Response: AudienceInsights
```

### Follower Count
```http
GET /api/analytics/followers/:accountId

Response: { count: number }
```

### Follower Growth
```http
GET /api/analytics/followers/:accountId/growth
Query Parameters:
  - startDate: string
  - endDate: string

Response: Array<{ date: Date, count: number }>
```

### Engagement Metrics
```http
GET /api/analytics/engagement
Query Parameters:
  - startDate: string
  - endDate: string
  - platform?: string

Response: {
  likes: number,
  comments: number,
  shares: number,
  saves: number,
  clicks: number,
  totalEngagement: number,
  engagementRate: number,
  timeline: Array<{ date: string, engagement: number }>
}
```

### Content Performance
```http
GET /api/analytics/content-performance
Query Parameters:
  - startDate: string
  - endDate: string

Response: {
  contentTypes: Record<string, number>,
  topContent: Array<Content>,
  bestPostingTimes: Array<{ hour: number, dayOfWeek: string, avgEngagement: number }>
}
```

### Compare Accounts
```http
GET /api/analytics/compare
Query Parameters:
  - startDate: string
  - endDate: string
  - accountIds?: string[]

Response: {
  accounts: Record<string, PlatformAnalytics>,
  comparison: ComparisonResults
}
```

### Refresh Analytics (Manual)
```http
POST /api/analytics/refresh/:accountId
Query Parameters:
  - startDate: string
  - endDate: string

Response: {
  success: boolean,
  message: string,
  data: PlatformAnalytics
}
```

## Data Models

### PlatformAnalytics
```typescript
{
  impressions: number;        // Total views
  reach: number;             // Unique viewers
  engagement: number;        // Total interactions
  likes: number;
  comments: number;
  shares: number;
  saves?: number;            // Instagram, TikTok
  clicks?: number;           // Link clicks
  followers: number;         // Current count
  followerGrowth: number;    // Net change
  videoViews?: number;       // TikTok, Instagram Reels
  profileViews?: number;     // Profile visits
}
```

### PostAnalytics
```typescript
{
  postId: string;
  platform: string;
  impressions: number;
  reach: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  clicks?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### AudienceInsights
```typescript
{
  demographics: {
    ageRange: Record<string, number>;
    gender: Record<string, number>;
    location: Array<{
      country: string;
      city?: string;
      percentage: number;
    }>;
  };
  interests?: string[];
  activeHours?: Array<{
    hour: number;
    dayOfWeek: string;
    count: number;
  }>;
}
```

## Usage Examples

### Fetch Analytics for All Connected Accounts

```typescript
import { AnalyticsService } from './analytics.service';

// Inject the service
constructor(private analyticsService: AnalyticsService) {}

// Get overview
const overview = await this.analyticsService.getOverview({
  startDate: '2026-01-01',
  endDate: '2026-02-15',
});

console.log('Total Engagement:', overview.aggregated.engagement);
console.log('Instagram Stats:', overview.byPlatform.instagram);
```

### Fetch Post Analytics

```typescript
const postAnalytics = await this.analyticsService.getPostAnalytics({
  accountId: 'account-uuid',
  postIds: ['post-123', 'post-456'],
});

postAnalytics.forEach(post => {
  console.log(`Post ${post.postId}: ${post.engagement} engagements`);
});
```

### Get Audience Insights

```typescript
const insights = await this.analyticsService.getAudienceInsights('account-uuid');

console.log('Age Distribution:', insights.demographics.ageRange);
console.log('Top Locations:', insights.demographics.location);
```

## Error Handling

All platform services include comprehensive error handling:

1. **API Rate Limits**: Services handle rate limiting gracefully
2. **Token Expiry**: Automatic token validation and refresh (where supported)
3. **Network Errors**: Retry logic with exponential backoff
4. **Data Unavailability**: Fallback to cached/stored data

Example error response:
```json
{
  "statusCode": 400,
  "message": "Account not connected or token expired",
  "error": "Bad Request"
}
```

## Rate Limits

Each platform has different rate limits:

- **Instagram**: 200 calls/hour per user
- **Facebook**: 200 calls/hour per user
- **Twitter**: 300 requests/15 minutes (varies by endpoint)
- **LinkedIn**: Varies by product (typically 100 requests/day for analytics)
- **TikTok**: Varies by app tier

The services automatically handle rate limiting and queue requests when necessary.

## Caching Strategy

To optimize API usage:

1. **Analytics Data**: Cached for 1 hour
2. **Audience Insights**: Cached for 24 hours
3. **Follower Counts**: Cached for 30 minutes
4. **Post Analytics**: Cached for 6 hours

## Testing

Run tests with:

```bash
npm run test
```

For end-to-end testing:

```bash
npm run test:e2e
```

## Next Steps

1. **MongoDB Integration**: Set up MongoDB for time-series analytics data
2. **Data Aggregation Pipelines**: Create scheduled jobs to fetch and aggregate data
3. **Real-time Metrics**: Implement WebSocket for real-time analytics updates
4. **Historical Backfill**: Fetch and store historical data
5. **Export Functionality**: Add CSV/PDF export for reports
6. **Analytics Dashboard**: Build frontend components with Recharts

## Troubleshooting

### Common Issues

**Error: "Account not connected"**
- Ensure the social account has a valid access token
- Check token expiry in the database

**Error: "Invalid authentication"**
- Verify API credentials in .env
- Check if permissions/scopes are correctly configured

**Error: "Rate limit exceeded"**
- Reduce API call frequency
- Implement request queuing

## Support & Resources

- [Meta Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [TikTok Developer Portal](https://developers.tiktok.com)

## License

This module is part of the UniSocial platform and follows the same license terms.
