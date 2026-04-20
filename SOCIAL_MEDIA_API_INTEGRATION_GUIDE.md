# Social Media APIs Integration Guide - Complete Step-by-Step

**Date**: April 19, 2026  
**Project**: UniSocial - AI Marketing Platform  
**APIs Covered**: Meta Graph API, Twitter API v2, LinkedIn Marketing API, TikTok Business API, YouTube Data API

---

## Table of Contents
1. [Meta Graph API (Facebook/Instagram)](#1-meta-graph-api-facebookinstagram)
2. [Twitter API v2](#2-twitter-api-v2)
3. [LinkedIn Marketing API](#3-linkedin-marketing-api)
4. [TikTok Business API](#4-tiktok-business-api)
5. [YouTube Data API v3](#5-youtube-data-api-v3)
6. [Backend Implementation](#6-backend-implementation)
7. [Frontend Integration](#7-frontend-integration)
8. [Testing & Debugging](#8-testing--debugging)

---

---

# 1. Meta Graph API (Facebook/Instagram)

## 1.1 Prerequisites & Credential Setup

### Step 1: Create Meta Developer Account
1. Go to [Meta Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Consumer"** app type
4. Fill in app name: `UniSocial-Meta-Integration`
5. Provide app purpose and contact info

### Step 2: Configure App
1. In **App Settings**:
   - App Name: `UniSocial-Meta`
   - App Domains: `localhost:3000`, `yourdomain.com`
   - Privacy Policy URL: `https://yourdomain.com/privacy`
   - User Data Deletion Callback: Add callback URL

2. Add Products:
   - Click **"+ Add Product"**
   - Search for and add **"Facebook Login"**
   - Add **"Instagram Basic Display"**
   - Add **"Instagram Graph API"**

### Step 3: Get Credentials
1. Go to **"Settings"** → **"Basic"**
   - Copy **App ID**
   - Copy **App Secret** (keep secure!)

2. For Facebook Login:
   - Go to **"Facebook Login"** → **"Settings"**
   - Add Redirect URIs:
     ```
     http://localhost:4000/api/social/meta/callback
     https://yourdomain.com/api/social/meta/callback
     ```
   - Valid OAuth Redirect URIs (same as above)

3. For Instagram:
   - Go to **"Instagram Graph API"** → **"Settings"**
   - Get your **Instagram Business Account ID** from Meta Business Suite

### Step 4: Get Test Access Token (Temporary)
1. Go to **"Tools"** → **"Graph API Explorer"**
2. Select your app from dropdown
3. In left panel, select **"User Token"** from **"Token"** dropdown
4. Click **"Generate Access Token"**
5. Add permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_manage_insights`
6. Copy the token (valid for ~60 days)

### Step 5: Get Long-Lived Access Token
1. Replace in URL with your app credentials:
   ```
   https://graph.facebook.com/auth/access_token
   ?grant_type=fb_exchange_token
   &client_id=YOUR_APP_ID
   &client_secret=YOUR_APP_SECRET
   &fb_exchange_token=SHORT_LIVED_TOKEN
   ```
2. This gives you a **60-day token** (better than 1 hour)

---

## 1.2 OAuth Flow Implementation

### Step 1: Frontend - Initiate Connection

**File**: `frontend/components/social/connect-account-dialog.tsx`

```typescript
const handleMetaConnect = () => {
  const clientId = process.env.NEXT_PUBLIC_META_APP_ID
  const redirectUri = `${window.location.origin}/api/auth/meta/callback`
  const scope = 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_manage_insights'
  
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?
    client_id=${clientId}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &scope=${encodeURIComponent(scope)}
    &response_type=code
    &state=${generateRandomState()}`
  
  window.location.href = authUrl
}
```

### Step 2: Backend - Handle OAuth Callback

**File**: `backend/src/modules/social/controllers/meta-oauth.controller.ts`

```typescript
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { MetaService } from '../services/meta.service'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'

@Controller('api/social/meta')
export class MetaOAuthController {
  constructor(private readonly metaService: MetaService) {}

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      // Verify state matches session
      if (state !== sessionState) {
        throw new Error('Invalid state parameter')
      }

      // Exchange code for short-lived token
      const token = await this.metaService.exchangeCodeForToken(code)

      // Exchange for long-lived token
      const longLivedToken = await this.metaService.getLongLivedToken(token)

      // Get user pages/accounts
      const accounts = await this.metaService.getConnectedAccounts(longLivedToken)

      // Redirect to frontend with accounts
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?` +
        `meta_accounts=${encodeURIComponent(JSON.stringify(accounts))}`
      )
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/dashboard/social-accounts?error=meta_failed`)
    }
  }
}
```

### Step 3: Backend - Meta Service

**File**: `backend/src/modules/social/services/meta.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BasePlatformService, PlatformAnalytics } from './base-platform.service'

@Injectable()
export class MetaService extends BasePlatformService {
  private readonly logger = new Logger(MetaService.name)
  private readonly apiUrl = 'https://graph.facebook.com/v18.0'
  private readonly appId = this.configService.get('META_APP_ID')
  private readonly appSecret = this.configService.get('META_APP_SECRET')

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService)
  }

  // Step 1: Exchange authorization code for token
  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/oauth/access_token`, {
          params: {
            client_id: this.appId,
            client_secret: this.appSecret,
            redirect_uri: `${process.env.API_URL}/api/social/meta/callback`,
            code,
          },
        }),
      )
      return response.data.access_token
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error)
      throw error
    }
  }

  // Step 2: Get long-lived token (60 days instead of 1 hour)
  async getLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/oauth/access_token`, {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.appId,
            client_secret: this.appSecret,
            fb_exchange_token: shortLivedToken,
          },
        }),
      )
      return response.data.access_token
    } catch (error) {
      this.logger.error('Failed to get long-lived token', error)
      throw error
    }
  }

  // Step 3: Get connected Facebook Pages and Instagram accounts
  async getConnectedAccounts(accessToken: string): Promise<any[]> {
    try {
      // Get user's Facebook pages
      const pagesResponse = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/me/accounts`, {
          params: { access_token: accessToken },
        }),
      )

      const accounts = []
      for (const page of pagesResponse.data.data) {
        // For each page, get connected Instagram account
        const igResponse = await firstValueFrom(
          this.httpService.get(
            `${this.apiUrl}/${page.id}/instagram_business_account`,
            {
              params: { access_token: page.access_token },
            },
          ),
        ).catch(() => null)

        accounts.push({
          platform: 'facebook',
          accountId: page.id,
          accountName: page.name,
          accessToken: page.access_token, // Page access token
          username: page.name,
          profileUrl: `https://facebook.com/${page.id}`,
          instagramAccount: igResponse?.data,
        })
      }
      return accounts
    } catch (error) {
      this.logger.error('Failed to get connected accounts', error)
      throw error
    }
  }

  // Get Instagram Business Account Analytics
  async getInstagramAnalytics(
    accountId: string,
    accessToken: string,
    period: 'day' | 'week' | 'month' = 'day',
  ): Promise<PlatformAnalytics> {
    try {
      const metrics = [
        'impressions',
        'reach',
        'follower_count',
        'profile_views',
        'website_clicks',
      ]

      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/${accountId}/insights`, {
          params: {
            metric: metrics.join(','),
            period,
            access_token: accessToken,
          },
        }),
      )

      // Transform API response to PlatformAnalytics
      const analytics: PlatformAnalytics = {
        impressions: 0,
        reach: 0,
        engagement: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        followers: 0,
        followerGrowth: 0,
        profileViews: 0,
      }

      for (const insight of response.data.data) {
        if (insight.name === 'impressions') {
          analytics.impressions = insight.values?.[0]?.value || 0
        } else if (insight.name === 'reach') {
          analytics.reach = insight.values?.[0]?.value || 0
        } else if (insight.name === 'follower_count') {
          analytics.followers = insight.values?.[0]?.value || 0
        } else if (insight.name === 'profile_views') {
          analytics.profileViews = insight.values?.[0]?.value || 0
        }
      }

      return analytics
    } catch (error) {
      this.logger.error('Failed to get Instagram analytics', error)
      throw error
    }
  }

  // Publish a post to Instagram/Facebook
  async publishPost(
    accountId: string,
    accessToken: string,
    content: {
      caption: string
      imageUrl?: string
      videoUrl?: string
    },
  ): Promise<{ postId: string }> {
    try {
      const endpoint = `${this.apiUrl}/${accountId}/media`
      const payload: any = {
        caption: content.caption,
        access_token: accessToken,
      }

      if (content.imageUrl) {
        payload.image_url = content.imageUrl
      } else if (content.videoUrl) {
        payload.video_url = content.videoUrl
      }

      const response = await firstValueFrom(
        this.httpService.post(endpoint, payload),
      )

      // Then publish the media
      const publishResponse = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/${response.data.id}/publish`,
          { access_token: accessToken },
        ),
      )

      return { postId: publishResponse.data.id }
    } catch (error) {
      this.logger.error('Failed to publish post', error)
      throw error
    }
  }
}
```

### Step 4: Store Encrypted Tokens

**Enhance**: `backend/src/modules/social/entities/social-account.entity.ts`

```typescript
import { encrypt, decrypt } from '../../../common/utils/encryption'

