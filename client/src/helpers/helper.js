import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

//axios.defaults.baseURL = 'http://localhost:9000'
//axios.defaults.baseURL = 'https://bravesub-api.onrender.com'
axios.defaults.baseURL= 'https://rich-gold-trout-sock.cyclic.cloud'


/**Make API Request */

/**Get user name from token */
export async function getEmail(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token")
    let decode = jwt_decode(token)

    return decode
}

/**Authenticate function */
export async function authenticate(email){
    try {
        return await axios.post('/api/authenticate', {email} )
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/**Get user details */
export async function getUser({ email }){
    try {
        const {data} = await axios.get(`/api/user/${email}`)
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match"}
    }
}


/**Register User function */
export async function registerUser(credentials){
    try {
        const {data:{ msg }, status }= await axios.post(`api/register`, credentials)
        
        let {username, email} = credentials;

        /**Send email */
        if(status === 201){
            await axios.post('/api/registerMail', {username, userEmail : email, text: msg})
        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

/**Login function */
export async function verifyPassword({ email, password }){
    try {
        if(email){
            const {data} =  await axios.post('/api/login', {email, password})
            return Promise.resolve({ data })
        }
    } catch (error) {
        return Promise.reject({ error: 'Password do not match'})
    }
}

/**Update user function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, {headers: { "Authorization" : `Bearer ${token}`}})

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error: "Couldn't update Profile"})
    }
}

/**Generate OTP */
export async function generateOTP(email){
    try {
        const {data: { code }, status} =  await axios.get('/api/generateOTP', { params: { email }})
        if(status === 201){
           let{ data : { username }} = await getUser({ email })
           let text = `Your Password Recovey OTP is ${code}. Verify and recover yur password`
           await axios.post('/api/registerMail', { username, userEmail: email, text, subject: 'Password Recovery OTP'})
        }
        return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({ error});
    }
}

/** Verify OTP*/
export async function verifyOTP({ email, code}){
    try {
        const {data, status} = await axios.get('/api/verifyOTP', { params : {email, code}})
        return {data, status}
    } catch (error) {
        return Promise.reject(error)
    }
}

/**Reset password */
export async function resetPassword({ email, password }){
    try {
        const {data, status}  = await axios.put('/api/resetPassword', { email, password })
        return Promise.resolve({data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}

/**Pay with Paystack */
export async function paysavings({email, amount}){
    console.log('before send>>', email, amount)
    try {
        
        const token = await localStorage.getItem('token');
        const response = await axios.post('/api/pay', { amount, email }, {headers: { "Authorization" : `Bearer ${token}`}})
        
        console.log(response.data);

        const authorizationUrl = response.data.authorizationUrl; //paystack
        console.log('url', authorizationUrl)
        window.location.href = authorizationUrl; // Redirect the user to the Paystack checkout page
        
        return Promise.resolve({ authorizationUrl })
    } catch (error) {
        return Promise.reject({ error: "Couldn't make Payments"})
    }
}

export async function buyAirtime({networkCode,amount,userPhoneNumber,email}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/handleAirtime', {networkCode,amount,userPhoneNumber,email}, {headers: {Authorization: `Bearer ${token}`}})
        
        console.log(response.data)
        console.log(response.data.data);


        if (response.data.statuscode === '100') {
          toast.success('Credited successfully!');
    
          // Redirect to the home page after showing the toast
          window.location.href = '/dashboard';
        }
    } catch (error) {
        console.log(error)
    }
}

export async function buyData({networkCode,amount,userPhoneNumber,email,buyType,dataPlanCode,cp}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/handleData', {networkCode,amount,userPhoneNumber,email,buyType,dataPlanCode,cp}, {headers: {Authorization: `Bearer ${token}`}})
        
        console.log('1>>',response.data)
        console.log('2>>' ,response.data.data);


        if (response.data.statuscode === '100') {
          toast.success('Credited successfully!');
    
          // Redirect to the home page after showing the toast
          window.location.href = '/dashboard';
        }

        if (response.data.Status === 'successful') {
            toast.success('Credited successfully!');
      
            // Redirect to the home page after showing the toast
            window.location.href = '/dashboard';
          }
    } catch (error) {
        console.log(error)
    }
}

export async function buyCableTvSubscription({userPhoneNumber,smartCardNumber,email,selectedCableTvCode,amount,cableTv}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/cableTvSubscription', {userPhoneNumber,smartCardNumber,email,selectedCableTvCode,amount,cableTv}, {headers: {Authorization: `Bearer ${token}`}})
        
        console.log(response.data)
        console.log(response.data.data);


        if (response.data.statuscode === '100') {
          toast.success('Credited successfully!');
    
          // Redirect to the home page after showing the toast
          window.location.href = '/dashboard';
        }
    } catch (error) {
        console.log(error)
    }
}

export async function verifyCableTvSmartCard({smartCardNumber,cableTv}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/verifyCableTvSmartCard', {smartCardNumber,cableTv}, {headers: {Authorization: `Bearer ${token}`}})
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function buyElectricBill({email, userMeterNumber, userMeterType, electricCompany, userPhoneNumber,amount}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/buyElectricBill', {email, userMeterNumber, userMeterType, electricCompany, userPhoneNumber,amount}, {headers: {Authorization: `Bearer ${token}`}})
        
        console.log(response.data)
        console.log(response.data.data)

        if (response.data.statuscode === '100') {
            toast.success('Credited successfully!');
      
            // Redirect to the home page after showing the toast
            window.location.href = '/dashboard';
          }
        
    }
    catch(error){
        console.log(error)
    }
}

export async function verifymeterNumber({electricCompany,userMeterNumber}){
    try {
        const token = await localStorage.getItem('token')
        const response = await axios.post('/api/verifyElectricMeterNumber', {electricCompany,userMeterNumber}, {headers: {Authorization: `Bearer ${token}`}})
        return response.data;
    } catch (error) {
        console.log(error)
    }
}