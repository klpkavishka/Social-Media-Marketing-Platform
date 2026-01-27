# 🎓 UniSocial - AI-Powered University Social Media & Marketing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)

> An enterprise-grade, AI-powered social media and digital marketing management platform specifically designed for universities.

## ✨ Highlights

- 🤖 **AI-Powered Content Generation** - GPT-4 powered captions and hashtags
- 📊 **Advanced Analytics** - Real-time metrics across all platforms
- 📅 **Smart Scheduling** - AI-recommended posting times
- 🔄 **Multi-Platform Support** - Instagram, Facebook, Twitter, LinkedIn, TikTok, YouTube
- 👥 **Collaboration Tools** - Approval workflows and team management
- 📈 **Campaign Tracking** - ROI measurement and performance insights
- 💬 **Sentiment Analysis** - Automated comment and message analysis
- 🔐 **Enterprise Security** - RBAC, encryption, and compliance

## 🎯 Key Objectives

- **Student Recruitment**: Targeted campaigns and engagement tracking
- **Brand Building**: Consistent messaging across platforms
- **Engagement Management**: Real-time interaction and sentiment analysis
- **Data-Driven Decisions**: AI-powered analytics and recommendations

## 👥 Target Users

1. **University Marketing Administrators**
   - Platform-wide oversight and strategy
   - Budget and campaign management
   - Cross-department coordination

2. **Faculty/Department Marketing Coordinators**
   - Department-specific content management
   - Event promotion
   - Community engagement

3. **Admissions Teams**
   - Prospective student engagement
   - Campaign performance tracking
   - Lead generation and nurturing

4. **Content Creators (Student Ambassadors)**
   - Content creation and submission
   - Story and reel production
   - Peer engagement

5. **Management/Leadership**
   - High-level analytics and ROI
   - Strategic decision support
   - Performance dashboards

## 🏗️ Technology Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Charts**: Recharts / Chart.js
- **Rich Text**: Tiptap Editor

### Backend

- **Framework**: NestJS (Node.js)
- **API**: RESTful + GraphQL (optional)
- **Authentication**: JWT + Passport
- **Queue System**: Bull (Redis-based)
- **Validation**: class-validator + class-transformer

### Databases

- **Primary**: PostgreSQL (relational data, users, content)
- **Cache/Queue**: Redis
- **Document Store**: MongoDB (analytics, logs, AI data)
- **Search**: ElasticSearch (optional, content search)

### AI/ML Services

- **LLM Integration**: OpenAI GPT-4 / Anthropic Claude
- **Sentiment Analysis**: HuggingFace Transformers
- **Image Generation**: DALL-E 3 / Stability AI
- **Analytics**: Custom ML models (scikit-learn)

### Infrastructure

- **Cloud**: AWS / Azure / GCP
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston + ELK Stack

### External APIs

- **Social Media**: Meta Graph API, Twitter API, LinkedIn API, TikTok API
- **Storage**: AWS S3 / Cloudinary
- **Email**: SendGrid
- **Analytics**: Google Analytics 4

## 📁 Project Structure

```
unisocial/
├── docs/                           # Comprehensive documentation
│   ├── architecture/
│   ├── requirements/
│   ├── api/
│   └── deployment/
├── backend/                        # NestJS backend
│   ├── src/
│   ├── test/
│   └── Dockerfile
├── frontend/                       # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── ai-service/                     # Python AI microservice
│   ├── models/
│   ├── services/
│   └── Dockerfile
├── shared/                         # Shared types/utilities
├── infrastructure/                 # IaC and deployment configs
│   ├── terraform/
│   ├── kubernetes/
│   └── docker-compose.yml
└── scripts/                        # Utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd unisocial

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# 3. Start all services with Docker Compose
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# AI Service: http://localhost:8000
# API Docs: http://localhost:4000/api/docs
```

### Manual Setup (Without Docker)

<details>
<summary>Click to expand manual setup instructions</summary>

```bash
# Backend
cd backend
npm install
npm run migration:run
npm run seed
npm run start:dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# AI Service (new terminal)
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

</details>

## 📊 Core Features

✅ Multi-platform account management
✅ AI-assisted content generation
✅ Smart scheduling with optimal timing
✅ Approval workflows
✅ Real-time engagement monitoring
✅ Sentiment analysis
✅ Advanced analytics dashboards
✅ Campaign tracking
✅ Role-based access control
✅ Multi-university support

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

See CONTRIBUTING.md for guidelines

---

**Version**: 1.0.0  
**Last Updated**: January 21, 2026
