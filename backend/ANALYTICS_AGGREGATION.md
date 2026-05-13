# Analytics Aggregation Service

## Overview

The Analytics Aggregation Service is a background job system that automatically collects, processes, and stores analytics data from all connected social media accounts. It uses Bull Queue for job management and supports both scheduled and manual data collection.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Analytics Aggregation System                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐         ┌────────────────────────┐  │
│  │  Cron Scheduler    │────────▶│  Bull Queue (Redis)    │  │
│  │  - Hourly          │         │  - Job Management      │  │
│  │  - Daily           │         │  - Retry Logic         │  │
│  │  - Weekly          │         │  - Progress Tracking   │  │
│  └────────────────────┘         └────────────────────────┘  │
│                                              │               │
│                                              ▼               │
│                                  ┌────────────────────────┐  │
│                                  │  Analytics Processor   │  │
│                                  │  - Process Jobs        │  │
│                                  │  - Error Handling      │  │
│                                  └────────────────────────┘  │
│                                              │               │
│                                              ▼               │
│                          ┌─────────────────────────────────┐ │
│                          │  Aggregation Service           │ │
│                          │  - Fetch Platform Data         │ │
│                          │  - Store PostgreSQL + MongoDB  │ │
│                          └─────────────────────────────────┘ │
│                                              │               │
│         ┌────────────────────────────────────┴─┐            │
│         ▼                                      ▼             │
│  ┌─────────────┐                      ┌──────────────────┐  │
│  │ PostgreSQL  │                      │    MongoDB       │  │
│  │ (Metrics)   │                      │ (Time-Series)    │  │
│  └─────────────┘                      └──────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. **AnalyticsAggregationService**
Core service that handles data collection and aggregation.

**Key Methods:**
- `aggregateAllAccounts()` - Collect analytics from all connected accounts
- `aggregateAccountAnalytics()` - Collect analytics for a specific account
- `aggregateByPlatform()` - Collect analytics for all accounts on a platform
- `aggregatePostAnalytics()` - Collect post-level analytics
- `getAggregationStats()` - Get aggregation statistics

### 2. **AnalyticsSchedulerService**
Manages scheduled data collection using cron jobs.

**Schedules:**
- **Hourly**: Every hour at :00 (collects last hour's data)
- **Daily**: Every day at midnight (collects last 24 hours)
- **Weekly**: Every Sunday at midnight (collects last 7 days)

**Key Methods:**
- `triggerManualCollection()` - Manually trigger aggregation
- `triggerAccountCollection()` - Trigger for specific account
- `triggerPlatformCollection()` - Trigger for specific platform
- `getJobStatus()` - Check job status
- `getQueueStats()` - View queue statistics
- `setSchedulerEnabled()` - Enable/disable scheduler

### 3. **AnalyticsProcessor**
Bull Queue processor that executes aggregation jobs in the background.

**Features:**
- Automatic retry on failure (3 attempts with exponential backoff)
- Progress tracking
- Error handling per account
- Job history (keeps last 100 completed, 500 failed jobs)

## Installation & Setup

### 1. Install Dependencies

Already added to package.json:
```bash
cd backend
npm install
```

Dependencies:
- `@nestjs/bull` - Queue management
- `@nestjs/schedule` - Cron job scheduling
- `bull` - Background job processing
- `ioredis` - Redis client

### 2. Configure Redis

Redis is required for Bull Queue. Update `.env`:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Start Redis:**
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or use existing Redis from docker-compose
docker-compose up -d redis
```

### 3. Configure MongoDB

Ensure MongoDB is running (see [MONGODB_SETUP.md](./MONGODB_SETUP.md)).

### 4. Environment Variables

```env
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/ai_social_platform

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai_social_platform_analytics

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Enable/Disable Scheduler (optional, default: true)
ANALYTICS_SCHEDULER_ENABLED=true
```

## API Endpoints

### Manual Aggregation

#### Trigger Full Aggregation
```http
POST /analytics/aggregate/trigger
Content-Type: application/json

{
  "startDate": "2026-02-14T00:00:00Z",
  "endDate": "2026-02-15T00:00:00Z"
}

Response:
{
  "jobId": "12345",
  "message": "Analytics aggregation job scheduled successfully"
}
```

#### Trigger Account-Specific Aggregation
```http
POST /analytics/aggregate/account/{accountId}
Content-Type: application/json

{
  "startDate": "2026-02-14T00:00:00Z",
  "endDate": "2026-02-15T00:00:00Z"
}
```

#### Trigger Platform-Specific Aggregation
```http
POST /analytics/aggregate/platform/instagram
Content-Type: application/json

{
  "startDate": "2026-02-14T00:00:00Z",
  "endDate": "2026-02-15T00:00:00Z"
}
```

### Job Monitoring

#### Get Job Status
```http
GET /analytics/aggregate/job/{jobId}

Response:
{
  "id": "12345",
  "data": { ... },
  "progress": 80,
  "state": "active",
  "attemptsMade": 1
}
```

#### Get Queue Statistics
```http
GET /analytics/aggregate/queue/stats

Response:
{
  "waiting": 5,
  "active": 2,
  "completed": 150,
  "failed": 3,
  "delayed": 0,
  "total": 160
}
```

#### Get Recent Jobs
```http
GET /analytics/aggregate/queue/jobs?limit=10

Response:
[
  {
    "id": "12345",
    "state": "completed",
    "progress": 100,
    "finishedOn": 1708008900000,
    "data": { ... }
  }
]
```

### Scheduler Control

#### Enable/Disable Scheduler
```http
PUT /analytics/scheduler/config
Content-Type: application/json

{
  "enabled": true
}

Response:
{
  "enabled": true,
  "message": "Analytics scheduler enabled"
}
```

#### Get Scheduler Status
```http
GET /analytics/scheduler/status

Response:
{
  "enabled": true
}
```

### Queue Management

#### Pause Queue
```http
POST /analytics/aggregate/queue/pause

Response:
{
  "message": "Queue paused successfully"
}
```

#### Resume Queue
```http
POST /analytics/aggregate/queue/resume

Response:
{
  "message": "Queue resumed successfully"
}
```

#### Clear Queue
```http
POST /analytics/aggregate/queue/clear

Response:
{
  "message": "Queue cleared successfully"
}
```

## Usage Examples

### 1. Automatic Scheduled Collection

Once the service starts, it will automatically collect analytics:
- **Every hour** - Last hour's metrics
- **Every day** - Last 24 hours' summary
- **Every week** - Last 7 days' trends

No manual intervention required!

### 2. Manual Collection After Adding New Account

```bash
# Trigger aggregation for new account
curl -X POST http://localhost:3000/api/analytics/aggregate/account/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-02-15T00:00:00Z"
  }'
