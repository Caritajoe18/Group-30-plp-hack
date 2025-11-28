import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import './Settings.css'

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    emergencyContacts: [
      { name: 'Emergency Contact 1', number: '1-800-799-7233' },
      { name: 'Emergency Contact 2', number: '1-800-978-3600' },
      { name: 'Emergency Contact 3', number: '1-800-533-5387' }
    ],
    quickExitEnabled: true,
    shakeToExit: false,
    tripleTapToExit: true,
    language: 'en',
    vaultPin: '1234'
  })

  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = [...settings.emergencyContacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    setSettings({ ...settings, emergencyContacts: updatedContacts })
  }

  const handleSettingChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = () => {
    // Save settings (would persist to localStorage/backend in real app)
    localStorage.setItem('talkSafeSettings', JSON.stringify(settings))
    alert('Settings saved successfully!')
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear data logic
      alert('Data cleared successfully!')
    }
  }

  return (
    <div className="settings">
      <header className="header">
        <h1>⚙️ Settings & Safety</h1>
        <p>Customize your safety preferences</p>
      </header>
      <main className="main">
        <div className="settings-section">
          <h2>🚨 Emergency Contacts</h2>
          <p>Contacts who will receive your location during emergencies</p>
          {settings.emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-input">
              <input
                type="text"
                placeholder="Contact name"
                value={contact.name}
                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={contact.number}
                onChange={(e) => handleContactChange(index, 'number', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="settings-section">
          <h2>🛡️ Quick Exit Settings</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.quickExitEnabled}
                onChange={(e) => handleSettingChange('quickExitEnabled', e.target.checked)}
              />
              Enable Quick Exit
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.shakeToExit}
                onChange={(e) => handleSettingChange('shakeToExit', e.target.checked)}
              />
              Shake phone to exit
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.tripleTapToExit}
                onChange={(e) => handleSettingChange('tripleTapToExit', e.target.checked)}
              />
              Triple-tap to exit
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔐 Evidence Vault</h2>
          <div className="setting-item">
            <label htmlFor="vaultPin">Vault PIN</label>
            <input
              id="vaultPin"
              type="password"
              value={settings.vaultPin}
              onChange={(e) => handleSettingChange('vaultPin', e.target.value)}
              maxLength={4}
              className="pin-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🌐 Preferences</h2>
          <div className="setting-item">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>🎨 Appearance</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              Dark Mode
            </label>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0 0 0' }}>
              Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>💾 Data Management</h2>
          <button className="export-btn">📤 Export Data</button>
          <button className="clear-btn" onClick={handleClearData}>🗑️ Clear All Data</button>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={handleSave}>💾 Save Settings</button>
        </div>

        <Link to="/" className="back-link">Back to Home</Link>
      </main>
    </div>
  )
}

export default Settings