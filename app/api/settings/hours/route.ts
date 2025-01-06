import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hours = await prisma.businessHours.findFirst({
      where: { id: 1 }
    })
    
    // Return default values if no hours are found
    if (!hours) {
      return NextResponse.json({
        monday: { open: '08:00', close: '20:00', isClosed: false },
        tuesday: { open: '08:00', close: '20:00', isClosed: false },
        wednesday: { open: '08:00', close: '20:00', isClosed: false },
        thursday: { open: '08:00', close: '20:00', isClosed: false },
        friday: { open: '08:00', close: '20:00', isClosed: false },
        saturday: { open: '08:00', close: '20:00', isClosed: false },
        sunday: { open: '08:00', close: '20:00', isClosed: false }
      })
    }

    return NextResponse.json(hours)
  } catch (error) {
    console.error('Error fetching business hours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business hours' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    
    // Validate the incoming data
    if (!json || typeof json !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    const hours = await prisma.businessHours.upsert({
      where: { id: 1 },
      update: json,
      create: { ...json, id: 1 }
    })

    return NextResponse.json(hours)
  } catch (error) {
    console.error('Error updating business hours:', error)
    return NextResponse.json(
      { error: 'Failed to update business hours' },
      { status: 500 }
    )
  }
}