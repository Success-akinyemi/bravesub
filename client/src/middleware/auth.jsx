
import { Navigate } from "react-router-dom";
import { useAuthStore } from '../store/store'

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token')
    if(!token){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }

    return children
}

export const ProtectRoute = ({ children }) => {
    const email = useAuthStore.getState().auth.email;

    if(!email){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }

    return children
}