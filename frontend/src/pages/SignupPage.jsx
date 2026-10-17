import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BrandMark } from '../components/Icon'
import { Button, Callout, Field } from '../components/ui'
import { ROLE_META } from '../constants/roles'
import { useLanguage } from '../context/LanguageContext'
import { useSession } from '../context/SessionContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { getErrorMessage } from '../services/api'

export function SignupPage() {
  const { session, loading, connectionError, signUp } = useSession()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    institute_name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="auth-loading" role="status">{t('Loading your account…')}</div>
  if (session) return <Navigate to={ROLE_META[session.role].home} replace />

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signUp(form)
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
        <div className="login-card signup-card">
          <div className="login-language"><LanguageToggle /></div>
          <h3 className="auth-title">{t('Create your institute account')}</h3>
          <p className="auth-description">{t('This creates an institute and its first institute-admin account.')}</p>
          {connectionError ? <Callout tone="danger">{t('The server could not be reached.')}</Callout> : null}
          {error ? <Callout tone="danger">{t(error)}</Callout> : null}
          <form className="stack-form" style={{ marginTop: 16 }} onSubmit={onSubmit}>
            <Field label="Institute name">
              <input value={form.institute_name} onChange={updateField('institute_name')} autoComplete="organization" required />
            </Field>
            <div className="grid grid-2 auth-name-fields">
              <Field label="First name">
                <input value={form.first_name} onChange={updateField('first_name')} autoComplete="given-name" required />
              </Field>
              <Field label="Last name">
                <input value={form.last_name} onChange={updateField('last_name')} autoComplete="family-name" />
              </Field>
            </div>
            <Field label="Email">
              <input type="email" value={form.email} onChange={updateField('email')} autoComplete="email" required />
            </Field>
            <Field label="Password">
              <input type="password" value={form.password} onChange={updateField('password')} autoComplete="new-password" required />
            </Field>
            <Field label="Confirm password">
              <input type="password" value={form.password_confirmation} onChange={updateField('password_confirmation')} autoComplete="new-password" required />
            </Field>
            <Button type="submit" disabled={submitting}>
              {submitting ? t('Creating account…') : t('Create institute account')}
            </Button>
          </form>
          <p className="auth-switch">
            {t('Already have an account?')} <Link to="/">{t('Sign in')}</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
