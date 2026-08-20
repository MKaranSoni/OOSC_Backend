export interface FieldValidation {
  valid: boolean;
  message?: string;
}

export function validateAgentName(name: string): FieldValidation {
  if (!name || name.trim().length === 0)
    return { valid: false, message: 'Agent name is required.' };
  if (name.trim().length < 2)
    return { valid: false, message: 'Agent name must be at least 2 characters.' };
  if (name.length > 200)
    return { valid: false, message: 'Agent name must be under 200 characters.' };
  return { valid: true };
}

export function validateSystemPrompt(prompt: string): FieldValidation {
  if (!prompt || prompt.trim().length === 0)
    return { valid: false, message: 'System prompt is required.' };
  return { valid: true };
}

export function parseToolJson(
  jsonString: string
): { parsed: Record<string, unknown>; error: null } | { parsed: null; error: string } {
  if (!jsonString.trim()) return { parsed: null, error: 'Tool JSON cannot be empty.' };
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)
      return { parsed: null, error: 'Each tool must be a JSON object, not an array or primitive.' };
    return { parsed: parsed as Record<string, unknown>, error: null };
  } catch (e) {
    const msg = e instanceof SyntaxError ? e.message : 'Invalid JSON.';
    return { parsed: null, error: `JSON parse error: ${msg}` };
  }
}
