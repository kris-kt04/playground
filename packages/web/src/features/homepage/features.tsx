import { CardContent } from "@/components/ui/card";
import { Carousel, CarouselNext, CarouselPrevious, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Zap, Shield, Rocket, Users } from 'lucide-react';


export function FeaturesPage() {

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance' },
  { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security' },
  { icon: Rocket, title: 'Scalable', desc: 'Grows with your needs' },
  { icon: Users, title: 'Collaborative', desc: 'Built for teams' },
];
    return (
    <div className="bg-black flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
        <CardContent>
            <h1 className="text-4xl font-bold text-white">Features</h1>
            <p className="text-lg text-gray-300">Explore the amazing features of our application.</p>
        </CardContent>
        <Carousel className="w-full bg-gray-800 max-w-2xl items-center justify-center gap-6 p-6" opts={{ loop: true }}>
            <CarouselContent>
                {features.map(({ icon: Icon, title, desc }, index) => (
                    <CarouselItem key={index}>
                        <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-4">
                            <Icon className="w-8 h-8 mb-4" />
                            <span className="text-2xl font-semibold">{title}</span> 
                            <span className="text-3xl font-semibold">{desc}</span>
                        </CardContent>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>

    );
}