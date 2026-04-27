import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const features = [
    {
      icon: <BarChart3 size={24} />,
      title: 'Advanced Analytics',
      description: 'Get real-time insights into your business metrics',
    },
    {
      icon: <Users size={24} />,
      title: 'Team Management',
      description: 'Manage multiple teams and collaborate seamlessly',
    },
    {
      icon: <Zap size={24} />,
      title: 'Integrations',
      description: 'Connect with your favorite tools and services',
    },
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      features: ['Up to 5 teams', 'Basic analytics', 'Community support'],
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      features: ['Unlimited teams', 'Advanced analytics', 'Priority support', 'All integrations'],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      features: ['Everything in Professional', 'Dedicated support', 'Custom integrations'],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:px-16">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl">PlayGround</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/pricing" className="hover:text-gray-300 transition">
            Pricing
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Manage Your Business <br /> with Ease
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          A modern SaaS platform designed for teams to collaborate, analyze data, and grow together.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline">View Pricing</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-gray-900 border-gray-800 p-8 hover:border-gray-700 transition">
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 md:px-16 py-20 bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`border p-8 ${
                plan.name === 'Professional'
                  ? 'bg-gray-800 border-blue-500 md:scale-105'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-1">{plan.price}</p>
              <p className="text-gray-400 mb-6">{plan.period}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <Button className="w-full">Get Started</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-16 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl text-gray-400 mb-8">Join thousands of teams already using PlayGround</p>
        <Link to="/login">
          <Button size="lg" className="flex items-center gap-2">
            Start Free Trial
            <ArrowRight size={20} />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 md:px-16 py-12 text-center text-gray-400">
        <p>&copy; 2026 PlayGround. All rights reserved.</p>
      </footer>
    </div>
  )
}
