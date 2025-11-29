import './Home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  isLoggedIn: boolean;
  onLogin: (username: string, password: string) => boolean;
}

function Home({ isLoggedIn, onLogin }: HomeProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    onLogin(username, password);
  };

  const handlePanic = () => {
    navigate('/calculator');
  };

  return (
    <div className="home">
      {!isLoggedIn ? (
        <div className="auth-container">
          {!isSignUp ? (
            <div className="auth-card">
              <h2>Sign In</h2>
              <p>Enter your credentials to access Talk Safe</p>

              <input id="username" type="text" placeholder="Username" />
              <input id="password" type="password" placeholder="Password" />
              <button onClick={handleLogin}>Login</button>

              <p className="switch-auth">
                Don't have an account? <span onClick={() => setIsSignUp(true)}>Sign Up</span>
              </p>
            </div>
          ) : (
            <div className="auth-card">
              <h2>Sign Up</h2>
              <p>Registration is disabled. Use default credentials:</p>
              <p><b>Username:</b> admin</p>
              <p><b>Password:</b> admin123</p>

              <p className="switch-auth">
                Already have an account? <span onClick={() => setIsSignUp(false)}>Sign In</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <main className="main">
          <header className="header">
            <h1>Talk Safe</h1>
            <p>Your safe and confidential platform for support</p>
          </header>

          <div className="welcome">
            <h2>Welcome to Talk Safe</h2>
            <p>You are not alone. This platform provides a safe, confidential space to report incidents of gender-based violence and access immediate support services.</p>

            <div className="sos-section">
              <button className="sos-button" onClick={() => window.location.href = 'tel:911'}>
                🚨 SOS Emergency
              </button>
              <p className="sos-note">Hold for 3 seconds to activate emergency call</p>
            </div>

            {/* Quick action cards */}
            <div className="quick-actions">
              <div className="action-card" onClick={() => navigate('/report')}>
                <span className="action-icon">📝</span>
                <h3>Report Incident</h3>
                <p>Submit a confidential report</p>
              </div>
              <div className="action-card" onClick={() => navigate('/emergency')}>
                <span className="action-icon">🚨</span>
                <h3>Emergency Help</h3>
                <p>Immediate assistance & contacts</p>
              </div>
              <div className="action-card" onClick={() => navigate('/support')}>
                <span className="action-icon">🏥</span>
                <h3>Support Services</h3>
                <p>Find local resources & counseling</p>
              </div>
              <div className="action-card" onClick={() => navigate('/vault')}>
                <span className="action-icon">🗄️</span>
                <h3>Evidence Vault</h3>
                <p>Secure storage for your evidence</p>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <p>Talk Safe is a confidential platform. All reports are handled with care and respect. In case of immediate danger, please contact emergency services directly.</p>
        <p>&copy; 2025 Talk Safe. Built for Group 30 PLP Hackathon.</p>
      </footer>

      {isLoggedIn && (
        <button className="panic-btn" onClick={handlePanic} aria-label="Quick Exit">
          ⚠️
        </button>
      )}
    </div>
  );
}

export default Home;
