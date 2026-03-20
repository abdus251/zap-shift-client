import { MdArrowOutward } from 'react-icons/md'

import React from 'react'

const Faq = () => {
  return (
    <div className='py-20 bg-base-200 overflow-hidden'>
      <h2 className='text-3xl font-bold mb-4 text-center'>
        Frequently Asked Questions (FAQ)
      </h2>
      <p className=' text-center pb-10'>
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with
        ease!
      </p>
      <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
        <input type='radio' name='my-accordion-2' defaultChecked />
        <div className='collapse-title font-semibold'>
          How do I create an account?
        </div>
        <div className='collapse-content text-sm'>
          Click the "Sign Up" button in the top right corner and follow the
          registration process.
        </div>
      </div>
      <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
        <input type='radio' name='my-accordion-2' />
        <div className='collapse-title font-semibold'>
          I forgot my password. What should I do?
        </div>
        <div className='collapse-content text-sm'>
          Click on "Forgot Password" on the login page and follow the
          instructions sent to your email.
        </div>
      </div>
      <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
        <input type='radio' name='my-accordion-2' />
        <div className='collapse-title font-semibold'>
          How do I update my profile information?
        </div>
        <div className='collapse-content text-sm'>
          Go to "My Account" settings and select "Edit Profile" to make changes.
        </div>
      </div>

      <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
        <input type='radio' name='my-accordion-2' />
        <div className='collapse-title font-semibold'>
          How do I update my profile information?
        </div>
        <div className='collapse-content text-sm'>
          Go to "My Account" settings and select "Edit Profile" to make changes.
        </div>
      </div>
      <div className='collapse collapse-arrow bg-base-100 border border-base-300'>
        <input type='radio' name='my-accordion-2' />
        <div className='collapse-title font-semibold'>
          How do I update my profile information?
        </div>
        <div className='collapse-content text-sm'>
          Go to "My Account" settings and select "Edit Profile" to make changes.
        </div>
      </div>
      <div className='flex justify-center mt-6'>
        <div className='flex items-center '>
          {/* Main Button */}
          <button className='btn btn-primary text-black'>See More FAQ's</button>

          {/* Arrow Button */}
          <button className='btn bg-black hover:bg-primary  btn-circle'>
            <MdArrowOutward className='w-5 h-5 text-primary hover:text-black' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Faq
