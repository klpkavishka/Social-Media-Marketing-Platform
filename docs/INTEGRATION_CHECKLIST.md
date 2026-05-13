# Social Media API Integration - Developer Checklist

## Pre-Integration Setup

### Environment & Tools
- [ ] Node.js v20+ installed
- [ ] npm installed
- [ ] Docker running (for database)
- [ ] Postman or Insomnia installed for API testing
- [ ] Git configured

### Developer Accounts (Get These First!)
- [ ] Meta Developer Account created
- [ ] Twitter Developer Account created
- [ ] LinkedIn Developer Account created
- [ ] TikTok for Business Account created
- [ ] Google Cloud Account created

---

## Phase 1: Credentials Collection

### Meta (Facebook/Instagram)
**Deadline: Day 2**

```checklist
- [ ] App ID obtained
- [ ] App Secret obtained
- [ ] Test Access Token obtained
- [ ] Long-lived Access Token obtained (60 days)
- [ ] OAuth Redirect URIs configured
- [ ] Instagram Business Account ID found
- [ ] Token verified with test API call:
      curl "https://graph.facebook.com/me?access_token=YOUR_TOKEN"
```

### Twitter API v2
**Deadline: Day 3**

```checklist
- [ ] API Key obtained
- [ ] API Secret obtained
- [ ] Bearer Token obtained
- [ ] OAuth 2.0 credentials created (Client ID + Secret)
- [ ] Redirect URIs configured
- [ ] PKCE capability verified
- [ ] Permissions set to "Read and Write"
- [ ] Token verified:
      curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
           "https://api.twitter.com/2/users/me"
```

### LinkedIn Marketing API
**Deadline: Day 4**

```checklist
- [ ] Client ID obtained
- [ ] Client Secret obtained
- [ ] OAuth Redirect URIs configured
- [ ] Product access requested:
    - [ ] Share on LinkedIn
    - [ ] Sign In with LinkedIn
    - [ ] LinkedIn Pages
- [ ] Scopes identified:
    - [ ] w_member_social
    - [ ] w_organization_social
    - [ ] r_organization_admin
- [ ] Access approval status checked
```

### TikTok Business API
**Deadline: Day 4**

```checklist
- [ ] TikTok for Business Account created
- [ ] Developer app created
- [ ] Client Key obtained
- [ ] Client Secret obtained
- [ ] Sandbox credentials obtained (for testing)
- [ ] Redirect URIs configured
- [ ] Product access requested:
    - [ ] TikTok Content Creator API
    - [ ] TikTok Analytics API
- [ ] Access status: ______ (Approved/Pending/Sandbox)
```

### YouTube Data API v3
**Deadline: Day 5**

```checklist
- [ ] Google Cloud Project created (AI Social Platform)
- [ ] YouTube Data API v3 enabled
- [ ] YouTube Analytics API enabled
- [ ] Google Drive API enabled
- [ ] OAuth 2.0 consent screen configured
- [ ] Client ID obtained
- [ ] Client Secret obtained
- [ ] Redirect URIs configured
- [ ] Scopes identified:
    - [ ] https://www.googleapis.com/auth/youtube
    - [ ] https://www.googleapis.com/auth/youtube.analytics
    - [ ] https://www.googleapis.com/auth/youtube.force-ssl
```

### .env Configuration
```checklist
- [ ] .env file created from .env.example
- [ ] All Meta credentials added
- [ ] All Twitter credentials added
- [ ] All LinkedIn credentials added
- [ ] All TikTok credentials added
- [ ] All YouTube credentials added
- [ ] Database URL configured
- [ ] Encryption key generated (32 chars minimum)
- [ ] Frontend URL set correctly
- [ ] API URL set correctly
- [ ] No credentials committed to git ✓
```

---

## Phase 2: Backend Implementation

### Utilities & Helpers
```checklist
- [ ] Create backend/src/common/utils/encryption.ts
    - [ ] encrypt() function working
    - [ ] decrypt() function working
    - [ ] Environment key loaded properly
- [ ] Create backend/src/common/utils/pkce.ts
    - [ ] generatePKCEChallenge() generates valid pair
    - [ ] Tested with Twitter OAuth
```

