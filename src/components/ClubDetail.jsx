import React, { useEffect } from 'react'
import './ClubDetail.css'

const EMOJI = { coding:'💻', sports:'⚽', arts:'🎨', entrepreneurship:'🚀', science:'🔭', social:'🌍' }

function ClubDetail({ club, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    // Stop the page behind the modal from scrolling while it's open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`panel panel-${club.category}`}>
        <div className="panel-stripe" />
        <button className="btn-close" onClick={onClose}>✕</button>
        <div className="panel-head">
          <span className="panel-emoji">{EMOJI[club.category]}</span>
          <div>
            <span className={`badge badge-${club.category}`}>{club.category}</span>
            <h2 className="panel-name">{club.name}</h2>
            <p className="panel-tagline">{club.tagline}</p>
          </div>
        </div>
        <p className="panel-desc">{club.description}</p>
        <div className="info-grid">
          <div className="info-item"><span className="info-label">Members</span><span className="info-val">{club.members}</span></div>
          <div className="info-item"><span className="info-label">Founded</span><span className="info-val">{club.founded}</span></div>
          <div className="info-item"><span className="info-label">Open to all</span><span className="info-val">{club.openToAll ? '✅ Yes' : '📋 Application'}</span></div>
          <div className="info-item"><span className="info-label">Contact</span><span className="info-val">{club.contact}</span></div>
        </div>
        <div className="panel-section">
          <h4 className="section-title">When &amp; Where</h4>
          <p className="panel-meetings">{club.meetings}</p>
        </div>
        <div className="panel-section">
          <h4 className="section-title">Focus Areas</h4>
          <div className="panel-tags">
            {club.tags.map(t => <span key={t} className={`panel-tag badge-${club.category}`}>{t}</span>)}
          </div>
        </div>
        <a className={`btn-cta cta-${club.category}`} href={`mailto:${club.contact}?subject=${encodeURIComponent(`Interested in joining ${club.name}`)}`}>Express Interest</a>
      </div>
    </div>
  )
}

export default ClubDetail
