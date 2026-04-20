# Quick Reference Guide - UniSocial Platform

## 🚀 Essential Commands

### Local Development

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild services
docker-compose up -d --build
```

### Backend (NestJS)

```bash
cd backend

# Development
npm run start:dev        # Hot reload
npm run start:debug      # Debug mode

# Testing
npm run test            # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Coverage

# Database
npm run migration:run    # Run migrations
npm run migration:revert # Revert last
npm run seed            # Seed data

# Build
npm run build           # Production build
npm run start:prod      # Run production
```

### Frontend (Next.js)

```bash
cd frontend

# Development
npm run dev             # Dev server (port 3000)

# Testing
npm run test            # Unit tests
npm run test:e2e        # Playwright E2E

# Build
npm run build           # Production build
npm run start           # Run production
npm run lint            # Lint code
```

### AI Service (Python)

```bash
cd ai-service

# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Development
uvicorn main:app --reload --port 8000

# Testing
pytest                   # All tests
pytest -v               # Verbose
pytest tests/unit       # Unit only
```

---

## 📁 Key Files & Locations

### Configuration Files

```
.env                    # Environment variables
.env.example            # Template
docker-compose.yml      # Local development
.gitignore             # Git ignore patterns
```

### Documentation

```
README.md                           # Project introduction
MASTER_OVERVIEW.md                  # Complete overview
IMPLEMENTATION_GUIDE.md             # Setup and development
PROJECT_SUMMARY.md                  # Status and next steps

docs/architecture/
├── SYSTEM_ARCHITECTURE.md          # Full architecture
└── TECHNOLOGY_JUSTIFICATION.md     # Tech choices

docs/requirements/
├── FUNCTIONAL_REQUIREMENTS.md      # Features
├── NON_FUNCTIONAL_REQUIREMENTS.md  # Performance, security
└── AI_SCOPE_AND_PROMPTS.md        # AI details

docs/database/
└── DATABASE_SCHEMA.md              # DB design

docs/data/
└── DATASETS_AND_DATA_HANDLING.md   # Data management
```

### Source Code (To Be Created)

```
backend/src/
├── main.ts                 # Entry point
├── app.module.ts           # Root module
└── modules/
    ├── auth/              # Authentication
    ├── users/             # User management
    ├── content/           # Content mgmt
    ├── social/            # Social media
    └── ...

frontend/app/
├── (auth)/                # Auth pages
├── (dashboard)/           # Main app
├── layout.tsx            # Root layout
└── page.tsx              # Home page

ai-service/app/
├── main.py               # Entry point
├── services/             # AI services
├── models/               # ML models
└── routers/              # API routes
```

---

## 🔌 API Endpoints (Planned)

### Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### Users

```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

### Content

```
GET    /api/v1/content
POST   /api/v1/content
GET    /api/v1/content/:id
PUT    /api/v1/content/:id
DELETE /api/v1/content/:id
POST   /api/v1/content/:id/publish
```

### Social Accounts

```
GET    /api/v1/social/accounts
POST   /api/v1/social/accounts/connect
DELETE /api/v1/social/accounts/:id
GET    /api/v1/social/accounts/:id/metrics
```

### Analytics

```
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/metrics
GET    /api/v1/analytics/reports/:type
POST   /api/v1/analytics/custom-report
```

### AI Services

```
POST   /ai/v1/generate/caption
POST   /ai/v1/generate/hashtags
POST   /ai/v1/sentiment/analyze
POST   /ai/v1/predict/engagement
POST   /ai/v1/predict/timing
```

---

## 🗄️ Database Quick Reference

### PostgreSQL Tables

```
universities          # University accounts
users                # User accounts
roles                # User roles
permissions          # Permissions
social_accounts      # Connected social accounts
content              # Content posts
content_versions     # Content history
campaigns            # Marketing campaigns
campaign_content     # Campaign-content junction
workflows            # Approval workflows
workflow_actions     # Workflow history
media_library        # Media files
notifications        # User notifications
audit_logs          # Audit trail
settings            # System settings
```

### MongoDB Collections

```
analytics_events     # Social media metrics
engagements         # Comments, messages
ai_logs             # AI usage logs
system_logs         # Application logs
performance_metrics # ML training data
```

### Redis Keys

```
session:{sessionId}                    # User sessions
cache:api:{endpoint}:{hash}            # API cache
rate_limit:{user_id}:{endpoint}        # Rate limiting
realtime:{university_id}:active_users  # Real-time data
bull:{queue_name}:{job_id}            # Job queue
```

---

## 🔐 Environment Variables

