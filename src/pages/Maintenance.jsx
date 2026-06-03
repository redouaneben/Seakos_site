import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Battery,
  BatteryWarning,
  ChevronDown,
  RefreshCw,
  Search,
  Wifi,
  Wrench,
  X,
} from 'lucide-react'

const INITIAL_SENSORS = [
  {
    id: 'Z-01',
    location: 'Parc Central — allée nord',
    battery: 78,
    signal: 'Excellent',
    status: 'operational',
  },
  {
    id: 'Z-02',
    location: 'Boulevard Nord — massif arbustif',
    battery: 45,
    signal: 'Bon',
    status: 'operational',
  },
  {
    id: 'Z-03',
    location: 'Place Mairie — pelouse centrale',
    battery: 12,
    signal: 'Faible',
    status: 'intervention',
  },
  {
    id: 'Z-04',
    location: 'Zone Industrielle — zone technique',
    battery: 62,
    signal: 'Moyen',
    status: 'operational',
  },
]

const STATUS_OPTIONS = [
  { value: 'operational', label: 'Opérationnel' },
  { value: 'intervention_en_cours', label: 'Intervention en cours' },
  { value: 'intervention', label: 'Intervention requise' },
]

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous les statuts' },
  { id: 'operational', label: 'Opérationnel' },
  { id: 'intervention', label: 'Interventions' },
]

/** Clé interne → libellé affiché dans le tableau */
function getStatusLabel(statusKey) {
  const option = STATUS_OPTIONS.find((o) => o.value === statusKey)
  return option?.label ?? statusKey
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'Opérationnel':
      return 'text-[#749a53] border-[#749a53] bg-[#749a53]/10'
    case 'Intervention en cours':
      return 'text-[#f5a623] border-[#f5a623] bg-[#f5a623]/10'
    case 'Intervention requise':
      return 'text-[#ff4d4d] border-[#ff4d4d] bg-[#ff4d4d]/10'
    default:
      return 'text-gray-400 border-gray-400 bg-gray-400/10'
  }
}

function StatusBadge({ status }) {
  const label = getStatusLabel(status)

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusStyle(label)}`}
    >
      {label}
    </span>
  )
}

function BatteryCell({ percent }) {
  const critical = percent < 20
  const Icon = critical ? BatteryWarning : Battery

  return (
    <div className="flex items-center gap-2">
      <Icon
        className={`h-4 w-4 shrink-0 ${critical ? 'text-red-500' : 'text-[#749a53]'}`}
        strokeWidth={1.75}
      />
      <span
        className={`text-[13px] font-medium tabular-nums ${
          critical ? 'text-red-500' : 'text-white'
        }`}
      >
        {percent}%
      </span>
    </div>
  )
}

function MiniKpi({ label, value, valueClass = 'text-white' }) {
  return (
    <article className="vc-card p-3 transition-colors duration-200 hover:border-[#555555]">
      <p className="text-[11px] text-[#888888]">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${valueClass}`}>{value}</p>
    </article>
  )
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="vc-btn-icon h-8 w-8 rounded-md"
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  )
}

