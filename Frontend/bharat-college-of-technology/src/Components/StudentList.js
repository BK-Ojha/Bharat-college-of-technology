import React, { useState } from 'react'
import { Row, Col, Button, Modal, Table } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { FaEdit, FaPlus, FaSave } from 'react-icons/fa'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { useAuth } from '../CommonComponents/AuthContext'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

export default function StudentList() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
    mobile: '',
    father_name: '',
    mother_name: '',
    alternate_number: '',
    roll_no: '',
    admission_date: '',
    address: '',
    course_id: '',
    image: '',
  })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoading, setisLoading] = useState(false)

  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [blinkSelectedStudent, setBlinkSelectedStudent] = useState(false)
  const [selectOption, setSelectOption] = useState(null)

  const navigate = useNavigate()
  const totalStudents = data.length
  useEffect(() => {
    const selectedNewStudent = localStorage.getItem('selectedStudentId')
    if (selectedNewStudent) {
      setBlinkSelectedStudent(selectedNewStudent)
      setTimeout(() => {
        setBlinkSelectedStudent(null)
      }, 5000)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiEndpoints.getAllStudents()
        const couresResponse = await ApiEndpoints.getAllCourses()
        setCourses(couresResponse.data.courses)
        console.log(response.data)
        setData(response.data.students)
      } catch (error) {
        console.error(error.response?.message)
      }
    }
    fetchData()
  }, [loading])

  const [openAddModal, setOpentModal] = useState(false)
  const handleClickModal = () => {
    setOpentModal(true)
  }
  const handlCloseModal = () => {
    setOpentModal(false)
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleImage = (e) => {
    setSelectedImage(e.target.files[0])
  }
  const handleSave = async (e) => {
    e.preventDefault()
    setisLoading(true)
    try {
      const formDataToSend = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'course_id' && key !== 'image') {
          formDataToSend.append(key, value)
        }
      })

      formDataToSend.append('course_id', selectedCourse)

      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      const response = await ApiEndpoints.addStudent(formDataToSend)

      // Clear the form data
      setFormData({
        name: '',
        email: '',
        gender: '',
        dob: '',
        mobile: '',
        father_name: '',
        mother_name: '',
        alternate_number: '',
        roll_no: '',
        admission_date: '',
        address: '',
        course_id: '',
        image: '',
      })
      setSelectedCourse('')
      setSelectedImage(null)
      await new Promise((res) => setTimeout(res, 1000))

      handlCloseModal()
      setLoading((prev) => !prev)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  const studentOption = data.map((st) => ({
    label: st.name,
    value: st.name,
  }))

  const filteredStudents = selectOption
    ? data.filter((st) => st.name === selectOption.value)
    : data

  return (
    <>
      <style>
        {`
        @keyframes blink{
        50%{
            opacity:0.4;
          }
        }
        .animate-blink{
          animation:blink 0.8s linear 3;
        }
      `}
      </style>
      <div>
        <Row
          className="bg-dark rounded-top custom-row d-flex align-items-center justify-content-between mt-4"
          style={{ height: '70px' }}
        >
          <Col>
            <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
              ---| <span className="text-white">Students</span> |---
              <span className="text-white fs-6 fw-normal">
                Total Students: {totalStudents}
              </span>
            </h3>
          </Col>
          <Col xs={12} md={5} className="mx-auto mt-2">
            <Select
              options={studentOption}
              isClearable
              placeholder="🔍 Search or select a student..."
              onChange={(selected) => setSelectOption(selected)}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? 'black' : base.borderColor, // ✅ dark border on focus
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: 'black',
                  },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? 'black' : 'white',
                  color: state.isFocused ? 'white' : 'black',
                  cursor: 'pointer',
                }),
                clearIndicator: (base) => ({
                  ...base,
                  cursor: 'pointer',
                  color: 'red',
                }),
              }}
            />
          </Col>
          {user?.role !== 'student' && (
            <Col className="text-end gap-2">
              <Button
                variant="link"
                className=" text-decoration-none text-white"
                onClick={handleClickModal}
              >
                [ <FaPlus size={20} /> Add New Student ]
              </Button>
            </Col>
          )}
        </Row>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table className="mt-2">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Admission Date</th>
                <td className="fw-bold">Course</td>
                <th>Address</th>
                {user?.role !== 'student' && <th>Action</th>}{' '}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className={
                      student._id === blinkSelectedStudent
                        ? 'table-warning animate-blink'
                        : ''
                    }
                  >
                    <td>{student.roll_no}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile}</td>
                    <td>
                      {student.admission_date
                        ? new Date(student.admission_date).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : 'N/A'}
                    </td>
                    <td>
                      {courses.find((cs) => cs._id === student.course)?.name ||
                        '-'}
                    </td>
                    <td>{student.address}</td>
                    <td>
                      <Button
                        variant="link"
                        title="Update student info"
                        className="link-warning fw-semibold text-decoration-none"
                        onClick={() => {
                          navigate(`/UserProfile/${student._id}`)
                          console.log(
                            'student_id from StudentList',
                            student._id,
                          )
                        }}
                      >
                        <FaEdit size={20} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-danger">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div>
          <Modal
            centered
            show={openAddModal}
            onHide={handlCloseModal}
            size="lg"
          >
            <Modal.Header className="bg-dark text-white justify-content-center">
              <Modal.Title>Add New Student</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSave}>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Student Name *</Form.Label>
                      <Form.Control
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Date of Birth *</Form.Label>
                      <Form.Control
                        type="date"
                        id="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Mobile Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        id="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Father's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        id="father_name"
                        value={formData.father_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Mother's Name *</Form.Label>
                      <Form.Control
                        type="text"
                        id="mother_name"
                        value={formData.mother_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Alternate Number (optional)</Form.Label>
                      <Form.Control
                        type="tel"
                        id="alternate_number"
                        value={formData.alternate_number}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Roll Number *</Form.Label>
                      <Form.Control
                        type="text"
                        id="roll_no"
                        value={formData.roll_no}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Admission Date</Form.Label>
                      <Form.Control
                        type="date"
                        id="admission_date"
                        value={formData.admission_date}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Course *</Form.Label>
                      <Form.Select
                        id="course_id"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        value={selectedCourse || formData.course_id}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map((cs) => (
                          <option key={cs._id} value={cs._id}>
                            {cs.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </Form.Group>
                <Modal.Footer className="bg-dark rounded">
                  <Button
                    variant="link"
                    className="link-danger fw-bold text-decoration-none"
                    onClick={handlCloseModal}
                    title="Close"
                  >
                    [ X ]
                  </Button>
                  {/* <Button
                    variant="link"
                    className="link-warning fw-semibold text-decoration-none"
                    type="submit"
                  >
                    [ <FaSave /> Save ]
                  </Button> */}
                  <ButtonWithLoader
                    type="submit"
                    variant="link"
                    className="btn btn-link link-warning text-decoration-none fw-bold d-flex align-items-center gap-2"
                    isLoading={isLoading}
                  >
                    <>
                      [ <FaSave /> Save ]
                    </>
                  </ButtonWithLoader>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  )
}
