import { createFileRoute } from '@tanstack/react-router'
import { Users, TrendingUp, Activity, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/_protected/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  // Sample organizations/teams data
  const teams = [
    { id: 1, name: 'Acme Corp', members: 12, seed: 'acme' },
    { id: 2, name: 'Tech Startup', members: 8, seed: 'startup' },
    { id: 3, name: 'Design Agency', members: 5, seed: 'agency' },
  ]

  // Key metrics
  const metrics = [
    { label: 'Total Users', value: '2,420', change: '+12.5%', icon: Users },
    { label: 'Active Teams', value: '18', change: '+4.2%', icon: Activity },
    { label: 'Growth', value: '24.5%', change: '+2.1%', icon: TrendingUp },
  ]

  // Recent activity
  const recentActivity = [
    { id: 1, action: 'New team created', team: 'Acme Corp', time: '2 hours ago' },
    { id: 2, action: 'User invitation sent', team: 'Tech Startup', time: '4 hours ago' },
    { id: 3, action: 'Integration enabled', team: 'Design Agency', time: '1 day ago' },
  ]

  return (
    <div className="p-6 md:p-10 text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your overview.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="bg-gray-900 border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">{metric.label}</p>
                  <p className="text-3xl font-bold mb-2">{metric.value}</p>
                  <p className="text-green-400 text-sm flex items-center gap-1">
                    <ArrowUpRight size={16} />
                    {metric.change}
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Icon size={24} className="text-blue-400" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Teams Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Your Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="bg-gray-900 border-gray-800 p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${team.seed}`}
                  alt={team.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-400">{team.members} members</p>
                </div>
              </div>
              <button className="w-full text-center py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium">
                View Team
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Card className="bg-gray-900 border-gray-800">
          <div className="divide-y divide-gray-800">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.team}</p>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
