import { useState } from 'react'
import { Button, Callout, DataTable, Field, Modal, PageHeader, PendingSaveButton } from '../../components/ui'
import { PENDING_COPY } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

export function ResourcePage({ title, description, columns, createLabel, fields, extra }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => setOpen(true)}>
            {createLabel}
          </Button>
        }
      />
      <Callout>{PENDING_COPY.data}</Callout>
      {extra}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="toolbar">
          <input className="search" placeholder={t('Search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <DataTable columns={columns} rows={[]} emptyTitle={`No ${title.toLowerCase()} yet`} />
      </div>
      {open ? (
        <Modal
          title={createLabel}
          onClose={() => setOpen(false)}
          actions={<PendingSaveButton />}
        >
          <p className="stat-hint" style={{ marginTop: 0 }}>
            {t('This form is the real layout. Submitting does not write to a database yet.')}
          </p>
          <div className="stack-form">
            {fields.map((field) => (
              <Field key={field.label} label={field.label} hint={field.hint}>
                {field.type === 'textarea' ? (
                  <textarea rows={4} />
                ) : field.type === 'select' ? (
                  <select defaultValue="">
                    <option value="" disabled>{field.label === 'Role' ? t('Select role') : `Select ${t(field.label).toLowerCase()}`}</option>
                    {field.options.map((option) => (
                    <option key={option} value={option}>{t(option)}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type || 'text'} />
                )}
              </Field>
            ))}
          </div>
        </Modal>
      ) : null}
    </>
  )
}