@Entity('social_accounts')
export class SocialAccount {
  @Column({ type: 'text', nullable: true })
  private _accessToken: string // Store encrypted

  @Column({ type: 'text', nullable: true })
  private _refreshToken: string

  set accessToken(value: string) {
    this._accessToken = value ? encrypt(value) : null
  }

  get accessToken(): string {
    return this._accessToken ? decrypt(this._accessToken) : null
  }

  // Similar for refreshToken
}
```

---

## 1.3 Environment Variables

**File**: `.env.example`

```env
# Meta (Facebook/Instagram)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_REDIRECT_URI=http://localhost:4000/api/social/meta/callback

# Instagram Business Account (optional, for specific account targeting)
META_IG_BUSINESS_ACCOUNT_ID=your_ig_account_id
```

---

# 2. Twitter API v2

## 2.1 Prerequisites & Credential Setup

### Step 1: Create Twitter Developer Account
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new **Project**:
   - Project name: `UniSocial`
   - Use case: `Academic Research` or `Other` (Social Media Management)
   - Organization: Your University

3. Create an **Application**:
   - App name: `UniSocial-Twitter-Bot`
   - App type: `Confidential Client`

### Step 2: Get Credentials
1. Go to **Keys and Tokens** tab:
   - Copy **API Key** (API Key/Consumer Key)
   - Copy **API Secret Key** (API Secret Key/Consumer Secret)

2. Under **Authentication Tokens & Keys**:
   - Click **"Generate"** for OAuth 2.0 tokens
   - Select **Authorization Code with PKCE** (for user authentication)
   - Set Redirect URLs:
     ```
     http://localhost:4000/api/social/twitter/callback
     https://yourdomain.com/api/social/twitter/callback
     ```

### Step 3: Set Permissions
1. In **App Settings**:
   - Set **App Permissions** to **"Read and Write"**
   - Enable **"User Context Authentication"**
   - Add required scopes: `tweet.read`, `tweet.write`, `users.read`, `follows.read`, `follows.write`

### Step 4: Get Bearer Token (Optional, for app-only operations)
1. In **Keys and Tokens**:
   - Copy **Bearer Token** (for server-to-server requests)

### Step 5: Get Access Token for Testing
1. Using OAuth 2.0 Authorization Code with PKCE:
   ```
   https://twitter.com/i/oauth2/authorize?
   response_type=code
   &client_id=YOUR_CLIENT_ID
   &redirect_uri=http://localhost:4000/api/social/twitter/callback
   &scope=tweet.read+tweet.write+users.read
   &state=random_state_value
   &code_challenge=PKCE_CHALLENGE
   &code_challenge_method=S256
   ```

---

## 2.2 OAuth Flow Implementation

### Step 1: Generate PKCE Challenge

**File**: `backend/src/common/utils/pkce.ts`

```typescript
import crypto from 'crypto'

