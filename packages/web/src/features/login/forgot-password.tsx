import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/useSession";
import { API_BASE_URL } from "@/lib/services";

export function ForgotPasswordPage () {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { session, loading } = useSession();

    // Redirect to hello if already logged in
    useEffect(() => {
      if (session && !loading) {
        navigate({ to: '/hello' });
      }
    }, [session, loading, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        const request = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    email,
                    redirectTo: `${window.location.origin}/reset-password`
                  }),
                });
                
                if (!response.ok) {
                  throw new Error('Failed to send reset email');
                }
                
                alert('If an account with that email exists, a password reset link has been sent.');
                navigate({ to: '/login' });
            } catch (err) {
                console.error('Forgot password error:', err);
                setError('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        request();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-300 cursor-pointer">
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}