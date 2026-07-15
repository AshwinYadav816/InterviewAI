import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import Loader from "../../../components/Loader";

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return <Loader message="Authenticating" subtitle="Checking your session" />
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected