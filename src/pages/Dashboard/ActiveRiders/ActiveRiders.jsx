import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure()
  const [search, setSearch] = useState('')

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['activeRiders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders?status=approved')
      return res.data
    },
  })

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This rider will be deactivated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
    })

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/${id}`, {
        status: 'deactivated',
      })

      if (res.data.modifiedCount > 0) {
        Swal.fire('Success!', 'Rider deactivated successfully', 'success')
        refetch()
      }
    }
  }

  const filteredRiders = riders.filter((rider) =>
    rider.name?.toLowerCase().includes(search.toLowerCase()),
  )

  if (isLoading) return <p className='text-center'>Loading...</p>

  return (
    <div className='p-6'>
      <h2 className='text-3xl font-bold mb-6'>Active Riders</h2>

      {/* Search */}
      <input
        type='text'
        placeholder='Search rider by name...'
        className='input input-bordered mb-5 w-full max-w-md'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='table w-full'>
          <thead className='bg-base-200'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRiders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.phone}</td>

                {/* Status */}
                <td>
                  <span className='badge badge-success'>{rider.status}</span>
                </td>

                {/* Action */}
                <td>
                  <button
                    onClick={() => handleDeactivate(rider._id)}
                    className='btn btn-sm btn-error'
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRiders.length === 0 && (
          <p className='text-center py-5'>No riders found</p>
        )}
      </div>
    </div>
  )
}

export default ActiveRiders
