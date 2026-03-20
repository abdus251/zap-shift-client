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

    // ✅ SweetAlert Confirmation
    const confirmResult = await Swal.fire({
      title: 'Confirm Payment?',
      text: `You are about to pay $${amount}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Pay Now',
      cancelButtonText: 'Cancel',
    })

    // ❌ If user cancels → STOP here
    if (!confirmResult.isConfirmed) {
      return
    }

    // ✅ Continue payment process
    const card = elements.getElement(CardElement)
    if (!card) return

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })

    if (error) {
      setError(error.message)
    } else {
      setError('')
      console.log('[PaymentMethod]', paymentMethod)

      const res = await axiosSecure.post('/create-payment-intent', {
        amountInCents,
        parcelId,
      })

      const clientSecret = res.data.clientSecret

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded!')
        const transactionId = result.paymentIntent.id

        const paymentData = {
          parcelId,
          email: user?.email,
          amount: amount,
          transactionId: transactionId,
          paymentMethod: result.paymentIntent.payment_method_types,
        }

        const paymentRes = await axiosSecure.post('/payments', paymentData)

        if (paymentRes.data.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            html: `<strong>Transaction ID:</strong><code>${transactionId}</code>`,
            confirmButtonText: 'Go to My Parcels',
          })

          navigate('/dashboard/myParcels')
        }
      }
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
