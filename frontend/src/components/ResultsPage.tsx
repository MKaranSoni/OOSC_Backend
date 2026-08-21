import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSuiteResults } from '../hooks/useSuiteResults';
import { JsonViewer } from './common/JsonViewer';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorState } from './common/ErrorState';
import { EmptyState } from './common/EmptyState';
import { displayFailureMode, displayScenarioType } from '../utils/formatters';
import { ChevronRight, ArrowLeft, SearchX } from 'lucide-react';


export default function ResultsPage() {
  const { suiteId } = useParams<{ suiteId: string }>();
  const navigate = useNavigate();
  const { loadState, results, error } = useSuiteResults(suiteId);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner label="Loading results..." />
      </div>
    );
  }

  if (loadState === 'not_found') {
    return <EmptyState icon={<SearchX size={24}/>} title="Suite Not Found" message={`Could not find results for suite: ${suiteId}`} />;
  }

  if (loadState === 'error' || !results) {
    return <ErrorState title="Error Loading Results" message={error?.message || 'Unknown error occurred'} />;
  }

  const selectedScenario = selectedScenarioId 
    ? results.results.find(r => r.id === selectedScenarioId) 
    : null;

  return (
    <>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <button onClick={() => navigate('/')} className="text-[var(--color-text-secondary)] hover:text-white transition-colors">Workspace</button>
            <ChevronRight size={13} />
            <span>Results</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="p-1 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"><ArrowLeft size={20}/></button>
             <div>
                <h1>Reliability Engine Results</h1>
                <p>Agent: {results.agent_name}</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-hidden">
        
        {/* Left Column: Stats & Scenarios */}
        <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto">
           <section className="section !m-0">
             <div className="section-heading">
                <div><span className="section-kicker">OVERVIEW</span><h3>Score: {results.score}%</h3></div>
             </div>
             <div className="flex flex-col gap-2 p-4 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border)] text-sm">
                <div className="flex justify-between"><span>Status:</span> <span className="font-semibold">{results.status}</span></div>
                <div className="flex justify-between"><span>Total Scenarios:</span> <span className="font-semibold">{results.total}</span></div>
                <div className="flex justify-between"><span>Passed:</span> <span className="text-[var(--color-success)] font-semibold">{results.passed}</span></div>
                <div className="flex justify-between"><span>Failed:</span> <span className="text-[var(--color-danger)] font-semibold">{results.failed}</span></div>
             </div>
           </section>

           <section className="section !m-0 flex-1">
             <div className="section-heading">
                <div><span className="section-kicker">SCENARIOS</span><h3>Scenario List</h3></div>
             </div>
             <div className="flex flex-col gap-2">
               {results.results.map(r => (
                 <button 
                   key={r.id} 
                   onClick={() => setSelectedScenarioId(r.id)}
                   className={`text-left p-3 rounded-md border transition-colors ${selectedScenarioId === r.id ? 'border-[var(--color-primary)] bg-[var(--color-bg-surface)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'}`}
                 >
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-medium text-sm">{displayScenarioType(r.scenario_type)}</span>
                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.passed ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'}`}>
                         {r.passed ? 'PASSED' : 'FAILED'}
                       </span>
                    </div>
                    {r.failure_mode && r.failure_mode !== 'NONE' && (
                      <div className="text-xs text-[var(--color-danger)] mt-1">Failure: {displayFailureMode(r.failure_mode)}</div>
                    )}
                 </button>
               ))}
             </div>
           </section>
        </div>

        {/* Right Column: Scenario Details & Trace */}
        <div className="md:col-span-2 flex flex-col gap-6 overflow-y-auto">
           {selectedScenario ? (
             <>
                <section className="section !m-0">
                   <div className="section-heading">
                      <div><span className="section-kicker">DETAILS</span><h3>Scenario Breakdown</h3></div>
                   </div>
                   <div className="p-4 bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border)] text-sm flex flex-col gap-4">
                      {selectedScenario.user_prompt && (
                        <div>
                          <strong className="block mb-1 text-[var(--color-text-secondary)]">User Prompt:</strong>
                          <p>{selectedScenario.user_prompt}</p>
                        </div>
                      )}
                      {selectedScenario.reasoning && (
                        <div>
                          <strong className="block mb-1 text-[var(--color-text-secondary)]">Evaluator Reasoning:</strong>
                          <p className={selectedScenario.passed ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-danger)]'}>{selectedScenario.reasoning}</p>
                        </div>
                      )}
                   </div>
                </section>
                <section className="section !m-0 flex-1 flex flex-col">
                   <div className="section-heading">
                      <div><span className="section-kicker">EXECUTION</span><h3>Trace</h3></div>
                   </div>
                   <div className="flex-1 min-h-[300px]">
                      <JsonViewer data={selectedScenario.trace} title="Execution Trace (Simulated Tools)" />
                   </div>
                </section>
             </>
           ) : (
             <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-lg min-h-[400px]">
                Select a scenario from the list to view its execution trace.
             </div>
           )}
        </div>
      </div>
    </>
  );
}
