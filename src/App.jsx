import React, { useState, useMemo } from 'react'
import clubs from './data/clubs'
import FilterBar from './components/FilterBar'
import ClubCard from './components/ClubCard'
import ClubDetail from './components/ClubDetail'
import './App.css'

function App() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClub, setSelectedClub] = useState(null)

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return clubs.filter(club => {
      const matchesCat = activeFilter === 'all' || club.category === activeFilter
      const matchesQ = !q ||
        club.name.toLowerCase().includes(q) ||
        club.tagline.toLowerCase().includes(q) ||
        club.tags.some(t => t.toLowerCase().includes(q)) ||
        club.category.toLowerCase().includes(q)
      return matchesCat && matchesQ
    })
  }, [activeFilter, searchQuery])

  const totalMembers = clubs.reduce((s, c) => s + c.members, 0)

  return (
    <div>
      <header className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Your campus, your people</p>
          <h1 className="hero-title">Find your <em>club</em>.</h1>
          <p className="hero-sub">{clubs.length} active clubs · {totalMembers.toLocaleString()} students</p>
        </div>
      </header>

      <main className="main">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
              <ClubCard key={club.id} club={club} onSelect={setSelectedClub} />
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

      {selectedClub && (
        <ClubDetail club={selectedClub} onClose={() => setSelectedClub(null)} />
      )}
    </div>
  )
}

export default App
