import './AccountFunding.css'
import '../styling.css'
import { paysavings } from '../../../helpers/helper';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useState } from 'react';
import { useFetch } from '../../../hooks/fetch.hook';

function AccountFunding() {
    const [amountValue, setAmountValue] = useState('');
    const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

    const { apiData, isLoading, serverError } = useFetch()

      //for paystack
  const handlePaystack = async (e) => {
    e.preventDefault()
    const email = apiData?.email
    const amount = amountValue
    try {
      setIsLoadingAnimation(true)
      const payment = await paysavings({email, amount})
      console.log(payment)
    } catch (error) {
      console.log(error)
    } finally{
      setIsLoadingAnimation(false)
    }
  }

  //for flutter wave
  const handleFunding = async (e) => {
    e.preventDefault();
    // user info
    const email = apiData?.email;
    const amount = amountValue;
    try {

      //const subscription = await paysavings({ email, amount});
      //console.log(subscription)
      
          handleFlutterPayment({
            callback: (response) => {
               console.log(response);
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => {},
          });
    

    /** 
    FlutterwaveCheckout({
      public_key: 'FLWPUBK_TEST-acf8b20a824d76f555d6641ccca8ccfd-X',
      tx_ref: 'Transfer-'+Date.now(),
      amount: amount,
      currency: 'NGN',
      country: 'NG',
      payment_options: 'card',

      redirect_url: 'http://www.google.com',
      customer: {
        email: email,
        name: apiData?.username
      },
      callback: function (data) {
        console.log(data)
      },
      onclose: function() {
        //close modal
      },
      customizations: {
        title: 'Flutterwave',
        description: 'Flutterwave payment Demo', 
      }
    })
    */
    } catch (error) {
      console.log(error)
    }
    // Submit the form or perform any additional actions
  };

  const config = {
    public_key: 'FLWPUBK_TEST-acf8b20a824d76f555d6641ccca8ccfd-X',
    tx_ref: 'Transfer-'+Date.now(),
    amount: amountValue,
    currency: 'NGN',
    payment_options: 'card',
    customer: {
      email: apiData?.email,
      phone_number: '07012345648',
      name: apiData?.username || 'customer',
    },
    customizations: {
      title: 'VtuHub Account Funding',
      description: 'Payment for Account Funding',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  }

  const handleFlutterPayment = useFlutterwave(config);


  return (
    <div>
        <form onSubmit={handlePaystack}>
            {/*<label>Email:</label>
            <input type='email' className='amount_input'></input>*/}
            
            <label>Amount:</label>
            <input type='number' className='amount_input' value={amountValue} onChange={(e) => setAmountValue(e.target.value)} placeholder='Amount' />
            <h2 className='errorMsg'>{amountValue < 100 ? 'Minimium Amount is NGN 100' : ''}</h2>
            <button type='submit' className='submitBtn' disabled={amountValue < 100 || isLoadingAnimation} >
            {isLoadingAnimation ? 'Please Wait' : 'Pay'}
            </button>
          </form>
    </div>
  )
}

export default AccountFunding