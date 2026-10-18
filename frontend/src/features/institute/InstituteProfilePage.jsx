import { useState } from 'react'
import { Callout, Field, PageHeader, PendingSaveButton } from '../../components/ui'
import { useSession } from '../../context/SessionContext'
import { useLanguage } from '../../context/LanguageContext'

export function InstituteProfilePage() {
  const { session } = useSession()
  const { t } = useLanguage()
  const [logoUrl, setLogoUrl] = useState('')

  const onLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setLogoUrl(url)
  }

  return (
    <>
      <PageHeader title="Institute profile" description="Edit your institute details. Logo files will be uploaded through a secured API later." />
      <Callout tone="info">Institute is derived from the signed-in membership. This screen does not accept an institute id from the client.</Callout>
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <article className="card stack-form">
          <Field label="Institute name">
            <input defaultValue={t(session.instituteName ?? '')} />
          </Field>
          <Field label="Address">
            <textarea rows={3} />
          </Field>
          <Field label="Phone">
            <input />
          </Field>
          <PendingSaveButton>Save profile</PendingSaveButton>
        </article>
        <article className="card stack-form">
          <Field label="Logo" hint="Local preview only. The file is not uploaded yet.">
            <input type="file" accept="image/*" onChange={onLogo} />
          </Field>
          {logoUrl ? <img src={logoUrl} alt={t('Logo preview')} style={{ width: 160, borderRadius: 12, border: '1px solid var(--rule)' }} /> : <p className="stat-hint">{t('No logo selected.')}</p>}
        </article>
      </div>
    </>
  )
}

export function AssignedSubjectsPage() {
  const { session } = useSession()
  const { t } = useLanguage()
  return (
    <>
      <PageHeader title="Assigned subjects" description="These are the subjects your institute admin has assigned to your account." />
      <div className="grid grid-2">
        {session.assignedSubjects.length ? (
          session.assignedSubjects.map((name) => (
            <article className="card" key={name}>
              <h3>{t(name)}</h3>
              <p className="stat-hint">{t('Your institute administrator manages these assignments.')}</p>
            </article>
          ))
        ) : (
          <article className="card">
            <h3>{t('No subjects assigned')}</h3>
            <p className="stat-hint">{t('Ask your Institute Admin to assign subject permissions.')}</p>
          </article>
        )}
      </div>
    </>
  )
}
