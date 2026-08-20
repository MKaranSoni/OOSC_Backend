import { useState } from "react";
import { Loader2, X, Play } from "lucide-react";
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

    if (!agentName.trim()) {
      setError("Agent name is required.");
      return;
    }

    if (!systemPrompt.trim()) {
      setError("System prompt is required.");
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
          "Tools must be valid JSON array, for example: []"
        );
        return;
      }
    }

    try {
      setLoading(true);

      const result = await runSuite({
        agent_name: agentName.trim(),
        system_prompt: systemPrompt.trim(),
        tools: parsedTools,
      });

      onCreated(result.suite_id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create test suite."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="suite-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="section-kicker">
              NEW EVALUATION
            </span>
            <h2>Create Test Suite</h2>
            <p>
              Configure the AI agent you want to evaluate.
            </p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Agent Name
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g. Customer Support Agent"
            />
          </label>

          <label>
            System Prompt
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter the system prompt used by your AI agent..."
              rows={6}
            />
          </label>

          <label>
            Tools
            <span className="field-hint">
              JSON array. Leave empty if the agent has no tools.
            </span>

            <textarea
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder='[]'
              rows={4}
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  Creating...
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