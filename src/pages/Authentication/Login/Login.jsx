import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import SocialLogin from '../SocialLogin/SocialLogin'
import useAuth from '../../../hooks/useAuth'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(() => {
        navigate(from, { replace: true })
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
      <div className='card-body'>
        <h1 className='text-3xl font-bold text-center'>Please Login </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className='fieldset'>
            <label className='label'>Email</label>
            <input
              type='email'
              {...register('email')}
              className='input'
              placeholder='Email'
            />

            <label className='label'>Password</label>
            <input
              type='password'
              {...register('password', {
                required: true,
                minLength: 6,
              })}
              className='input'
              placeholder='Password'
            />
            {errors.password?.type === 'required' && (
              <p className='text-red-600'>Password is required</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className='text-red-600'>
                Password must be at least 6 characters
              </p>
            )}
            <div>
              <a className='link link-hover'>Forgot password?</a>
            </div>
            <button className='btn btn-neutral mt-4'>Login</button>
          </fieldset>
          <p>
            <small>
              Don't have an account?
              <Link
                state={{ from }}
                className='btn btn-link font-bold text-orange-500'
                to='/register'
              >
                Register
              </Link>{' '}
            </small>
          </p>
          <SocialLogin />
        </form>
      </div>
    </div>
  )
}

export default Login
