import './CableTvComponent.css'
import '../styling.css'
import { cableTvOptions, dstvPlanOptions, gotvPlanOptions, startimesPlanOptions } from '../../../data/CableTvPlan'
import { useEffect, useState } from 'react'
import { useFetch } from '../../../hooks/fetch.hook'
import { buyCableTvSubscription, verifyCableTvSmartCard } from '../../../helpers/helper'

function CableTvComponent() {
    const [selectedCableTv, setSelectedCableTv] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [cableTvCode, setCableTvCode] = useState('')
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amountValue, setAmountValue] = useState('');
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

    const { apiData, isLoading, serverError } = useFetch()
    
    const handleCableTvOptionChange = (e, CableTvOption) => {
        const selectedOptionValue = parseFloat(e.target.value);
        const selectedItem = CableTvOption.find((item) => item.value === selectedOptionValue);
    
        setAmountValue(selectedItem.value);
        setCableTvCode(selectedItem.code);
        
      }
      useEffect(() => {
      //  console.log('Amount:', amountValue);
      //  console.log('Code:', setCableTvCode);
      }, [amountValue, cableTvCode]);
    
      const handleCableTv = async (e) => {
        e.preventDefault();
        const userPhoneNumber = phoneNumber
        const smartCardNumber = cardNumber
        const email = apiData?.email
        const selectedCableTvCode = cableTvCode
        const amount = amountValue
        const cableTv = selectedCableTv
        
    
        console.log(selectedCableTv, cableTvCode, phoneNumber, smartCardNumber, amountValue);
        try {
          setIsLoadingAnimation(true)
          const data = await buyCableTvSubscription({userPhoneNumber,smartCardNumber,email,selectedCableTvCode,amount,cableTv})
        } catch (error) {
          console.log(error)
        } finally{
          setIsLoadingAnimation(false)
        }
    
      };
      
      const verifySmartCard = async (e) =>{
        e.preventDefault();
    
        const cableTv = selectedCableTv
        const smartCardNumber = cardNumber
    
        console.log(cableTv, smartCardNumber)
        try {
          setIsLoadingAnimation(true)
          const response = await verifyCableTvSmartCard({smartCardNumber,cableTv})
         // console.log('response', response)
    
          setCustomerName(response.customer_name);
         // console.log(customerName)
        } catch (error) {
          console.log(error)
        } finally{
          setIsLoadingAnimation(false)
        }
      }
      useEffect(() => {
        //console.log('customerName:', customerName); // Log the customerName whenever it changes
      }, [customerName]);
    
    return (
    <div>
        <h3>Cable Subscription</h3>
            <h2>Select Service</h2>
            <form>
                <select className='select1' value={selectedCableTv} onChange={(e) => setSelectedCableTv(e.target.value)}>
                  <option>-- Cable Tv Option --</option>
                  {
                    cableTvOptions.map((item, idx)=> (
                      <option value={item.code} key={idx}>{item.text}</option>
                    ))
                  }
                </select>

                {selectedCableTv === 'dstv' && (
                  <select
                    className='select2'
                    value={amountValue}
                    onChange={(e) => handleCableTvOptionChange(e, dstvPlanOptions)}
                  >
                    <option>-- Select DSTV Subscription Plan --</option>
                    {
                      dstvPlanOptions.map((item, idx) => (
                        <option value={item.value} key={idx}>{item.text}</option>
                      ))
                    }
                  </select>
                )}

                {selectedCableTv === 'gotv' && (
                  <select
                    className='select2'
                    value={amountValue}
                    onChange={(e) => handleCableTvOptionChange(e, gotvPlanOptions)}
                  >
                    <option>-- Select GOTV Subscription Plan --</option>
                    {
                      gotvPlanOptions.map((item, idx) => (
                        <option value={item.value} key={idx}>{item.text}</option>
                      ))
                    }
                  </select>
                )}

                {selectedCableTv === 'startimes' && (
                  <select
                    className='select2'
                    value={amountValue}
                    onChange={(e) => handleCableTvOptionChange(e, startimesPlanOptions)}
                  >
                    <option>-- Select Startimes Subscription Plan --</option>
                    {
                      startimesPlanOptions.map((item, idx) => (
                        <option value={item.value} key={idx}>{item.text}</option>
                      ))
                    }
                  </select>
                )}

                <input required className='formInput' placeholder='Phone Number' type='number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                <input required className='formInput' placeholder='card Number' type='number' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}/>

                {amountValue && (
                  <input
                  type="number"
                  value={amountValue}
                  disabled
                  className="amount_input"
                  />
                )}
                {apiData?.acctBalance < amountValue && <h2 className='errorMsg'>Insuffcient Fund</h2>}

                {
                  customerName ? 
                    <h3>Customer Name: {customerName}</h3> : ''
                }

                    <button type="submit" className="submitBtn" onClick={verifySmartCard}>
                      {isLoadingAnimation ? 'Checking...' : 'Verify Smart Card Name'}
                    </button>

                  <br />
                 {amountValue && (
                  <button onClick={handleCableTv} className="submitBtn" type="submit" disabled={apiData?.acctBalance < amountValue || isLoadingAnimation}>
                    {isLoadingAnimation ? 'Please Wait' : apiData?.acctBalance < amountValue ? 'Insufficient fund' : 'Proceed'}
                  </button>
                )}
            </form>
    </div>
  )
}

export default CableTvComponent