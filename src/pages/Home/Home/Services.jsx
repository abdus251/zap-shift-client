import { servicesData } from '../components/serivcesData'
import ServiceCard from '../Services/ServiceCard'

// import { servicesData } from './servicesData'

export const Services = () => {
  return (
    <section className='py-16 bg-base-200'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Our Services</h2>
          <p className='text-gray-600'>
            Enjoy fast reliable parcel delivery with real time tracking and zero
            hassle. From personal packages to business shipments — we deliver on
            time. Every time.
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {servicesData.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
