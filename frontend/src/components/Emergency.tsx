import './Emergency.css';
import { useState } from 'react';

function Emergency() {
  const [location, setLocation] = useState<string | null>(null);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleSendAlert = () => {
    if (location) {
      // Here you could call your backend to notify emergency contacts
      alert(`Alert sent with your location: ${location}`);
    } else {
      alert('Location not available');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`
          );
        },
        (err) => alert('Unable to get location')
      );
    } else {
      alert('Geolocation not supported by your browser');
    }
  };

  return (
    <div className="emergency-page">
      <h1>Emergency Help</h1>
      <button onClick={() => handleCall('911')}>Call Police/Emergency</button>
      <button onClick={getLocation}>Share My Location</button>
      <button onClick={handleSendAlert}>Alert Trusted Contacts</button>

      {location && (
        <p>
          Your location: <a href={location}>View on Map</a>
        </p>
      )}
    </div>
  );
}

export default Emergency;
