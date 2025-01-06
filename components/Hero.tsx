'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { Clock, MapPin, Phone } from 'lucide-react'
import HeroImage from './HeroImage'
import { Skeleton } from './ui/skeleton'

interface HeroProps {
  content: {
    title: string
    subtitle?: string
    description: string
    images: string[]
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
  }
}

export default function Hero({ content }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-6xl mx-auto px-5 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            {content ? (
              <>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                  {content.title}
                </h1>
                
                {content.subtitle && (
                  <p className="mt-2 text-lg text-gray-700">
                    {content.subtitle}
                  </p>
                )}

                <p className="mt-4 text-gray-600 text-base">
                  {content.description}
                </p>
              </>
            ) : (
              <>
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-3" />
                <Skeleton className="h-20 w-full" />
              </>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {content ? (
                <>
                  <Link href={content.primaryButtonLink}>
                    <Button 
                      variant="destructive"
                      size="default"
                      className="rounded-full"
                    >
                      {content.primaryButtonText}
                    </Button>
                  </Link>
                  
                  {content.secondaryButtonText && content.secondaryButtonLink && (
                    <Link href={content.secondaryButtonLink}>
                      <Button 
                        variant="outline"
                        size="default"
                        className="rounded-full"
                      >
                        {content.secondaryButtonText}
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </>
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {content ? (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-sm">Fast</p>
                      <p className="text-xs text-gray-500">Delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-red-500 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-sm">Local</p>
                      <p className="text-xs text-gray-500">Ingredients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-red-500 h-4 w-4" />
                    <div>
                      <p className="font-semibold text-sm">12/7</p>
                      <p className="text-xs text-gray-500">Support</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              )}
            </div>
          </div>

          <div className="relative">
            {content ? (
              <HeroImage images={content.images} />
            ) : (
              <Skeleton className="h-full w-full rounded-2xl" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}