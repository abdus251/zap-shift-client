import { Link, useNavigate } from 'react-router'
import { FaLock } from 'react-icons/fa'

const Forbidden = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200 px-4'>
      <div className='text-center max-w-md'>
        <div className='flex justify-center mb-6'>
          <div className='bg-error/10 p-6 rounded-full'>
            <FaLock className='text-error text-5xl' />
          </div>
        </div>

        <h1 className='text-5xl font-bold text-error mb-2'>403</h1>

        <h2 className='text-2xl font-semibold mb-3'>Access Forbidden</h2>

        <p className='text-gray-500 mb-6'>
          Sorry! You don't have permission to access this page. Please contact
          the administrator if you think this is a mistake.
        </p>

        <div className='flex justify-center gap-4'>
          <button onClick={() => navigate(-1)} className='btn btn-outline'>
            Go Back
          </button>

          <Link to='/' className='btn btn-primary text-black'>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Forbidden
