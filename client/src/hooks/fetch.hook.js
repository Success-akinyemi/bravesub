import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { getEmail } from '../helpers/helper'

//axios.defaults.baseURL = 'http://localhost:9000'
//axios.defaults.baseURL = 'https://bravesub-api.onrender.com'
axios.defaults.baseURL= 'https://rich-gold-trout-sock.cyclic.cloud'

/**Custom Hooks */
export function useFetch(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})
    
    useEffect(() => {

        const fetchData = async () => {
            try {
                
                const { email } = !query ? await getEmail() : '';

                const { data, status} = !query ? await axios.get(`api/user/${email}`) : await axios.get(`/api/${query}`) 
                
                
                //console.log('data from hooks', data)
                if (status === 200) {
                    setData({ isLoading: false, apiData: data, status: status, serverError: null })
                } else {
                    setData({ isLoading: false, apiData: null, status: status, serverError: null })
                }
            } catch (error) {
                setData({ isLoading: false, apiData: null, status: null, serverError: error })
            }
        };
        fetchData()
    }, [query])

    return data;
}


export function useFetchTransaction(query) {
    const [transaction, setTransaction] = useState({ isLoadingTransaction: true, transactionData: null, transactionstatus: null, serverErrorTransaction: null})

    const fetchTransactionData = useCallback(async () => {
        try {
            const { email } = !query ? await getEmail() : '';

            const token = await localStorage.getItem('token')

            const { data, status } = !query ? await axios.get(`api/getAllTransactionOfAUser/${email}`) : await axios.get(`/api/${query}`,  {headers: {Authorization: `Bearer ${token}`}})

            if (status === 200) {
                setTransaction({ isLoadingTransaction: false, transactionData: data, transactionstatus: status, serverErrorTransaction: null })
            } else {
                setTransaction({ isLoadingTransaction: false, transactionData: null, transactionstatus: status, serverErrorTransaction: null })
            }
        } catch (error) {
            setTransaction({ isLoadingTransaction: false, transactionData: null, transactionstatus: null, serverErrorTransaction: error })
        }
    }, [query]);

    useEffect(() => {
        fetchTransactionData();
    }, [fetchTransactionData]);

    return transaction;
}

export function useFetchSpecificTransaction(transactionRef) {
    const [transactionId, setTransactionId] = useState({ isLoadingTransaction: true, transactionData: null, transactionstatus: null, serverErrorTransaction: null})

    const fetchTransactionData = useCallback(async () => {
        try {
            const token = await localStorage.getItem('token')
            const { data, status } = await axios.get(`api/getSpecificTransactionOfAUser/${transactionRef}`, {headers: {Authorization: `Bearer ${token}`}}) 

            if (status === 200) {
                setTransactionId({ isLoadingTransaction: false, transactionData: data, transactionstatus: status, serverErrorTransaction: null })
            } else {
                setTransactionId({ isLoadingTransaction: false, transactionData: null, transactionstatus: status, serverErrorTransaction: null })
            }
        } catch (error) {
            setTransactionId({ isLoadingTransaction: false, transactionData: null, transactionstatus: null, serverErrorTransaction: error })
        }
    }, [transactionRef]);

    useEffect(() => {
        fetchTransactionData();
    }, [fetchTransactionData]);

    return transactionId;
}