export function generatePKCEChallenge(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = crypto.randomBytes(32).toString('hex')
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')

  return { codeVerifier, codeChallenge }
}
```

### Step 2: Frontend - Initiate Twitter Connection

```typescript
const handleTwitterConnect = async () => {
  const { codeVerifier, codeChallenge } = generatePKCE()
  
  // Store code verifier in session
  sessionStorage.setItem('twitter_code_verifier', codeVerifier)
  
  const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID
  const redirectUri = `${window.location.origin}/api/auth/twitter/callback`
  const scope = 'tweet.read tweet.write users.read'
  const state = generateRandomState()
  
  const authUrl = `https://twitter.com/i/oauth2/authorize?
    response_type=code
    &client_id=${clientId}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &scope=${encodeURIComponent(scope)}
    &state=${state}
    &code_challenge=${codeChallenge}
    &code_challenge_method=S256`
  
  window.location.href = authUrl
}
```

### Step 3: Backend - Twitter Service

**File**: `backend/src/modules/social/services/twitter.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BasePlatformService, PlatformAnalytics } from './base-platform.service'

@Injectable()
export class TwitterService extends BasePlatformService {
  private readonly logger = new Logger(TwitterService.name)
  private readonly apiUrl = 'https://api.twitter.com/2'
  private readonly clientId = this.configService.get('TWITTER_CLIENT_ID')
  private readonly clientSecret = this.configService.get('TWITTER_CLIENT_SECRET')

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService)
  }

  // Step 1: Exchange authorization code for access token
  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://twitter.com/2/oauth2/token',
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            code_verifier: codeVerifier,
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        ),
      )

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error)
      throw error
    }
  }

  // Get authenticated user info
  async getAuthenticatedUser(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            'user.fields': 'created_at,public_metrics,description',
          },
        }),
      )

      return response.data.data
    } catch (error) {
      this.logger.error('Failed to get authenticated user', error)
      throw error
    }
  }

  // Get user analytics
  async getUserAnalytics(userId: string, accessToken: string): Promise<PlatformAnalytics> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            'user.fields': 'public_metrics,created_at',
          },
        }),
      )

      const metrics = response.data.data.public_metrics

      return {
        followers: metrics.followers_count,
        engagement: metrics.like_count + metrics.reply_count + metrics.retweet_count,
        likes: metrics.like_count,
        comments: metrics.reply_count,
        shares: metrics.retweet_count,
        impressions: 0, // Requires elevated access
        reach: 0,
        followerGrowth: 0,
      }
    } catch (error) {
      this.logger.error('Failed to get user analytics', error)
      throw error
    }
  }

  // Create a tweet
  async createTweet(
    accessToken: string,
    text: string,
    options?: {
      mediaIds?: string[]
      replyTo?: string
      quote?: string
    },
  ): Promise<{ id: string; text: string }> {
    try {
      const payload: any = { text }

      if (options?.replyTo) {
        payload.reply = { in_reply_to_tweet_id: options.replyTo }
      }

      if (options?.quote) {
        payload.quote_tweet_id = options.quote
      }

      if (options?.mediaIds && options.mediaIds.length > 0) {
        payload.media = { media_ids: options.mediaIds }
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/tweets`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )

      return response.data.data
    } catch (error) {
      this.logger.error('Failed to create tweet', error)
      throw error
    }
  }

  // Upload media for tweets
  async uploadMedia(
    accessToken: string,
    mediaBuffer: Buffer,
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4',
  ): Promise<string> {
    try {
      // Twitter uses the v1.1 endpoint for media uploads
      const response = await firstValueFrom(
        this.httpService.post(
          'https://upload.twitter.com/1.1/media/upload.json',
          { media_data: mediaBuffer.toString('base64') },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        ),
      )

      return response.data.media_id_string
    } catch (error) {
      this.logger.error('Failed to upload media', error)
      throw error
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://twitter.com/2/oauth2/token', {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      )

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to refresh access token', error)
      throw error
    }
  }
}
```

### Step 4: Backend - OAuth Callback Controller

```typescript
@Post('api/social/twitter/callback')
async handleTwitterCallback(
  @Query('code') code: string,
  @Query('state') state: string,
  @Body() body: { codeVerifier: string },
  @Res() res: Response,
  @Req() req: Request & { user?: any },
) {
  try {
    const { accessToken, refreshToken, expiresIn } = 
      await this.twitterService.exchangeCodeForToken(
        code,
        body.codeVerifier,
        `${process.env.API_URL}/api/social/twitter/callback`,
      )

    const user = await this.twitterService.getAuthenticatedUser(accessToken)

    // Save to database
    await this.socialService.create({
      userId: req.user.id,
      platform: 'twitter',
      accountId: user.id,
      accountName: user.name,
      username: user.username,
      accessToken,
      refreshToken,
      tokenExpiry: new Date(Date.now() + expiresIn * 1000),
      status: 'connected',
    })

    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=twitter&status=success`,
    )
  } catch (error) {
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=twitter_failed`,
    )
  }
}
```

## 2.3 Environment Variables

```env
# Twitter
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_REDIRECT_URI=http://localhost:4000/api/social/twitter/callback
```

---

# 3. LinkedIn Marketing API

## 3.1 Prerequisites & Credential Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)
2. Click **"Create app"**
3. Fill in details:
   - App name: `UniSocial`
   - LinkedIn Page: Select your university page
   - App logo: Upload your logo
   - Legal agreement: Accept terms

### Step 2: Get Credentials
1. Go to **"Auth"** tab:
   - Copy **Client ID**
   - Copy **Client Secret**

2. Authorized redirect URLs:
   ```
   http://localhost:4000/api/social/linkedin/callback
   https://yourdomain.com/api/social/linkedin/callback
   ```

### Step 3: Request Access
1. Go to **"Products"** tab
2. Request access to:
   - **Share on LinkedIn** (for posting)
   - **Sign In with LinkedIn** (for auth)
   - **LinkedIn Pages** (for page management)

### Step 4: Get Scopes
After approval, you'll have access to scopes:
- `w_member_social` - Post as user
- `w_organization_social` - Post on behalf of organization
- `r_organization_admin` - Read organization data
- `r_ads_analytics` - Read analytics

---

## 3.2 OAuth Flow Implementation

### Step 1: Frontend - Initiate LinkedIn Connection

```typescript
const handleLinkedInConnect = () => {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
  const redirectUri = `${window.location.origin}/api/auth/linkedin/callback`
  const scope = 'w_member_social,w_organization_social,r_organization_admin'
  const state = generateRandomState()

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?
    response_type=code
    &client_id=${clientId}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &scope=${encodeURIComponent(scope)}
    &state=${state}`

  window.location.href = authUrl
}
```

### Step 2: Backend - LinkedIn Service

**File**: `backend/src/modules/social/services/linkedin.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BasePlatformService, PlatformAnalytics } from './base-platform.service'

