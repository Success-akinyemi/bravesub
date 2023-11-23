import { useEffect, useState } from 'react';
import { airtimeNetworkAndcodes } from '../../../data/NetworkPlan'
import { buyAirtime } from '../../../helpers/helper';
import './AirtimeComponent.css'
import '../styling.css'
import { useFetch } from '../../../hooks/fetch.hook';

function AirtimeComponent() {
    const [code, setCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amountValue, setAmountValue] = useState('');
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

    const { apiData, isLoading, serverError } = useFetch()
    
    const handleAirtime = async (e) => {
    e.preventDefault();
    const networkCode = code
    const userPhoneNumber = phoneNumber
    const amount = amountValue
    const email = apiData?.email

    useEffect(()=> {
      console.log(networkCode)
    }, [networkCode])

    try {
      setIsLoadingAnimation(true)
      const airtime = await buyAirtime({networkCode, userPhoneNumber, amount, email})
    } catch (error) {
      console.log(error)
    } finally{
      setIsLoadingAnimation(false)
    }
  }
  return (
    <div className='airtimeComponent'>
            <h3>Buy Airtime</h3>
            <h2>Select Network</h2>
            <form onSubmit={handleAirtime}>
              <select className='select1' required onChange={(e) => setCode(e.target.value)}>
                <option>-- Select Network --</option>
                { airtimeNetworkAndcodes.map((item, idx) => 
                  <option key={idx} value={item.code}>{item.network}</option>
                )}
              </select>

              <input required className='formInput' placeholder='Enter Amount' type='number' value={amountValue} onChange={(e) => setAmountValue(e.target.value)}/>
              {amountValue < 100 && <h2 className='errorMsg'>Minimum amount is NGN 100</h2>}
              {amountValue > 50000 && <h2 className='errorMsg'>Maximum amount is NGN 50,000</h2>}
              {apiData?.acctBalance < amountValue && <h2 className='errorMsg'>Insuffcient Fund</h2>}
              <input required className='formInput' placeholder='Phone Number' type='number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                  
              <button type='submit' className="submitBtn" disabled={amountValue < 100 || amountValue > 50000 || apiData?.acctBalance < amountValue || isLoadingAnimation}>
                {isLoadingAnimation ? 'Please Wait' : apiData?.acctBalance < amountValue ? 'Insufficient fund' : 'Proceed'}
              </button>
            </form>
    </div>
  )
}

export default AirtimeComponent