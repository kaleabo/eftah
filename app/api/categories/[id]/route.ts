import { prisma as db } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Use the correct type for dynamic route parameters
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params
//     const body = await request.json()

//     const category = await db.category.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         ...body,
//       },
//     })

//     return NextResponse.json(category)
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update category" },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params

//     await db.category.delete({
//       where: {
//         id: parseInt(id),
//       },
//     })

//     return NextResponse.json({ message: "Category deleted successfully" })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete category" },
//       { status: 500 }
//     )
//   }
// }