import { useEffect, useState } from 'react'
import { Button, Row, Col, Alert, Collapse, Form } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import Select from 'react-select'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'
import { toast } from 'react-toastify'

export default function ApplyFees() {
  const [allCourses, setAllCourses] = useState([])
  const [
    allStudentsBySelectedCourse,
    setAllStudentsBySelectedCourse,
  ] = useState([])
  const [allFeesBySelectedCourse, setAllFeesBySelectedCourse] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedFeesId, setSelectedFeesId] = useState('')
  const [selectedFeesAmount, setSelectedFeesAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const[loading,setLoading]=useState(false)
  const [showCollapse, setShowCollapse] = useState(false)
  const [openSelectedFields, setOpenSelectedFields] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [finalAmount, setFinalAmount]=useState(null)
  const [formData, setFormData]=useState({
    discount:"",
    final_amount:""
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResp = await ApiEndpoints.getAllCourses()
        console.log('All courses', courseResp.data.courses)
        setAllCourses(courseResp.data.courses)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    fetchData()
  }, [])

  const courseNameOptions = allCourses.map((cs) => ({
    label: cs.name,
    value: cs._id,
  }))
  const feesNameOptions = allFeesBySelectedCourse.map((fc) => ({
    label:
      fc.fees_name === 'Other'
        ? `Other - ₹ ${fc.amount} (${fc.custom_fees_name})`
        : `${fc.fees_name} - ₹ ${fc.amount}`,
    value: fc._id,
  }))
  const studentNameOption = allStudentsBySelectedCourse.map((st) => ({
    label: st.name,
    value: st._id,
  }))

  const handleCourseSelectedField = (selectedOption) => {
    if (selectedOption) {
      const courseId = selectedOption.value
      console.log('Selected course id:', courseId)
      setSelectedCourseId(courseId)

      const courseName = allCourses.find((cs) => cs._id === courseId)
      if (courseName) {
        console.log('Selected course name:', courseName.name)
        setSelectedCourseName(courseName.name)
      }
      const fetchStudentsByCourse = async () => {
        try {
          const studentByCourse = await ApiEndpoints.getStudentByCourseId(
            courseId,
          )
          console.log('Students by course:', studentByCourse.data.students)
          setAllStudentsBySelectedCourse(studentByCourse.data.students)

          const feesByCourse = await ApiEndpoints.getFeesByCourse(courseId)
          console.log('Fees by course:', feesByCourse.data.fees)
          setAllFeesBySelectedCourse(feesByCourse.data.fees)
        } catch (error) {
          console.log(error.response?.data?.message)
        }
      }
      fetchStudentsByCourse()
    } else {
      setSelectedCourseId('')
      setAllFeesBySelectedCourse([])
    }
  }

  const handleFeesSelectedField = (selectedOption) => {
    if (selectedOption) {
      const feesId = selectedOption.value
      console.log('Selected fees id:', feesId)

      setSelectedFeesId(feesId)

      const feesAmount = allFeesBySelectedCourse.find((fa) => fa._id === feesId)
      if (feesAmount) {
        console.log('Fees Amount :', feesAmount.amount)
        setSelectedFeesAmount(feesAmount.amount)
      }
    } else {
      setSelectedFeesId('')
      setSelectedStudentId(null)
    }
  }
  const handleStudentSelectField = (selectedOption) => {
    if (selectedOption) {
      const studentId = selectedOption.value
      console.log('Selected student id:', studentId)

      setSelectedStudentId(studentId)

      const studentName = allStudentsBySelectedCourse.find(
        (st) => st._id === studentId,
      )
      if (studentName) {
        console.log('Student name:', studentName.name)
        setSelectedStudentName(studentName.name)
      }
      setShowCollapse(true)
    } else {
      setShowCollapse(false)
    }
  }

  const handleChange=(e)=>{
    const {name, value} = e.target
    setFormData((prev)=>({...prev, [name]:value}))

    if(name==="discount"){
      const discountValue = parseInt(value) || 0
      const amount = parseInt(selectedFeesAmount) || 0
      const final = Math.max(amount-discountValue, 0)
      setFinalAmount(final)

      setFormData((prev)=>({...prev,[name]:value, final_amount:final
      }))
    }else{
      setFormData((prev)=>({...prev, [name]:value}))
    }
  }

  const handleSubmit =async (e)=>{
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload ={
        ...formData,
        student:selectedStudentId,
        course:selectedCourseId,
        fees:selectedFeesId,
      }
      const res = await ApiEndpoints.applyFeesForStudent(payload)
      toast.success(res.data.message)
      setShowCollapse(true)
      setLoading(true)
    } catch (error) {
      toast.error(error.response?.data?.message)
      setShowCollapse(true)
    }finally{
      setIsLoading(false)
    }
  }
  console.log('Selected fees:', selectedFeesId)
  return (
    <>
      <style>
        {`
        .cursor-pointer input[type="checkbox"],
        .cursor-pointer label {
          cursor: pointer;
        }
      `}
      </style>
      <Row
        className="bg-dark rounded-top custom-row mt-4 d-flex align-items-center justify-content-between"
        style={{ height: '70px' }}
      >
        <Col>
          <h3 className="m-0 gap-1 d-flex align-items-center text-warning fw-bold">
            ---| <span className="text-white">Apply Fees</span> |---
          </h3>
        </Col>

        <Col className="text-end">
          <Button
            variant="link"
            className=" text-decoration-none text-white"
            onClick={() => setOpenSelectedFields(true)}
          >
            [ <FaCheckCircle /> Apply Fees ]
          </Button>
        </Col>
      </Row>
      {openSelectedFields && (
        <div className="mt-4">
          <Row>
            <Col xs={12} md={4} className="mx-auto mt-2">
              <strong>Course</strong>
              <Select
                options={courseNameOptions}
                isClearable
                placeholder="🔍 Search or select a course name..."
                onChange={handleCourseSelectedField}
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
            <Col xs={12} md={4} className="mx-auto mt-2">
              <strong>Fees</strong>
              <Select
                options={selectedCourseId ? feesNameOptions : []}
                isClearable
                placeholder="🔍 Search or select a fees name..."
                onChange={handleFeesSelectedField}
                disabled={!handleCourseSelectedField}
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
            <Col xs={12} md={4} className="mx-auto mt-2">
              <strong>Student</strong>
              <Select
                options={selectedFeesId ? studentNameOption : []}
                isClearable
                placeholder="🔍 Search or select a student name..."
                onChange={handleStudentSelectField}
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
          </Row>
        </div>
      )}
      {selectedStudentId && (
        <Row>
          <Collapse in={showCollapse} className="mt-4">
          <Form onSubmit={handleSubmit}>

              <div>
                <Alert variant="dark" className="mt-2 p-4 rounded-4 shadow-sm">
                  <h5 className="fw-bold text-uppercase mb-3">
                    Apply Fees{' '}
                    <span className="text-danger">₹ {selectedFeesAmount}</span>{' '}
                    for Student{' '}
                    <span className="text-danger">{selectedStudentName}</span>
                  </h5>
                  <p className="mb-1">
                    You are about to apply the selected fee to the student under
                    the chosen course <strong>{selectedCourseName}</strong>.
                  </p>
                  <p className="mb-4">
                    If you wish to offer a <strong>discount</strong>, please
                    enter the amount below. The final payable amount will be
                    automatically adjusted.
                  </p>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Fee Amount (₹)
                      </label>
                      <input
                        className="form-control"
                        value={selectedFeesAmount || ''}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Discount (₹)
                      </label>
                      <input
                        type="number"
                        name='discount'
                        id='discount'
                        onChange={handleChange}
                        value={formData.discount}
                        className="form-control"
                        placeholder="Enter discount amount"
                        min="0"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Final Payable Amount (₹)
                      </label>
                      <input
                        type="number"
                        name='final_amount'
                        id='final_amount'
                        value={finalAmount || selectedFeesAmount}
                        className="form-control"
                        readOnly
                      />
                    </div>
                  </div>

                  <Form.Check
                    type="checkbox"
                    id="confirmCheckbox"
                    label="I confirm that the fee details are correct and I want to apply these fees to the selected student."
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="mt-4 fw-semibold cursor-pointer"
                  />
                </Alert>
                <div className="d-flex justify-content-end gap-3 mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowCollapse(false)}
                  >
                    Cancel
                  </Button>

                  <ButtonWithLoader
                    type="submit"
                    variant="success"
                    size="md"
                    disabled={!isConfirmed || isLoading}
                    isLoading={isLoading}
                  >
                    <>Apply Fees</>
                  </ButtonWithLoader>
                </div>
              </div>
          </Form>
          </Collapse>
        </Row>
      )}
    </>
  )
}
