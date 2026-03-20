// import useAxiosSecure from './useAxiosSecure'

// const useTrackingLogger = () => {
//   const axiosSecure = useAxiosSecure()

//   const logTracking = async ({
//     parcelId,
//     status,
//     details,
//     location,
//     updatedBy,
//   }) => {
//     try {
//       const payload = {
//         parcelId,
//         status,
//         details,
//         location,
//         updatedBy,
//       }
//       await axiosSecure.post('/trackings', payload)
//     } catch (error) {
//       console.error('Failed to log tracking:', error)
//     }
//   }

//   return { logTracking }
// }

// export default useTrackingLogger
