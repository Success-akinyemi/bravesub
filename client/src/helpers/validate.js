import { toast } from "react-hot-toast"
import { authenticate } from './helper'

/**Validate Login page Email */
export async function emailValidate(values){
    const errors = emailVerify({}, values);
    if(values.email){
        // check user exist or not
        const { status } = await authenticate(values.email);

        if(status !== 200){
            errors.exist = toast.error('User does not exist')
        }
    }

    return errors
}

/**Validat Login page Password */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);

    return errors
}

/**Validate reset password */
export async function resetPasswordValidation(values){
    const errors = (passwordVerify({}, values))

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error('Password do not match...!')
    }

    return errors
}

/**Validate Register form */
export async function registrationValidation(values){
    const errors = usernameVerify({}, values)
    passwordVerify(errors, values);
    emailVerify(errors, values);

    return errors
}

/**Validate Profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values);

    return errors
}

/**Payment validation */
export async function paymentVerify(values){
    const errors = emailVerify({}, values)
    amountVerify(errors, values);

    return errors
}

/** ************************************************ */

/**Validate password */
function passwordVerify(errors = {}, values){

    const specialChars = /[`~!@#$%^&*()-_+{}[\]\\|,.//?;':"]/g
    
    /*       
    
    /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/   
    */

    if(!values.password){
        errors.password = toast.error('Password required...!');
    }else if(values.password.includes(" ")){
        errors.password = toast.error('Password is Invalid') 
    }else if(values.password.length < 4){
        errors.password = toast.error('Password must be more than 4 characters long')
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error('Password must contain at least one special Character')
    }

    return errors
}

/**Validate user email */
function emailVerify(error = {}, values){
    if(!values.email){
        error.email = toast.error('Email Required...!')
    }else if(values.email.includes(" ")){
        error.email = toast.error('Invalid email...!')
    }

    return error;
}


/**Username verify */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!')
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username...!')
    }

    return error;
}

/**amount verify */
function amountVerify(error = {}, values){
    const num = (/^[0-9]+$/)

    if(!values.amount){
        error.amount = toast.error('Amount Required...!')
    }else if(!num.test(values.amount)){
        error.amount = toast.error('Amount Must Only contain Numbers')
    }

    return error;
}