import { prisma as db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    // Get id from URL
    const id = request.url.split('/').pop()
    const body = await request.json()

    const category = await db.category.update({
      where: {
        id: parseInt(id!),
      },
      data: {
        ...body,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Get id from URL 
    const id = request.url.split('/').pop()

    await db.category.delete({
      where: {
        id: parseInt(id!),
      },
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}