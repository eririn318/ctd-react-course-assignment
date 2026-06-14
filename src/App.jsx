import "./App.css";

import { Routes, Route } from "react-router";
import Homepage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import TodosPage from "./pages/TodosPage.jsx";
import Header from "./shared/Header.jsx";

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 antialiased">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <Header />
        <main className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/todos"
              element={
                <RequireAuth>
                  <TodosPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />

            {/* The path * tells React Router: "If the URL doesn't match any of the routes above, show this page." */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
export default App;

// before click:
// isCompleted: false → !false = true  → shows in list ✅

// after click:
// isCompleted: true  → !true  = false → hidden from list ✅
