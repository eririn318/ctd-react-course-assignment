export default function AboutPage() {

    return(
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h1>About Page</h1>
            <p>Welcome to our task management platform. This application is designed to help you 
        stay organized, track your daily responsibilities, and maintain focus on your goals.</p>
        <section style={{ marginTop: "2rem" }}>
            <h2>Core Features</h2>
            <ul>
                <li><strong>Task Management:</strong> Create, edit, and delete todos with ease.</li>
                <li><strong>Priority Levels:</strong> Set priority to keep track of what matters most.</li>
                <li><strong>Completion Tracking:</strong> Toggle task status to mark items as done.</li>
                <li><strong>Secure Auth:</strong> Protect your data with custom authentication logic.</li>
            </ul>
        </section>

        <section style={{ marginTop: "2rem" }}>
            <h2>Built With</h2>
            <ul>
                <li><strong>React:</strong> Powering the dynamic user interface.</li>
                <li><strong>React Router:</strong> Managing seamless navigation between pages.</li>
                <li><strong>Vite:</strong> Providing a fast and modern build experience.</li>
                <li><strong>Context API:</strong> Handling global authentication state across the app.</li>
            </ul>
        </section>
        </div>
    )
}