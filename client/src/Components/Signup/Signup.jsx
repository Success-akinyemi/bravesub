import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Signup.css'
import Avatar from '@mui/material/Avatar'
import convertToBase64 from '../../helpers/convert'
import { toast, Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registrationValidation } from '../../helpers/validate'
import { registerUser } from '../../helpers/helper'

function Signup() {
  const navigate = useNavigate();

  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues:{
      username: '',
      email: '',
      password: ''
    },
    validate: registrationValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || ''})
      let registerPromise =  registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully</b>,
        error: <b>Could not register.</b>
      });

      registerPromise.then(function(){navigate('/login')})
    }
  })

  const unUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className='formContainer'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='box'>
          <div className="form">
            <h2>Get Started</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className='image'>
                <label htmlFor='image-upload'>
                    {file ? <img src={file} alt='Profile' className='profilePic'/> :  <Avatar className='avatar'/>}
                </label>
                <input onChange={unUpload} type='file' hidden id='image-upload' accept='image/jpeg image/png'/>
              </div>

                <div className="inputBox">
                  <input {...formik.getFieldProps('username')} type='text' placeholder='Username'/>
                  <span>Username:</span>
                </div>

                <div className="inputBox">
                  <input {...formik.getFieldProps('email')} type='email' placeholder='Email'/>
                  <span>Email Address:</span>
                </div>

                <div className="inputBox">
                  <input {...formik.getFieldProps('password')} type='password' placeholder='Password'/>
                  <span>Password:</span>
                </div>

                <button type='submit'>Signup</button>
            </form>
            <div className="links">
              <p>Already a member? <Link to='/login' className='link'>Login Here</Link></p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Signup