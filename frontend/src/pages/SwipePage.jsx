import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import AppShell from '../components/frontend/AppShell'
import MatchModal from '../components/frontend/MatchModal'
import SwipeCard from '../components/frontend/SwipeCard'
import { useSwipe } from '../hooks/useSwipe'
import { getEcho } from '../lib/echo'
import { useAuthStore } from '../store/authStore'

export default function SwipePage() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const token = useAuthStore((state) => state.token)
  const [cards, setCards] = useState([])
  const [filters, setFilters] = useState({
    industry: '',
    stage: '',
    location: '',
    skills: '',
    work_type: '',
    experience_min: '',
  })
  const [liveMatch, setLiveMatch] = useState(null)

  const swipeMutation = useSwipe()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/me')
      return data
    },
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
    }
  }, [meQuery.data, setUser])

  const activeUser = meQuery.data || user

  const discoverQuery = useQuery({
    queryKey: ['discover', filters, activeUser?.role],
    enabled: Boolean(activeUser?.role),
    queryFn: async () => {
      const { data } = await api.get('/discover', { params: filters })
      return data
    },
  })

  useEffect(() => {
    setCards(discoverQuery.data?.data || [])
  }, [discoverQuery.data])

  useEffect(() => {
    if (!activeUser?.id || !token) {
      return undefined
    }

    const echo = getEcho(token)

    if (!echo) {
      return undefined
    }

    const channel = echo.private(`users.${activeUser.id}`)

    channel.listen('.MatchCreated', (event) => {
      const partner = activeUser.role === 'startup' ? event.talent : event.startup
      setLiveMatch({ id: event.id, name: partner?.name || 'pengguna baru' })
    })

    return () => {
      channel.stopListening('.MatchCreated')
      echo.leave(`users.${activeUser.id}`)
    }
  }, [activeUser, token])

  const currentCard = cards[0]

  const roleFilterKeys = useMemo(() => {
    if (activeUser?.role === 'talent') {
      return ['industry', 'stage', 'location']
    }

    return ['skills', 'work_type', 'experience_min']
  }, [activeUser?.role])

  const handleSwipe = async (direction, swipedId) => {
    if (!activeUser) {
      return
    }

    try {
      const response = await swipeMutation.mutateAsync({ direction, swipedId })
      setCards((prev) => prev.filter((card) => card.id !== swipedId))

      if (response.match && response.match_id) {
        const { data } = await api.get(`/matches/${response.match_id}`)
        const partner = activeUser.role === 'startup' ? data.talent : data.startup
        setLiveMatch({ id: response.match_id, name: partner?.name || 'pengguna baru' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  if (meQuery.isLoading && !user) {
    return <AppShell title="Swipe Discovery">Memuat data pengguna...</AppShell>
  }

  return (
    <AppShell title="Swipe Discovery">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Filter Discovery</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {roleFilterKeys.includes('industry') && (
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Industry"
              value={filters.industry}
              onChange={(event) => handleFilterChange('industry', event.target.value)}
            />
          )}
          {roleFilterKeys.includes('stage') && (
            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filters.stage}
              onChange={(event) => handleFilterChange('stage', event.target.value)}
            >
              <option value="">Semua Stage</option>
              <option value="idea">Idea</option>
              <option value="mvp">MVP</option>
              <option value="growth">Growth</option>
              <option value="scaling">Scaling</option>
            </select>
          )}
          {roleFilterKeys.includes('location') && (
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Lokasi"
              value={filters.location}
              onChange={(event) => handleFilterChange('location', event.target.value)}
            />
          )}
          {roleFilterKeys.includes('skills') && (
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Skills (React,Laravel)"
              value={filters.skills}
              onChange={(event) => handleFilterChange('skills', event.target.value)}
            />
          )}
          {roleFilterKeys.includes('work_type') && (
            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={filters.work_type}
              onChange={(event) => handleFilterChange('work_type', event.target.value)}
            >
              <option value="">Semua Work Type</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          )}
          {roleFilterKeys.includes('experience_min') && (
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              type="number"
              min={0}
              placeholder="Min Experience"
              value={filters.experience_min}
              onChange={(event) => handleFilterChange('experience_min', event.target.value)}
            />
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <h2 className="text-lg font-bold">Kartu Discovery</h2>
        <div className="relative mt-6 h-[460px]">
          {discoverQuery.isLoading && <p>Memuat kartu...</p>}
          {!discoverQuery.isLoading && !currentCard && <p>Tidak ada kartu lagi. Coba ubah filter.</p>}
          {currentCard && <SwipeCard card={currentCard} onSwipe={handleSwipe} />}
        </div>

        {currentCard && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleSwipe('left', currentCard.id)}
              className="rounded-xl border border-red-400 px-5 py-2 text-sm font-semibold text-red-300"
            >
              Pass
            </button>
            <button
              type="button"
              onClick={() => handleSwipe('right', currentCard.id)}
              className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900"
            >
              Like
            </button>
          </div>
        )}
      </section>

      {liveMatch && <MatchModal match={liveMatch} onClose={() => setLiveMatch(null)} />}
    </AppShell>
  )
}
