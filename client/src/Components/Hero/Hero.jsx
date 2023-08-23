import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

function Hero() {
  return (
    <div className='hero'>
        <div className="hero-container">
            <div className="content">
              <h2>Get Amazing Offers Here</h2>
              <p>Buy Data, Airtime, Pay Electric Bills, Cable Tv Subscription And Lots More Seamless and without Stress</p>
              <span className="btn">
                  <Link to='/signup' className='link addBtn'>Get Started Today</Link>
                  <Link to='/login' className='link expBtn'>Continue to Account</Link>
              </span>
            </div>
            <div className="overlay"></div>
        </div>
    </div>
  )
}

export default Hero