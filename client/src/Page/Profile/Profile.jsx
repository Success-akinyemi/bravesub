import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import './Profile.css'
import Avatar from '@mui/material/Avatar'
import convertToBase64 from '../../helpers/convert'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../../helpers/validate'
import { useFetch } from '../../hooks/fetch.hook'
import { updateUser } from '../../helpers/helper'
import LoadingAnimationPage from '../../Components/LoadingAnimationPage/LoadingAnimationPage';

function Profile() {
  const navigate = useNavigate()
  const [file, setFile] = useState();


  const { apiData, isLoading, serverError } = useFetch()
  console.log('api dataaa',apiData)

  const formik = useFormik({
    initialValues:{
      firstName: apiData?.firstName || '',
      lastName:  apiData?.lastName || '',
      username:  apiData?.username || '',
      email: apiData?.email || '',
      mobile:  apiData?.mobile || '',
      country:  apiData?.country || '',
      state:  apiData?.state || '',
      city:  apiData?.city || '',
      dob: apiData?.dob || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || ''})
      let updatePromise = updateUser(values)

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successful</b>,
        error: <b>Could not Update</b>
      })
      console.log(values)
    }
  })

  const unUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

//Logout user session
function userLogout(){
  localStorage.removeItem('token')
  navigate('/')
}


  if(isLoading) return <LoadingAnimationPage />
  if(serverError) return <h1>{serverError.message}</h1>

  return (
    <div className='profile'>
      <Link to='/dashboard' className='homelink'>
        <HomeIcon className='home'/>
      </Link>

      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='profile_container'>
            <h3>View And Update Profile <span>Username</span></h3>
            <form onSubmit={formik.handleSubmit}>
              <div className='profile_img'>
                <label htmlFor='image-upload'>
                    <img src={apiData?.profile || file || <Avatar />} alt='profile' />
                </label>
                <input onChange={unUpload} type='file' hidden id='image-upload' accept='image/jpeg image/png'/>
              </div>
              <div>
                <div className='div1'>
                  <label>Firstname:</label>
                  <input {...formik.getFieldProps('firstName')} type='text' placeholder='Firstname'/>
                </div>

                <div className='div1'>
                  <label>Lastname:</label>
                  <input {...formik.getFieldProps('lastName')} type='text' placeholder='Lastname'/>
                </div>
              </div>

              <div>
                <div className='div1'>
                  <label>Mobile Number:</label>
                  <input {...formik.getFieldProps('mobile')} type='number' placeholder='Mobile Number'/>
                </div>

                <div className='div1'>
                  <label>Email Address:</label>
                  <input {...formik.getFieldProps('email')} type='email' placeholder='Email'/>
                </div>
              </div>

              <div>
                <div className='div1'>
                  <label>Country:</label>
                  <input {...formik.getFieldProps('country')} type='text' placeholder='Country'/>
                </div>

                <div className='div1'>
                  <label>State:</label>
                  <input {...formik.getFieldProps('state')} type='text' placeholder='State'/>
                </div>
              </div>

              <div>
                <div className='div1'>
                  <label>City:</label>
                  <input {...formik.getFieldProps('city')} type='text' placeholder='City'/>
                </div>

                <div className='div1'>
                  <label>Date of Birth:</label>
                  <input {...formik.getFieldProps('dob')} type='date' placeholder='Date of birth'/>
                </div>
              </div>

                <button type='submit'>Update</button>
            </form>

            <p>Come back later <button onClick={userLogout}>Logout</button></p>
        </div>
    </div>
  )
}

export default Profile