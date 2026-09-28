/**
 * Shared result shape for Server Actions used with React's useActionState.
 * `fields` maps form field names to error messages; `_form` is a form-level error.
 */
export interface ActionState<T = undefined> {
  ok: boolean;
  message?: string;
  fields?: Record<string, string>;
  data?: T;
}

export const idleState: ActionState<never> = { ok: false };
