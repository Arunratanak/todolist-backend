import { useEffect, useState } from "react";
import "./App.css";
import TaskApp from "./components/taskApp.jsx";
import AuthForm from "./components/AuthForm.jsx";
import { api } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  // When the page loads, ask the server "am I logged in?"
  useEffect(() => {
    api("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null)) // a 401 just means "not logged in"
      .finally(() => setIsCheckingLogin(false));
  }, []);

  async function handleLogout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  // Avoids flashing the login form while we check
  if (isCheckingLogin) {
    return (
      <main className="todo-app">
        <p role="status">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="todo-app auth-page">
        <section className="task-panel">
          <AuthForm onLogin={setUser} />
        </section>
      </main>
    );
  }

  return (
    <main className="todo-app">
      <section className="task-panel" aria-labelledby="task-heading">
        <p>
          Logged in as {user.email}{" "}
          <button type="button" onClick={handleLogout}>Log out</button>
        </p>
        <h2 id="task-heading">All tasks</h2>
        <TaskApp onSessionExpired={() => setUser(null)} />
      </section>
    </main>
  );
}

export default App;