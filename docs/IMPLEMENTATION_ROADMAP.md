# Social Media API Integration - Implementation Roadmap

**Start Date**: April 19, 2026  
**Estimated Duration**: 3-4 weeks  
**Priority**: P0 (Blocking for social accounts dashboard)

---

## Phase 1: Setup & Credentials (Week 1)

### Day 1-2: Meta (Facebook/Instagram)

**Subtasks:**
- [ ] Create Meta Developer Account
- [ ] Create app on Meta Developer Portal
- [ ] Enable Facebook Login product
- [ ] Enable Instagram Basic Display and Graph API products
- [ ] Get App ID and App Secret
- [ ] Configure OAuth redirect URIs
- [ ] Get test access token from Graph API Explorer
- [ ] Exchange for long-lived token (60 days)
- [ ] Store credentials in `.env`

**Resources:**
- [Meta Developer Portal](https://developers.facebook.com/)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

**Expected Output:**
- App ID, App Secret, Test Access Token

---

### Day 3: Twitter API v2

**Subtasks:**
- [ ] Create Twitter Developer Account
- [ ] Create project in Twitter Developer Portal
- [ ] Create app with Confidential Client type
- [ ] Get API Key and API Secret
- [ ] Enable OAuth 2.0 with PKCE
- [ ] Configure redirect URIs
- [ ] Set app permissions to "Read and Write"
- [ ] Get Bearer Token
- [ ] Store in `.env`

**Resources:**
- [Twitter Developer Portal](https://developer.twitter.com/en/portal)
- [OAuth 2.0 with PKCE Documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0)

**Expected Output:**
- Client ID, Client Secret, Bearer Token

---

### Day 4: LinkedIn Marketing API

**Subtasks:**
- [ ] Create LinkedIn Developer Account
- [ ] Create app in LinkedIn Developer Console
- [ ] Get Client ID and Client Secret
- [ ] Configure OAuth Redirect URLs
- [ ] Request access to required products:
  - Share on LinkedIn
  - Sign In with LinkedIn
  - LinkedIn Pages
- [ ] Get necessary scopes approved
- [ ] Store in `.env`

**Resources:**
- [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)
- [LinkedIn OAuth 2.0 Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)

**Expected Output:**
- Client ID, Client Secret

---

### Day 5: TikTok & YouTube

**TikTok:**
- [ ] Create TikTok for Business Account
- [ ] Create app in TikTok Developer Portal
- [ ] Get Client Key and Client Secret
- [ ] Set redirect URIs
- [ ] Request API access (may take 24-48 hours)
- [ ] Get test/sandbox credentials

**YouTube:**
- [ ] Create Google Cloud Project
- [ ] Enable YouTube Data API v3
- [ ] Enable YouTube Analytics API
- [ ] Create OAuth 2.0 consent screen
- [ ] Create OAuth 2.0 credentials (Web application)
- [ ] Get Client ID and Client Secret
- [ ] Add redirect URIs
- [ ] Store all credentials in `.env`

**Resources:**
- [TikTok Developer Portal](https://developers.tiktok.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

**Expected Output:**
- All 5 APIs with complete credentials

---

## Phase 2: Backend Implementation (Weeks 2-3)

### Week 2: Core Services & OAuth Handlers

**Day 1-2: Enhanced Entity & Base Service**

**Tasks:**
- [ ] Update `social-account.entity.ts` with encryption utilities
- [ ] Add token refresh fields and methods
- [ ] Create `encryption.ts` utility for token storage
- [ ] Update `base-platform.service.ts` with abstract methods
- [ ] Add error handling and logging

**Files to modify:**
- `backend/src/modules/social/entities/social-account.entity.ts`
- `backend/src/modules/social/services/base-platform.service.ts`
- `backend/src/common/utils/encryption.ts` (create new)

---

**Day 3-4: Meta Service Implementation**

**Tasks:**
- [ ] Implement `MetaService` with all methods:
  - `exchangeCodeForToken()`
  - `getLongLivedToken()`
  - `getConnectedAccounts()`
  - `getInstagramAnalytics()`
  - `publishPost()`
- [ ] Test with test access token
- [ ] Add error handling for common failures
- [ ] Add logging for debugging

**Files:**
- `backend/src/modules/social/services/meta.service.ts`

**Testing:**
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_TOKEN"
```

---

**Day 5: Twitter Service Implementation**

**Tasks:**
- [ ] Implement `TwitterService`:
  - `exchangeCodeForToken()` with PKCE
  - `getAuthenticatedUser()`
  - `getUserAnalytics()`
  - `createTweet()`
  - `uploadMedia()`
  - `refreshAccessToken()`
- [ ] Test OAuth flow
- [ ] Verify PKCE challenge/verifier

**Files:**
- `backend/src/modules/social/services/twitter.service.ts`
- `backend/src/common/utils/pkce.ts` (create new)

---

### Week 3: LinkedIn, TikTok, YouTube & Controllers

**Day 1-2: LinkedIn Service**

**Tasks:**
- [ ] Implement `LinkedInService`:
  - `exchangeCodeForToken()`
  - `getUserProfile()`
  - `getUserOrganizations()`
  - `getOrganizationAnalytics()`
  - `publishPost()`
- [ ] Handle organization-level access
- [ ] Test with test credentials

**Files:**
- `backend/src/modules/social/services/linkedin.service.ts`

---

**Day 3: TikTok Service**

**Tasks:**
- [ ] Implement `TikTokService`:
  - `exchangeCodeForToken()`
  - `getUserInfo()`
  - `getUserAnalytics()`
  - `initiateVideoUpload()`
  - `uploadVideoChunk()`
  - `publishVideo()`
  - `refreshAccessToken()`

**Files:**
- `backend/src/modules/social/services/tiktok.service.ts`

---

**Day 4: YouTube Service**

**Tasks:**
- [ ] Implement `YouTubeService`:
  - `exchangeCodeForToken()`
  - `getAuthenticatedChannel()`
  - `getChannelAnalytics()`
  - `uploadVideo()`
  - `refreshAccessToken()`

**Files:**
- `backend/src/modules/social/services/youtube.service.ts`

---

**Day 5: OAuth Controllers & Module Updates**

**Tasks:**
- [ ] Create `social-oauth.controller.ts` with all callbacks
- [ ] Implement proper error handling and redirects
- [ ] Update `social.module.ts` with all providers
- [ ] Update `social.service.ts` with analytics routing
- [ ] Test all OAuth flows end-to-end

**Files:**
- `backend/src/modules/social/controllers/social-oauth.controller.ts` (create)
- `backend/src/modules/social/social.module.ts` (update)
- `backend/src/modules/social/social.service.ts` (update)

---

## Phase 3: Frontend Integration (Week 3-4)

### Day 1-2: API Client & Hooks

**Tasks:**
- [ ] Create `frontend/lib/api/social.ts` with all endpoints
- [ ] Create `frontend/hooks/use-social-accounts.ts` hook
- [ ] Implement loading and error states
- [ ] Add React Query integration

**Files:**
- `frontend/lib/api/social.ts`
- `frontend/hooks/use-social-accounts.ts`

---

**Day 3: Update Components**

**Tasks:**
- [ ] Update `connect-account-dialog.tsx` with real OAuth URLs
- [ ] Update `social-account-card.tsx` to use real data
- [ ] Update `page.tsx` to call API instead of mock data
- [ ] Add loading skeletons
- [ ] Add error boundaries

**Files:**
- `frontend/components/social/connect-account-dialog.tsx`
- `frontend/components/social/social-account-card.tsx`
- `frontend/app/dashboard/social-accounts/page.tsx`

---

**Day 4-5: End-to-End Testing**

**Tasks:**
- [ ] Test Meta OAuth flow
- [ ] Test Twitter OAuth with PKCE
- [ ] Test LinkedIn OAuth
- [ ] Test TikTok OAuth
- [ ] Test YouTube OAuth
- [ ] Verify account storage in database
- [ ] Verify analytics display
- [ ] Test error scenarios

---

## Phase 4: Testing & Deployment (Week 4)

### Day 1-2: Security Audit

**Tasks:**
- [ ] Verify token encryption at rest
- [ ] Verify HTTPS enforcement
- [ ] Test rate limiting compliance
- [ ] Audit error messages (no token leaks)
- [ ] Test CORS configuration
- [ ] Verify authorization checks

---

**Day 3: Performance & Load Testing**

**Tasks:**
- [ ] Test concurrent OAuth connections
- [ ] Monitor API response times
- [ ] Check database query optimization
- [ ] Test analytics aggregation speed

---

**Day 4: Documentation & Handoff**

**Tasks:**
- [ ] Document all environment variables
- [ ] Create setup guide for new developers
- [ ] Document token refresh strategy
- [ ] Create troubleshooting guide
- [ ] Add API endpoint documentation

---

**Day 5: Deployment**

**Tasks:**
- [ ] Deploy to staging environment
- [ ] Run full integration tests
- [ ] Get approval from team
- [ ] Deploy to production
- [ ] Monitor for errors

---

## Critical Milestones

| Milestone | Date | Deliverable |
|-----------|------|-------------|
| All credentials ready | Day 5 (Week 1) | `.env` file with all API keys |
| Backend services complete | Day 5 (Week 2) | All 5 platform services tested |
| Frontend integration done | Day 5 (Week 3) | Working OAuth flows on dashboard |
| Testing complete | Day 2 (Week 4) | All test cases passing |
| Production ready | Day 5 (Week 4) | Live on production |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| API approval delays (TikTok, LinkedIn) | Start approval process immediately, use sandbox during waiting |
| Token refresh failures | Implement automatic retry with exponential backoff |
| Rate limiting issues | Implement request queuing and caching |
| Data loss during migration | Keep mock data as fallback, gradual rollout |
| Security vulnerabilities | Conduct code review before production, penetration testing |

---

## Success Criteria

- ✅ All 5 platforms connected and syncing data
- ✅ Account management working (connect/disconnect)
- ✅ Analytics displaying correctly
- ✅ < 200ms API response time
- ✅ Zero production errors in first week
- ✅ User can connect account in < 3 clicks
- ✅ Token refresh working automatically
- ✅ Security audit passed

---

## Next Steps

1. **TODAY**: Set up credentials for all 5 platforms
2. **TOMORROW**: Start Meta service implementation
3. **THIS WEEK**: Complete all backend services
4. **NEXT WEEK**: Integrate with frontend
5. **WEEK AFTER**: Testing and deployment

---

## Useful Commands

```bash
# Start backend in dev mode
cd backend && npm run start:dev

# Run tests
npm run test

# Check linting
npm run lint

# Generate TypeORM migration
npm run migration:generate -- -n AddSocialAccountFields

# Run migrations
npm run migration:run

# Start frontend
cd frontend && npm run dev

# Build for production
npm run build
```

---

## Contact & Support

- **Documentation**: See `SOCIAL_MEDIA_API_INTEGRATION_GUIDE.md`
- **Questions**: Check platform's official documentation
- **Debugging**: Check logs in `backend/logs/`
- **Issues**: Create GitHub issue with platform name and error details

