# Database Schema Design

## 1. Overview

The UniSocial platform uses a **polyglot persistence** strategy:

- **PostgreSQL**: Primary database for structured relational data
- **MongoDB**: Document store for analytics, logs, and semi-structured data
- **Redis**: Cache and session management

---

## 2. PostgreSQL Schema

### 2.1 Multi-Tenancy Strategy

All tables include `university_id` for data isolation:

```sql
-- Enable Row-Level Security (RLS) for multi-tenancy
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY university_isolation ON table_name
  USING (university_id = current_setting('app.current_university_id')::uuid);
```

### 2.2 Core Tables

#### Universities Table

```sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255) UNIQUE,
  logo_url TEXT,
  brand_colors JSONB, -- {primary: "#hex", secondary: "#hex"}
  brand_guidelines TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  subscription_tier VARCHAR(50) DEFAULT 'basic', -- basic, pro, enterprise
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, suspended, cancelled
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_subscription ON universities(subscription_tier, subscription_status);
```

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(university_id, email)
);

CREATE INDEX idx_users_university ON users(university_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role_id);
```

#### Roles Table

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false, -- super_admin, university_admin, etc.
  permissions JSONB DEFAULT '[]', -- Array of permission slugs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(university_id, slug)
);

CREATE INDEX idx_roles_university ON roles(university_id);
```

#### Permissions Table

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource VARCHAR(100) NOT NULL, -- content, campaign, analytics, etc.
  action VARCHAR(50) NOT NULL, -- create, read, update, delete, publish
  slug VARCHAR(150) UNIQUE NOT NULL, -- content:create, campaign:read
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default permissions
INSERT INTO permissions (resource, action, slug, description) VALUES
  ('content', 'create', 'content:create', 'Create content'),
  ('content', 'read', 'content:read', 'View content'),
  ('content', 'update', 'content:update', 'Edit content'),
  ('content', 'delete', 'content:delete', 'Delete content'),
  ('content', 'publish', 'content:publish', 'Publish content'),
  ('campaign', 'create', 'campaign:create', 'Create campaigns'),
  ('campaign', 'read', 'campaign:read', 'View campaigns'),
  ('analytics', 'read', 'analytics:read', 'View analytics'),
  ('users', 'manage', 'users:manage', 'Manage users'),
  ('settings', 'manage', 'settings:manage', 'Manage settings');
```

#### Social Media Accounts Table

```sql
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- instagram, facebook, twitter, linkedin, tiktok, youtube
  platform_account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  handle VARCHAR(255),
  profile_url TEXT,
  profile_image_url TEXT,
  access_token TEXT, -- Encrypted
  refresh_token TEXT, -- Encrypted
  token_expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  follower_count INTEGER DEFAULT 0,
  last_synced_at TIMESTAMP,
  metadata JSONB DEFAULT '{}', -- Platform-specific data
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(university_id, platform, platform_account_id)
);

CREATE INDEX idx_social_accounts_university ON social_accounts(university_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform, is_active);
```

#### Content Table

```sql
CREATE TYPE content_status AS ENUM ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'failed', 'archived');
CREATE TYPE content_type AS ENUM ('post', 'story', 'reel', 'video', 'carousel', 'article');

CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  title VARCHAR(255),
  caption TEXT,
  content_type content_type NOT NULL,
  status content_status DEFAULT 'draft',
  platforms JSONB NOT NULL, -- [{platform: 'instagram', account_id: 'uuid', status: 'pending'}]
  media_urls JSONB DEFAULT '[]', -- Array of media file URLs
  hashtags TEXT[], -- Array of hashtags
  mentions TEXT[], -- Array of mentions
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  expires_at TIMESTAMP, -- For stories
  ai_assisted BOOLEAN DEFAULT false,
  ai_metadata JSONB, -- AI generation details
  performance_metrics JSONB DEFAULT '{}', -- {likes: 0, comments: 0, shares: 0, reach: 0}
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_content_university ON content(university_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_content_status ON content(status, scheduled_at);
CREATE INDEX idx_content_created_by ON content(created_by);
CREATE INDEX idx_content_scheduled ON content(scheduled_at) WHERE status = 'scheduled';
```

#### Content Versions Table (Audit Trail)

```sql
CREATE TABLE content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  caption TEXT,
  media_urls JSONB,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_id, version_number)
);

