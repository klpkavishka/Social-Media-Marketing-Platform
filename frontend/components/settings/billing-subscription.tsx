'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  Download,
  ChevronRight,
  Zap,
} from 'lucide-react'

interface BillingSubscriptionProps {
  onUpgrade?: () => void
  onCancelSubscription?: () => void
}

export function BillingSubscription({ onUpgrade, onCancelSubscription }: BillingSubscriptionProps) {
  const [selectedPayment, setSelectedPayment] = useState('1')

  const currentPlan = {
    name: 'Professional',
    price: 79,
    billing: 'monthly',
    features: [
      'Up to 10 social accounts',
      'Unlimited content scheduling',
      'Advanced analytics',
      'Team collaboration (up to 5 members)',
      'Priority support',
      'Custom branding',
    ],
    renewalDate: '2026-01-12',
    status: 'active',
  }

  const paymentMethods = [
    {
      id: '1',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
    {
      id: '2',
      brand: 'Mastercard',
      last4: '5555',
      expiry: '08/25',
      isDefault: false,
    },
  ]

  const upgradePlans = [
    {
      name: 'Professional',
      price: 79,
      current: true,
      features: [
        'Up to 10 social accounts',
        'Unlimited content scheduling',
        'Advanced analytics',
      ],
    },
    {
      name: 'Business',
      price: 199,
      current: false,
      features: [
        'Unlimited social accounts',
        'Unlimited content scheduling',
        'Advanced analytics',
        'Team collaboration (up to 20 members)',
        'API access',
      ],
    },
    {
      name: 'Enterprise',
      price: null,
      current: false,
      features: ['Everything in Business', 'Dedicated support', 'Custom integrations', 'SSO'],
    },
  ]

  const invoices = [
    {
      id: 'INV-2025-12',
      date: '2025-12-01',
      amount: 79.0,
      status: 'paid',
      url: '#',
    },
    {
      id: 'INV-2025-11',
      date: '2025-11-01',
      amount: 79.0,
      status: 'paid',
      url: '#',
    },
    {
      id: 'INV-2025-10',
      date: '2025-10-01',
      amount: 79.0,
      status: 'paid',
      url: '#',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {currentPlan.name} Plan
              </CardTitle>
              <CardDescription>
                Your current subscription plan and billing information
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Plan Price</p>
              <p className="text-2xl font-bold">
                ${currentPlan.price}
                <span className="text-lg font-normal text-muted-foreground">
                  /{currentPlan.billing}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Renewal Date</p>
              <p className="font-medium">{currentPlan.renewalDate}</p>
              <p className="text-xs text-muted-foreground">Next billing date</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billing Status</p>
              <p className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Up to date
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <p className="font-medium text-sm mb-2">Included Features</p>
              <ul className="space-y-2">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onUpgrade} className="gap-2">
              <ChevronRight className="h-4 w-4" />
              Upgrade Plan
            </Button>
            <Button variant="outline" onClick={onCancelSubscription}>
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Compare Plans</CardTitle>
          <CardDescription>Upgrade to a higher tier for more features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {upgradePlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border-2 p-4 ${
                  plan.current ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <div className="mb-4">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-2xl font-bold">
                    {plan.price ? `$${plan.price}` : 'Custom'}
                    {plan.price && <span className="text-sm text-muted-foreground">/mo</span>}
                  </p>
                  {plan.current && (
                    <Badge className="mt-2">Current Plan</Badge>
                  )}
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <Button className="w-full" variant={plan.name === 'Business' ? 'default' : 'outline'}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id)}
                  className="cursor-pointer"
                />
                <div>
                  <p className="font-medium">
                    {method.brand} ending in {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && (
                  <Badge variant="outline" className="text-xs">
                    Default
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proration Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Billing Information</p>
            <p>
              When you upgrade or downgrade your plan, your billing will be adjusted automatically.
              Upgrades are prorated and will appear on your next invoice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
