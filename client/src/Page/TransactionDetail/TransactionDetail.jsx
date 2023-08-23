import './TransactionDetail.css'
import { useFetchSpecificTransaction } from '../../hooks/fetch.hook'
import { useLocation } from 'react-router-dom'
import LoadingAnimationPage from '../../Components/LoadingAnimationPage/LoadingAnimationPage'
import { formatDistanceToNow } from 'date-fns'

function TransactionDetail() {
  const location = useLocation()
  const id = location.pathname.split('/')[2]
  console.log("ID>>", id)
  const { isLoadingTransaction, transactionData, transactionstatus, serverErrorTransaction} = useFetchSpecificTransaction(id)
  
  if(isLoadingTransaction) return <LoadingAnimationPage />
  if(serverErrorTransaction) return <h1>{serverErrorTransaction.message}</h1>
  return (
    <div className='transactionDetail'>
        <div className='transactionDetail-content'>
            <span><h2>Transaction Type: </h2> {transactionData.transcationType}</span>
            <span><h2>Amount: </h2> {transactionData.amount}</span>
            <span><h2>Status: </h2> <b>{transactionData.transcationStatus}</b></span>
            <span><h2>Transaction Description: </h2> {transactionData.transcationDesc}</span>
            <span><h2>Refrence: </h2> {transactionData.transactionId}</span>
            <span><h2>Time: </h2> {formatDistanceToNow(new Date(transactionData.createdAt))} ago</span>
            
            <small><h2>ID: </h2> {transactionData._id}</small>
        </div>
    </div>
  )
}

export default TransactionDetail