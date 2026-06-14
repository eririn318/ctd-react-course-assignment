import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.jsx"

function Homepage() {
const {isAuthenticated} = useAuth()
const navigate = useNavigate()

useEffect(()=>{
    // 🎉 They are logged in! Send them to the main app page
    if (isAuthenticated){
    // When logging in: It transforms the /login page history card directly into a /todos card. If the user clicks the browser's back arrow from their todo list, they bypass the login page completely and go back to whatever website they were on before.
        navigate("/todos", { replace: true })
    }else{
    // 🔒 They are not logged in! Kick them back to login
    // When logging out: It transforms whatever page they were on directly into a /login card. This ensures that an unauthenticated user cannot click "Back" to sneak a peek at the old todo data that was just on the screen.
        navigate("/login", { replace: true })
    }
//Re-runs instantly whenever isAuthenticated flips!
},[isAuthenticated,navigate])//isAuthenticated changes between true or false (tells the app if you are logged in), your Maps function will drive the user to the correct page.(login or todo page)

return(
    <>
    <p>Re-directing...</p>
    </>
)

}

export default Homepage