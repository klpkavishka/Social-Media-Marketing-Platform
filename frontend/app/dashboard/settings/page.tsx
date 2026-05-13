'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, Bell, Palette, Zap, Building2, Key, CreditCard, AlertTriangle } from 'lucide-react'
import IntegrationsSettings from './integrations/page'
import OrganizationSettings from './university/page'
import { ProfileEditor } from '@/components/settings/profile-editor'
import { NotificationPreferences } from '@/components/settings/notification-preferences'
import { APIKeysSection } from '@/components/settings/api-keys-section'
import { BillingSubscription } from '@/components/settings/billing-subscription'
import { DangerZone } from '@/components/settings/danger-zone'
import { Tooltip } from '@/components/tooltip'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div> */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* <TabsList className="grid w-full max-w-4xl grid-cols-3 lg:grid-cols-9 overflow-x-auto">
          <TabsTrigger value="profile" className="flex items-center gap-1" title="Update your profile information">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-1" title="Change password and security settings">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1" title="Control notification preferences">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Notify</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1" title="Customize look and feel">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Look</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1" title="Manage API keys and integrations">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">API</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1" title="View subscription and billing info">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1" title="Connect third-party services">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-1" title="Manage organization settings">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Org</span>
          </TabsTrigger>
          <TabsTrigger value="danger" className="flex items-center gap-1" title="Caution: Delete account and data">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Danger</span>
          </TabsTrigger>
        </TabsList> */}


        {/* todo:------------------------------------------------------ */}

        <TabsContent value="profile" className="space-y-4">
          <ProfileEditor />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <APIKeysSection />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingSubscription />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationsSettings />
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <OrganizationSettings />
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Account Settings Component
function AccountSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Update Password
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app to generate verification codes
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Set up
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
              Delete Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}// Appearance Settings Component
function AppearanceSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="cursor-pointer rounded-lg border-2 border-primary p-4 text-center">
              <div className="mb-2 h-20 rounded bg-white" />
              <p className="text-sm font-medium">Light</p>
            </div>
            <div className="cursor-pointer rounded-lg border-2 border-muted p-4 text-center">
              <div className="mb-2 h-20 rounded bg-gray-900" />
              <p className="text-sm font-medium">Dark</p>
            </div>  
            <div className="cursor-pointer rounded-lg border-2 border-muted p-4 text-center">
              <div className="mb-2 flex h-20 rounded">
                <div className="w-1/2 bg-white" />
                <div className="w-1/2 bg-gray-900" />
              </div>
              <p className="text-sm font-medium">System</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
          <CardDescription>Customize your display preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="font-size" className="text-sm font-medium">Font Size</label>
            <select id="font-size" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Reduce spacing between elements</p>
            </div>
            <div className="h-6 w-11 rounded-full border-2 border-input bg-input" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
