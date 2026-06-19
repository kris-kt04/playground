import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { Send, AlertCircle, Loader } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from '@/lib/useSession'

export const Route = createFileRoute('/dashboard/chat')({
  component: ChatPage,
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Usage {
  used: number
  remaining: number
  limit: number
  resetTime: string
}

function ChatPage() {
  const { session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch usage on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUsage()
    }
  }, [session?.user?.id])

  const fetchUsage = async () => {
    try {
      const userId = session?.user?.id
      if (!userId) return

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/usage`,
        {
          headers: {
            'x-user-id': userId,
          },
        }
      )

      if (!response.ok) throw new Error('Failed to fetch usage')
      const data = (await response.json()) as Usage
      setUsage(data)
    } catch (err) {
      console.error('Usage fetch error:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    // Use session user ID if available, otherwise use a test ID
    const userId = session?.user?.id || 'dev-test-user'

    // Check rate limit
    if (usage && usage.remaining <= 0) {
      setError('Rate limit exceeded. Please try again later.')
      return
    }

    setError(null)
    const userMessage = input.trim()
    setInput('')

    // Add user message to UI
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({ message: userMessage }),
        }
      )

      if (response.status === 429) {
        setError('Rate limit exceeded. You can send 10 messages per hour.')
        setMessages((prev) => prev.slice(0, -1))
        await fetchUsage()
        return
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = (await response.json()) as {
        success: boolean
        response: string
        usage: Usage
      }

      // Add assistant response
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setUsage(data.usage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Assistant</h1>
        <p className="text-gray-400">Chat with our AI assistant powered by Mistral 7B</p>
      </div>

      {/* Usage Card */}
      {usage && (
        <Card className="bg-gray-900 border-gray-800 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Messages Used This Hour</p>
              <p className="text-2xl font-bold">
                {usage.used}/{usage.limit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Resets</p>
              <p className="text-sm font-medium">
                {new Date(usage.resetTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="bg-gray-900 border-gray-800 h-96 md:h-[500px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Start a conversation</p>
                <p className="text-sm">Ask me anything! I'm here to help.</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-red-900/20 border border-red-800 rounded flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={loading || (usage !== null && usage.remaining <= 0)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                loading ||
                !input.trim() ||
                (usage !== null && usage.remaining <= 0)
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} />
            </Button>
          </div>
          {usage !== null && usage.remaining <= 0 && (
            <p className="text-xs text-red-400">
              Rate limit reached. Please try again later.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
