import './ElectricityComponent.css'
import '../styling.css'
import { useFetch } from '../../../hooks/fetch.hook'
import { ElectricCompany, MeterType } from '../../../data/ElectricityPlan'
import { buyElectricBill, verifymeterNumber } from '../../../helpers/helper'
import { useState } from 'react'

function ElectricityComponent() {
    const [customerName, setCustomerName] = useState('');
    const [meterNumber, setMeterNumber] = useState('')
    const [selectedElectricCompany, setSelectedElectricCompany] = useState('')
    const [selectedMeterType, setSelectedMeterType] = useState('')
    const [amountValue, setAmountValue] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

    const { apiData, isLoading, serverError } = useFetch()
    
    const handleElectricbills = async (e) => {
        e.preventDefault();
        const email = apiData?.email
        const userMeterNumber = meterNumber
        const userMeterType = selectedMeterType
        const electricCompany = selectedElectricCompany
        const userPhoneNumber =phoneNumber
        const amount = amountValue
        try {
          setIsLoadingAnimation(true)
          const response = await buyElectricBill({email, userMeterNumber, userMeterType, electricCompany, userPhoneNumber,amount})
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoadingAnimation(false)
        }
      }
      
      const handleVerifyMeterNumber= async (e) =>{
        e.preventDefault();
    
        const userMeterNumber = meterNumber
        const electricCompany = selectedElectricCompany
    
        //console.log(electricCompany, userMeterNumber)
        try {
          setIsLoadingAnimation(true)
          const response = await verifymeterNumber({electricCompany,userMeterNumber})
         // console.log('response', response)
    
          setCustomerName(response.customer_name);
          //console.log(customerName)
        } catch (error) {
          console.log(error)
        } finally{
          setIsLoadingAnimation(false)
        }
      }

    return (
    <div>
            <h3>Electric Bills</h3>
            <h2>Select Electric Provider</h2>
            <form>
              <select required className='select1' value={selectedElectricCompany} onChange={(e) => setSelectedElectricCompany(e.target.value)}>
                  <option>-- Select Electric Company --</option>
                  {
                    ElectricCompany.map((item, idx)=> (
                      <option value={item.code} key={idx}>{item.text}</option>
                    ))
                  }
                </select>

                <select required className='select1' value={selectedMeterType} onChange={(e) => setSelectedMeterType(e.target.value)}>
                  <option>-- Select Meter tpye --</option>
                  {
                    MeterType.map((item, idx)=> (
                      <option value={item.code} key={idx}>{item.text}</option>
                    ))
                  }
                </select>

                <input required className='formInput' placeholder='Meter Number' type='number' value={meterNumber} onChange={(e) => setMeterNumber(e.target.value)}/>
                <input required className='formInput' placeholder='Amount' type='number' value={amountValue} onChange={(e) => setAmountValue(e.target.value)}/>
                <input required className='formInput' placeholder='Phone Number' type='number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                  
                {
                  customerName ? 
                    <h3>Customer Name: {customerName}</h3> : ''
                }

                    <button type="submit" className="submitBtn" onClick={handleVerifyMeterNumber}>
                      {isLoadingAnimation ? 'Checking...' : 'Verify Meter Name'}
                    </button>

                {amountValue && (
                  <button
                    onClick={handleElectricbills}
                    className="submitBtn"
                    type="submit"
                    disabled={apiData?.acctBalance < amountValue || isLoadingAnimation}
                  >
                    {isLoadingAnimation ? 'Please Wait' : apiData?.acctBalance < amountValue ? 'Insufficient fund' : 'Proceed'}
                  </button>
                )}
            </form>
    </div>
  )
}

export default ElectricityComponent