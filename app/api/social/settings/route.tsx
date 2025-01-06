import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const settings = await prisma.socialSettings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const links = {
      facebook: body.socialLinks.facebook || '',
      twitter: body.socialLinks.twitter || '',
      instagram: body.socialLinks.instagram || '',
      telegram: body.socialLinks.telegram || '',
      tiktok: body.socialLinks.tiktok || ''
    }

    const settings = await prisma.socialSettings.upsert({
      where: {
        id: 1
      },
      update: {
        links: links
      },
      create: {
        links: links
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}