# 🎓 Bharat College Management System 🎓

**Bharat College of Technology** is a full-featured college management system designed to streamline administration and improve user experience for both students and admins. The platform provides secure authentication, dynamic data handling, and responsive UI.

---

## 📚 College Management Web Application

A full-stack MERN-based college management system for Bharat College of Technology.

## 🚀 Technologies Used

- **Frontend:** React.js, Bootstrap, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs, Cookie-based sessions
- **File Uploads:** Multer + Cloudinary
- **Email Service:** Nodemailer
- **PDF & Reports:** html2pdf.js, jsPDF
- **Deployment:** Render (Backend), Vercel/Netlify (Frontend)

## 🔐 Roles & Authentication

### 👨‍🎓 Student

- View and update personal profile
- View enrolled courses and subjects
- Download ID cards and fee receipts
- View fee status and make enquiries

### 🧑‍💼 Admin

- Manage student profiles and registrations
- Add/edit/delete courses and subjects
- Assign students to courses and subjects
- Handle enquiries and student fees
- Access dashboards and reports

---

## ✨ Features

- 🔒 **Authentication & Authorization**

  - Secure login/signup using JWT
  - Role-based access (Admin, Student, Teacher)

- 🧾 **Profile Management**

  - View and update personal information
  - Upload profile images
  - Role-based dynamic profile display

- 🎓 **Course & Subject Management**

  - Add and manage courses, and subject
  - Assign students to specific course
  - Seat availability indicators and validation

- 📋 **Enquiry & Registration**

  - Submit student enquiries
  - Convert enquiry to registration

- 💳 **Fee Management**

  - View, collect, and manage student fees
  - Generate and print/download fee receipts (A5 format)

- 🆔 **ID Card Generation**

  - Front and back ID card with photo and student info
  - Print and download options

- 📦 **Dashboard Panels**
  - Filtered student listing with pagination
  - Quick actions: view, edit, export, etc.

---

## 🛠️ Tech Stack

- **Frontend**: React, Bootstrap, Axios, React Router, html2pdf.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Cookies

---

## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/bharat-college-of-technology.git
cd bharat-college-of-technology

# Setup frontend
cd frontend
npm install
npm start

# Setup backend
cd ../backend
npm install
nodemon server.js
```
