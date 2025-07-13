import { useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { FaSpinner, FaSync } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'

export default function ResetPassword({
  showReset,
  hideReset,
  data,
  hideForgotPassowrd,
}) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  console.log('Data comming from forgot password to reset password:', data)

  const token = data.resetToken
  console.log('Token from data:', token)

  const handleReset = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Missing reset token')
      return
    }
    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill all fields')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    try {
      setLoading(true)
      const response = await ApiEndpoints.resetPassword(token, newPassword)
      console.log('Response after reset:', response.data)
      toast.success(response.data.message)
      hideReset()
      hideForgotPassowrd()
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  if (!showReset) return null

  return (
    <Container
      // show={showReset}
      // onHide={hideReset}
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Card
        className="shadow p-4 "
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h4 className="text-center text-white rounded-top fw-bold mb-4 bg-dark p-2">
          Reset Password
        </h4>
        <Form onSubmit={handleReset}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">RegisteredEmail</Form.Label>
            <Form.Control disabled value={data.email} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <div className="gap-2 d-flex align-items-end justify-content-between bg-">
            <Button
              variant="link"
              className="btn btn-link link-danger fw-bold text-decoration-none"
              title="Close"
              onClick={hideReset}
            >
              [ X ]
            </Button>
            <Button
              variant="link"
              className="fw-bold btn btn-link link-success text-decoration-none"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  [ <FaSpinner /> Resetting... ]
                </>
              ) : (
                <>
                  [ <FaSync /> Reset Password ]
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  )
}
