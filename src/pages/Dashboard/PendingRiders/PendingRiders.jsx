import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure()
  const [selectedRider, setSelectedRider] = useState(null)

  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['pending-riders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders?status=pending')
      return res.data
    },
  })

  const handleDecision = async (id, status, email) => {
    const res = await axiosSecure.patch(`/riders/${id}`, {
      status,
      email,
    })

    if (res.data.modifiedCount > 0) {
      Swal.fire({
        icon: 'success',
        title: `Application ${status}`,
      })

      refetch() // reload pending riders
    }
  }

  if (isPending) return <p>Loading...</p>

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold mb-6'>Pending Rider Applications</h2>

      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead className='bg-base-200'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.phone}</td>

                <td className='flex gap-2'>
                  <button
                    className='btn btn-sm btn-info'
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>

                  <button
                    className='btn btn-sm btn-success'
                    onClick={() =>
                      handleDecision(rider._id, 'approved', rider.email)
                    }
                  >
                    Approve
                  </button>

                  <button
                    className='btn btn-sm btn-error'
                    onClick={() =>
                      handleDecision(rider._id, 'cancelled', rider.email)
                    }
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedRider && (
        <dialog open className='modal'>
          <div className='modal-box'>
            <h3 className='text-xl font-bold mb-4'>Rider Details</h3>

            <div className='space-y-2'>
              <p>
                <b>Name:</b> {selectedRider.name}
              </p>
              <p>
                <b>Email:</b> {selectedRider.email}
              </p>
              <p>
                <b>Age:</b> {selectedRider.age}
              </p>
              <p>
                <b>Phone:</b> {selectedRider.phone}
              </p>
              <p>
                <b>Region:</b> {selectedRider.region}
              </p>
              <p>
                <b>District:</b> {selectedRider.district}
              </p>
              <p>
                <b>NID:</b> {selectedRider.nid}
              </p>
              <p>
                <b>Bike Brand:</b> {selectedRider.bikeBrand}
              </p>
              <p>
                <b>Bike Registration:</b> {selectedRider.bikeRegNumber}
              </p>
              <p>
                <b>Status:</b> {selectedRider.status}
              </p>
            </div>

            <div className='modal-action'>
              <button className='btn' onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}

export default PendingRiders
