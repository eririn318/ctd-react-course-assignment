import { Link } from "react-router";
export default function NotfoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1 className="text-4xl font-black tracking-tight text-red-600 sm:text-5xl">
        404 error
      </h1>
      <h2 className="text-lg font-bold text-slate-700 mt-3 mb-15">
        Page not found
      </h2>

      <div style={{ marginTop: "2rem" }}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Link
            to="/"
            className="h-10 w-30 px-4 inline-flex items-center justify-center text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            Home page
          </Link>
          <Link
            to="/login"
            className="h-10 w-30 px-4 inline-flex items-center justify-center text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            Login page
          </Link>
          <Link
            to="/about"
            className="h-10 w-30 px-4 inline-flex items-center justify-center text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            About page
          </Link>
        </nav>
      </div>
    </div>
  );
}
