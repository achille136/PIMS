import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

export default function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [genericName, setGenericName] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [editing, setEditing] = useState(null)

  const loadAll = async () => {
    setError('')
    try {
      const [mRes, cRes] = await Promise.all([
        apiClient.get('/medicine/get'),
        apiClient.get('/category/get'),
      ])
      setMedicines(Array.isArray(mRes.data) ? mRes.data : [])
      setCategories(Array.isArray(cRes.data) ? cRes.data : [])
      if (!categoryID && cRes.data?.length) {
        setCategoryID(String(cRes.data[0].categoryID))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await apiClient.post('/medicine/add', {
        tradeName,
        genericName,
        categoryID: Number(categoryID),
        unitPrice: Number(unitPrice),
      })
      setTradeName('')
      setGenericName('')
      setUnitPrice('')
      await loadAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed')
    }
  }

  const startEdit = (m) => {
    setEditing({
      medicineID: m.medicineID,
      tradeName: m.tradeName,
      genericName: m.genericName,
      categoryID: String(m.categoryID),
      unitPrice: String(m.unitPrice),
    })
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editing) return
    setError('')
    try {
      await apiClient.put(`/medicine/update/${editing.medicineID}`, {
        tradeName: editing.tradeName,
        genericName: editing.genericName,
        categoryID: Number(editing.categoryID),
        unitPrice: Number(editing.unitPrice),
      })
      setEditing(null)
      await loadAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this medicine?')) return
    setError('')
    try {
      await apiClient.delete(`/medicine/delete/${id}`)
      await loadAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Medicines</h1>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add medicine</h2>
        <form onSubmit={add} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            required
            placeholder="Trade name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
          />
          <input
            required
            placeholder="Generic name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
          />
          <select
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={categoryID}
            onChange={(e) => setCategoryID(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.categoryID} value={c.categoryID}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Unit price"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Insert
          </button>
        </form>
      </section>

      {editing && (
        <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-indigo-900">Edit medicine</h2>
          <form onSubmit={saveEdit} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.tradeName}
              onChange={(e) => setEditing({ ...editing, tradeName: e.target.value })}
            />
            <input
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.genericName}
              onChange={(e) => setEditing({ ...editing, genericName: e.target.value })}
            />
            <select
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.categoryID}
              onChange={(e) => setEditing({ ...editing, categoryID: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.categoryID} value={c.categoryID}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.unitPrice}
              onChange={(e) => setEditing({ ...editing, unitPrice: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
                Save
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Trade name</th>
              <th className="px-4 py-3">Generic</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Unit price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.medicineID} className="border-t border-slate-100">
                <td className="px-4 py-3">{m.medicineID}</td>
                <td className="px-4 py-3 font-medium">{m.tradeName}</td>
                <td className="px-4 py-3">{m.genericName}</td>
                <td className="px-4 py-3">{m.categoryName || m.categoryID}</td>
                <td className="px-4 py-3">{m.unitPrice}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="mr-2 text-indigo-600 hover:underline"
                    onClick={() => startEdit(m)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-rose-600 hover:underline"
                    onClick={() => remove(m.medicineID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!medicines.length && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No medicines yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
