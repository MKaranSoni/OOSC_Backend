import { useState } from "react";
import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import "./App.css";
import Dashboard from "./components/Dashboard";
import ResultsPage from "./components/ResultsPage";
import { useHealth } from "./hooks/useHealth";

type BackendStatus = "checking" | "connected" | "offline";

function AppContent() {
  const { status: healthStatus } = useHealth();
  const backendStatus: BackendStatus =
    healthStatus === "up"
      ? "connected"
      : healthStatus === "down"
      ? "offline"
      : "checking";

  const [createdSuiteId, setCreatedSuiteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={19} strokeWidth={2} />
          </div>
          <div>
            <div className="brand-name">RELIABILITY</div>
            <div className="brand-subtitle">ENGINE</div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>
          <nav>
            <button
              className={`sidebar-item ${location.pathname === "/" ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button className="sidebar-item">
              <Activity size={18} />
              <span>Test Runs</span>
            </button>

            <button
              className={`sidebar-item ${
                location.pathname.startsWith("/results") ? "active" : ""
              }`}
              onClick={() => {
                if (createdSuiteId) navigate(`/results/${createdSuiteId}`);
              }}
            >
              <BarChart3 size={18} />
              <span>Results</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <div className="engine-version">
            <span>Reliability Engine</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                backendStatus={backendStatus}
                setCreatedSuiteId={setCreatedSuiteId}
                createdSuiteId={createdSuiteId}
              />
            }
          />
          <Route path="/results/:suiteId" element={<ResultsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;