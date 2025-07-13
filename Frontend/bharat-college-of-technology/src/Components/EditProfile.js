import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { useAuth } from '../CommonComponents/AuthContext'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { useEffect } from 'react'
import { FaCheck, FaPlus, FaSave, FaSyncAlt } from 'react-icons/fa'
import { useNotification } from '../CommonComponents/NotificationContext'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

const EditProfile = ({
  hide,
  data,
  onProfileUpdate,
  isAdminEditStudent,
  student_id,
}) => {
  const { user, setUser } = useAuth()
  const { updateCount } = useNotification()
  console.log('updateCount', updateCount)

  const [showEmptyForm, setShowEmptyForm] = useState()
  console.log('isAdminEditStudent', isAdminEditStudent ? 'admin' : 'student')
  const [formData, setFormData] = useState({
    alternate_number: '',
  })
  const [updatedCourse, setUpdatedCourse] = useState('')
  // const [selectedCourse, setSelectedCourse] = useState([])
  // const [selectedDuration, setSelectedDuration] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [courses, setCourses] = useState([])
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await ApiEndpoints.getAllCourses()
        console.log('res', res.data.courses)
        const formatedCourse = res.data.courses.map((cs) => ({
          value: cs._id,
          // label: What will be displayed in the dropdown.
          label: cs.name,
          duration: cs.duration,
        }))

        console.log('formatedCourse', formatedCourse)
        setCourses(formatedCourse)
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    fetchCourses()
  }, [])

  // This initializes a React state to track which fields the user has interacted with.
  // touchedFields is a Set, a JavaScript collection that stores unique values (no duplicates)
  // You use a Set here because:
  // You only need to remember which fields were touched.
  // Set operations like add and has are efficient
  // SUMMARY:
  // Set for state	Tracks which fields the user touched.
  // setTouchedFields	Adds field name to that Set on change.
  // filter condition	Ensures once touched, fields stay visible.
  // isDisabled logic	Disables blank fields until user interacts.
  const [touchedFields, setTouchedFields] = useState(new Set())

  const [initialFormData, setInitialFormData] = useState(null)

  useEffect(() => {
    if (!data || !user?.role) return

    const initialData = isAdminEditStudent
      ? {
          name: data.name || '',
          roll_no: data.roll_no || '',
          gender: data.gender || '',
          dob: data.dob?.substring(0, 10) || '',
          email: data.email || '',
          address: data.address || '',
          father_name: data.father_name || '',
          mother_name: data.mother_name || '',
          mobile: data.mobile || '',
          admission_date: data.admission_date?.substring(0, 10) || '',
          course: data.course?._id || '',
          duration: data.course?.duration || '',
          alternate_number: data.alternate_number || '',
        }
      : user?.role === 'admin'
      ? {
          admin_name: data.admin_name || '',
          gender: data.gender || '',
          dob: data.dob?.substring(0, 10) || '', // Format to 'YYYY-MM-DD'
          email: data.email || '',
          mobile: data.mobile || '',
          address: data.address || '',
        }
      : {
          name: data.name || '',
          gender: data.gender || '',
          dob: data.dob?.substring(0, 10) || '',
          email: data.email || '',
          address: data.address || '',
          father_name: data.father_name || '',
          mother_name: data.mother_name || '',
          mobile: data.mobile || '',
          admission_date: data.admission_date?.substring(0, 10) || '',
          alternate_number: data.alternate_number || '',
          course: data.course?._id || '',
          duration: data.course?.duration || '',
        }
    console.log('initialData', initialData)
    setFormData(initialData)
    setInitialFormData(initialData)
  }, [data, user, isAdminEditStudent])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const updateForm = { ...prev, [name]: value }

      if (name === 'course') {
        // cs.value: This is the unique ID of the course (like "68366877cbd74dedfa496bf4").
        // value: This is the ID of the course the user just selected in the dropdown.
        const selectedCourse = courses.find((cs) => cs.value === value)
        console.log('selectedCourse', selectedCourse)

        if (selectedCourse) {
          updateForm.duration = selectedCourse.duration
        } else {
          updateForm.duration = ''
        }
      }
      console.log('Updated Form:', updateForm)
      return updateForm
    })
    // Track touched fields
    // prev is the current touchedFields Set.
    // new Set(prev) makes a new copy (React doesn't detect mutations on the original Set).
    // .add(name) adds the field name to the new Set.
    // So if the user changes email, the Set becomes: Set { 'email' }.
    // React then re-renders with this updated touchedFields state.
    setTouchedFields((prev) => new Set(prev).add(name))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (user?.role === 'admin' && isAdminEditStudent && !formData.course) {
        toast.error('Please select course')
        return
      }
      const payload = {
        ...formData,
        alternate_number: Number(formData.alternate_number) || null,
        isSeenByAdmin: true,
      }

      if (isAdminEditStudent) {
        payload.student_id = data.id
      }
      console.log('Payload to send:', payload)

      let response
      if (user.role === 'admin' && student_id) {
        response = await ApiEndpoints.editStudentDataByAdmin(
          student_id,
          payload,
        )
        console.log(
          'response during edit: ',
          response.data?.profile?.student?.course?.name,
        )

        const seenIds = JSON.parse(
          localStorage.getItem('seenStudentIds') || '[]',
        )
        const currentCount = parseInt(
          localStorage.getItem('newstudentRegistered') || 0,
        )
        const selectedNewStudentRegId = localStorage.getItem(
          'selectedStudentId',
        )

        console.log('Current count:', currentCount)
        console.log('Seen IDs:', seenIds)
        console.log('Selected student ID:', selectedNewStudentRegId)
        console.log('Current student ID:', student_id)
        // If this was a newly registered student
        if (
          selectedNewStudentRegId === student_id &&
          !seenIds.includes(student_id)
        ) {
          // Update all storage values
          const update = Math.max(currentCount - 1, 0)
          const newSeenIds = [...seenIds, student_id]

          console.log('Updating count to:', update)
          console.log('Updating seenStudentIds to:', newSeenIds)
          localStorage.setItem('seenStudentIds', JSON.stringify(newSeenIds))

          updateCount(update)
        } else {
          console.log('No update to count needed')
        }
        localStorage.removeItem('selectedStudentId')

        const updatedSelectedCourse =
          response.data?.profile?.student?.course?.name

        setUpdatedCourse(updatedSelectedCourse)
      } else {
        response = await ApiEndpoints.editProfileByUser(payload)
      }
      await new Promise((res) => setTimeout(res, 1000))

      toast.success(response.data.message)

      const updatedProfile = response.data.profile || response.data.student
      console.log('updatedProfile', response.data.profile)
      console.log('updatedStudent', response.data.student)

      const existingUser = JSON.parse(localStorage.getItem('user'))
      console.log('existingUser', existingUser)

      const updatedUser = {
        ...existingUser,
        name:
          updatedProfile.name || updatedProfile.admin_name || existingUser.name,
        image: updatedProfile.image || existingUser.image,
        course:
          updatedProfile?.student?.course?.name || existingUser?.course?.name,
        isSeenByAdmin: true,
      }

      console.log('updated User', updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      //So we can use it as -> typeof onProfileUpdate === 'function' that Checks if the onProfileUpdate variable exists and is a function before calling it. This prevents runtime errors.
      if (typeof onProfileUpdate === 'function') {
        console.log('Calling onProfileUpdate callback....')
        await onProfileUpdate() // Refresh or re-fetch data after an update
        console.log('Passing to EditProfile:', { onProfileUpdate })
      } else {
        console.log('onProfileUpdate is not a function')
      }

      hide()
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }
  const handleRefresh = () => {
    if (initialFormData) {
      setFormData(initialFormData)
    }
  }

  const genderFormate = ['Male', 'Female', 'Other']
  const genderOptions = genderFormate.map((gd) => ({
    label: gd,
    value: gd,
  }))
  const adminFields = [
    { label: 'Full Name', name: 'admin_name' },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      options: genderOptions,
    },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
    // { label: 'Email', name: 'email', type: 'email' },
    // { label: 'Mobile Number', name: 'mobile', type: 'tel' },
    { label: 'Address', name: 'address', type: 'text' },
  ]

  const editByStudent = [
    'name',
    'gender',
    'dob',
    'address',
    'alternate_number',
    'image',
  ]
  const studentFields = [
    { label: 'Full Name', name: 'name' },
    // { label: 'Roll No.', name: 'roll_no' },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      options: genderOptions,
    },
    { label: 'Date of Birth', name: 'dob', type: 'date' },
    { label: 'Address', name: 'address', type: 'text' },
    {
      label: 'Mobile',
      name: 'mobile',
      type: 'number',
      disabled: user?.role === 'student' ? false : undefined,
    },
    { label: 'Alternate Number', name: 'alternate_number', type: 'number' },

    {
      label: 'Father Name',
      name: 'father_name',
      type: 'text',
      disabled: user?.role === 'student' ? false : undefined,
    },
    {
      label: 'Mother Name',
      name: 'mother_name',
      type: 'text',
      disabled: user?.role === 'student' ? false : undefined,
    },
    {
      label: 'Roll Number',
      name: 'roll_no',
      type: 'number',
      disabled: user?.role === 'student' ? false : undefined,
    },
    {
      label: 'Admission Date',
      name: 'admission_date',
      type: 'date',
      disabled: user?.role === 'student' ? false : undefined,
    },
    {
      label: 'Course',
      name: 'course',
      type: 'select',
      options: courses,
      disabled: user?.role === 'student',
    },
    {
      label: 'Duration',
      name: 'duration',
      disabled: user?.role === 'student' || user?.role === 'admin',
      readOnly: true,
      value:
        courses.find((cs) => cs.value === formData.course)?.duration ||
        formData.duration ||
        '',
    },
  ]

  const fieldsToShow = isAdminEditStudent
    ? studentFields
    : user?.role === 'admin'
    ? adminFields
    : studentFields.filter(
        (field) =>
          editByStudent.includes(field.name) || !user?.role === 'student',
      )

  // chunkArray is used to split an array into smaller chunks (subarrays)
  // arr: the original array
  // chunkSize: the size of each chunk you want
  const chunkArray = (arr, chunkSize) => {
    // This creates an empty array to store the resulting chunks.
    const result = []
    // A for loop that increments by chunkSize, so it skips to the next chunk position on each iteration.
    for (let i = 0; i < arr.length; i += chunkSize) {
      // arr.slice(i, i + chunkSize) extracts a subarray from index i to i + chunkSize
      //  .push used here for this subarray (chunk) is added to result
      result.push(arr.slice(i, i + chunkSize))

      // chunkArray([1, 2, 3, 4, 5, 6, 7], 3)
      // Output: [[1, 2, 3], [4, 5, 6], [7]]
    }
    return result
  }
  return (
    <>
      <Card className="shadow p-4 mt-3 mb-3">
        {/* justify-content-between : horizontally, with the first item pushed to the left, the last item pushed to the right */}
        {/* align-items-center :  Aligns items vertically centered inside the container */}
        <div className="d-flex justify-content-between align-items-center mb-3 bg-dark text-white rounded-top p-4">
          <h4 className="mb-0 ">
            {isAdminEditStudent ? (
              <span>
                Update <span className="text-warning">{data.name}</span> info
              </span>
            ) : (
              'Update your profile'
            )}
          </h4>
          <Button
            variant="link"
            className="text-warning"
            title="Refresh form"
            onClick={handleRefresh}
          >
            <FaSyncAlt size={20} />
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control disabled value={formData.email} />
            </Form.Group>
          </Row>
          {chunkArray(
            fieldsToShow.filter((field) => {
              const value = formData?.[field.name]
              return (
                showEmptyForm ||
                (value !== '' && value !== undefined && value !== null)
              )
            }),
            2,
          ).map((fieldPair, rowIndex) => (
            <Row className="mb-3" key={rowIndex}>
              {fieldPair.map((field) => {
                // This is in the filter() before rendering each field.
                // It decides whether to render the field or skip it.

                // showEmptyForm: If "Add More Data" is clicked, show all fields.
                // (value !== '' && value !== undefined && value !== null): If field already has value, show it.
                // touchedFields.has(field.name): If the user has interacted with this field, show it — even if it's now empty again.
                // const isDisabled =
                // showEmptyForm: We’re in "Add More Data" mode.
                // value === '': The current value is still empty.
                // !touchedFields.has(field.name): And the user hasn’t interacted with this field yet.
                // showEmptyForm &&
                // value === '' &&
                // !touchedFields.has(field.name)

                // If all three are true, it means:
                // Field is part of the blank group,
                // User hasn't typed anything into it yet,
                // So it stays disabled.
                return (
                  <Col md={6} key={field.name}>
                    <Form.Group controlId={field.name}>
                      <Form.Label> {field.label} </Form.Label>
                      {field.type === 'select' ? (
                        <Form.Select
                          name={field.name}
                          value={formData[field.name] || ''}
                          disabled={field.disabled || false}
                          onChange={handleChange}
                        >
                          <option value="">Select {field.label} </option>
                          {field.options?.map((opt, index) => (
                            <option key={index} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name] || field.value || ''}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          disabled={field.disabled}
                          onChange={handleChange}
                        />
                      )}
                    </Form.Group>
                  </Col>
                )
              })}
            </Row>
          ))}

          <div className="align-items-center justify-content-between d-flex mt-4 bg-dark p-2 rounded-top">
            {!showEmptyForm && (
              <div className="text-start">
                <Button
                  className="d-flex align-items-center gap-2 btn btn-link link-info text-decoration-none"
                  variant="link"
                  onClick={() => setShowEmptyForm(true)}
                >
                  [ <FaPlus size={20} /> Add More Data ]
                </Button>
              </div>
            )}
            <div className="text-end gap-2 d-flex">
              <Button
                variant="link"
                title="Close"
                className="btn btn-link link-danger text-decoration-none fw-bold"
                onClick={hide}
              >
                [ X ]
              </Button>
              {/* <Button
                variant="link"
                className="btn btn-link link-warning text-decoration-none fw-bold d-flex align-items-center gap-2"
                type="submit"
              >
                [ <FaSave /> Save ]
              </Button> */}
              <ButtonWithLoader
                className="btn btn-link link-warning text-decoration-none fw-bold d-flex align-items-center gap-2"
                type="submit"
                variant="link"
                isLoading={isLoading}
              >
                <>
                  [ <FaSave /> Save ]
                </>
              </ButtonWithLoader>
            </div>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default EditProfile
