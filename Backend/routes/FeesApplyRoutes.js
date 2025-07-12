const express = require('express')
const StudentModal = require('../model/StudentModal')
const FeesStructureModal = require('../model/FeesStructureModal')
const FeesApplyModal = require('../model/FeesApplyModal')

const router = express.Router()

router.post('/fees-applied', async (req, res) => {
  try {
    const { course, fees, student, discount = 0 } = req.body
    if (!course || !fees || !student) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existFees = await FeesStructureModal.findById(fees)
    if (!existFees) {
      return res.status(400).json({ message: 'Fees not found' })
    }
    const original_amount = existFees.amount
    // The final amount is never negative
    const final_amount = Math.max(original_amount - discount, 0)

    const appliedFess = new FeesApplyModal({
      student: student,
      course: course,
      fees: fees,
      original_amount,
      final_amount,
      discount,
    })

    await appliedFess.save()
    return res
      .status(201)
      .json({ message: 'Fees applied successfully', student_fees: appliedFess })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.get('/get/fees', async (req, res) => {
  try {
    // Method	Use Case	Data Sent From Frontend	Accessed Via
    // GET	To fetch/read data	URL query parameters (?key=value)	req.query
    // POST	To send/create data	Request body (JSON)	req.body
    const { course, student } = req.query

    if (!student || !course) {
      return res
        .status(400)
        .json({ message: 'Student ID and Course ID are required' })
    }

    // findById() only takes one ID and findById({}) only takes multiple IDs
    const allFeesByStudent = await FeesApplyModal.find({
      student: student,
      course: course,
    })
      .populate('course', 'name')
      .populate('student', 'name')
      .populate('fees', 'fees_name amount')
    if (!allFeesByStudent) {
      return res
        .status(400)
        .json({ message: 'Fees not found for this student' })
    }

    return res
      .status(200)
      .json({ message: 'Fees fetched successfully', fees: allFeesByStudent })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