### Database Setup
```checklist
- [ ] SocialAccount entity has required fields:
    - [ ] id (UUID primary key)
    - [ ] platform (enum)
    - [ ] accountId (unique per platform)
    - [ ] accountName
    - [ ] username
    - [ ] accessToken (encrypted)
    - [ ] refreshToken (encrypted, if supported)
    - [ ] tokenExpiry (timestamp)
    - [ ] status (enum: connected/disconnected/error)
    - [ ] userId (foreign key to users)
    - [ ] createdAt, updatedAt (timestamps)
- [ ] Migration created and tested
- [ ] Database schema verified
```

### Meta Service
**File: backend/src/modules/social/services/meta.service.ts**

```checklist
- [ ] Class extends BasePlatformService
- [ ] Constructor receives HttpService, ConfigService
- [ ] exchangeCodeForToken() implemented and tested
- [ ] getLongLivedToken() implemented and tested
- [ ] getConnectedAccounts() implemented and tested
- [ ] getInstagramAnalytics() implemented
- [ ] publishPost() implemented
- [ ] Error handling for all methods
- [ ] Logging for debugging
- [ ] Unit tests written
- [ ] Integration test: Can exchange code → get token ✓
```

### Twitter Service
**File: backend/src/modules/social/services/twitter.service.ts**

```checklist
- [ ] Class extends BasePlatformService
- [ ] exchangeCodeForToken() with PKCE implemented
- [ ] getAuthenticatedUser() implemented
- [ ] getUserAnalytics() implemented
- [ ] createTweet() implemented
- [ ] uploadMedia() implemented
- [ ] refreshAccessToken() implemented
- [ ] Error handling for all methods
- [ ] Logging for debugging
- [ ] Unit tests written
- [ ] Integration test: OAuth flow with PKCE ✓
```

### LinkedIn Service
**File: backend/src/modules/social/services/linkedin.service.ts**

```checklist
- [ ] Class extends BasePlatformService
- [ ] exchangeCodeForToken() implemented
- [ ] getUserProfile() implemented
- [ ] getUserOrganizations() implemented
- [ ] getOrganizationAnalytics() implemented
- [ ] publishPost() implemented
- [ ] Error handling for all methods
- [ ] Logging for debugging
- [ ] Unit tests written
- [ ] Integration test: OAuth flow ✓
```

### TikTok Service
**File: backend/src/modules/social/services/tiktok.service.ts**

```checklist
- [ ] Class extends BasePlatformService
- [ ] exchangeCodeForToken() implemented
- [ ] getUserInfo() implemented
- [ ] getUserAnalytics() implemented
- [ ] initiateVideoUpload() implemented
- [ ] uploadVideoChunk() implemented
- [ ] publishVideo() implemented
- [ ] refreshAccessToken() implemented
- [ ] Error handling for all methods
- [ ] Logging for debugging
- [ ] Unit tests written
- [ ] Integration test: OAuth flow ✓
```

### YouTube Service
**File: backend/src/modules/social/services/youtube.service.ts**

```checklist
- [ ] Class extends BasePlatformService
- [ ] exchangeCodeForToken() implemented
- [ ] getAuthenticatedChannel() implemented
- [ ] getChannelAnalytics() implemented
- [ ] uploadVideo() implemented
- [ ] refreshAccessToken() implemented
- [ ] Error handling for all methods
- [ ] Logging for debugging
- [ ] Unit tests written
- [ ] Integration test: OAuth flow ✓
```

### OAuth Callbacks Controller
**File: backend/src/modules/social/controllers/social-oauth.controller.ts**

```checklist
- [ ] Meta callback implemented (@Get('meta/callback'))
- [ ] Twitter callback implemented (@Post('twitter/callback'))
- [ ] LinkedIn callback implemented (@Post('linkedin/callback'))
- [ ] TikTok callback implemented (@Post('tiktok/callback'))
- [ ] YouTube callback implemented (@Post('youtube/callback'))
- [ ] All callbacks properly handle state validation
- [ ] All callbacks save account to database
- [ ] All callbacks redirect to frontend with proper status
- [ ] Error handling with user-friendly messages
- [ ] Logging for debugging
```

### Module Updates
```checklist
- [ ] social.module.ts imports all services
- [ ] social.module.ts exports all services
- [ ] social.controller.ts updated with new endpoints
- [ ] social.service.ts updated with:
    - [ ] create() method
    - [ ] findAll() with filtering
    - [ ] findOne() 
    - [ ] remove()
    - [ ] getAnalytics() with platform routing
- [ ] All dependencies injected properly
```

