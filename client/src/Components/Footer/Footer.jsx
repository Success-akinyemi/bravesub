import './Footer.css'
import Logo from '../../assest/logo.png'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { footerBlog } from '../../data/data';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer'>
        <div className="footer-container">
            <div className="container footer-content">
                <div className='content-container'>

                    <div className="f-one">
                        <div className="logo">
                            <div className="l-top">
                                <img src={Logo} alt='logo' />
                                <h2>BraveSub</h2>
                            </div>
                            <div className="l-bottom">
                                <span>Brave Sub</span>
                            </div>
                        </div>

                        <span className='quote'>
                        Explore a World of Seamless Services. At bravesub, convenience meets innovation. With a range of offerings at your fingertips, experience instant solutions tailored to your needs. Recharge your airtime effortlessly, dive into data bundles in an instant, and stay tuned with CableTV selections including DStv, GOtv, and Startimes. Manage your utilities through hassle-free electricity bill payments and beyond. Elevate your experience with us today.
                        </span>

                        <div className="socials">
                            {/**<a href="www.twitter.com" target='_blank'><TwitterIcon className='icon' /></a> */}
                            <a href="www.facebook.com" target='_blank'><FacebookIcon className='icon' /></a>
                            <a href="https://www.instagram.com/bravesub_" target='_blank'><InstagramIcon className='icon' /></a>
                            <a href="https://wa.me/2349033626014?text=Hello Bravesub" target='_blank'><WhatsAppIcon className='icon' /></a>
                        </div>
                    </div>



                    <div className="f-three">
                        <div className="header">
                            Site Links
                        </div>

                        <div className="links">
                            <Link className='link'>Home</Link>
                            <Link className='link'>About</Link>
                            <Link className='link'>Contact Us</Link>
                            <Link to='/signup' className='link'>Get Started</Link>
                        </div>
                    </div>

                    <div className="f-four">
                        <div className="header">
                            Have a Questions?
                        </div>

                        <div className="content">
                            <div className="card">
                                <a href="">
                                    <PlaceIcon className='icon' />
                                    <p className='p-1'>
                                     Jos North, Plateau, Nigeria
                                    </p>
                                </a>
                            </div>

                            <div className="card">
                                <a href="tel:2349033626014" target='_blanks'>
                                    <LocalPhoneIcon className='icon' />
                                    <p>09033626014</p>
                                </a>
                            </div>

                            <div className="card">
                                <a href="mailto:bravesubhub@gmail.com">
                                    <EmailIcon className='icon' />
                                    <p>bravesubhub@gmail.com</p>
                                </a>
                            </div>
                        </div>
                    </div>
                
                </div>

                <div className="imprint">
                    <p>Built and Maintained by Success_hub Technology</p>
                    <span>
                        <a target='_blank' href="https://success-hub.netlify.app"><LanguageIcon className='icon' /></a>
                        <a target='_blank' href="https://wa.me/2349059309831?text=Hello success_hub contacting you from Bravesub website"><WhatsAppIcon className='icon' /></a>
                        <a target='_blank' href="tel:2349059309831"><LocalPhoneIcon className='icon' /></a>
                    </span>
                </div>
            </div>


            <div className="footer-overlay"></div>
        </div>
    </div>
  )
}

export default Footer