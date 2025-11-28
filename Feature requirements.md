# Feature Requirements

## SOS Feature Implementation (Frontend Requirements)
The backend exposes `POST /api/sos` to handle SOS alerts. The frontend is responsible for:

1.  **Gesture Detection**:
    - Implement **Triple-tap** or **Shake** detection to trigger the SOS flow.
2.  **Countdown UI**:
    - Display a **3-second countdown** overlay with a "CANCEL" button to prevent false positives.
3.  **Location Capture**:
    - Immediately request high-accuracy GPS coordinates.
4.  **API Call**:
    - If not cancelled, send a POST request to `/api/sos` with:
    ```json
    {
      "location": { "lat": 12.34, "lng": 56.78 },
      "message": "SOS! I need help!",
      "contactIds": ["optional-contact-ids"]
    }
    ```
