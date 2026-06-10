import {useState} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"

export default function Logoff(){
    const {logout} = useAuth()

    const [logoutError, setLogoutError] = useState("")

    async function handleLogout() {
        const response = await logout()

        if (!response.success){
            setLogoutError(response.error) //setLogoutError("Logout failed"); now logoutError = "Logout failed"
        }
    }
    return(
        <div>
        {/* when it become {"Logout failed" && <p>{logoutError}</p>} after line 13 setLogoutError("Logout failed")->then logoutError will become error message too*/}
        {logoutError && <p>{logoutError}</p>} 
        <button onClick={handleLogout}>logoff</button>
        </div>
    )
}