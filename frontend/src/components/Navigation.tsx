import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  // Hide navigation on calculator page
  if (location.pathname === '/calculator') {
    return null
  }

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
    </nav>
  )
}

export default Navigation