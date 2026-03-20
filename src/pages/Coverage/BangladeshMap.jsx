import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const customIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

L.Marker.prototype.options.icon = customIcon

// ✅ Fly Component Using useMap()
const FlyToDistrict = ({ district }) => {
  const map = useMap()

  if (district) {
    map.flyTo([district.latitude, district.longitude], 10, {
      duration: 1.5,
    })
  }

  return null
}

const BangladeshMap = ({ serviceCenters }) => {
  const position = [23.685, 90.3563]

  const [search, setSearch] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  // 🔍 Search handler
  const handleSearch = (e) => {
    e.preventDefault()

    if (!search.trim()) return

    const found = serviceCenters.find((center) =>
      center.district.toLowerCase().includes(search.toLowerCase()),
    )

    if (found) {
      setSelectedDistrict(found)
    } else {
      alert('District not found')
    }
  }

  return (
    <div className='space-y-6'>
      {/* 🔎 Search Bar with Go Button */}
      <form
        onSubmit={handleSearch}
        className='flex justify-center items-center gap-2'
      >
        <input
          type='text'
          placeholder='Search district...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='input input-bordered w-full max-w-md'
        />
        <button type='submit' className='btn btn-primary'>
          Go
        </button>
      </form>

      {/* 🗺 Map */}
      <div className='h-[500px] w-full rounded-2xl overflow-hidden shadow-lg'>
        <MapContainer
          center={position}
          zoom={7}
          scrollWheelZoom={true}
          className='h-full w-full'
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* ✅ FlyTo Component */}
          <FlyToDistrict district={selectedDistrict} />

          {/* Markers */}
          {serviceCenters.map((center, index) => (
            <Marker
              key={index}
              position={[center.latitude, center.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className='space-y-1'>
                  <strong>{center.district}</strong>
                  <br />
                  {center.covered_area.join(', ')}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default BangladeshMap
