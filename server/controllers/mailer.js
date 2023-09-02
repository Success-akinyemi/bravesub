import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { config } from 'dotenv'
config()

//https://ethereal.email/create
let nodeConfig = {
    service: "gmail",
    //host: "gmail", //gmail for real account
    //port: 587,
    //secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER, // generated ethereal user
      pass: process.env.NODEMAILER_PW, // generated ethereal password
    },
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: "BraveSub",
        link: 'https://bravesub.com.ng'
    }
})

/**POST http://localhost:9000/api/registerMail 
 * @param" {
 * "username": "success",
 * "userEmail": "success123@gmail.com",
 * "text": "",
 * "subject": ""
 * }
*/
export const registerMail = async (req, res) => {
    const {username, userEmail, text, subject } = req.body;

    //body of the email
    var email= {
        body: {
            name: username,
            intro: text || 'Welcome to Brave Sub we are please to have you with us. Buy Data, Airtime, Cable Tv Subscription, Electricity Easily and fast with us',
            outro: 'Need help or question? Just reply to this mail. or chat 09033626014 on whatsapp'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: process.env.NODEMAILER_USER,
        to: userEmail,
        subject: subject || 'Signup Successfully',
        html: emailBody
    }

    //send mail
    transporter.sendMail(message)
    .then(() => {
        return res.status(200).send({ msg: "You should recieve an email from us"})
    })
    .catch(error => res.status(500).send({ error }))
}