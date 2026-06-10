import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
export default function Header() {
  const { isAuthenticated, email } = useAuth(); //get value from AuthContext
  return (
    <header>
      <h1>Todo List</h1>

      <Navigation/>
      
      {isAuthenticated ? (
        <div>
          <span> Welcome, {email}</span>
          <Logoff />
        </div>
      ) : (
        <div>
          <span>Please login</span>
        </div>
      )}
    </header>
  );
}
