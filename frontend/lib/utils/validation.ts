import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  organizationName: z.string().min(2, 'Organization name is required'),
  role: z.string().min(1, 'Role is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const contentSchema = z.object({
  caption: z.string().min(1, 'Caption is required').max(2200, 'Caption is too long'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  scheduledAt: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
})

export const campaignSchema = z.object({
  name: z.string().min(2, 'Campaign name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  budget: z.number().optional(),
})
