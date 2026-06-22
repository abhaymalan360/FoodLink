'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

// Default to geographic center of India
const defaultCenter = { lat: 20.5937, lng: 78.9629 }

function MapController({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    }
  })

  return position === null ? null : (
    <Marker position={position} />
  )
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null)
  const [initialCenter, setInitialCenter] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    // Fetch location before rendering the map
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.latitude && data.longitude) {
          const latlng = new L.LatLng(data.latitude, data.longitude)
          setPosition(latlng)
          setInitialCenter({ lat: data.latitude, lng: data.longitude })
          onLocationSelect(data.latitude, data.longitude)
        } else {
          setInitialCenter(defaultCenter)
        }
      }).catch(err => {
        console.error("IP Location failed", err)
        setInitialCenter(defaultCenter)
      })
  }, [])

  if (!initialCenter) {
    return (
      <div className="w-full h-64 bg-surface-variant animate-pulse rounded-lg flex flex-col items-center justify-center text-on-surface-variant border border-outline-variant">
        <span className="material-symbols-outlined text-3xl mb-2 animate-bounce">location_on</span>
        <span>Finding your location...</span>
      </div>
    )
  }

  return (
    <div className="w-full h-64 relative rounded-lg overflow-hidden border border-outline-variant z-0">
      <MapContainer 
        center={[initialCenter.lat, initialCenter.lng]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        <MapController position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  )
}
