import { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Table, Form } from 'react-bootstrap'
import { FaEdit, FaPlus, FaSave } from 'react-icons/fa'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { toast } from 'react-toastify'
import EditSubjectModal from '../CommonComponents/EditSubjectModal'
import Select from 'react-select'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

export default function SubjectList() {
  const [data, setData] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({
    course: '',
    subjects: [''],
  })

  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditSubjectModal, setOpentEditSubjectModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const totalSubjects = data.length

  const fetchData = async () => {
    try {
      const resp = await ApiEndpoints.getAllSubjects()
      const courseResp = await ApiEndpoints.getAllCourses()
      console.log('All subjects:', resp.data.subjects)
      console.log('All courses:', courseResp.data.courses)

      setData(resp.data.subjects)
      setCourses(courseResp.data.courses)
    } catch (error) {
      console.error(error.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchData()
  }, [loading])

  const handleChange = (e, index = null) => {
    const { name, value } = e.target
    if (name === 'course') {
      setFormData((prev) => ({ ...prev, course: value }))
    } else if (name === 'subjects') {
      const updatedSubjects = [...formData.subjects]
      updatedSubjects[index] = value
      setFormData((prev) => ({ ...prev, subjects: updatedSubjects }))
    }
    // setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = {
        course: formData.course,
        subjects: formData.subjects.filter((name) => name.trim() !== ''),
      }
      if (!payload.subjects.length) {
        toast.warning('Please enter at least one subject')
        return
      }
      console.log('Payload:', payload)
      const res = await ApiEndpoints.addSubject(payload)
      setFormData({
        course: '',
        subjects: [''],
      })
      await new Promise((res) => setTimeout(res, 1000))

      setOpenAddModal(false)
      setLoading((prev) => !prev)
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  const handleAddSubjectField = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, ''],
    }))
  }

  const handleRemoveSubjectField = (index) => {
    const updateSubject = formData.subjects.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, subjects: updateSubject }))
  }

  const subjectOptions = data.map((sb) => ({
    label: sb.name,
    value: sb.name,
  }))
  const filteredSubjects = selectedOption
    ? data.filter(
        (sb) => sb.name.toLowerCase() === selectedOption.value.toLowerCase(),
      )
    : data

  const handleSubjectUpdatedData = (data) => {
    setData((prev) => prev.map((sb) => (sb._id === data._id ? data : sb)))
  }

  return (
    <div>
      <Row
        className="bg-dark rounded-top custom-row mt-4 d-flex align-items-center justify-content-between"
        style={{ height: '70px' }}
      >
        <Col>
          <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
            ---|<span className="text-white">Subjects</span>|---
            <span className="text-white fs-6 fw-normal">
              Total Subjects: {totalSubjects}
            </span>
          </h3>
          {/* <p className="text-white"> </p> */}
        </Col>
        <Col xs={12} md={5} className="mx-auto mt-2">
          <Select
            options={subjectOptions}
            isClearable
            placeholder="🔍 Search or select a subject..."
            onChange={(selected) => setSelectedOption(selected)}
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
            className="text-decoration-none text-white"
            onClick={() => setOpenAddModal(true)}
          >
            [ <FaPlus size={20} /> Add New Subject ]
          </Button>
        </Col>
      </Row>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Course name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((sb, index) => (
                <tr key={index}>
                  <td>{sb.name}</td>
                  <td>{sb.course?.name}</td>
                  <td>
                    <Button
                      variant="link"
                      className="btn link-warning"
                      title="Update subject info"
                      onClick={() => {
                        setSelectedSubject(sb)
                        console.log('sb', sb)
                        setOpentEditSubjectModal(true)
                      }}
                    >
                      <FaEdit size={20} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No subjects found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        show={openAddModal}
        onHide={() => setOpenAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="bg-dark text-white justify-content-center">
          <Modal.Title>Add New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course *</Form.Label>
                  <Form.Select
                    name="course"
                    onChange={handleChange}
                    required
                    value={formData.course}
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
            {formData.subjects.map((subject, index) => (
              <Row key={index} className="align-items-center mb-3">
                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="mb-1">Subject</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        placeholder={`Enter subject ${index + 1}`}
                        name="subjects"
                        value={subject}
                        onChange={(e) => handleChange(e, index)}
                        required
                      />
                      {formData.subjects.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveSubjectField(index)}
                        >
                          X
                        </Button>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            ))}
            <Button
              variant="secondary"
              className="mb-3"
              onClick={handleAddSubjectField}
            >
              + Add More Subject
            </Button>
            <Modal.Footer className="bg-dark rounded">
              <Button
                variant="link"
                className="link-danger fw-bold text-decoration-none"
                onClick={() => setOpenAddModal(false)}
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
                isLoading={isLoading}
                variant="link"
                className="link-warning fw-semibold text-decoration-none"
              >
                <>
                  [ <FaSave /> Save ]
                </>
              </ButtonWithLoader>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <EditSubjectModal
        show={openEditSubjectModal}
        onHide={() => setOpentEditSubjectModal(false)}
        data={selectedSubject}
        onUpdate={handleSubjectUpdatedData}
        onShowUpdateModal={() => setOpentEditSubjectModal(true)}
      />
    </div>
  )
}
