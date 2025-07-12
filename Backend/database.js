const mongoose = require('mongoose')
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Your database has been connected successfully.')
  } catch (error) {
    console.log('❌ Failed to connect database.', error.message)
  }
}
module.exports = connectDatabase
