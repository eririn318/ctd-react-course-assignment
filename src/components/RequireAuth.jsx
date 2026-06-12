import {useLocation, useNavigate, Navigate} from "react-router"
import {useEffect} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"



export default function RequireAuth({children}){
    const {isAuthenticated, isAuthLoading} = useAuth()
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

    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-pulse">
                <span className="block text-3xl mb-2">🔒</span>
                <p className="text-sm font-medium">Verifying credentials...</p>
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to="/login" state={{from:location}} replace/>
    }
    return children
}

