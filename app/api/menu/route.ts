// app/api/menu/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const menuItems = await prisma.menuItem.findMany({
      where: category && category !== 'all' ? {
        category: {
          slug: {
            equals: category
          }
        }
      } : undefined,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name: json.name,
        price: json.price,
        description: json.description,
        image: json.image,
        categoryId: json.categoryId,
        isAvailable: json.isAvailable,
        isPopular: json.isPopular
      },
      include: {
        category: true
      }
    })
    
    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Failed to create menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}