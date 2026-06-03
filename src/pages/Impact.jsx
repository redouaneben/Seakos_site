import React, { useMemo, useState } from 'react'
import { Cloud, Droplets, Download, Leaf, Thermometer } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const PERIODS = ['7J', '30J', '12M']

const RSE_KPIS = [
  {
    label: 'Eau économisée',
    value: '12 450 L',
    trend: '+12% vs mois dernier',
    icon: Droplets,
  },
  {
    label: 'Émissions CO₂ évitées',
    value: '450 kg',
    trend: '+8% vs mois dernier',
    icon: Cloud,
  },
  {
    label: 'Rafraîchissement urbain',
    value: '-2.4°C',
    trend: 'Îlot de chaleur atténué',
    icon: Thermometer,
  },
]

const WATER_DATA_30 = [
  { jour: '01/05', litres: 320 },
  { jour: '04/05', litres: 410 },
  { jour: '07/05', litres: 380 },
  { jour: '10/05', litres: 520 },
  { jour: '13/05', litres: 490 },
  { jour: '16/05', litres: 610 },
  { jour: '19/05', litres: 580 },
  { jour: '22/05', litres: 720 },
  { jour: '25/05', litres: 690 },
  { jour: '28/05', litres: 810 },
  { jour: '31/05', litres: 780 },
  { jour: '03/06', litres: 920 },
  { jour: '06/06', litres: 880 },
  { jour: '09/06', litres: 1020 },
  { jour: '12/06', litres: 1240 },
]

const BAR_DATA = [
  { secteur: 'Parc Central', classique: 4200, urbaflor: 2650 },
  { secteur: 'Place Mairie', classique: 3100, urbaflor: 1920 },
]

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-[#333333] bg-[#111111] px-3 py-2 shadow-none">
      <p className="mb-1 text-xs text-[#888888]">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-xs font-semibold text-white"
          style={{ color: entry.color }}
        >
          {entry.name} : {entry.value?.toLocaleString('fr-FR')}
          {entry.dataKey === 'litres' ? ' L' : entry.dataKey === 'classique' || entry.dataKey === 'urbaflor' ? ' L' : ''}
        </p>
      ))}
    </div>
  )
}

function KpiRseCard({ label, value, trend, icon: Icon }) {
  return (
    <article className="vc-card flex min-w-0 flex-col gap-3 p-4 transition-colors duration-200 hover:border-[#555555]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] text-[#888888]">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-[#749a53]" strokeWidth={1.75} />
      </div>
      <p className="text-2xl font-semibold tabular-nums tracking-tight text-white md:text-3xl">
        {value}
      </p>
      <p className="text-xs font-medium text-[#749a53]">{trend}</p>
    </article>
  )
}

export default function Impact() {
  const [period, setPeriod] = useState('30J')

  const waterData = useMemo(() => {
    if (period === '7J') return WATER_DATA_30.slice(-5)
    if (period === '12M') return WATER_DATA_30
    return WATER_DATA_30
  }, [period])

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
        {/* En-tête + contrôles */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
              Impact Environnemental
            </h1>
            <p className="mt-1 text-[13px] text-[#888888]">
              Indicateurs RSE, hydriques et climatiques — synthèse communale
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <div
              className="inline-flex rounded-md border border-[#333333] p-0.5"
              role="group"
              aria-label="Période"
            >
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                    period === p
                      ? 'bg-[#749a53] text-white'
                      : 'bg-transparent text-[#888888] hover:text-[#749a53]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[#333333] bg-white px-3 py-2 text-xs font-bold text-black transition-all duration-200 hover:bg-[#749a53] hover:text-white"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Exporter le rapport
            </button>
          </div>
        </header>

        {/* KPIs RSE */}
        <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {RSE_KPIS.map((kpi) => (
            <KpiRseCard key={kpi.label} {...kpi} />
          ))}
        </section>

        {/* AreaChart */}
        <section className="vc-card min-w-0 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#749a53]" strokeWidth={1.75} />
            <h2 className="text-[13px] font-medium text-white">
              Évolution des économies d&apos;eau (30 derniers jours)
            </h2>
          </div>
          <div className="h-[280px] w-full min-w-0 sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#749a53" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#749a53" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis
                  dataKey="jour"
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={{ stroke: '#333333' }}
                  tickLine={{ stroke: '#333333' }}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={{ stroke: '#333333' }}
                  tickLine={{ stroke: '#333333' }}
                  width={48}
                />
                <Tooltip content={<DarkTooltip />} />
                <Area
                  type="monotone"
                  dataKey="litres"
                  name="Économies"
                  stroke="#749a53"
                  strokeWidth={2}
                  fill="url(#waterGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* BarChart */}
        <section className="vc-card min-w-0 p-4">
          <h2 className="mb-4 text-[13px] font-medium text-white">
            Comparatif : Arrosage Classique vs UrbaFlor Connect
          </h2>
          <div className="h-[280px] w-full min-w-0 sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BAR_DATA}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                barGap={4}
                barCategoryGap="28%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis
                  dataKey="secteur"
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={{ stroke: '#333333' }}
                  tickLine={{ stroke: '#333333' }}
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 11 }}
                  axisLine={{ stroke: '#333333' }}
                  tickLine={{ stroke: '#333333' }}
                  width={48}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#888888', paddingTop: 12 }}
                  formatter={(value) =>
                    value === 'classique' ? 'Classique' : 'UrbaFlor Connect'
                  }
                />
                <Bar
                  dataKey="classique"
                  name="classique"
                  fill="#444444"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="urbaflor"
                  name="urbaflor"
                  fill="#749a53"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}
