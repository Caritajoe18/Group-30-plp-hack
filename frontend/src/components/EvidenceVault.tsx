import { useState } from 'react'
import { Link } from 'react-router-dom'
import './EvidenceVault.css'

function EvidenceVault() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Mock evidence data
  const evidenceItems = [
    { id: 1, type: 'photo', name: 'incident_photo_001.jpg', date: '2025-01-15', size: '2.3 MB' },
    { id: 2, type: 'audio', name: 'voice_note_002.mp3', date: '2025-01-14', size: '1.8 MB' },
    { id: 3, type: 'photo', name: 'evidence_003.jpg', date: '2025-01-13', size: '3.1 MB' },
    { id: 4, type: 'document', name: 'report_draft.pdf', date: '2025-01-12', size: '0.5 MB' },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in real app, this would be secure)
    if (password === '1234') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'photo': return '📸'
      case 'audio': return '🎵'
      case 'document': return '📄'
      default: return '📁'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="evidence-vault">
        <header className="header">
          <h1>🔒 Evidence Vault</h1>
          <p>Secure storage for your evidence</p>
        </header>
        <main className="main">
          <div className="login-form">
            <h2>Enter Password</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PIN"
                maxLength={4}
                className="pin-input"
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="login-btn">Unlock Vault</button>
            </form>
          </div>
          <Link to="/" className="back-link">Back to Home</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="evidence-vault">
      <header className="header">
        <h1>🗄️ Evidence Vault</h1>
        <p>Secure storage for your evidence</p>
      </header>
      <main className="main">
        <div className="vault-info">
          <div className="security-indicator">
            <span className="lock-icon">🔐</span>
            <span>Encrypted & Secure</span>
          </div>
          <p className="vault-description">
            Your evidence is encrypted and hidden from your device gallery.
            Only you can access it with your PIN.
          </p>
        </div>

        <div className="evidence-grid">
          {evidenceItems.map((item) => (
            <div key={item.id} className="evidence-item">
              <div className="evidence-icon">{getIcon(item.type)}</div>
              <div className="evidence-details">
                <h3>{item.name}</h3>
                <p>{item.date}</p>
                <span className="file-size">{item.size}</span>
              </div>
              <div className="evidence-actions">
                <button className="view-btn">👁️</button>
                <button className="export-btn">📤</button>
              </div>
            </div>
          ))}
        </div>

        <div className="vault-actions">
          <button className="add-evidence-btn">➕ Add Evidence</button>
          <button className="export-all-btn">📦 Export All</button>
        </div>

        <Link to="/" className="back-link">Back to Home</Link>
      </main>
    </div>
  )
}

export default EvidenceVault