const express = require('express')
const FeesStructureModal = require('../model/FeesStructureModal')
const router = express.Router()

router.post('/add/fees', async (req, res) => {
  try {
    const { fees_name, course, amount, frequency, custom_fees_name } = req.body

    if (!fees_name || !course || !frequency || !amount == null) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (fees_name === 'Other') {
      if (!custom_fees_name) {
        return res
          .status(400)
          .json({ message: 'Please provide a name for custom fees name.' })
      }

      // Check duplicate for custom_fees_name if fees_name is "Other"
      const existCustomFees = await FeesStructureModal.findOne({
        fees_name: 'Other',
        custom_fees_name,
        course,
      })

      if (existCustomFees) {
        return res
          .status(400)
          .json({ message: 'This custom fees already exist for this course' })
      }
    } else {
      const existFees = await FeesStructureModal.findOne({ fees_name, course })
      if (existFees) {
        return res
          .status(400)
          .json({ message: 'This fee already exists for the selected course.' })
      }
    }

    const newFees = new FeesStructureModal({
      course,
      fees_name,
      amount,
      frequency,
      custom_fees_name: fees_name === 'Other' ? custom_fees_name : null,
    })
    await newFees.save()

    return res.status(201).json({
      message: 'Fees structure added successfully',
      fees_structure: newFees,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.get('/get/all-fees-structures', async (req, res) => {
  try {
    const allFees = await FeesStructureModal.find()
      .populate('course', 'name')
      .sort({ course: 1 }) // Ascending sort by fees_name (A to Z)

    return res.status(200).json({
      message: 'All fees fetched successfully',
      fees_structure: allFees,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.get('/get/fees/:course_id', async (req, res) => {
  try {
    const course_id = req.params.course_id
    const feesByCourse = await FeesStructureModal.find({ course: course_id })
    if (feesByCourse.length == 0) {
      return res
        .status(400)
        .json({ message: 'No student found for this course' })
    }

    return res.status(200).json({
      message: 'Fees fetched by course successfully',
      fees: feesByCourse,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})
router.put('/update/fees-structure/:id', async (req, res) => {
  const feesStructureId = req.params.id
  const updateData = req.body
  try {
    // const { fees_name, course, amount, frequency, custom_fees_name } = req.body
    const updatedFeesStructure = await FeesStructureModal.findByIdAndUpdate(
      feesStructureId,
      updateData,
    )
    if (!updatedFeesStructure) {
      return res.status(400).json({ message: 'Fees structure not found' })
    }
    return res
      .status(200)
      .json({ message: 'Fees structure updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.delete('/fee-structure/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const existFeesStructure = await FeesStructureModal.findByIdAndDelete(id)
    if (!existFeesStructure) {
      return res.status(400).json({ message: 'Fees structure not found' })
    }
    return res
      .status(200)
      .json({ message: 'Fees structure deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
module.exports = router