function SensorModal({
  isOpen,
  sensorId,
  sensors,
  description,
  selectedStatus,
  onDescriptionChange,
  onStatusChange,
  onSave,
  onClose,
  isFromTicketLink,
}) {
  if (!isOpen) return null

  const sensor = sensors.find((s) => s.id === sensorId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sensor-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#333333] bg-black p-5 shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="sensor-modal-title"
              className="text-base font-semibold text-white"
            >
              {isFromTicketLink
                ? 'Nouveau ticket de maintenance'
                : 'Modifier le capteur'}
            </h2>
            {sensor && (
              <p className="mt-1 text-[12px] text-[#888888]">{sensor.location}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="vc-btn-icon h-8 w-8 shrink-0 rounded-md"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="sensor-id"
              className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#888888]"
            >
              ID Capteur
            </label>
            <input
              id="sensor-id"
              type="text"
              readOnly
              value={sensorId}
              className="w-full cursor-not-allowed rounded-md border border-[#333333] bg-[#111111] px-3 py-2 text-[13px] font-semibold text-[#749a53] opacity-90"
            />
          </div>

          <div>
            <label
              htmlFor="sensor-status"
              className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#888888]"
            >
              Statut du capteur
            </label>
            <select
              id="sensor-status"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#111111] p-2 text-sm text-white outline-none transition-colors duration-200 focus:border-[#749a53]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#111111]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sensor-description"
              className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#888888]"
            >
              Description
            </label>
            <textarea
              id="sensor-description"
              rows={4}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Décrivez l'anomalie ou l'intervention..."
              className="w-full resize-none rounded-md border border-[#333333] bg-[#111111] px-3 py-2 text-[13px] text-white placeholder:text-[#888888] transition-colors duration-200 focus:border-[#749a53] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onSave}
            className="w-full rounded-md border border-[#333333] bg-white py-2 px-3 text-[13px] font-bold text-black transition-all duration-200 hover:bg-[#749a53] hover:text-white"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Maintenance() {
  const [searchParams, setSearchParams] = useSearchParams()
  const createTicketFromUrl = searchParams.get('createTicket')

  const [sensors, setSensors] = useState(INITIAL_SENSORS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('operational')
  const [ticketDescription, setTicketDescription] = useState('')

  const openSensorModal = (sensorId) => {
    const sensor = sensors.find((s) => s.id === sensorId)
    setSelectedSensor(sensorId)
    setSelectedStatus(sensor?.status ?? 'operational')
    setTicketDescription('')
    setIsModalOpen(true)
  }

  const closeSensorModal = () => {
    setIsModalOpen(false)
    setTicketDescription('')
    if (searchParams.get('createTicket')) {
      const next = new URLSearchParams(searchParams)
      next.delete('createTicket')
      setSearchParams(next, { replace: true })
    }
  }

  const saveSensor = () => {
    if (!selectedSensor) return
    setSensors((prev) =>
      prev.map((s) =>
        s.id === selectedSensor ? { ...s, status: selectedStatus } : s,
      ),
    )
    closeSensorModal()
  }

  useEffect(() => {
    if (createTicketFromUrl) {
      const sensor = sensors.find((s) => s.id === createTicketFromUrl)
      setSearch(createTicketFromUrl)
      setSelectedSensor(createTicketFromUrl)
      setSelectedStatus(sensor?.status ?? 'intervention')
      setIsModalOpen(true)
    }
  }, [createTicketFromUrl, sensors])

  const miniKpis = useMemo(
    () => ({
      tickets: sensors.filter((s) => s.status !== 'operational').length,
      batteries: sensors.filter((s) => s.battery < 20).length,
      offline: 0,
    }),
    [sensors],
  )

  const filteredSensors = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sensors.filter((s) => {
      const matchSearch =
        !q ||
        s.id.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'operational'
            ? s.status === 'operational'
            : s.status === 'intervention' || s.status === 'intervention_en_cours'
      return matchSearch && matchStatus
    })
  }, [sensors, search, statusFilter])

  const activeFilterLabel =
    STATUS_FILTERS.find((f) => f.id === statusFilter)?.label ?? 'Tous les statuts'

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-black">
      <SensorModal
        isOpen={isModalOpen}
        sensorId={selectedSensor}
        sensors={sensors}
        description={ticketDescription}
        selectedStatus={selectedStatus}
        onDescriptionChange={setTicketDescription}
        onStatusChange={setSelectedStatus}
        onSave={saveSensor}
        onClose={closeSensorModal}
        isFromTicketLink={Boolean(createTicketFromUrl && isModalOpen)}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            Maintenance &amp; Flotte IoT
          </h1>
          <p className="mt-1 text-[13px] text-[#888888]">
            Supervision des capteurs, batteries et interventions terrain — vue
            technicien
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher un ID capteur..."
              className="w-full rounded-md border border-[#333333] bg-[#111111] py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-[#888888] transition-colors duration-200 focus:border-[#749a53] focus:outline-none"
            />
          </div>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-[#333333] bg-[#111111] px-3 py-2 text-[13px] font-medium text-white transition-all duration-200 hover:border-[#749a53] hover:text-[#749a53] sm:min-w-[180px]"
            >
              {activeFilterLabel}
              <ChevronDown className="h-4 w-4 text-[#888888]" strokeWidth={1.75} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-20 mt-1 w-full min-w-[200px] rounded-md border border-[#333333] bg-[#111111] py-1 shadow-none sm:w-auto">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(f.id)
                      setFilterOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left text-[13px] transition-colors duration-200 hover:bg-[#749a53]/10 hover:text-[#749a53] ${
                      statusFilter === f.id ? 'text-[#749a53]' : 'text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MiniKpi label="Tickets ouverts" value={miniKpis.tickets} />
          <MiniKpi
            label="Batteries critiques"
            value={miniKpis.batteries}
            valueClass="text-[#f5a623]"
          />
          <MiniKpi label="Capteurs hors ligne" value={miniKpis.offline} />
        </section>

        <section className="min-w-0 overflow-hidden rounded-lg border border-[#333333] bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  {[
                    'ID Capteur',
                    'Emplacement',
                    'Batterie',
                    'Signal',
                    'Statut',
                    'Actions',
                  ].map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap p-3 text-[12px] font-medium text-[#888888] md:text-[13px]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSensors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-[13px] text-[#888888]"
                    >
                      Aucun capteur ne correspond à votre recherche.
                    </td>
                  </tr>
                ) : (
                  filteredSensors.map((sensor) => (
                    <tr
                      key={sensor.id}
                      className="border-t border-[#333333] transition-colors hover:bg-[#111111]/50"
                    >
                      <td className="whitespace-nowrap p-3 text-[13px] font-semibold text-white">
                        {sensor.id}
                      </td>
                      <td className="max-w-[200px] truncate p-3 text-[13px] text-white md:max-w-none">
                        {sensor.location}
                      </td>
                      <td className="p-3">
                        <BatteryCell percent={sensor.battery} />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-[13px] text-white">
                          <Wifi
                            className="h-4 w-4 shrink-0 text-[#888888]"
                            strokeWidth={1.75}
                          />
                          {sensor.signal}
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={sensor.status} />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <ActionButton
                            icon={Wrench}
                            label={`Modifier ${sensor.id}`}
                            onClick={() => openSensorModal(sensor.id)}
                          />
                          <ActionButton
                            icon={RefreshCw}
                            label={`Ping ${sensor.id}`}
                            onClick={() => {}}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
