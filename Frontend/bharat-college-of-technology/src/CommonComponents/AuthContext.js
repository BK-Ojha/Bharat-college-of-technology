import { createContext, useEffect, useState } from 'react'
import ApiEndpoints from './ApiEndpoints'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// createContext() is a function provided by React. It allows you to create a context—a way to share values like authentication status, theme, language, etc., across the component tree without having to pass props.
// The following is defined for Authentication-related data (like user, token, role, etc.)
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const fetchUpdatedProfile = async () => {
      if(!token || !storedUser){
        setLoading(false)
        return
      }
      try {
        const res = await ApiEndpoints.getProfileById()
        const updatedData = res.data?.profile
        if (updatedData) {
          const updateUser = {
            ...JSON.parse(storedUser),
            name: updatedData.name || JSON.parse(storedUser).name,
            image: updatedData.image || JSON.parse(storedUser).image,
          }
          localStorage.setItem('user', JSON.stringify(updateUser))
          setUser(updateUser)
        }
      } catch (error) {
        console.error(error.response?.data?.message)
        setUser(JSON.parse(storedUser))
      } finally {
        setLoading(false)
      }
    }
    fetchUpdatedProfile()
  }, [token])

  if (loading) {
    return <div>Loading...</div>
  }

  const signup = async (formData) => {
    try {
      const signupRes = await ApiEndpoints.signUp(formData)
      console.log('SignupResponse:', signupRes)

      const { status, message, data } = signupRes.data

      if (status && data?.token && data?.user) {
        localStorage.setItem('token', data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
        return { status, message }
      } else {
        return { status: false, message: message }
      }
    } catch (error) {
      return {
        status: false,
        message:
          error.response?.data?.message || 'Signup error, please try again',
      }
    }
  }

  const login = async (formData) => {
    try {
      const loginRes = await ApiEndpoints.logIn(formData)
      console.log('LoginResponse:', loginRes.data?.data)
      const { status, message, data } = loginRes.data

      if (status && data?.token && data?.id) {
        // Save token
        localStorage.setItem('token', data.token)
        setToken(data.token)
        const latestProfileRes = await ApiEndpoints.getProfileById()
        const latestProfileData = latestProfileRes.data.profile

        // Save full user info
        const user = {
          id: data.id,
          email: data.email,
          role: data.role,
          name:
            data.role === 'admin'
              ? latestProfileData.admin_name
              : latestProfileData.name,
          image: latestProfileData.image,
        }
        localStorage.setItem('user', JSON.stringify(user))

        console.log('Storage user data:', user)
        setUser(user)

        // Navigate based on role
        if (user.role === 'admin') {
          const studentRes = await ApiEndpoints.getLatestStudent()
          const unSeen = studentRes.data.students.filter(
            (st) => !st.isSeenByAdmin,
          )
          localStorage.setItem('newstudentRegistered', unSeen.length)

          window.dispatchEvent(
            new CustomEvent('notificationCountUpdate', {
              detail: { count: unSeen.length },
            }),
          )
        }
        if (user.role === 'admin') {
          navigate('/Dashboard')
        }
        if (user.role === 'student') {
          navigate('/UserProfile')
        }

        return { status, message }
      } else {
        return { status: false, message: message }
      }
    } catch (error) {
      return {
        status: false,
        message: error?.response?.data?.message,
      }
    }
  }

  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    navigate('/Login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

// To use in components
export const useAuth = () => useContext(AuthContext)
