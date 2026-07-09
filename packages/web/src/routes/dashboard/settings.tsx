import { createFileRoute } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'react-toast'
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/useSession";
import { API_BASE_URL } from "@/lib/services";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/dashboard/settings')({
  component: Settings,
})

interface updateProfileData {
  name: string;
  email: string;
}

function Settings() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { session, loading: sessionLoading } = useSession();
  const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm<updateProfileData>({
    defaultValues: {
      name: '',
      email: '',
    }
  })

  const handleDeleteAccount = async () => {
     const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    
      if (!confirmDelete) return 

      if (sessionLoading || !session?.userId) {
        toast.error('Session is not ready. Please try again.')
        return
      }

      setIsDeleting(true)

      try {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'x-user-id': session?.userId || '',
      },
    })

    if (!response.ok) {
      const data = await response.json().catch((err) => {
        console.error('Failed to parse error response:', err)
        return { error: 'Unknown error' }
      })
      throw new Error(data.error || data.message || 'Failed to delete account')
    }
    
    toast.success('Account deleted successfully. Redirecting...')
    await authClient.signOut()
    navigate({ to: '/login' })
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
      }

    }

    const getProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/account/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'x-user-id': session?.userId || '',
          },
        })
        if (!response.ok) {
          const data = await response.json().catch((err) => {
            console.error('Failed to parse error response:', err)
            return { error: 'Unknown error' }
          })
          throw new Error(data.error || data.message || 'Failed to fetch profile')
        }
        const profileData = await response.json()
        reset(profileData)

      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error(`Failed to fetch profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    const onSubmit = async (data: updateProfileData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/account/update`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': session?.userId || '',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
            const data = await response.json().catch((err) => {
              console.error('Failed to parse error response:', err)
              return { error: 'Unknown error' }
            })
            throw new Error(data.error || data.message || 'Failed to update profile')
        }
        else {
          toast.success('Profile updated successfully')
          reset(data)
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    useEffect(() => {
      if (session?.userId) {
        getProfile()
      }
    }, [session?.userId])
  

  return (
    <div className="p-6 md:p-10 text-white max-w-2xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your profile and preferences.</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-gray-900 border-gray-800 p-6 mb-6 ">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-3">Profile Picture</label>
            <div className="flex items-center gap-4">
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=john"
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <Button variant="outline">Change Avatar</Button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <Button
            type ="submit"
            disabled={!isDirty || isSubmitting}
           className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
        
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Receive email updates' },
            { label: 'Team Updates', desc: 'Notify about team changes' },
            { label: 'Billing Alerts', desc: 'Get notified about billing' },
            { label: 'Security Alerts', desc: 'Important security notifications' },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{pref.label}</p>
                <p className="text-sm text-gray-400">{pref.desc}</p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 rounded bg-gray-800 border-gray-700 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Security</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <p className="text-sm text-gray-400 mb-3">Last changed 2 months ago</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
            <p className="text-sm text-gray-400 mb-3">Add an extra layer of security</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-950/20 border-red-900 p-6">
        <h2 className="text-xl font-semibold mb-6 text-red-400">Danger Zone</h2>
        
        <div>
          <p className="text-sm text-gray-400 mb-4">Delete your account and all associated data</p>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </Card>
    </div>
  )
}


