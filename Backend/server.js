require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDatabase = require('./database')
const studentRoute = require('./routes/StudentRoute')
const courseRoute = require('./routes/CourseRoute')
const UserRoute = require('./routes/UserRoute')
const dashboardRoute = require('./routes/DashboardRoute')
const ForgotPassword = require('./routes/ForgotPassword')
const subjectRoute = require('./routes/SubjectRoute')
const feesStructureModal = require('./routes/FeesStructureRoutes.js')
const feesApplyRoute = require('./routes/FeesApplyRoutes.js')
const feesCollectionRoute = require('./routes/FeesCollectionRoute.js')

const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
  console.error('❌ MongoDB URI is missing in .env file!')
  process.exit(1)
}

// Initialize app
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())

// Connect to DataBase
connectDatabase()

// Authentication
app.use('/api', UserRoute)

// Forgot Password
app.use('/api', ForgotPassword)

// Dasboard
app.use('/api/dashboard', dashboardRoute)

// Student-Routes
app.use('/api', studentRoute)

// To upload images/multipart form-data
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
console.log('Serving uploads from:', path.join(__dirname, 'uploads'))

// Course-Route
app.use('/api', courseRoute)

// Subject-Route
app.use('/api', subjectRoute)

// Fee-Structure-Route
app.use('/api', feesStructureModal)

// Fee-Collection-Route
app.use('/api', feesCollectionRoute)

// Fees-Apply-Route
app.use('/api', feesApplyRoute)

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Your server is running on Port ${PORT}`)
})
