import React from 'react'
import Marquee from 'react-fast-marquee'

import amazon from '../../../assets/brands/amazon.png'
import casio from '../../../assets/brands/casio.png'
import moonstar from '../../../assets/brands/moonstar.png'
import start from '../../../assets/brands/star.png'
import randstad from '../../../assets/brands/randstad.png'
import people from '../../../assets/brands/start_people.png'

const logos = [amazon, casio, moonstar, start, randstad, people]

export const ClientLogosMarquee = () => {
  return (
    <section className='py-16 bg-base-100 overflow-hidden'>
      <div className='container mx-auto px-4'>
        {/* Heading */}
        <div className='text-center mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            We have helped thousands of sales teams{' '}
          </h2>
        </div>

        {/* Marquee */}
        <Marquee speed={50} pauseOnHover gradient={false} className='mt-8'>
          {logos.map((logo, index) => (
            <div key={index} className='mx-[50px]'>
              {/* 50px left + 50px right = 100px total gap */}
              <img
                src={logo}
                alt='client logo'
                className='h-6 w-auto object-contain opacity-70 hover:opacity-100 hover:scale-105 transition duration-300'
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