CREATE INDEX idx_content_versions_content ON content_versions(content_id);
```

#### Campaigns Table

```sql
CREATE TYPE campaign_status AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status campaign_status DEFAULT 'planning',
  goal TEXT,
  target_audience TEXT,
  budget DECIMAL(10, 2),
  platforms TEXT[], -- Array of platforms
  start_date DATE,
  end_date DATE,
  metrics JSONB DEFAULT '{}', -- {target_reach: 10000, target_engagement: 500}
  actual_performance JSONB DEFAULT '{}', -- Actual metrics
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_campaigns_university ON campaigns(university_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
```

#### Campaign Content (Junction Table)

```sql
CREATE TABLE campaign_content (
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (campaign_id, content_id)
);

CREATE INDEX idx_campaign_content_campaign ON campaign_content(campaign_id);
CREATE INDEX idx_campaign_content_content ON campaign_content(content_id);
```

#### Workflows Table

```sql
CREATE TYPE workflow_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'cancelled');

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  workflow_type VARCHAR(50) DEFAULT 'approval', -- approval, review, emergency
  status workflow_status DEFAULT 'pending',
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER NOT NULL,
  steps JSONB NOT NULL, -- [{step: 1, approver_id: 'uuid', status: 'pending', comments: ''}]
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, emergency
  due_date TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_workflows_university ON workflows(university_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_content ON workflows(content_id);
```

#### Workflow Actions Table

```sql
CREATE TABLE workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL, -- approved, rejected, commented, escalated
  actor_id UUID REFERENCES users(id),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_actions_workflow ON workflow_actions(workflow_id);
```

#### Media Library Table

```sql
CREATE TABLE media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_type VARCHAR(50), -- image/jpeg, video/mp4, etc.
  file_size BIGINT, -- bytes
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- For videos, in seconds
  tags TEXT[],
  metadata JSONB DEFAULT '{}', -- EXIF data, etc.
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_media_university ON media_library(university_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_tags ON media_library USING GIN(tags);
CREATE INDEX idx_media_type ON media_library(file_type);
```

#### Notifications Table

```sql
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'approval_request');
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'sms', 'push');

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type DEFAULT 'info',
  channel notification_channel DEFAULT 'in_app',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

#### Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- content_created, user_deleted, settings_updated
  resource_type VARCHAR(50), -- content, user, campaign
  resource_id UUID,
  changes JSONB, -- Before/after values
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_university ON audit_logs(university_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

#### Settings Table

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL, -- general, notifications, integrations, ai
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(university_id, category, key)
);

CREATE INDEX idx_settings_university ON settings(university_id);
CREATE INDEX idx_settings_category ON settings(category);
```

---

## 3. MongoDB Collections

### 3.1 Analytics Events Collection

```javascript
// Collection: analytics_events
{
  _id: ObjectId,
  university_id: UUID,
  social_account_id: UUID,
  platform: String, // instagram, facebook, etc.
  event_type: String, // post_published, engagement, reach, impression
  event_data: {
    content_id: UUID,
    post_id: String, // Platform's post ID
    metrics: {
      likes: Number,
      comments: Number,
      shares: Number,
      saves: Number,
      reach: Number,
      impressions: Number,
      engagement_rate: Number
    },
    audience_demographics: {
      age_groups: Object,
      gender: Object,
      locations: Object
    }
  },
  timestamp: ISODate,
  created_at: ISODate
}

// Indexes
db.analytics_events.createIndex({ university_id: 1, timestamp: -1 });
db.analytics_events.createIndex({ social_account_id: 1, timestamp: -1 });
db.analytics_events.createIndex({ "event_data.content_id": 1 });
db.analytics_events.createIndex({ platform: 1, event_type: 1, timestamp: -1 });
```

### 3.2 Engagement Collection

```javascript
// Collection: engagements
{
  _id: ObjectId,
  university_id: UUID,
  content_id: UUID,
  social_account_id: UUID,
  platform: String,
  platform_post_id: String,
  engagement_type: String, // comment, like, share, message
  engagement_data: {
    user_id: String, // Platform user ID
    username: String,
    text: String, // For comments/messages
    sentiment: String, // positive, neutral, negative
    sentiment_score: Number,
    requires_response: Boolean,
    is_responded: Boolean,
    response_text: String,
    responded_at: ISODate,
    responded_by: UUID
  },
  timestamp: ISODate,
  created_at: ISODate
}

// Indexes
db.engagements.createIndex({ university_id: 1, timestamp: -1 });
db.engagements.createIndex({ content_id: 1 });
db.engagements.createIndex({ social_account_id: 1, timestamp: -1 });
db.engagements.createIndex({ "engagement_data.sentiment": 1, "engagement_data.requires_response": 1 });
```

### 3.3 AI Logs Collection

```javascript
// Collection: ai_logs
{
  _id: ObjectId,
  university_id: UUID,
  user_id: UUID,
  ai_function: String, // caption_generation, sentiment_analysis, prediction
  input_data: Object, // Input to AI
  output_data: Object, // AI output
  model_used: String, // gpt-4, claude-3, etc.
  tokens_used: Number,
  cost: Number,
  latency_ms: Number,
  user_accepted: Boolean, // Did user accept the AI suggestion?
  feedback: String,
  created_at: ISODate
}

