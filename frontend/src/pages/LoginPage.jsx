import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BrandMark } from '../components/Icon'
import { Button, Callout, Field } from '../components/ui'
import { ROLE_META } from '../constants/roles'
import { useSession } from '../context/SessionContext'
import { useLanguage } from '../context/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { getErrorMessage } from '../services/api'

export function LoginPage() {
  const { session, loading, connectionError, signIn } = useSession()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="auth-loading" role="status">{t('Loading your account…')}</div>
  if (session) return <Navigate to={ROLE_META[session.role].home} replace />

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn({ email, password })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-wrap">
      <section className="login-hero">
        <div>
          <BrandMark />
          <p style={{ letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 24, color: 'var(--gold)' }}>
            {t('Educational paper production')}
          </p>
          <h2>{t('Just click to make it real.')}</h2>
          <p style={{ maxWidth: 420, lineHeight: 1.6, opacity: 0.92 }}>
            {t('Generate regular papers, full-book guess papers, edit with care, and export professional PDFs — for schools, colleges, and academies.')}
          </p>
        </div>
        <p style={{ opacity: 0.8 }}>{t('Paper Producer · original product interface')}</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="login-language"><LanguageToggle /></div>
          <h3 className="auth-title">{t('Sign in')}</h3>
          <p className="auth-description">{t('Sign in with your institute account.')}</p>
          {connectionError ? <Callout tone="danger">{t('The server could not be reached.')}</Callout> : null}
          {error ? <Callout tone="danger">{t(error)}</Callout> : null}
          <form className="stack-form" style={{ marginTop: 16 }} onSubmit={onSubmit}>
            <Field label="Email">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </Field>
            <Button type="submit" disabled={submitting}>
              {submitting ? t('Signing in…') : t('Sign in')}
            </Button>
          </form>
          <p className="auth-switch">
            {t('New to Paper Producer?')} <Link to="/signup">{t('Create an institute account')}</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
