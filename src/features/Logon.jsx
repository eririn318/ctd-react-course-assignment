import {useState} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"
// export default function Logon({onSetEmail=()=>{}, onSetToken = () => {}}) {
    export default function Logon() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authError, setAuthError] = useState("") //setAuthError uses error: in AuthContext
    const [isLoggingOn, setIsLoggingOn] = useState(false)

    const {login} = useAuth()
    async function handleSubmit(event) {
        event.preventDefault()
            setIsLoggingOn(true) //loading starts
            
        // try{ 
        //     const response = await fetch("/api/users/logon", {
        //     method:"POST",
        //     headers: {"Content-Type" : "application/json"},
        //     credentials: 'include',
        //     body: JSON.stringify({email, password})
        // })
        // const data = await response.json()
        // if (response.status ===200 && data.name && data.csrfToken) {
        //     onSetEmail(data.name)
        //     onSetToken(data.csrfToken)
        // } 
        // else {
        //     setAuthError(`Authentication failed: ${data?.message}`)        
        // }
        // }catch(error){
        //     setAuthError(`Error: ${error.name} | ${error.message}`)
        // }finally{
             setIsLoggingOn(false) //loading stops no matter what
        // }
        const response = await login(email, password)
        if (!response.success) {
            setAuthError(response.error)
        }

    }

    return(
        <div>
            
            {authError && <p>{authError}</p>} 
            {/* // form - just runs the function, nothing displays */}
            {/* <form onSubmit={handleSubmit}>  // ← action only!
            // authError - displays the RESULT of what handleSubmit did
            {authError && <p>{authError}</p>}  // ← shows text on screen! */}
            {/* handleSubmit runs → success → authError stays empty → nothing shows */}
            {/* handleSubmit runs → fails → setAuthError("failed!") → authError shows error message */}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" >Email</label>
                    <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event)=>setEmail(event.target.value)}
                    required />
                    
                    
                    <label htmlFor="password">Password</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event)=>setPassword(event.target.value)}
                    required />
                    
                    <button 
                    type="submit" 
                    disabled={isLoggingOn}>{isLoggingOn ?  "Logging in ..." : "Submit"}
                    </button> 
                    {/* disabled=false means disabled off =clickable, when it is true disabled on=unclickable */}
                    {/* user clicks button:→ isLoggingOn(false)-> setIsLoggingOn(true)
                    → disabled={true} → UNCLICKABLE 🔒 */}
              
            </form>
        </div>
    )
 
}