@Injectable()
export class LinkedInService extends BasePlatformService {
  private readonly logger = new Logger(LinkedInService.name)
  private readonly apiUrl = 'https://api.linkedin.com/v2'
  private readonly clientId = this.configService.get('LINKEDIN_CLIENT_ID')
  private readonly clientSecret = this.configService.get('LINKEDIN_CLIENT_SECRET')

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService)
  }

  // Exchange code for access token
  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://www.linkedin.com/oauth/v2/accessToken',
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ),
      )

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error)
      throw error
    }
  }

  // Get authenticated user profile
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )

      const userId = response.data.id
      const firstName = response.data.localizedFirstName
      const lastName = response.data.localizedLastName

      return {
        id: userId,
        name: `${firstName} ${lastName}`,
        email: await this.getUserEmail(accessToken),
      }
    } catch (error) {
      this.logger.error('Failed to get user profile', error)
      throw error
    }
  }

  // Get user email
  private async getUserEmail(accessToken: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/emailAddress?q=members&projection=(elements*(handle~))`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )

      return response.data.elements[0]['handle~'].emailAddress
    } catch {
      return ''
    }
  }

  // Get user's organizations (pages they manage)
  async getUserOrganizations(accessToken: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/organizationAcls?q=roleAssignee`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            projection: '(elements*(organization,role))',
          },
        }),
      )

      return response.data.elements.map((el: any) => ({
        orgId: el.organization,
        role: el.role,
      }))
    } catch (error) {
      this.logger.error('Failed to get user organizations', error)
      throw error
    }
  }

  // Get organization analytics
  async getOrganizationAnalytics(
    organizationId: string,
    accessToken: string,
  ): Promise<PlatformAnalytics> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/organizationFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${organizationId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              timeIntervals: `timeInterval.start=${Math.floor(Date.now() / 1000) * 1000}`,
            },
          },
        ),
      )

      const stats = response.data.elements[0]

      return {
        followers: stats.followerCounts?.organicFollowerCount || 0,
        reach: 0, // LinkedIn doesn't provide reach directly
        engagement: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        followerGrowth: 0,
      }
    } catch (error) {
      this.logger.error('Failed to get organization analytics', error)
      return {
        followers: 0,
        reach: 0,
        engagement: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        followerGrowth: 0,
      }
    }
  }

  // Publish a post (UGC Post)
  async publishPost(
    accessToken: string,
    organizationId: string,
    content: {
      text: string
      imageUrl?: string
      link?: string
    },
  ): Promise<{ postId: string }> {
    try {
      const payload: any = {
        author: `urn:li:organization:${organizationId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.PublishContent': {
            shareMediaCategory: content.imageUrl ? 'IMAGE' : 'NONE',
            shareCommentary: {
              text: content.text,
            },
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }

      if (content.imageUrl) {
        payload.specificContent['com.linkedin.ugc.PublishContent'].media = [
          {
            status: 'READY',
            description: { text: content.text },
            media: content.imageUrl,
          },
        ]
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/ugcPosts`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      )

      return { postId: response.data.id }
    } catch (error) {
      this.logger.error('Failed to publish post', error)
      throw error
    }
  }
}
```

## 3.3 Environment Variables

```env
# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:4000/api/social/linkedin/callback
```

---

# 4. TikTok Business API

## 4.1 Prerequisites & Credential Setup

### Step 1: Create TikTok for Business Account
1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. Create a Business Account (not personal)
3. Complete verification process

### Step 2: Create App on TikTok Developer Portal
1. Go to [TikTok Developer Console](https://developers.tiktok.com/)
2. Click **"My Apps"** → **"Create an app"**
3. Select **"TikTok for Business"**
4. Fill in app details

### Step 3: Get Credentials
1. In **Basic Info**:
   - Copy **Client Key** (Client ID)
   - Copy **Client Secret**

2. Set **Redirect URIs**:
   ```
   http://localhost:4000/api/social/tiktok/callback
   https://yourdomain.com/api/social/tiktok/callback
   ```

### Step 4: Request API Access
1. Submit application for:
   - **TikTok Content Creator API** (for posting content)
   - **TikTok Analytics API** (for metrics)
   - **User Auth API** (for user authentication)

### Step 5: Get Test Credentials
TikTok provides sandbox credentials for testing before production access.

---

## 4.2 OAuth Flow & Implementation

### Step 1: Frontend - Initiate TikTok Connection

```typescript
const handleTikTokConnect = () => {
  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
  const redirectUri = `${window.location.origin}/api/auth/tiktok/callback`
  const scope = 'user.info.basic,video.upload'
  const state = generateRandomState()

  const authUrl = `https://www.tiktok.com/oauth/v2/authorize?
    client_key=${clientKey}
    &response_type=code
    &scope=${encodeURIComponent(scope)}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &state=${state}`

  window.location.href = authUrl
}
```

### Step 2: Backend - TikTok Service

**File**: `backend/src/modules/social/services/tiktok.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BasePlatformService, PlatformAnalytics } from './base-platform.service'

