const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModal = require('../model/UserModal')
const StudentModal = require('../model/StudentModal')
const { authenticateUser, authorizeAdmin } = require('../middleware/auth')
const upload = require('../middleware/upload')
const multer = require('multer')
const BASE_URI = 'http://localhost:4000'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

router.post(
  '/signup',
  (req, res, next) => {
    // upload.single("image"): Accepts one file with the name image
    upload.single('image')(req, res, function (err) {
      // It runs multer middleware to parse multipart/form-data, and then multer will throw error if occured
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` })
      }

      // Handle invalid file type or other custom errors
      if (err) {
        return res.status(400).json({ message: err.message })
      }
      next()
    })
  },
  async (req, res) => {
    const { email, password, role, name, admin_name } = req.body
    const file = req.file
    try {
      const existingUser = await UserModal.findOne({ email })
      if (existingUser)
        return res.status(400).json({ message: 'User already exist' })

      if (role === 'admin') {
        if (!admin_name)
          return res.status(400).json({ message: 'Admin name is required' })
        if (!file)
          return res
            .status(400)
            .json({ message: 'Image is required for admin' })
      }
      if (role === 'student') {
        if (!name) {
          return res.status(400).json({ message: 'Student name is required' })
        }
        if (!file)
          return res
            .status(400)
            .json({ message: 'Image is required for student' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      // Prepare user object
      const userData = {
        email,
        password: hashedPassword,
        role,
      }

      if (role === 'admin') {
        userData.admin_name = admin_name
        userData.image = `${BASE_URI}/uploads/admins/${file.filename}`
      }
      if (role === 'student') {
        userData.name = name
        userData.image = `${BASE_URI}/uploads/students/${file.filename}`
      }
      // Create user account
      const user = await UserModal.create(userData)

      if (role === 'student') {
        await StudentModal.create({
          name,
          email,
          image: userData.image,
        })
      }
      // Generate token
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: '1d',
      })

      res.json({
        status: true,
        message: 'Signup successful',
        data: {
          id: user._id,
          token: token,
          user: {
            id: user._id,
            name: user.role === 'admin' ? user.admin_name : user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          },
        },
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  },
)
router.post('/login', async (req, res) => {
  const { role, email, password } = req.body
  try {
    const user = await UserModal.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Email not found. Please signup.' })
    }

    if (user.role !== role) {
      return res
        .status(400)
        .json({ message: 'Role does not match with this email.' })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch)
      return res.status(400).json({ message: 'Incorrect password' })

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '1d',
      },
    )

    let name = user.name
    let image = user.image

    // ✅ Get updated name/image from StudentModal if student
    if (user.role === 'student') {
      const student = await StudentModal.findOne({ email })
      if (student) {
        name = student.name
        image = student.image
        console.log('Login name:', student.name)
      }
    }
    res.json({
      status: true,
      message: 'Login successfully',
      data: {
        token,
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.role === 'admin' ? user.admin_name : user.name,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET DATA BY USER ID
router.get('/get/user-profile', authenticateUser, async (req, res) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    if (user.role === 'student') {
      // findOne() returns the first document that match with the unique field/query
      // It searches for a student where the email field matches user.email
      // When we link two collections (like students and courses), but we usually store just the ID
      // If you want to see the full course details (like title, duration), not just the ID, that's where .populate() helps.

      const studentProfile = await StudentModal.findOne({
        email: user.email,
      }).populate('course')
      if (!studentProfile) {
        return res.status(400).json({ message: 'Student profile not found' })
      }
      return res.status(200).json({
        message: 'Student profile fetched successfully',
        profile: studentProfile,
      })
    } else {
      // console.log('profile', user)

      return res.status(200).json({
        message: 'User profile fetched successful',
        role: user.role,
        profile: user,
      })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

// UPDATED DATA BY USER ID

router.put(
  '/user/update-profile',
  authenticateUser,
  upload.single('image'),

  async (req, res) => {
    const { email, role } = req.user // From JWT payload
    const file = req.file
    const {
      name,
      dob,
      gender,
      address,
      alternate_number,
      admin_name,
    } = req.body

    try {
      const existUser = await UserModal.findOne({ email })

      if (!existUser) {
        return res.status(400).json({ messgae: 'User not found' })
      }

      let updateUser = null
      if (role === 'student') {
        existStudent = await StudentModal.findOne({ email })
        const image = file
          ? `${BASE_URI}/uploads/students/${file.filename}`
          : existStudent.image
        if (existStudent) {
          updateUser = await StudentModal.findOneAndUpdate(
            { email },
            {
              $set: {
                // To prevent required fields like course & roll_no ... from StudentModal
                // Update only allowed fields for student
                ...(name && { name }),
                ...(dob && { dob }),
                ...(gender && { gender }),
                ...(address && { address }),
                ...(alternate_number && { alternate_number }),
                ...(image && { image }),
              },
            },
            {
              new: true,
              runValidators: false, // Skip validation for required fields during update
            },
          )

          // Also need to update name and image to userModal too, so that we can get same data from both user and student modal
          await UserModal.findOneAndUpdate(
            { email },
            {
              $set: {
                ...(name && { name }),
                ...(image && { image }),
              },
            },
          )
        } else {
          // Creating student profile: all required fields MUST be provided
          if (!updateUser) {
            if (!dob || !gender || !address || !name || !alternate_number) {
              return res.status(400).json({
                message: 'Please fill all the neccessary fields.',
              })
            }

            updateUser = await StudentModal.create({
              email,
              name,
              dob,
              gender,
              address,
              alternate_number,
              image: file
                ? `${BASE_URI}/uploads/students/${file.filename}`
                : '',
              // roll_no,
            })
          }
        }
      }

      if (role === 'admin') {
        const image = file
          ? `${BASE_URI}/uploads/admins/${file.filename}`
          : existUser.image

        updateUser = await UserModal.findOneAndUpdate(
          { email },
          {
            $set: {
              ...(admin_name && { admin_name }),
              ...(dob && { dob }),
              ...(gender && { gender }),
              ...(address && { address }),
              ...(image && { image }),
            },
          },
          { new: true },
        )
      }
      res.json({ message: 'Profile updated successfully', profile: updateUser })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message })
    }
  },
)

router.put(
  '/admin/update-student/:student_id',
  authenticateUser,
  authorizeAdmin,
  upload.single('image'),
  async (req, res) => {
    const { student_id } = req.params
    console.log('student_id:', student_id)
    const file = req.file
    console.log('Received file:', req.file?.filename)
    console.log(
      'Saving to:',
      file ? `${BASE_URI}/uploads/students/${file.filename}` : 'No image',
    )

    const {
      name,
      email,
      dob,
      gender,
      address,
      mobile,
      alternate_number,
      father_name,
      mother_name,
      roll_no,
      admission_date,
      course,
      duration,
    } = req.body
    try {
      const student = await StudentModal.findById(student_id)
      if (!student) {
        return res.status(400).json({ message: 'Student not found' })
      }

      const updatedStudent = await StudentModal.findByIdAndUpdate(
        student_id,
        {
          $set: {
            name: name || student.name,
            email: email || student.email,
            dob: dob || student.dob,
            gender: gender || student.gender,
            address: address || student.address,
            mobile: mobile || student.mobile,
            alternate_number: alternate_number || student.alternate_number,
            father_name: father_name || student.father_name,
            mother_name: mother_name || student.mother_name,
            roll_no: roll_no || student.roll_no,
            admission_date: admission_date || student.admission_date,
            course: course || student.course,
            duration: course || student.course.duration,
            image: file
              ? `${BASE_URI}/uploads/students/${file.filename}`
              : student.image,
            isSeenByAdmin: true,
          },
        },
        { new: true, runValidators: true },
      ).populate('course')
      console.log('Updated Student from studentModel:', updatedStudent)

      const updatedUserModelFields = await UserModal.findOneAndUpdate(
        { email: student.email, role: 'student' },
        {
          $set: {
            image: file
              ? `${BASE_URI}/uploads/students/${file.filename}`
              : student.image,
          },
        },
        { new: true },
      )

      if (!updatedUserModelFields) {
        return res
          .status(404)
          .json({ message: 'User record not found for this student' })
      }
      console.log('Updated Student from studentModel:', updatedUserModelFields)

      return res.status(200).json({
        message: 'Student updated successfully',
        profile: {
          student: updatedStudent,
          user: updatedUserModelFields,
        },
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Server error:', error: error.message })
    }
  },
)
module.exports = router
