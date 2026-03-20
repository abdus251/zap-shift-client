import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../../hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router'
import SocialLogin from '../SocialLogin/SocialLogin'
import axios from 'axios'
// import { email } from 'zod'
import useAxios from '../../../hooks/useAxios'

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [profilePic, setProfilePic] = useState('')
  const axiosInstance = useAxios()
  const { createUser, updateUserProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = (data) => {
    console.log(data)

    createUser(data.email, data.password).then(async (result) => {
      console.log(result.user)

      // update userInfo in the database
      const userInfo = {
        email: data.email,
        role: 'user', // default role is user
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      }

      const userRes = await axiosInstance.post('/users', userInfo)
      console.log(userRes.data)
    })
    // update user profile in firebase
    const userProfile = {
      displayName: data.name,
      photoURL: profilePic,
    }

    updateUserProfile(userProfile)
      .then(() => {
        console.log('user profile updated successfully')
        navigate(from)
      })
      .catch((error) => {
        console.log(error)
      })

      .catch((error) => {
        console.error(error)
      })
  }

  const handleImageUpload = async (e) => {
    const image = e.target.files[0]
    console.log(image)

    const formData = new FormData()
    formData.append('image', image)

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
    const res = await axios.post(imageUploadUrl, formData)

    setProfilePic(res.data.data.url)
  }

  return (
    <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
      <div className='card-body'>
        <h1 className='text-3xl font-bold text-center'>Create Account</h1>
      </div>
      <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
        <div className='card-body'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className='fieldset'>
              {/* name field */}
              <label className='label'>Name</label>
              <input
                type='text'
                {...register('name', { required: true })}
                className='input'
                placeholder='Name'
              />
              {/* profile pictures field */}
              <label className='label'>Your Picture</label>
              <input
                type='file'
                onChange={handleImageUpload}
                className='input'
                placeholder='Your Profile Picture'
              />

              {/* email field */}
              <label className='label'>Email</label>
              <input
                type='email'
                {...register('email', { required: true })}
                className='input'
                placeholder='Email'
              />
              {errors.email?.type === 'required' && (
                <p className='text-red-600'>Email is required</p>
              )}
              {/* password field */}
              <label className='label'>Password</label>
              <input
                type='password'
                {...register('password', { required: true, minLength: 6 })}
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
              <button className='btn btn-primary text-black mt-4'>
                Register
              </button>
            </fieldset>
            <p>
              <small>
                Already have an account?{' '}
                <Link
                  className='btn btn-link text-orange-500 font-bold'
                  to='/login'
                >
                  Login
                </Link>{' '}
              </small>
            </p>
            <SocialLogin />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
