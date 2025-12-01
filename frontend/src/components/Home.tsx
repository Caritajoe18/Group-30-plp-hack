import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

interface HomeProps {
  isLoggedIn: boolean;
  onLogin: (username: string, password: string) => boolean;
}

function Home({ isLoggedIn, onLogin }: HomeProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(3);

  const navigate = useNavigate();

  // Triple-tap detection
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<number | null>(null);

  // Countdown reference
  const countdownRef = useRef<number | null>(null);

  const handleLogin = () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    onLogin(username, password);
  };

  const handlePanic = () => {
    navigate("/calculator");
  };

  const handleTapSOS = () => {
    tapCountRef.current += 1;

    if (tapCountRef.current === 3) {
      triggerSOSCountdown();
      tapCountRef.current = 0;
    }

    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 1000);
  };

  const triggerSOSCountdown = () => {
    setShowCountdown(true);
    setCount(3);

    countdownRef.current = window.setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          sendSOS();
          setShowCountdown(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setShowCountdown(false);
  };

  const sendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await fetch("/api/sos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: { lat: latitude, lng: longitude },
                message: "SOS! I need help!",
              }),
            });
            alert("SOS alert sent successfully!");
          } catch (err) {
            console.error(err);
            alert("Failed to send SOS alert.");
          }
        },
        () => {
          alert("Location unavailable. SOS sent without location.");
        }
      );
    } else {
      alert("Geolocation not supported. SOS sent.");
    }
  };

  return (
    <div className="home">
      {!isLoggedIn ? (
        <div className="auth-container">
          {!isSignUp ? (
            <div className="auth-card">
              <h2>Sign In</h2>
              <input id="username" type="text" placeholder="Username" />
              <input id="password" type="password" placeholder="Password" />
              <button onClick={handleLogin}>Login</button>
              <p className="switch-auth">
                Don't have an account?{" "}
                <span onClick={() => setIsSignUp(true)}>Sign Up</span>
              </p>
            </div>
          ) : (
            <div className="auth-card">
              <h2>Sign Up</h2>
              <p>Registration is disabled. Use default credentials:</p>
              <p>
                <b>Username:</b> admin
              </p>
              <p>
                <b>Password:</b> admin123
              </p>
              <p className="switch-auth">
                Already have an account?{" "}
                <span onClick={() => setIsSignUp(false)}>Sign In</span>
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
             <p>
              You are not alone. This platform provides a safe, confidential space to report
              incidents of gender-based violence and access immediate support services.
            </p>

            <div className="sos-section">
              {showCountdown ? (
                <div className="countdown-modal">
                  <p>SOS will be sent in {count} seconds</p>
                  <button onClick={cancelSOS} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleTapSOS}
                  className="sos-button"
                  aria-label="Triple-tap SOS"
                >
                  🚨 SOS Emergency
                </button>
              )}
            </div>

            <div className="quick-actions">
              <div
                className="action-card"
                onClick={() => navigate("/report")}
              >
                <span className="action-icon">📝</span>
                <h3>Report Incident</h3>
              </div>
              <div
                className="action-card"
                onClick={() => navigate("/emergency")}
              >
                <span className="action-icon">🚨</span>
                <h3>Emergency Help</h3>
              </div>
              <div
                className="action-card"
                onClick={() => navigate("/support")}
              >
                <span className="action-icon">🏥</span>
                <h3>Support Services</h3>
              </div>
              <div className="action-card" onClick={() => navigate("/vault")}>
                <span className="action-icon">🗄️</span>
                <h3>Evidence Vault</h3>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <p>&copy; © 2025 Talk Safe. Built with love, courage and commitment to stand with GBV survivors and drive lasting change</p>
        <button
          onClick={handlePanic}
          className="footer-panic-btn"
          aria-label="Quick exit - opens calculator"
        >
          ⚠️
        </button>
      </footer>
    </div>
  );
}

export default Home;