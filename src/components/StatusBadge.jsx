import React from 'react'

const VARIANTS = {
  OK: 'border-primary-green/40 bg-primary-green/15 text-primary-green',
  ALERTE: 'border-amber-500/40 bg-amber-500/15 text-amber-400',
}

export default function StatusBadge({ status }) {
  const variant =
    VARIANTS[status] ?? 'border-[#333333] bg-white/5 text-[#888888]'
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${variant}`}
    >
      {status}
    </span>
  )
}
