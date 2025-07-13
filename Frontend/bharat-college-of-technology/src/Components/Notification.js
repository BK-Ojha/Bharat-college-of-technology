import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaClipboardCheck } from 'react-icons/fa'

export default function Notification() {
  const [latestStudents, setLatestStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchLatestStudent = async () => {
    try {
      const response = await ApiEndpoints.getLatestStudent()
      console.log('All new students:', response.data.students)

      const unSeenStudents = response.data.students.filter(
        (student) => !student.isSeenByAdmin,
      )

      setLatestStudents(unSeenStudents)
      setLoading(false)

      const updateCount = unSeenStudents.length
      const prevCount = parseInt(
        localStorage.getItem('newstudentRegistered') || '0',
      )

      if (prevCount !== updateCount) {
        // Save new notification status
        localStorage.setItem('newstudentRegistered', updateCount)

        window.dispatchEvent(
          new CustomEvent('notificationCountUpdate', {
            detail: { count: updateCount },
          }),
        )
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchLatestStudent()

    // Listen for count updates
    const handleCountUpdate = (e) => {
      fetchLatestStudent()
    }

    window.addEventListener('notificationCountUpdate', handleCountUpdate)
    return () => {
      window.removeEventListener('notificationCountUpdate', handleCountUpdate)
    }
  }, [])

  return (
    <div className=" p-2 mt-1  w-100">
      {/* <div className="container bg-dark"> */}
      <div
        className="bg-dark rounded-top mt-2 mb-4 p-3"
        style={{ marginBottom: '-2rem' }}
      >
        <h3 className="text-white mb-3 ">📢 Latest Student Registrations</h3>
        <p className="text-warning fw-semibold">
          ⚠️ Please review and complete the profiles of newly registered
          students.
        </p>
        {/* </div> */}
      </div>
      <div>
        {loading ? (
          <Spinner animation="border" variant="dark" />
        ) : latestStudents.length === 0 ? (
          <p>No new student registrations found.</p>
        ) : (
          <Row className="g-3">
            {latestStudents.map((ls) => (
              <Col key={ls._id} md={6}>
                <Card className="shadow-sm border-dark h-100">
                  <Card.Body>
                    <Col md={6}>
                      <h5 className="mb-2 fw-bold text-dark d-flex justify-content-between align-items-center">
                        {ls.name?.toUpperCase()}
                        <Button
                          className="fw-semibold text-decoration-none"
                          style={{ letterSpacing: '2px' }}
                          variant="link"
                          size="sm"
                          onClick={() => {
                            localStorage.setItem('selectedStudentId', ls._id)
                            navigate('/StudentList', { state: { id: ls._id } })
                            console.log('ID of selected student:')
                          }}
                        >
                          [ <FaClipboardCheck /> Review ]
                        </Button>
                      </h5>

                      <p className="mb-1">
                        <strong className="fw-semibold">Email: </strong>
                        {ls.email}
                      </p>
                      <p className="mb-1">
                        <strong className="fw-semibold">Address: </strong>
                        {ls.address}
                      </p>
                      <p className="mb-1">
                        <span>
                          <strong className="fw-semibold">
                            Date of birth:{' '}
                          </strong>
                          {ls.dob
                            ? new Date(ls.dob).toLocaleDateString('en-In', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                      </p>
                    </Col>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}
