import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-600 text-white shadow'
      : 'text-slate-700 hover:bg-slate-100'
  }`

export default function Layout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = async () => {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  const links = (
    <>
      <NavLink to="/categories" className={linkClass} onClick={() => setOpen(false)}>
        Categories
      </NavLink>
      <NavLink to="/medicines" className={linkClass} onClick={() => setOpen(false)}>
        Medicines
      </NavLink>
      <NavLink to="/inventory" className={linkClass} onClick={() => setOpen(false)}>
        Inventory
      </NavLink>
      <NavLink to="/sales" className={linkClass} onClick={() => setOpen(false)}>
        Sales
      </NavLink>
      <NavLink to="/reports" className={linkClass} onClick={() => setOpen(false)}>
        Reports
      </NavLink>
      <button
        type="button"
        onClick={() => {
          setOpen(false)
          onLogout()
        }}
        className="rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-700 hover:bg-rose-50"
      >
        Logout
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-lg font-semibold text-indigo-700">PIMS</span>
            {user?.username && (
              <span className="hidden truncate text-xs text-slate-500 sm:inline">
                {user.username}
              </span>
            )}
          </div>
          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
          <nav className="hidden flex-wrap items-center justify-end gap-1 md:flex">{links}</nav>
        </div>
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-1 pt-2">{links}</nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
