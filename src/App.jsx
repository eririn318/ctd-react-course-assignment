import "./App.css";
import TodosPage from "./features/Todos/TodosPage.jsx"
import Header from "./shared/Header.jsx"
import Logon from "./features/Logon.jsx"
// import {useState} from "react"
import { useAuth } from "./contexts/AuthContext.jsx";


function App() {
  // const [email, setEmail] = useState("")
  // const [token, setToken] = useState("")
   const {token} = useAuth()


  return (
    <div>
      <Header/>
      {token ? 
      <TodosPage/> :
      <Logon/>}
    </div>
  
  )

  }
export default App;



// before click:
// isCompleted: false → !false = true  → shows in list ✅

// after click:
// isCompleted: true  → !true  = false → hidden from list ✅


