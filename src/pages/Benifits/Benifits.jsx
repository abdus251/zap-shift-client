// Sample images for each benefit
import trackingImg from '../../assets/benifits/box_call.png'
import liveTrackingImg from '../../assets/benifits/live-tracking.png'
import safeDeliveryImg from '../../assets/benifits/box_call.png'

// Benefits data
const benefits = [
  {
    id: 1,
    title: 'Live Parcel Tracking',
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: trackingImg,
  },
  {
    id: 2,
    title: '100% Safe Delivery',
    description:
      'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
    image: liveTrackingImg,
  },
  {
    id: 3,
    title: '24/7 Call Center Support',
    description:
      'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
    image: safeDeliveryImg,
  },
]

const Benefits = () => {
  return (
    <div className='py-20 bg-base-200'>
      {/* Heading */}
      <div className='container mx-auto px-4 text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold'>Why Choose Us</h2>
      </div>

      {/* Cards Wrapper */}
      <div className='container mx-auto px-4 space-y-8'>
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className='card bg-base-100 shadow-lg hover:shadow-xl transition duration-300 w-full flex flex-col md:flex-row'
          >
            {/* Image */}
            <figure className='p-6 flex justify-center md:justify-start'>
              <img
                src={benefit.image}
                alt={benefit.title}
                className='h-24 md:h-32 w-auto object-contain'
              />
            </figure>

            {/* Divider (only desktop) */}
            <div className='hidden md:block border-l-2 border-dashed  mx-4'></div>

            {/* Content */}
            <div className='card-body text-center md:text-left'>
              <h3 className='card-title text-xl md:text-2xl justify-center md:justify-start'>
                {benefit.title}
              </h3>
              <p className='text-gray-600 text-sm md:text-base'>
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Benefits
