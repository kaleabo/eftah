import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const heroContent = await prisma.heroContent.findFirst()
    return NextResponse.json(heroContent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const heroContent = await prisma.heroContent.upsert({
      where: { id: 1 },
      update: json,
      create: { ...json, id: 1 }
    })
    return NextResponse.json(heroContent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    )
  }
} 