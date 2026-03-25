import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'
import { useLoaderData, useNavigate } from 'react-router-dom'
import useAuth from '../../../src/hooks/useAuth'
import useAxiosSecure from '../../hooks/useAxiosSecure'

/* ============================= */
/* 🔵 ZOD VALIDATION SCHEMA */
/* ============================= */
const parcelSchema = z.object({
  parcelType: z.enum(['document', 'non-document']),
  parcelName: z.string().min(3, 'Parcel name is required'),
  weight: z.string().optional(),

  senderName: z.string().min(2),
  senderContact: z.string().min(5),
  senderRegion: z.string().min(1),
  senderServiceCenter: z.string().min(1),
  senderAddress: z.string().min(5),
  pickupInstruction: z.string().min(3),

  receiverName: z.string().min(2),
  receiverContact: z.string().min(5),
  receiverRegion: z.string().min(1),
  receiverServiceCenter: z.string().min(1),
  receiverAddress: z.string().min(5),
  deliveryInstruction: z.string().min(3),
})

/* ============================= */
/* 🔵 COMPONENT */
/* ============================= */
const SendParcel = () => {
  const serviceCenters = useLoaderData()
  const { user } = useAuth()

  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(parcelSchema),
  })

  const parcelType = watch('parcelType')
  const senderRegion = watch('senderRegion')
  const receiverRegion = watch('receiverRegion')
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  /* ============================= */
  /* 🔵 FILTER DATA */
  /* ============================= */
  const senderCenters = serviceCenters.filter((c) => c.region === senderRegion)
  const receiverCenters = serviceCenters.filter(
    (c) => c.region === receiverRegion,
  )

  /* ============================= */
  /* 🔵 DELIVERY COST LOGIC */
  /* ============================= */
  const calculateDeliveryCost = (
    type,
    weight,
    senderCenter,
    receiverCenter,
  ) => {
    const sameDistrict = senderCenter?.district === receiverCenter?.district

    let baseCost = 0
    let extraWeightCost = 0
    let outsideExtra = 0

    if (type === 'document') {
      baseCost = sameDistrict ? 60 : 80
    } else if (type === 'non-document') {
      if (weight <= 3) {
        baseCost = sameDistrict ? 110 : 150
      } else {
        const extraKg = weight - 3
        baseCost = sameDistrict ? 110 : 150
        extraWeightCost = extraKg * 40
        if (!sameDistrict) outsideExtra = 40
      }
    }

    const total = baseCost + extraWeightCost + outsideExtra
    return { baseCost, extraWeightCost, outsideExtra, total, sameDistrict }
  }

  /* ============================= */
  /* 🔵 SUBMIT HANDLER */
  /* ============================= */
  const onSubmit = (data) => {
    const senderCenter = serviceCenters.find(
      (c) => c.district === data.senderServiceCenter,
    )

    const receiverCenter = serviceCenters.find(
      (c) => c.district === data.receiverServiceCenter,
    )

    const pricing = calculateDeliveryCost(
      data.parcelType,
      Number(data.weight) || 0,
      senderCenter,
      receiverCenter,
    )

    Swal.fire({
      title: 'Delivery Cost Breakdown',
      html: `
        <div style="text-align:left;font-size:16px">
          <p><b>Parcel Type:</b> ${data.parcelType}</p>
          <p><b>Route:</b> ${pricing.sameDistrict ? 'Within City' : 'Outside City/District'}</p>
          <hr style="margin:10px 0"/>
          <p>Base Cost: ৳${pricing.baseCost}</p>
          ${pricing.extraWeightCost > 0 ? `<p>Extra Weight Charge: ৳${pricing.extraWeightCost}</p>` : ''}
          ${pricing.outsideExtra > 0 ? `<p>Outside District Extra Charge: ৳${pricing.outsideExtra}</p>` : ''}
          <hr style="margin:15px 0"/>
          <p style="font-size:22px;font-weight:bold;color:#16a34a;text-align:center;">
            Total: ৳${pricing.total}
          </p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Edit Parcel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626',
      width: 550,
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          senderEmail: user?.email || 'guest@example.com',
          email: user?.email || null,
          deliveryCost: pricing.total,
          paymentStatus: 'pending',
          parcelStatus: 'created',
          deliveryStatus: 'rider_assigned',
          assignedRiderEmail: null,
          assignedRiderName: null,
          trackingNumber: `PARCEL-${Date.now()}`,
          createdAt: new Date().toISOString(),
          history: [{ status: 'created', timestamp: new Date().toISOString() }],
        }

        console.log('Parcel Data:', parcelData)
        // navigate('/payment', { state: parcelData })
        axiosSecure.post('/parcels', parcelData).then((res) => {
          console.log(res.data)
          if (res.data.insertedId) {
            Swal.fire({
              title: 'Redirecting to Payment...',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            })
            navigate('/dashboard/myParcels')
          }
        })
      }
    })
  }

  const uniqueRegions = [...new Set(serviceCenters.map((c) => c.region))]

  /* ============================= */
  /* 🔵 UI */
  /* ============================= */
  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h2 className='text-3xl font-bold text-center mb-8'>Send a Parcel</h2>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
        {/* Parcel Info */}
        <div className='card bg-base-200 p-6 space-y-4'>
          <h3 className='text-xl font-semibold'>Title</h3>

          <div className='flex gap-6'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                value='document'
                {...register('parcelType')}
                className='radio radio-primary'
              />
              Document
            </label>

            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                value='non-document'
                {...register('parcelType')}
                className='radio radio-primary'
              />
              Non-Document
            </label>
          </div>

          <input
            type='text'
            placeholder='Describe your parcel'
            className='input input-bordered w-full'
            {...register('parcelName')}
          />

          {parcelType === 'non-document' && (
            <input
              type='number'
              placeholder='Weight in kg'
              className='input input-bordered w-full'
              {...register('weight')}
            />
          )}
        </div>

        {/* Sender & Receiver */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Sender */}
          <div className='card bg-base-200 p-6 space-y-4'>
            <h3 className='text-xl font-semibold'>Sender Info</h3>
            <input
              className='input input-bordered w-full'
              placeholder='Name'
              {...register('senderName')}
            />
            <input
              className='input input-bordered w-full'
              placeholder='Contact'
              {...register('senderContact')}
            />

            <select
              className='select select-bordered w-full'
              {...register('senderRegion')}
            >
              <option value=''>Select Region</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className='select select-bordered w-full'
              {...register('senderServiceCenter')}
            >
              <option value=''>Select Service Center</option>
              {senderCenters.map((center, i) => (
                <option key={i} value={center.district}>
                  {center.region} - {center.covered_area.join(', ')}
                </option>
              ))}
            </select>

            <input
              className='input input-bordered w-full'
              placeholder='Address'
              {...register('senderAddress')}
            />
            <textarea
              className='textarea textarea-bordered w-full'
              placeholder='Pickup Instruction'
              {...register('pickupInstruction')}
            />
          </div>

          {/* Receiver */}
          <div className='card bg-base-200 p-6 space-y-4'>
            <h3 className='text-xl font-semibold'>Receiver Info</h3>
            <input
              className='input input-bordered w-full'
              placeholder='Name'
              {...register('receiverName')}
            />
            <input
              className='input input-bordered w-full'
              placeholder='Contact'
              {...register('receiverContact')}
            />

            <select
              className='select select-bordered w-full'
              {...register('receiverRegion')}
            >
              <option value=''>Select Region</option>
              {uniqueRegions.map((region, i) => (
                <option key={i} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              className='select select-bordered w-full'
              {...register('receiverServiceCenter')}
            >
              <option value=''>Select Service Center</option>
              {receiverCenters.map((center, i) => (
                <option key={i} value={center.district}>
                  {center.region} - {center.covered_area.join(', ')}
                </option>
              ))}
            </select>

            <input
              className='input input-bordered w-full'
              placeholder='Address'
              {...register('receiverAddress')}
            />
            <textarea
              className='textarea textarea-bordered w-full'
              placeholder='Delivery Instruction'
              {...register('deliveryInstruction')}
            />
          </div>
        </div>

        {/* Submit */}
        <div className='text-center'>
          <button type='submit' className='btn btn-primary text-black px-10'>
            Submit Parcel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SendParcel
