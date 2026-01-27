# Datasets & Data Handling

## 1. Data Requirements Overview

UniSocial requires various types of data to function effectively:

- **Operational Data**: User-generated content, campaigns, schedules
- **Social Media Data**: Engagement metrics, follower data, platform analytics
- **AI Training Data**: Content examples, sentiment labels, performance patterns
- **Synthetic Data**: Testing and demonstration data

---

## 2. Data Sources

### 2.1 System-Generated Data

**Description**: Data created through normal platform operation

**Types**:

- User accounts and profiles
- Content drafts and published posts
- Campaigns and workflows
- Audit logs and system events

**Storage**: PostgreSQL (primary) + MongoDB (logs)

**Privacy Level**: High - Contains PII

### 2.2 Social Media Platform Data

**Description**: Data retrieved from social media platforms via APIs

**Types**:

- **Profile Data**: Account information, follower counts
- **Engagement Metrics**: Likes, comments, shares, reach, impressions
- **Audience Demographics**: Age, gender, location data (aggregated)
- **Content Performance**: Post-level analytics

**Sources**:

- Meta Graph API (Facebook/Instagram)
- Twitter API v2
- LinkedIn Marketing API
- TikTok Business API
- YouTube Data API v3

**Storage**: MongoDB (time-series data)

**Update Frequency**:

- Real-time: Webhooks for new engagement
- Periodic: Hourly sync for metrics
- Daily: Comprehensive analytics sync

**Rate Limits**: Platform-specific, managed via queue system

**Data Retention**: 2 years

### 2.3 Public Datasets (for AI Training)

**Description**: Publicly available datasets for training AI models

#### a) Social Media Text Corpora

**Source**: HuggingFace Datasets
**Datasets**:

- `tweet_eval` - Sentiment analysis dataset
- `go_emotions` - Fine-grained emotion detection
- `hate_speech_offensive` - Content moderation

**Use Cases**:

- Sentiment analysis model training
- Content classification
- Toxicity detection

#### b) Marketing & University Datasets

**Source**: Kaggle, Academic repositories
**Datasets**:

- University social media posts (public)
- Higher education marketing campaigns
- Student engagement patterns

**Use Cases**:

- Content performance prediction
- Optimal timing analysis
- Hashtag effectiveness

#### c) Image Datasets

**Source**: OpenImages, COCO Dataset
**Use Cases**:

- Image classification
- Object detection
- Brand element recognition

**Privacy**: All public domain, no proprietary data

### 2.4 Synthetic Datasets

**Description**: Artificially generated data for testing and demonstration

**Generation Methods**:

- Faker library for user data
- AI-generated content samples
- Simulated engagement metrics
- Randomized analytics data

**Use Cases**:

- Development environment seeding
- Demo environments for sales
- Load testing
- Feature testing

**Example Generation**:

```javascript
// Synthetic content generation
const generateSyntheticContent = () => ({
  title: faker.lorem.sentence(),
  caption: faker.lorem.paragraph(),
  platforms: faker.helpers.arrayElements(["instagram", "facebook", "twitter"]),
  metrics: {
    likes: faker.number.int({ min: 0, max: 10000 }),
    comments: faker.number.int({ min: 0, max: 500 }),
    shares: faker.number.int({ min: 0, max: 1000 }),
    reach: faker.number.int({ min: 1000, max: 50000 }),
  },
});
```

**Storage**: Separate database/schema for synthetic data

**Identification**: All synthetic data flagged with `is_synthetic: true`

---

## 3. Data Schemas

### 3.1 Social Media Analytics Data Schema

```typescript
interface SocialMediaAnalytics {
  id: string;
  university_id: string;
  social_account_id: string;
  platform:
    | "instagram"
    | "facebook"
    | "twitter"
    | "linkedin"
    | "tiktok"
    | "youtube";
  post_id: string; // Platform's post ID
  content_id: string; // Our internal content ID

  // Engagement metrics
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
    clicks: number;
    video_views?: number;
    engagement_rate: number;
  };

  // Audience demographics (aggregated)
  demographics: {
    age_groups: {
      "13-17": number;
      "18-24": number;
      "25-34": number;
      "35-44": number;
      "45-54": number;
      "55-64": number;
      "65+": number;
    };
    gender: {
      male: number;
      female: number;
      other: number;
    };
    locations: {
      country: Record<string, number>;
      city: Record<string, number>;
    };
  };

  // Temporal data
  collected_at: Date;
  period_start: Date;
  period_end: Date;
}
```

### 3.2 Engagement Data Schema

```typescript
interface EngagementData {
  id: string;
  university_id: string;
  content_id: string;
  social_account_id: string;
  platform: string;

  // Engagement details
  type: "comment" | "message" | "mention" | "review";
  author: {
    platform_user_id: string;
    username: string;
    display_name: string;
    follower_count?: number;
  };

  // Content
  text: string;
  media_urls?: string[];
  parent_id?: string; // For threaded comments

  // AI Analysis
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  sentiment_score: number; // -1 to 1
  emotions: string[]; // ['joy', 'surprise', etc.]
  intent: string; // 'question', 'complaint', 'praise', 'inquiry'
  urgency: "low" | "medium" | "high" | "crisis";
  requires_response: boolean;

  // Response tracking
  is_responded: boolean;
  response_text?: string;
  responded_by?: string;
  responded_at?: Date;

  timestamp: Date;
}
```

