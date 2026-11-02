'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Download,
  Mail,
  RefreshCw,
  Search,
  UserMinus,
  Users,
} from 'lucide-react'
import { getAdminAuthHeaders } from '@/lib/admin-api'

interface Subscriber {
  id: string
  email: string
  name: string | null
  source: 'checkout' | 'order-confirmation' | 'footer' | 'admin'
  subscribedAt: string
  unsubscribedAt: string | null
  orderReference: string | null
  createdAt: string
}

interface NewsletterStats {
  total: number
  active: number
  unsubscribed: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const SOURCE_LABELS: Record<Subscriber['source'], string> = {
  checkout: 'Checkout',
  'order-confirmation': 'Order confirmation',
  footer: 'Footer',
  admin: 'Admin',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminSubscribersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<NewsletterStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1,
  })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [setupNeeded, setSetupNeeded] = useState(false)

  const checkAuth = useCallback(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin/login')
      return false
    }
    return true
  }, [router])

  const fetchSubscribers = useCallback(async () => {
    if (!checkAuth()) return

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
      })
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/newsletter?${params.toString()}`, {
        headers: getAdminAuthHeaders(),
        cache: 'no-store',
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (data?.code === 'NOT_CONFIGURED') {
          setSetupNeeded(true)
          return
        }
        throw new Error(data?.error || 'Failed to load subscribers.')
      }

      setSetupNeeded(false)
      setSubscribers(data.subscribers || [])
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 })
      setPagination(data.pagination || { page, limit: 50, total: 0, pages: 1 })
    } catch (fetchError) {
      console.error('Error fetching subscribers:', fetchError)
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to load subscribers.'
      )
    } finally {
      setLoading(false)
    }
  }, [checkAuth, page, search, router])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-8 sm:pt-24 sm:pb-12 md:pt-28 md:pb-16">
      <div className="section-shell">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/45">
              Marketing
            </p>
            <h1 className="font-serif text-2xl text-black-dark sm:text-3xl md:text-4xl">
              Newsletter
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-black/60">
              Everyone who opted in to new arrivals and price drops. These contacts are also
              synced to your Resend audience for broadcasts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchSubscribers}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 px-4 py-2.5 text-sm font-medium text-black-dark transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <a
              href="/api/admin/newsletter?format=csv"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
            >
              <Download size={15} />
              Export active (CSV)
            </a>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {setupNeeded ? (
          <div className="rounded-2xl border border-gold/30 bg-white p-6 sm:p-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-black-dark">
              <Mail size={20} />
            </div>
            <h2 className="font-serif text-xl text-black-dark">One more step</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">
              Newsletter storage is not set up yet. Run the migration at{' '}
              <code className="rounded bg-black/5 px-1.5 py-0.5 text-xs">
                supabase/migrations/20261102120000_newsletter_subscribers.sql
              </code>{' '}
              in the Supabase SQL editor, then refresh this page.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gold/30 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45">
                    Active
                  </p>
                  <Mail size={16} className="text-black/35" />
                </div>
                <p className="mt-3 font-serif text-3xl text-black-dark">{stats.active}</p>
                <p className="mt-1 text-xs text-black/50">Ready to receive campaigns</p>
              </div>

              <div className="rounded-2xl border border-gold/30 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45">
                    Total opt-ins
                  </p>
                  <Users size={16} className="text-black/35" />
                </div>
                <p className="mt-3 font-serif text-3xl text-black-dark">{stats.total}</p>
                <p className="mt-1 text-xs text-black/50">All-time signups</p>
              </div>

              <div className="rounded-2xl border border-gold/30 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45">
                    Unsubscribed
                  </p>
                  <UserMinus size={16} className="text-black/35" />
                </div>
                <p className="mt-3 font-serif text-3xl text-black-dark">
                  {stats.unsubscribed}
                </p>
                <p className="mt-1 text-xs text-black/50">Excluded from exports</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gold/30 bg-white">
              <div className="flex flex-col gap-3 border-b border-gold/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                    />
                    <input
                      type="search"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search by email or name"
                      className="w-full rounded-xl border border-black/15 py-2.5 pl-9 pr-3 text-sm text-black-dark outline-none transition-colors placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-gold/25"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
                  >
                    Search
                  </button>
                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="rounded-xl border border-black/15 px-3 py-2.5 text-sm text-black/60 transition-colors hover:bg-black/5"
                    >
                      Clear
                    </button>
                  )}
                </form>

                <p className="text-xs text-black/50">
                  {pagination.total} {pagination.total === 1 ? 'subscriber' : 'subscribers'}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <p className="text-sm text-black/60">Loading subscribers...</p>
                  </div>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Mail size={28} className="mx-auto mb-3 text-black/25" />
                  <p className="font-medium text-black-dark">
                    {search ? 'No subscribers match that search.' : 'No subscribers yet.'}
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-sm text-black/55">
                    {search
                      ? 'Try a different email or name.'
                      : 'Opt-ins from checkout and the order confirmation page will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-black/[0.03]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                          Source
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                          Joined
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-black/50">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className="border-t border-gold/15 hover:bg-black/[0.02]"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-black-dark">
                            {subscriber.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-black/65">
                            {subscriber.name || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-black/65">
                            {SOURCE_LABELS[subscriber.source] || subscriber.source}
                          </td>
                          <td className="px-6 py-4 text-sm text-black/65">
                            {formatDate(subscriber.subscribedAt)}
                          </td>
                          <td className="px-6 py-4">
                            {subscriber.unsubscribedAt ? (
                              <span className="inline-flex rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-black/55">
                                Unsubscribed
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && pagination.pages > 1 && (
                <div className="flex items-center justify-between border-t border-gold/20 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                    disabled={pagination.page <= 1}
                    className="rounded-lg border border-black/15 px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <p className="text-xs text-black/50">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => Math.min(current + 1, pagination.pages))
                    }
                    disabled={pagination.page >= pagination.pages}
                    className="rounded-lg border border-black/15 px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
