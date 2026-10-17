const API_BASE = '/api/v1'

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : null

  if (!response.ok) {
    const message = payload?.detail ?? Object.values(payload?.errors ?? {}).flat().join(' ')
    throw new ApiError(message || `Request failed (${response.status}).`, {
      status: response.status,
      errors: payload?.errors ?? null,
    })
  }
  return payload
}

export async function apiRequest(path, { body, headers, ...options } = {}) {
  const requestHeaders = new Headers(headers)
  const requestOptions = {
    ...options,
    headers: requestHeaders,
    credentials: 'same-origin',
  }

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
    requestOptions.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, requestOptions)
  } catch {
    throw new ApiError('The server could not be reached.')
  }
  return parseResponse(response)
}

function readCookie(name) {
  const prefix = `${name}=`
  const value = document.cookie.split('; ').find((cookie) => cookie.startsWith(prefix))
  return value ? decodeURIComponent(value.slice(prefix.length)) : null
}

export async function authPost(path, payload) {
  await apiRequest('/auth/csrf/')
  const csrfToken = readCookie('csrftoken')
  if (!csrfToken) throw new ApiError('Could not initialize the secure sign-in request.')

  return apiRequest(path, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken },
    body: payload,
  })
}

export function getErrorMessage(error) {
  if (error?.errors) {
    return Object.values(error.errors).flat().join(' ')
  }
  return error?.message || 'Something went wrong. Please try again.'
}

export const PENDING_COPY = {
  data: 'No live records yet. Tables stay empty until the API and database are connected.',
  generate: 'Papers are not generated in the browser. Generation, question selection, and entitlement checks will run on the Django API.',
  guess: 'Guess papers are not scored or generated here. Weighting and full-book selection will run on the server.',
  pdf: 'PDF and answer-key download will be produced by the backend from a saved paper version.',
  save: 'Saving is disabled until the API is connected. Nothing was stored.',
}
