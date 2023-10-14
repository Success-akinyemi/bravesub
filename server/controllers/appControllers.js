import UserModel from "../model/User.js"
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import bcrypt from 'bcrypt'
import { format } from 'date-fns'
import axios from 'axios'
import paystack from 'paystack';
import Flutterwave from 'flutterwave-node-v3';
import { config } from 'dotenv';
import transaction from "paystack/resources/transaction.js"
import TransactionModel from "../model/Transaction.js"
import ProfitModel from "../model/Profit.js"
config();

const paystackInstance = paystack(process.env.PAYSTACK_SK);
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

/**Middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        const { email } = req.method == "GET" ? req.query : req.body;
        
        let exist = await UserModel.findOne({ email });
        if(!exist) return res.status(404).send({ error: "Can't Find User"})
        next();

        //check the
    } catch (error) {
        return res.status(404).send({ error: 'Authenticaton Error'})
    }
}

/**POST http://localhost:9000/api/register 
 * @param: {
 * "username": "success123",
 * "password": "admin@123",
 * "email": "success123@gmail.com",
 * "firstName": "success",
 * "lastName": "akin",
 * "mobile": "09012345678",
 * "address": "Apt. 101 Kula Street",
 * "profile": ""
 * } 
*/
export async function register(req, res){
    try {
        const {username, email, password, profile} =req.body;
        console.log(req.body);
        const user = await UserModel.create({username, email, password, profile});
        res.status(201).json(user)//.send({ msg: "User Register Successfully"});
        console.log('User Registered successfully')
    } catch (e) {
        let msg;
        if(e.code == 11000){
            msg = 'User already exist'
        }else{
            msg = e.message;
        }
        console.log(e)
         res.status(400).json(msg)
    }
}

/**POST http://localhost:9000/api/login 
 * @param" {
 * "email": "success123@gmail.com",
 * "password": "admin@123"
 * }
*/
export async function login(req, res){
    try {
        const {email, password} = req.body
        const user = await UserModel.findByCredentials(email, password);
        await user.save()
        const token = jwt.sign(
            {   id: user._id,
                email: user.email    
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        )
        res.status(200).send({
            msg: "Login successful",
            email: user.email,
            token
        })
        console.log('User Logged in')
    } catch (e) {
        res.status(400).json(e.message)
    }
}

/**GET: http://localhost:9000/api/user/success123@gmail.com */
export async function getUser(req, res){
        const { email } = req.params;
      
        try {
          const user = await UserModel.findOne({ email: email });
          if (!user) {
            return res.status(404).send({ error: "Cannot find user data" });
          }
          return res.status(200).json(user);
        } catch (error) {
          return res.status(500).send({ error: "Internal server error" });
        }
}

/**PUt: http://localhost:9000/api/updateUser
 * @param: {
 *  "header": "<token>"
 * }
 * body{
 *  firstName: "",
 *  address: "",
 *  profile: ""
 * }
 */
export async function updateUser(req, res){
    try {
        const body = req.body
        /**
         * const id = req.query.id
         * 
        */
        const { id } = req.user
        console.log('User ID>>>', id)
        console.log('User update>>>', body)
        const updatedUser = await UserModel.findByIdAndUpdate({_id: id}, body, {new: true});
        res.status(201).send(updatedUser)
        console.log('user updated')
    } catch (err) {
        res.status(500).json(err)
    }
}

/**GET: http://localhost:9000/api/generateOTP */
export async function generateOTP(req, res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP})
}

/**GET:  http://localhost:9000/api/verifyOTP */
export async function verifyOTP(req, res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; //reset the OTP value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(201).send({ msg: "Verify Successfully!"})
    }
    return res.status(400).send({ error: "INVALID OTP"})
}

