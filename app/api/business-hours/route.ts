import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hours = await prisma.businessHours.findFirst()
    
    if (!hours) {
      return NextResponse.json({
        monday: { open: "00:00", close: "00:00", isClosed: false },
        tuesday: { open: "00:00", close: "00:00", isClosed: false },
        wednesday: { open: "00:00", close: "00:00", isClosed: false },
        thursday: { open: "00:00", close: "00:00", isClosed: false },
        friday: { open: "00:00", close: "00:00", isClosed: false },
        saturday: { open: "00:00", close: "00:00", isClosed: false },
        sunday: { open: "00:00", close: "00:00", isClosed: false }
      })
    }

    // Parse string fields if needed
    const parsedHours = {
      monday: typeof hours.monday === 'string' ? JSON.parse(hours.monday) : hours.monday,
      tuesday: typeof hours.tuesday === 'string' ? JSON.parse(hours.tuesday) : hours.tuesday,
      wednesday: typeof hours.wednesday === 'string' ? JSON.parse(hours.wednesday) : hours.wednesday,
      thursday: typeof hours.thursday === 'string' ? JSON.parse(hours.thursday) : hours.thursday,
      friday: typeof hours.friday === 'string' ? JSON.parse(hours.friday) : hours.friday,
      saturday: typeof hours.saturday === 'string' ? JSON.parse(hours.saturday) : hours.saturday,
      sunday: typeof hours.sunday === 'string' ? JSON.parse(hours.sunday) : hours.sunday
    }

    return NextResponse.json(parsedHours)
  } catch (error) {
    console.error('Error fetching business hours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business hours' },
      { status: 500 }
    )
  }
} 