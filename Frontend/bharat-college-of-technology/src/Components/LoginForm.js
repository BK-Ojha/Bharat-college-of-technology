import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { MdSend } from 'react-icons/md'
import { useAuth } from '../CommonComponents/AuthContext'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import ResetPassword from './ResetPassword'
import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

export function LoginForm() {
  // const [searchParams] = useSearchParams()
  // const tokenFromURL = searchParams.get('token')
  // console.log('tokenFromURL', tokenFromURL)
  const location = useLocation()
  const { login, signup } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const autoFilledEmail = location.state?.email || ''
  console.log('autoFilledEmail', autoFilledEmail)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPasswrod, setShowForgotPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [token, setToken] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: autoFilledEmail || '',
    password: '',
  })
  const [resetEmail, setResetEmail] = useState(autoFilledEmail || '')
  const [resetAutoFilled, setResetAutoFilled] = useState(!!autoFilledEmail)
  const [selectedImage, setSelectedImage] = useState(null)

  const triggerPassword = () => {
    // If password is hidden, it becomes visible.
    setShowPassword(!showPassword)

    // Always sets showPassword to true
    //   setShowPassword(true);
  }

  useEffect(() => {
    if (!autoFilledEmail && formData.email) {
      // setFormData((prev) => ({ ...prev, email: autoFilledEmail }))
      // setResetEmail(autoFilledEmail)
      // setResetAutoFilled(true)
      setResetEmail(formData.email)
    }
  }, [autoFilledEmail, formData.email])

  const handleChange = async (e) => {
    const { id, value } = e.target
    // If user starts typing, allow editing
    if (id === 'email' && !autoFilledEmail) {
      setResetAutoFilled(value)
    }
    // Updating the formData state using the previous state (prevData) to avoid overwriting other fields.
    setFormData((prevData) => {
      // User selects Admin → fills in admin_name
      // Then changes role to Teacher → this logic clears out the admin_name
      if (id === 'role') {
        return { ...prevData, role: value, name: '' }
      }

      return { ...prevData, [id]: value }
    })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 2 * 1024 * 1024
    if (!file) return
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, and PNG formats are allowed')
    }
    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB')
    }
    setSelectedImage(file)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (isSignup) {
        const formDataToSend = new FormData()

        formDataToSend.append('role', formData.role)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('password', formData.password)

        if (formData.role === 'admin') {
          // "admin_name" must belongs to backend's schema
          formDataToSend.append('admin_name', formData.name)
        } else if (formData.role === 'student') {
          formDataToSend.append('name', formData.name)
        }

        if (selectedImage) {
          formDataToSend.append('image', selectedImage)
        }
        response = await signup(formDataToSend)
      } else {
        response = await login(formData)
      }

      if (response.status) {
        toast.success(response.message)
        if (isSignup) {
          setIsSignup(false)
          setFormData({
            role: formData.role,
            email: formData.email,
            password: '',
            name: '',
          })
          setSelectedImage(null)
        }
      } else {
        toast.error(response.message)
        setShowForgotPassword(true)
      }
    } catch (error) {
      toast.error(error.response?.data?.message + '. Please try again')
      // setShowForgotPassword(true)
    }
  }

  const handleForgotPassword = async (e) => {
    setShowResetPassword(true)
    e.preventDefault()
    try {
      // const token = localStorage.getItem('token')
      const response = await ApiEndpoints.forgotPassword({
        email: resetEmail,
      })
      toast.success(response.data.message)

      const resetLink = `http://localhost:3000/reset-password?token=${response.data.token}`
      console.log('resetLink', resetLink)
      setToken(response.data.token)

      setShowResetPassword(true)
    } catch (error) {
      toast.error(error.response?.data?.message)
      setShowResetPassword(false)
    }
  }
  return (
    <Container
      fluid
      style={{ borderTopLeftRadius: '100px', borderBottomRightRadius: '100px' }}
      className="vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      {/* <Row>
        <img src='/banner' alt='Banner'/>
      </Row> */}
      {!showResetPassword && (
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="shadow-lg p-4">
              <Card.Body>
                <h3 className="text-center mb-4 text-dark fw-bold">
                  {isSignup ? 'Sign Up' : 'Login'}
                </h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Role</Form.Label>
                    <Form.Select
                      id="role"
                      value={formData.role}
                      required
                      onChange={handleChange}
                    >
                      <option value="">Select your role</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </Form.Select>
                  </Form.Group>

                  {isSignup && formData.role && (
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        {formData.role === 'admin'
                          ? 'Admin Name'
                          : 'Student Name'}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name"
                        value={formData.name}
                        placeholder="Enter your name"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="text"
                      id="email"
                      value={formData.email}
                      placeholder="Enter your email"
                      required
                      onChange={handleChange}
                      readOnly={!!autoFilledEmail}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        // If showPassword is true, then type="text" → password is visible in text formate.
                        // If showPassword is false, then type="password" → password is hidden as dots or asterisks
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        required
                        onChange={handleChange}
                      />
                      <div
                        className="bg-dark"
                        onClick={triggerPassword}
                        style={{
                          cursor: 'pointer',
                          padding: '10px 12px',

                          color: 'white',
                          border: '1px solid #ced4da',
                          borderRadius: '0.25rem',
                          marginLeft: '8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {showPassword ? (
                          <FaEyeSlash title="Hide" />
                        ) : (
                          <FaEye title="Show" />
                        )}
                      </div>
                    </div>
                  </Form.Group>

                  {!isSignup && (
                    <div className="text-end mt-2">
                      <Button
                        variant="link-dark"
                        className="p-0 text-dark text-decoration-underline"
                        onClick={() => {
                          // setDisplayForgotButton(false)
                          setShowForgotPassword(true)
                        }}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                  )}

                  {showForgotPasswrod && (
                    <>
                      <Card className="mt-3 p-3">
                        <div className="d-flex justify-content-between align-items-center mb-1 bg-dark p-2 rounded-top">
                          <h5 className=" mb-2 fw-bold text-white mt-2">
                            Reset Password
                          </h5>
                          <button
                            variant="link"
                            className="fw-bold btn btn-link link-danger text-danger text-decoration-none"
                            title="Close"
                            onClick={() => {
                              setShowForgotPassword(false)
                            }}
                          >
                            [ X ]
                          </button>
                        </div>
                        <Form>
                          <Form.Group>
                            <Form.Label className="fw-semibold mt-2">
                              Enter your registered email{' '}
                              <Button
                                variant="link"
                                className="btn btn-link link-success fw-semibold text-decoration-none"
                                type="submit"
                                onClick={handleForgotPassword}
                              >
                                [ <MdSend /> Send Email ]
                              </Button>
                            </Form.Label>
                            <Form.Control
                              placeholder="Enter email"
                              type="email"
                              value={resetEmail}
                              required
                              readOnly={resetAutoFilled}
                              onChange={(e) => {
                                setResetEmail(e.target.value)
                                setResetAutoFilled(false)
                              }}
                            />
                          </Form.Group>
                        </Form>
                      </Card>
                    </>
                  )}
                  {isSignup && formData.role && (
                    <Form.Group>
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control
                        type="file"
                        // Accepted for all types of image
                        // accept="image/*"

                        accept="image/jpeg/, image/jpg, image/png"
                        onChange={handleImage}
                        required
                      />
                    </Form.Group>
                  )}
                  <div className="d-grid fw-semibold mt-2">
                    <Button variant="dark" type="submit" className="fw-bold">
                      {isSignup ? 'Sign UP' : 'Login'}
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-3">
                  <span className="text-muted me-2">
                    {isSignup ? 'Already have an account?' : "Haven't account?"}
                  </span>
                  <Button
                    type="submit"
                    variant="link-dark"
                    className="fw-bold text-dark text-decoration-underline"
                    onClick={() => setIsSignup(!isSignup)}
                  >
                    {isSignup ? 'Login' : 'Sign UP'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      <ResetPassword
        showReset={showResetPassword}
        hideReset={() => setShowResetPassword(false)}
        data={{ email: resetEmail, resetToken: token }}
        hideForgotPassowrd={() => setShowForgotPassword(false)}
      />
    </Container>
  )
}

export default LoginForm