// successfully redirect user when OTP is valid
/**GET: http://localhost:9000/api/createResetSession */
export async function createResetSession(req, res){
    if(req.app.locals.resetSession){
        //req.app.locals.resetSession = false // allow access to this route only once
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired! "})
}

//update the password when we have a vaild session
/**PUT: http://localhost:9000/api/resetPassword */
export async function resetPassword(req, res){
    try {        

        if(!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired! "})
        
        const { email, password } = req.body

        try {
            await UserModel
                .findOneAndUpdate({email: email}, {password: password})
                .then((newPassword) => {
                    req.app.locals.resetSession = false
                    res.status(200).send({ msg: "User Updated Successfully"})
                    console.log('HASHED>>', newPassword.password)
                })

        } catch (error) {
            return res.status(500).send({ error })
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
}

  export async function fundAcct(req, res) {
    try {
      const { email, amount } = req.body;
      const fullAmount = amount * 100;
  
      const response = await axios.post(
        `${process.env.PAYSTACK_INITIALIZE_URL}`,
        {
          email,
          amount: fullAmount,
          callback_url: `${process.env.CALLBACK_URL}`
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SK}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log(response.data);
      const { authorization_url, reference } = response.data.data;
      //res.redirect(response.data.data.authorization_url); // Redirect user to their dashboard
      console.log('refrence',reference)
      
      res.send({ authorizationUrl: authorization_url });
  
  
      // Verify the transaction with Paystack using the reference
      const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
      const verifyResponse = await axios.get(verifyUrl, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SK}`,
          'Content-Type': 'application/json'
        }
      });
  
      const { status, data } = verifyResponse.data;
      if (status === true && data.status === 'success') {
        const user = await UserModel.findOne({ email: email });
        console.log('transaction verified')
        if (user) {
          const value = data.amount / 100; // Convert from kobo to naira
          user.acctBalance += value;
          await user.save();
          console.log('account funded')
        }
      }else{
        console.log('Transaction Not Verified')
      }
  
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Unable to initialize transaction' });
    }
  }

  //not in use
export async function verifyPaymentCallback(req, res) {
    console.log(req)
    const { reference } = req.query.reference;
    console.log('refrence body', req.query.reference)
    console.log('refrence', reference)
    console.log('trx', reference)
    
    try {

      const verifyUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
      console.log('urlll>>', verifyUrl);
  
      const options = {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      };
  
      const response = await axios.get(verifyUrl, options);
  
      const verificationData = response.data;
      const { status, amount } = verificationData.data;
  
      if (status === 'success') {
        const user = await UserModel.findOne({ email: req.query.email });
        if (user) {
          const value = amount / 100; // Convert from kobo to naira
          user.acctBalance += value;
          await user.save();
        }
      }
  
      console.log(verificationData);
      res.send(verificationData);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }


  export async function paystackWebhook(req, res) {
    const { event, data } = req.body;
  
    // Handle different webhook events
    if (event === 'charge.success') {
      const metadata = data;
      const email = data.customer.email
      const amount = data.amount;
      const refrence = data.reference || ''
      const response = data.gateway_response || ''
      const channel = data.channel || ''
      const time = data.paid_at
      const paidAt = format(new Date(time), 'yyyy-MM-dd hh:mm:ss a') || ''
      const bank = data.authorization.sender_bank || ''
      const card = data.authorization.card_type || ''
      const account = data.authorization.sender_bank_account_number || ''
      const name = data.authorization.sender_name || ''
      const narration = data.authorization.narration || ''
      console.log('Amount>>',amount, '>>EMAIL>>',email)
      console.log('Meta data>>',metadata)
      
      const user = await UserModel.findOne({ email });
      console.log('user email>>', user)
  
      if (user) {
        const value = amount / 100; // Convert from kobo to naira
        user.acctBalance += value;
        await user.save();
        console.log('Account funded for user:', email);
        const transactionRef = refrence || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Account Funding',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(value),
          transcationDesc: `You have Successfuly Funded your account with ${value} Naira. STATUS: ${response}, VIA: ${channel}. TIME: ${paidAt}. BANK NAME: ${bank}. CARD_TYPE: ${card}. SENDER ACCOUNT: ${account}, SENDER NAME: ${name}. NARRATION ON ACCOUNT: ${narration}`,
          transcationStatus: 'Successful'
        };
        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)
      } else {
        console.log('User not found');
      }
  
      console.log('Successful transaction:');
    } else if (event === 'charge.failed') {
      console.log('Transaction Failure');
    }
  
    // Send a response to acknowledge the webhook event
    res.status(200).end();
  }
  

  export async function handleAirtime(req, res) {
    try {
      const { networkCode, amount, userPhoneNumber, email } = req.body;
      let networkType;
      if (networkCode === '01'){
       networkType = 'MTN'
      }
      if (networkCode === '02'){
       networkType = 'GLO'
      }
      if (networkCode === '04'){
       networkType = 'Airtel'
      }
      if (networkCode === '03'){
       networkType = '9Mobile'
      }

      const user = await UserModel.findOne({ email });



      if (user) {

        if(parseFloat(amount) > user.acctBalance){
          return res.status(400).json({error: 'INSUFFIENT FUNDS'})
        }
        
        const airtimeResponse = await axios.post(`
          ${process.env.CK_URL}/APIAirtimeV1.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&MobileNetwork=${networkCode}&Amount=${amount}&MobileNumber=${userPhoneNumber}&CallBackURL=${process.env.CALLBACK_URL}
        `);
  
        const transactionRef = airtimeResponse.data.orderid || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Airtime',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };
  

        if (airtimeResponse.data.statuscode === '100') {
          user.acctBalance -= amount;
          await user.save();
          console.log('User account debited successfully.');
          
          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);

          if(networkCode === '01'){
            const AMOUNT = parseFloat(amount)
            const CP = (3 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          if(networkCode === '02'){
            const AMOUNT = parseFloat(amount)
            const CP = (7.5 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          if(networkCode === '03'){
            const AMOUNT = parseFloat(amount)
            const CP = (6 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          if(networkCode === '04'){
            const AMOUNT = parseFloat(amount)
            const CP = (3 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          
          transactionData.transcationDesc = `You have Successfuly buy ${amount} Naira worth of ${networkType} Airtime for ${userPhoneNumber}`; 
          transactionData.transcationStatus='Successful'
        }

        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)
  
  
        res.json(airtimeResponse.data);
      } else {
        console.log('No User Found');
      }
      
    } catch (error) {
      res.status(500);
      console.log(error);
    }
  }
  
export async function handleData(req, res){
  try {
    const {networkCode,amount,userPhoneNumber,email,buyType,dataPlanCode,cp} = req.body
    //console.log('data>.data>',networkCode,amount,userPhoneNumber,email,buyType,dataPlanCode,cp)
      let networkType;
      if (networkCode === '01'){
       networkType = 'MTN'
      }
      if (networkCode === '02'){
       networkType = 'GLO'
      }
      if (networkCode === '04'){
       networkType = 'Airtel'
      }
      if (networkCode === '03'){
       networkType = '9Mobile'
      }
      if (networkCode === 'smile-direct'){
       networkType = 'Smile'
      }

    const user = await UserModel.findOne({ email })

      
    
    if(user){
      if(parseFloat(amount) > user.acctBalance){
        return res.status(400).json({error: 'INSUFFIENT FUNDS'})
      }

      if(buyType === 'CG'){
        const CGdataResponse = await axios.post(`
        ${process.env.CK_URL}/APIDatabundleV1.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&MobileNetwork=${networkCode}&DataPlan=${dataPlanCode}&MobileNumber=${userPhoneNumber}&CallBackURL=${process.env.CALLBACK_URL}
        `)

        console.log(CGdataResponse.data)
        
        const transactionRef = CGdataResponse.data.orderid || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Data',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };
  
        if(CGdataResponse.data.statuscode === '100'){
          user.acctBalance -= amount
          await user.save()
          console.log('User Account Debitted Successfully')

          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);

          const AMOUNT = parseFloat(amount)
          const CP = parseFloat(cp)
          const TT = AMOUNT - CP
          console.log('TTT>>',TT)
          const profitEntry = new ProfitModel({
            amount: TT,
            CP: AMOUNT
          })
          await profitEntry.save()
          console.log(TT)
        
          transactionData.transcationDesc = `You have Successfuly buy ${networkType} Data worth ${amount} for ${userPhoneNumber}`; 
          transactionData.transcationStatus = 'Successful'
        }
        
        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)

        return res.json(CGdataResponse.data)
      }
  
      if(buyType === 'SME'){
        const networkId = networkCode.split('')[1]

        const data = {
          network: networkId,
          mobile_number: userPhoneNumber,
          plan: dataPlanCode,
          Ported_number: true
        };

        console.log(data)

        const config = {
          headers: {
            'Authorization': `Token ${process.env.SUBVTU_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }

        const SMEDataResponse = await axios.post(`${process.env.SUBVTU_URL}`, data, config)
        
        console.log(SMEDataResponse.data)

        const transactionRef = SMEDataResponse.data.id || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Data',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };
  
        if(SMEDataResponse.data.Status === 'successful'){
          user.acctBalance -= amount
          await user.save()
          console.log('User Account Debited Successfully')

          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);
          
          const AMOUNT = parseFloat(amount)
          const CP = parseFloat(cp)
          const TT = AMOUNT - CP
          console.log('TTT>>',TT)
          const profitEntry = new ProfitModel({
            amount: TT,
            CP: AMOUNT
          })
          await profitEntry.save()
          console.log(TT)

          transactionData.transcationDesc = `You have Successfuly buy ${networkType} Data worth ${amount} for ${userPhoneNumber}`; 
          transactionData.transcationStatus = 'Successful'
        }
        
        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)

        console.log(SMEDataResponse.data)
        return res.json(SMEDataResponse.data)
      }

      if(buyType === 'smile'){
        const smileDataResponse = await axios.post(`
        ${process.env.CK_URL}/APISmileV1.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&MobileNetwork=${networkCode}&datatplan=${dataPlanCode}&MobileNumber=${userPhoneNumber}&CallBackURL=${process.env.CALLBACK_URL}
        `)

        console.log(smileDataResponse.data)
        
        const transactionRef = smileDataResponse.data.orderid || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Smile Data',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };
  
        if(smileDataResponse.data.statuscode === '100'){
          user.acctBalance -= amount
          await user.save()
          console.log('User Account Debitted Successfully')
        
          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);
        
          const AMOUNT = parseFloat(amount)
          const CP = parseFloat(cp)
          const TT = AMOUNT - CP
          console.log('TTT>>',TT)
          const profitEntry = new ProfitModel({
            amount: TT,
            CP: AMOUNT
          })
          await profitEntry.save()
          console.log(TT)

          transactionData.transcationDesc = `You have Successfuly buy ${networkType} Data worth ${amount} for ${userPhoneNumber}`; 
          transactionData.transcationStatus = 'Successful'
        }

        const createdTransaction = await TransactionModel.create(transactionData);
        console.log('Transaction>>', createdTransaction)

        return res.json(smileDataResponse.data)
      }

    }
    else{
      console.log('No User Found')
      return res.status(400).json({error: 'USER NOT FOUND'})
    }
    
  } catch (error) {
    console.log(error)
    return res.status(500).json('FAILED>>>',error)
  }
}

