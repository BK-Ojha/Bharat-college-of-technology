const express = require('express')
const router = express.Router()
const StudentModal = require('../model/StudentModal')
const CourseModal = require('../model/CourseModal')
const upload = require('../middleware/upload')
const UserModal = require('../model/UserModal')
const BASE_URI = 'http://localhost:4000'

// ADD STUDENT
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    // Receive data from frontend
    const {
      name,
      email,
      gender,
      dob,
      mobile,
      father_name,
      mother_name,
      alternate_number,
      roll_no,
      admission_date,
      address,
      // Receive course_id from frontend
      course_id,
    } = req.body

    const finalRollNo =
      roll_no || `${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // find() returns data in Array
    const existStudent = await StudentModal.findOne({ email })
    if (existStudent)
      return res.status(400).json({ message: 'Student already exist' })

    const existRollNo = await StudentModal.findOne({ roll_no: finalRollNo })
    if (existRollNo) {
      return res.status(400).json({ message: 'Roll number already exist' })
    }

    //  Retrieves a single course document from your MongoDB database using its _id (i.e., course_id).
    const course = await CourseModal.findById(course_id)
    if (!course) {
      return res.status(400).json({ message: 'Course not found' })
    }

    const image = req.file
      ? `${BASE_URI}/uploads/students/${req.file.image}`
      : ''
    const new_student = new StudentModal({
      name,
      email,
      gender,
      dob,
      mobile,
      father_name,
      mother_name,
      alternate_number,
      roll_no: finalRollNo,
      admission_date,
      address,
      course: course_id,
      image,
    })
    await new_student.save()
    res.status(201).json({
      message: 'Student added successfully',
      student_details: new_student,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server failed', error: error.message })
  }
})

// GET ALL STUDENTS
router.get('/get/all/students', async (req, res) => {
  try {
    // find() is used to apply in all document
    const students = await StudentModal.find().sort({ createdAt: -1 })
    const course = await CourseModal.find()
    res.status(200).json({
      message: 'Students data fetched successfully',
      students,
      course_name: course.name,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get 5 latest student registered (for admin notifications)
router.get('/get/latest-students', async (req, res) => {
  try {
    const latestStudent = await StudentModal.find({ isSeenByAdmin: false })
      // Sorts the result by the createdAt field.
      // { createdAt: -1 } means descending order → newest entries come first.
      // So the most recently created student appears at the top.
      .sort({ createdAt: -1 })

      .sort({ createdAt: -1 })
      .limit(5) // Only 5 students

    return res.status(200).json({
      message: 'Latest student fetched successfully',
      students: latestStudent,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

// GET STUDENTS BY COURSE ID
router.get('/get/students/:course_id', async (req, res) => {
  try {
    const course_id = req.params.course_id
    //  Fetches all students whose course field matches the course_id provided.
    const studentsByCourse = await StudentModal.find({
      course: course_id,
    }).populate('course')

    if (studentsByCourse.length === 0) {
      return res
        .status(400)
        .json({ message: 'No student found for this course' })
    }
    return res.status(200).json({
      message: 'Students fetched by course successfully',
      students: studentsByCourse,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

// GET STUDENT DATA BY ID
router.get('/get/profile/:student_id', async (req, res) => {
  const { student_id } = req.params
  try {
    const student = await StudentModal.findById(student_id).populate('course')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const user = await UserModal.findOne({
      email: student.email,
      role: 'student',
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({
      message: 'Student data fetched successfully',
      profile: {
        ...student.toObject(),
        role: user.role,
        image: user.image || student.image || '',
      },
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

// UPDATE STUDENT BY ID
router.put('/update/:id', async (req, res) => {
  // Extract student ID and updated data from request
  const studentId = req.params.id

  // Extract updated data from request body
  const updatedData = req.body

  try {
    updatedData.isSeenByAdmin = true
    const updatedStudent = await StudentModal.findByIdAndUpdate(
      //  studentId is the ID of the student to update
      studentId,
      updatedData,

      // Options to return the updated document
      { new: true },
    )

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' })
    }

    return res.status(200).json({
      message: 'Student updated successfully',
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
