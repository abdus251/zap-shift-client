'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Swal from 'sweetalert2'

const TrackParcel = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [enabled, setEnabled] = useState(false)

  const statusSteps = ['created', 'rider_assigned', 'delivered']

  // Fetch parcel based on tracking number
  const {
    data: parcel,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['parcel', trackingNumber],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5000/track/${trackingNumber}`,
      )
      return res.data
    },
    enabled,
    retry: false,
  })

  const handleTrack = (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      Swal.fire('Error', 'Please enter a tracking number', 'error')
      return
    }
    setEnabled(true)
    refetch()
  }

  // Helper to get step index
  const getStepIndex = (status) => statusSteps.indexOf(status)

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>Track Your Parcel</h1>

      {/* Tracking input */}
      <form className='flex gap-2 mb-6 justify-center' onSubmit={handleTrack}>
        <input
          type='text'
          placeholder='Enter Tracking Number'
          className='input input-bordered flex-1'
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button type='submit' className='btn btn-primary'>
          Track
        </button>
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center py-6'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
        </div>
      )}

      {/* Error or not found */}
      {isError && enabled && (
        <p className='text-red-500 text-center'>
          Parcel not found or server error.
        </p>
      )}

      {/* Parcel Details */}
      {parcel && (
        <div className='card shadow-lg p-6'>
          <h2 className='text-2xl font-semibold mb-4'>{parcel.parcelName}</h2>

          {/* Delivery Status Progress */}
          <div className='mb-6'>
            <h3 className='font-semibold mb-2'>Delivery Progress:</h3>
            <ul className='steps steps-vertical md:steps-horizontal'>
              {statusSteps.map((step, index) => (
                <li
                  key={index}
                  className={`step ${
                    getStepIndex(parcel.deliveryStatus) >= index
                      ? 'step-primary'
                      : ''
                  }`}
                >
                  {step.replace('_', ' ').toUpperCase()}
                </li>
              ))}
            </ul>
          </div>

          {/* Sender & Receiver Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <h3 className='font-semibold'>Sender Info:</h3>
              <p>{parcel.senderName}</p>
              <p>{parcel.senderContact}</p>
              <p>{parcel.senderServiceCenter}</p>
              <p>{parcel.senderAddress}</p>
            </div>

            <div>
              <h3 className='font-semibold'>Receiver Info:</h3>
              <p>{parcel.receiverName}</p>
              <p>{parcel.receiverContact}</p>
              <p>{parcel.receiverServiceCenter}</p>
              <p>{parcel.receiverAddress}</p>
            </div>
          </div>

          {/* Parcel Info */}
          <div className='mb-4'>
            <h3 className='font-semibold'>Parcel Info:</h3>
            <p>Type: {parcel.parcelType}</p>
            <p>Delivery Cost: ${parcel.deliveryCost}</p>
            <p>Payment Status: {parcel.paymentStatus}</p>
            <p>Parcel Status: {parcel.parcelStatus}</p>
            <p>Delivery Status: {parcel.deliveryStatus}</p>
            <p>Tracking Number: {parcel.trackingNumber}</p>
          </div>

          {/* Assigned Rider */}
          {parcel.assignedRiderName && (
            <div className='mb-4'>
              <h3 className='font-semibold'>Assigned Rider:</h3>
              <p>{parcel.assignedRiderName}</p>
              <p>{parcel.assignedRiderEmail}</p>
            </div>
          )}

          {/* Delivery History */}
          <div>
            <h3 className='font-semibold mb-2'>Delivery History:</h3>
            <ul className='steps steps-vertical'>
              {parcel.history.map((item, index) => (
                <li key={index} className='step step-primary'>
                  {item.status.replace('_', ' ').toUpperCase()} -{' '}
                  {new Date(item.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackParcel
