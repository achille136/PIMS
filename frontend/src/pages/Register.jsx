import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

function strongPassword(p) {
  if (!p || p.length < 4) return false
  return true
}

export default function Register() {
  const { user, ready } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    if (ready && user) navigate('/categories', { replace: true })
  }, [ready, user, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setOk('')
    if (!strongPassword(password)) {
      setError(
        'Password must be at least 4 characters.'
      )
      return
    }
    try {
      await apiClient.post('/auth/register', { username, email, password })
      setOk('Account created. You can sign in now.')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed')
    }
  }

  if (!ready) {
    return <p className="p-8 text-center text-slate-500">Loading…</p>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h1 className="text-center text-xl font-semibold text-slate-900">Create account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
          )}
          {ok && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Use at least 4 characters.
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
