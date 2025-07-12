// Please check that this file is no need

const express = require('express')
const router = express.Router()

// GET USER BY EMAIL
router.get('/get/by-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const student = await StudentModal.findOne({ email })
    if (!student) {
      return res.status(400).json({ message: 'Student not found' })
    }

    res.status(200).json({ student })
  } catch (error) {
    res.status(200).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
