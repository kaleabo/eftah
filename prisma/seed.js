import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('6qYPjPZKzSG8', 12)
  await prisma.user.upsert({
    where: { email: 'admin@eftahfastfood.com' },
    update: {},
    create: {
      email: 'admin@eftahfastfood.com',
      name: 'Anteneh',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })