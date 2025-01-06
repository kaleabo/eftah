import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { menuItems: true }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has menu items
    if (category.menuItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with menu items' },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}


export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id } = context.params
      const body = await request.json()
  
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description
        }
      })
  
      return NextResponse.json(category)
    } catch (error) {
      console.error('Failed to update category:', error)
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }
  }