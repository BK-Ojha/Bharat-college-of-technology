const express = require('express')
const router = express.Router()
const CourseModal = require('../model/CourseModal')

// ADD COURSE
router.post('/course/add', async (req, res) => {
  try {
    const { name, duration, fees, description } = req.body

    const existCourse = await CourseModal.findOne({ name })
    if (existCourse) {
      return res.status(400).json({ message: 'Course already exist' })
    }

    const new_course = new CourseModal({
      name,
      duration,
      fees,
      description,
    })
    await new_course.save()
    res.status(201).json({
      message: 'Course added successfully',
      course_details: new_course,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server failed', error: error.message })
  }
})

// GET ALL COURSES
router.get('/get/all/courses', async (req, res) => {
  try {
    const courses = await CourseModal.find()
    res.status(200).json({
      message: 'Courses data fetched successfully',
      courses,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// UPDATE STUDENT BY ID
router.put('/course/update/:id', async (req, res) => {
  const courseId = req.params.id
  const updateData = req.body
  try {
    const updateCourse = await CourseModal.findByIdAndUpdate(
      courseId,
      updateData,
    )
    if (!updateCourse) {
      return res.status(400).json({ message: 'Course not found' })
    }

    res.status(200).json({ message: 'Course updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
module.exports = router
