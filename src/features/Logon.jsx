import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function validateLogin(email, password) {
  const errors = [];
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.push("Email is required.");
  }
  if (!password) {
    errors.push("Password is required");
  }
  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (trimmedEmail && !trimmedEmail.includes("@")) {
    errors.push("Invalid email format");
  }

  return {
    errors,
    isValid: errors.length === 0,
    // isValid: true / false
    // true → input is OK
    // false → input has problems

    //if errors.length === 0, isValid = true, then I will use this for validation->
    // then I will use this for validation->
    // ex: if (!result.isValid) {
    // setAuthError(result.errors[0])
  };
}
// export default function Logon({onSetEmail=()=>{}, onSetToken = () => {}}) {
export default function Logon() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(""); //setAuthError uses error: in AuthContext
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const { login } = useAuth();
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true); //loading starts

    //===validation===
    const { isValid, errors } = validateLogin(email, password); //from -> function validateLogin(email, password)
    if (!isValid) {
      setAuthError(errors[0]);
      setIsLoggingOn(false);
      return;
    }

    const cleanEmail = email.trim(); //sanitize email only, not password, because password should not be changed(sanitized)

    const response = await login(cleanEmail, password);
    if (!response.success) {
      setAuthError(response.error);
    }
    setIsLoggingOn(false); //loading stops no matter what
  }

  return (
    <div>
      {authError && <p>{authError}</p>}
      {/* // form - just runs the function, nothing displays */}
      {/* <form onSubmit={handleSubmit}>  // ← action only!
            authError - displays the RESULT of what handleSubmit did
            {authError && <p>{authError}</p>}  // ← shows text on screen! */}
      {/* handleSubmit runs → success → authError stays empty → nothing shows */}
      {/* handleSubmit runs → fails → setAuthError("failed!") → authError shows error message */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={20}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          maxLength={20}
          required
        />

        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? "Logging in ..." : "Submit"}
        </button>
        {/* disabled=false means disabled off =clickable, when it is true disabled on=unclickable */}
        {/* user clicks button:→ isLoggingOn(false)-> setIsLoggingOn(true)
                    → disabled={true} → UNCLICKABLE 🔒 */}
      </form>
    </div>
  );
}
