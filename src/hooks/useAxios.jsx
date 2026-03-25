import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: `https://zap-shift-server-8nko.onrender.com`,
})

const useAxios = () => {
  return axiosInstance
}

export default useAxios
