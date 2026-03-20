import { useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react'
import customer from '../../../assets/customer-top.png'
// import customer from '../../../assets/'

const reviews = [
  {
    id: 1,
    name: 'John Doe',
    role: 'UI/UX Designer',
    comment:
      'This service is absolutely amazing. The delivery was fast and support was outstanding.',
    avatar: 'https://i.pravatar.cc/100?img=1',
  },
  {
    id: 2,
    name: 'Sarah Khan',
    role: 'Product Manager',
    comment: 'Highly professional team. Real-time tracking works flawlessly.',
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: 3,
    name: 'Michael Smith',
    role: 'Frontend Developer',
    comment:
      'Very smooth experience. I would definitely recommend this service.',
    avatar: 'https://i.pravatar.cc/100?img=3',
  },
  {
    id: 4,
    name: 'Emma Watson',
    role: 'Marketing Lead',
    comment: 'Customer support is outstanding. Loved the UI design.',
    avatar: 'https://i.pravatar.cc/100?img=4',
  },
  {
    id: 5,
    name: 'David Lee',
    role: 'Business Owner',
    comment: 'Reliable and efficient. My parcels always arrive on time.',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
]

export default function CustomerReview() {
  const [active, setActive] = useState(2)

  const next = () => {
    setActive((prev) => (prev + 1) % reviews.length)
  }

  const prev = () => {
    setActive((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const getCardStyle = (index) => {
    const position = index - active

    // Hide cards outside visible range (desktop max 5)
    if (position < -2 || position > 2) return 'opacity-0 pointer-events-none'

    // Center card
    if (position === 0) return 'z-30 scale-105 -translate-y-8 bg-white'

    // Left & Right near cards
    if (position === -1 || position === 1)
      return 'z-20 translate-y-4 bg-base-300'

    // Far left & far right (half visible effect)
    return 'z-10 translate-y-8 opacity-50 bg-base-300'
  }

  return (
    <div className='py-20 bg-base-200 overflow-hidden'>
      {/* ===== Header Section ===== */}
      <div className='text-center max-w-3xl mx-auto px-4 mb-16'>
        {/* Logo */}
        <img
          // customer-top.png
          // src={reviewLogo}
          src={customer}
          alt='Customer Review Logo'
          className='mx-auto mb-6 h-16'
        />

        {/* Title */}
        <h1 className='text-3xl md:text-4xl font-bold mb-4'>
          What Our Customers Are Saying
        </h1>

        {/* Description */}
        <p className='text-gray-600 text-sm md:text-base'>
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div className='relative flex justify-center items-end gap-6 transition-all duration-500'>
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`
              card w-80 h-96 p-6 shadow-xl
              transition-all duration-500 ease-in-out
              ${getCardStyle(index)}
              
              hidden md:block
              ${Math.abs(index - active) <= 1 ? 'md:block' : ''}
              ${Math.abs(index - active) <= 2 ? 'xl:block' : 'xl:hidden'}
              
              ${index === active ? 'block' : 'hidden md:block'}
            `}
          >
            {/* Quote */}
            <div className='text-5xl text-gray-300 leading-none'>“</div>

            {/* Comment */}
            <p className='mt-4 text-sm text-gray-600 leading-relaxed'>
              {review.comment}
            </p>

            {/* Dotted Line */}
            <div className='border-t-2 border-dotted border-gray-400 my-6'></div>

            {/* Customer */}
            <div className='flex items-center gap-3'>
              <img
                src={review.avatar}
                alt={review.name}
                className='w-12 h-12 rounded-full object-cover'
              />
              <div>
                <h4 className='font-semibold'>{review.name}</h4>
                <p className='text-xs text-gray-500'>{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center gap-6 mt-12'>
        <button onClick={prev} className='bg-white btn btn-circle btn-sm'>
          <ArrowLeft size={18} className='text-black' />
        </button>

        <div className='flex gap-2'>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === active ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button onClick={next} className='btn bg-white btn-circle btn-sm'>
          <ArrowRight size={18} className='text-black' />
        </button>
      </div>
    </div>
  )
}
