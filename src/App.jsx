import "./App.css";
import TodosPage from "./features/Todos/TodosPage.jsx"
import Header from "./shared/Header.jsx"
import Logon from "./features/Logon.jsx"
import {useState} from "react"


function App() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  return (
    <div>
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail}/>
      {token ? 
      <TodosPage token={token}/> :
      <Logon onSetEmail={setEmail} onSetToken={setToken}/>}
    </div>
  
  )

  }
export default App;



// before click:
// isCompleted: false → !false = true  → shows in list ✅

// after click:
// isCompleted: true  → !true  = false → hidden from list ✅

// ! flips it:
// false → !false = true  → display
// true  → !true  = false → hide
// click makes it true, then ! flips it to false so filter removes it! 