import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CartographieMap, {
  FLEET_COUNTS,
  SECTEUR_MARKERS,
} from '../components/CartographieMap.jsx'

const FILTER_OPTIONS = [
  {
    id: 'all',
    label: 'Tous les secteurs',
    countKey: 'all',
    statuses: ['ok', 'alerte', 'offline'],
    dotColor: '#ededed',
  },
  {
    id: 'ok',
    label: 'Capteurs OK',
    countKey: 'ok',
    statuses: ['ok'],
    dotColor: '#749a53',
  },
  {
    id: 'alerte',
    label: 'Capteurs en Alerte',
    countKey: 'alerte',
    statuses: ['alerte'],
    dotColor: '#f5a623',
  },
  {
    id: 'offline',
    label: 'Hors Ligne',
    countKey: 'offline',
    statuses: ['offline'],
    dotColor: '#444444',
  },
]

function FilterSwitch({ label, count, dotColor, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors duration-200 ${
        checked
          ? 'border-[#555555] bg-[#111111]'
          : 'border-[#333333] bg-transparent hover:border-[#555555]'
      }`}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? dotColor : '#333333' }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-[12px] leading-tight text-[#ededed]">
        {label}
        <span className="text-[#888888]"> · {count}</span>
      </span>
      <span
        className={`relative h-4 w-7 shrink-0 rounded-full border transition-colors duration-200 ${
          checked ? 'border-[#749a53] bg-[#749a53]/30' : 'border-[#333333] bg-[#0a0a0a]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-none transition-all duration-200 ${
            checked ? 'left-[14px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

const INITIAL_ENABLED = { ok: true, alerte: true, offline: true }

export default function Cartographie() {
  const [searchParams] = useSearchParams()
  const focus = searchParams.get('focus')

  const [enabled, setEnabled] = useState(INITIAL_ENABLED)

  const focusSector = useMemo(
    () => SECTEUR_MARKERS.find((m) => m.id === focus) ?? null,
    [focus],
  )

  useEffect(() => {
    if (!focusSector) return
    setEnabled((prev) => ({
      ...prev,
      [focusSector.status]: true,
    }))
  }, [focusSector])

  const allEnabled = enabled.ok && enabled.alerte && enabled.offline

  const visibleStatuses = useMemo(() => {
    const active = Object.entries(enabled)
      .filter(([, on]) => on)
      .map(([status]) => status)
    return active.length > 0 ? active : []
  }, [enabled])

  const visibleOnMap = useMemo(
    () => SECTEUR_MARKERS.filter((m) => visibleStatuses.includes(m.status)).length,
    [visibleStatuses],
  )

  const handleToggle = (id, nextChecked) => {
    if (id === 'all') {
      const value = nextChecked
      setEnabled({ ok: value, alerte: value, offline: value })
      return
    }
    setEnabled((prev) => ({ ...prev, [id]: nextChecked }))
  }

  return (
    <div className="flex w-full min-w-0 flex-col overflow-hidden bg-black">
      <header className="shrink-0 border-b border-[#333333] px-4 py-3 md:px-6">
        <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
          Cartographie
        </h1>
        <p className="mt-1 text-[13px] text-[#888888]">
          {focusSector
            ? `Focus anomalie — ${focusSector.name} (${focusSector.id})`
            : `${visibleOnMap} secteur(s) affiché(s) sur la carte · Montpellier`}
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="w-full shrink-0 border-b border-[#333333] bg-[#0a0a0a] p-3 md:w-[300px] md:border-b-0 md:border-r">
          <h2 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#888888]">
            Filtres de statut
          </h2>
          <div className="flex flex-col gap-1.5">
            {FILTER_OPTIONS.map((option) => (
              <FilterSwitch
                key={option.id}
                label={option.label}
                count={FLEET_COUNTS[option.countKey]}
                dotColor={option.dotColor}
                checked={option.id === 'all' ? allEnabled : enabled[option.id]}
                onChange={(checked) => handleToggle(option.id, checked)}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[#888888]">
            {visibleStatuses.length === 0
              ? 'Aucun marqueur — activez au moins un filtre'
              : visibleStatuses.length === 3
                ? 'Tous les types de capteurs visibles'
                : `Filtre actif : ${visibleStatuses.join(', ')}`}
          </p>
        </aside>

        <div className="relative min-h-[360px] w-full min-w-0 flex-1 bg-black md:min-h-0">
          <div className="h-[calc(100vh-8rem)] w-full min-w-0 md:h-[calc(100vh-4.5rem)]">
            <CartographieMap
              visibleStatuses={visibleStatuses}
              focusSector={focus}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
