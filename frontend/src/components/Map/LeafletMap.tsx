'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import HeatmapLayer from './HeatmapLayer'
import L from 'leaflet'
import { useEffect, useState } from 'react'

// Fix for default marker icons in Leaflet + Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const emergencyIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface LeafletMapProps {
  demands: any[]
  listings: any[]
  selectedLocation?: { lat: number, lng: number, title?: string, isEmergency?: boolean } | null
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }

// Component to fly to a specifically selected location from the UI
function LocationFlyer({ selectedLocation }: { selectedLocation?: { lat: number, lng: number, title?: string, isEmergency?: boolean } | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 16, { animate: true, duration: 1.5 });
    }
  }, [selectedLocation, map]);

  if (!selectedLocation) return null;

  return (
    <Marker 
      position={[selectedLocation.lat, selectedLocation.lng]}
      icon={selectedLocation.isEmergency ? emergencyIcon : defaultIcon}
    >
      <Popup autoPan={false}>
        <strong className={selectedLocation.isEmergency ? "text-error" : ""}>
          {selectedLocation.isEmergency && "🚨 "}
          {selectedLocation.title || "Selected Listing"}
        </strong>
        <br />
        This is the location of the selected item.
      </Popup>
    </Marker>
  );
}

// Component to handle flying to user location
function LocationMarker() {
  const map = useMap();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    map.on("locationfound", function (e) {
      setErrorMsg(null);
      const radius = e.accuracy / 2;
      L.circleMarker(e.latlng, {
        radius: 8,
        fillColor: "#3b82f6",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map).bindPopup("You are here").openPopup();
    });

    map.on("locationerror", async function (e) {
      // If browser location fails, fallback to IP-based location
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        
        if (data && data.latitude && data.longitude) {
          setErrorMsg("Using IP location (GPS disabled)");
          const latlng = new L.LatLng(data.latitude, data.longitude);
          map.flyTo(latlng, 13);
          
          L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#10b981", // Green to indicate IP location
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map).bindPopup(`Approximate Location: ${data.city}`).openPopup();
        } else {
          setErrorMsg(e.message);
        }
      } catch (err) {
        setErrorMsg("All location methods failed.");
      }
    });
  }, [map]);

  const triggerLocate = () => {
    map.locate({ setView: true, maxZoom: 14, enableHighAccuracy: false, timeout: 5000 });
  }

  return (
    <div className="absolute bottom-6 right-6 z-[1000]">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerLocate();
        }}
        className="bg-white text-primary p-3 rounded-full shadow-xl hover:bg-surface-container flex items-center justify-center border border-outline-variant"
        title="Find My Location"
      >
        <span className="material-symbols-outlined text-[24px]">my_location</span>
      </button>
      {errorMsg && <div className="absolute bottom-16 right-0 bg-surface-container text-on-surface-variant p-2 rounded shadow text-xs border border-outline-variant font-medium whitespace-nowrap">{errorMsg}</div>}
    </div>
  );
}

export default function LeafletMap({ demands, listings, selectedLocation }: LeafletMapProps) {
  // We need to map the demands to {lat, lng, weight}
  const heatmapPoints = demands.map(d => ({
    lat: d.lat,
    lng: d.lng,
    weight: d.headcount || 1
  }))

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          className="map-tiles"
          maxZoom={20}
        />
        
        {/* Flies to the clicked item from the sidebar */}
        <LocationFlyer selectedLocation={selectedLocation} />

        {/* Handles flying to user's real location */}
        <LocationMarker />

        {/* Heatmap overlay */}
        <HeatmapLayer points={heatmapPoints} />

        {/* Markers for Surplus Listings */}
        {listings.map(l => {
          const isEmergency = l.food_name && l.food_name.startsWith('Emergency Report');
          return (
            <Marker 
              key={l.id} 
              position={[l.lat, l.lng]}
              icon={isEmergency ? emergencyIcon : defaultIcon}
            >
              <Popup>
                {isEmergency ? (
                  <>
                    <strong className="text-error">🚨 {l.food_name}</strong><br/>
                    Quantity: {l.quantity} {l.unit}
                  </>
                ) : (
                  <>
                    <strong>{l.food_name}</strong><br/>
                    Quantity: {l.quantity} {l.unit}
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  )
}
