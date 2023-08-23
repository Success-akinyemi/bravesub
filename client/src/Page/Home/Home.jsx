
import Footer from '../../Components/Footer/Footer'
import Hero from '../../Components/Hero/Hero'
import CableTv from '../../Components/LandingPage/CableTv/CableTv'
import Data from '../../Components/LandingPage/Data/Data'
import Electricity from '../../Components/LandingPage/Electricity/Electricity'
import Mission from '../../Components/LandingPage/Mission/Mission'
import Navbar from '../../Components/Navbar/Navbar'
import './Home.css'
import { Link } from 'react-router-dom'


function Home() {
  return (
    <div className='home'>
      <Navbar />
      <Hero />
      <div className="sectionIntro">
        <span>Our Products</span>
        <h1>Awesome Services</h1>
      </div>
      <Mission />
      <Data />
      <CableTv />
      <Electricity />
      <div className="sectionIntro">
        <span>Our Service</span>
        <h1>Awesome Features</h1>
      </div>
      <div className="container homeCards">
        <div className="card">
          <span>We Are Reliable</span>

          <p>
          Welcome to Bravesub: Where Reliability and Dependability Converge. Experience unwavering trust in our optimized platform. Every transaction with us guarantees 100% value, solidifying our commitment to your satisfaction.
          </p>
        </div>

        <div className="card">
          <span>We Are Fully Automatedy</span>

          <p>
          Our service operates on the forefront of technology. Through automation, we ensure seamless data delivery and wallet funding. Experience the swiftness of instant airtime top-ups, data purchases, and much more. All powered by cutting-edge innovation
          </p>
        </div>

        <div className="card">
          <span>Customer Support</span>

          <p>
          Your needs are a priority, reachable with a simple click. Feel free to seek guidance from our dedicated customer service team. Rest assured, all transactions receive prompt attention, typically resolved within the shortest time.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home