import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  try {
    const heroContent = await prisma.heroContent.findFirst()
    return NextResponse.json(heroContent)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  // Check if user is authenticated and is admin
  const session = await getServerSession()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const json = await request.json()

    // Validate required fields
    if (!json.title || !json.subtitle || !json.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const heroContent = await prisma.heroContent.upsert({
      where: { id: 1 },
      update: json,
      create: { ...json, id: 1 }
    })

    return NextResponse.json(heroContent)
  } catch (error) {
    console.error('Error updating hero content:', error)
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    )
  }
}