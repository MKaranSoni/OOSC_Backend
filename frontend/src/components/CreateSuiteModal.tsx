import { useState } from "react";
import { Loader2, X, Play, Settings2 } from "lucide-react";
import { runSuite } from "../services/suiteService";

interface Props {
  onClose: () => void;
  onCreated: (suiteId: string) => void;
}

export default function CreateSuiteModal({
  onClose,
  onCreated,
}: Props) {
  const [agentName, setAgentName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [tools, setTools] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanAgentName = agentName.trim();
    const cleanSystemPrompt = systemPrompt.trim();

    if (!cleanAgentName) {
      setError("Enter an agent name before creating the suite.");
      return;
    }

    if (!cleanSystemPrompt) {
      setError("Enter the system prompt used by the agent.");
      return;
    }

    let parsedTools: Record<string, unknown>[] = [];

    if (tools.trim()) {
      try {
        const parsed = JSON.parse(tools);

        if (!Array.isArray(parsed)) {
          throw new Error();
        }

        parsedTools = parsed;
      } catch {
        setError(
          "Tools must be a valid JSON array. Example: []"
        );
        return;
      }
    }

    try {
      setLoading(true);

      const result = await runSuite({
        agent_name: cleanAgentName,
        system_prompt: cleanSystemPrompt,
        tools: parsedTools,
      });

      if (!result?.suite_id) {
        throw new Error(
          "The API did not return a suite ID."
        );
      }

      onCreated(result.suite_id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the test suite."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="suite-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-suite-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <div className="modal-header">
          <div>
            <span className="section-kicker">
              TEST CONFIGURATION
            </span>

            <h2 id="create-suite-title">
              Create Test Suite
            </h2>

            <p>
              Define the agent configuration that the reliability
              engine will evaluate.
            </p>
          </div>

          <button
            type="button"
            className="sandbox-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <label>
            Agent name

            <input
              type="text"
              value={agentName}
              onChange={(event) =>
                setAgentName(event.target.value)
              }
              placeholder="Customer Support Agent"
              autoComplete="off"
              disabled={loading}
            />
          </label>

          <label>
            System prompt

            <textarea
              value={systemPrompt}
              onChange={(event) =>
                setSystemPrompt(event.target.value)
              }
              placeholder="Describe how the agent should behave, what it is responsible for, and any constraints it must follow."
              rows={6}
              disabled={loading}
            />
          </label>

          <label>
            Tools

            <span className="field-hint">
              Optional. Provide the tools available to the agent
              as a JSON array.
            </span>

            <textarea
              value={tools}
              onChange={(event) =>
                setTools(event.target.value)
              }
              placeholder={`[
  {
    "name": "search",
    "description": "Search available information"
  }
]`}
              rows={6}
              spellCheck={false}
              disabled={loading}
            />
          </label>

          {error && (
            <div
              className="form-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="modal-actions">
            <button
              type="button"
              className="sandbox-btn sandbox-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sandbox-btn sandbox-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="spin"
                  />

                  Creating suite...
                </>
              ) : (
                <>
                  <Play size={15} />

                  Create Test Suite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}