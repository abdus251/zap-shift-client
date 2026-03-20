import { useMemo, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useLoaderData } from 'react-router'
import Swal from 'sweetalert2'

const BeARider = () => {
  const { user } = useAuth()
  const serviceCenters = useLoaderData()

  const regions = [...new Set(serviceCenters.map((c) => c.region))]

  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const districts = useMemo(() => {
    if (!selectedRegion) return []
    return [
      ...new Set(
        serviceCenters
          .filter((c) => c.region === selectedRegion)
          .map((c) => c.district),
      ),
    ]
  }, [selectedRegion, serviceCenters])

  const axiosSecure = useAxiosSecure()

  const [formData, setFormData] = useState({
    age: '',
    phone: '',
    nid: '',
    bikeBrand: '',
    bikeRegNumber: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setSelectedRegion('')
    setSelectedDistrict('')
    setFormData({
      age: '',
      phone: '',
      nid: '',
      bikeBrand: '',
      bikeRegNumber: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const riderData = {
      name: user?.displayName,
      email: user?.email,
      region: selectedRegion,
      district: selectedDistrict,
      ...formData,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    }

    try {
      const res = await axiosSecure.post('/riders', riderData)

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted',
          text: 'Your application to be a rider has been submitted successfully!',
        })

        resetForm()
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Become A Rider</h2>

      <form onSubmit={handleSubmit} className='grid gap-4'>
        {/* Name */}
        <input
          type='text'
          value={user?.displayName || ''}
          readOnly
          className='input input-bordered w-full'
        />

        {/* Email */}
        <input
          type='email'
          value={user?.email || ''}
          readOnly
          className='input input-bordered w-full'
        />

        {/* Age */}
        <input
          type='number'
          name='age'
          placeholder='Age'
          required
          value={formData.age}
          onChange={handleChange}
          className='input input-bordered w-full'
        />

        {/* Phone */}
        <input
          type='text'
          name='phone'
          placeholder='Phone Number'
          required
          value={formData.phone}
          onChange={handleChange}
          className='input input-bordered w-full'
        />

        {/* NID */}
        <input
          type='text'
          name='nid'
          placeholder='National ID Card Number'
          required
          value={formData.nid}
          onChange={handleChange}
          className='input input-bordered w-full'
        />

        {/* Region */}
        <select
          value={selectedRegion}
          className='select select-bordered w-full'
          onChange={(e) => {
            setSelectedRegion(e.target.value)
            setSelectedDistrict('')
          }}
          required
        >
          <option value=''>Select Region</option>
          {regions.map((region, i) => (
            <option key={i} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          value={selectedDistrict}
          className='select select-bordered w-full'
          onChange={(e) => setSelectedDistrict(e.target.value)}
          required
        >
          <option value=''>Select District</option>
          {districts.map((district, i) => (
            <option key={i} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Bike Brand */}
        <input
          type='text'
          name='bikeBrand'
          placeholder='Bike Brand'
          required
          value={formData.bikeBrand}
          onChange={handleChange}
          className='input input-bordered w-full'
        />

        {/* Bike Registration */}
        <input
          type='text'
          name='bikeRegNumber'
          placeholder='Bike Registration Number'
          required
          value={formData.bikeRegNumber}
          onChange={handleChange}
          className='input input-bordered w-full'
        />

        <button className='btn btn-primary text-black w-full mt-4'>
          Submit Application
        </button>
      </form>
    </div>
  )
}

export default BeARider
