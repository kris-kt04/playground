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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { API_BASE_URL } from "@/lib/services";
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';



export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" });
  const token = (search as { token?: string }).token;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPassword,
          token,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      
      setSuccess(true);
      useEffect(() => {
        const timer = setTimeout(() => navigate({ to: '/login' }), 2000);
        return () => clearTimeout(timer);
      }, [navigate]);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password Reset Successful</CardTitle>
          <CardDescription>Redirecting to login...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
          <div className="grid w-full items-center gap-2">
            
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  type="button"
                  aria-label="button"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
              <Eye
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                type="button"
                aria-label="button"
                onClick={() => setShowPassword(!showPassword)}
              />
              )}
            </div>
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  type="button"
                  aria-label="button"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : ( 
              <Eye
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                type="button"
                aria-label="button"
                onClick={() => setShowPassword(!showPassword)}
              />
              )}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={isLoading} className="w-full bg-white text-black hover:bg-gray-300 cursor-pointer">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
