// Navigation.tsx
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

interface NavigationProps {
  isAuthenticated: boolean
  onLogout?: () => void
}

function Navigation({ isAuthenticated, onLogout }: NavigationProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/report', label: 'Report', icon: '📝' },
    { path: '/emergency', label: 'Emergency', icon: '🚨' },
    { path: '/support', label: 'Support', icon: '🏥' },
    { path: '/vault', label: 'Vault', icon: '🗄️' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      {isAuthenticated && (
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navigation
