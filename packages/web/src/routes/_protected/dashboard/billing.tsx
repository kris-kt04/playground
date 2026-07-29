import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/_protected/dashboard/billing')({
  component: Billing,
})

function Billing() {
  const currentPlan = 'Professional'
  
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 teams',
        'Basic analytics',
        'Community support',
        'Limited integrations',
      ],
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Most popular for growing teams',
      features: [
        'Unlimited teams',
        'Advanced analytics',
        'Priority support',
        'All integrations',
        'Custom branding',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact sales',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security',
        'SLA guarantee',
      ],
    },
  ]

  const invoices = [
    { date: 'Apr 1, 2026', amount: '$99.00', status: 'Paid' },
    { date: 'Mar 1, 2026', amount: '$99.00', status: 'Paid' },
    { date: 'Feb 1, 2026', amount: '$99.00', status: 'Paid' },
  ]

  return (
    <div className="p-6 md:p-10 text-white">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Billing</h1>
        <p className="text-gray-400">Manage your subscription and billing information.</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-gray-900 border-gray-800 p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-2">Current Plan</p>
            <h2 className="text-2xl font-bold">{currentPlan}</h2>
            <p className="text-gray-400 text-sm mt-1">$99.00 / month</p>
          </div>
          <Button>Manage Plan</Button>
        </div>
      </Card>

      {/* Pricing Plans */}
      <h2 className="text-2xl font-bold mb-6">Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`border p-6 transition-colors ${
              plan.current
                ? 'bg-gray-800 border-blue-500'
                : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
            <div className="mb-6">
              <p className="text-3xl font-bold">{plan.price}</p>
              <p className="text-sm text-gray-400">{plan.period}</p>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={plan.current ? 'outline' : 'default'}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Choose Plan'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Billing History */}
      <h2 className="text-2xl font-bold mb-6">Billing History</h2>
      <Card className="bg-gray-900 border-gray-800">
        <div className="divide-y divide-gray-800">
          {invoices.map((invoice, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-gray-400">Invoice</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{invoice.amount}</p>
                <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-medium">
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