### Critical Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://user:pass@host:27017/db
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret

# AI
OPENAI_API_KEY=sk-your-key-here

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your-bucket

# Social Media
META_APP_ID=your_id
META_APP_SECRET=your_secret
```

---

## 🐛 Common Issues & Solutions

### Issue: Database Connection Failed

```bash
# Check if database is running
docker ps | grep postgres

# Restart database
docker restart unisocial-postgres

# Check connection string
echo $DATABASE_URL
```

### Issue: Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux

# Kill process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # Mac/Linux
```

### Issue: npm/pip Install Fails

```bash
# Clear cache
npm cache clean --force
pip cache purge

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Docker Container Won't Start

```bash
# View logs
docker logs unisocial-backend

# Remove and rebuild
docker-compose down
docker-compose up -d --build

# Clean everything
docker system prune -a
docker volume prune
```

---

## 📊 Performance Targets

### Response Times

- API calls: < 200ms (p95)
- Page load: < 2s
- AI generation: < 5s
- Database queries: < 50ms

### Scalability

- Concurrent users: 5,000+
- Requests/minute: 100,000+
- Universities: 100+
- Content/day: 10,000+

### Reliability

- Uptime: 99.9%
- Error rate: < 0.1%
- Data durability: 99.999%

---

## 🧪 Testing Checklist

### Before Committing

- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Types are correct (TypeScript)
- [ ] Environment variables documented

### Before PR

- [ ] Feature works in dev environment
- [ ] Tests written for new code
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented

### Before Deploy

- [ ] All E2E tests pass
- [ ] Performance tested
- [ ] Security scan passed
- [ ] Database migrations work
- [ ] Environment variables set
- [ ] Monitoring configured

---

## 📱 Social Media API Limits

### Meta (Facebook/Instagram)

- Rate limit: 200 calls/hour/user
- Webhook events: Real-time
- Data retention: 90 days

### Twitter

- Rate limit: 300 requests/15 min
- Tweet limit: 2,400/day
- Media size: 5MB (images), 512MB (video)

### LinkedIn

- Rate limit: 100 calls/day (varies)
- Post frequency: 150/day max
- Media size: 8MB max

### TikTok

- Rate limit: 100 requests/minute
- Video size: 500MB max
- Video length: 15-60 seconds

### YouTube

- Quota: 10,000 units/day
- Video size: 256GB max
- Upload time: ~10min for 1080p

---

## 🎯 MVP Feature Checklist

### Must Have ✅

- [ ] User authentication
- [ ] Social account connection (Instagram, Facebook)
- [ ] Content creation
- [ ] Media upload
- [ ] AI caption generation
- [ ] Content scheduling
- [ ] Content publishing
- [ ] Basic analytics
- [ ] Simple approval workflow

### Should Have 🟡

- [ ] Sentiment analysis
- [ ] Campaign management
- [ ] Advanced analytics
- [ ] Multi-step approval
- [ ] Content calendar UI

### Nice to Have 🔵

- [ ] Chatbot
- [ ] Optimal timing
- [ ] Competitor analysis
- [ ] Advanced reporting
- [ ] Multi-university

---

## 📚 Learning Resources

### Official Documentation

- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- FastAPI: https://fastapi.tiangolo.com
- PostgreSQL: https://www.postgresql.org/docs
- MongoDB: https://docs.mongodb.com
- Redis: https://redis.io/docs

### Video Tutorials

- [NestJS Complete Course](https://youtube.com)
- [Next.js 14 Tutorial](https://youtube.com)
- [Docker for Developers](https://youtube.com)
- [Kubernetes Basics](https://youtube.com)

### Books

- "Designing Data-Intensive Applications" - Martin Kleppmann
- "Clean Architecture" - Robert C. Martin
- "System Design Interview" - Alex Xu

---

## 🆘 Getting Help

### Internal Resources

1. Check documentation in `/docs`
2. Search GitHub issues
3. Review implementation guide

### External Resources

1. Stack Overflow
2. NestJS Discord
3. React Discord
4. GitHub Discussions

### Contact

- Technical Lead: [email]
- Project Manager: [email]
- DevOps: [email]
- Support: support@unisocial.com

---

## 🎉 Next Steps

1. ✅ Read MASTER_OVERVIEW.md
2. ✅ Review IMPLEMENTATION_GUIDE.md
3. ⏳ Set up local environment
4. ⏳ Start Phase 1 development
5. ⏳ Implement MVP features
6. ⏳ Test and deploy

---

**Keep this guide bookmarked for quick reference! 📌**
