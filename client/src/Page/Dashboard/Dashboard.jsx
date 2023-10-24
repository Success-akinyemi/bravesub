import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../../assest/mediplus.png'
import { Link, useNavigate } from 'react-router-dom';
import { useFetch,  useFetchTransaction } from '../../hooks/fetch.hook'
import  { Toaster } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns';
import MenuIcon from '@mui/icons-material/Menu';
import LoadingAnimationPage from '../../Components/LoadingAnimationPage/LoadingAnimationPage';
import DataImg from '../../assest/data.png';
import AirtimeImg from '../../assest/airtime.png';
import ElectricityImg from '../../assest/electricity.png'
import CableTvImg from '../../assest/cabletv.png'
import AirtimeComponent from '../../Components/Helper/AirtimeComponent/AirtimeComponent';
import DataComponent from '../../Components/Helper/DataComponent/DataComponent';
import CableTvComponent from '../../Components/Helper/CableTvComponent/CableTvComponent';
import ElectricityComponent from '../../Components/Helper/ElectricityComponent/ElectricityComponent';
import AccountFunding from '../../Components/Helper/AccountFunding/AccountFunding';

function Dashboard() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('');

  function userLogout(){
    localStorage.removeItem('token')
    navigate('/')
  }
  // for getting day
  useEffect(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const month = months[today.getMonth()];
    const day = today.getDate();
    const year = today.getFullYear();
  
    setCurrentDay(dayOfWeek);
    setCurrentDate(`${day} ${month} ${year}`);
  }, [])

  //for geting time
  useEffect(() => {
    const today = new Date();
    const currentHour = today.getHours();
    //console.log('time', currentHour)
  
    let newGreeting = '';
    if (currentHour >= 5 && currentHour < 12) {
      newGreeting = 'Good Morning 🌻';
    } else if (currentHour >= 12 && currentHour < 18) {
      newGreeting = 'Good Afternoon 🌞';
    } else {
      newGreeting = 'Good Evening 🌅';
    }
  
    setGreeting(newGreeting);
  }, []);


  const { apiData, isLoading, serverError } = useFetch()
  const { isLoadingTransaction, transactionData, transactionstatus, serverErrorTransaction } = useFetchTransaction();
  //console.log('dashboard apidata', apiData?.email)
 


  const renderPopupComponent = () => {
    switch(selectedCard) {
      case 'airtime' :
        return (
          <div>
            <AirtimeComponent />
          </div>
        );
      case 'data' :
        return (
          <div>
            <DataComponent />
          </div>
        )
      case 'subscription' :
        return (
          <div>
            <CableTvComponent />
          </div>
        )
      case 'electric' : 
        return (
          <div>
            <ElectricityComponent />
          </div>
        )
      case 'funding':
        return(
          <AccountFunding />
        )
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('popup-overlay')) {
        setSelectedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const closePopup = () => {
    setSelectedCard(null);
  };


  if(isLoading) return <LoadingAnimationPage />
  if(serverError) return <h1>{serverError.message}</h1>

  return (
    <div className='dashboard'>
      <div className="content">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      
      {selectedCard && (
        <>
          <div className='popup-overlay' onClick={closePopup}></div>
          <div className={`popup active`}>
              <span className='popup-close' onClick={closePopup}>
                Close
              </span>
            <div className='popup-content'>
                {renderPopupComponent()}
            </div>
          </div>
        </>
      )}


      <div className={`sidebar ${menuOpen ? 'menu-open' : ''}`}>
        <CloseIcon className='closeBtn' onClick={() => setMenuOpen((prev)=>!prev)} />
        <div className='top'>
          <div className='logo'>
          {/*<img src={Logo} alt='Logo' className='dashboard_img'/>*/}
             <h2>Brave<span>Sub</span></h2>
          </div>

          <div className='profile'>
            <Link to={'/profile'}>
              {apiData.img ? <img src={apiData.img} alt='profile' className='profile_img'/> : <AccountCircleIcon className='profile_img'/>}
            </Link>
          </div>

        </div>
        <div className='info'>
          <h2>Hello, {apiData?.username || 'username'} </h2>
          <h4>Accont Balance: <span>NGN {apiData.acctBalance ? apiData.acctBalance : '--.--' }</span></h4>
        </div>

        <div className='fundingBtn' onClick={() => setSelectedCard('funding')}>
          Fund Account
        </div>

        <div className='menu'>
            <Link className='menu_link' onClick={() => setSelectedCard('data')}>Buy Data</Link>
            <Link className='menu_link' onClick={() => setSelectedCard('airtime')}>Buy Airtime</Link>
            <Link className='menu_link' nClick={() => setSelectedCard('subscription')}>Cable Subscription</Link>
            <Link className='menu_link' onClick={() => setSelectedCard('electric')}>Electric Bill</Link>
        </div>

        <div className='logoutBtn'>
            <button onClick={userLogout}>Logout</button>
        </div>
      </div>



      <div className='main'>
        
          <h2>We are here for you, please chose a service</h2>

        <div className='dashboard_content'>
          <div className="cards">

            <div className='card' onClick={() => setSelectedCard('airtime')} >
              <h3>Buy airtime</h3>
              <img src={AirtimeImg} alt="buy airtime" />
            </div>

            <div className='card' onClick={() => setSelectedCard('data')}>
              <h3>Buy Data</h3>
              <img src={DataImg} alt="buy data" />
            </div>

            <div className='card' onClick={() => setSelectedCard('subscription')}>
              <h3>Cable Subscription</h3>
              <img src={CableTvImg} alt="cable tv bills" />
            </div>
            <div className='card' onClick={() => setSelectedCard('electric')}>
              <h3>Electric Bills</h3>
              <img src={ElectricityImg} alt="Electricity bills" />
            </div>
          
          </div>

          <hr />

          <div className="actions">
            <h2>More Actions:</h2>

            <div className="action_contents">
              <div className="packs">
                <div className="pack">
                  Buy WAEC Pin
                </div>

                <div className="pack">
                  Buy JAMB Pin
                </div>
              </div>
            </div>
          </div>

        </div>


        <div className="transactionTable">
          <h2>Recent Transaction</h2>
          {transactionData && (
            <table>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Refrence</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {transactionData.slice().reverse().map(transaction => (
                  <tr key={transaction._id}>
                    <td>{transaction.transcationType}</td>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.transcationStatus === 'Successful' ? (<span className='success'>Successful</span>) : (<span className='pending'>Pending</span>)}</td>
                    <td>{formatDistanceToNow(new Date(transaction.createdAt))} ago</td>
                    <td><Link to={`/transactionDetail/${transaction._id}`}>Details</Link></td>
                    {/* Add other columns */}
                  </tr>
                ))}

              </tbody>
            </table>
          )}
          <Link className='table-btn'>Show All</Link>
        </div>
      </div>

      <aside>
        <div className="top">
          <div className='menuBtn' onClick={() => setMenuOpen((prev)=>!prev)}>
            <MenuIcon className='menuIcon' />
          </div>

          <div className="day">
            <p>{greeting}</p>
            <small>{currentDay} {currentDate}</small>
          </div>
        </div>

        <div className="recentUpdates">
          <h2>Recent Update</h2>
          <div className="updates">
            <div className="update">
              <div className="profilePhoto">
                <NotificationsActiveIcon />
              </div>
              <div className="message">
                <p><b>New Airime code: </b>
                  new code for recharging airtime on all networks: *311*
                </p>
              </div>
            </div>

            <div className="update">
              <div className="profilePhoto">
                <NotificationsActiveIcon />
              </div>
              <div className="message">
                <p><b>New Data code: </b>
                new code for Buying data on all networks: *312#
                </p>
              </div>
            </div>

            <div className="update">
              <div className="profilePhoto">
                <NotificationsActiveIcon />
              </div>
              <div className="message">
                <p><b>New balance checking code: </b>
                new code for Checking airtime balance on all networks: *310*
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      </div>
    </div>
  )
}

export default Dashboard