import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure()

  // 🔹 Fetch status count
  const { data: statusCount = {}, isLoading } = useQuery({
    queryKey: ['rider-status-count'],
    queryFn: async () => {
      const res = await axiosSecure.get('/rider/status-count')
      return res.data
    },
  })

  if (isLoading) {
    return <div className='p-6'>Loading dashboard...</div>
  }

  // 🔹 Prepare chart data
  const data = [
    { name: 'Assigned', value: statusCount.rider_assigned || 0 },
    { name: 'In Transit', value: statusCount.in_transit || 0 },
    { name: 'Delivered', value: statusCount.delivered || 0 },
  ]

  const COLORS = ['#facc15', '#38bdf8', '#22c55e']

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold'>Rider Dashboard</h2>

      {/* 🔹 Status Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-yellow-100 p-6 rounded-xl shadow'>
          <h3 className='text-lg font-semibold'>Assigned</h3>
          <p className='text-3xl font-bold'>
            {statusCount.rider_assigned || 0}
          </p>
        </div>

        <div className='bg-blue-100 p-6 rounded-xl shadow'>
          <h3 className='text-lg font-semibold'>In Transit</h3>
          <p className='text-3xl font-bold'>{statusCount.in_transit || 0}</p>
        </div>

        <div className='bg-green-100 p-6 rounded-xl shadow'>
          <h3 className='text-lg font-semibold'>Delivered</h3>
          <p className='text-3xl font-bold'>{statusCount.delivered || 0}</p>
        </div>
      </div>

      {/* 🔹 Pie Chart */}
      <div className='bg-base-200 p-6 rounded-xl shadow'>
        <h3 className='text-xl font-bold mb-4'>Delivery Status Overview</h3>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                outerRadius={110}
                dataKey='value'
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RiderDashboard
