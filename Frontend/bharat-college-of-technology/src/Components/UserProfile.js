import { useRef, useState } from 'react'
import { useAuth } from '../CommonComponents/AuthContext'
import { useEffect } from 'react'
import ApiEndpoints from '../CommonComponents/ApiEndpoints'
import { CSSTransition } from 'react-transition-group'
import EditProfile from './EditProfile'
import React from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { FaEdit, FaLock } from 'react-icons/fa'
import ButtonWithLoader from '../CommonComponents/ButtonWithLoader'

const UserProfile = () => {
  const { user } = useAuth()
  const { student_id } = useParams()
  console.log('student_id', student_id)

  const [profileData, setProfileData] = useState('')
  const [editProfileVisible, setEditProfileVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showPreviewImage, setShowPreviewImage] = useState(false)
  const fileInputRef = useRef(null)

  const fetchProfileData = async (updatedData = null) => {
    try {
      if (updatedData) {
        setProfileData((prev) => ({ ...prev, ...updatedData }))
      } else {
        // let response variable needs to be assigned different values based on the role
        let response
        if (student_id && user?.role === 'admin') {
          response = await ApiEndpoints.getStudentProfileDataById(student_id)
          console.log('Response of selected student:', response.data.profile)
        } else {
          response = await ApiEndpoints.getProfileById()
        }
        const profile = Array.isArray(response.data.profile)
          ? response.data.profile[0]
          : response.data.profile
        console.log('response.data.profile', response.data.profile)
        setProfileData({
          ...profile,
          image: profile.image
            ? profile.image
            : 'https://via.placeholder.com/150',
          role: response.data.profile?.role,
        })
        return profile
      }
    } catch (error) {
      console.error(error.response?.data.message)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [student_id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file) + `#${new Date().getTime()}`)
      setSelectedImage(file)
      setShowPreviewImage(true)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }
  }

  const handleUpdateImagePreview = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // The file is sent to backend as multipart/form-data
      // Image field name must match: upload.single('image')

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('role', profileData.role)
      console.log('Image during upload', formData)

      let res
      if (user.role === 'admin' && student_id) {
        res = await ApiEndpoints.editStudentDataByAdmin(student_id, formData)
        console.log('Admin updates student:', res.data.profile)
      } else {
        res = await ApiEndpoints.editProfileByUser(formData)
        console.log('User updates itself:', res.data.profile)
      }

      // const res = await ApiEndpoints.editProfileByUser(formData)
      toast.success(res.data.message)
      fetchProfileData()

      setProfileData((prev) => ({
        ...prev,
        image: `${res.data.profile.image}?t=${new Date().getTime()}`,
      }))
      setSelectedImage(null)
      setPreviewImage(null)
      await new Promise((res) => setTimeout(res, 1000))

      setShowPreviewImage(false)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  // Purpose: A reusable function to return a field <div> only if the value is truthy (i.e., not null, undefined, or false).
  // label: The title to display (e.g., "Roll Number")
  // value: The actual data value to show (e.g., "12345")
  // key: A unique string to assign to the React key prop (helps with efficient rendering)
  const renderField = (label, value, key) => {
    if (!value) return null

    // Date Formatting Logic:
    // If the value is a Date object, it's converted to DD Month YYYY format (en-IN locale).
    // Otherwise, the raw value is shown.
    const displayValue =
      value instanceof Date
        ? value.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : value

    return (
      <div className="col-md-6 text-start" key={key}>
        <p>
          <strong> {label}: </strong> {displayValue}
        </p>
      </div>
    )
  }
  const renderedImageSrc =
    previewImage || profileData?.image || 'https://via.placeholder.com/150'

  console.log('Rendering Image:', renderedImageSrc)

  return (
    <>
      <div className="container mt-4 " style={{ letterSpacing: '2px' }}>
        <div className="row ">
          <div className="col-md-7 ">
            <div className="card profile-card text-center p-4 bg-dark text-white ">
              {loading ? (
                <div className="text-center p-5">Loading....</div>
              ) : (
                <div className="card-body" style={{ marginTop: '1rem' }}>
                  <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                    <img
                      src={renderedImageSrc}
                      alt="User"
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                      }}
                      title="Upload Image"
                    />
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />

                  <h4 className="mt-3 fw-bold" style={{ color: 'yellow' }}>
                    {(profileData?.role === 'admin' ||
                      user?.role === 'student') &&
                      user?.name &&
                      user?.name?.charAt(0).toUpperCase() +
                        user?.name?.slice(1).toLowerCase()}
                    {user?.role === 'admin' &&
                      student_id &&
                      profileData?.name &&
                      profileData?.name?.charAt(0).toUpperCase() +
                        profileData?.name?.slice(1).toLowerCase()}
                  </h4>

                  <p className="fw-semibold text-danger">
                    {(profileData?.role === 'admin' ||
                      user?.role === 'student') &&
                      user?.role &&
                      user?.role?.charAt(0).toUpperCase() +
                        user?.role?.slice(1).toLowerCase()}
                    {user?.role === 'admin' &&
                      student_id &&
                      profileData?.name &&
                      profileData?.role?.charAt(0).toUpperCase() +
                        profileData?.role?.slice(1).toLowerCase()}
                  </p>
                  <div className="row mt-4">
                    {[
                      renderField(
                        'Roll Number',
                        profileData?.roll_no,
                        'roll_no',
                      ),
                      renderField('Email', profileData?.email, 'email'),
                      renderField('Gender', profileData?.gender, 'gender'),
                      renderField(
                        'Date of birth',
                        profileData?.dob ? new Date(profileData?.dob) : '',
                        'dob',
                      ),
                      renderField(
                        'Admission Date',
                        profileData?.admission_date
                          ? new Date(profileData.admission_date)
                          : '',
                        'admission_date',
                      ),

                      renderField('Mobile', profileData?.mobile, 'mobile'),
                      renderField(
                        'Alternate Number',
                        profileData?.alternate_number,
                        'alternate_number',
                      ),
                      renderField(
                        'Father Name',
                        profileData?.father_name,
                        'father_name',
                      ),
                      renderField(
                        'Mother Name',
                        profileData?.mother_name,
                        'mother_name',
                      ),
                      renderField(
                        'Course Name',
                        profileData?.course?.name,
                        'name',
                      ),

                      renderField(
                        'Duration',
                        profileData?.course?.duration,
                        'duration',
                      ),
                      renderField('Address', profileData?.address, 'address'),
                    ]}
                  </div>
                  <div className="mt-4 d-flex justify-content-between">
                    {(user?.role === 'admin' ||
                      (user?.role === 'student' &&
                        user?.email === profileData?.email)) && (
                      <button
                        className="btn btn-link link-warning text-decoration-none d-flex align-items-center me-auto gap-2"
                        onClick={() =>
                          setEditProfileVisible(!editProfileVisible)
                        }
                      >
                        [ <FaEdit /> Update Profile ]
                      </button>
                    )}
                    <button className="ms-auto btn btn-link link-warning text-decoration-none  ms-auto">
                      [ <FaLock /> Change Password ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedImage && showPreviewImage && (
            <div className="col-md justify-content-between d-flex align-items-center">
              <div className=" mx-auto" style={{ maxWidth: '300px' }}>
                <img
                  src={previewImage}
                  className="card-img-top rounded-top"
                  alt="Selected Preview"
                />

                <div className="card-body text-center bg-dark text-white">
                  <h6 className="card-title">Preview Selected Image</h6>
                  <div className="mt-3 mb-3 d-flex align-items-center justify-content-between mt-2">
                    <button
                      variant="link"
                      className="me-auto btn btn-link link-danger text-decoration-none fw-bold"
                      title="Close"
                      onClick={() => {
                        setShowPreviewImage(false)
                        setPreviewImage(null)
                        setSelectedImage(null)
                      }}
                    >
                      [ X ]
                    </button>
                    {/* <button
                      className="ms-auto btn btn-link link-warning text-decoration-none  ms-auto"
                      onClick={handleUpdateImagePreview}
                    >
                      [ <FaEdit /> Upload Image ]
                    </button> */}
                    <ButtonWithLoader
                      className="ms-auto btn btn-link link-warning text-decoration-none  ms-auto"
                      type="submit"
                      variant="link-warning"
                      onClick={handleUpdateImagePreview}
                      isLoading={isLoading}
                    >
                      <>
                        [ <FaEdit /> Upload Image ]
                      </>
                    </ButtonWithLoader>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          )}
          <div className="col-md-5">
            <CSSTransition
              in={editProfileVisible}
              timeout={500}
              classNames="slide-left-right"
              unmountOnExit
            >
              <EditProfile
                data={profileData}
                hide={() => setEditProfileVisible(false)}
                onProfileUpdate={fetchProfileData}
                isAdminEditStudent={user.role === 'admin' && student_id}
                student_id={student_id}
              />
            </CSSTransition>
          </div>
        </div>

        {/* Extra styling */}
        <style>{`
        .profile-card {
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .profile-img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
          border: 5px solid #fff;
          margin-top: -75px;
        }

        .slide-left-right-enter {
          max-width: 0;
          overflow: hidden;
          transition: max-width 0.5s ease, opacity 0.5s ease;
          opacity: 0;
        }

        .slide-left-right-enter-active {
          max-width: 500px; /* adjust width as needed */
          opacity: 1;
        }

        .slide-left-right-exit {
          max-width: 500px;
          opacity: 1;
          overflow: hidden;
        }

        .slide-left-right-exit-active {
          max-width: 0;
          opacity: 0;
          transition: max-width 0.5s ease, opacity 0.5s ease;
        }

      `}</style>
      </div>
    </>
  )
}
export default UserProfile
