<<<<<<< HEAD
import { useState } from "react";
=======
 export default App;

import { useEffect, useRef, useState } from "react";
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
import {
  Activity,
  BarChart3,
<<<<<<< HEAD
  LayoutDashboard,
  Settings,
  ShieldCheck,
  TestTube2,
=======
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clipboard,
  FlaskConical,
  LayoutDashboard,
  Play,
  Settings,
  ShieldCheck,
  TestTube2,
  XCircle,
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
} from "lucide-react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import "./App.css";
import Dashboard from "./components/Dashboard";
import ResultsPage from "./components/ResultsPage";
import { useHealth } from "./hooks/useHealth";

type BackendStatus = "checking" | "connected" | "offline";

<<<<<<< HEAD
function AppContent() {
  const { status: healthStatus } = useHealth();
  const backendStatus: BackendStatus = healthStatus === 'up' ? 'connected' : healthStatus === 'down' ? 'offline' : 'checking';
  const [createdSuiteId, setCreatedSuiteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
=======
function App() {
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>("checking");

  const [showCreateSuite, setShowCreateSuite] = useState(false);

  const [createdSuiteId, setCreatedSuiteId] =
    useState<string | null>(null);

  const resultsRef = useRef<HTMLElement | null>(null);


  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        setBackendStatus("connected");
      } catch {
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  const handleSuiteCreated = (suiteId: string) => {
    setCreatedSuiteId(suiteId);
    setShowCreateSuite(false);
  };
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };



  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={19} strokeWidth={2} />
          </div>
<<<<<<< HEAD
          <div>
            <div className="brand-name">RELIABILITY</div>
            <div className="brand-subtitle">ENGINE</div>
=======

          <div className="brand-text">
            <div className="brand-name">Reliability</div>
            <div className="brand-subtitle">Engine</div>
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>
          <nav>
<<<<<<< HEAD
            <button 
              className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => navigate('/')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              className="sidebar-item"
              onClick={() => navigate('/')}
=======
            <button
              type="button"
              className="sidebar-item active"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </button>

<<<<<<< HEAD
            <button 
              className="sidebar-item"
            >
              <Activity size={18} />
              <span>Test Runs</span>
            </button>

            <button 
              className={`sidebar-item ${location.pathname.startsWith('/results') ? 'active' : ''}`}
              onClick={() => {
                if (createdSuiteId) navigate(`/results/${createdSuiteId}`);
              }}
            >
              <BarChart3 size={18} />
=======
           <button
             type="button"
             className="sidebar-item"
             onClick={() => {
               alert("NEW TEST SUITE CLICKED");
               console.log("NEW TEST SUITE CLICKED");
               setShowCreateSuite(true);
             }}
           >
             <TestTube2 size={17} />
             <span>New Test Suite</span>
           </button>

            <button
              type="button"
              className="sidebar-item"
             onClick={() =>
               document
                 .querySelector(".analytics-grid")
                 ?.scrollIntoView({
                   behavior: "smooth",
                   block: "start",
                 })
             }
            >
              <Activity size={17} />
              <span>Test Runs</span>
            </button>

            <button
              type="button"
              className="sidebar-item"
              onClick={scrollToResults}
            >
              <BarChart3 size={17} />
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
              <span>Results</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
<<<<<<< HEAD
          <button className="sidebar-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
=======
          <button
            type="button"
            className="sidebar-item"
            onClick={() => {
              document
                .querySelector(".footer")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>

>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
          <div className="engine-version">
            <span>Reliability Engine</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
<<<<<<< HEAD
        <Routes>
          <Route path="/" element={<Dashboard backendStatus={backendStatus} setCreatedSuiteId={setCreatedSuiteId} createdSuiteId={createdSuiteId} />} />
          <Route path="/results/:suiteId" element={<ResultsPage />} />
        </Routes>
=======
        {/* HEADER */}

        <header className="topbar">
          <div>
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <span>Dashboard</span>
            </div>

            <h1>Reliability Engine</h1>

            <p>
              Reliability testing and evaluation for AI agent
              systems.
            </p>
          </div>

          <div
            className={`backend-status ${backendStatus}`}
            title={`API: ${API_BASE_URL}`}
          >
            <span className="status-dot" />

            {backendStatus === "checking" &&
              "Checking API"}

            {backendStatus === "connected" &&
              "API connected"}

            {backendStatus === "offline" &&
              "API unavailable"}
          </div>
        </header>

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <FlaskConical size={14} />
              RELIABILITY TESTING
            </div>

            <h2>
              Evaluate agent behavior
              <br />
              before it reaches production.
            </h2>

            <p>
              Define structured test scenarios, execute evaluations,
              and inspect reliability results from a single
              workspace.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="sandbox-btn sandbox-btn-primary"
                onClick={() => setShowCreateSuite(true)}
              >
                <Play size={16} />
                Create Test Suite
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="sandbox-btn sandbox-btn-secondary"
                onClick={scrollToResults}
              >
                View Results
              </button>
            </div>
          </div>

          {/* HERO SYSTEM STATUS */}

          <div className="hero-visual">
            <div className="visual-grid" />

            <div className="agent-card">
              <div className="agent-card-header">
                <div className="agent-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <span className="agent-label">
                    EVALUATION SYSTEM
                  </span>

                  <strong>
                    Reliability Test Environment
                  </strong>
                </div>

                <div className="live-indicator">
                  <span />
                  {backendStatus === "connected"
                    ? "ONLINE"
                    : backendStatus === "checking"
                      ? "CHECKING"
                      : "OFFLINE"}
                </div>
              </div>

              <div className="evaluation-line">
                <div>
                  <span>API</span>

                  <strong>
                    {backendStatus === "connected"
                      ? "Connected"
                      : backendStatus === "checking"
                        ? "Checking"
                        : "Unavailable"}
                  </strong>
                </div>

                <div>
                  <span>Test Suites</span>

                  <strong>
                    {createdSuiteId
                      ? "Available"
                      : "None created"}
                  </strong>
                </div>

                <div>
                  <span>Evaluation Data</span>

                  <strong className="muted">
                    Awaiting test run
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM OVERVIEW */}

        <section className="section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                SYSTEM
              </span>

              <h3>System Overview</h3>
            </div>
          </div>

          <div className="status-grid">
            <StatusCard
              icon={<FlaskConical size={18} />}
              title="Test Engine"
              status="Available"
              description="Create a test suite to configure reliability scenarios."
              type="success"
            />

            <StatusCard
              icon={<Activity size={18} />}
              title="Backend API"
              status={
                backendStatus === "connected"
                  ? "Connected"
                  : backendStatus === "checking"
                    ? "Checking"
                    : "Unavailable"
              }
              description="Current connectivity status of the Spring Boot API."
              type={
                backendStatus === "connected"
                  ? "success"
                  : backendStatus === "offline"
                    ? "danger"
                    : "warning"
              }
            />

            <StatusCard
              icon={<BarChart3 size={18} />}
              title="Evaluation Results"
              status={
                createdSuiteId
                  ? "Awaiting execution"
                  : "No data"
              }
              description={
                createdSuiteId
                  ? "Run the configured suite to produce real evaluation data."
                  : "Results will appear after a reliability test has been executed."
              }
              type="warning"
            />
          </div>
        </section>

        {/* CREATE WORKSPACE */}

        <section className="workspace-card">
          <div className="workspace-icon">
            <TestTube2 size={21} />
          </div>

          <div className="workspace-content">
            <span className="section-kicker">
              TEST WORKSPACE
            </span>

            <h3>
              Start a reliability evaluation
            </h3>

            <p>
              Configure the agent, define its system prompt and
              tools, then execute a structured test suite.
            </p>
          </div>

          <button
            type="button"
            className="sandbox-btn sandbox-btn-primary"
            onClick={() => setShowCreateSuite(true)}
          >
            <TestTube2 size={16} />
            Create Test Suite
            <ArrowRight size={16} />
          </button>
        </section>

        {/* CREATED SUITE */}

        {createdSuiteId && (
          <section className="created-suite-card">
            <div className="created-suite-icon">
              <CheckCircle2 size={19} />
            </div>

            <div className="created-suite-content">
              <span className="section-kicker">
                TEST SUITE
              </span>

              <h3>Suite created successfully</h3>

              <p>
                The backend returned the following suite
                identifier:
              </p>

              <code>{createdSuiteId}</code>
            </div>

            <button
              type="button"
              className="sandbox-btn sandbox-btn-ghost sandbox-btn-small"
              onClick={() =>
                navigator.clipboard.writeText(createdSuiteId)
              }
              title="Copy suite ID"
            >
              <Clipboard size={14} />
              Copy ID
            </button>
          </section>
        )}

        {/* ANALYTICS / RESULTS */}

        <section
          ref={resultsRef}
          className="analytics-grid"
        >
          <EmptyPanel
            icon={<BarChart3 size={20} />}
            title="Reliability Analytics"
            message="No evaluation data available"
            description="Analytics will be generated from completed test runs. No metrics are fabricated when there is no backend result."
            onCreate={() => setShowCreateSuite(true)}
          />

          <EmptyPanel
            icon={<Activity size={20} />}
            title="Recent Test Runs"
            message="No completed test runs"
            description="Completed evaluations will appear here after a test suite has been executed."
            onCreate={() => setShowCreateSuite(true)}
          />
        </section>

        {/* WORKFLOW */}

        <section className="flow-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                WORKFLOW
              </span>

              <h3>
                Configure, execute, analyze
              </h3>
            </div>
          </div>

          <div className="flow-grid">
            <FlowStep
              number="01"
              icon={<Settings size={18} />}
              title="Configure"
              description="Define the agent configuration, system prompt, tools and test parameters."
            />

            <FlowStep
              number="02"
              icon={<Play size={18} />}
              title="Execute"
              description="Run reliability scenarios against the configured agent."
            />

            <FlowStep
              number="03"
              icon={<BarChart3 size={18} />}
              title="Analyze"
              description="Review actual scores, failures and execution traces returned by the system."
            />
          </div>
        </section>

        {/* FOOTER */}

        <footer className="footer">
          <span>Reliability Engine</span>

          <span>
            Agent reliability testing platform
          </span>
        </footer>

        {/* CREATE SUITE MODAL */}

        {showCreateSuite && (
          <CreateSuiteModal
            onClose={() => setShowCreateSuite(false)}
            onCreated={handleSuiteCreated}
          />
        )}
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
      </main>
    </div>
  );
}

<<<<<<< HEAD
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
=======
/* SIDEBAR ITEM */

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`sidebar-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* STATUS CARD */

function StatusCard({
  icon,
  title,
  status,
  description,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  description: string;
  type: "success" | "warning" | "danger";
}) {
  return (
    <div className="status-card">
      <div className="status-card-top">
        <div className="status-icon">
          {icon}
        </div>

        <span className={`status-badge ${type}`}>
          {type === "success" && (
            <CheckCircle2 size={12} />
          )}

          {type === "warning" && (
            <CircleAlert size={12} />
          )}

          {type === "danger" && (
            <XCircle size={12} />
          )}

          {status}
        </span>
      </div>

      <h4>{title}</h4>

      <p>{description}</p>
    </div>
  );
}

/* EMPTY PANEL */

function EmptyPanel({
  icon,
  title,
  message,
  description,
  onCreate,

}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  description: string;
  onCreate: () => void;

}) {
  return (
    <div className="empty-panel">
      <div className="empty-icon">
        {icon}
      </div>

      <div>
        <span className="section-kicker">
          DATA
        </span>

        <h3>{title}</h3>
      </div>

      <div className="empty-content">
        <strong>{message}</strong>

        <p>{description}</p>
      </div>

      <button
        type="button"
        className="sandbox-btn sandbox-btn-ghost sandbox-btn-small"
        onClick={onCreate}
      >
        Create Test Suite
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* FLOW STEP */

function FlowStep({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flow-step">
      <div className="flow-number">
        {number}
      </div>

      <div className="flow-icon">
        {icon}
      </div>

      <h4>{title}</h4>

      <p>{description}</p>
    </div>
>>>>>>> 8fc1dd90d27e8fc7be2e64f12693acebc03ecabf
  );
}

export default App;