import {useLocation, useNavigate, Navigate} from "react-router-dom"
import {useEffect} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"



export default function RequireAuth({children}){
    const {isAuthenticated} = useAuth()
    const location = useLocation()
    // const navigate = useNavigate()

    // useEffect(()=>{
    //     const from = location.state?.from?.pathname || "/login"
    //     if(!isAuthenticated){
    //        return  navigate(from, {replace:true}) //This allows users to return to their intended destination after logging in
    //     }

    // },[isAuthenticated, navigate, location])
    // return(
    //     !isAuthenticated ? <p>Loading...</p> : RequireAuth(children)
    // )

    if(!isAuthenticated){
        return <Navigate to="/login" state={{from:location}} replace/>
    }
    return children
}

