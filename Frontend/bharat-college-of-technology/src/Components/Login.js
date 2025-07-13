import { Button } from 'react-bootstrap'
import { useAuth } from '../CommonComponents/AuthContext'
import { FaSignOutAlt, FaUser } from 'react-icons/fa'

export default function Login() {
  const { user, logout } = useAuth()
  console.log('USER:', user)
  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <Button
          style={{ letterSpacing: '3px' }}
          variant="link"
          className="text-danger text-decoration-none border-none fw-semibold ms-1"
          onClick={() => {
            logout()
          }}
        >
          <span className="border border-warning px-3 py-1 rounded text-white d-inline-flex align-items-center gap-2">
            <FaSignOutAlt />
            Logout
          </span>
        </Button>
      </div>
    </>
  )
}
