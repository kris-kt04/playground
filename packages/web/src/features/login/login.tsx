import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/useSession";
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';



const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export function LoginPage () {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { session, loading } = useSession();
    const [showPassword, setShowPassword] = useState(false);

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
        const password = formData.get('password') as string;

        const request = async () => {
            try {
                let response;
                if (isSignUp) {
                    // Sign up - create new user
                    response = await authClient.signUp.email({
                        email,
                        password,
                        name: email.split('@')[0], // Use email prefix as name
                    });
                    console.log('Sign up response:', response);
                } else {
                    // Sign in - login existing user
                    response = await authClient.signIn.email({ email, password });
                }

                if (response.data?.user?.createdAt) {
                    console.log('Auth successful:', response.data);

                    // Create organization for new user on sign up
                    if (isSignUp) {
                        await fetch(`${API_BASE_URL}/api/organization`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                userId: response.data.user.id,
                                userName: response.data.user.name,
                                userEmail: response.data.user.email,
                            }),
                        });
                    }
                    // Handle successful login/signup
                    navigate({ to: '/hello' });
                } else {
                    setError(response.error?.message || 'Authentication failed');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Auth error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        request();
    }

    if (loading) {
      return (
        <Card className="w-full max-w-sm">
          <CardContent className="pt-6">
            <div>Loading...</div>
          </CardContent>
        </Card>
      );
    }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create account' : 'Login to your account'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Enter your email below to create an account'
            : 'Enter your email below to login to your account'
          }
        </CardDescription>
        <CardAction>

        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="auth-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button 
          form="auth-form"
          type="submit" 
          className="w-full bg-white text-black hover:bg-gray-200"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Login')}
        </Button>
          <Button 
            variant="link" 
            onClick={() => setIsSignUp(!isSignUp)}
            type="button"
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            {isSignUp ? 'Already have an account?' : 'Create account'}
          </Button>
      </CardFooter>
    </Card>
  )
}
