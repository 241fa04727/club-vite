import React, { useState, useMemo, useEffect } from 'react'
import clubs from './data/clubs'
import FilterBar from './components/FilterBar'
import ClubCard from './components/ClubCard'
import { ClubDetail, InterestForm } from './components/ClubDetail'
import './App.css'

/* ── Toast ─────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
      {toast.message}
    </div>
  )
}

/* ── App ────────────────────────────────────────── */
function App() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery]   = useState('')
  const [selectedClub, setSelectedClub] = useState(null)
  const [formClub, setFormClub]         = useState(null)
  const [toast, setToast]               = useState(null)
  const [submitted, setSubmitted]       = useState([]) // track submitted club ids

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: false })
    setTimeout(() => setToast(t => t ? { ...t, visible: true } : t), 50)
    setTimeout(() => setToast(t => t ? { ...t, visible: false } : t), 3000)
    setTimeout(() => setToast(null), 3400)
  }

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return clubs.filter(club => {
      const matchesCat = activeFilter === 'all' || club.category === activeFilter
      const matchesQ   = !q ||
        club.name.toLowerCase().includes(q) ||
        club.tagline.toLowerCase().includes(q) ||
        club.tags.some(t => t.toLowerCase().includes(q)) ||
        club.category.toLowerCase().includes(q)
      return matchesCat && matchesQ
    })
  }, [activeFilter, searchQuery])

  const handleFormSubmit = (data) => {
    setSubmitted(s => [...s, formClub.id])
    setFormClub(null)
    setSelectedClub(null)
    showToast(`✅ Interest submitted for ${data.club}! Check your email.`, 'success')
  }

  const totalMembers = clubs.reduce((s, c) => s + c.members, 0)

  return (
    <div>
      {/* Hero */}
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Your campus, your people</p>
          <h1 className="hero-title">Find your <em>club</em>.</h1>
          <p className="hero-sub">
            {clubs.length} active clubs · {totalMembers.toLocaleString()} students doing things that matter
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <FilterBar
          activeFilter={activeFilter} onFilterChange={setActiveFilter}
          searchQuery={searchQuery}   onSearchChange={setSearchQuery}
        />

        <p className="results-count">
          {filtered.length === clubs.length
            ? `All ${clubs.length} clubs`
            : `${filtered.length} of ${clubs.length} clubs`}
          {activeFilter !== 'all' && <span> in <strong>{activeFilter}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </p>

        <div className="club-grid">
          {filtered.length > 0 ? (
            filtered.map(club => (
              <div key={club.id} className="card-wrap">
                <ClubCard club={club} onSelect={setSelectedClub} />
                {submitted.includes(club.id) && (
                  <div className="submitted-badge">✅ Applied</div>
                )}
              </div>
            ))
          ) : (
            <div className="empty">
              <span style={{fontSize:'48px'}}>🔍</span>
              <h3>No clubs found</h3>
              <p>Try a different search or filter.</p>
              <button className="btn-reset" onClick={() => { setActiveFilter('all'); setSearchQuery('') }}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Club Detail Modal */}
      {selectedClub && !formClub && (
        <ClubDetail
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
          onShowForm={(club) => setFormClub(club)}
        />
      )}

      {/* Interest Form Modal */}
      {formClub && (
        <InterestForm
          club={formClub}
          onClose={() => setFormClub(null)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  )
}

export default App
