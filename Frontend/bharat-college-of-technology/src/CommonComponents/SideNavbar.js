import {
  FaBell,
  FaBookOpen,
  FaCog,
  FaRupeeSign,
  FaTachometerAlt,
  FaUserGraduate,
} from 'react-icons/fa'
import { useAuth } from './AuthContext'
import Login from '../Components/Login'
import { useNavigate } from 'react-router-dom'
import { useNotification } from './NotificationContext'
import { MdSend } from 'react-icons/md'
import { useState } from 'react'

export default function SideNavbar() {
  const { user } = useAuth()
  console.log(user)
  const navigate = useNavigate()
  const { count } = useNotification()
  console.log('count', count)
  const [openMenu, setOpenMenu] = useState(null)

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName))
  }

  return (
    <div
      className="d-flex flex-column vh-100 p-3 bg-dark"
      style={{ width: '280px' }}
    >
      <div
        onClick={() => navigate('/Dashboard')}
        className="d-flex justify-content-center align-items-center w-100 "
      >
        <img
          src="/logo.png"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          alt="Logo"
        />
      </div>

      <hr style={{ color: 'white' }} />
      <ul className="nav nav-pills flex-column mb-auto">
        {user?.role === 'admin' && (
          <li className="nav-item">
            <a
              href="/Notification"
              // className="nav-link text-white"
              className={`nav-link ${count > 0 ? 'text-danger' : 'text-white'}`}
              aria-current="page"
            >
              <FaBell /> Notification
              <span className="ms-1">{count}</span>
            </a>
          </li>
        )}
        <hr style={{ color: 'white' }} />

        {user?.role === 'admin' && (
          <li className="nav-item">
            <a
              href="/Dashboard"
              className="nav-link text-white"
              aria-current="page"
            >
              <FaTachometerAlt /> Dashboard
            </a>
          </li>
        )}

        <hr style={{ color: 'white' }} />

        {/* Student Management */}
        {(user?.role !== 'student' || user?.role === 'admin') && (
          <li>
            <button
              onClick={() => toggleMenu('students')}
              className="nav-link btn btn-toggle align-items-center rounded collapsed text-white"
            >
              <FaUserGraduate /> Manage Students
            </button>
            <hr style={{ color: 'white' }} />

            {openMenu === 'students' && (
              <div>
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small text-center">
                  <li>
                    <a
                      href="/StudentList"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Student
                    </a>
                   
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}

        {/* Courses  */}
        {user?.role === 'admin' && (
          <li>
            <button
              onClick={() => toggleMenu('courses')}
              className="nav-link btn btn-toggle align-items-center rounded collapsed text-white"
            >
              <FaBookOpen /> Manage Courses
            </button>
            <hr style={{ color: 'white' }} />

            {openMenu === 'courses' && (
              <div>
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small text-center">
                  <li>
                    <a
                      href="/CourseList"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Courses
                    </a>
                    <hr
                      style={{
                        color: 'white',
                        textAlign: 'end',
                        maxWidth: '65%',
                        margin: '0 auto',
                      }}
                    />
                  </li>

                  <li>
                    <a
                      href="/SubjectList"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Subjects
                    </a>
                   
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}
        {user?.role === 'admin' && (
          <li>
            <button
              onClick={() => toggleMenu('fees')}
              className="nav-link btn btn-toggle align-items-center rounded collapsed text-white"
            >
              <FaRupeeSign />
              Manage Fees
            </button>
            <hr style={{ color: 'white' }} />

            {openMenu === 'fees' && (
              <div>
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small text-center justify-content-start">
                  <li>
                    <a
                      href="/FeesStructure"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Fees Structure
                    </a>
                    <hr
                      style={{
                        color: 'white',
                        textAlign: 'end',
                        maxWidth: '65%',
                        margin: '0 auto',
                      }}
                    />
                  </li>
                  <li>
                    <a
                      href="/ApplyFees"
                      className="link-white text-white nav-link ps-4"
                    >
                    <MdSend /> Apply Fees
                    </a>
                    <hr
                      style={{
                        color: 'white',
                        textAlign: 'end',
                        maxWidth: '65%',
                        margin: '0 auto',
                      }}
                    />
                  </li>
                  <li>
                    <a
                      href="/StudentFees"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Student Fees
                    </a>                 
                  </li>
                  <li>
                  <hr
                      style={{
                        color: 'white',
                        textAlign: 'end',
                        maxWidth: '65%',
                        margin: '0 auto',
                      }}
                    />
                  </li>
                  <li>
                    <a
                      href="/FeesCollection"
                      className="link-white text-white nav-link ps-4"
                    >
                      <MdSend /> Fees Collection
                    </a>  
                     <hr
                      style={{
                        color: 'white',
                        textAlign: 'end',
                        maxWidth: '65%',
                        margin: '0 auto',
                      }}
                    />  
                  </li>
                
                  <li>
                    <a href='/Take Fees' className='link-white text-white nav-link ps-4'>
                      <MdSend/> Take Fees
                    </a>'
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}
        <li className="nav-item ">
          <a
            href="/UserProfile"
            className="nav-link text-white"
            aria-current="page"
          >
            <FaCog /> Setting
          </a>
          <hr style={{ color: 'white' }} />
        </li>
        <li className="nav-item">
          <Login />
        </li>
      </ul>
    </div>
  )
}
