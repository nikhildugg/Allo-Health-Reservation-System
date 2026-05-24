'use server'

import { prisma } from '../prisma'
import { z } from 'zod'

const ReserveSchema = z.object({
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  quantity: z.number().int().positive(),
})

export async function reserveProduct(data: z.infer<typeof ReserveSchema>) {
  try {
    const { productId, warehouseId, quantity } = ReserveSchema.parse(data)

    return await prisma.$transaction(async (tx) => {
      // 1. Pessimistic Lock: SELECT ... FOR UPDATE
      // This prevents other transactions from reading or modifying this row until the transaction ends.
      const inventoryResult = await tx.$queryRaw<Array<{ quantity: number }>>`
        SELECT "quantity" FROM "Inventory"
        WHERE "productId" = ${productId} AND "warehouseId" = ${warehouseId}
        FOR UPDATE
      `

      const inventory = inventoryResult[0]

      if (!inventory) {
        throw new Error('Product not found in this warehouse')
      }

      if (inventory.quantity < quantity) {
        throw new Error('Insufficient stock available')
      }

      // 2. Decrement stock
      await tx.inventory.update({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      })

      // 3. Create reservation with 15 minute expiry
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
      const reservation = await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          expiresAt,
          status: 'ACTIVE',
        },
      })

      return { success: true as const, reservationId: reservation.id, expiresAt }
    })
  } catch (error) {
    console.error('Reservation error:', error)
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
