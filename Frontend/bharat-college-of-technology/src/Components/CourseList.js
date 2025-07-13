import { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { FaEdit, FaPlus, FaSave } from 'react-icons/fa'
import EditCourseModal from '../CommonComponents/EditCourseModal'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

export default function CourseList() {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectOption, setSelectOption] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const totalCourses = data.length

  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }
  const handleCloseAddModal = () => {
    setOpenAddModal(false)
  }

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    fees: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiEndpoints.getAllCourses()
        setData(response.data.courses)
      } catch (error) {
        console.error(error.response?.message)
      }
    }
    fetchData()
  }, [loading])
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }
  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await ApiEndpoints.addCourse(formData)
      setFormData({
        name: '',
        duration: '',
        fees: '',
        description: '',
      })
      await new Promise((res) => setTimeout(res, 1000))

      handleCloseAddModal()
      setLoading((prev) => !prev)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const courseOptions = data.map((course) => ({
    label: course.name,
    value: course.name,
  }))
  const filteredCourses = selectOption
    ? data.filter((cs) => cs.name === selectOption.value)
    : data

  const handleCourseUpdatedData = (updatedCourse) => {
    setData((prevData) =>
      prevData.map((cs) => (cs._id === updatedCourse._id ? updatedCourse : cs)),
    )
  }
  return (
    <div>
      <Row
        className="bg-dark rounded-top custom-row mt-4 d-flex align-items-center justify-content-between"
        style={{ height: '70px' }}
      >
        <Col>
          <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
            ---| <span className="text-white">Courses</span> |---
            <span className="text-white fs-6 fw-normal">
              Total Courses: {totalCourses}
            </span>
          </h3>
        </Col>
        <Col xs={12} md={5} className="mx-auto mt-2">
          <Select
            options={courseOptions}
            isClearable
            placeholder="🔍 Search or select a course..."
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
        <Col className="text-end">
          <Button
            variant="link"
            className=" text-decoration-none text-white"
            onClick={handleOpenAddModal}
          >
            [ <FaPlus size={20} /> Add New Course ]
          </Button>
        </Col>
      </Row>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Duration (Months)</th>
              <th>Fees (₹)</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((cs, index) => (
                <tr key={index}>
                  <td>{cs.name}</td>
                  <td>{cs.duration}</td>
                  <td>{cs.fees}</td>
                  <td>{cs.description}</td>
                  <td>
                    <Button
                      variant="link"
                      className="btn link-warning "
                      title="Update course info"
                      onClick={() => {
                        setSelectedCourse(cs)
                        setOpenUpdateModal(true)
                      }}
                    >
                      <FaEdit size={20} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-danger" colSpan="4">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        show={openAddModal}
        onHide={handleCloseAddModal}
        centered
        size="lg"
      >
        <Modal.Header className="bg-dark text-white justify-content-center">
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Duration (Months) *</Form.Label>
                  <Form.Control
                    type="number"
                    id="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Fees (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    id="fees"
                    required
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    type="textarea"
                    id="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Modal.Footer className="bg-dark rounded">
              <Button
                variant="link"
                className="link-danger fw-bold text-decoration-none"
                onClick={handleCloseAddModal}
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
                className="link-warning fw-semibold text-decoration-none"
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
      <EditCourseModal
        show={openUpdateModal}
        onHide={() => setOpenUpdateModal(false)}
        courseData={selectedCourse}
        onUpdate={handleCourseUpdatedData}
        onShowUpdateModal={() => setOpenUpdateModal(true)}
      />
    </div>
  )
}
