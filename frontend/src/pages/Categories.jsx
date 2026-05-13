import { useEffect, useState } from 'react'
import apiClient from '../api/client.js'

export default function Categories() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [storageInstructions, setStorageInstructions] = useState('')
  const [taxRate, setTaxRate] = useState('0.08')
  const [editing, setEditing] = useState(null)

  const load = async () => {
    setError('')
    try {
      const { data } = await apiClient.get('/category/get')
      setRows(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await apiClient.post('/category/add', {
        categoryName,
        storageInstructions,
        taxRate: Number(taxRate),
      })
      setCategoryName('')
      setStorageInstructions('')
      setTaxRate('0.08')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Add failed')
    }
  }

  const startEdit = (c) => {
    setEditing({
      categoryID: c.categoryID,
      categoryName: c.categoryName,
      storageInstructions: c.storageInstructions || '',
      taxRate: String(c.taxRate ?? 0),
    })
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    if (!editing) return
    setError('')
    try {
      await apiClient.put(`/category/update/${editing.categoryID}`, {
        categoryName: editing.categoryName,
        storageInstructions: editing.storageInstructions,
        taxRate: Number(editing.taxRate),
      })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return
    setError('')
    try {
      await apiClient.delete(`/category/delete/${id}`)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
      {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Add category</h2>
        <form onSubmit={add} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            required
            placeholder="Name"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <input
            placeholder="Storage instructions"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            value={storageInstructions}
            onChange={(e) => setStorageInstructions(e.target.value)}
          />
          <input
            required
            type="number"
            step="0.0001"
            min="0"
            title="Tax rate as decimal (e.g. 0.08 = 8%)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
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
          <h2 className="text-sm font-semibold text-indigo-900">Edit category</h2>
          <form onSubmit={saveEdit} className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.categoryName}
              onChange={(e) => setEditing({ ...editing, categoryName: e.target.value })}
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
              value={editing.storageInstructions}
              onChange={(e) => setEditing({ ...editing, storageInstructions: e.target.value })}
            />
            <input
              required
              type="number"
              step="0.0001"
              min="0"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={editing.taxRate}
              onChange={(e) => setEditing({ ...editing, taxRate: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
              >
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Storage</th>
              <th className="px-4 py-3">Tax rate</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.categoryID} className="border-t border-slate-100">
                <td className="px-4 py-3">{c.categoryID}</td>
                <td className="px-4 py-3 font-medium">{c.categoryName}</td>
                <td className="px-4 py-3 text-slate-600">{c.storageInstructions}</td>
                <td className="px-4 py-3">{c.taxRate}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="mr-2 text-indigo-600 hover:underline"
                    onClick={() => startEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-rose-600 hover:underline"
                    onClick={() => remove(c.categoryID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
