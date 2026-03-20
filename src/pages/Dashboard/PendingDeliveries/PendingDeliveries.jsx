import React from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['rider-parcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`)
      console.log('PARCELS:', res.data)
      return res.data
    },
  })

  // Mutation for updating parcel status
  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        deliveryStatus: status, // ✅ match backend
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rider-parcels', user?.email],
      })
      queryClient.invalidateQueries({
        queryKey: ['completedDeliveries'],
      })
    },
  })

  const handleStatusUpdate = (parcelId, newStatus) => {
    if (!newStatus) {
      console.warn('No status provided for parcel', parcelId)
      return
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Mark parcel as ${newStatus.replace('_', ' ')}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ parcelId, status: newStatus })
          .then((res) => {
            console.log('Update Success:', res)
            Swal.fire('Updated!', 'Parcel status has been updated.', 'success')
          })
          .catch((err) => {
            console.error(err)
            Swal.fire('Error!', 'Failed to update status.', 'error')
          })
      }
    })
  }

  if (isLoading) {
    return (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>Pending Deliveries</h2>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Pending Deliveries</h2>

      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>Receiver</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingNumber}</td>
                <td>{parcel.parcelName}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.receiverContact}</td>
                <td>{parcel.receiverAddress}</td>
                <td>{parcel.deliveryStatus}</td>

                <td>
                  {parcel.deliveryStatus === 'rider_assigned' && (
                    <button
                      disabled={isPending}
                      onClick={() =>
                        handleStatusUpdate(parcel._id, 'in_transit')
                      }
                      className='btn btn-sm btn-primary text-black'
                    >
                      {isPending ? 'Updating...' : 'Mark as Picked Up'}
                    </button>
                  )}

                  {parcel.deliveryStatus === 'in_transit' && (
                    <button
                      disabled={isPending}
                      onClick={() =>
                        handleStatusUpdate(parcel._id, 'delivered')
                      }
                      className='btn btn-sm btn-success'
                    >
                      {isPending ? 'Updating...' : 'Delivered'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingDeliveries
