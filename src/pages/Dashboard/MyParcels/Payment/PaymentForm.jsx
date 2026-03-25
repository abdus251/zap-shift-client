import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import useAuth from '../../../../hooks/useAuth'
import Swal from 'sweetalert2'

const PaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { parcelId } = useParams()

  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const [error, setError] = useState('')

  const { isPending, data: parcelInfo } = useQuery({
    queryKey: ['parcel', parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`)
      console.log('Parcel from backend:', res.data)
      return res.data
    },
  })

  if (isPending || !parcelInfo) {
    return <progress className='progress w-56'></progress>
  }

  const amount = Number(parcelInfo.deliveryCost)
  const amountInCents = Math.round(amount * 100)

  console.log('Amount:', amount)
  console.log('Amount in cents:', amountInCents)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    if (amountInCents < 50) {
      setError('Minimum payment is $0.50')
      return
    }

    // 1️⃣ Check if already paid
    const parcelRes = await axiosSecure.get(`/parcels/${parcelId}`)
    if (parcelRes.data.paymentStatus === 'paid') {
      return Swal.fire({
        icon: 'info',
        title: 'Already Paid',
        text: 'This parcel has already been paid.',
      })
    }

    // 2️⃣ Confirm with SweetAlert
    const confirmResult = await Swal.fire({
      title: 'Confirm Payment?',
      text: `You are about to pay $${amount}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Pay Now',
      cancelButtonText: 'Cancel',
    })
    if (!confirmResult.isConfirmed) return

    // 3️⃣ Create Stripe PaymentMethod
    const card = elements.getElement(CardElement)
    if (!card) return
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })
    if (error) {
      setError(error.message)
      return
    }
    setError('')
    console.log('[PaymentMethod]', paymentMethod)

    // 4️⃣ Create PaymentIntent
    const res = await axiosSecure.post('/create-payment-intent', {
      amountInCents,
      parcelId,
    })
    const clientSecret = res.data.clientSecret

    // 5️⃣ Confirm Card Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: { name: user?.displayName, email: user?.email },
      },
    })
    if (result.error) {
      setError(result.error.message)
      return
    }

    if (result.paymentIntent.status === 'succeeded') {
      const transactionId = result.paymentIntent.id

      // 6️⃣ Save payment info directly (no unused variable)
      await axiosSecure.post('/payments', {
        parcelId,
        email: user?.email,
        amount,
        transactionId,
        paymentMethod: result.paymentIntent.payment_method_types,
      })

      // 7️⃣ Update parcel paymentStatus
      await axiosSecure.patch(`/parcels/pay/${parcelId}`, {
        transactionId,
      })

      // 8️⃣ Show success alert
      await Swal.fire({
        icon: 'success',
        title: 'Payment Successful',
        html: `<strong>Transaction ID:</strong><code>${transactionId}</code>`,
        confirmButtonText: 'Go to My Parcels',
      })

      // 9️⃣ Navigate
      navigate('/dashboard/myParcels')
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'
      >
        <div className='p-4 border rounded-md'>
          <CardElement />
        </div>

        <button
          type='submit'
          disabled={!stripe}
          className='w-full bg-primary py-2 rounded-md font-bold cursor-pointer'
        >
          Pay ${amount}
        </button>

        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </div>
  )
}

export default PaymentForm
