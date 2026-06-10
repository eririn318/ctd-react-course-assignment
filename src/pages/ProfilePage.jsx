import {useState, useEffect} from "react"
import {useAuth} from "../contexts/AuthContext.jsx"
export default function ProfilePage() {
    const {user, token} = useAuth()
    const [todoStats, setTodoStats] =useState({total:0, completed:0, active:0})
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
         
        async function fetchStats() {
            if (!token) return; // ✅ stop early if no token
            try{
                setLoading(true)//start loading
                setError('')

        const options = {
                method: 'GET',
                headers: { 'X-CSRF-TOKEN': token },
                credentials: 'include',
            };

              const response = await fetch('/api/tasks', options)

              if(response.status ===401){
                throw new Error("Unauthorized")
              }
              if (!response.ok){
                throw new Error("Failed to fetch statistics")
              }

              const data = await response.json()
            
                const todos = data.tasks

              //calculate statistics
              const total = todos.length
              const completed = todos.filter((todo) => todo.isCompleted).length
              const active = total - completed

              setTodoStats({total, completed, active})
            }catch(err){
                //any kind of error--ex network error,code error,logic error,etc
                    setError(`Error loading statistics: ${err.message}`)
            }finally{
                setLoading(false) //stop loading
            }
        }
        if (token) fetchStats()  //if token is true, fetch statistics data
    },[token])

    if (loading) return <p>Loading</p> //if loading, display Loading
    if (error) return <p style={{ color: "red" }}>Error: {error}</p> //if error, display error

    return(
        <div style={{ padding: "2rem" }}>
            <h1>User Profile</h1>
            <section>
{/* Optional chaining (?.)
user?.name
Means:
“If user exists, get name. If not, don’t crash.”
So:
user = null → returns undefined (no crash)
user = {name:"John"} → returns "John" */}


{/* || "User"
This is fallback:
user?.name || "User"
Means:
“If name is missing → show "User"” */}

                <p>Username: {user?.name || "User"}</p>
                <p>Email: {user?.email || "no email"}</p>
            </section>

            <section style={{ marginTop: "2rem" }}>
                <h2>Your Todo Statistics</h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={statBox}>
                    <h3>{todoStats.total}</h3>
                    <p>Total Tasks</p>
                    </div>
                <div style={statBox}>
                    <h3>{todoStats.completed}</h3>
                    <p>Completed</p>
                </div>
                <div style={statBox}>
                    <h3>{todoStats.active}</h3>
                    <p>Active</p>
                </div>
                </div>

            </section>

        </div>
    )
}
const statBox = {
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "8px",
  textAlign: "center",
  minWidth: "100px"
};



// Why ProfilePage uses user at all
// Profile page is just:
// “show data about the logged-in user”
// So it uses:
// user = {
//   name,
//   email}

// UserProfile (ProfilePage) shows:

// It displays information about the currently logged-in user, usually like:
// <p>Username: {user?.name}</p>
// <p>Email: {user?.email}</p>

// So it shows:
// 👤 name (who you are)
// 📧 email (your account info)

// Where that data comes from?
// It comes from your AuthContext:
// user = {
//   name: "John",
//   email: "john@email.com"
// }

// So ProfilePage just reads it:
// const { user } = useAuth();


// 🔥 Simple mental model
// Login page → creates user data
// AuthContext → stores user data
// Profile page → displays user data