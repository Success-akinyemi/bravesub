import React, { useState } from 'react'
import './Navbar.css'
import Logo from '../../assest/logo.png'
import { Link } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import OutsideClickHandler from 'react-outside-click-handler'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = (menuOpen) => {
        if(document.documentElement.clientWidth <= 800){
            return {right: !menuOpen && '-100%'}
        }
    }

  return (
    <div className='navbar'>
        <div className="container nav-conatiner">
            <div className="logo">
                <div className="l-top">
                    <img src={Logo} alt='logo' />
                    <h2>Brave Sub</h2>
                </div>

            </div>

            <OutsideClickHandler
                    onOutsideClick={() => {
                        setMenuOpen(false)
                    }}
            >

                <div className="links" style={toggleMenu(menuOpen)}>
                    <Link to='/' className='link'>Home</Link>
                    <Link to='/' className='link'>About</Link>
                    <Link to='/' className='link'>Contact Us</Link>
                    <Link to='/login' className='link'>Login</Link>
                    <Link to='/signup' className='link addmission'>Create Account</Link>
                </div>
            </OutsideClickHandler>

            <div className='menu-icon' onClick={() => setMenuOpen((prev) => !prev)}>
                <MenuIcon className='menu-link'/>
            </div>
        </div>
    </div>
  )
}

export default Navbar