@Injectable()
export class TikTokService extends BasePlatformService {
  private readonly logger = new Logger(TikTokService.name)
  private readonly apiUrl = 'https://open.tiktokapis.com/v1'
  private readonly clientKey = this.configService.get('TIKTOK_CLIENT_KEY')
  private readonly clientSecret = this.configService.get('TIKTOK_CLIENT_SECRET')

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService)
  }

  // Exchange code for access token
  async exchangeCodeForToken(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://open.tiktokapis.com/v1/oauth/token',
          {
            client_key: this.clientKey,
            client_secret: this.clientSecret,
            code,
            grant_type: 'authorization_code',
          },
        ),
      )

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error)
      throw error
    }
  }

  // Get user info
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/oauth/userinfo`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            fields: 'open_id,union_id,user_id,display_name,avatar_url,avatar_url_100,avatar_url_200',
          },
        }),
      )

      return response.data.data
    } catch (error) {
      this.logger.error('Failed to get user info', error)
      throw error
    }
  }

  // Get user video analytics
  async getUserAnalytics(
    accessToken: string,
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/user/stat`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
              fields: 'like_count,comment_count,share_count,download_count,play_count',
            },
          },
        ),
      )

      const data = response.data.data

      return {
        followers: data.follower_count || 0,
        engagement: (data.like_count || 0) + (data.comment_count || 0) + (data.share_count || 0),
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        impressions: data.play_count || 0,
        reach: 0,
        followerGrowth: 0,
      }
    } catch (error) {
      this.logger.error('Failed to get user analytics', error)
      throw error
    }
  }

  // Upload video and get upload URL
  async initiateVideoUpload(
    accessToken: string,
    videoSize: number,
  ): Promise<{ uploadToken: string; uploadUrl: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/video/upload/init`,
          {
            source_info: {
              source: 'FILE_UPLOAD',
              video_size: videoSize,
            },
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        ),
      )

      return {
        uploadToken: response.data.data.upload_token,
        uploadUrl: response.data.data.upload_url,
      }
    } catch (error) {
      this.logger.error('Failed to initiate video upload', error)
      throw error
    }
  }

  // Upload video chunk
  async uploadVideoChunk(
    uploadUrl: string,
    uploadToken: string,
    chunkData: Buffer,
    chunkIndex: number,
    totalChunks: number,
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.put(
          uploadUrl,
          chunkData,
          {
            headers: {
              'Content-Range': `bytes ${chunkIndex}/${totalChunks}`,
              'Upload-Token': uploadToken,
            },
          },
        ),
      )
    } catch (error) {
      this.logger.error('Failed to upload video chunk', error)
      throw error
    }
  }

  // Publish video
  async publishVideo(
    accessToken: string,
    uploadToken: string,
    content: {
      caption: string
      hashtags?: string[]
      thumbnail?: Buffer
    },
  ): Promise<{ videoId: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/video/publish`,
          {
            source_info: {
              source: 'FILE_UPLOAD',
              upload_token: uploadToken,
            },
            post_info: {
              text: `${content.caption}${content.hashtags ? ' ' + content.hashtags.join(' ') : ''}`,
            },
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        ),
      )

      return {
        videoId: response.data.data.video_id,
      }
    } catch (error) {
      this.logger.error('Failed to publish video', error)
      throw error
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/oauth/token/refresh`, {
          client_key: this.clientKey,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      )

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to refresh access token', error)
      throw error
    }
  }
}
```

## 4.3 Environment Variables

```env
# TikTok
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=http://localhost:4000/api/social/tiktok/callback
```

---

# 5. YouTube Data API v3

## 5.1 Prerequisites & Credential Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `UniSocial`
3. Enable APIs:
   - YouTube Data API v3
   - Google Drive API
   - YouTube Analytics API

### Step 2: Create OAuth Consent Screen
1. Go to **"OAuth consent screen"**
2. Select **"External"** user type
3. Fill in app information:
   - App name: `UniSocial`
   - Support email: your email
   - Developer contact: your email

### Step 3: Create OAuth 2.0 Credentials
1. Go to **"Credentials"** → **"Create Credentials"**
2. Choose **"OAuth 2.0 Client IDs"**
3. Select **"Web application"**
4. Add Authorized redirect URIs:
   ```
   http://localhost:4000/api/social/youtube/callback
   https://yourdomain.com/api/social/youtube/callback
   ```
5. Copy **Client ID** and **Client Secret**

### Step 4: Add Scopes
During OAuth flow, request these scopes:
- `https://www.googleapis.com/auth/youtube` - Upload and manage your YouTube videos
- `https://www.googleapis.com/auth/youtube.analytics` - View YouTube analytics
- `https://www.googleapis.com/auth/youtube.force-ssl` - Manage YouTube account

---

## 5.2 OAuth Flow & Implementation

### Step 1: Frontend - Initiate YouTube Connection

```typescript
const handleYouTubeConnect = () => {
  const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID
  const redirectUri = `${window.location.origin}/api/auth/youtube/callback`
  const scope = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.analytics'
  const state = generateRandomState()

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${clientId}
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &response_type=code
    &scope=${encodeURIComponent(scope)}
    &state=${state}
    &access_type=offline`

  window.location.href = authUrl
}
```

### Step 2: Backend - YouTube Service

**File**: `backend/src/modules/social/services/youtube.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { BasePlatformService, PlatformAnalytics } from './base-platform.service'

