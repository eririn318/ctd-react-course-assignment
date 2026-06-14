import "./App.css";

// import {useState} from "react"
// import { useAuth } from "./contexts/AuthContext.jsx";
import {Routes, Route} from "react-router-dom"
import Homepage from "./pages/HomePage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import LoginPage from "./pages/LoginPage.jsx" 
import NotFoundPage from "./pages/NotFoundPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import RequireAuth from "./components/RequireAuth.jsx"
import TodosPage from "./pages/TodosPage.jsx"
import Header from "./shared/Header.jsx"
// import Logon from "./features/Logon.jsx"




function App() {
  // const [email, setEmail] = useState("")
  // const [token, setToken] = useState("")
  // const {token} = useAuth()


  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>

        <Route path="/todos" element={
          <RequireAuth><TodosPage/></RequireAuth>}/>

        <Route path="/profile" element={
          <RequireAuth><ProfilePage/></RequireAuth>}/>

        {/* The path * tells React Router: "If the URL doesn't match any of the routes above, show this page." */}
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      {/* {token ? 
      <TodosPage/> :
      <Logon/>} */}
    </div>
  
  )

  }
export default App;



// before click:
// isCompleted: false → !false = true  → shows in list ✅

// after click:
// isCompleted: true  → !true  = false → hidden from list ✅


