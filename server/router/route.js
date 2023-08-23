import { Router } from 'express'
const router = Router();

/**Importing all controllers */
import * as controller from '../controllers/appControllers.js'
import Auth, { localVariables } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailer.js'

/**POST METHODS */
router.route('/register').post(controller.register)//register user
router.route('/registerMail').post(registerMail);//send email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());//authenticate user
router.route('/login').post(controller.verifyUser, controller.login);//login app

router.route('/pay').post(Auth, controller.fundAcct) // payment for funding account
router.route('/handleAirtime').post(Auth, controller.handleAirtime) //for buying airtime
router.route('/handleData').post(Auth, controller.handleData) //f0r buy data
router.route('/cableTvSubscription').post(Auth, controller.handleCableTvSubscription) // for buying cabel tv subscription
router.route('/cableTvSubscription').post(Auth, controller.handleCableTvSubscription) // for buying cabel tv subscription
router.route('/buyElectricBill').post(Auth, controller.buyElectricBill) // for buying Electricity bills


router.route('/verifyCableTvSmartCard').post(Auth, controller.verifyCableTvSmartCard) // for verifying cabel tv smart card
router.route('/verifyElectricMeterNumber').post(Auth, controller.verifyElectricMeterNumber) // for verifying electrice meter number 



/**GET METHODS */
router.route('/user/:email').get(controller.getUser)//user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP)//generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP)//verify OTP
router.route('/createResetSession').get(controller.createResetSession)//reset all the variables

router.route('/verifyPaymentCallback').post(controller.verifyPaymentCallback) // verify payment
router.route('/paystackWebhook').post(controller.paystackWebhook) // verify payment webhook
router.route('/getAllTransactionOfAUser/:email').get(controller.getAllTransactionOfAUser) // Get all user transactions records 
router.route('/getSpecificTransactionOfAUser/:id').get(Auth, controller.getSpecificTransactionOfAUser) // Gell a user specific transactions records
router.route('/getLastMonthRevenue').get(Auth, controller.getLastMonthRevenue) // Gell Last month revenue
router.route('/getLastSevenDaysRevenue').get(Auth, controller.getLastSevenDaysRevenue) // Gell Last Seven Days Revenue 
router.route('/getLast24HrsRevenue').get(Auth, controller.getLast24HrsRevenue) // Gell Last 24Hrs Days Revenue 



/**PUT METHOD */
router.route('/updateUser').put(Auth, controller.updateUser)//update user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword) //user to reset password

export default router