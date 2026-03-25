import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure()

  const {
    data: deliveryStatusCount = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['delivery-status-count'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/delivery/status-count')
      return res.data
    },
  })

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <span className='loading loading-spinner loading-lg text-primary'></span>
      </div>
    )
  }

  // Error state
  if (isError) {
    return <p className='text-red-500 text-center'>Failed to load data</p>
  }

  // Format data
  const formattedData = deliveryStatusCount.map((item) => ({
    ...item,
    status: item.status || 'pending',
  }))

  const getLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'rider_assigned':
        return 'Assigned'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  const chartData = formattedData.map((item) => ({
    name: getLabel(item.status),
    value: item.count,
  }))

  const COLORS = ['#f59e0b', '#3b82f6', '#22c55e'] // pending, assigned, delivered

  const getIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'rider_assigned':
        return '🚚'
      case 'delivered':
        return '✅'
      default:
        return '📦'
    }
  }

  return (
    <div className='space-y-8'>
      <h2 className='text-2xl font-bold'>User Dashboard</h2>
      {/* Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {formattedData.map((item, index) => (
          <div
            key={index}
            className={`card shadow-lg p-6 items-center text-center`}
          >
            <div className='text-4xl mb-3'>{getIcon(item.status)}</div>

            <h2 className='text-lg font-semibold'>{getLabel(item.status)}</h2>

            <p className='text-3xl font-bold mt-2'>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className=' rounded-xl p-6 h-96'>
        <h2 className='text-xl font-bold  mb-4'>Parcel Delivery Overview</h2>
        <ResponsiveContainer width='100%' height={350}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              outerRadius={120}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminDashboard
