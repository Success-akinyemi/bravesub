import './App.css';
import Home from './Page/Home/Home';
import Profile from './Page/Profile/Profile'
import Login from './Components/Login/Login';
import Password from './Components/Password/Password';
import Signup from './Components/Signup/Signup';
import Otp from './Components/OTP/Otp';
import PasswordReset from './Components/PasswordReset/PasswordReset';
import Dashboard from './Page/Dashboard/Dashboard';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

/**Auth middleware */
import { AuthorizeUser,ProtectRoute } from './middleware/auth'
import LoadingAnimationPage from './Components/LoadingAnimationPage/LoadingAnimationPage';
import TransactionDetail from './Page/TransactionDetail/TransactionDetail';

function App() {
  
  const token = localStorage.getItem('token')

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/passwordReset' element={<ProtectRoute><PasswordReset /></ProtectRoute>} />
          <Route path='/password' element={<ProtectRoute><Password /></ProtectRoute>}/>
          <Route path='/getOTP' element={<Otp />}/>
          <Route path='/dashboard' element={<AuthorizeUser><Dashboard /></AuthorizeUser>}/>
          <Route path='/transactionDetail/:_id' element={<AuthorizeUser><TransactionDetail /></AuthorizeUser>}/>
          <Route path='/profile' element={<AuthorizeUser><Profile /></AuthorizeUser>}/>
          <Route path='/' element={<Home />}/>
          {/* Catch-all route for logged-in users */}
          {token && <Route path="/*"  element={<Navigate to="/dashboard" />} />}
          {/* Catch-all route for non-logged-in users */}
          {!token && <Route path="/*" element={<Home />} />}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
