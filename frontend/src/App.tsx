import { ClarificationBanner, ErrorBanner } from "./components/StatusBanners";
import { useAppSelector } from "./app/hooks";
import { InsightsPanel } from "./features/insights/InsightsPanel";
import { RequestForm } from "./features/request/RequestForm";
import "./App.css";

function App() {
  const session = useAppSelector((state) => state.session);

  return (
    <main className="app-shell">
      <header>
        <h1>AI Insights Console</h1>
        <p>Submit a prompt and review the insights returned by the middleware API.</p>
      </header>

      <RequestForm />

      {session.status === "needs_clarification" && session.message && (
        <ClarificationBanner message={session.message} />
      )}

      {session.status === "error" && session.message && (
        <ErrorBanner errorCode={session.errorCode} message={session.message} />
      )}

      {session.status === "success" && session.contextId && (
        <InsightsPanel contextId={session.contextId} />
      )}
    </main>
  );
}

export default App;
