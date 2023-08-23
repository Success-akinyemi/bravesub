import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { emailValidate } from '../../helpers/validate'
import { useAuthStore } from '../../store/store'

function Login() {
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
    const navigate = useNavigate()
    const setEmail = useAuthStore(state => state.setEmail)

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validate: emailValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
                setEmail(values.email)
                navigate('/password')
        }
    })

  return (
    <div className='Logincontainer'>
        <div className="box">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className='form'>
            <h2>Sign in</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="inputBox">
                    <input {...formik.getFieldProps('email')} type='email' className='username' />
                    <span>Email Address:</span>
                </div>
                <button type='submit'>{isLoadingAnimation ? 'Please Wait' : 'Continue'}</button>
            </form>
            <div class="signUpLink">
                <p>Don't have an account <span><Link to='/signup' className='link'>Signup Here</Link></span></p>
            </div>
            
        </div>
        </div>

    </div>
  )
}

export default Login