import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Check, X } from 'lucide-react'

export const Route = createFileRoute('/_protected/dashboard/integrations')({
  component: Integrations,
})

function Integrations() {
  const availableIntegrations = [
    { id: 1, name: 'Slack', description: 'Get notifications in Slack', connected: true, icon: '💬' },
    { id: 2, name: 'GitHub', description: 'Sync your repositories', connected: false, icon: '🐙' },
    { id: 3, name: 'Zapier', description: 'Automate with Zapier', connected: false, icon: '⚡' },
    { id: 4, name: 'Webhook', description: 'Custom webhooks', connected: true, icon: '🔗' },
  ]

  return (
    <div className="p-6 md:p-10 text-white">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-400">Connect your favorite tools and services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableIntegrations.map((integration) => (
          <Card key={integration.id} className="bg-gray-900 border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{integration.name}</h3>
                  <p className="text-gray-400 text-sm">{integration.description}</p>
                </div>
              </div>
              {integration.connected && <Check size={20} className="text-green-400" />}
            </div>
            <Button
              className={integration.connected ? 'w-full bg-gray-800 hover:bg-gray-700' : 'w-full'}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
