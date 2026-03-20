import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'

const AssignRider = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Load parcels
  const { data: parcels = [] } = useQuery({
    queryKey: ['paidParcels'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels?paymentStatus=paid')
      return res.data.data
    },
  })

  // Load riders based on district
  const { data: riders = [] } = useQuery({
    queryKey: ['paidParcels'],
    queryFn: async () => {
      const res = await axiosSecure.get(
        '/parcels?paymentStatus=paid&deliveryStatus=created',
      )
      return res.data.data
    },
  })

  const handleOpenModal = (parcel) => {
    console.log('Opening modal for parcel:', parcel)
    setSelectedParcel(parcel)
    setModalOpen(true)
  }

  const handleAssignRider = async (rider) => {
    const result = await Swal.fire({
      title: 'Assign this rider?',
      text: `Parcel will be assigned to ${rider.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Assign Rider',
    })

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(
          `/parcels/assign-rider/${selectedParcel._id}`,
          {
            riderId: rider._id,
            riderName: rider.name,
            riderEmail: rider.email,
          },
        )

        if (res.data.success) {
          await Swal.fire({
            title: 'Assigned!',
            text: res.data.message,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          })

          // ✅ Important: invalidate so React Query refetches fresh data
          queryClient.invalidateQueries({
            queryKey: ['paidParcels'],
          })

          // Reset modal state
          setModalOpen(false)
          setSelectedParcel(null)
        } else {
          Swal.fire(
            'Error!',
            res.data.message || 'No rider was assigned.',
            'error',
          )
        }
      } catch (error) {
        console.error(error)
        Swal.fire('Error!', 'Failed to assign rider.', 'error')
      }
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6'>Assign Rider</h2>

      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>#</th>
            <th>Tracking ID</th>
            <th>Title</th>
            <th>Receiver</th>
            <th>Service Center</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>

              <td>{parcel.trackingNumber}</td>
              <td>{parcel.parcelName}</td>
              <td>{parcel.receiverName}</td>

              <td>{parcel.receiverServiceCenter}</td>

              <td>
                {parcel.parcelStatus === 'assigned' ? (
                  <button className='btn btn-success btn-sm' disabled>
                    Assigned ✓
                  </button>
                ) : (
                  <button
                    className='btn btn-primary btn-sm text-black'
                    onClick={() => handleOpenModal(parcel)}
                  >
                    Assign Rider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {/* Modal */}
      {modalOpen && (
        <dialog className='modal modal-open'>
          <div className='modal-box max-w-3xl'>
            <h3 className='font-bold text-lg mb-4'>
              Assign Riders for Parcel: {selectedParcel.parcelName}
            </h3>

            {riders.length === 0 ? (
              <p className='text-red-500'>
                No riders available in this district
              </p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='table table-zebra'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Bike Info</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {riders.map((rider, index) => (
                      <tr key={rider._id}>
                        <td>{index + 1}</td>
                        <td>{rider.email}</td>
                        <td>{rider.name}</td>
                        <td>{rider.phone}</td>
                        <td>{rider.bikeInfo || rider.bikeNumber}</td>
                        <td>
                          <button
                            className='btn btn-success btn-sm'
                            onClick={() => handleAssignRider(rider)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className='modal-action'>
              <button className='btn' onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default AssignRider
