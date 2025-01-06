"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function HeroImage({ images }: { images: string[] }) {
  const plugin = useRef(Autoplay());

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-md mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((image: string, index: number) => (
          <CarouselItem key={index}>
            <Image
              src={image}
              alt="Hero Image"
              width={1000}
              height={1000}
              className="mx-auto md:h-full rounded-2xl object-cover mt-20 -pb-10 md:mt-0 w-full max-w-xl md:mx-0"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
