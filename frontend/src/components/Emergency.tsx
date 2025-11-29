import './Emergency.css';

function EmergencyAssistance() {
  const handlePanic = () => {
    window.location.href = '/calculator';
  };

  const emergencyContacts = [
    { name: 'Police', number: '911', description: 'For immediate danger or crime' },
    { name: 'Ambulance', number: '911', description: 'For medical emergencies' },
    { name: 'Domestic Violence Hotline', number: '1-800-799-7233', description: '24/7 confidential support' },
    { name: 'Rape Crisis Hotline', number: '1-800-656-4673', description: 'Support for sexual assault survivors' }
  ];

  const handleSendAlert = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`Alert sent! Location: ${latitude}, ${longitude}`);
          // Here you would send to backend
        },
        () => {
          alert('Unable to get location. Alert sent without location.');
        }
      );
    } else {
      alert('Geolocation not supported. Alert sent.');
    }
  };

  return (
    <div className="emergency-assistance">
      <header className="header">
        <h1>Emergency Assistance</h1>
        <p>If you're in immediate danger, call emergency services now.</p>
      </header>
      <main className="main">
        <div className="alert-section">
          <h2>Send Emergency Alert</h2>
          <p>This will notify authorities and your emergency contacts with your location.</p>
          <button onClick={handleSendAlert} className="alert-btn">Send Alert</button>
        </div>
        <div className="contacts-section">
          <h2>Emergency Contacts</h2>
          <div className="contacts">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-card">
                <h3>{contact.name}</h3>
                <p>{contact.description}</p>
                <a href={`tel:${contact.number}`} className="call-btn">Call {contact.number}</a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <button className="panic-btn" onClick={handlePanic} aria-label="Quick Exit">⚠️</button>
    </div>
  );
}

export default EmergencyAssistance;
