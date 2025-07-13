import { useEffect, useState } from 'react'
import { Button, Form, Modal, Row } from 'react-bootstrap'
import { FaSearchPlus } from 'react-icons/fa'
import ApiEndpoints from './ApiEndpoints'
import { toast } from 'react-toastify'
import PreviewSubjectDataModal from './PreviewSubjectDataModal'

export default function EditSubjectModal({
  show,
  onHide,
  data,
  onUpdate,
  onShowUpdateModal,
}) {
  console.log('data:', data)
  const [formData, setFormData] = useState({
    course: '',
    name: '',
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [previewSubjectDataModal, setPreviewSubjectDataModal] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData({
        course: data.course._id || '',
        name: data.name || '',
        course_name: data.course.name || '',
      })
    }
  }, [data])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const resp = await ApiEndpoints.getAllCourses()
        setCourses(resp.data.courses)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    fetchCourses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'course') {
      const selectedCourse = courses.find((c) => c._id === value)
      setFormData((prev) => ({
        ...prev,
        course: value,
        course_name: selectedCourse?.name || '',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }
  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    try {
      const payload = {
        course: formData.course,
        name: formData.name,
      }
      const resp = await ApiEndpoints.updateSubject(data._id, payload)

      const selectedCourse = courses.find((cs) => cs._id === formData.course)
      toast.success(resp.data.message)
      setLoading(true)
      onHide()
      onUpdate({
        _id: data._id,
        name: formData.name,
        course: selectedCourse,
      })
      // onUpdate({ ...formData, _id: data._id, course: updatedCourse })
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }
  return (
    <>
      <Modal show={show} centered onHide={onHide} size="lg">
        <Modal.Header className="bg-dark justify-content-center">
          <Modal.Title className="text-white">
            Update Subject{' '}
            <span className="text-warning fw-bold">{formData.name}</span>
            's Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  name="course"
                  value={formData.course}
                  disabled
                >
                  <option>Select Course</option>
                  {courses.map((cs) => (
                    <option key={cs._id} value={cs._id}>
                      {cs.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="name"
                  value={formData.name}
                />
              </Form.Group>
            </Row>
            <Modal.Footer className="bg-dark rounded">
              <Button
                variant="link"
                className="link-danger fw-bold text-decoration-none"
                onClick={() => {
                  onHide()
                }}
              >
                [ X ]
              </Button>
              <Button
                variant="link"
                className="link-info fw-semibold text-decoration-none"
                onClick={() => {
                  onHide()
                  setPreviewSubjectDataModal(true)
                }}
              >
                [ <FaSearchPlus /> Preview ]
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <PreviewSubjectDataModal
        show={previewSubjectDataModal}
        formData={formData}
        onHide={() => setPreviewSubjectDataModal(false)}
        originalData={data}
        onBackToEdit={() => {
          setPreviewSubjectDataModal(false)
          onShowUpdateModal()
        }}
        onConfirm={handleSave}
      />
    </>
  )
}
