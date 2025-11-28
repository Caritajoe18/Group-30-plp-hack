import { useState } from 'react'
import './SupportServices.css'

function SupportServices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handlePanic = () => {
    window.location.href = '/calculator'
  }

  const allServices = {
    emergency: [
      { name: '24/7 National GBV Helpline', contact: '1-800-799-7233', description: 'Confidential support for gender-based violence', category: 'emergency' },
      { name: 'Police Emergency', contact: '911', description: 'For immediate danger or crime', category: 'emergency' },
      { name: 'Ambulance/Emergency Medical', contact: '911', description: 'Medical emergencies and trauma care', category: 'emergency' }
    ],
    accommodation: [
      { name: 'Women\'s Shelter Network', contact: '1-800-978-3600', description: 'Safe housing and support services', category: 'accommodation' },
      { name: 'Emergency Housing Assistance', contact: '211', description: 'Temporary housing and shelter referrals', category: 'accommodation' }
    ],
    medicalLegal: [
      { name: 'Sexual Assault Nurse Examiner (SANE)', contact: 'Local hospital', description: 'Specialized medical care for sexual assault survivors', category: 'medicalLegal' },
      { name: 'Legal Aid Society', contact: '1-800-533-5387', description: 'Free legal assistance for survivors', category: 'medicalLegal' }
    ]
  }

  // Filter services based on search term and category
  const getFilteredServices = (category: string) => {
    let services = category === 'all'
      ? Object.values(allServices).flat()
      : allServices[category as keyof typeof allServices] || []

    if (searchTerm) {
      services = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return services
  }

  return (
    <div className="support-services">
      <header className="header">
        <h1>Support Services Directory</h1>
        <p>Find local resources for counseling, legal aid, and more</p>
      </header>
      <main className="main">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'emergency' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('emergency')}
            >
              Emergency
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'accommodation' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('accommodation')}
            >
              Housing
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'medicalLegal' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('medicalLegal')}
            >
              Medical/Legal
            </button>
          </div>
        </div>
        {selectedCategory === 'all' ? (
          <>
            <section className="service-section">
              <h2>Emergency & Crisis Services</h2>
              <p>Life-saving, immediate needs</p>
              <div className="services-grid">
                {getFilteredServices('emergency').map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a href={`tel:${service.contact}`} className="contact-btn">Call {service.contact}</a>
                  </div>
                ))}
              </div>
            </section>

            <section className="service-section">
              <h2>Safe Accommodation</h2>
              <p>Critical for escaping dangerous situations</p>
              <div className="services-grid">
                {getFilteredServices('accommodation').map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a href={`tel:${service.contact}`} className="contact-btn">Call {service.contact}</a>
                  </div>
                ))}
              </div>
            </section>

            <section className="service-section">
              <h2>Basic Medical & Legal</h2>
              <p>Time-sensitive medical and legal needs</p>
              <div className="services-grid">
                {getFilteredServices('medicalLegal').map((service, index) => (
                  <div key={index} className="service-card">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <a href={`tel:${service.contact}`} className="contact-btn">Call {service.contact}</a>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="service-section">
            <h2>
              {selectedCategory === 'emergency' && 'Emergency & Crisis Services'}
              {selectedCategory === 'accommodation' && 'Safe Accommodation'}
              {selectedCategory === 'medicalLegal' && 'Basic Medical & Legal'}
            </h2>
            <div className="services-grid">
              {getFilteredServices(selectedCategory).map((service, index) => (
                <div key={index} className="service-card">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <a href={`tel:${service.contact}`} className="contact-btn">Call {service.contact}</a>
                </div>
              ))}
            </div>
            {getFilteredServices(selectedCategory).length === 0 && (
              <p className="no-results">No services found matching your search.</p>
            )}
          </section>
        )}
      </main>
      <button className="panic-btn" onClick={handlePanic} aria-label="Quick Exit">⚠️</button>
    </div>
  )
}

export default SupportServices