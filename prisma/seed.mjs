import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function start() {
  console.log('Seeding database...')

  const product1 = await prisma.product.create({
    data: {
      name: 'Oxygen Concentrator',
      description: 'High-efficiency medical-grade oxygen concentrator for home use.',
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: 'Wheelchair (Manual)',
      description: 'Lightweight, foldable manual wheelchair with ergonomic support.',
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: 'Nebulizer Machine',
      description: 'Compact nebulizer for effective respiratory treatment.',
    },
  })

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'North Region Hub',
      location: 'New York, NY',
    },
  })

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'West Coast Center',
      location: 'Los Angeles, CA',
    },
  })

  await prisma.inventory.createMany({
    data: [
      { productId: product1.id, warehouseId: warehouse1.id, quantity: 5 },
      { productId: product1.id, warehouseId: warehouse2.id, quantity: 2 },
      { productId: product2.id, warehouseId: warehouse1.id, quantity: 10 },
      { productId: product2.id, warehouseId: warehouse2.id, quantity: 8 },
      { productId: product3.id, warehouseId: warehouse1.id, quantity: 1 },
      { productId: product3.id, warehouseId: warehouse2.id, quantity: 15 },
    ],
  })

  console.log('Seeding completed successfully!')
}

start()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