@Injectable()
export class YouTubeService extends BasePlatformService {
  private readonly logger = new Logger(YouTubeService.name)
  private readonly apiUrl = 'https://www.googleapis.com/youtube/v3'
  private readonly clientId = this.configService.get('YOUTUBE_CLIENT_ID')
  private readonly clientSecret = this.configService.get('YOUTUBE_CLIENT_SECRET')

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService)
  }

  // Exchange code for tokens
  async exchangeCodeForToken(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://oauth2.googleapis.com/token',
          {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: `${process.env.API_URL}/api/social/youtube/callback`,
            grant_type: 'authorization_code',
          },
        ),
      )

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to exchange code for token', error)
      throw error
    }
  }

  // Get authenticated channel
  async getAuthenticatedChannel(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/channels`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            part: 'id,snippet,statistics,contentDetails',
            mine: true,
          },
        }),
      )

      return response.data.items[0]
    } catch (error) {
      this.logger.error('Failed to get authenticated channel', error)
      throw error
    }
  }

  // Get channel analytics
  async getChannelAnalytics(
    accessToken: string,
    channelId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://youtubeanalytics.googleapis.com/v2/reports', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            ids: `channel==${channelId}`,
            'start-date': startDate.toISOString().split('T')[0],
            'end-date': endDate.toISOString().split('T')[0],
            metrics: 'views,likes,comments,shares,subscribersGained,subscribersLost',
            'dimensions': 'day',
          },
        }),
      )

      const totals = response.data.rows?.reduce(
        (acc, row) => ({
          views: acc.views + (row[1] || 0),
          likes: acc.likes + (row[2] || 0),
          comments: acc.comments + (row[3] || 0),
          shares: acc.shares + (row[4] || 0),
          subscribers: acc.subscribers + (row[5] || 0) - (row[6] || 0),
        }),
        { views: 0, likes: 0, comments: 0, shares: 0, subscribers: 0 },
      ) || { views: 0, likes: 0, comments: 0, shares: 0, subscribers: 0 }

      const channel = await this.getAuthenticatedChannel(accessToken)
      const stats = channel.statistics

      return {
        followers: parseInt(stats.subscriberCount || '0'),
        engagement: totals.likes + totals.comments + totals.shares,
        likes: totals.likes,
        comments: totals.comments,
        shares: totals.shares,
        impressions: totals.views,
        reach: totals.views,
        followerGrowth: totals.subscribers,
        videoViews: totals.views,
      }
    } catch (error) {
      this.logger.error('Failed to get channel analytics', error)
      return {
        followers: 0,
        engagement: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        impressions: 0,
        reach: 0,
        followerGrowth: 0,
      }
    }
  }

  // Upload video
  async uploadVideo(
    accessToken: string,
    videoBuffer: Buffer,
    metadata: {
      title: string
      description: string
      tags: string[]
      privacyStatus: 'public' | 'unlisted' | 'private'
      thumbnail?: Buffer
    },
  ): Promise<{ videoId: string; thumbnail?: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/videos?part=snippet,status`,
          {
            snippet: {
              title: metadata.title,
              description: metadata.description,
              tags: metadata.tags,
              categoryId: '26', // News & Politics, adjust as needed
            },
            status: {
              privacyStatus: metadata.privacyStatus,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      )

      return { videoId: response.data.id }
    } catch (error) {
      this.logger.error('Failed to upload video', error)
      throw error
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('https://oauth2.googleapis.com/token', {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      )

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      }
    } catch (error) {
      this.logger.error('Failed to refresh access token', error)
      throw error
    }
  }
}
```

## 5.3 Environment Variables

```env
# YouTube
YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/api/social/youtube/callback
```

---

# 6. Backend Implementation

## 6.1 Update Social Module

**File**: `backend/src/modules/social/social.module.ts`

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { SocialController } from './social.controller'
import { SocialService } from './social.service'
import { SocialAccount } from './entities/social-account.entity'
import {
  MetaService,
  TwitterService,
  LinkedInService,
  TikTokService,
  YouTubeService,
} from './services'

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialAccount]),
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [SocialController],
  providers: [
    SocialService,
    MetaService,
    TwitterService,
    LinkedInService,
    TikTokService,
    YouTubeService,
  ],
  exports: [
    SocialService,
    MetaService,
    TwitterService,
    LinkedInService,
    TikTokService,
    YouTubeService,
  ],
})
export class SocialModule {}
```

