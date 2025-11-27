# Safe-space

**Safe-space** is a mobile app designed to provide a safe and confidential platform for survivors of gender-based violence to report incidents and receive emergency assistance.

## Problem Statement
Gender-based violence is a pervasive issue affecting most communities, with many cases going unreported due to fear, stigma, or lack of access to support services. Existing reporting mechanisms often fall short, leaving victims without timely assistance or support.

## Background
Gender-based violence can have severe physical, emotional, and psychological consequences. The app aims to bridge the gap between victims and support services, ensuring timely intervention and support.

## Research
Our research indicates that:
- Victims often feel isolated and helpless.
- Existing reporting mechanisms are often inadequate or inaccessible.
- There is a need for a safe, confidential, and user-friendly platform for reporting incidents.

## Solution
The Safe-space mobile app will provide:
1. **Incident Reporting**: Users can report incidents of gender-based violence, including location, description, and evidence.
2. **Emergency Assistance**: Users can request immediate assistance, triggering alerts to nearby authorities or designated contacts.
3. **Support Services**: Users can access a directory of local support services, including counseling, legal aid, and medical assistance.
4. **Safety Features**: Includes anonymous reporting.
5. **User-Friendly Interface**: Intuitive design ensuring ease of use for victims.

## Technology Stack
- **Frontend**: Vite + React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Chosen for flexibility with unstructured data like incident reports and geospatial features)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd safe-space
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
