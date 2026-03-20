import BangladeshMap from './BangladeshMap'
import { useLoaderData } from 'react-router'

const Coverage = () => {
  const serviceCenters = useLoaderData()

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      {/* Title */}
      <h1 className='text-4xl font-bold text-center mb-6'>
        We Are Available in 64 Districts
      </h1>

      {/* Map */}
      <BangladeshMap serviceCenters={serviceCenters} />
    </div>
  )
}

export default Coverage