## 6.2 Update Social Controller

**File**: `backend/src/modules/social/social.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Query,
  Param,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common'
import { Response } from 'express'
import { SocialService } from './social.service'
import { MetaService } from './services/meta.service'
import { TwitterService } from './services/twitter.service'
import { LinkedInService } from './services/linkedin.service'
import { TikTokService } from './services/tiktok.service'
import { YouTubeService } from './services/youtube.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@Controller('api/social')
export class SocialController {
  constructor(
    private readonly socialService: SocialService,
    private readonly metaService: MetaService,
    private readonly twitterService: TwitterService,
    private readonly linkedinService: LinkedInService,
    private readonly tiktokService: TikTokService,
    private readonly youtubeService: YouTubeService,
  ) {}

  // ========== OAUTH CALLBACKS ==========

  @Get('meta/callback')
  async handleMetaCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const token = await this.metaService.exchangeCodeForToken(code)
      const longLivedToken = await this.metaService.getLongLivedToken(token)
      const accounts = await this.metaService.getConnectedAccounts(longLivedToken)

      for (const account of accounts) {
        await this.socialService.create({
          userId: req.user.id,
          platform: 'facebook',
          accountId: account.accountId,
          accountName: account.accountName,
          username: account.accountName,
          accessToken: account.accessToken,
          status: 'connected',
        })
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=facebook&status=success`,
      )
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=meta_failed`,
      )
    }
  }

  @Post('twitter/callback')
  async handleTwitterCallback(
    @Query('code') code: string,
    @Body() body: { codeVerifier: string },
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const { accessToken, refreshToken, expiresIn } =
        await this.twitterService.exchangeCodeForToken(
          code,
          body.codeVerifier,
          `${process.env.API_URL}/api/social/twitter/callback`,
        )

      const user = await this.twitterService.getAuthenticatedUser(accessToken)

      await this.socialService.create({
        userId: req.user.id,
        platform: 'twitter',
        accountId: user.id,
        accountName: user.name,
        username: user.username,
        accessToken,
        refreshToken,
        tokenExpiry: new Date(Date.now() + expiresIn * 1000),
        status: 'connected',
      })

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=twitter&status=success`,
      )
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=twitter_failed`,
      )
    }
  }

  @Post('linkedin/callback')
  async handleLinkedInCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const { accessToken, expiresIn } =
        await this.linkedinService.exchangeCodeForToken(
          code,
          `${process.env.API_URL}/api/social/linkedin/callback`,
        )

      const user = await this.linkedinService.getUserProfile(accessToken)
      const organizations = await this.linkedinService.getUserOrganizations(accessToken)

      for (const org of organizations) {
        await this.socialService.create({
          userId: req.user.id,
          platform: 'linkedin',
          accountId: org.orgId,
          accountName: org.orgId,
          accessToken,
          status: 'connected',
          tokenExpiry: new Date(Date.now() + expiresIn * 1000),
        })
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=linkedin&status=success`,
      )
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=linkedin_failed`,
      )
    }
  }

  @Post('tiktok/callback')
  async handleTikTokCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const { accessToken, refreshToken, expiresIn } =
        await this.tiktokService.exchangeCodeForToken(code)

      const userInfo = await this.tiktokService.getUserInfo(accessToken)

      await this.socialService.create({
        userId: req.user.id,
        platform: 'tiktok',
        accountId: userInfo.open_id,
        accountName: userInfo.display_name,
        username: userInfo.display_name,
        accessToken,
        refreshToken,
        status: 'connected',
        tokenExpiry: new Date(Date.now() + expiresIn * 1000),
      })

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=tiktok&status=success`,
      )
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=tiktok_failed`,
      )
    }
  }

  @Post('youtube/callback')
  async handleYouTubeCallback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const { accessToken, refreshToken, expiresIn } =
        await this.youtubeService.exchangeCodeForToken(code)

      const channel = await this.youtubeService.getAuthenticatedChannel(accessToken)

      await this.socialService.create({
        userId: req.user.id,
        platform: 'youtube',
        accountId: channel.id,
        accountName: channel.snippet.title,
        username: channel.snippet.customUrl,
        accessToken,
        refreshToken,
        status: 'connected',
        tokenExpiry: new Date(Date.now() + expiresIn * 1000),
      })

      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?platform=youtube&status=success`,
      )
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/social-accounts?error=youtube_failed`,
      )
    }
  }

  // ========== CRUD OPERATIONS ==========

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccounts(
    @Query('platform') platform?: string,
    @Query('status') status?: string,
    @Req() req: any,
  ) {
    return this.socialService.findAll({
      userId: req.user.id,
      platform,
      status,
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccount(@Param('id') id: string) {
    return this.socialService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    return this.socialService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics')
  async getAccountAnalytics(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const account = await this.socialService.findOne(id)
    return this.socialService.getAnalytics(account, new Date(startDate), new Date(endDate))
  }
}
```

## 6.3 Update Social Service

