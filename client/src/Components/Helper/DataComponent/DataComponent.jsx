import { useEffect, useState } from 'react';
import { airtelDataOption, airtimeNetworkAndcodes, dataNetworkAndcodes, gloDataOption, mtnDataOption, nineDataOption, smileDataOption } from '../../../data/NetworkPlan';
import { buyData } from '../../../helpers/helper';
import './DataComponent.css'
import '../styling.css'
import { useFetch } from '../../../hooks/fetch.hook';

function DataComponent() {
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('')
    const [datatype, setDataType] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amountValue, setAmountValue] = useState('');
    const [costPrice, setCostPrice] = useState('')

    const { apiData, isLoading, serverError } = useFetch()
    
    const handleNetworkChange = (e) => {
        const selectedOptionIndex = e.target.selectedIndex;
        setSelectedNetwork(e.target.value);
        setCode(airtimeNetworkAndcodes[selectedOptionIndex - 1]?.code || '');
        setAmountValue('');
        setType('');
      };
      
      useEffect(() => {
        //console.log('Selected Network:', selectedNetwork);
        //console.log('Code:', code);
      }, [selectedNetwork, code]);
      

    const handleOptionChange = (e, dataOption) => {
        const selectedOptionValue = parseFloat(e.target.value);
        const selectedItem = dataOption.find((item) => item.value === selectedOptionValue);
    
        setAmountValue(selectedItem.value);
        setType(selectedItem.type);
        setDataType(selectedItem.dataPlan)
        setCostPrice(selectedItem.cp)
    
    
      };

      useEffect(() => {
       // console.log('Amount:', amountValue);
        //console.log('Type:', type);
        //console.log('Data Plan', datatype)
      }, [amountValue, type, datatype]);
    

    const handleData = async (e) => {
        e.preventDefault();
        const networkCode = code
        const userPhoneNumber = phoneNumber
        const amount = amountValue
        const email = apiData?.email
        const buyType = type
        const dataPlanCode = datatype
        const cp = costPrice
        //console.log(
        //  'Netwok code>>', networkCode,
        //  'Phone number>>', userPhoneNumber,
        //  'Amount>>', amount,
        //  'Buy type>>', buyType,
        //  'Data Plan Code>>', dataPlanCode,
        //  'Cost Price>>', costPrice
        //)

       try {
           setIsLoadingAnimation(true)
           const data = await buyData({networkCode,amount,userPhoneNumber,email,buyType,dataPlanCode,cp})
        } catch (error) {
            console.log(error)
        } finally{
            setIsLoadingAnimation(false)
        }

      }
    return (
    <div>
            <h3>Buy Data</h3>
            <h2>Select Network</h2>
            <form onSubmit={handleData}>
              <select className='select1' required onChange={handleNetworkChange}>
                <option>-- Select Network --</option>
                { dataNetworkAndcodes.map((item, idx) => 
                  <option key={idx} value={item.network}>{item.network}</option>
                )}
              </select>

      {selectedNetwork === 'MTN' && (
        <select
          className='select2'
          value={amountValue}
          onChange={(e) => handleOptionChange(e, mtnDataOption)}
        >
          <option>-- Select MTN Data Plan --</option>
          {mtnDataOption.map((item, idx) => (
            <option value={item.value} key={idx}>{item.text}</option>
          ))}
        </select>
      )}

      {selectedNetwork === 'Glo' && (
        <select
          className='select2'
          value={amountValue}
          onChange={(e) => handleOptionChange(e, gloDataOption)}
        >
          <option>-- Select Glo Option --</option>
          {gloDataOption.map((item, idx) => (
            <option value={item.value} key={idx}>{item.text}</option>
          ))}
        </select>
      )}

      {selectedNetwork === 'AIRTEL' && (
        <select
          className='select2'
          value={amountValue}
          onChange={(e) =>handleOptionChange(e, airtelDataOption)}
        >
          <option>-- Select AIRTEL Data plan --</option>
          {airtelDataOption.map((item, idx) => (
            <option value={item.value} key={idx}>{item.text}</option>
          ))}
        </select>
      )}

      {selectedNetwork === '9Mobile' && (
        <select
          className='select2'
          value={amountValue}
          onChange={(e) => handleOptionChange(e, nineDataOption)}
        >
          <option>-- Select 9Mobile Data plan --</option>
          {nineDataOption.map((item, idx) => (
            <option value={item.value} key={idx}>{item.text}</option>
          ))}
        </select>
      )}

      {selectedNetwork === 'Smile' && (
        <select
          className='select2'
          value={amountValue}
          onChange={(e) => handleOptionChange(e, smileDataOption)}
        >
          <option>-- Select Smile Data plan --</option>
          {smileDataOption.map((item, idx) => (
            <option value={item.value} key={idx}>{item.text}</option>
          ))}
        </select>
      )}

      {amountValue && (
        <input
          type="number"
          value={amountValue}
          disabled
          className="amount_input"
        />
      )}
      {apiData?.acctBalance < amountValue && <h2 className='errorMsg'>Insuffcient Fund</h2>}
      
      
      <input required className='formInput' placeholder='Phone Number' type='number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>

      {amountValue && (
        <button className="submitBtn" type="submit" disabled={apiData?.acctBalance < amountValue || isLoadingAnimation}>
          {isLoadingAnimation ? 'Please Wait' : apiData?.acctBalance < amountValue ? 'Insufficient fund' : 'Proceed'}
        </button>
      )}
    </form>
    </div>
  )
}

export default DataComponent