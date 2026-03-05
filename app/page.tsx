'use client'

import { FormEvent, useEffect, useState } from 'react'

type Issue = {
  id: string
  createdAt: string
  imageName: string
  location: string
  category: string
  severity: number
  department: string
  description: string
  status: 'Pending' | 'In Progress' | 'Resolved'
}

const statuses: Issue['status'][] = ['Pending', 'In Progress', 'Resolved']

export default function HomePage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [form, setForm] = useState({ imageName: '', location: '', description: '' })

  async function loadIssues() {
    const res = await fetch('/api/issues', { cache: 'no-store' })
    const data = await res.json()
    setIssues(data.issues)
  }

  useEffect(() => {
    loadIssues().catch(console.error)
  }, [])

  async function submitIssue(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setForm({ imageName: '', location: '', description: '' })
      await loadIssues()
    }

    setLoading(false)
  }

  async function updateStatus(id: string, status: Issue['status']) {
    await fetch(`/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await loadIssues()
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      setForm((prev) => ({ ...prev, location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }))
    })
  }

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <h1 className="text-3xl font-bold text-brand-700">CivicSense AI</h1>
      <p className="mt-2 text-slate-600">Autonomous triage for faster civic issue response.</p>

      <section className="mt-6 rounded-xl bg-white p-4 shadow md:p-6">
        <h2 className="text-xl font-semibold">Citizen Reporting Interface</h2>
        <form onSubmit={submitIssue} className="mt-4 grid gap-3">
          <input
            className="rounded-lg border p-2"
            placeholder="Image filename (e.g. pothole.jpg)"
            value={form.imageName}
            onChange={(e) => setForm((prev) => ({ ...prev, imageName: e.target.value }))}
            required
          />
          <div className="grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              className="rounded-lg border p-2"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              className="rounded-lg border border-brand-500 px-4 py-2 text-brand-700"
            >
              Use geolocation
            </button>
          </div>
          <textarea
            className="rounded-lg border p-2"
            placeholder="Describe what you observed"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
          <button
            disabled={loading}
            className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl bg-white p-4 shadow md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          {!adminMode ? (
            <div className="flex gap-2">
              <input
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter admin PIN"
                className="rounded-lg border p-2"
              />
              <button
                onClick={() => setAdminMode(adminPin === '1234')}
                className="rounded-lg bg-slate-900 px-3 py-2 text-white"
              >
                Unlock
              </button>
            </div>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">Secure view active</span>
          )}
        </div>

        {!adminMode ? (
          <p className="mt-3 text-sm text-slate-600">Dashboard is secured. Enter PIN 1234 for MVP demo.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="p-2">Severity</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="border-b align-top">
                    <td className="p-2 font-semibold text-rose-600">{issue.severity}/10</td>
                    <td className="p-2">{issue.category}</td>
                    <td className="p-2">{issue.location}</td>
                    <td className="p-2">{issue.department}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(issue.id, status)}
                            className={`rounded-full px-2 py-1 text-xs ${
                              issue.status === status ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