**File**: `backend/src/modules/social/social.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SocialAccount } from './entities/social-account.entity'
import { MetaService } from './services/meta.service'
import { TwitterService } from './services/twitter.service'
import { LinkedInService } from './services/linkedin.service'
import { TikTokService } from './services/tiktok.service'
import { YouTubeService } from './services/youtube.service'

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
    private readonly metaService: MetaService,
    private readonly twitterService: TwitterService,
    private readonly linkedinService: LinkedInService,
    private readonly tiktokService: TikTokService,
    private readonly youtubeService: YouTubeService,
  ) {}

  async create(createData: any) {
    const account = this.socialAccountRepository.create(createData)
    return this.socialAccountRepository.save(account)
  }

  async findAll(options: { userId?: string; platform?: string; status?: string }) {
    const query = this.socialAccountRepository.createQueryBuilder('account')

    if (options.userId) {
      query.andWhere('account.userId = :userId', { userId: options.userId })
    }

    if (options.platform) {
      query.andWhere('account.platform = :platform', { platform: options.platform })
    }

    if (options.status) {
      query.andWhere('account.status = :status', { status: options.status })
    }

    return query.getMany()
  }

  async findOne(id: string) {
    const account = await this.socialAccountRepository.findOne({ where: { id } })
    if (!account) {
      throw new NotFoundException(`Social account ${id} not found`)
    }
    return account
  }

  async remove(id: string) {
    const account = await this.findOne(id)
    await this.socialAccountRepository.remove(account)
    return { message: 'Account deleted successfully' }
  }

  async getAnalytics(account: SocialAccount, startDate: Date, endDate: Date) {
    const token = account.accessToken

    switch (account.platform) {
      case 'facebook':
      case 'instagram':
        return this.metaService.getInstagramAnalytics(account.accountId, token)
      case 'twitter':
        return this.twitterService.getUserAnalytics(account.accountId, token)
      case 'linkedin':
        return this.linkedinService.getOrganizationAnalytics(account.accountId, token)
      case 'tiktok':
        return this.tiktokService.getUserAnalytics(token, account.accountId, startDate, endDate)
      case 'youtube':
        return this.youtubeService.getChannelAnalytics(token, account.accountId, startDate, endDate)
      default:
        throw new Error(`Unknown platform: ${account.platform}`)
    }
  }
}
```

---

# 7. Frontend Integration

## 7.1 Update API Client

**File**: `frontend/lib/api/social.ts`

```typescript
import { apiClient } from './client'

export const socialApi = {
  // Get all accounts
  getAccounts: async (platform?: string, status?: string) => {
    const params = new URLSearchParams()
    if (platform) params.append('platform', platform)
    if (status) params.append('status', status)

    const response = await apiClient.get(`/api/social?${params}`)
    return response.data
  },

  // Get single account
  getAccount: async (id: string) => {
    const response = await apiClient.get(`/api/social/${id}`)
    return response.data
  },

  // Get account analytics
  getAnalytics: async (id: string, startDate: Date, endDate: Date) => {
    const response = await apiClient.get(`/api/social/${id}/analytics`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    })
    return response.data
  },

  // Delete account
  deleteAccount: async (id: string) => {
    const response = await apiClient.delete(`/api/social/${id}`)
    return response.data
  },

  // OAuth initiation URLs
  getOAuthUrl: (platform: 'meta' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube') => {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/social/${platform}/authorize`
  },
}
```

## 7.2 Update Social Account Dialog

**File**: `frontend/components/social/connect-account-dialog.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function ConnectAccountDialog({ children, onConnect, connectedPlatforms = [] }: Props) {
  const [open, setOpen] = useState(false)

  const handleConnect = async (platform: string) => {
    try {
      // Get OAuth URL from backend
      const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/social/${platform}/authorize`
      window.location.href = oauthUrl
      setOpen(false)
    } catch (error) {
      console.error('Failed to initiate connection:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Connect Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Social Media Account</DialogTitle>
          <DialogDescription>
            Select a platform to connect your account
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((p) => (
            <Button
              key={p.value}
              variant={connectedPlatforms.includes(p.value) ? 'outline' : 'default'}
              onClick={() => handleConnect(p.value)}
              disabled={connectedPlatforms.includes(p.value)}
            >
              <p.icon className="mr-2 h-4 w-4" />
              {p.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

# 8. Testing & Debugging

## 8.1 Environment Variables Template

**File**: `.env.example`

```env
# API Configuration
API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000

# Meta (Facebook/Instagram)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_REDIRECT_URI=http://localhost:4000/api/social/meta/callback

# Twitter
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_REDIRECT_URI=http://localhost:4000/api/social/twitter/callback

# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:4000/api/social/linkedin/callback

# TikTok
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_REDIRECT_URI=http://localhost:4000/api/social/tiktok/callback

# YouTube
YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:4000/api/social/youtube/callback

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/unisocial

# Encryption
ENCRYPTION_KEY=your_encryption_key_32_chars
```

## 8.2 Testing Checklist

- [ ] Meta OAuth flow - test at `/dashboard/social-accounts`
- [ ] Twitter OAuth flow with PKCE verification
- [ ] LinkedIn OAuth with organization access
- [ ] TikTok OAuth and token refresh
- [ ] YouTube OAuth and analytics retrieval
- [ ] Token encryption/decryption
- [ ] Token refresh on expiry
- [ ] Error handling for invalid tokens
- [ ] Rate limiting compliance
- [ ] Data persistence in database
- [ ] Analytics aggregation accuracy
- [ ] Frontend display of connected accounts

---

## Quick Reference

| Platform | OAuth URL | Docs |
|----------|-----------|------|
| Meta | `https://www.facebook.com/v18.0/dialog/oauth` | [Docs](https://developers.facebook.com/docs) |
| Twitter | `https://twitter.com/i/oauth2/authorize` | [Docs](https://developer.twitter.com/docs) |
| LinkedIn | `https://www.linkedin.com/oauth/v2/authorization` | [Docs](https://learn.microsoft.com/en-us/linkedin) |
| TikTok | `https://www.tiktok.com/oauth/v2/authorize` | [Docs](https://developers.tiktok.com/doc) |
| YouTube | `https://accounts.google.com/o/oauth2/v2/auth` | [Docs](https://developers.google.com/youtube) |

