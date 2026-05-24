import Link from 'next/link'
import { getProducts } from '@/lib/actions/products'
import { Package } from 'lucide-react'

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Allo Health</h1>
            <p className="text-gray-600">Reserve your medical equipment instantly</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Inventory System</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No products available in inventory.</p>
            </div>
          ) : (
            products.map((product) => {
              const totalStock = product.inventory.reduce((sum, item) => sum + item.quantity, 0)
              return (
                <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      Total Stock: {totalStock}
                    </span>
                    <Link
                      href={`/reserve/${product.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Reserve Now
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
