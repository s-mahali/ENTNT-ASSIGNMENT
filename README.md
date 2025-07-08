# DENTAL CENTER MANAGEMENT SYSTEM

## Overview

This project is a **Dental Center Management System** developed as part of the ENTNT Junior Software Engineer technical assessment. The application is designed to streamline the operations of a dental clinic, providing functionalities for managing patient records, appointments/incidents, and treatments. All data management is handled **entirely on the frontend using localStorage**—no backend or external database is used.

---

## Table of Contents

- [Features](#features)
- [Demo/Test Credentials](#demotest-credentials)
- [How to Run](#how-to-run)
- [How to Use](#how-to-use)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Known Issues](#known-issues)
- [Technical Decisions](#technical-decisions)

---

## Features

### User Authentication (Simulated)
- Hardcoded users with roles: **Admin (Dentist)** and **Patient**
- Login with email/password
- Session persistence via `localStorage`
- Role-based access control on the frontend

### Patient Management (Admin-only)
- View, add, edit, and delete patients
- Patient details: full name, DOB, contact info, health info

### Appointment / Incident Management (Admin-only)
- Manage multiple incidents/appointments per patient
- Fields: title, description, comments, appointment datetime
- After appointment: add cost, treatment, status, next date, and upload files (e.g., invoices, images)

### Calendar View (Admin-only)
- Monthly/weekly view of upcoming appointments
- Days with appointments are visually highlighted
- Clicking a day shows scheduled treatments

### Dashboard (Landing Page)
- Displays KPIs: next 10 appointments, top patients, pending/completed treatments, revenue, etc.

### Patient View (Role: Patient)
- Patients can view only their own data
- View upcoming appointments, past treatments, and medical history

### Bonus Features
- Patient can view their own appointments and medical history
- Admin dashboard with statistics

---

## Demo/Test Credentials

**Patient User:**
- Email: `john@entnt.in`
- Password: `patient123`
- Role: `patient`

**Admin User:**
- Email: `admin@entnt.in`
- Password: `admin123`
- Role: `admin`

---

## How to Run

1. **Ensure you have Node.js and npm installed.**
2. **Clone the repository:**
   ```sh
   git clone <repository-url>
    ```
3. **Navigate to the project directory:**
   ```sh
   cd client 
   ```   
4. **Install dependencies:**
   ```sh
   npm install
   ```
5. **Start the development server:**
   ```sh
   npm run dev
   ```   
## How to Use
Admins/Dentists:
Manage user accounts, view reports, oversee the system
Manage patient records, schedule appointments, record treatments

Patients:
View their appointments, medical history, and treatment plans

## Testing Functionality

Login as a user (see credentials above)
Create a patient account after logging in as a patient
Login as admin to manage patients, appointments, and view statistics

## Architecture & Tech Stack
Frontend: React (with Vite)
State Management: Redux
Routing: React Router
Styling: Tailwind CSS & Material UI (MUI) components
Data Storage: Browser localStorage only (no backend)

## Known Issues
Some issues exist in incident management, patient name display, and appointment management.

Technical Decisions
All data is stored and managed in the browser using localStorage to comply with the assessment requirements (no backend).
Role-based access is enforced on the frontend for demonstration purposes.
UI is built with a combination of Tailwind CSS and MUI for rapid development and modern appearance.
The app is fully responsive and works well on both desktop and mobile devices.

Thankyou for reviewing this project! I look forward to your feedback.


