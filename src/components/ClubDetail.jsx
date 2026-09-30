import React, { useEffect, useState } from 'react'
import './ClubDetail.css'

const EMOJI = { coding:'💻', sports:'⚽', arts:'🎨', entrepreneurship:'🚀', science:'🔭', social:'🌍' }

const WEB3FORMS_KEY = '195a36d9-7ac4-4c29-9d94-fbe64280087a'

/* ── Interest Form ─────────────────────────────── */
function InterestForm({ club, onClose, onSubmit }) {
  const [form, setForm] = useState({ name:'', email:'', year:'', message:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.year)         e.year  = 'Select your year'
    return e
  }

  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Interest: ${form.name} wants to join ${club.name}`,
          from_name: form.name,
          replyto: form.email,
          name: form.name,
          email: form.email,
          year_of_study: form.year,
          club_name: club.name,
          club_contact: club.contact,
          message: form.message || '(no message provided)',
          botcheck: '',
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Submission failed')
    } catch (err) {
      setLoading(false)
      setErrors({ submit: 'Failed to send — please try again or email the club directly.' })
      return
    }
    setLoading(false)
    onSubmit({ ...form, club: club.name })
  }

  return (
    <div className="form-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`form-panel form-panel--${club.category}`}>
        <div className="form-stripe" />
        <button className="btn-close" onClick={onClose}>✕</button>

        <div className="form-head">
          <span className="form-emoji">{EMOJI[club.category]}</span>
          <div>
            <h3 className="form-title">Join {club.name}</h3>
            <p className="form-sub">Fill in your details and we'll get back to you soon.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className={`form-group${errors.name ? ' has-error' : ''}`}>
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className={`form-group${errors.email ? ' has-error' : ''}`}>
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>
          </div>

          <div className={`form-group${errors.year ? ' has-error' : ''}`}>
            <label>Year of Study *</label>
            <select value={form.year} onChange={e => handleChange('year', e.target.value)}>
              <option value="">Select your year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
            {errors.year && <span className="err-msg">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label>Why do you want to join? <span className="optional">(optional)</span></label>
            <textarea
              rows={3}
              placeholder={`Tell ${club.name} what excites you about this club...`}
              value={form.message}
              onChange={e => handleChange('message', e.target.value)}
            />
          </div>

          <div className="form-info-row">
            <span>📧 Your interest will be sent to</span>
            <strong>{club.contact}</strong>
          </div>

          {errors.submit && (
            <p style={{color:'#DC2626',fontSize:'13px',marginBottom:'8px',textAlign:'center'}}>
              ⚠️ {errors.submit}
            </p>
          )}

          <button type="submit" className={`btn-submit btn-submit--${club.category}`} disabled={loading}>
            {loading
              ? <><span className="spinner" /> Sending...</>
              : '🚀 Submit Interest'
            }
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Club Detail Modal ─────────────────────────── */
function ClubDetail({ club, onClose, onShowForm }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
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

        <button className={`btn-cta cta-${club.category}`} onClick={() => onShowForm(club)}>
          🚀 Express Interest
        </button>
      </div>
    </div>
  )
}

export { ClubDetail, InterestForm }