### 3.3 AI Training Data Schema

```typescript
interface AITrainingData {
  id: string;
  data_type: "caption_example" | "sentiment_label" | "performance_data";

  // For caption examples
  caption?: {
    text: string;
    platform: string;
    content_type: string;
    tone: string;
    engagement_score: number;
  };

  // For sentiment labels
  sentiment_label?: {
    text: string;
    sentiment: string;
    confidence: number;
    human_verified: boolean;
  };

  // For performance data
  performance?: {
    content_features: {
      length: number;
      has_hashtags: boolean;
      hashtag_count: number;
      has_emojis: boolean;
      has_questions: boolean;
      has_cta: boolean;
      content_type: string;
      post_time: {
        day_of_week: number;
        hour: number;
      };
    };
    metrics: {
      engagement_rate: number;
      reach: number;
      likes: number;
      comments: number;
      shares: number;
    };
  };

  created_at: Date;
}
```

---

## 4. Data Collection Procedures

### 4.1 Social Media Data Collection

**Method**: API integration with rate limiting

**Flow**:

```
1. OAuth Authentication
   ↓
2. Webhook Registration (real-time events)
   ↓
3. Periodic Polling (metrics sync)
   ↓
4. Data Validation & Transformation
   ↓
5. Store in MongoDB
   ↓
6. Update PostgreSQL aggregates
```

**Implementation**:

```typescript
// Social media data collector service
class SocialMediaCollector {
  async collectEngagementData(accountId: string) {
    const account = await this.getAccount(accountId);
    const platform = this.getPlatformAdapter(account.platform);

    // Fetch data with retry logic
    const data = await this.retry(
      () => platform.getEngagementMetrics(account),
      { maxAttempts: 3, backoff: "exponential" },
    );

    // Validate and transform
    const validated = this.validate(data);
    const transformed = this.transform(validated);

    // Store in database
    await this.analyticsRepository.save(transformed);

    // Update cache
    await this.cache.set(`analytics:${accountId}`, transformed, 300);
  }
}
```

### 4.2 AI Training Data Collection

**Sources**:

1. **User Feedback**: When users accept/reject AI suggestions
2. **Performance Data**: Historical content performance
3. **Human Labels**: Manual sentiment labeling (admin feature)

**Collection Flow**:

```typescript
// Track AI suggestion acceptance
async trackAISuggestion(suggestion: AISuggestion, userAction: 'accepted' | 'rejected' | 'modified') {
  await aiLogsRepository.create({
    university_id: suggestion.university_id,
    user_id: suggestion.user_id,
    ai_function: suggestion.function,
    input_data: suggestion.input,
    output_data: suggestion.output,
    user_action,
    created_at: new Date()
  });

  // If accepted, add to training data
  if (userAction === 'accepted') {
    await trainingDataRepository.create({
      data_type: 'caption_example',
      caption: {
        text: suggestion.output.text,
        platform: suggestion.platform,
        engagement_score: await this.getEngagementScore(suggestion.content_id)
      }
    });
  }
}
```

---

## 5. Data Privacy & Ethics

### 5.1 Privacy Principles

**Data Minimization**:

- Collect only necessary data
- Aggregate personal data when possible
- No storage of sensitive personal information

**Purpose Limitation**:

- Data used only for stated purposes
- No selling or sharing with third parties
- Clear consent for data usage

**Transparency**:

- Clear privacy policy
- Data collection disclosure
- User control over their data

### 5.2 Ethical Considerations

#### Student Data Protection

**Policy**:

- No collection of student SSN, grades, or educational records
- No creation of student profiles without consent
- FERPA compliance for any education records
- Parent consent for minors

#### Social Media Data

**Policy**:

- Only collect publicly available data
- Respect platform terms of service
- No scraping or unauthorized data collection
- Honor user privacy settings

#### AI Ethics

**Policy**:

- No use of biased or discriminatory training data
- Regular bias audits of AI models
- Transparent AI decision-making
- Human oversight for all AI outputs

### 5.3 Compliance Requirements

#### GDPR Compliance

**Requirements**:

- Data subject rights (access, deletion, portability)
- Consent management
- Data breach notification (72 hours)
- Privacy by design
- Data processing records

**Implementation**:

```typescript
// GDPR data export
async exportUserData(userId: string): Promise<UserDataExport> {
  return {
    profile: await userRepository.findOne(userId),
    content: await contentRepository.findByUser(userId),
    analytics: await analyticsRepository.findByUser(userId),
    ai_logs: await aiLogsRepository.findByUser(userId),
    exported_at: new Date()
  };
}

// GDPR data deletion
async deleteUserData(userId: string): Promise<void> {
  await userRepository.softDelete(userId);
  await contentRepository.anonymizeUser(userId);
  await analyticsRepository.removeUserData(userId);
  await auditLogRepository.create({
    action: 'user_data_deleted',
    user_id: userId,
    timestamp: new Date()
  });
}
```

