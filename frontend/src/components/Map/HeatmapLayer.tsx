import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

interface HeatmapLayerProps {
  points: { lat: number; lng: number; weight: number }[]
}

export default function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap()
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!map) return

    const heatmapPoints = points.map(p => [p.lat, p.lng, p.weight])

    // Create layer if it doesn't exist
    if (!layerRef.current) {
      layerRef.current = (L as any).heatLayer(heatmapPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.4: 'cyan',
          0.6: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      }).addTo(map)
    } else {
      // Update existing layer
      layerRef.current.setLatLngs(heatmapPoints)
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [map, points])

  return null
}
