import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";

export function HomePage() {

    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await authClient.signOut();
            navigate({ to: '/login' });
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

  return (
    <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-4xl font-bold text-white">Hello Page 🚀</h1>

      <button
        className="rounded bg-white px-4 py-2 font-bold text-black hover:bg-gray-200"
        onClick={() => handleLogout()}
      >
        Logout 
      </button>
    </div>
  )
}