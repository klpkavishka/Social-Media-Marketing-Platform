# 📁 Project File Structure

This document provides a complete overview of the AI Social Platform project structure.

## 🌳 Complete Directory Tree

```
ai-social-platform/
│
├── 📄 README.md                        # Project introduction and quick start
├── 📄 MASTER_OVERVIEW.md               # Complete platform overview
├── 📄 IMPLEMENTATION_GUIDE.md          # Detailed setup and development guide
├── 📄 PROJECT_SUMMARY.md               # Current status and roadmap
├── 📄 QUICK_REFERENCE.md               # Commands and troubleshooting
├── 📄 CONTRIBUTING.md                  # Contribution guidelines
├── 📄 LICENSE                          # MIT License
├── 📄 .gitignore                       # Git ignore patterns
├── 📄 .env.example                     # Environment variables template
├── 📄 docker-compose.yml               # Docker Compose configuration
│
├── 📁 docs/                            # 📚 Documentation
│   ├── 📄 INDEX.md                     # Documentation index
│   │
│   ├── 📁 architecture/
│   │   ├── 📄 SYSTEM_ARCHITECTURE.md   # Complete system design
│   │   └── 📄 TECHNOLOGY_JUSTIFICATION.md  # Tech stack justification
│   │
│   ├── 📁 requirements/
│   │   ├── 📄 FUNCTIONAL_REQUIREMENTS.md   # Feature specifications
│   │   ├── 📄 NON_FUNCTIONAL_REQUIREMENTS.md  # Performance & security
│   │   └── 📄 AI_SCOPE_AND_PROMPTS.md      # AI integration details
│   │
│   ├── 📁 database/
│   │   ├── 📄 DATABASE_SCHEMA.md       # Complete DB schema
│   │   └── 📄 DATA_DICTIONARY.md       # Field definitions
│   │
│   ├── 📁 data/
│   │   └── 📄 DATASETS_AND_DATA_HANDLING.md  # Data management
│   │
│   └── 📁 api/
│       └── 📄 API_DOCUMENTATION.md     # API reference (to be generated)
│
├── 📁 backend/                         # 🔧 NestJS Backend
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 nest-cli.json
│   ├── 📄 .eslintrc.js
│   ├── 📄 .prettierrc
│   ├── 📄 Dockerfile
│   ├── 📄 Dockerfile.dev
│   │
│   ├── 📁 src/
│   │   ├── 📄 main.ts                  # Application entry point
│   │   ├── 📄 app.module.ts            # Root module
│   │   ├── 📄 app.controller.ts
│   │   ├── 📄 app.service.ts
│   │   │
│   │   ├── 📁 config/                  # Configuration
│   │   │   ├── 📄 database.config.ts
│   │   │   ├── 📄 jwt.config.ts
│   │   │   ├── 📄 redis.config.ts
│   │   │   └── 📄 s3.config.ts
│   │   │
│   │   ├── 📁 common/                  # Shared utilities
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 roles.decorator.ts
│   │   │   │   ├── 📄 current-user.decorator.ts
│   │   │   │   └── 📄 public.decorator.ts
│   │   │   │
│   │   │   ├── 📁 guards/
│   │   │   │   ├── 📄 jwt-auth.guard.ts
│   │   │   │   ├── 📄 roles.guard.ts
│   │   │   │   └── 📄 throttle.guard.ts
│   │   │   │
│   │   │   ├── 📁 interceptors/
│   │   │   │   ├── 📄 logging.interceptor.ts
│   │   │   │   ├── 📄 transform.interceptor.ts
│   │   │   │   └── 📄 cache.interceptor.ts
│   │   │   │
│   │   │   ├── 📁 filters/
│   │   │   │   ├── 📄 http-exception.filter.ts
│   │   │   │   └── 📄 validation-exception.filter.ts
│   │   │   │
│   │   │   ├── 📁 pipes/
│   │   │   │   ├── 📄 validation.pipe.ts
│   │   │   │   └── 📄 parse-uuid.pipe.ts
│   │   │   │
│   │   │   ├── 📁 dto/
│   │   │   │   └── 📄 pagination.dto.ts
│   │   │   │
│   │   │   └── 📁 interfaces/
│   │   │       ├── 📄 response.interface.ts
│   │   │       └── 📄 pagination.interface.ts
│   │   │
│   │   ├── 📁 modules/
│   │   │   │
│   │   │   ├── 📁 auth/                # 🔐 Authentication
│   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   ├── 📄 auth.service.ts
│   │   │   │   ├── 📁 dto/
│   │   │   │   ├── 📁 strategies/
│   │   │   │   └── 📁 guards/
│   │   │   │
│   │   │   ├── 📁 users/               # 👥 User Management
│   │   │   │   ├── 📄 users.module.ts
│   │   │   │   ├── 📄 users.controller.ts
│   │   │   │   ├── 📄 users.service.ts
│   │   │   │   ├── 📄 user.entity.ts
│   │   │   │   ├── 📄 users.repository.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 roles/               # 👤 Role Management
│   │   │   │   ├── 📄 roles.module.ts
│   │   │   │   ├── 📄 roles.controller.ts
│   │   │   │   ├── 📄 roles.service.ts
│   │   │   │   └── 📄 role.entity.ts
│   │   │   │
│   │   │   ├── 📁 universities/        # 🎓 University Management
│   │   │   │   ├── 📄 universities.module.ts
│   │   │   │   ├── 📄 universities.controller.ts
│   │   │   │   ├── 📄 universities.service.ts
│   │   │   │   └── 📄 university.entity.ts
│   │   │   │
│   │   │   ├── 📁 content/             # 📝 Content Management
│   │   │   │   ├── 📄 content.module.ts
│   │   │   │   ├── 📄 content.controller.ts
│   │   │   │   ├── 📄 content.service.ts
│   │   │   │   ├── 📄 content.entity.ts
│   │   │   │   ├── 📄 content-version.entity.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 social/              # 📱 Social Media Integration
│   │   │   │   ├── 📄 social.module.ts
│   │   │   │   ├── 📄 social.controller.ts
│   │   │   │   ├── 📄 social.service.ts
│   │   │   │   ├── 📄 social-account.entity.ts
│   │   │   │   ├── 📁 platforms/
│   │   │   │   │   ├── 📄 instagram.service.ts
│   │   │   │   │   ├── 📄 facebook.service.ts
│   │   │   │   │   ├── 📄 twitter.service.ts
│   │   │   │   │   ├── 📄 linkedin.service.ts
│   │   │   │   │   ├── 📄 tiktok.service.ts
│   │   │   │   │   └── 📄 youtube.service.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 campaigns/           # 📊 Campaign Management
│   │   │   │   ├── 📄 campaigns.module.ts
│   │   │   │   ├── 📄 campaigns.controller.ts
│   │   │   │   ├── 📄 campaigns.service.ts
│   │   │   │   ├── 📄 campaign.entity.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 analytics/           # 📈 Analytics & Reporting
│   │   │   │   ├── 📄 analytics.module.ts
│   │   │   │   ├── 📄 analytics.controller.ts
│   │   │   │   ├── 📄 analytics.service.ts
│   │   │   │   ├── 📄 analytics.repository.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 workflows/           # ✅ Approval Workflows
│   │   │   │   ├── 📄 workflows.module.ts
│   │   │   │   ├── 📄 workflows.controller.ts
│   │   │   │   ├── 📄 workflows.service.ts
│   │   │   │   ├── 📄 workflow.entity.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 media/               # 🖼️ Media Management
│   │   │   │   ├── 📄 media.module.ts
│   │   │   │   ├── 📄 media.controller.ts
│   │   │   │   ├── 📄 media.service.ts
│   │   │   │   ├── 📄 media.entity.ts
│   │   │   │   └── 📁 dto/
│   │   │   │
│   │   │   ├── 📁 notifications/       # 🔔 Notification System
│   │   │   │   ├── 📄 notifications.module.ts
│   │   │   │   ├── 📄 notifications.controller.ts
│   │   │   │   ├── 📄 notifications.service.ts
│   │   │   │   └── 📄 notification.entity.ts
│   │   │   │
│   │   │   ├── 📁 scheduler/           # ⏰ Job Scheduling
│   │   │   │   ├── 📄 scheduler.module.ts
│   │   │   │   ├── 📄 scheduler.service.ts
│   │   │   │   ├── 📁 processors/
│   │   │   │   │   ├── 📄 content-publish.processor.ts
│   │   │   │   │   ├── 📄 analytics-sync.processor.ts
│   │   │   │   │   └── 📄 token-refresh.processor.ts
│   │   │   │   └── 📁 jobs/
│   │   │   │
│   │   │   └── 📁 ai-integration/      # 🤖 AI Service Integration
│   │   │       ├── 📄 ai-integration.module.ts
│   │   │       ├── 📄 ai-integration.service.ts
│   │   │       └── 📁 dto/
│   │   │
│   │   └── 📁 database/
│   │       ├── 📁 migrations/
│   │       ├── 📁 seeds/
│   │       └── 📄 typeorm.config.ts
│   │
│   └── 📁 test/
│       ├── 📄 app.e2e-spec.ts
│       ├── 📄 jest-e2e.json
│       └── 📁 fixtures/
│
├── 📁 frontend/                        # 🎨 Next.js Frontend
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.ts
│   ├── 📄 postcss.config.js
│   ├── 📄 .eslintrc.json
│   ├── 📄 Dockerfile
│   ├── 📄 Dockerfile.dev
│   │
│   ├── 📁 app/                         # App Router
│   │   ├── 📄 layout.tsx               # Root layout
│   │   ├── 📄 page.tsx                 # Home page
│   │   ├── 📄 loading.tsx
│   │   ├── 📄 error.tsx
│   │   ├── 📄 not-found.tsx
│   │   │
│   │   ├── 📁 (auth)/                  # Auth routes
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 layout.tsx
│   │   │
│   │   ├── 📁 (dashboard)/             # Dashboard routes
│   │   │   ├── 📄 layout.tsx
│   │   │   ├── 📄 page.tsx             # Dashboard home
│   │   │   │
│   │   │   ├── 📁 content/             # Content management
│   │   │   │   ├── 📄 page.tsx         # Content list
│   │   │   │   ├── 📁 new/
│   │   │   │   ├── 📁 [id]/
│   │   │   │   └── 📁 calendar/
│   │   │   │
│   │   │   ├── 📁 campaigns/           # Campaign management
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   ├── 📁 new/
│   │   │   │   └── 📁 [id]/
│   │   │   │
│   │   │   ├── 📁 analytics/           # Analytics
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 reports/
│   │   │   │   └── 📁 insights/
│   │   │   │
│   │   │   ├── 📁 social-accounts/     # Social media accounts
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   └── 📁 connect/
│   │   │   │
│   │   │   ├── 📁 workflows/           # Approval workflows
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │
│   │   │   ├── 📁 team/                # Team management
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │
│   │   │   └── 📁 settings/            # Settings
│   │   │       ├── 📄 page.tsx
│   │   │       ├── 📁 profile/
│   │   │       ├── 📁 organization/
│   │   │       └── 📁 integrations/
│   │   │
│   │   └── 📁 api/                     # API routes (if needed)
│   │       └── 📁 auth/
│   │
│   ├── 📁 components/                  # React components
│   │   ├── 📁 ui/                      # shadcn/ui components
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 table.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 layout/
│   │   │   ├── 📄 header.tsx
│   │   │   ├── 📄 sidebar.tsx
│   │   │   ├── 📄 footer.tsx
│   │   │   └── 📄 navigation.tsx
│   │   │
│   │   ├── 📁 content/
│   │   │   ├── 📄 content-card.tsx
│   │   │   ├── 📄 content-form.tsx
│   │   │   ├── 📄 content-calendar.tsx
│   │   │   ├── 📄 media-uploader.tsx
│   │   │   └── 📄 ai-caption-generator.tsx
│   │   │
│   │   ├── 📁 analytics/
│   │   │   ├── 📄 dashboard-metrics.tsx
│   │   │   ├── 📄 engagement-chart.tsx
│   │   │   ├── 📄 performance-table.tsx
│   │   │   └── 📄 insights-panel.tsx
│   │   │
│   │   ├── 📁 social/
│   │   │   ├── 📄 platform-selector.tsx
│   │   │   ├── 📄 account-card.tsx
│   │   │   └── 📄 connect-modal.tsx
│   │   │
│   │   ├── 📁 campaigns/
│   │   │   ├── 📄 campaign-card.tsx
│   │   │   ├── 📄 campaign-form.tsx
│   │   │   └── 📄 campaign-metrics.tsx
│   │   │
│   │   └── 📁 common/
│   │       ├── 📄 loading-spinner.tsx
│   │       ├── 📄 error-boundary.tsx
│   │       ├── 📄 confirmation-dialog.tsx
│   │       └── 📄 pagination.tsx
│   │
│   ├── 📁 lib/
│   │   ├── 📁 api/
│   │   │   ├── 📄 client.ts           # Axios instance
│   │   │   ├── 📄 auth.ts             # Auth endpoints
│   │   │   ├── 📄 content.ts          # Content endpoints
│   │   │   ├── 📄 campaigns.ts        # Campaign endpoints
│   │   │   └── 📄 analytics.ts        # Analytics endpoints
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── 📄 use-auth.ts
│   │   │   ├── 📄 use-content.ts
│   │   │   ├── 📄 use-analytics.ts
│   │   │   └── 📄 use-toast.ts
│   │   │
│   │   ├── 📁 stores/
│   │   │   ├── 📄 auth-store.ts       # Zustand store
│   │   │   ├── 📄 content-store.ts
│   │   │   └── 📄 ui-store.ts
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 date.ts
│   │   │   ├── 📄 format.ts
│   │   │   ├── 📄 validation.ts
│   │   │   └── 📄 cn.ts               # Class name utility
│   │   │
│   │   └── 📁 types/
│   │       ├── 📄 user.ts
│   │       ├── 📄 content.ts
│   │       ├── 📄 campaign.ts
│   │       └── 📄 analytics.ts
│   │
│   ├── 📁 public/
│   │   ├── 📄 favicon.ico
│   │   ├── 📁 images/
│   │   └── 📁 fonts/
│   │
│   └── 📁 styles/
│       └── 📄 globals.css
│
├── 📁 ai-service/                      # 🤖 Python AI Service
│   ├── 📄 requirements.txt
│   ├── 📄 main.py
│   ├── 📄 Dockerfile
│   ├── 📄 Dockerfile.dev
│   │
│   ├── 📁 app/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 main.py                  # FastAPI app
│   │   ├── 📄 config.py                # Configuration
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 content_generator.py
│   │   │   ├── 📄 sentiment_analyzer.py
│   │   │   ├── 📄 prediction_engine.py
│   │   │   ├── 📄 chatbot.py
│   │   │   └── 📄 image_analyzer.py
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 schemas.py           # Pydantic models
│   │   │   └── 📄 ml_models.py
│   │   │
│   │   ├── 📁 routers/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 generate.py          # Generation endpoints
│   │   │   ├── 📄 sentiment.py         # Sentiment endpoints
│   │   │   ├── 📄 predict.py           # Prediction endpoints
│   │   │   └── 📄 chatbot.py           # Chatbot endpoints
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 openai_client.py
│   │   │   ├── 📄 prompts.py
│   │   │   └── 📄 cache.py
│   │   │
│   │   └── 📁 data/
│   │       ├── 📄 prompts.json
│   │       └── 📄 organization_kb.json
│   │
│   └── 📁 tests/
│       ├── 📄 test_content_generator.py
│       ├── 📄 test_sentiment_analyzer.py
│       └── 📄 conftest.py
│
├── 📁 shared/                          # 🔗 Shared Code
│   └── 📁 types/
│       ├── 📄 user.types.ts
│       ├── 📄 content.types.ts
│       └── 📄 common.types.ts
│
├── 📁 infrastructure/                  # ⚙️ Infrastructure as Code
│   ├── 📁 terraform/
│   │   ├── 📄 main.tf
│   │   ├── 📄 variables.tf
│   │   ├── 📄 outputs.tf
│   │   ├── 📁 modules/
│   │   │   ├── 📁 vpc/
│   │   │   ├── 📁 rds/
│   │   │   ├── 📁 eks/
│   │   │   └── 📁 s3/
│   │   └── 📁 environments/
│   │       ├── 📁 dev/
│   │       ├── 📁 staging/
│   │       └── 📁 production/
│   │
│   ├── 📁 kubernetes/
│   │   ├── 📁 base/
│   │   │   ├── 📄 namespace.yaml
│   │   │   ├── 📄 configmap.yaml
│   │   │   ├── 📄 secret.yaml
│   │   │   ├── 📄 backend-deployment.yaml
│   │   │   ├── 📄 frontend-deployment.yaml
│   │   │   ├── 📄 ai-service-deployment.yaml
│   │   │   └── 📄 ingress.yaml
│   │   │
│   │   └── 📁 overlays/
│   │       ├── 📁 development/
│   │       ├── 📁 staging/
│   │       └── 📁 production/
│   │
│   ├── 📁 monitoring/
│   │   ├── 📁 prometheus/
│   │   │   ├── 📄 prometheus.yml
│   │   │   └── 📄 alerts.yml
│   │   │
│   │   └── 📁 grafana/
│   │       └── 📁 dashboards/
│   │
│   └── 📁 scripts/
│       ├── 📄 deploy.sh
│       ├── 📄 backup.sh
│       ├── 📄 restore.sh
│       └── 📄 health-check.sh
│
├── 📁 .github/                         # GitHub workflows
│   ├── 📁 workflows/
│   │   ├── 📄 ci.yml
│   │   ├── 📄 cd.yml
│   │   ├── 📄 test.yml
│   │   └── 📄 security-scan.yml
│   │
│   └── 📄 pull_request_template.md
│
└── 📁 scripts/                         # Utility scripts
    ├── 📄 setup.sh
    ├── 📄 seed-data.ts
    ├── 📄 generate-types.ts
    └── 📄 clean.sh
```

---

## 📝 File Naming Conventions

### TypeScript/JavaScript

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: kebab-case (e.g., `date-utils.ts`)
- **Services**: kebab-case (e.g., `auth-service.ts`)
- **Types**: kebab-case (e.g., `user-types.ts`)
- **Tests**: `*.spec.ts` or `*.test.ts`

### Python

- **All files**: snake_case (e.g., `content_generator.py`)
- **Tests**: `test_*.py`

### Configuration

- **Lowercase with extensions**: (e.g., `docker-compose.yml`)

---

## 🎯 Key Directories

### Must Know

- `/docs` - All documentation
- `/backend/src/modules` - Backend features
- `/frontend/app` - Frontend pages
- `/ai-service/app/services` - AI services

### Important for Development

- `/backend/src/common` - Shared backend code
- `/frontend/components` - UI components
- `/frontend/lib` - Frontend utilities
- `/shared/types` - Shared TypeScript types

### Infrastructure

- `/infrastructure/kubernetes` - K8s configs
- `/infrastructure/terraform` - IaC
- `/.github/workflows` - CI/CD

---

This structure provides clear organization and makes it easy to locate any file or feature in the project.
