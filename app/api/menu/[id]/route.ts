// app/api/menu/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = resolvedParams.id

  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    })
    
    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const json = await request.json();
    
    const menuItem = await prisma.menuItem.update({
      where: { 
        id: parseInt(id) 
      },
      data: {
        name: json.name,
        price: Number(json.price),
        description: json.description || null,
        image: json.image,
        categoryId: Number(json.categoryId),
        isAvailable: Boolean(json.isAvailable),
        isPopular: Boolean(json.isPopular)
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Failed to update menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = resolvedParams.id

  try {
    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ message: 'Menu item deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}