'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'

const UpdateProfile = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    bikeBrand: '',
    bikeRegNumber: '',
  })

  // Fetch user profile
  const {
    isLoading,
    isError,
    data: profile,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/profile') // your backend endpoint
      return res.data
    },
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        region: data.region || '',
        bikeBrand: data.bikeBrand || '',
        bikeRegNumber: data.bikeRegNumber || '',
      })
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.put('/users/profile', updatedData)
      return res.data
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Profile updated successfully!',
        timer: 1500,
        showConfirmButton: false,
      })
      queryClient.invalidateQueries(['userProfile'])
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Update failed!',
        text: error.response?.data?.message || 'Something went wrong',
      })
    },
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <span className='loading loading-spinner loading-lg text-primary'></span>
      </div>
    )
  }

  if (isError) {
    return (
      <p className='text-red-500 text-center'>Failed to load profile data.</p>
    )
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Update Profile</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name */}
        <div className='form-control'>
          <label className='label'>Name</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Your Name'
            className='input input-bordered w-full'
            required
          />
        </div>

        {/* Email */}
        <div className='form-control'>
          <label className='label'>Email</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Your Email'
            className='input input-bordered w-full'
            required
          />
        </div>

        {/* Phone */}
        <div className='form-control'>
          <label className='label'>Phone</label>
          <input
            type='text'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Phone Number'
            className='input input-bordered w-full'
          />
        </div>

        {/* Region */}
        <div className='form-control'>
          <label className='label'>Region</label>
          <input
            type='text'
            name='region'
            value={formData.region}
            onChange={handleChange}
            placeholder='Region'
            className='input input-bordered w-full'
          />
        </div>

        {/* Bike Brand */}
        <div className='form-control'>
          <label className='label'>Bike Brand</label>
          <input
            type='text'
            name='bikeBrand'
            value={formData.bikeBrand}
            onChange={handleChange}
            placeholder='Bike Brand'
            className='input input-bordered w-full'
          />
        </div>

        {/* Bike Registration Number */}
        <div className='form-control'>
          <label className='label'>Bike Registration Number</label>
          <input
            type='text'
            name='bikeRegNumber'
            value={formData.bikeRegNumber}
            onChange={handleChange}
            placeholder='Bike Number'
            className='input input-bordered w-full'
          />
        </div>

        <button
          type='submit'
          className='btn btn-primary w-full'
          disabled={updateProfileMutation.isLoading}
        >
          {updateProfileMutation.isLoading ? (
            <span className='loading loading-spinner loading-sm'></span>
          ) : (
            'Update Profile'
          )}
        </button>
      </form>
    </div>
  )
}

export default UpdateProfile
