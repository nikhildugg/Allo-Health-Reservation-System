import { getProducts, getWarehouses } from '@/lib/actions/products'
import { reserveProduct } from '@/lib/actions/reservations'
import { redirect } from 'next/navigation'
import { Package, Warehouse, ShoppingCart } from 'lucide-react'

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams
  const products = await getProducts()
  const product = products.find(p => p.id === id)
  const warehouses = await getWarehouses()

  if (!product) {
    return <div className="p-8 text-center">Product not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reserve {product.name}</h1>
          </div>

          <p className="text-gray-600 mb-8">{product.description}</p>

          {error ? (
            <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <form action={async (formData: FormData) => {
            'use server'
            const productId = id
            const warehouseId = formData.get('warehouseId') as string
            const quantity = parseInt(formData.get('quantity') as string)

            if (!warehouseId || isNaN(quantity)) {
              redirect(`/reserve/${id}?error=${encodeURIComponent('Please provide valid warehouse and quantity')}`)
            }

            const result = await reserveProduct({ productId, warehouseId, quantity })

            if (result.success) {
              redirect(`/reservation/${result.reservationId}`)
            }

            redirect(`/reserve/${id}?error=${encodeURIComponent(result.error)}`)
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse
              </label>
              <div className="relative">
                <Warehouse className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="warehouseId"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="">Select a warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} - {w.location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  placeholder="1"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Confirm Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
