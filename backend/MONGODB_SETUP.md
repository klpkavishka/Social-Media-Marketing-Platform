# MongoDB Setup for Analytics

## Installation

### Option 1: Docker (Recommended)

Create a `docker-compose.yml` file in the backend directory (or update existing one):

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: unisocial-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: unisocial-analytics
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    networks:
      - unisocial-network

volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local

networks:
  unisocial-network:
    driver: bridge
```

Start MongoDB:
```bash
docker-compose up -d mongodb
```

### Option 2: Local Installation

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## Configuration

### 1. Update `.env` file:

```env
# MongoDB (for Analytics Time-Series Data)
MONGODB_URI=mongodb://localhost:27017/unisocial-analytics

# For Docker with authentication:
# MONGODB_URI=mongodb://admin:admin123@localhost:27017/unisocial-analytics?authSource=admin
```

### 2. Install Dependencies

Already added to package.json. Run:
```bash
cd backend
npm install
```

## MongoDB Collections

The system will automatically create the following collections:

### 1. **analytics_snapshots** (Time-Series Collection)
- Stores periodic snapshots of account-level metrics
- **Granularity**: Hourly
- **Indexes**: accountId + timestamp, platform + timestamp
- **Data**: impressions, reach, engagement, followers, etc.

### 2. **post_metrics** (Time-Series Collection)
- Tracks individual post performance over time
- **Granularity**: Hourly
- **Indexes**: postId + timestamp, accountId + timestamp
- **Data**: post-specific engagement metrics

### 3. **audience_snapshots**
- Periodic snapshots of audience demographics
- **Indexes**: accountId + timestamp
- **Data**: age, gender, location, interests, active hours

### 4. **follower_growth** (Time-Series Collection)
- Daily follower count tracking
- **Granularity**: Hours
- **Indexes**: accountId + date
- **Data**: follower count, gained, lost, growth rate

## Verifying MongoDB Setup

### 1. Check MongoDB is Running

```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
```

### 2. Connect to MongoDB

```bash
mongosh
use unisocial-analytics
show collections
```

### 3. View Sample Data

```javascript
// View analytics snapshots
db.analytics_snapshots.find().limit(5).pretty()

// View post metrics
db.post_metrics.find().limit(5).pretty()

// Check collection stats
db.analytics_snapshots.stats()
```

### 4. Test from Application

Start your backend:
```bash
cd backend
npm run start:dev
```

Check logs for MongoDB connection:
```
[Nest] LOG [InstanceLoader] MongooseModule dependencies initialized
[Nest] LOG [MongooseCoreModule] Mongoose connected to mongodb://localhost:27017/unisocial-analytics
```

## Data Storage Strategy

### PostgreSQL (Structured Data)
- User accounts, campaigns, content
- Relational data with foreign keys
- Quick lookups and joins
- Current state and configurations

### MongoDB (Time-Series Data)
- Analytics snapshots (hourly/daily)
- Historical metrics
- Trend analysis
- Large-scale aggregations

## Querying Examples

### Get Analytics History
```typescript
const history = await this.analyticsStorageService.getAnalyticsHistory(
  accountId,
  new Date('2026-01-01'),
  new Date('2026-02-15')
);
```

### Get Top Posts
```typescript
const topPosts = await this.analyticsStorageService.getTopPosts(
  accountId,
  startDate,
  endDate,
  10 // limit
);
```

### Aggregate by Platform
```typescript
const platformStats = await this.analyticsStorageService.aggregateByPlatform(
  startDate,
  endDate
);
```

## Performance Optimization

### 1. Indexes (Already Created)
- Compound indexes on accountId + timestamp
- Platform + timestamp for filtering
- Single field indexes for common queries

### 2. Time-Series Collections
MongoDB automatically optimizes storage and queries for time-series data:
- Compressed storage
- Efficient range queries
- Automatic bucketing

### 3. Aggregation Pipelines
Use MongoDB's aggregation framework for complex analytics:

```javascript
db.analytics_snapshots.aggregate([
  { $match: { accountId: "uuid", timestamp: { $gte: ISODate("2026-01-01") } } },
  { $group: { 
      _id: "$platform",
      avgEngagement: { $avg: "$engagement" },
      totalImpressions: { $sum: "$impressions" }
  }}
])
```

## Backup & Maintenance

### Backup MongoDB Data
```bash
mongodump --db=unisocial-analytics --out=/backup/mongodb/
```

### Restore MongoDB Data
```bash
mongorestore --db=unisocial-analytics /backup/mongodb/unisocial-analytics/
```

### Compact Collections
```bash
mongosh
use unisocial-analytics
db.analytics_snapshots.compact()
```

## Troubleshooting

### Connection Issues

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- Ensure MongoDB is running: `mongosh`
- Check MONGODB_URI in .env
- Verify port 27017 is not blocked by firewall

**Error: "Authentication failed"**
- Check username/password in MONGODB_URI
- Ensure user has proper permissions

### Performance Issues

**Slow Queries**
- Check indexes: `db.analytics_snapshots.getIndexes()`
- Use explain() to analyze queries
- Consider adding more specific indexes

**High Memory Usage**
- Implement data retention policies
- Archive old data
- Use aggregation with limits

## Data Retention Policy (Recommended)

```javascript
// Delete analytics snapshots older than 90 days
db.analytics_snapshots.deleteMany({
  timestamp: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
});

// Archive old data before deletion
db.analytics_snapshots.aggregate([
  { $match: { timestamp: { $lt: archiveDate } } },
  { $out: "analytics_snapshots_archive" }
]);
```

## Monitoring

### Check Database Size
```javascript
db.stats()
```

### Monitor Collection Growth
```javascript
db.analytics_snapshots.stats().size
db.post_metrics.stats().count
```

### Query Performance
```javascript
db.analytics_snapshots.find({ accountId: "uuid" }).explain("executionStats")
```

## Next Steps

1. ✅ MongoDB is configured
2. ✅ Schemas are created
3. ✅ Storage service is implemented
4. ⏭️ Create scheduled jobs to populate data
5. ⏭️ Build aggregation pipelines for complex analytics
6. ⏭️ Implement data retention policies
7. ⏭️ Add monitoring and alerts

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Time-Series Collections](https://docs.mongodb.com/manual/core/timeseries-collections/)
- [Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)
