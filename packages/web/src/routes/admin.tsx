import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/lib/useSession';
import { API_BASE_URL } from '@/lib/services';

export const Route = createFileRoute('/admin')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { session, loading: sessionLoading } = useSession();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Wait for session to load
        if (sessionLoading) {
          return;
        }


        if (!session?.userId) {
          throw new Error('Not authenticated - please login');
        }

        const userId = session.userId;
        
        const res = await fetch(`${API_BASE_URL}/api/admin`, {
          headers: {
            'x-user-id': userId,
          },
        });
        
        if (!res.ok) {
          throw new Error('Unauthorized - Admin access required');
        }
        
        const data = await res.json();
        setUsers(data.adminUser || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [session, sessionLoading]);

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Role</th>
              <th className="p-3 text-left border">Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.name || 'N/A'}</td>
                <td className="p-3 border">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 border">
                  {user.emailVerified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-orange-600">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <p className="text-gray-500 mt-4">No users found.</p>
      )}
    </div>
  );
}