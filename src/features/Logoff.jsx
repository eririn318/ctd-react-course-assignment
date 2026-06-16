import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router";

export default function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOff, setIsLoggingOff] = useState(false);

  async function handleLogout() {
    setIsLoggingOff(true);
    setLogoutError("");

    const response = await logout();
    if (response.success) {
      navigate("/login");
    } else {
      setIsLoggingOff(false);
      setLogoutError(response.error);
    }
  }
  return (
    <div className="pb-5">
      {/* when it become {"Logout failed" && <p>{logoutError}</p>} after line 13 setLogoutError("Logout failed")->then logoutError will become error message too*/}
      {logoutError && <p>{logoutError}</p>}
      <button
        onClick={handleLogout}
        className="h-9 px-3.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/20 active:bg-red-100"
      >
        logoff
      </button>
    </div>
  );
}
