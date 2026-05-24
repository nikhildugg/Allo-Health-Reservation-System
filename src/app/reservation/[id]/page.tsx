import { getReservation } from '@/lib/actions/products'
import CountdownTimer from '@/components/CountdownTimer'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reservation = await getReservation(id)

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Reservation Not Found</h1>
          <p className="text-gray-600 mb-6">The reservation ID you provided is invalid or has been purged.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            You have successfully reserved {reservation.quantity}x {reservation.product.name} from {reservation.warehouse.name}.
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
            <div className="flex items-center justify-center gap-2 text-blue-700 font-medium mb-3">
              <Clock className="w-5 h-5" />
              <span>Reservation Expiry</span>
            </div>
            <div className="text-4xl font-mono font-bold text-blue-900">
              <CountdownTimer expiresAt={reservation.expiresAt.toISOString()} />
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-8">
            Reservation ID: <span className="font-mono">{reservation.id}</span>
          </div>

          <Link
            href="/"
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}