export async function handleCableTvSubscription(req, res){
  try {
    const {userPhoneNumber,smartCardNumber,email,selectedCableTvCode,amount,cableTv} = req.body

    const user = await UserModel.findOne({ email })
    //console.log(process.env.CK_USER_ID)
    //console.log(process.env.CK_API_KEY)
    if(user){

      if(parseFloat(amount) > user.acctBalance){
        return res.status(400).json({error: 'INSUFFIENT FUNDS'})
      }

      const cableTvResponse = await axios.post(`
      ${process.env.CK_URL}/APICableTVV1.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&CableTV=${cableTv}&Package=${selectedCableTvCode}&SmartCardNo=${smartCardNumber}&PhoneNo=${userPhoneNumber}&CallBackURL=${process.env.CALLBACK_URL}
      `)

    
     console.log(cableTvResponse.data)

      const transactionRef = cableTvResponse.data.orderid || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: `${cableTv} subscription`,
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };
  
      if (cableTvResponse.data.statuscode === '100') {
        user.acctBalance -= amount;
        await user.save();
        console.log('User account debited successfully.');
      
          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);

          if(cableTv === 'dstv'){
            const AMOUNT = parseFloat(amount)
            const CP = (0.8 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          if(cableTv === 'gotv'){
            const AMOUNT = parseFloat(amount)
            const CP = (0.8 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }

          if(cableTv === 'startimes'){
            const AMOUNT = parseFloat(amount)
            const CP = (1.5 * amount) / 100
            const TT = AMOUNT - CP
            const PP = AMOUNT - TT
            console.log('PPP>>',PP)
            const profitEntry = new ProfitModel({
              amount: PP,
              CP: AMOUNT
            })
            await profitEntry.save()
            console.log(PP)
          }
      
          transactionData.transcationDesc = `You have Successfuly Subscribe for ${cableTv} Subscription worth ${amount}. SmartCard number: ${smartCardNumber} phone Number: ${userPhoneNumber}`; 
          transactionData.transcationStatus = 'Successful'
        }

      const createdTransaction = await TransactionModel.create(transactionData);
      console.log('Transaction>>', createdTransaction)

    }
    else{
      console.log('No User Found')
      return res.status(400).json({error: 'USER NOT FOUND'})
    }

    res.json(cableTvResponse.data)
  } catch (error) {
    res.status(500)
    console.log(error)
  }
}

export async function verifyCableTvSmartCard(req, res){
  try {
    const {smartCardNumber,cableTv} = req.body
    let cardNumber;
    if (cableTv === 'dstv'){
       cardNumber = '01'
    }
    if (cableTv === 'gotv'){
       cardNumber = '02'
    }
    if (cableTv === 'startimes'){
       cardNumber = '03'
    }
    console.log(cardNumber)
    console.log(smartCardNumber)
    const verifySmartCardResponse = await axios.post(`
    ${process.env.CK_URL}/APIVerifyCableTVV1.0.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&cabletv=${cardNumber}&smartcardno=${smartCardNumber}
    `)

    console.log(verifySmartCardResponse.data)
    res.json(verifySmartCardResponse.data)
  } catch (error) {
    res.status(500)
    console.log(error)
  }
}

export async function buyElectricBill(req, res){
  try {
    const {email, userMeterNumber, userMeterType, electricCompany, userPhoneNumber,amount} = req.body
    
    const user = await UserModel.findOne({ email })

    if(user){

      if(parseFloat(amount) > user.acctBalance){
        return res.status(400).json({error: 'INSUFFIENT FUNDS'})
      }
      
      const buyElectricResponse = await axios.post(`
      ${process.env.CK_URL}/APIElectricityV1.aspUserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&ElectricCompany=${electricCompany}&MeterType=${userMeterType}&MeterNo=${userMeterNumber}&Amount=${amount}&PhoneNo=${userPhoneNumber}&CallBackURL=${process.CALLBACK_URL}
      `)

        const transactionRef = buyElectricResponse.data.orderid || 'no transaction refrence'; // Use a default value if orderid is not present
  
        // Saving the transaction
        const transactionData = {
          userId: user._id,
          transcationType: 'Electricity',
          transactionId: transactionRef,
          email: user.email,
          amount: parseFloat(amount),
          transcationDesc: '',
          transcationStatus: 'Pending'
        };

      if(buyElectricResponse.data.statuscode === '100'){
        user.acctBalance -= amount
        await user.save()
        console.log('User account debited successfully.');
        
          const parsedAmount = parseFloat(amount);
          user.transactionTotal += parsedAmount;
          await user.save();
          console.log('User Transaction Total Updated successfully');
          console.log('NEW TOTAL>> ', user.transactionTotal);

          const AMOUNT = parseFloat(amount)
          const CP = (0.4 * amount) / 100
          const TT = AMOUNT - CP
          const PP = AMOUNT - TT
          console.log('PPP>>',PP)
          const profitEntry = new ProfitModel({
            amount: PP,
            CP: AMOUNT
          })
          await profitEntry.save()
          console.log(PP)
          
          transactionData.transcationDesc = `You have Successfuly buy ${amount} worth of Electricity unit for Meter Number: ${userMeterNumber} phone Number: ${userPhoneNumber}. YOUR TOKEN IS: ${buyElectricResponse.data.metertoken}`; 
          transactionData.transcationStatus = 'Successful'
        }
      const createdTransaction = await TransactionModel.create(transactionData);
      console.log('Transaction>>', createdTransaction)


    }else{
      console.log('No User Found')
    }

    console.log(buyElectricResponse.data)
    res.json(buyElectricResponse.data)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

export async function verifyElectricMeterNumber(req, res){
  try {
    const {electricCompany,userMeterNumber} = req.body
    const verifyElectricMeterNumberResponse = await axios.post(`
    ${process.env.CK_URL}/APIVerifyElectricityV1.asp?UserID=${process.env.CK_USER_ID}&APIKey=${process.env.CK_API_KEY}&ElectricCompany=${electricCompany}&meterno=${userMeterNumber}
    `)

    console.log(verifyElectricMeterNumberResponse.data)
    res.json(verifyElectricMeterNumberResponse.data)
  } catch (error) {
    res.status(500)
    console.log(error)
  }
}

export async function getAllTransactionOfAUser(req, res){
  const { email } = req.params;
  try {
    const userEmail = email
    console.log('TRANSACTION EMAIL>>>',email)
    const userTransactions = await TransactionModel.find({ email: userEmail });
    
    
    res.json(userTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }

}

//Get details of a user specific transaction
export async function getSpecificTransactionOfAUser(req, res){
  const { id } = req.params
  try {
    const transactionId = id
    console.log(transactionId)
    const transactionDetails = await TransactionModel.findById(transactionId)

    res.status(200).json(transactionDetails)
  } catch (error) {
    console.log(error)
  }
}

export async function getLastMonthRevenue(req, res){
  try {
    const last24HoursRevenue = await ProfitModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCP: { $sum: '$CP' },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalCP: 1,
        },
      },
    ]);
    console.log(last24HoursRevenue)
    res.json(last24HoursRevenue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLastSevenDaysRevenue(req, res){
  try {
    const last24HoursRevenue = await ProfitModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCP: { $sum: '$CP' },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalCP: 1,
        },
      },
    ]);
    console.log(last24HoursRevenue)
    res.json(last24HoursRevenue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLast24HrsRevenue(req, res){
  try {
    const last24HoursRevenue = await ProfitModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCP: { $sum: '$CP' },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalCP: 1,
        },
      },
    ]);
    console.log(last24HoursRevenue)
    res.json(last24HoursRevenue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