```

### 3. Backfill Historical Data

```bash
# Collect last 30 days of data for all accounts
curl -X POST http://localhost:3000/api/analytics/aggregate/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-01-15T00:00:00Z",
    "endDate": "2026-02-15T00:00:00Z"
  }'
```

### 4. Check Job Status in Frontend

```typescript
async function checkAggregationStatus(jobId: string) {
  const response = await fetch(`/api/analytics/aggregate/job/${jobId}`);
  const status = await response.json();
  
  console.log(`Job ${jobId}: ${status.state} (${status.progress}%)`);
  
  if (status.state === 'completed') {
    console.log('Analytics collection complete!');
  } else if (status.state === 'failed') {
    console.error('Failed:', status.failedReason);
  }
}
```

## Data Collection Process

### Per Account Flow

1. **Fetch Account Analytics**
   - Platform-level metrics (impressions, reach, engagement)
   - Time range: startDate to endDate

2. **Store in PostgreSQL**
   - Individual metric records (IMPRESSION, REACH, ENGAGEMENT, CLICK)
   - Linked to account and timestamp

3. **Store in MongoDB**
   - Time-series snapshot with all metrics
   - Optimized for historical queries and trends

4. **Fetch Follower Growth**
   - Daily follower counts
   - Growth calculations (gained, lost, rate)

5. **Fetch Audience Insights**
   - Demographics (age, gender, location)
   - Interests and active hours

### Error Handling

- **Per-account isolation**: One failed account doesn't stop others
- **Automatic retry**: 3 attempts with exponential backoff (5s, 25s, 125s)
- **Detailed logging**: Success/failure per account tracked
- **Graceful degradation**: Partial data collection if some endpoints fail

## Monitoring & Observability

### Logs

Check application logs for aggregation activity:

```bash
# View logs
tail -f logs/application.log | grep "Aggregation"
```

Example log output:
```
[AnalyticsAggregationService] Starting analytics aggregation for all accounts
[AnalyticsAggregationService] Found 5 active social accounts
[AnalyticsAggregationService] Aggregating analytics for instagram account: @mycompany
[AnalyticsAggregationService] Successfully aggregated 4 metrics for @mycompany
[AnalyticsAggregationService] Aggregation complete: 5/5 accounts successful, 20 metrics collected
```

### Queue Dashboard (Bull Board)

Bull Board provides a web UI for queue management. Add to your app (optional):

```bash
npm install @bull-board/express @bull-board/api
```

Then access at: `http://localhost:3000/admin/queues`

