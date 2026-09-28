import React from 'react'
import './FilterBar.css'

const FILTERS = [
  { value:'all',            label:'All Clubs' },
  { value:'coding',        label:'💻 Coding' },
  { value:'sports',        label:'⚽ Sports' },
  { value:'arts',          label:'🎨 Arts' },
  { value:'entrepreneurship', label:'🚀 Entrepreneurship' },
  { value:'science',       label:'🔭 Science' },
  { value:'social',        label:'🌍 Social' },
]

function FilterBar({ activeFilter, onFilterChange, searchQuery, onSearchChange }) {
  return (
    <div className="filterbar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search clubs by name or tag…"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearchChange('')}>✕</button>
        )}
      </div>
      <div className="pills">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`pill pill-${f.value}${activeFilter === f.value ? ' active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
