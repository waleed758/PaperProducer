import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BrandMark } from '../components/Icon'
import { Button, Callout, Field } from '../components/ui'
import { ROLE_META, ROLES } from '../constants/roles'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { PENDING_COPY } from '../services/api'
import { useLanguage } from '../context/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'

export function LoginPage() {
  const { session, enterPreview } = useSession()
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (session) return <Navigate to={ROLE_META[session.role].home} replace />

  const onSubmit = (event) => {
    event.preventDefault()
    pushToast(PENDING_COPY.auth)
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
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '0 0 8px' }}>{t('Sign in')}</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>{t('Authorized institute and platform users only.')}</p>
          <Callout title={t('Authentication pending')}>{t(PENDING_COPY.auth)}</Callout>
          <form className="stack-form" style={{ marginTop: 16 }} onSubmit={onSubmit}>
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </Field>
              <Button type="submit">{t('Sign in')}</Button>
          </form>
          <div style={{ height: 1, background: 'var(--rule)', margin: '22px 0' }} />
          <p style={{ fontWeight: 600, margin: '0 0 10px' }}>{t('Interface preview')}</p>
          <div className="stack-form">
            <Button variant="ghost" onClick={() => enterPreview(ROLES.SUPER_ADMIN)}>
              Preview Super Admin
            </Button>
            <Button variant="ghost" onClick={() => enterPreview(ROLES.INSTITUTE_ADMIN)}>
              Preview Institute Admin
            </Button>
            <Button variant="copper" onClick={() => enterPreview(ROLES.TEACHER)}>
              Preview Teacher
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
