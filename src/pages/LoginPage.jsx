import {useState, useEffect} from "react"
import {useNavigate, useLocation} from "react-router"
import {useAuth} from "../contexts/AuthContext.jsx"
// export default function Logon({onSetEmail=()=>{}, onSetToken = () => {}}) {
    export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [authError, setAuthError] = useState("") //setAuthError uses error: in AuthContext
    const [isLoggingOn, setIsLoggingOn] = useState(false)

    const {login, isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Get intended destination from location state, default to /todos
        // Scenario: A logged-out user tries to go directly to http://localhost:3000/todos/edit/5.
        // Your security route guard stops them and says: "Hey, you aren't logged in! I am kicking you to /login. But I'm going to attach a sticky note to your history state that says: from: { pathname: "/todos/edit/5" } so we don't forget where you wanted to go."
        // The Code's Job: This line reads that sticky note.
        // If the sticky note exists, from becomes "/todos/edit/5".
        // If there is no sticky note (the user just clicked "Login" manually from the home page), the || "/todos" fallback kicks in, and from becomes "/todos".
    const from = location.state?.from?.pathname || "/todos"

    useEffect(()=>{
        if(isAuthenticated){//if there is no token
        // It navigates to whatever string variable is stored inside from (which, as we just saw, will either be their specific bookmarked link or the default "/todos" dashboard).
        // it uses { replace: true }, it swaps the /login card in the browser history with the new page, ensuring they don't get trapped if they hit the back arrow.
        //What happens when they click the Back Arrow?
            // Because /login was completely removed from the history stack, the browser skips right over it:
            // They go back to: The About Page (/about)—the exact place they were standing before the login flow started!
            // They do NOT go back to: The Login Page.
            navigate(from, {replace:true})
        }
    },[isAuthenticated, navigate, from])//Watch these three variables. If any of them change, re-run the effect.
    // why from is in dependency->React requires any variable used inside a useEffect to be included in the dependency array to ensure the code always reads the freshest,
    async function handleSubmit(event) {
        event.preventDefault()
            setAuthError("") //It resets the authError state variable to an empty string.
                             // In React, authError is usually used to store a message like "Invalid password" or "User not found". By calling setAuthError(""), you are telling React: "Clear out any previous error message from the screen."
            setIsLoggingOn(true) //Turn on loading indicator
            
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
            //  setIsLoggingOn(false) //loading stops no matter what
        // }
        try{
            // This calls the Context
             const response = await login(email, password)
        if (!response.success) {
           setAuthError(response.error); // Handles known errors (e.g., "Wrong password") /UI Logic: Handle the success/error from the Context
        }
        }catch(error){
            // Catches unexpected network/server crashes!// This catches "unforeseen" UI crashes
             setAuthError(`Network error: ${error.message}`)
        }finally{
            setIsLoggingOn(false) //loading stops no matter what
        }
    }

    return(
<div className="max-w-l mx-auto mt-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-300 ease-out opacity-100">            
    {authError && 
    <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium mb-4 transition-all">
        {authError}
    </div>} 
           <h2 className="text-xl font-bold text-slate-900 mb-5">Sign In</h2>
           
           {/* // form - just runs the function, nothing displays */}
            {/* <form onSubmit={handleSubmit}>  // ← action only!
            // authError - displays the RESULT of what handleSubmit did
            {authError && <p>{authError}</p>}  // ← shows text on screen! */}
            {/* handleSubmit runs → success → authError stays empty → nothing shows */}
            {/* handleSubmit runs → fails → setAuthError("failed!") → authError shows error message */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                <label 
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 "
                 >Email</label>
                    <input 
                    className="h-11 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event)=>setEmail(event.target.value)}
                    required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                    <input
className="h-11 px-3 border border-slate-200 rounded-lg text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all duration-200"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event)=>setPassword(event.target.value)}
                    required />
                    </div>
                    <button 
                    className="w-full h-11 flex items-center justify-center font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200 mt-2"
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



// The "Double Try/Catch" Strategy
// It is not redundant; it is layered security. Think of it like this:
// The AuthContext (The Internal Try/Catch):
// This is responsible for the API request itself.
// If the server is reachable, but the password is wrong, the API returns a response. Your AuthContext catches that and returns { success: false, error: "Invalid password" }.
// Result: The Context has successfully handled the "known" business logic error.

// The LoginPage (The UI/Network Safety Net):
// This is responsible for the user's experience and catastrophic failures.
// What happens if the user's Wi-Fi cuts out in the middle of the request? The AuthContext might crash before it even finishes!
// The try/catch in your LoginPage catches that "lost connection" crash, stops the loading spinner (finally), and shows a user-friendly message like "Network error, please try again."

//{ replace: true } to ensure users don't get trapped by the back button.