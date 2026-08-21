import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FlaskConical,
  Play,
  Settings,
  Terminal,
  TestTube2,
  XCircle,
} from "lucide-react";

import CreateSuiteModal from "./CreateSuiteModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ backendStatus, setCreatedSuiteId, createdSuiteId }: any) {
  const [showCreateSuite, setShowCreateSuite] = useState(false);
  const navigate = useNavigate();

  const handleSuiteCreated = (suiteId: string) => {
    setCreatedSuiteId(suiteId);
    setShowCreateSuite(false);
    navigate(`/results/${suiteId}`);
  };

  return (
    <>
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
          {backendStatus === "checking" && "Checking backend"}
          {backendStatus === "connected" && "Backend connected"}
          {backendStatus === "offline" && "Backend unavailable"}
        </div>
      </header>

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

            <button className="secondary-button" onClick={() => navigate('/results')}>
              View Results
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-grid" />
          <div className="agent-card">
            <div className="agent-card-header">
              <div className="agent-icon">
                <Bot size={21} />
              </div>
              <div>
                <span className="agent-label">AGENT</span>
                <strong>Reliability Evaluation</strong>
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
                <strong className="muted">Not connected</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SYSTEM</span>
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

      <section className="workspace-card">
        <div className="workspace-icon">
          <TestTube2 size={23} />
        </div>

        <div className="workspace-content">
          <span className="section-kicker">RELIABILITY WORKSPACE</span>
          <h3>Start a reliability evaluation</h3>
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

      {createdSuiteId && (
        <section className="created-suite-card">
          <div className="created-suite-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span className="section-kicker">SUITE CREATED</span>
            <h3>Test suite successfully created</h3>
            <p>
              Suite ID:
              <code>{createdSuiteId}</code>
            </p>
          </div>

          <button
            className="text-button"
            onClick={() =>
              navigator.clipboard.writeText(createdSuiteId)
            }
          >
            Copy ID
          </button>
        </section>
      )}

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

      <section className="flow-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">WORKFLOW</span>
            <h3>From configuration to insight</h3>
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

      <footer>
        <span>Reliability Engine</span>
        <span>AI Agent Reliability Platform</span>
      </footer>

      {showCreateSuite && (
        <CreateSuiteModal
          onClose={() => setShowCreateSuite(false)}
          onCreated={handleSuiteCreated}
        />
      )}
    </>
  );
}

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
        <div className="status-icon">{icon}</div>

        <span className={`status-badge ${type}`}>
          {type === "success" && <CheckCircle2 size={13} />}
          {type === "warning" && <CircleAlert size={13} />}
          {type === "danger" && <XCircle size={13} />}
          {status}
        </span>
      </div>

      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

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
      <div className="empty-icon">{icon}</div>

      <div>
        <span className="section-kicker">DATA</span>
        <h3>{title}</h3>
      </div>

      <div className="empty-content">
        <strong>{message}</strong>
        <p>{description}</p>
      </div>

      <button className="text-button" onClick={onCreate}>
        Create Test Suite
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

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
      <div className="flow-number">{number}</div>
      <div className="flow-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
