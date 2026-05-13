import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

function money(n) {
  const v = Number(n)
  if (Number.isNaN(v)) return '—'
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function todayInput() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export default function Sales() {
  const [medicines, setMedicines] = useState([])
  const [sales, setSales] = useState([])
  const [error, setError] = useState('')
  const [medicineID, setMedicineID] = useState('')
  const [quantitySold, setQuantitySold] = useState('')
  const [saleDate, setSaleDate] = useState(todayInput())
  const [bill, setBill] = useState(null)

  const load = async () => {
    setError('')
    try {
      const [mRes, sRes] = await Promise.all([
        apiClient.get('/medicine/get'),
        apiClient.get('/sales/get'),
      ])
      setMedicines(Array.isArray(mRes.data) ? mRes.data : [])
      setSales(Array.isArray(sRes.data) ? sRes.data : [])
      if (!medicineID && mRes.data?.length) {
        setMedicineID(String(mRes.data[0].medicineID))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sales data')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBill(null)
    try {
      const { data } = await apiClient.post('/sales/add', {
        medicineID: Number(medicineID),
        quantitySold: Number(quantitySold),
        saleDate,
      })
      setBill(data.bill || null)
      setQuantitySold('')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Sale failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Sales</h1>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">New sale</h2>
        <p className="mt-1 text-xs text-slate-500">
          Total = (unit price × quantity) + tax, using the average tax rate from all categories.
        </p>
        <form onSubmit={submit} className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[200px] flex-1">
            <label className="block text-xs font-medium text-slate-600">Medicine</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={medicineID}
              onChange={(e) => setMedicineID(e.target.value)}
            >
              {medicines.map((m) => (
                <option key={m.medicineID} value={m.medicineID}>
                  {m.tradeName} — {money(m.unitPrice)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="block text-xs font-medium text-slate-600">Quantity</label>
            <input
              required
              type="number"
              min="1"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={quantitySold}
              onChange={(e) => setQuantitySold(e.target.value)}
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-medium text-slate-600">Sale date</label>
            <input
              required
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Insert sale
          </button>
        </form>
      </section>

      {bill && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900">Bill</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Trade name</dt>
              <dd className="font-medium">{bill.tradeName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Quantity sold</dt>
              <dd className="font-medium">{bill.quantitySold}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Unit price</dt>
              <dd>{money(bill.unitPrice)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Line subtotal</dt>
              <dd>{money(bill.lineSubtotal)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Average tax rate</dt>
              <dd>{(Number(bill.averageTaxRate) * 100).toFixed(2)}%</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tax amount</dt>
              <dd>{money(bill.taxAmount)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Total amount</dt>
              <dd className="text-lg font-semibold text-emerald-900">{money(bill.totalAmount)}</dd>
            </div>
            <div className="sm:col-span-2 text-xs text-slate-500">Sale date: {bill.saleDate}</div>
          </dl>
        </section>
      )}

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
          Recent sales
        </h2>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.saleNumber} className="border-t border-slate-100">
                <td className="px-4 py-3">{s.saleNumber}</td>
                <td className="px-4 py-3 font-medium">{s.tradeName}</td>
                <td className="px-4 py-3">{s.quantitySold}</td>
                <td className="px-4 py-3">{money(s.totalAmount)}</td>
                <td className="px-4 py-3 text-slate-600">{s.saleDate}</td>
              </tr>
            ))}
            {!sales.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No sales yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