### Testing
```checklist
- [ ] npm run lint passes
- [ ] npm run build succeeds
- [ ] npm run test passes for social module
- [ ] Can start backend: npm run start:dev
- [ ] No console errors on startup
- [ ] Database connects successfully
- [ ] All services instantiated without errors
```

---

## Phase 3: Frontend Integration

### API Client
**File: frontend/lib/api/social.ts**

```checklist
- [ ] getAccounts() function works
- [ ] getAccount() function works
- [ ] getAnalytics() function works
- [ ] deleteAccount() function works
- [ ] Proper error handling
- [ ] TypeScript types correct
```

### Hooks
**File: frontend/hooks/use-social-accounts.ts**

```checklist
- [ ] Hook created with React Query
- [ ] useQuery for fetching accounts
- [ ] useMutation for delete operations
- [ ] Loading states work
- [ ] Error states work
- [ ] Refetch trigger works
```

### Components Update
**File: frontend/components/social/connect-account-dialog.tsx**

```checklist
- [ ] Dialog opens properly
- [ ] All 5 platform buttons present
- [ ] OAuth URLs correct for each platform
- [ ] Redirects to correct OAuth provider
- [ ] Handles success/error responses
- [ ] Disables already-connected platforms
- [ ] Proper error messages displayed
```

**File: frontend/components/social/social-account-card.tsx**

```checklist
- [ ] Displays real account data (not mock)
- [ ] Shows correct platform icon
- [ ] Status badge displays correctly
- [ ] Metrics display correctly
- [ ] Reconnect button functional
- [ ] Disconnect button functional (with confirmation)
- [ ] Manage button opens correct view
- [ ] All links work (profile, etc)
```

**File: frontend/app/dashboard/social-accounts/page.tsx**

```checklist
- [ ] Removes mock data
- [ ] Fetches real data from API
- [ ] Displays loading skeleton
- [ ] Displays error state
- [ ] Search functionality works
- [ ] Filter by platform works
- [ ] Filter by status works
- [ ] Tab navigation works
- [ ] "Export Report" button visible (can be non-functional for now)
- [ ] Connect button works
- [ ] Empty state message shows when no accounts
```

### Testing
```checklist
- [ ] npm run lint passes
- [ ] npm run build succeeds
- [ ] No TypeScript errors
- [ ] dev server starts: npm run dev
- [ ] Page loads at /dashboard/social-accounts
- [ ] Can see mock data initially (if API down)
- [ ] "Connect Account" button works
```

---

## Phase 4: End-to-End Testing

### OAuth Flows
```checklist
- [ ] Meta OAuth flow complete
    - [ ] Dialog opens ✓
    - [ ] Redirects to Facebook ✓
    - [ ] Callback received ✓
    - [ ] Account saved to DB ✓
    - [ ] Appears in account list ✓
- [ ] Twitter OAuth flow complete
    - [ ] Dialog opens ✓
    - [ ] PKCE parameters generated ✓
    - [ ] Redirects to Twitter ✓
    - [ ] Callback received ✓
    - [ ] Account saved to DB ✓
    - [ ] Appears in account list ✓
- [ ] LinkedIn OAuth flow complete (similar checks)
- [ ] TikTok OAuth flow complete (similar checks)
- [ ] YouTube OAuth flow complete (similar checks)
```

### Account Management
```checklist
- [ ] Can view connected accounts
- [ ] Can see all 5 platforms mixed
- [ ] Can disconnect account
- [ ] Disconnected account removed from list
- [ ] Can reconnect account
- [ ] Can search accounts
- [ ] Can filter by platform
- [ ] Can filter by status
```

### Analytics
```checklist
- [ ] Metrics Summary displays correctly
- [ ] Followers count correct
- [ ] Engagement numbers correct
- [ ] Reach numbers correct
- [ ] Post counts correct
- [ ] Percentages calculated correctly
- [ ] Recent activity displays
- [ ] Activity times are accurate
```

### Error Scenarios
```checklist
- [ ] Invalid token handled gracefully
- [ ] Expired token triggers refresh
- [ ] Rate limit errors shown to user
- [ ] Network errors handled
- [ ] Invalid credentials show helpful message
- [ ] Account deletion shows confirmation
- [ ] Error messages don't expose sensitive data
```

