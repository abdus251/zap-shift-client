import axios from 'axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
})

const useAxiosSecure = () => {
  const { user, logOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken()
          config.headers.authorization = `Bearer ${token}`
        } else {
          console.log('❌ No user, no token sent')
        }

        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      },
    )

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => {
        console.log('Response:', res.config.url, res.status) // ✅ log response
        return res
      },
      async (error) => {
        console.error('Response error:', error.response?.status)

        const status = error.response?.status

        if (status === 403) {
          navigate('/forbidden')
        }

        if (status === 401) {
          await logOut()
          navigate('/login')
        }

        return Promise.reject(error)
      },
    )

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor)
      axiosSecure.interceptors.response.eject(responseInterceptor)
    }
  }, [user, navigate, logOut])

  return axiosSecure
}

export default useAxiosSecure
