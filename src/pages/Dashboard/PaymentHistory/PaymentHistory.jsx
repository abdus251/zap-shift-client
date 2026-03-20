import React from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payment', user?.email],
    // enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user?.email}`)
      return res.data
    },
  })

  if (isPending) {
    return <progress className='progress w-56'></progress>
  }

  return (
    <div className='overflow-x-auto bg-white rounded-xl shadow-md p-4'>
      <h2 className='text-xl font-semibold mb-4'>Payment History</h2>

      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Paid At</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              {/* Serial */}
              <td>{index + 1}</td>

              {/* Parcel ID */}
              <td className='font-medium text-sm'>{payment.parcelId}</td>

              {/* Amount */}
              <td className='font-semibold text-primary'>
                ৳ {payment.amount.toFixed(2)}
              </td>

              {/* Transaction ID */}
              <td className='font-mono text-xs'>{payment.transactionId}</td>

              {/* Date */}
              <td>{new Date(payment.paid_at).toLocaleString()}</td>

              {/* Status */}
              <td>
                <span className='badge badge-success'>Paid</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payments.length === 0 && (
        <p className='text-center text-gray-500 mt-4'>
          No payment history found.
        </p>
      )}
    </div>
  )
}

export default PaymentHistory