### Metrics to Monitor

- **Success Rate**: `successfulAccounts / totalAccounts`
- **Average Duration**: Time to aggregate all accounts
- **Queue Length**: Jobs waiting in queue
- **Failed Jobs**: Check for patterns (specific platform, time of day)
- **Retry Rate**: How often jobs need retries

## Performance Optimization

### 1. Parallel Processing

The system processes accounts sequentially by default to respect API rate limits. To enable parallel processing (with caution):

```typescript
// In AnalyticsAggregationService
const results = await Promise.allSettled(
  accounts.map(account => this.aggregateAccountAnalytics(account, start, end))
);
```

### 2. Rate Limiting

Add rate limiting per platform:

```typescript
// Install: npm install bottleneck
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 // 1 request per second
});

// Wrap API calls
await limiter.schedule(() => this.platformService.fetchAnalytics(...));
```

### 3. Data Retention

Implement automatic cleanup for old data:

```typescript
// Run monthly
@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
async cleanupOldData() {
  const retentionDays = 90;
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  
  await this.analyticsRepository.delete({
    date: { $lt: cutoffDate }
  });
}
```

## Troubleshooting

### Issue: Jobs stuck in "active" state

**Cause**: Worker crashed or Redis connection lost

**Solution**:
```bash
# Clear stuck jobs
POST /analytics/aggregate/queue/clear

# Restart application
npm run start:dev
```

### Issue: High failure rate

**Cause**: Invalid tokens, API rate limits, network issues

**Solution**:
1. Check logs for specific error messages
2. Verify social account tokens are valid
3. Check API rate limits per platform
4. Reduce aggregation frequency if hitting limits

### Issue: Scheduler not running

**Cause**: Scheduler disabled or cron not initialized

**Solution**:
```bash
# Check scheduler status
GET /analytics/scheduler/status

# Enable if disabled
PUT /analytics/scheduler/config
{ "enabled": true }

# Verify @nestjs/schedule is imported in module
```

### Issue: Redis connection errors

**Cause**: Redis not running or wrong connection config

**Solution**:
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Verify .env configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Advanced Configuration

### Custom Cron Schedules

Edit `analytics-scheduler.service.ts`:

```typescript
// Collect every 30 minutes
@Cron('*/30 * * * *')
async scheduleHalfHourlyCollection() {
  // Implementation
}

// Collect every Monday at 9 AM
@Cron('0 9 * * 1')
async scheduleWeeklyReport() {
  // Implementation
}
```

### Job Priority

Add priority to jobs:

```typescript
const job = await this.analyticsQueue.add('aggregate-analytics', data, {
  priority: 1, // Higher priority = processed first
  attempts: 3,
});
```

### Job Delay

Schedule jobs for future execution:

```typescript
const job = await this.analyticsQueue.add('aggregate-analytics', data, {
  delay: 5 * 60 * 1000, // Run in 5 minutes
});
```

## Testing

### Unit Tests

```typescript
describe('AnalyticsAggregationService', () => {
  it('should aggregate all accounts successfully', async () => {
    const result = await service.aggregateAllAccounts();
    
    expect(result.totalAccounts).toBeGreaterThan(0);
    expect(result.successfulAccounts).toBe(result.totalAccounts);
  });
});
```

### Integration Tests

```bash
# Test manual aggregation
npm run test:e2e -- --grep "Analytics Aggregation"
```

### Manual Testing

```bash
# 1. Start services
npm run start:dev

# 2. Trigger test aggregation
curl -X POST http://localhost:3000/api/analytics/aggregate/trigger

# 3. Check job status
curl http://localhost:3000/api/analytics/aggregate/queue/stats
```

## Next Steps

1. ✅ Analytics aggregation service created
2. ✅ Scheduler with cron jobs implemented
3. ✅ Bull Queue processor configured
4. ✅ API endpoints for manual control
5. ⏭️ Add rate limiting per platform
6. ⏭️ Implement data retention policies
7. ⏭️ Add Bull Board UI for queue monitoring
8. ⏭️ Set up alerts for failed aggregations
9. ⏭️ Create dashboard for aggregation metrics

## Resources

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [NestJS Schedule](https://docs.nestjs.com/techniques/task-scheduling)
- [NestJS Bull](https://docs.nestjs.com/techniques/queues)
- [Cron Expression Generator](https://crontab.guru/)
