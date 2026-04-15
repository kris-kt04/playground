import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Carousel, CarouselNext, CarouselPrevious, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export function HomePage() {

    


    const items =[
        { id: 1, content: 'Welcome' },
        { id: 2, content: 'to' },
        { id: 3, content: 'the exciting ' },
        { id: 4, content: 'world' },
        { id: 5, content: 'of React!' },
    ]

  return (
    <div className="bg-black flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">

      <div className="flex flex-row items-center w-full gap-6">
        <div className="flex-1"></div>
        <h1 className="text-4xl font-bold text-white">Hello Page 🚀</h1>
        <div className="flex-1 flex justify-end">

        </div>
      </div>


<Carousel className="w-full max-w-2xl items-center justify-center gap-6 p-6">
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{item.content}</span>
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