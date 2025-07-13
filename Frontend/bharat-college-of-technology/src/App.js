import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import SideNavbar from './CommonComponents/SideNavbar'
import Dashboard from './Components/Dashboard'
import StudentList from './Components/StudentList'
import Enquiries from './Components/Enquiries'
import { Toastifier } from './CommonComponents/Toastifier'
import CourseList from './Components/CourseList'
import { Col, Row } from 'react-bootstrap'
import LoginForm from './Components/LoginForm'
import { useAuth } from './CommonComponents/AuthContext'
import UserProfile from './Components/UserProfile'
import Notification from './Components/Notification'
import SubjectList from './Components/SubjectList'
import FeesStructure from './Components/FeesStructure'
import ApplyFees from './Components/ApplyFees'
import StudentFees from './Components/StudentFees'
import FeesCollection from './Components/FeesCollection'
import TakeFees from './Components/TakeFees'

function App() {
  // useLocation access the current URL location (like the path, search params, and hash) from anywhere in your app.

  const { user } = useAuth()
  const location = useLocation()
  const isLoginPage = location.pathname === '/Login'
  const navigate = useNavigate()
  // ✅ Redirect unauthenticated users to login
  if (!user && !isLoginPage) {
    // useNavigate() is a hook, that not render anything; it just programmatically navigates

    // <Navigate/> redirect immediately when it renders.
    // Useful in components like App.js or PrivateRoute where you conditionally render something based on state or auth.
    return <Navigate to="/Login" replace />
  }

  const generateBreadcrumb = (path) => {
    const mapping = {
      Dashboard: 'Home',
      StudentList: 'Manage Student / Students',
      Enquiries: 'Manage Enquiry / Enquiries',
      CourseList: 'Manage Course / Courses',
      SubjectList: 'Manage Course / Subjects',
      FeesStructure: 'Manage Fees / Fees Structure',
      ApplyFees: 'Manage Fees / Apply Fees',
      TakeFees: 'Manage Fees / Take Fees',
      Notification: 'Notifications',
      UserProfile: 'User Profile',
    }

    const segments = path.split('/').filter(Boolean) // Remove empty strings
    if (segments.length === 0) return 'Home'
    return segments
      .map((segment, index) => {
        if (segment === 'UserProfile' && segments[index + 1])
          return 'User Profile'
        return mapping[segment] || segment.replace(/([A-Z])/g, ' $1').trim()
      })
      .join(' / ')
  }
  return (
    <>
      <style>
        {`
            .scrolling-text {
              overflow: hidden;
              white-space: nowrap;
              box-sizing: border-box;
              width: 100%;
              color: #333;
              font-weight: 500;
              position: relative;
            }

            .scrolling-text span {
              display: inline-block;
              padding-left: 100%;
              animation: scroll-text 30s linear infinite;
            }

            @keyframes scroll-text {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
        `}
      </style>
      <Toastifier />

      <div
        className="d-flex"
        style={{ height: '100vh', overflow: 'hidden', marginBottom: '-2rem' }}
      >
        {/* Only show SideNavbar and header if not on login page and user exists */}
        {!isLoginPage && user && <SideNavbar />}

        <div
          className="flex-grow-1 p-3 d-flex flex-column"
          style={{ overflowY: 'auto' }}
        >
          {!isLoginPage && user && (
            <>
              <Row className="align-items-center">
                <Col className="text-center">
                  <h2 className="text-dark fw-bold text-uppercase mb-0">
                    Bharat College Of Technology
                  </h2>
                  <div className="scrolling-text mt-2">
                    <span>
                      Bharat College of Technology is committed to excellence in
                      technical education, innovation, and research, fostering
                      professionals equipped with skills, knowledge, and values
                      to shape a better future.
                    </span>
                  </div>
                </Col>

                <Col xs="auto" className="d-flex flex-column align-items-end">
                  <div
                    onClick={() => navigate('/UserProfile')}
                    style={{ cursor: 'pointer' }}
                    className="d-flex align-items-center gap-3"
                  >
                    <img
                      src={user.image}
                      alt="User"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />

                    <div className="text-end">
                      {user?.role === 'admin' && (
                        <div className="text-warning fw-bold small text-uppercase">
                          Admin
                        </div>
                      )}
                      {user?.role === 'student' && (
                        <div className="text-info fw-bold small text-uppercase">
                          Student
                        </div>
                      )}
                      <div className="fw-semibold text-dark">
                        {user?.name?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="text-end text-muted fw-semibold small mt-2">
                    {generateBreadcrumb(location.pathname)}
                  </div>
                </Col>
              </Row>
            </>
          )}

          <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<LoginForm />} />
            <Route path="/Notification" element={<Notification />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/StudentList" element={<StudentList />} />
            <Route path="/Enquiries" element={<Enquiries />} />
            <Route path="/CourseList" element={<CourseList />} />
            <Route path="/SubjectList" element={<SubjectList />} />
            <Route path="/FeesStructure" element={<FeesStructure />} />
            <Route path="/ApplyFees" element={<ApplyFees />} />
            <Route path="/StudentFees" element={<StudentFees />} />
            <Route path="/FeesCollection" element={<FeesCollection />} />
            <Route path="/TakeFees" element={<TakeFees />} />
            <Route path="/UserProfile/:student_id?" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
