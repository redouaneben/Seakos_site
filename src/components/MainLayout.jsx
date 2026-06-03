import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Wrench,
  Menu,
  X,
} from 'lucide-react'
import { BRAND } from '../config/brandAssets.js'

const LOGO_SRC = BRAND.logoHeader

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cartographie', label: 'Cartographie', icon: Map },
  { to: '/impact', label: 'Impact', icon: BarChart3 },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
]

const SIDEBAR_WIDTH = 'w-60' // 240px

function BrandLogo({ className = '' }) {
  return (
    <img
      src={LOGO_SRC}
      alt="UrbaFlor Connect"
      className={`block h-auto max-w-full object-contain object-left ${className}`}
    />
  )
}

function NavLinkItem({ to, label, icon: Icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'vc-nav-link',
          isActive ? 'vc-nav-link-active' : 'vc-nav-link-idle',
        ].join(' ')
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black font-sans">
      {/* Top bar mobile */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#333333] bg-black px-4 md:hidden">
        <BrandLogo className="h-7 max-w-[140px]" />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="vc-btn-icon h-9 w-9"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      {/* Overlay menu mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <div className="flex h-14 items-center justify-between border-b border-[#333333] px-4">
            <BrandLogo className="h-7 max-w-[140px]" />
            <button
              type="button"
              onClick={closeMenu}
              className="vc-btn-icon h-9 w-9"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => (
              <NavLinkItem key={item.to} {...item} onNavigate={closeMenu} />
            ))}
          </nav>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen ${SIDEBAR_WIDTH} flex-col border-r border-[#333333] bg-[#111111] md:flex`}
      >
        <div className="border-b border-[#333333] px-4 py-4">
          <BrandLogo className="h-8" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLinkItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="border-t border-[#333333] px-4 py-3 text-[13px] text-[#888888]">
          UrbaFlor Connect v0.1
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="w-full min-w-0 pt-14 md:ml-60 md:pt-0">
        <main className="w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
