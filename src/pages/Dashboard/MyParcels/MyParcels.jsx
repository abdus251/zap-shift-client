import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { format } from 'date-fns'

const MyParcels = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  // Fetch parcels with React Query
  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['my-parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`)
      console.log('Fetched parcels:', res.data) // should log { success: true, data: [...] }
      return res.data || []
    },
  })

  if (isLoading) return <p>Loading parcels...</p>

  // View parcel details
  const onView = (parcel) => {
    Swal.fire({
      title: `<strong>Parcel: ${parcel.parcelName}</strong>`,
      html: `
        <p><strong>Type:</strong> ${parcel.parcelType}</p>
        <p><strong>Sender:</strong> ${parcel.senderName} (${parcel.senderContact})</p>
        <p><strong>Receiver:</strong> ${parcel.receiverName} (${parcel.receiverContact})</p>
        <p><strong>Created At:</strong> ${format(new Date(parcel.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
        <p><strong>Delivery Cost:</strong> ৳${parcel.deliveryCost}</p>
        <p><strong>Payment Status:</strong> ${parcel.paymentStatus}</p>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Close',
    })
  }

  // Pay parcel
  const handlePay = (id) => {
    Swal.fire('Payment', `Redirect to payment for parcel ID: ${id}`, 'info')
    navigate(`/dashboard/payment/${id}`)
  }

  // Delete parcel
  const handleDelete = async (parcel) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete parcel "${parcel.parcelName}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/parcels/${parcel._id}`)
        Swal.fire('Deleted!', 'Parcel has been deleted.', 'success')
        // Refetch after deletion
        refetch()
      } catch (error) {
        console.error(error)
        Swal.fire('Error!', 'Failed to delete parcel.', 'error')
      }
    }
  }

  return (
    <div className='overflow-x-auto bg-base-100 shadow-lg rounded-xl p-4'>
      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {parcels.length === 0 ? (
            <tr>
              <td colSpan='7' className='text-center py-6'>
                No parcels found
              </td>
            </tr>
          ) : (
            parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                {/* Title */}
                <td className='max-w-45 truncate'>{parcel.parcelName}</td>
                {/* Parcel Type */}
                <td>
                  <span
                    className={`badge whitespace-nowrap ${
                      parcel.parcelType === 'document'
                        ? 'badge-info'
                        : 'badge-warning'
                    }`}
                  >
                    {parcel.parcelType === 'document'
                      ? 'Document'
                      : 'Non-Document'}
                  </span>
                </td>
                {/* Created At */}
                <td>
                  {format(new Date(parcel.createdAt), 'dd MMM yyyy, hh:mm a')}
                </td>
                {/* Cost */}
                <td>৳ {parcel.deliveryCost}</td>
                {/* Payment Status */}
                <td>
                  <span
                    className={`badge ${
                      parcel.paymentStatus === 'paid'
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {parcel.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                {/* Actions */}
                <td className='space-x-2 space-y-1 lg:space-y-0'>
                  <button
                    onClick={() => onView(parcel)}
                    className='btn btn-sm btn-outline btn-info'
                  >
                    View
                  </button>

                  {parcel.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => handlePay(parcel._id)}
                      className='btn btn-sm btn-outline btn-primary text-black'
                    >
                      Pay
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(parcel)}
                    className='btn btn-sm btn-outline btn-error'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MyParcels
