import './Home.css'

function Home() {
  const handlePanic = () => {
    window.location.href = '/calculator'
  }
  return (
    <div className="home">
      <header className="header">
        <h1>Talk Safe</h1>
        <p>Your safe and confidential platform for support</p>
        <a href="/signin">Sign In</a>
<a href="/signup" style={{ marginLeft: "10px" }}>Sign Up</a>

      </header>
      <main className="main">
        <div className="welcome">
          <h2>Welcome to Talk Safe</h2>
          <p>You are not alone. This platform provides a safe, confidential space to report incidents of gender-based violence and access immediate support services.</p>

          <div className="sos-section">
            <button className="sos-button" onClick={() => window.location.href = 'tel:911'}>
              🚨 SOS Emergency
            </button>
            <p className="sos-note">Hold for 3 seconds to activate emergency call</p>
          </div>

          <div className="quick-actions">
            <div className="action-card">
              <span className="action-icon">📝</span>
              <h3>Report Incident</h3>
              <p>Submit a confidential report</p>
            
            </div>
            <div className="action-card">
              <span className="action-icon">🚨</span>
              <h3>Emergency Help</h3>
              <p>Immediate assistance & contacts</p>
            </div>
            <div className="action-card">
              <span className="action-icon">🏥</span>
              <h3>Support Services</h3>
              <p>Find local resources & counseling</p>
            </div>
            <div className="action-card">
              <span className="action-icon">🗄️</span>
              <h3>Evidence Vault</h3>
              <p>Secure storage for your evidence</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>Talk Safe is a confidential platform. All reports are handled with care and respect. In case of immediate danger, please contact emergency services directly.</p>
        <p>&copy; 2025 Talk Safe. Built for Group 30 PLP Hackathon.</p>
      </footer>
      <button className="panic-btn" onClick={handlePanic} aria-label="Quick Exit">⚠️</button>
    </div>
  )
}

export default Home