import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const email = user?.email

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['completedDeliveries', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/completed-parcels?email=${email}`,
      )
      return res.data
    },
  })

  const calculateEarning = (parcel) => {
    const cost = Number(parcel.deliveryCost)
    return parcel.senderRegion === parcel.receiverRegion
      ? cost * 0.8
      : cost * 0.3
  }

  const { mutateAsync: cashOutParcel } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['completedDeliveries', email])
    },
  })

  const handleCashOut = (parcelId) => {
    Swal.fire({
      title: 'Cash Out?',
      text: 'Do you want to cash out this delivery?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, cash out',
    }).then((result) => {
      if (result.isConfirmed) {
        cashOutParcel(parcelId)
          .then(() => Swal.fire('Success!', 'Parcel cashed out.', 'success'))
          .catch(() => Swal.fire('Error!', 'Failed to cash out.', 'error'))
      }
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Completed Deliveries</h2>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Picked At</th>
              <th>Delivered At</th>
              <th>Fee ($)</th>
              <th>Your Earning ($)</th>
              <th>Cashed At</th> {/* New column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => {
              const pickedAt =
                parcel.history.find((h) => h.status === 'in_transit')
                  ?.timestamp || 'N/A'
              const deliveredAt =
                parcel.history.find((h) => h.status === 'delivered')
                  ?.timestamp || 'N/A'
              const earning = calculateEarning(parcel)
              const cashedAt = parcel.cashoutAt
                ? new Date(parcel.cashoutAt).toLocaleString()
                : 'N/A'

              return (
                <tr key={parcel._id}>
                  <td>{parcel.trackingNumber}</td>
                  <td>{parcel.parcelName}</td>
                  <td>{parcel.senderRegion}</td>
                  <td>{parcel.receiverRegion}</td>
                  <td>
                    {pickedAt !== 'N/A'
                      ? new Date(pickedAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    {deliveredAt !== 'N/A'
                      ? new Date(deliveredAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>{parcel.deliveryCost.toFixed(2)}</td>
                  <td>{earning.toFixed(2)}</td>
                  <td>{cashedAt}</td> {/* Show cashout date */}
                  <td>
                    {!parcel.cashedOut && (
                      <button
                        className='btn btn-sm btn-warning'
                        onClick={() => handleCashOut(parcel._id)}
                      >
                        Cash Out
                      </button>
                    )}
                    {parcel.cashedOut && (
                      <span className='badge badge-success text-green-600'>
                        Cashed
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CompletedDeliveries
// import React from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import useAxiosSecure from '../../../hooks/useAxiosSecure'
// import useAuth from '../../../hooks/useAuth'
// import Swal from 'sweetalert2'

// const CompletedDeliveries = () => {
//   const axiosSecure = useAxiosSecure()
//   const queryClient = useQueryClient()
//   const { user } = useAuth()
//   const email = user?.email

//   const { data: parcels = [], isLoading } = useQuery({
//     queryKey: ['completedDeliveries', email],
//     enabled: !!email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/riders/completed-parcels?email=${email}`,
//       )
//       return res.data
//     },
//   })

//   const calculateEarning = (parcel) => {
//     const cost = Number(parcel.deliveryCost)
//     return parcel.senderRegion === parcel.receiverRegion
//       ? cost * 0.8
//       : cost * 0.3
//   }

//   // Cash out mutation
//   const { mutateAsync: cashOutParcel } = useMutation({
//     mutationFn: async (parcelId) => {
//       const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`)
//       return res.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['completedDeliveries', email])
//     },
//   })

//   const handleCashOut = (parcelId) => {
//     Swal.fire({
//       title: 'Cash Out?',
//       text: 'Do you want to cash out this delivery?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, cash out',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         cashOutParcel(parcelId)
//           .then(() => Swal.fire('Success!', 'Parcel cashed out.', 'success'))
//           .catch(() => Swal.fire('Error!', 'Failed to cash out.', 'error'))
//       }
//     })
//   }

//   if (isLoading) return <div>Loading...</div>

//   return (
//     <div className='p-6'>
//       <h2 className='text-2xl font-bold mb-4'>Completed Deliveries</h2>
//       <div className='overflow-x-auto'>
//         <table className='table'>
//           <thead>
//             <tr>
//               <th>Tracking ID</th>
//               <th>Title</th>
//               <th>From</th>
//               <th>To</th>
//               <th>Picked At</th>
//               <th>Delivered At</th>
//               <th>Fee ($)</th>
//               <th>Your Earning ($)</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {parcels.map((parcel) => {
//               const pickedAt =
//                 parcel.history.find((h) => h.status === 'in_transit')
//                   ?.timestamp || 'N/A'
//               const deliveredAt =
//                 parcel.history.find((h) => h.status === 'delivered')
//                   ?.timestamp || 'N/A'
//               const earning = calculateEarning(parcel)

//               return (
//                 <tr key={parcel._id}>
//                   <td>{parcel.trackingNumber}</td>
//                   <td>{parcel.parcelName}</td>
//                   <td>{parcel.senderRegion}</td>
//                   <td>{parcel.receiverRegion}</td>
//                   <td>
//                     {pickedAt !== 'N/A'
//                       ? new Date(pickedAt).toLocaleString()
//                       : 'N/A'}
//                   </td>
//                   <td>
//                     {deliveredAt !== 'N/A'
//                       ? new Date(deliveredAt).toLocaleString()
//                       : 'N/A'}
//                   </td>
//                   <td>{parcel.deliveryCost.toFixed(2)}</td>
//                   <td>{earning.toFixed(2)}</td>
//                   <td>
//                     {!parcel.cashedOut && (
//                       <button
//                         className='btn btn-sm btn-warning'
//                         onClick={() => handleCashOut(parcel._id)}
//                       >
//                         Cash Out
//                       </button>
//                     )}
//                     {parcel.cashedOut && (
//                       <span className='badge badge-success text-green-600'>
//                         Cashed
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default CompletedDeliveries
