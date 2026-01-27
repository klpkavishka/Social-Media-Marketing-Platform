export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  MARKETING_ADMIN = 'marketing_admin',
  DEPARTMENT_COORDINATOR = 'department_coordinator',
  CONTENT_CREATOR = 'content_creator',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

export enum Platform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
}
