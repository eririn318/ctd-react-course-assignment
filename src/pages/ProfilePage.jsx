import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { isTodoCompleted } from "../utils/todoStatus.js";
export default function ProfilePage() {
  const { user, token } = useAuth();
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return; // ✅ stop early if no token
      try {
        setLoading(true); //start loading
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };

        const params = new URLSearchParams({ limit: "1000" });
        const response = await fetch(`/api/tasks?${params}`, options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const result = await response.json();

        // If result is a direct array, use it. If it's an object with .tasks, use that!
        const todos = Array.isArray(result) ? result : result.tasks || [];

        //calculate statistics
        const total =
          result.total ??
          result.totalCount ??
          result.count ??
          result.meta?.total ??
          result.meta?.totalCount ??
          result.pagination?.total ??
          result.pagination?.totalCount ??
          todos.length;
        const completed = todos.filter((todo) => isTodoCompleted(todo)).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        //any kind of error--ex network error,code error,logic error,etc
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false); //stop loading
      }
    }
    if (token) fetchStats(); //if token is true, fetch statistics data
  }, [token]);

  if (loading)
    return (
      <div className="text-center py-12 text-slate-400 animate-pulse">
        <span className="block text-3xl mb-2">⏳</span>
        <p className="text-sm font-medium">Loading...</p>
      </div> //if loading, display Loading
    );

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>; //if error, display error

  return (
    <div style={{ padding: "2rem" }}>
      <div className="bg-white w-50 border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
        <h1 className="text-2xl font-black text-slate-700">User Profile</h1>
      </div>
      <section className="text-sm text-slate-600 space-y-0.5 mt-5">
        {/* Optional chaining (?.)
            user?.name
            Means:
            “If user exists, get name. If not, don’t crash.”
            So:
            user = null → returns undefined (no crash)a
            user = {name:"John"} → returns "John" */}

                    {/* || "User"
            This is fallback:
            user?.name || "User"
            Means:
            “If name is missing → show "User"” */}

        <p>
          <strong>Username: </strong> {user?.name || "User"}
        </p>
        <p>
          <strong>Email: </strong>
          {user?.email || "no email"}
        </p>
      </section>

      <hr className="border-slate-700 mt-6 mb-18 " />

      <section style={{ marginTop: "2rem" }}>
        <h2 className="text-l font-bold uppercase tracking-wider text-slate-700 mb-5">
          Your Todo Statistics
        </h2>
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
  );
}
const statBox = {
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "8px",
  textAlign: "center",
  minWidth: "100px",
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