#### CCPA Compliance

**Requirements**:

- Right to know what data is collected
- Right to delete personal information
- Right to opt-out of data selling (not applicable)
- Non-discrimination for exercising rights

#### FERPA Compliance (if applicable)

**Requirements**:

- No access to education records without authorization
- Parent/student consent
- Limited disclosure of personally identifiable information
- Secure storage of education records

---

## 6. Data Quality & Validation

### 6.1 Validation Rules

**Social Media Data**:

```typescript
const socialMediaDataSchema = z.object({
  platform: z.enum([
    "instagram",
    "facebook",
    "twitter",
    "linkedin",
    "tiktok",
    "youtube",
  ]),
  metrics: z.object({
    likes: z.number().min(0),
    comments: z.number().min(0),
    shares: z.number().min(0),
    reach: z.number().min(0),
    impressions: z.number().min(0),
    engagement_rate: z.number().min(0).max(100),
  }),
  timestamp: z.date(),
});
```

**Content Data**:

```typescript
const contentSchema = z.object({
  caption: z.string().max(2200), // Instagram limit
  platforms: z.array(z.string()).min(1),
  media_urls: z.array(z.string().url()).max(10),
  scheduled_at: z.date().min(new Date()),
});
```

### 6.2 Data Cleaning

**Process**:

1. Remove duplicates
2. Handle missing values
3. Normalize formats (dates, times, currencies)
4. Remove outliers (statistical methods)
5. Validate against business rules

### 6.3 Data Monitoring

**Metrics to Track**:

- Data completeness (% of required fields populated)
- Data accuracy (validation pass rate)
- Data freshness (time since last update)
- Data volume (records per time period)

---

## 7. Data Access & Security

### 7.1 Access Control

**Levels**:

1. **System Access**: Backend services only
2. **Admin Access**: Full university data access
3. **User Access**: Role-based, limited to own content
4. **API Access**: Authenticated, rate-limited

### 7.2 Data Encryption

**At Rest**:

- Database encryption (AES-256)
- File storage encryption (S3 server-side)
- Encrypted backups

**In Transit**:

- TLS 1.3 for all connections
- Encrypted API calls
- Secure WebSocket connections

### 7.3 Data Masking

**Sensitive Data**:

```typescript
// Mask social media tokens in logs
const maskToken = (token: string) => {
  if (token.length < 10) return "***";
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
};

// Anonymize user data for analytics
const anonymizeUser = (user: User) => ({
  user_id: hash(user.id),
  role: user.role,
  // Remove PII
  email: undefined,
  name: undefined,
});
```

---

## 8. Data Lifecycle Management

### 8.1 Data Retention Policy

| Data Type        | Retention Period | Action After            |
| ---------------- | ---------------- | ----------------------- |
| Active content   | Indefinite       | Archive on delete       |
| Deleted content  | 30 days          | Permanent deletion      |
| Analytics data   | 2 years          | Archive to cold storage |
| Logs             | 90 days          | Deletion                |
| AI training data | 3 years          | Review and purge        |
| Audit logs       | 7 years          | Regulatory compliance   |
| Backups          | 30 days          | Deletion                |

### 8.2 Data Archival

**Process**:

```
1. Identify data for archival (based on retention policy)
   ↓
2. Export to archival format (Parquet, compressed JSON)
   ↓
3. Store in cold storage (S3 Glacier)
   ↓
4. Update database with archival reference
   ↓
5. Remove from active database
   ↓
6. Verify archival integrity
```

### 8.3 Data Deletion

**Soft Delete** (30 days):

- Set `deleted_at` timestamp
- Exclude from queries
- Allow recovery

**Hard Delete** (after 30 days):

- Permanent removal from database
- Related data cleanup
- Audit log entry
- No recovery possible

---

## 9. Testing Data Strategy

### 9.1 Development Environment

**Data**:

- Synthetic universities (5-10)
- Fake users (100-500)
- Generated content (1000+ posts)
- Simulated analytics

**Generation Script**:

```bash
npm run seed:dev
# Generates comprehensive test data
```

### 9.2 Staging Environment

**Data**:

- Copy of production schema
- Anonymized production data (optional)
- Synthetic data for new features
- No real social media connections

### 9.3 Load Testing

**Data Volume**:

- 100 universities
- 10,000 users
- 100,000 content items
- 1,000,000 analytics events

---

## 10. Data Documentation

### 10.1 Data Dictionary

**Location**: `docs/database/DATA_DICTIONARY.md`

**Contents**:

- Table/collection descriptions
- Column/field definitions
- Data types and constraints
- Relationships
- Sample data

### 10.2 Data Lineage

**Tracking**:

- Data source origin
- Transformation steps
- Data dependencies
- Update frequency

**Tool**: Apache Atlas or custom metadata service

---

This comprehensive data handling strategy ensures privacy, security, quality, and compliance while providing the necessary data for the platform to function effectively.
