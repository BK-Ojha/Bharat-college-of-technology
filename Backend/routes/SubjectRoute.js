const express = require('express')
const CourseModal = require('../model/CourseModal')
const SubjectModal = require('../model/SubjectModal')
const router = express.Router()

router.post('/add/subject', async (req, res) => {
  try {
    const { subjects, course } = req.body

    if (!Array.isArray(subjects) || subjects.length === 0 || !course) {
      return res
        .status(400)
        .json({ message: 'Subjects and Course are required' })
    }

    const foundCourse = await CourseModal.findById(course)
    if (!foundCourse) {
      return res.status(400).json({ message: 'Course not found' })
    }

    // Finds all subjects from DB where the name matches any in the submitted subjects array.
    // Uses $in MongoDB operator for filtering.
    const existSubjects = await SubjectModal.find({
      name: { $in: subjects },
    }).select('name')

    // Extracts the name of each subject already in the DB.
    const existingNames = existSubjects.map((s) => s.name)

    // Filters out names that already exist.
    // Then maps each new name into an object with name and course.
    // If input: ['Math', 'English'] and existing: ['Math'],
    // then newSubjects will be:
    // [{ name: 'English', course: 'someCourseId' }]

    const newSubjects = subjects
      .filter((name) => !existingNames.includes(name))
      .map((name) => ({ name, course }))

    if (newSubjects.length === 0) {
      return res.status(400).json({ message: 'Subjects already exist' })
    }

    const inserted = await SubjectModal.insertMany(newSubjects)

    // const newSubject = new SubjectModal({ name: name, course: foundCourse })
    return res.status(201).json({
      message: `${inserted.length} subject(s) added successfully`,
      subjects: inserted,
      skipped: existSubjects,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.get('/get/all/subjects', async (req, res) => {
  try {
    // here this "course" is matched from post above API
    const subjects = await SubjectModal.find()
      .populate('course', 'name')
      .sort({ course: 1 })
    return res.status(200).json({
      message: 'Subjects fetched successfully',
      subjects: subjects,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

router.put('/update/subject/:subject_id', async (req, res) => {
  try {
    const subject_id = req.params.subject_id
    const updateData = req.body
    const updateSubject = await SubjectModal.findByIdAndUpdate(
      subject_id,
      updateData,
    )
    if (!updateSubject) {
      return res.status(400).json({ message: 'Subject not found' })
    }
    return res.status(200).json({ message: 'Subject updated successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})
module.exports = router
