import {useState} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"
import {useNavigate} from "react-router-dom" 

export default function Logoff(){
    const {logout} = useAuth()
    const navigate = useNavigate()

    const [logoutError, setLogoutError] = useState("")
    const [isLoggingOff, setIsLoggingOff] = useState(false)

    async function handleLogout() {
        setIsLoggingOff(true)
        setLogoutError("")

        const response = await logout()
        if(response.success){
            navigate("/login")
        }else{
            setIsLoggingOff(false)
            setLogoutError(response.error)
        }
        // if (!response.success){
        //     setLogoutError(response.error) //setLogoutError("Logout failed"); now logoutError = "Logout failed"
        // }
    }
    return(
        <div>
        {/* when it become {"Logout failed" && <p>{logoutError}</p>} after line 13 setLogoutError("Logout failed")->then logoutError will become error message too*/}
        {logoutError && <p>{logoutError}</p>} 
        <button onClick={handleLogout}>logoff</button>
        </div>
    )
}