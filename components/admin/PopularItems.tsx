import { MenuItem } from "@prisma/client"
import Image from "next/image"

interface PopularItemsProps {
  items: (MenuItem & {
    category: {
      name: string
    }
  })[]
}

export function PopularItems({ items }: PopularItemsProps) {
  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="relative size-10 overflow-hidden rounded-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-none">
              {item.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {item.category.name}
            </p>
          </div>
          <div className="text-sm font-medium">
            ${item.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
} 