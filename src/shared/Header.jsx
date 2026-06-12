import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
export default function Header() {
  const { isAuthenticated, email } = useAuth(); //get value from AuthContext
  return (
    <header className="w-full bg-white border-b border-slate-200 rounded-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
     <div className="flex items-center gap-6">
          <h1 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
            ⚡ Todo Workspace
          </h1>
          </div>

      <Navigation/>
      </div>
      <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <div className="flex items-center gap-3 text-xs" >
          <span className="md:inline-block font-semibold text-slate-700 pl-5 pb-5"> Welcome, <span className="text-slate-800 font-bold uppercase">{email}</span></span>
          <Logoff />
        </div>
      ) : (
        <div className="h-9 px-3.5 ml-3 mb-3 inline-flex items-center  justify-center text-xs font-bold text-slate-600 bg-slate-50 border border-slate-300 rounded-xl">
          <span>Please Login</span>
        </div>
      )}
      </div>
    </header>
  );
}
