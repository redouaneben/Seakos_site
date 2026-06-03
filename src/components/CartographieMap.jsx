import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

const CARTO_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const STATUS_COLORS = {
  ok: '#749a53',
  alerte: '#f5a623',
  offline: '#444444',
}

/** Place Mairie — secteur d'alerte par défaut (lien Dashboard ?focus=Z-03) */
export const FOCUS_SECTOR_ID = 'Z-03'

export const SECTEUR_MARKERS = [
  {
    id: 'Z-01',
    name: 'Parc Central',
    position: [43.6115, 3.8772],
    temp: '18.4',
    humidity: '62',
    status: 'ok',
  },
  {
    id: 'Z-02',
    name: 'Boulevard Nord',
    position: [43.6098, 3.881],
    temp: '19.1',
    humidity: '58',
    status: 'ok',
  },
  {
    id: FOCUS_SECTOR_ID,
    name: 'Place Mairie',
    position: [43.6089, 3.8845],
    temp: '22.8',
    humidity: '41',
    status: 'alerte',
  },
  {
    id: 'Z-04',
    name: 'Zone Industrielle Nord',
    position: [43.6142, 3.8691],
    temp: '—',
    humidity: '—',
    status: 'offline',
  },
  {
    id: 'Z-05',
    name: 'Réservoir Sud',
    position: [43.6072, 3.872],
    temp: '—',
    humidity: '—',
    status: 'offline',
  },
  {
    id: 'Z-06',
    name: 'Station Est',
    position: [43.6128, 3.889],
    temp: '—',
    humidity: '—',
    status: 'offline',
  },
]

export const FLEET_COUNTS = {
  all: 30,
  ok: 26,
  alerte: 1,
  offline: 3,
}

const CENTER = [43.6108, 3.8767]
const FOCUS_ZOOM = 16

const iconCache = new Map()

function getStatusIcon(status) {
  if (iconCache.has(status)) return iconCache.get(status)

  const color = STATUS_COLORS[status] ?? STATUS_COLORS.offline
  const icon = L.divIcon({
    className: 'leaflet-div-icon-uf',
    html: `<div class="uf-map-marker" style="--marker-color:${color}">
      <span class="uf-map-marker-pulse"></span>
      <span class="uf-map-marker-dot"></span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
  iconCache.set(status, icon)
  return icon
}

function getLeafletMarker(ref) {
  if (!ref) return null
  if (typeof ref.getLeafletElement === 'function') return ref.getLeafletElement()
  if (ref.leafletElement) return ref.leafletElement
  if (typeof ref.openPopup === 'function') return ref
  return null
}

function openMarkerPopup(markerRef) {
  const leafletMarker = getLeafletMarker(markerRef)
  if (!leafletMarker?.openPopup) return false
  leafletMarker.openPopup()
  return true
}

function MapPopupContent({ sector }) {
  const { id, name, temp, humidity, status } = sector

  return (
    <div className="min-w-[180px] p-3">
      <p className="text-[13px] font-semibold text-white">
        {name}
        <span className="ml-1 text-[#888888]">({id})</span>
      </p>
      <dl className="mt-2 space-y-1 text-[12px] text-[#888888]">
        <div className="flex justify-between gap-4">
          <dt>T°C</dt>
          <dd className="font-medium tabular-nums text-white">{temp}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>% Humidité</dt>
          <dd className="font-medium tabular-nums text-white">{humidity}</dd>
        </div>
      </dl>
      {status === 'alerte' && (
        <Link
          to={`/maintenance?createTicket=${id}`}
          className="mt-3 block w-full rounded-md border border-[#749a53] bg-black py-2 px-3 text-center text-xs font-bold !text-[#749a53] transition-all duration-200 hover:bg-[#749a53] hover:!text-white"
        >
          Ouvrir un ticket de maintenance →
        </Link>
      )}
    </div>
  )
}

/**
 * Écoute focusSector et pilote flyTo + ouverture popup (ex. Z-03 Place Mairie).
 * Doit être rendu à l'intérieur de <MapContainer>.
 */
function MapFocusHandler({ focusSector, markerRefs }) {
  const map = useMap()

  useEffect(() => {
    if (!focusSector) return

    const sector = SECTEUR_MARKERS.find((m) => m.id === focusSector)
    if (!sector) return

    let cancelled = false

    const openFocusedPopup = (attempt = 0) => {
      if (cancelled) return
      if (openMarkerPopup(markerRefs.current[focusSector])) return
      if (attempt < 12) {
        setTimeout(() => openFocusedPopup(attempt + 1), 200)
      }
    }

    map.flyTo(sector.position, FOCUS_ZOOM, { animate: true, duration: 1.2 })

    const onMoveEnd = () => openFocusedPopup(0)
    map.once('moveend', onMoveEnd)
    const fallbackTimer = setTimeout(() => openFocusedPopup(0), 1600)

    return () => {
      cancelled = true
      map.off('moveend', onMoveEnd)
      clearTimeout(fallbackTimer)
    }
  }, [focusSector, map, markerRefs])

  return null
}

function SectorMarker({ sector, registerMarkerRef }) {
  const markerRef = useCallback(
    (instance) => {
      registerMarkerRef(sector.id, instance)
    },
    [sector.id, registerMarkerRef],
  )

  return (
    <Marker
      ref={markerRef}
      position={sector.position}
      icon={getStatusIcon(sector.status)}
      eventHandlers={{
        add: (e) => {
          registerMarkerRef(sector.id, e.target)
        },
      }}
    >
      <Popup>
        <MapPopupContent sector={sector} />
      </Popup>
    </Marker>
  )
}

export default function CartographieMap({ visibleStatuses, focusSector }) {
  const markerRefs = useRef({})

  const registerMarkerRef = useCallback((id, instance) => {
    if (instance) {
      markerRefs.current[id] = instance
    } else {
      delete markerRefs.current[id]
    }
  }, [])

  const markers = useMemo(
    () => SECTEUR_MARKERS.filter((m) => visibleStatuses.includes(m.status)),
    [visibleStatuses],
  )

  const resolvedFocus =
    focusSector && SECTEUR_MARKERS.some((m) => m.id === focusSector)
      ? focusSector
      : null

  const focusOnMap =
    resolvedFocus && markers.some((m) => m.id === resolvedFocus)

  return (
    <MapContainer
      center={CENTER}
      zoom={14}
      scrollWheelZoom
      className="z-0 h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url={CARTO_DARK}
      />
      {focusOnMap && (
        <MapFocusHandler focusSector={resolvedFocus} markerRefs={markerRefs} />
      )}
      {markers.map((sector) => (
        <SectorMarker
          key={sector.id}
          sector={sector}
          registerMarkerRef={registerMarkerRef}
        />
      ))}
    </MapContainer>
  )
}
