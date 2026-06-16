export default function AboutPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        About Page
      </h1>
      <p className="text-base text-slate-500 leading-relaxed mt-7 mb-15">
        Welcome to our task management platform. This application is designed to
        help you stay organized, track your daily responsibilities, and maintain
        focus on your goals
      </p>

      <section
        style={{ marginTop: "2rem" }}
        className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm space-y-4"
      >
        <h2 className="text-lg font-bold text-slate-900 tracking-wide uppercase text-md">
          Core Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 ">
          <li>
            <strong>Task Management:</strong> Create, edit, and delete todos
            with ease.
          </li>
          <li>
            <strong>Priority Levels:</strong> Set priority to keep track of what
            matters most.
          </li>
          <li>
            <strong>Completion Tracking:</strong> Toggle task status to mark
            items as done.
          </li>
          <li>
            <strong>Secure Auth:</strong> Protect your data with custom
            authentication logic.
          </li>
        </div>
      </section>
      <section
        style={{ marginTop: "2rem" }}
        className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm space-y-4"
      >
        <h2 className="text-lg font-bold text-slate-900 tracking-wide uppercase text-md">
          Built With
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 ">
          <li>
            <strong>React:</strong> Powering the dynamic user interface.
          </li>
          <li>
            <strong>React Router:</strong> Managing seamless navigation between
            pages.
          </li>
          <li>
            <strong>Vite:</strong> Providing a fast and modern build experience.
          </li>
          <li>
            <strong>Context API:</strong> Handling global authentication state
            across the app.
          </li>
        </div>
      </section>
    </div>
  );
}
