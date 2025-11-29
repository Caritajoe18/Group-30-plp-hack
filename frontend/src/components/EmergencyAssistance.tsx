import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./EmergencyAssistance.css";

function EmergencyAssistance() {
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(3);
  const countdownRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: "Police", number: "911", description: "For immediate danger or crime" },
    { name: "Ambulance", number: "911", description: "For medical emergencies" },
    { name: "Domestic Violence Hotline", number: "1-800-799-7233", description: "24/7 confidential support" },
    { name: "Rape Crisis Hotline", number: "1-800-656-4673", description: "Support for sexual assault survivors" }
  ];

  // Trigger SOS countdown
  const triggerSOSCountdown = () => {
    setShowCountdown(true);
    setCount(3);

    countdownRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          sendSOS();
          setShowCountdown(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowCountdown(false);
  };

  const sendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          try {
            await fetch("/api/sos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: { lat: latitude, lng: longitude },
                message: "SOS! I need help!"
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

  const handlePanic = () => navigate("/calculator");

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

          {showCountdown ? (
            <div className="countdown-modal">
              <p>SOS will be sent in {count} seconds</p>
              <button onClick={cancelSOS} className="cancel-btn">Cancel</button>
            </div>
          ) : (
            <button onClick={triggerSOSCountdown} className="alert-btn">Send Alert</button>
          )}
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
