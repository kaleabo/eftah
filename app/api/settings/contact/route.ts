import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const contactInfo = await prisma.contactInformation.findFirst()
    return NextResponse.json(contactInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact information' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const contactInfo = await prisma.contactInformation.upsert({
      where: { id: 1 },
      update: json,
      create: { ...json, id: 1 }
    })
    return NextResponse.json(contactInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact information' },
      { status: 500 }
    )
  }
} 