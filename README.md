# **Talk Safe**

**Talk Safe** is a mobile-first platform designed to provide a confidential, safe, and accessible way for survivors, victims, and witnesses of gender-based violence (GBV) to report incidents and request emergency assistance.

---

## **Problem Statement**

Gender-based violence remains widespread, yet many cases go unreported due to:

1. Fear of stigma or retaliation
2. Lack of reliable and accessible reporting channels
3. Slow or inadequate response from existing systems
4. Limited awareness of support services

As a result, many individuals are left without timely help.

---

## **Purpose & Background**

GBV has deep emotional, physical, and psychological effects. **Talk Safe** helps bridge the gap between survivors and support services by offering a secure, survivor-friendly reporting environment.

Our research shows that:

* Many victims feel isolated, unsafe, or unsure where to seek help
* Existing reporting systems are often not designed with survivors in mind
* Survivors need *fast, anonymous, and accessible* tools
* Mobile-first solutions best serve people in urgent or vulnerable situations

**Talk Safe** was created to address these needs.

---

## **Solution Features**

### **1. Incident Reporting**

Report GBV incidents with ease using:

* Manual or automatic location selection
* Detailed incident descriptions
* Optional evidence upload (images, audio, etc.)
* Anonymous reporting

### **2. Emergency Assistance**

Get immediate help via:

* One-tap emergency alert
* Notifications to trusted contacts or authorities
* Quick Exit button for safety

### **3. Support Services Directory**

Access categorized support services:

* Counseling and mental health centers
* Healthcare facilities
* Legal assistance
* Safe shelters

### **4. User-Friendly Interface**

* Simple, intuitive navigation
* Optimized for mobile use
* Works in low-connectivity environments

---

## **Technology Stack**

* **Frontend:** Vite + React + TypeScript
* **Backend:** Node.js + Express
* **Database:** MongoDB (ideal for flexible and semi-structured data such as incident reports and geolocation)

---

## **SOS Feature**

Detailed feature requirements can be found here:
📄 **[Feature requirements.md](Feature%20requirements.md)**

---

## **Setup Instructions**

### **Prerequisites**

* Node.js (v16 or later)
* npm or yarn
* MongoDB (local or Atlas)

---

### **1. Clone the Repository**

```bash
git clone https://github.com/Caritajoe18/Talk-Safe-Group-30-plp-hack.git
cd talk-safe
```

---

### **2. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:
➡️ **[http://localhost:5173](http://localhost:5173)**

---

### **3. Backend Setup**

```bash
cd backend
npm install
npm run dev
```

Backend server will run at:
➡️ **[http://localhost:3000](http://localhost:3000)**

---

### **4. Database Configuration**

Create a `.env` file inside the `backend` directory:

```
MONGODB_URI=mongodb://localhost:27017/safespace
```

Ensure your MongoDB instance is running.

---

## **Live Deployment**

* **Backend:** [https://talk-safe-app.onrender.com](https://talk-safe-app.onrender.com)
* **Frontend:** [https://talk-safe-app.vercel.app](https://talk-safe-app.vercel.app)

---

## **Contributors**

* **Chiemelie Carita Ndibe** – Backend Developer
* **Princess Glory Okogun** – Frontend Developer
* **Collins Mwangi** – Frontend Developer
* **Ikechukwu Raymond** – Backend Developer
* **Gloria Muema** – Frontend Developer

---

## **Acknowledgement**

We appreciate the **PLP team** for their guidance and support throughout the development of this project.

---

If you want, I can format this with badges, screenshots, or a table of contents to make it even more professional.
