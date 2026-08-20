// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>
//
//       <div className="ticks"></div>
//
//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>
//
//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }
//
// export default App
// function App() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "#0b0f14",
//         color: "#f5f7fa",
//         fontFamily: "Inter, system-ui, sans-serif",
//       }}
//     >
//       <div style={{ textAlign: "center" }}>
//         <h1>Reliability Engine</h1>
//         <p style={{ color: "#9ca3af" }}>
//           Frontend recovery successful.
//         </p>
//       </div>
//     </div>
//   );
// }
//
// export default App;
// import CreateSuiteModal from "./components/CreateSuiteModal";
// import { useEffect, useState } from "react";
// import {
//   Activity,
//   ArrowRight,
//   BarChart3,
//   Bot,
//   CheckCircle2,
//   ChevronRight,
//   CircleAlert,
//   FlaskConical,
//   LayoutDashboard,
//   Play,
//   Settings,
//   ShieldCheck,
//   Terminal,
//   TestTube2,
//   XCircle,
// } from "lucide-react";
// import "./App.css";
//
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
//
// type BackendStatus = "checking" | "connected" | "offline";
//
// function App() {
//     const [showCreateSuite, setShowCreateSuite] = useState(false);
//     const [createdSuiteId, setCreatedSuiteId] = useState<string | null>(null);
//   const [backendStatus, setBackendStatus] =
//     useState<BackendStatus>("checking");
//
//   useEffect(() => {
//     const checkBackend = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/health`);
//
//         if (!response.ok) {
//           throw new Error("Backend unavailable");
//         }
//
//         setBackendStatus("connected");
//       } catch {
//         setBackendStatus("offline");
//       }
//     };
//
//     checkBackend();
//   }, []);
//
//   return (
//     <div className="app-shell">
//       <aside className="sidebar">
//         <div className="brand">
//           <div className="brand-mark">
//             <ShieldCheck size={20} />
//           </div>
//
//           <div>
//             <div className="brand-name">RELIABILITY</div>
//             <div className="brand-subtitle">ENGINE</div>
//           </div>
//         </div>
//
//         <div className="sidebar-section">
//           <span className="sidebar-label">WORKSPACE</span>
//
//           <nav>
//             <SidebarItem
//               icon={<LayoutDashboard size={18} />}
//               label="Dashboard"
//               active
//             />
//
//             <SidebarItem
//               icon={<TestTube2 size={18} />}
//               label="New Test Suite"
//             />
//
//             <SidebarItem
//               icon={<Activity size={18} />}
//               label="Test Runs"
//             />
//
//             <SidebarItem
//               icon={<BarChart3 size={18} />}
//               label="Results"
//             />
//           </nav>
//         </div>
//
//         <div className="sidebar-bottom">
//           <SidebarItem
//             icon={<Settings size={18} />}
//             label="Settings"
//           />
//
//           <div className="engine-version">
//             <span>Reliability Engine</span>
//             <span>v0.1.0</span>
//           </div>
//         </div>
//       </aside>
//
//       <main className="main-content">
//         <header className="topbar">
//           <div>
//             <div className="breadcrumb">
//               Workspace <ChevronRight size={13} /> Dashboard
//             </div>
//
//             <h1>Reliability Engine</h1>
//             <p>AI Agent Reliability Testing</p>
//           </div>
//
//           <div className={`backend-status ${backendStatus}`}>
//             <span className="status-dot" />
//
//             {backendStatus === "checking" && "Checking backend"}
//             {backendStatus === "connected" && "Backend connected"}
//             {backendStatus === "offline" && "Backend unavailable"}
//           </div>
//         </header>
//
//         <section className="hero-section">
//           <div className="hero-copy">
//             <div className="eyebrow">
//               <Terminal size={14} />
//               AI RELIABILITY WORKSPACE
//             </div>
//
//             <h2>
//               Test how reliably
//               <br />
//               your AI agents behave.
//             </h2>
//
//             <p>
//               Evaluate AI agents against structured reliability scenarios
//               and understand where their behavior fails.
//             </p>
//
//             <div className="hero-actions">
//               <button className="primary-button">
//                 <Play size={16} />
//                 Create Test Suite
//                 <ArrowRight size={16} />
//               </button>
//
//               <button className="secondary-button">
//                 View Results
//               </button>
//             </div>
//           </div>
//
//           <div className="hero-visual">
//             <div className="visual-grid" />
//
//             <div className="agent-card">
//               <div className="agent-card-header">
//                 <div className="agent-icon">
//                   <Bot size={21} />
//                 </div>
//
//                 <div>
//                   <span className="agent-label">AGENT</span>
//                   <strong>Reliability Evaluation</strong>
//                 </div>
//
//                 <div className="live-indicator">
//                   <span />
//                   READY
//                 </div>
//               </div>
//
//               <div className="evaluation-line">
//                 <div>
//                   <span>Configuration</span>
//                   <strong>Ready</strong>
//                 </div>
//
//                 <div>
//                   <span>Test Engine</span>
//                   <strong>Standby</strong>
//                 </div>
//
//                 <div>
//                   <span>ML Execution</span>
//                   <strong className="muted">Not connected</strong>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//
//         <section className="section">
//           <div className="section-heading">
//             <div>
//               <span className="section-kicker">SYSTEM</span>
//               <h3>System Overview</h3>
//             </div>
//           </div>
//
//           <div className="status-grid">
//             <StatusCard
//               icon={<FlaskConical size={19} />}
//               title="Test Engine"
//               status="Ready for configuration"
//               description="Configure an agent and prepare a reliability suite."
//               type="success"
//             />
//
//             <StatusCard
//               icon={<Activity size={19} />}
//               title="Backend"
//               status={
//                 backendStatus === "connected"
//                   ? "Connected"
//                   : backendStatus === "checking"
//                     ? "Checking..."
//                     : "Unavailable"
//               }
//               description="Spring Boot API health status."
//               type={
//                 backendStatus === "connected"
//                   ? "success"
//                   : backendStatus === "offline"
//                     ? "danger"
//                     : "warning"
//               }
//             />
//
//             <StatusCard
//               icon={<Bot size={19} />}
//               title="ML Execution"
//               status="Not connected"
//               description="ML test execution will be connected in the next integration phase."
//               type="warning"
//             />
//           </div>
//         </section>
//
//         <section className="workspace-card">
//           <div className="workspace-icon">
//             <TestTube2 size={23} />
//           </div>
//
//           <div className="workspace-content">
//             <span className="section-kicker">RELIABILITY WORKSPACE</span>
//             <h3>Start a reliability evaluation</h3>
//
//             <p>
//               Configure your AI agent, define its system prompt and tools,
//               then run a test suite.
//             </p>
//           </div>
//
//           <button className="outline-button">
//             Create Test Suite
//             <ArrowRight size={16} />
//           </button>
//         </section>
//
//         <section className="analytics-grid">
//           <EmptyPanel
//             icon={<BarChart3 size={21} />}
//             title="Reliability Analytics"
//             message="No completed test suites yet."
//             description="Run your first reliability suite to generate performance and failure analytics."
//           />
//
//           <EmptyPanel
//             icon={<Activity size={21} />}
//             title="Recent Test Runs"
//             message="No test runs yet."
//             description="Your completed reliability evaluations will appear here."
//           />
//         </section>
//
//         <section className="flow-section">
//           <div className="section-heading">
//             <div>
//               <span className="section-kicker">WORKFLOW</span>
//               <h3>From configuration to insight</h3>
//             </div>
//           </div>
//
//           <div className="flow-grid">
//             <FlowStep
//               number="01"
//               icon={<Settings size={19} />}
//               title="Configure"
//               description="Define the agent name, system prompt and tools."
//             />
//
//             <FlowStep
//               number="02"
//               icon={<Play size={19} />}
//               title="Execute"
//               description="Run reliability scenarios against the agent."
//             />
//
//             <FlowStep
//               number="03"
//               icon={<BarChart3 size={19} />}
//               title="Analyze"
//               description="Inspect scores, failures, reasoning and execution traces."
//             />
//           </div>
//         </section>
//
//         <footer>
//           <span>Reliability Engine</span>
//           <span>AI Agent Reliability Platform</span>
//         </footer>
//       </main>
//     </div>
//   );
// }
//
// function SidebarItem({
//   icon,
//   label,
//   active = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   active?: boolean;
// }) {
//   return (
//     <button className={`sidebar-item ${active ? "active" : ""}`}>
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// }
//
// function StatusCard({
//   icon,
//   title,
//   status,
//   description,
//   type,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   status: string;
//   description: string;
//   type: "success" | "warning" | "danger";
// }) {
//   return (
//     <div className="status-card">
//       <div className="status-card-top">
//         <div className="status-icon">{icon}</div>
//
//         <span className={`status-badge ${type}`}>
//           {type === "success" && <CheckCircle2 size={13} />}
//           {type === "warning" && <CircleAlert size={13} />}
//           {type === "danger" && <XCircle size={13} />}
//           {status}
//         </span>
//       </div>
//
//       <h4>{title}</h4>
//       <p>{description}</p>
//     </div>
//   );
// }
//
// function EmptyPanel({
//   icon,
//   title,
//   message,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   message: string;
//   description: string;
// }) {
//   return (
//     <div className="empty-panel">
//       <div className="empty-icon">{icon}</div>
//
//       <div>
//         <span className="section-kicker">DATA</span>
//         <h3>{title}</h3>
//       </div>
//
//       <div className="empty-content">
//         <strong>{message}</strong>
//         <p>{description}</p>
//       </div>
//
//       <button className="text-button">
//         Create Test Suite
//         <ArrowRight size={15} />
//       </button>
//     </div>
//   );
// }
//
// function FlowStep({
//   number,
//   icon,
//   title,
//   description,
// }: {
//   number: string;
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <div className="flow-step">
//       <div className="flow-number">{number}</div>
//
//       <div className="flow-icon">{icon}</div>
//
//       <h4>{title}</h4>
//       <p>{description}</p>
//     </div>
//   );
// }
//
// export default App;
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FlaskConical,
  LayoutDashboard,
  Loader2,
  Play,
  Settings,
  ShieldCheck,
  Terminal,
  TestTube2,
  X,
  XCircle,
} from "lucide-react";

