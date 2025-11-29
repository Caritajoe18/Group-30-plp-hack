# Talk Safe

**Talk Safe** is a mobile app designed to provide a safe and confidential platform for survivors, victims, and witnesses of gender-based violence to report incidents and receive emergency assistance.

## Problem Statement
Gender-based violence is widespread, yet many cases go unreported due to:

1. Fear of retaliation or stigma  
2. Lack of accessible reporting systems  
3. Inadequate or slow response from existing tools  
4. Limited awareness of available support services  

This leaves countless victims without timely help.

## Purpose & Background
GBV has severe emotional, physical, and psychological consequences. Talk Safe bridges the gap between survivors and support systems by offering a confidential, user-friendly, and safe reporting environment.

Research shows that:
1. Victims often feel isolated, unsafe, and unsure where to seek help  
2. Many existing reporting mechanisms are not survivor-friendly  
3. Survivors need *anonymous, fast, and accessible* tools  
4. A mobile-first solution fits the needs of most users  

Talk Safe aims to address these gaps.

## Solution Features
1. **Incident Reporting**  
   Report GBV incidents with:
   - Location (manual or auto-select)
   - Description of the incident  
   - Optional evidence (images, audio, etc.)  
   - Anonymous reporting option  

2. **Emergency Assistance**  
   Request immediate help through:
   - One-tap emergency alert  
   - Notification to trusted contacts or authorities  
   - Quick Exit button for safety  

3. **Support Services Directory**  
   Access categorized support:
   - Counseling centers  
   - Healthcare facilities  
   - Legal support  
   - Safe shelters  

4. **User-Friendly Interface**
   - Simple and intuitive navigation  
   - Mobile-first responsive design  
   - Accessible even in low-connectivity environments 

## Technology Stack
- **Frontend**: Vite + React + TypeScript  
- **Backend**: Node.js + Express + JavaScript  
- **Database**: MongoDB  

## SOS Feature Implementation
See [Feature requirements.md](Feature%20requirements.md) for detailed frontend requirements.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### 1. Clone the repository
``bash
git clone https://github.com/Caritajoe18/Talk-Safe-Group-30-plp-hack.git
cd Talk-Safe-Group-30-plp-hack

## Frontend Setup
cd frontend
npm install
npm run dev
The frontend will be available at http://localhost:5173.

## Backend Setup
cd backend
npm install
npm run dev
The backend server will run on http://localhost:3000.

## Database Configuration
Ensure your MongoDB instance is running. Create a .env file inside the backend directory:

MONGODB_URI=mongodb://localhost:27017/Talk-Safe-Group-30-plp-hack
PORT=3000

Talk-Safe-Group-30-plp-hack/
1. frontend/       # React + Vite application
2. backend/        # Node.js + Express API
 - src/
 - .env
3. README.md


## Future Improvements
1. Authentication for secure user accounts
2. SMS/Email alerts for emergency contacts
3. Voice-activated emergency reporting
4. Map-based visualization of support services
5. Multi-language support
6. Offline reporting (store & sync when online)

## Contributing
Contributions are welcome!
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request
We will review and merge contributions that improve security, accessibility, or functionality.

## Acknowledgements
Built with love as part of the PLP Hackathon.
Thank you to all contributors, mentors, and open-source libraries supporting this project