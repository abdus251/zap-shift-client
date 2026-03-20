import React from 'react'

const AboutUs = () => {
  return (
    <div className='bg-base-100 py-10 px-4 md:px-10'>
      {/* Hero Section */}
      <div className='text-center max-w-3xl mx-auto mb-10'>
        <h1 className='text-3xl md:text-4xl font-bold text-primary'>
          About Our Delivery Service
        </h1>
        <p className='mt-4 text-gray-500'>
          We provide fast, secure, and reliable parcel delivery services across
          Bangladesh. Our mission is to make delivery simple, efficient, and
          accessible for everyone.
        </p>
      </div>

      {/* Features Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <div className='card shadow-lg p-6 text-center'>
          <div className='text-4xl mb-3'>🚚</div>
          <h2 className='text-xl font-semibold'>Fast Delivery</h2>
          <p className='text-gray-500 mt-2'>
            Quick and reliable delivery with real-time tracking system.
          </p>
        </div>

        <div className='card shadow-lg p-6 text-center'>
          <div className='text-4xl mb-3'>📦</div>
          <h2 className='text-xl font-semibold'>Secure Packaging</h2>
          <p className='text-gray-500 mt-2'>
            Your parcels are handled with maximum care and safety.
          </p>
        </div>

        <div className='card shadow-lg p-6 text-center'>
          <div className='text-4xl mb-3'>💰</div>
          <h2 className='text-xl font-semibold'>Affordable Pricing</h2>
          <p className='text-gray-500 mt-2'>
            Competitive pricing with no hidden charges.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-12'>
        <div className='stat bg-base-200 rounded-lg p-4'>
          <div className='stat-value text-primary'>10K+</div>
          <div className='stat-title'>Parcels Delivered</div>
        </div>

        <div className='stat bg-base-200 rounded-lg p-4'>
          <div className='stat-value text-primary'>500+</div>
          <div className='stat-title'>Active Riders</div>
        </div>

        <div className='stat bg-base-200 rounded-lg p-4'>
          <div className='stat-value text-primary'>64</div>
          <div className='stat-title'>Districts Covered</div>
        </div>

        <div className='stat bg-base-200 rounded-lg p-4'>
          <div className='stat-value text-primary'>24/7</div>
          <div className='stat-title'>Support</div>
        </div>
      </div>

      {/* Mission Section */}
      <div className='bg-base-200 p-8 rounded-xl text-center max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>Our Mission</h2>
        <p className='text-gray-600'>
          Our goal is to revolutionize the delivery system in Bangladesh by
          integrating technology, efficiency, and customer satisfaction. We aim
          to connect people and businesses with seamless logistics solutions.
        </p>
      </div>
    </div>
  )
}

export default AboutUs
