import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

function money(n) {
  const v = Number(n)
  if (Number.isNaN(v)) return '—'
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Inventory() {
  const [rows, setRows] = useState([])
  const [medicines, setMedicines] = useState([])
  const [error, setError] = useState('')
  const [medicineID, setMedicineID] = useState('')
  const [quantityInHand, setQuantityInHand] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const load = async () => {
    setError('')
    try {
      const [iRes, mRes] = await Promise.all([
        apiClient.get('/inventory/get'),
        apiClient.get('/medicine/get'),
      ])
      setRows(Array.isArray(iRes.data) ? iRes.data : [])
      setMedicines(Array.isArray(mRes.data) ? mRes.data : [])
      if (!medicineID && mRes.data?.length) {
        setMedicineID(String(mRes.data[0].medicineID))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await apiClient.post('/inventory/add', {
        medicineID: Number(medicineID),
        quantityInHand: Number(quantityInHand),
        expiryDate: expiryDate || null,
      })
      setQuantityInHand('')
      setExpiryDate('')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Insert failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Inventory</h1>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add stock</h2>
        <form onSubmit={add} className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[180px] flex-1">
            <label className="block text-xs font-medium text-slate-600">Medicine</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={medicineID}
              onChange={(e) => setMedicineID(e.target.value)}
            >
              {medicines.map((m) => (
                <option key={m.medicineID} value={m.medicineID}>
                  {m.tradeName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-slate-600">Qty in hand</label>
            <input
              required
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={quantityInHand}
              onChange={(e) => setQuantityInHand(e.target.value)}
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-medium text-slate-600">Expiry</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Insert
          </button>
        </form>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Stock #</th>
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Unit price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const low = Number(r.quantityInHand) < 10
              return (
                <tr key={r.stockNumber} className="border-t border-slate-100">
                  <td className="px-4 py-3">{r.stockNumber}</td>
                  <td className="px-4 py-3 font-medium">{r.tradeName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        low
                          ? 'inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800'
                          : ''
                      }
                    >
                      {low && (
                        <span className="h-2 w-2 rounded-full bg-rose-600" aria-hidden />
                      )}
                      {r.quantityInHand}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.expiryDate || '—'}</td>
                  <td className="px-4 py-3">{money(r.unitPrice)}</td>
                </tr>
              )
            })}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No inventory rows yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
