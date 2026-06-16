import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";
export default function Navigation() {
  const { isAuthenticated } = useAuth();
  // Helper function to define style based on active state
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal", //if active, bold
    textDecoration: isActive ? "underline" : "none", //if active, underline
    color: "#333",
  });
  return (
    <nav>
      <ul
        className="px-5"
        style={{ listStyle: "none", display: "flex", gap: "1rem" }}
      >
        <li>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
        </li>

        {/* if authenticated */}
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" style={navLinkStyle}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" style={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          // {/* if not authenticated, go to login page */}
          <li>
            <NavLink to="/login" style={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
