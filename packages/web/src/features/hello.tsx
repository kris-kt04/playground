import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>
          <CardDescription>
            This page is protected and requires authentication to access.
          </CardDescription>
        </CardHeader>
          <Button onClick={() => handleLogout()}>
            Logout
          </Button>
      </Card>

    </div>
  )
}