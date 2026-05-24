'use server'

import { prisma } from '../prisma'

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      inventory: true,
    },
  })
}

export async function getWarehouses() {
  return await prisma.warehouse.findMany()
}

export async function getReservation(id: string) {
  return await prisma.reservation.findUnique({
    where: { id },
    include: {
      product: true,
      warehouse: true,
    },
  })
}
