# Talk Safe

**Talk Safe** is a mobile app designed to provide a safe and confidential platform for survivors, vistims and witnesses of gender-based violence to report incidents and receive emergency assistance.

## Problem Statement
Gender-based violence is widespread, yet many cases go unreported due to:

1. Fear of retaliation or stigma  
2. Lack of accessible reporting systems  
3. Inadequate or slow response from existing tools  
4. Limited awareness of available support services  

This leaves countless victims without timely help.

## Purpose & Background
GBV has severe emotional, physical and psychological consequences. Talk-safe bridges the gap between survivors and support systems by offering a confidential, user-friendly and safe reporting environment.
Our research shows that:
1. Victims often feel isolated, unsafe, and unsure where to seek help  
2. Many existing reporting mechanisms are not survivor-friendly  
3. Survivors need *anonymous, fast, and accessible* tools  
4. A mobile-first solution fits the needs of most users  
talk-safe aims to address these gaps.

## Solution Features
1. Incident Reporting
Report GBV incidents with:
- Location (manual or auto-select)
- Description of the incident  
- Optional evidence (images, audio, etc.)  
- Anonymous reporting option  

2. Emergency Assistance
Request immediate help through:
- One-tap emergency alert  
- Notification to trusted contacts or authorities  
- Quick Exit button for safety  

3. Support Services Directory
Access categorized support:
- Counseling centers  
- Healthcare facilities  
- Legal support  
- Safe shelters  

4. User-Friendly Interface
- Simple and intuitive navigation  
- Mobile-first responsive design  
- Accessible even in low-connectivity environments 

## Technology Stack
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express + JavaScript
- **Database**: MongoDB (Chosen for flexibility with unstructured data like incident reports and geospatial features)

## SOS Feature Implementation
See [Feature requirements.md](Feature%20requirements.md) for detailed frontend requirements.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Caritajoe18/Talk-Safe-Group-30-plp-hack.git
cd talk-safe
```

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and start the development server.

```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://localhost:3000`.

### 4. Database Configuration
Ensure your MongoDB instance is running. You may need to configure a `.env` file in the `backend` directory with your MongoDB connection string (e.g., `MONGODB_URI=mongodb://localhost:27017/safespace`).
