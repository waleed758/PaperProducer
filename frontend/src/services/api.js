export class ApiPendingError extends Error {
  constructor(message = 'This action requires the backend API, which is not connected yet.') {
    super(message)
    this.name = 'ApiPendingError'
    this.code = 'API_PENDING'
  }
}

export async function apiRequest() {
  throw new ApiPendingError()
}

export const PENDING_COPY = {
  auth: 'Sign-in is not connected. Use interface preview to inspect screens. Authentication will be enforced by Django in a later phase.',
  data: 'No live records yet. Tables stay empty until the API and database are connected.',
  generate: 'Papers are not generated in the browser. Generation, question selection, and entitlement checks will run on the Django API.',
  guess: 'Guess papers are not scored or generated here. Weighting and full-book selection will run on the server.',
  pdf: 'PDF and answer-key download will be produced by the backend from a saved paper version.',
  save: 'Saving is disabled until the API is connected. Nothing was stored.',
}
