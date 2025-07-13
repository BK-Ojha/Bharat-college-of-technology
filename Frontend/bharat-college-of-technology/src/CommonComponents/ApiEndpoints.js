import axios from 'axios'

const baseUrl = 'http://localhost:4000/api'

const ApiEndpoints = {
  // Signup Endpoints
  signUp: async (data) => {
    return await axios.post(`${baseUrl}/signup`, data)
  },

  // Login Endpoints
  logIn: async (data) => {
    return await axios.post(`${baseUrl}/login`, data)
  },

  // Forgot Password
  forgotPassword: async (data) => {
    return await axios.post(`${baseUrl}/forgot-password`, data)
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    return await axios.post(`${baseUrl}/reset-password/${token}`, {
      newPassword,
    })
  },

  // USER PROFILE BY ID
  editProfileByUser: async (data) => {
    const token = localStorage.getItem('token')
    return await axios.put(`${baseUrl}/user/update-profile`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
  },
  // GET STUDENT BY EMAIL
  getProfileById: async () => {
    const token = localStorage.getItem('token')
    return await axios.get(`${baseUrl}/get/user-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // GET FULL DATA OF STUDENT BY ID
  getStudentProfileDataById: async (student_id) => {
    return await axios.get(`${baseUrl}/get/profile/${student_id}`)
  },

  editStudentDataByAdmin: async (student_id, data) => {
    const token = localStorage.getItem('token')
    return await axios.put(
      `${baseUrl}/admin/update-student/${student_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  },

  // Dasboard Endpoints
  getStudentPerCourse: async (email) => {
    return await axios.get(`${baseUrl}/dashboard/get/student-per-course`)
  },

  // Student Endpoints
  addStudent: async (data) => {
    return await axios.post(`${baseUrl}/student/add`, data)
  },

  getAllStudents: async () => {
    return await axios.get(`${baseUrl}/get/all/students`)
  },

  getLatestStudent: async () => {
    return await axios.get(`${baseUrl}/get/latest-students`)
  },

  getStudentByCourseId: async (id) => {
    return await axios.get(`${baseUrl}/get/students/${id}`)
  },

  updateStudent: async (id, data) => {
    return await axios.put(`${baseUrl}/student/update/${id}`, data)
  },

  // Course Endpoints
  addCourse: async (data) => {
    return await axios.post(`${baseUrl}/course/add`, data)
  },

  getAllCourses: async () => {
    return await axios.get(`${baseUrl}/get/all/courses`)
  },

  updateCourse: async (id, data) => {
    return await axios.put(`${baseUrl}/course/update/${id}`, data)
  },

  // Subject Endpoints
  addSubject: async (data) => {
    return await axios.post(`${baseUrl}/add/subject`, data)
  },
  getAllSubjects: async () => {
    return await axios.get(`${baseUrl}/get/all/subjects`)
  },

  updateSubject: async (id, data) => {
    return await axios.put(`${baseUrl}/update/subject/${id}`, data)
  },

  // Fees Structure Endpoints
  addFeesStructure: async (data) => {
    return await axios.post(`${baseUrl}/add/fees`, data)
  },
  getAllFeesStructure: async (data) => {
    return await axios.get(`${baseUrl}/get/all-fees-structures`, data)
  },
  updateFeesStructure: async (id) => {
    return await axios.put(`${baseUrl}/update/fees-structure/${id}`)
  },
  deleteFeesStructure: async (id) => {
    return await axios.delete(`${baseUrl}/fee-structure/delete/${id}`)
  },

  getFeesByCourse: async (id) => {
    return await axios.get(`${baseUrl}/get/fees/${id}`)
  },

  applyFeesForStudent:async(data)=>{
    return await axios.post(`${baseUrl}/fees-applied`,data)
  },
  getFeesForStudent: async (data) => {
    // data used for multiple params IDs
    return await axios.get(`${baseUrl}/get/fees`,{params:data})
  },

  // Fees Collection Endpoints
  getFeesCollection: async(type)=>{
        // {type} used for single params type, where type = monthly,...
    return await axios.get(`${baseUrl}/get/fees-collection`,{params: {type}})
  }
}
export default ApiEndpoints