---

## Phase 5: Security & Performance

### Security
```checklist
- [ ] All tokens encrypted at rest
- [ ] No tokens in logs or error messages
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] State parameter validated for OAuth
- [ ] PKCE properly implemented for Twitter
- [ ] Rate limiting implemented
- [ ] SQL injection prevented (using ORM)
- [ ] XSS prevention in frontend
- [ ] CSRF protection enabled
```

### Performance
```checklist
- [ ] API response < 200ms (excluding analytics)
- [ ] OAuth callback < 500ms
- [ ] Analytics aggregation < 2s for 10 accounts
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Frontend page load < 2s
- [ ] No memory leaks in frontend
- [ ] Concurrent requests handled properly
```

### Monitoring & Logging
```checklist
- [ ] All API endpoints logged
- [ ] OAuth events logged with non-sensitive data
- [ ] Error events logged with stack traces
- [ ] Performance metrics logged
- [ ] Database query timing logged
- [ ] Alert configured for failed OAuth
- [ ] Alert configured for token refresh failures
- [ ] Logs rotated daily
```

---

## Phase 6: Deployment

### Pre-Deployment Checklist
```checklist
- [ ] All tests passing
- [ ] Code review completed
- [ ] No secrets in git
- [ ] Dependencies up to date
- [ ] Database migrations tested on clean DB
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Production credentials configured in CI/CD
- [ ] Monitoring configured
- [ ] Rollback plan documented
```

### Staging Deployment
```checklist
- [ ] Deploy to staging
- [ ] All services running
- [ ] Logs look clean (no errors)
- [ ] Can connect first account
- [ ] Can view accounts
- [ ] Can disconnect account
- [ ] Analytics load correctly
- [ ] Performance acceptable
- [ ] No errors in 30 minutes of testing
```

### Production Deployment
```checklist
- [ ] Green light from team
- [ ] Backup taken
- [ ] Deploy to production
- [ ] Monitor for errors (first hour)
- [ ] Test all flows with real account
- [ ] Monitor performance metrics
- [ ] Update status page if needed
- [ ] Notify team of successful deployment
- [ ] Keep ready to rollback for 24 hours
```

---

## Quick API Test Commands

### Test Meta API
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts" \
  -H "Authorization: Bearer YOUR_META_TOKEN"
```

### Test Twitter API
```bash
curl -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN"
```

### Test LinkedIn API
```bash
curl -X GET "https://api.linkedin.com/v2/me" \
  -H "Authorization: Bearer YOUR_LINKEDIN_TOKEN"
```

### Test Backend Endpoint
```bash
curl -X GET "http://localhost:4000/api/social" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Debugging Tips

### Common Issues

**Issue: "Invalid redirect URI"**
- Check that redirect URI in app settings matches exactly (including http/https and trailing slashes)
- Try with localhost vs 127.0.0.1 (some platforms treat differently)

**Issue: "Access Token Expired"**
- Implement token refresh logic
- Check token expiry time from API response
- Refresh 5 minutes before expiry to be safe

**Issue: "Rate Limited"**
- Implement exponential backoff for retries
- Cache responses where possible
- Space out bulk API calls

**Issue: "CORS Error"**
- Check backend CORS configuration
- Verify frontend making requests to correct domain
- Check for proxy configuration issues

**Issue: "State Mismatch"**
- Ensure state parameter saved before redirect
- Validate on callback
- Session/cookies must be enabled

### Useful Debug Logs

Add these to your service classes:
```typescript
this.logger.log(`[${platform}] Starting OAuth flow...`)
this.logger.log(`[${platform}] Exchanging code for token...`)
this.logger.debug(`[${platform}] Token received, expires in: ${expiresIn}`)
this.logger.log(`[${platform}] Account saved: ${accountId}`)
```

---

## Final Validation

Before marking complete, verify:

- [ ] All 5 platforms can be connected
- [ ] All 5 platforms display correct data
- [ ] Can manage (disconnect/reconnect) accounts
- [ ] No errors in console or server logs
- [ ] Performance meets requirements
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Team trained on new features

---

## Sign-Off

- Developer: _____________ Date: _______
- Code Reviewer: ________ Date: _______
- QA: __________________ Date: _______
- Product Owner: _______ Date: _______

