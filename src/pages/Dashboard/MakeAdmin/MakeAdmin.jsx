import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { FaSearch } from 'react-icons/fa'
const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure()
  //   const queryClient = useQueryClient()

  const [searchText, setSearchText] = useState('')

  const {
    data: users = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['search-users', searchText],
    enabled: searchText.length > 0, // only run when user types
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search?email=${searchText}`)
      return res.data
    },
  })

  // Make Admin with confirmation
  const handleMakeAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be promoted to Admin!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make Admin',
      cancelButtonText: 'Cancel',
    })

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/${id}/role`, {
          role: 'admin',
        })

        if (res.data?.result?.modifiedCount > 0) {
          Swal.fire({
            icon: 'success',
            title: 'User promoted to Admin',
          })
          refetch()
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.message,
        })
      }
    }
  }

  // Remove Admin with confirmation
  const handleRemoveAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This admin will be demoted to user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove Admin',
      cancelButtonText: 'Cancel',
    })

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/${id}/role`, {
          role: 'user',
        })

        if (res.data?.result?.modifiedCount > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Admin removed',
          })
          refetch()
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.message,
        })
      }
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4 text-black'>Make Admins</h2>

      {/* Search */}
      <div className='relative w-full max-w-md mb-6'>
        <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />

        <input
          type='text'
          placeholder='Search user by email...'
          className='input input-bordered w-full pl-10'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        {/* When user has not typed anything */}
        {searchText === '' ? (
          <p className='text-center text-gray-500 py-2'>
            Start typing to search users
          </p>
        ) : isPending ? (
          <div className='flex justify-center p-10'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : users.length === 0 ? (
          <p className='text-center text-gray-500 py-10'>No users found</p>
        ) : (
          <table className='table table-zebra'>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.role === 'admin'
                          ? 'badge-success'
                          : 'badge-neutral'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className='btn btn-error btn-sm'
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className='btn btn-primary btn-sm text-black'
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MakeAdmin
