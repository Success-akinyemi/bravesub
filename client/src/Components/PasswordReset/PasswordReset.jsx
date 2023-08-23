import './PasswordReset.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidation } from '../../helpers/validate'
import { resetPassword } from '../../helpers/helper'
import { useAuthStore } from '../../store/store'
import { useNavigate } from 'react-router-dom'

function PasswordReset() {
    const navigate = useNavigate();
    const { email } = useAuthStore(state => state.auth)


    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_pwd: ''
        },
        validate: resetPasswordValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let resetPromise = resetPassword({ email, password: values.password })

            toast.promise(resetPromise, {
                loading: "Updating...",
                success: <b>Reset Successfully</b>,
                error: <b>Could not Reset</b>
            });
            resetPromise.then(function(){navigate('/password')})
        }
    })


  return (
    <div className='reset_password'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='reset_password_container'>
            <h3>Reset Password</h3>
            <form onSubmit={formik.handleSubmit}>
                <label>Password:</label>
                <input {...formik.getFieldProps('password')} type='password' placeholder='Password'/>

                <label>Comfirm Password:</label>
                <input {...formik.getFieldProps('confirm_pwd')} type='password' placeholder='Comfirm Password'/>
                <button type='submit'>Reset</button>
            </form>
        </div>
    </div>
  )
}

export default PasswordReset