import { createContext, useContext, useState } from "react";

// creates an empty context "container"
// that can hold auth data (token, email etc)
const AuthContext = createContext();

// creates a custom hook
// any component can call useAuth()
// to get auth data
export function useAuth() {
  // reads whatever is inside AuthContext
  // like opening the box
  // and reading what's inside
  const context = useContext(AuthContext);

  // if context is empty → throw error!
  // this means component is trying to use auth
  // but is NOT inside AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  //Get the value from AuthContext and return it.
  return context;
}
//AuthContext stores the auth data, and useAuth() is a helper that lets you use that data anywhere inside components wrapped by the Provider

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [user,setUser] = useState(null)

  const login = async function login(email, password) {
    try {
      const response = await fetch("/api/users/logon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200 && data.name && data.csrfToken) {
        // onSetEmail(data.name)
        // onSetToken(data.csrfToken)
        setEmail(data.name);
        setToken(data.csrfToken);

         setUser({
          name: data.name,
          email: data.email, // only works if backend actually sends it
        });
        
        // I create an object with one key: success
        return { success: true }; //login success
      } else {
        //instead of calling setAuthError inside login, we return the success and error to the component.(success: & error:)
        return {
          // I create an object with two keys: success & error
          success: false, //login fail
          error: `Authentication failed: ${data?.message}`,
        };
      }
    } catch (error) {
      return {
        //I create an object with two keys: success & error
        success: false, //login fail
        error: `"Network error": ${error.name} | ${error.message}`,
      };
    }
  };


const logout = async function logout() {
    // clear state whether success or fail!
    if (!token) {
      // token = "abc123" → logged in ✅
      // token = "" → logged out ❌
      setEmail(""); //← clear email/remove user identity
      setToken(""); //← clear token/remove login session
      return {
        success: true,
        error: "", // clear UI message
      };
    }
    try {
      const response = await fetch("/api/users/logoff", {
        //POST /api/users/logoff in backend
        // 1. check user session / cookie
        // 2. verify CSRF token
        // 3. destroy session OR invalidate token
        // 4. clear cookie
        // 5. return response
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token, //proves request is valid (security check)/Is this real user request or fake request?
        },
        credentials: "include", //cookie
      });

      if (response.status === 200) {
        //just check status, if fetch success, /api/users/logoff runs and successfully logout
        // onSetEmail(data.name)
        // onSetToken(data.csrfToken)

        // clear state ALWAYS
        // token = "abc123" → logged in ✅
        // token = "" → logged out ❌
        setEmail(""); // ← clear email/remove user identity
        setToken(""); // ← clear token/remove login session

        // I create an object with two keys: success & error
        return {
          success: true, //logout success
          error: "", //clear UI message/ even after logout, error message is still there will look weird, so clear the error message
        };
      } else {
        //instead of calling setAuthError inside login, we return the success and error to the component.(success: & error:)
        return {
          // I create an object with two keys: success & error
          success: false, //logout fail
          error: "Logout failed",
        };
      }
    } catch (error) {
      // clear state even on error!
      setEmail("");
      setToken("");
      return {
        //I create an object with two keys: success & error
        success: false, //logout fail
        error: error.message,
      };
    }
  };

  const value = {
    //data you want to share
    user,
    email,
    token,
    isAuthenticated: !!token, //"If there is a token, the user is logged in."
    //token = "" !!token // false,
    //token = "abc123" !!token // true
    login,
    logout,
  };



  // 1. You click logout
  // 2. Browser sends:
  //    - cookies (credentials: include)
  //    - CSRF token (X-CSRF-TOKEN)

  // 3. Server checks:
  //    - Is cookie valid?
  //    - Is token valid?

  // 4. Server responds:
  //    - 200 OK → logout success
  //    - 400/401 → logout failed

  // Everything inside AuthProvider becomes children.
  {
    /* ex:
<AuthProvider>
  <App />
</AuthProvider> */
  }
  // children === <App />
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// AuthProvider
// │
// ├── token
// ├── email
// ├── login()
// ├── logout()
// └── isAuthenticated

// and every child component can access them.

// 1. In Provider
// <AuthContext.Provider value={value}>

// You put your data here:

// value = {
//   email,
//   token,
//   login,
//   logout,
//   isAuthenticated,
// }
// 2. In any component
// const auth = useAuth();

// Now:

// auth === value
// So you use it like this:
// auth.email
// auth.token
// auth.isAuthenticated
// auth.login()
// auth.logout()
// Simple way to remember
// value = what you give in the Provider
// auth = what you receive in components

// You use value through auth.
// 👉 value is stored in Context, and auth is how you access that same value anywhere in your app.
