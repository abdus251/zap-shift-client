import React from 'react'

const DeliveryLoader = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
      {/* Title */}
      <h2 className='text-xl font-semibold text-primary'>
        Preparing Your Parcels...
      </h2>

      {/* Progress Bar */}
      <progress className='progress progress-primary w-72'></progress>

      {/* Animated Steps */}
      <div className='flex items-center gap-2 text-sm text-gray-500'>
        <span className='loading loading-dots loading-sm text-primary'></span>
        <p>Assigning rider & updating delivery status</p>
      </div>

      {/* Icon (Parcel Feel) */}
      <div className='text-4xl animate-bounce'>📦</div>
    </div>
  )
}

export default DeliveryLoader
