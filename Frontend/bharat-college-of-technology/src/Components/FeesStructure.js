import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Col,
  Collapse,
  Form,
  Modal,
  Row,
  Table,
} from 'react-bootstrap'
import { FaEdit, FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import Select from 'react-select'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { toast } from 'react-toastify'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'
export default function FeesStructure() {
  const [data, setData] = useState([])
  const [openAddModal, setOpenAddModal] = useState(false)
  const [allCourses, setAllCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [courseFees, setCourseFees] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFeesNameOption, setSelectFeesNameOption] = useState('')
  const [showCollapse, setShowCollapse] = useState(false)
  const [selectedFeesId, setSelectedFeesId] = useState(null)
  const [selectedFeesName, setSelectedFeesName] = useState('')
  const [selectedCustomName, setSelectedCustomName] = useState('')
  const [selectedFeesCourseName, setSelectedFeesCourseName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    course: '',
    fees_name: '',
    frequency: '',
    amount: '',
    custom_fees_name: '',
  })

  const fetchCourses = async () => {
    try {
      const resp = await ApiEndpoints.getAllCourses()
      console.log('resp', resp.data.courses)
      setAllCourses(resp.data.courses)
    } catch (error) {
      console.error(error.response?.data?.message)
    }
  }
  useEffect(() => { 
    fetchCourses()
  }, [])

  const handleCourseChange = (e) => {
    const courseId = e.target.value
    setSelectedCourseId(courseId)
    setFormData({ ...formData, course: courseId })

    const courseFeesAmount = allCourses.find((cs) => cs._id === courseId)
    if (courseFeesAmount) {
      console.log('courseFeesAmount.fees', courseFeesAmount.fees)
      setCourseFees(courseFeesAmount.fees)
    } else {
      setCourseFees(null)
      console.log('courseFeesAmount.fees', null)
    }
  }
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    if (id === 'fees_name') {
      const autoFrequency = ['Registration', 'Admission', 'Exam'].includes(
        value,
      )
        ? 'One Time'
        : ''
      const isCourse = value === 'Course'
      // const newAmount = isCourse ? courseFees : ''
      setFormData((prev) => ({
        ...prev,
        fees_name: value,
        frequency: autoFrequency,
        amount: isCourse ? courseFees : '',
      }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
    console.log('Selected input:', value)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const resp = await ApiEndpoints.addFeesStructure(formData)
      toast.success(resp.data.message)
      setLoading((prev) => !prev)
      await new Promise((res) => setTimeout(res, 1000))

      setOpenAddModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }
  const totalFeesStructure = data.length
  const fetchAllFessStructure = async () => {
    try {
      const res = await ApiEndpoints.getAllFeesStructure()
      console.log(res.data)
      setData(res.data.fees_structure)
    } catch (error) {
      console.error(error.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchAllFessStructure()
  }, [loading])

  const handleDelete = (id) => {
    setShowCollapse(true)
    console.log('Selected Fees Id:', id)
    const fees = data.find((fee) => fee._id === id)
    console.log('Selected Fees data:', fees.fees_name)
    setSelectedFeesName(fees.fees_name)
    setSelectedCustomName(fees.custom_fees_name)
    setSelectedFeesCourseName(fees.course?.name)
  }
  const handleDeletConfirm = async (e) => {
    e.preventDefault()
    try {
      const response = await ApiEndpoints.deleteFeesStructure(selectedFeesId)
      toast.success(response.data.message)
      setData((prev) => prev.filter((fee) => fee._id !== selectedFeesId))
      setShowCollapse(false)
      setSelectedFeesId(null)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }
  const feesNameOptions = data.map((fee) => ({
    label: fee.fees_name,
    value: fee.fees_name,
  }))

  const filteredFeesName = selectedFeesNameOption
    ? data.filter((fee) => fee.fees_name === selectedFeesNameOption.label)
    : data

  return (
    <div>
      <Row
        className="bg-dark rounded-top custom-row mt-4 d-flex align-items-center justify-content-between"
        style={{ height: '70px' }}
      >
        <Col>
          <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
            ---| <span className="text-white">Fees Structure</span> |---
            <span className="text-white fs-6 fw-normal">
              Total Fees Structure: {totalFeesStructure}
            </span>
          </h3>
        </Col>
        <Col xs={12} md={4} className="mx-auto mt-2">
          <Select
            options={feesNameOptions}
            isClearable
            placeholder="🔍 Search or select a fees name..."
            onChange={(selected) => setSelectFeesNameOption(selected)}
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
            onClick={() => setOpenAddModal(true)}
          >
            [ <FaPlus size={20} /> Add New Fees Structure ]
          </Button>
        </Col>
      </Row>
      <Collapse
        in={showCollapse && selectedFeesId}
        style={{ overflowY: 'auto' }}
      >
        <div>
          <Alert variant="warning" className="mt-2">
            <strong>
              ⚠️ Are you sure you want to delete{' '}
              {/* <span className="text-danger">{selectedFeesName}</span> fee */}
              <span className="text-danger">
                {' '}
                {selectedFeesName === 'Other'
                  ? selectedCustomName
                  : selectedFeesName}
              </span>{' '}
              structure for course{' '}
              <span className="text-danger">{selectedFeesCourseName}</span>?
            </strong>
            <p>This action cannot be undone.</p>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="sencondary"
                size="sm"
                onClick={() => {
                  setShowCollapse(false)
                  setSelectedFeesId(null)
                }}
              >
                Cancel
              </Button>

              <ButtonWithLoader
                type="submit"
                variant="danger"
                size="md"
                onClick={handleDeletConfirm}
                isLoading={isLoading}
              >
                <>Yes, Delete</>
              </ButtonWithLoader>
            </div>
          </Alert>
        </div>
      </Collapse>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <Table className="mt-2">
          <thead>
            <tr>
              <th>Fees Name</th>
              <th>Course Name</th>
              <th>Amount (₹)</th>
              <th>Frequency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeesName.length > 0 ? (
              filteredFeesName.map((fee, index) => (
                <tr key={index}>
                  <td>
                    {fee.fees_name === 'Other'
                      ? fee.custom_fees_name || 'Other'
                      : fee.fees_name}
                  </td>
                  <td>{fee.course?.name}</td>
                  <td>₹ {fee.amount}</td>
                  <td>{fee.frequency}</td>
                  <td>
                    <Button
                      title="Delete fees structure"
                      variant="link"
                      className="btn link-danger btn-link"
                      onClick={() => {
                        setSelectedFeesId(fee._id)
                        handleDelete(fee._id)
                      }}
                    >
                      <FaTrash />
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
        onHide={() => setOpenAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="bg-dark text-white justify-content-center">
          <Modal.Title>Add New Fees Structure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Course Name *</Form.Label>
                  <Form.Select
                    required
                    value={formData.course}
                    onChange={handleCourseChange}
                  >
                    <option value="">---Select Course ---</option>
                    {allCourses.map((cs) => (
                      <option key={cs._id} value={cs._id}>
                        {cs.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Fees Name *</Form.Label>
                  <Form.Select
                    id="fees_name"
                    required
                    value={formData.fees_name}
                    onChange={handleChange}
                  >
                    <option value="">--- Select Fees Name ---</option>
                    <option value="Exam">Exam</option>
                    <option value="Admission">Admission</option>
                    <option value="Course">Course</option>
                    <option value="Registration">Registration</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {formData.fees_name === 'Other' && (
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Custom Fees Name *</Form.Label>
                    <Form.Control
                      type="text"
                      id="custom_fees_name"
                      required
                      value={formData.custom_fees_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Amount (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    id="amount"
                    required
                    value={formData.amount}
                    disabled={formData.fees_name === 'Course'}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Frequency *</Form.Label>
                  <Form.Select
                    required
                    id="frequency"
                    value={formData.frequency}
                    disabled={['Registration', 'Admission', 'Exam'].includes(
                      formData.fees_name,
                    )}
                    onChange={handleChange}
                  >
                    <option value="">--- Select Frequency ---</option>
                    <option value="One Time">One Time</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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
    </div>
  )
}
