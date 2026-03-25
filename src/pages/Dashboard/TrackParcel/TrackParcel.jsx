import React, { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'

const TrackParcel = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [search, setSearch] = useState('')

  const statusSteps = [
    'created',
    'paid',
    'rider_assigned',
    'in_transit',
    'delivered',
  ]

  // ✅ FETCH PARCEL
  const {
    data: parcel,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['parcel', search],
    enabled: !!search,
    queryFn: async () => {
      console.log('FETCHING:', search) // ✅ DEBUG

      const res = await axios.get(
        `http://localhost:5000/parcels/track/${search}`,
      )

      return res.data
    },
    retry: false,
  })

  console.log('TRACKED PARCEL:', parcel)
  console.log('STATUS:', parcel?.deliveryStatus)

  // ✅ HANDLE TRACK
  const handleTrack = (e) => {
    e.preventDefault()

    const trimmed = trackingNumber.trim()

    console.log('INPUT VALUE:', trimmed) // ✅ DEBUG

    if (!trimmed || !trimmed.startsWith('PARCEL-')) {
      Swal.fire('Error', 'Enter valid tracking number (PARCEL-xxx)', 'error')
      return
    }

    setSearch(trimmed) // ✅ ONLY valid value goes
  }

  // ✅ GET CURRENT STEP FROM HISTORY

  const getCurrentStep = () => {
    if (!parcel?.history?.length) return -1

    const lastStatus =
      parcel.history[parcel.history.length - 1]?.status || 'created'

    return statusSteps.indexOf(lastStatus)
  }
  const currentStep = getCurrentStep()

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>Track Your Parcel</h1>

      {/* INPUT */}
      <form onSubmit={handleTrack} className='flex gap-2 mb-6'>
        <input
          type='text'
          placeholder='Enter Tracking Number (PARCEL-xxxx)'
          className='input input-bordered flex-1'
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button className='btn btn-primary'>Track</button>
      </form>

      {/* LOADING */}
      {isLoading && <p className='text-center'>Loading...</p>}

      {/* ERROR */}
      {isError && (
        <p className='text-center text-red-500'>Parcel not found ❌</p>
      )}

      {/* RESULT */}
      {parcel && (
        <div className='card p-6 shadow-lg'>
          <h2 className='text-xl font-bold mb-4'>{parcel.parcelName}</h2>

          {/* ✅ PROGRESS */}
          <ul className='steps steps-horizontal w-full mb-6'>
            {statusSteps.map((step, index) => (
              <li
                key={step}
                className={`step ${index <= currentStep ? 'step-primary' : ''}`}
              >
                {step.replace('_', ' ').toUpperCase()}
              </li>
            ))}
          </ul>

          {/* INFO */}
          <div className='space-y-2'>
            <p>
              <b>Tracking:</b> {parcel.trackingNumber}
            </p>
            <p>
              <b>Status:</b> {parcel.deliveryStatus}
            </p>
            <p>
              <b>Payment:</b> {parcel.paymentStatus}
            </p>
            <p>
              <b>Cost:</b> ৳ {parcel.deliveryCost}
            </p>
          </div>

          {/* HISTORY */}
          <div className='mt-6'>
            <h3 className='font-semibold mb-2'>History</h3>

            {parcel.history?.length > 0 ? (
              <ul className='steps steps-vertical'>
                {parcel.history.map((h, i) => (
                  <li key={i} className='step step-primary'>
                    {h.status.toUpperCase()} -{' '}
                    {new Date(h.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackParcel
