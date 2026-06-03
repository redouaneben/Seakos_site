import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Droplets, Thermometer, Wind } from 'lucide-react'
import StatusBadge from '../components/StatusBadge.jsx'
import PageShell from '../components/PageShell.jsx'

const SECTORS = [
  { id: 'Z-01', sector: 'Parc Central', status: 'OK', temp: '18.4', humidity: '62' },
  { id: 'Z-02', sector: 'Boulevard Nord', status: 'OK', temp: '19.1', humidity: '58' },
  { id: 'Z-03', sector: 'Place Mairie', status: 'ALERTE', temp: '22.8', humidity: '41' },
  { id: 'Z-04', sector: 'Zone Industrielle', status: 'OK', temp: '17.2', humidity: '71' },
]

const FLUX = [
  { label: 'Thermique', value: '19.4°C', icon: Thermometer, alert: false },
  { label: 'Humidité', value: '58%', icon: Droplets, alert: false },
  { label: 'Ventilation', value: '12 km/h', icon: Wind, alert: false },
  { label: 'Stress hydrique', value: 'Élevé', icon: Activity, alert: true },
]

const KPI = [
  {
    label: 'Capteurs actifs',
    value: '30/30',
    actionLabel: 'Voir sur la carte',
    to: '/cartographie',
  },
  {
    label: 'Temp. moyenne',
    value: '19.4°C',
    actionLabel: 'Analyser l\'impact',
    to: '/impact',
  },
  {
    label: 'Humidité sol',
    value: '58%',
    actionLabel: 'Historique des sondes',
    to: '/maintenance',
  },
  {
    label: 'Alertes',
    value: '1 secteur (Z-03)',
    alert: true,
    actionLabel: 'Focus sur l\'anomalie',
    to: '/cartographie?focus=Z-03',
  },
]

function KpiCard({ label, value, alert, actionLabel, to }) {
  return (
    <article className="vc-card-interactive flex min-w-0 flex-col p-4">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-[#888888]">{label}</p>
        <p
          className={`mt-2 truncate text-2xl font-semibold tabular-nums tracking-tight ${
            alert ? 'text-[#f5a623]' : 'text-white'
          }`}
        >
          {value}
        </p>
      </div>
      <footer className="mt-4 border-t border-[#333333] pt-2">
        <Link
          to={to}
          className="flex cursor-pointer items-center gap-1 text-xs text-[#888888] transition-colors duration-200 hover:text-[#749a53]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3 w-3 shrink-0" strokeWidth={2} />
        </Link>
      </footer>
    </article>
  )
}

export default function Dashboard() {
  return (
    <PageShell
      title="Tableau de bord opérationnel"
      description="Vue synthétique des capteurs et secteurs surveillés."
    >
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </div>

      {/* Tableau + flux */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <section className="vc-card col-span-1 min-w-0 overflow-hidden md:col-span-2">
          <div className="border-b border-[#333333] px-4 py-3">
            <h2 className="text-[13px] font-medium text-white">État des secteurs</h2>
          </div>
          <div className="w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-0 text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#333333] text-[#888888]">
                  <th className="whitespace-nowrap px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Secteur</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium">T°C</th>
                  <th className="whitespace-nowrap px-4 py-2 font-medium">%H</th>
                </tr>
              </thead>
              <tbody>
                {SECTORS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#333333] last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 font-medium text-white">
                      {row.id}
                    </td>
                    <td className="max-w-[120px] truncate px-4 py-2.5 text-white sm:max-w-none">
                      {row.sector}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-white">
                      {row.temp}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-white">
                      {row.humidity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="vc-card col-span-1 flex min-w-0 flex-col md:col-span-1">
          <div className="border-b border-[#333333] px-4 py-3">
            <h2 className="text-[13px] font-medium text-white">
              Flux capteurs — temps réel
            </h2>
          </div>
          <ul className="min-w-0 flex-1 divide-y divide-[#333333]">
            {FLUX.map(({ label, value, icon: Icon, alert }) => (
              <li key={label} className="flex min-w-0 items-center gap-3 px-4 py-3">
                <Icon
                  className={`h-4 w-4 shrink-0 ${alert ? 'text-amber-400' : 'text-primary-green'}`}
                  strokeWidth={1.75}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-[#888888]">{label}</p>
                  <p
                    className={`truncate font-medium tabular-nums ${
                      alert ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="grid w-full grid-cols-1 gap-2 border-t border-[#333333] p-4 sm:grid-cols-2">
            <button
              type="button"
              className="w-full rounded-md border border-[#333333] bg-white py-2 px-3 text-[13px] font-bold text-black transition-all duration-200 hover:bg-[#749a53] hover:text-white"
            >
              Export CSV
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-[#333333] bg-black py-2 px-3 text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#749a53] hover:text-white"
            >
              Journal
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
