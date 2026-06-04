import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export const Route = createFileRoute('/dashboard/analytics')({
  component: Analytics,
})

function Analytics() {
  // Revenue trend data
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 2000 },
    { month: 'Apr', revenue: 2780 },
    { month: 'May', revenue: 1890 },
    { month: 'Jun', revenue: 2390 },
  ]

  // User metrics data
  const userMetricsData = [
    { name: 'New Users', value: 400 },
    { name: 'Active Users', value: 2400 },
    { name: 'Returning Users', value: 1398 },
  ]

  // Conversion funnel data
  const conversionData = [
    { stage: 'Visitors', value: 4000 },
    { stage: 'Signups', value: 3000 },
    { stage: 'Trial', value: 2000 },
    { stage: 'Customers', value: 780 },
  ]

  // Traffic breakdown data
  const trafficData = [
    { name: 'Direct', value: 400 },
    { name: 'Organic', value: 300 },
    { name: 'Referral', value: 200 },
    { name: 'Social', value: 100 },
  ]

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B']

  return (
    <div className="p-6 md:p-10 text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Track your business metrics and performance.</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend - Line Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* User Metrics - Bar Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">User Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userMetricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
              <Legend />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Funnel - Area Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Conversion Funnel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
              <Area
                type="monotone"
                dataKey="value"
                fill="#EC4899"
                stroke="#EC4899"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Breakdown - Pie Chart */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Traffic Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        {[
          { label: 'Total Revenue', value: '$14.2K' },
          { label: 'Conversion Rate', value: '19.5%' },
          { label: 'Avg Session', value: '4m 32s' },
          { label: 'Bounce Rate', value: '23.4%' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-gray-900 border-gray-800 p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
