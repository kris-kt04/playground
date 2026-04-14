import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselNext, CarouselPrevious, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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

 <Carousel className="w-full max-w-[12rem] sm:max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  )
}