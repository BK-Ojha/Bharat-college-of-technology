import { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import PreviewCourseDataModal from './PreviewCourseDataModal'
import { toast } from 'react-toastify'
import ApiEndpoints from './ApiEndpoints'
import { FaSearchPlus } from 'react-icons/fa'

export default function EditCourseModal({
  show,
  onShowUpdateModal,
  onHide,
  onUpdate,
  courseData,
}) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    fees: '',
    description: '',
  })
  const [previewDataModal, setPreviewDataModal] = useState(false)
  useEffect(() => {
    if (courseData) {
      setFormData({
        name: courseData.name || '',
        duration: courseData.duration || '',
        fees: courseData.fees || '',
        description: courseData.description || '',
      })
    }
  }, [courseData])
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    try {
      const response = await ApiEndpoints.updateCourse(courseData._id, formData)
      toast.success(response.data.message)
      onHide()
      onUpdate({ ...formData, _id: courseData._id })
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }
  return (
    <div>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header className="bg-dark justify-content-center">
          <Modal.Title className="text-white ">
            Update Course{' '}
            <span className="text-warning fw-bold">{formData.name}</span>
            's Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
          //    onSubmit={handleSave}
          >
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
                  setPreviewDataModal(true)
                }}
              >
                [ <FaSearchPlus /> Preview ]
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <PreviewCourseDataModal
        show={previewDataModal}
        onHide={() => setPreviewDataModal(false)}
        onBackToEdit={() => {
          setPreviewDataModal(false)
          onShowUpdateModal(true)
        }}
        onConfirm={handleSave}
        formData={formData}
        originalData={courseData}
      />
    </div>
  )
}
