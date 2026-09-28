import React from 'react'
import './ClubCard.css'

const EMOJI = { coding:'💻', sports:'⚽', arts:'🎨', entrepreneurship:'🚀', science:'🔭', social:'🌍' }

function ClubCard({ club, onSelect }) {
  return (
    <button className={`club-card cat-${club.category}`} onClick={() => onSelect(club)}>
      <div className="card-accent" />
      <div className="card-header">
        <span className="card-emoji">{EMOJI[club.category]}</span>
        <span className={`badge badge-${club.category}`}>{club.category}</span>
      </div>
      <h3 className="card-name">{club.name}</h3>
      <p className="card-tagline">{club.tagline}</p>
      <div className="card-tags">
        {club.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
      </div>
      <div className="card-footer">
        <span className="card-members"><span className="dot" /> {club.members} members</span>
        {!club.openToAll && <span className="card-selective">By application</span>}
      </div>
    </button>
  )
}

export default ClubCard