// Indexes
db.ai_logs.createIndex({ university_id: 1, created_at: -1 });
db.ai_logs.createIndex({ user_id: 1 });
db.ai_logs.createIndex({ ai_function: 1, created_at: -1 });
```

### 3.4 System Logs Collection

```javascript
// Collection: system_logs
{
  _id: ObjectId,
  level: String, // info, warn, error, debug
  service: String, // backend-api, ai-service, scheduler
  message: String,
  context: Object,
  error: {
    message: String,
    stack: String,
    code: String
  },
  timestamp: ISODate
}

// Indexes
db.system_logs.createIndex({ timestamp: -1 });
db.system_logs.createIndex({ level: 1, timestamp: -1 });
db.system_logs.createIndex({ service: 1, timestamp: -1 });
// TTL index - auto-delete logs after 90 days
db.system_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });
```

### 3.5 Performance Metrics Collection

```javascript
// Collection: performance_metrics
{
  _id: ObjectId,
  university_id: UUID,
  metric_type: String, // optimal_posting_time, content_performance, audience_growth
  metric_data: {
    // For optimal_posting_time
    platform: String,
    day_of_week: Number, // 0-6
    hour: Number, // 0-23
    engagement_score: Number,
    sample_size: Number,

    // For content_performance
    content_type: String,
    avg_engagement_rate: Number,
    performance_trend: String // improving, declining, stable
  },
  period_start: ISODate,
  period_end: ISODate,
  calculated_at: ISODate
}

// Indexes
db.performance_metrics.createIndex({ university_id: 1, metric_type: 1, calculated_at: -1 });
```

---

## 4. Redis Data Structures

### 4.1 Session Storage

```
Key: session:{sessionId}
Type: Hash
TTL: 30 minutes
Data: {
  user_id: UUID,
  university_id: UUID,
  role: String,
  permissions: JSON,
  ip_address: String
}
```

### 4.2 Rate Limiting

```
Key: rate_limit:{user_id}:{endpoint}
Type: String (counter)
TTL: 1 minute
Data: request count
```

### 4.3 API Response Cache

```
Key: cache:api:{endpoint}:{query_params_hash}
Type: String (JSON)
TTL: 5-60 minutes (endpoint-specific)
Data: Serialized API response
```

### 4.4 Real-Time Analytics

```
Key: realtime:{university_id}:active_users
Type: Set
TTL: 5 minutes
Data: Set of active user IDs
```

### 4.5 Job Queue (Bull)

```
Key: bull:{queue_name}:{job_id}
Type: Hash
Data: Job data and status
```

---

## 5. Data Relationships

```
universities (1) ──── (many) users
universities (1) ──── (many) social_accounts
universities (1) ──── (many) content
universities (1) ──── (many) campaigns

users (1) ──── (many) content (created_by)
users (1) ──── (many) workflows (approver)
users (1) ──── (1) roles

content (1) ──── (many) content_versions
content (1) ──── (many) workflows
content (many) ──── (many) campaigns

campaigns (many) ──── (many) content (via campaign_content)

social_accounts (1) ──── (many) analytics_events
social_accounts (1) ──── (many) engagements

content (1) ──── (many) analytics_events
content (1) ──── (many) engagements
```

---

## 6. Data Migration Strategy

### 6.1 Initial Setup

```sql
-- Run migrations in order
1. Create extensions (uuid-ossp, pgcrypto)
2. Create custom types (ENUMs)
3. Create core tables (universities, users, roles)
4. Create dependent tables
5. Create indexes
6. Insert seed data
7. Enable RLS policies
```

### 6.2 Seed Data

```sql
-- Insert system roles
INSERT INTO roles (name, slug, is_system_role, permissions) VALUES
  ('Super Admin', 'super_admin', true, '["*:*"]'),
  ('University Admin', 'university_admin', true, '["content:*", "campaign:*", "users:manage", "analytics:read"]'),
  ('Department Coordinator', 'department_coordinator', true, '["content:*", "campaign:read", "analytics:read"]'),
  ('Content Creator', 'content_creator', true, '["content:create", "content:read", "content:update"]'),
  ('Analyst', 'analyst', true, '["analytics:read", "content:read"]');
```

---

## 7. Backup & Recovery

### 7.1 PostgreSQL

- **Automated backups**: Every 6 hours
- **Point-in-time recovery**: Up to 7 days
- **Backup location**: S3 bucket with versioning
- **Retention**: 30 days

### 7.2 MongoDB

- **Automated snapshots**: Daily
- **Backup location**: S3 bucket
- **Retention**: 30 days

### 7.3 Redis

- **RDB snapshots**: Every hour
- **AOF**: Enabled for durability
- **Backup location**: S3 bucket

---

This schema design provides a robust, scalable foundation for the UniSocial platform with proper data isolation, auditing, and performance optimization.