import "./App.css";
import CreateSuiteModal from "./components/CreateSuiteModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

type BackendStatus = "checking" | "connected" | "offline";

function App() {
  const [backendStatus, setBackendStatus] =
    useState<BackendStatus>("checking");

  const [showCreateSuite, setShowCreateSuite] = useState(false);

  const [createdSuiteId, setCreatedSuiteId] =
    useState<string | null>(null);

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

    alert(
      `Test suite created successfully!\n\nSuite ID:\n${suiteId}`
    );
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={20} />
          </div>

          <div>
            <div className="brand-name">RELIABILITY</div>
            <div className="brand-subtitle">ENGINE</div>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>

          <nav>
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active
            />

            <button
              className="sidebar-item"
              onClick={() => setShowCreateSuite(true)}
            >
              <TestTube2 size={18} />
              <span>New Test Suite</span>
            </button>

            <SidebarItem
              icon={<Activity size={18} />}
              label="Test Runs"
            />

            <SidebarItem
              icon={<BarChart3 size={18} />}
              label="Results"
            />
          </nav>
        </div>

        <div className="sidebar-bottom">
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
          />

          <div className="engine-version">
            <span>Reliability Engine</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">
        {/* HEADER */}

        <header className="topbar">
          <div>
            <div className="breadcrumb">
              Workspace
              <ChevronRight size={13} />
              Dashboard
            </div>

            <h1>Reliability Engine</h1>

            <p>AI Agent Reliability Testing</p>
          </div>

          <div className={`backend-status ${backendStatus}`}>
            <span className="status-dot" />

            {backendStatus === "checking" &&
              "Checking backend"}

            {backendStatus === "connected" &&
              "Backend connected"}

            {backendStatus === "offline" &&
              "Backend unavailable"}
          </div>
        </header>

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <Terminal size={14} />
              AI RELIABILITY WORKSPACE
            </div>

            <h2>
              Test how reliably
              <br />
              your AI agents behave.
            </h2>

            <p>
              Evaluate AI agents against structured reliability
              scenarios and understand where their behavior fails.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => setShowCreateSuite(true)}
              >
                <Play size={16} />
                Create Test Suite
                <ArrowRight size={16} />
              </button>

              <button className="secondary-button">
                View Results
              </button>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">
            <div className="visual-grid" />

            <div className="agent-card">
              <div className="agent-card-header">
                <div className="agent-icon">
                  <Bot size={21} />
                </div>

                <div>
                  <span className="agent-label">
                    AGENT
                  </span>

                  <strong>
                    Reliability Evaluation
                  </strong>
                </div>

                <div className="live-indicator">
                  <span />
                  READY
                </div>
              </div>

              <div className="evaluation-line">
                <div>
                  <span>Configuration</span>
                  <strong>Ready</strong>
                </div>

                <div>
                  <span>Test Engine</span>
                  <strong>Standby</strong>
                </div>

                <div>
                  <span>ML Execution</span>

                  <strong className="muted">
                    Not connected
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
              icon={<FlaskConical size={19} />}
              title="Test Engine"
              status="Ready for configuration"
              description="Configure an agent and prepare a reliability suite."
              type="success"
            />

            <StatusCard
              icon={<Activity size={19} />}
              title="Backend"
              status={
                backendStatus === "connected"
                  ? "Connected"
                  : backendStatus === "checking"
                    ? "Checking..."
                    : "Unavailable"
              }
              description="Spring Boot API health status."
              type={
                backendStatus === "connected"
                  ? "success"
                  : backendStatus === "offline"
                    ? "danger"
                    : "warning"
              }
            />

            <StatusCard
              icon={<Bot size={19} />}
              title="ML Execution"
              status="Not connected"
              description="ML test execution will be connected in the next integration phase."
              type="warning"
            />
          </div>
        </section>

        {/* CREATE WORKSPACE */}

        <section className="workspace-card">
          <div className="workspace-icon">
            <TestTube2 size={23} />
          </div>

          <div className="workspace-content">
            <span className="section-kicker">
              RELIABILITY WORKSPACE
            </span>

            <h3>
              Start a reliability evaluation
            </h3>

            <p>
              Configure your AI agent, define its system
              prompt and tools, then run a test suite.
            </p>
          </div>

          <button
            className="outline-button"
            onClick={() => setShowCreateSuite(true)}
          >
            Create Test Suite
            <ArrowRight size={16} />
          </button>
        </section>

        {/* CREATED SUITE STATUS */}

        {createdSuiteId && (
          <section className="created-suite-card">
            <div className="created-suite-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span className="section-kicker">
                SUITE CREATED
              </span>

              <h3>Test suite successfully created</h3>

              <p>
                Suite ID:
                <code>{createdSuiteId}</code>
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigator.clipboard.writeText(
                  createdSuiteId
                )
              }
            >
              Copy ID
            </button>
          </section>
        )}

        {/* ANALYTICS */}

        <section className="analytics-grid">
          <EmptyPanel
            icon={<BarChart3 size={21} />}
            title="Reliability Analytics"
            message="No completed test suites yet."
            description="Run your first reliability suite to generate performance and failure analytics."
            onCreate={() => setShowCreateSuite(true)}
          />

          <EmptyPanel
            icon={<Activity size={21} />}
            title="Recent Test Runs"
            message="No test runs yet."
            description="Your completed reliability evaluations will appear here."
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
                From configuration to insight
              </h3>
            </div>
          </div>

          <div className="flow-grid">
            <FlowStep
              number="01"
              icon={<Settings size={19} />}
              title="Configure"
              description="Define the agent name, system prompt and tools."
            />

            <FlowStep
              number="02"
              icon={<Play size={19} />}
              title="Execute"
              description="Run reliability scenarios against the agent."
            />

            <FlowStep
              number="03"
              icon={<BarChart3 size={19} />}
              title="Analyze"
              description="Inspect scores, failures, reasoning and execution traces."
            />
          </div>
        </section>

        {/* FOOTER */}

        <footer>
          <span>Reliability Engine</span>
          <span>
            AI Agent Reliability Platform
          </span>
        </footer>

        {/* CREATE SUITE MODAL */}

        {showCreateSuite && (
          <CreateSuiteModal
            onClose={() =>
              setShowCreateSuite(false)
            }
            onCreated={handleSuiteCreated}
          />
        )}
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`sidebar-item ${
        active ? "active" : ""
      }`}
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
            <CheckCircle2 size={13} />
          )}

          {type === "warning" && (
            <CircleAlert size={13} />
          )}

          {type === "danger" && (
            <XCircle size={13} />
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
        className="text-button"
        onClick={onCreate}
      >
        Create Test Suite
        <ArrowRight size={15} />
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
  );
}

export default App;