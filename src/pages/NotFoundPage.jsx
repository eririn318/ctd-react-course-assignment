import {Link} from "react-router-dom"
export default function NotfoundPage() {

    return(
        <div style={{ textAlign: "center", padding: "3rem" }}>
        <h1>404 error</h1>
        <h2>Page not found</h2>

        <div style={{ marginTop: "2rem" }}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link to="/">Home page</Link>
        <Link to="/login">Login page</Link>
        <Link to="/about">About page</Link>
        </nav>
        </div>
        </div>
        )
}