import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const PaymentHistory = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  // Single query for all roles
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/payments')
      return res.data || []
    },
  })

  if (isLoading)
    return <progress className='progress w-56 mx-auto mt-6'></progress>

  // Sort payments by most recent
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.paid_at) - new Date(a.paid_at),
  )

  // Calculate total paid (user or rider)
  const total = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Payment History</h2>

      <h3 className='mb-4 text-green-600 font-semibold'>
        Total Paid: ৳ {total.toFixed(2)}
      </h3>

      {payments.length > 0 ? (
        <table className='table table-zebra w-full'>
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Tracking Number</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{payment.email}</td>
                <td>{payment.trackingNumber}</td>
                <td>৳ {payment.amount}</td>
                <td>{new Date(payment.paid_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-center mt-4 text-gray-500'>
          No payment history found.
        </p>
      )}
    </div>
  )
}

export default PaymentHistory
