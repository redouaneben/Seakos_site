import React from 'react'

export default function PageShell({ title, description, children }) {
  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <header className="mb-6 min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-white md:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[13px] text-[#888888]">{description}</p>
          )}
        </header>
        <div className="w-full min-w-0 space-y-4">{children}</div>
      </div>
    </div>
  )
}
