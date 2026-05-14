import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

function todayInput() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function Reports() {
  const [date, setDate] = useState(todayInput())
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await apiClient.get('/reports/daily', { params: { date } })
      setRows(Array.isArray(data.rows) ? data.rows : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Report failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Daily report</h1>
      <p className="text-sm text-slate-600">
        Trade name, quantity sold on the selected day, and remaining stock (all inventory rows summed
        per medicine).
      </p>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-slate-600">Date</label>
          <input
            type="date"
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Run report'}
        </button>
        <button
          type="button"
          onClick={() => window.open(`${apiClient.defaults.baseURL}/reports/daily/download?date=${date}`, '_blank')}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
        >
          Download CSV
        </button>
      </div>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Trade name</th>
              <th className="px-4 py-3">Quantity sold (day)</th>
              <th className="px-4 py-3">Remaining stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.medicineID} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{r.tradeName}</td>
                <td className="px-4 py-3">{r.quantitySold}</td>
                <td className="px-4 py-3">{r.remainingStock}</td>
              </tr>
            ))}
            {!rows.length && !loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  No data for this date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
