import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?email=${user?.email}`, // ✅ FIXED
      )
      return res.data || [] // ✅ NEVER return undefined
    },
  })

  if (isLoading) {
    return <progress className='progress w-56'></progress>
  }

  // ✅ Calculate total (NO deletion, just added)
  const total = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Payment History</h2>

      <h3 className='mb-4 text-green-600 font-semibold'>
        Total Paid: ৳ {total.toFixed(2)}
      </h3>

      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>#</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td>{payment.parcelId}</td>
              <td>৳ {payment.amount}</td>
              <td>{new Date(payment.paid_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {payments.length === 0 && (
        <p className='text-center mt-4 text-gray-500'>
          No payment history found.
        </p>
      )}
    </div>
  )
}

export default PaymentHistory
