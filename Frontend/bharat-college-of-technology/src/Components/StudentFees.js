import { useEffect, useState } from 'react'
import { Button, Row, Col, Alert, Collapse, Form, Table } from 'react-bootstrap'
import { FaCheckCircle, FaDollarSign, FaEye, FaPrint, FaRupeeSign } from 'react-icons/fa'
import Select from 'react-select'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

export default function StudentFees() {
  const [allCourses, setAllCourses] = useState([])
  const [
    allStudentsBySelectedCourse,
    setAllStudentsBySelectedCourse,
  ] = useState([])
  const [allFeesBySelectedStudent, setAllFeesBySelectedStudent] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [selectedCourseName, setSelectedCourseName] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedFeesId, setSelectedFeesId] = useState('')
  const [showCollapse, setShowCollapse] = useState(false)
  const [openSelectedFields, setOpenSelectedFields] = useState(false)

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
  const studentNameOption = allStudentsBySelectedCourse.map((st) => ({
    label: st.name,
    value: st._id,
  }))

  const selectedStudent = studentNameOption.find((st)=>st.value === selectedStudentId)

  const handleCourseSelectedField = (selectedOption) => {
    setSelectedStudentId(null)
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
          setAllFeesBySelectedStudent(feesByCourse.data.fees)
        } catch (error) {
          console.log(error.response?.data?.message)
        }
      }
      fetchStudentsByCourse()
    } else {
      setAllFeesBySelectedStudent([])
    }
  }

  const handleStudentSelectField = (selectedOption) => {
    if (selectedOption) {
      const studentId = selectedOption.value
      console.log('Selected student id:', studentId)

      setSelectedStudentId(studentId)

      if(studentId){
        const studentName = allStudentsBySelectedCourse.find((st)=>st._id === studentId)

        if(studentName){
          console.log("Student name:", studentName.name)
          setSelectedStudentName(studentName.name)

        }

        const payload = {
          course:selectedCourseId,
          student:studentId,
        }
        const fetchFeesByStudent = async ()=>{
          const studentFeesResp = await ApiEndpoints.getFeesForStudent(payload)
          console.log('All fees of student', studentFeesResp.data.fees)
          setAllFeesBySelectedStudent(studentFeesResp.data.fees)
        }
        fetchFeesByStudent()
        setShowCollapse(true)
      }
    } else {
      setShowCollapse(false)
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
            ---| <span className="text-white"> Student Fees</span> |---
          </h3>
        </Col>

        <Col className="text-end">
          <Button
            variant="link"
            className=" text-decoration-none text-white"
            onClick={() => setOpenSelectedFields(true)}
          >
            [ <FaEye /> View Student Fees ]
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
              <strong>Student</strong>
              <Select
                options={studentNameOption}
                isClearable
                placeholder="🔍 Search or select a student name..."
                onChange={handleStudentSelectField}
                value={selectedStudent || null}
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
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table className="mt-2">
            <thead>
              <tr>
                <th>Fees Name</th>
                <th>Amount (₹)</th>
                <th>Discount (₹)</th>
                <th>Final Amount (₹)</th>
                {/* <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                   {allFeesBySelectedStudent.length > 0 ? (
                     allFeesBySelectedStudent.map((fee, index) => (
                       <tr key={index}>
                         <td>
                           {fee.fees?.fees_name}
                         </td>
                         <td>₹ {fee.original_amount}</td>
                         <td>{fee.discount ?  `₹ ${fee.discount}`: `₹ 0`}</td>
                         <td>₹ {fee.final_amount}</td>
                         {/* <td>{fee.status}</td> */}
                         <td>
                            <Button
                              title="Take fees"
                              variant="link"
                              className="btn link-danger btn-link"
                            >
                              <span style={{ fontSize: '1.5rem', marginRight: '4px' }}>💵</span>
                            </Button>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td className="text-center text-danger" colSpan="6">
                         No fees found
                       </td>
                     </tr>
                   )}
                 </tbody> 
          </Table>
        </div>
      )}
    </>
  )
}
