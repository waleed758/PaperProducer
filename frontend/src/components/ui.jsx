import { Children } from 'react'
import { PENDING_COPY } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'

function translateChild(child, t) {
  if (typeof child === 'string') return t(child)
  if (Array.isArray(child)) return Children.map(child, (item) => translateChild(item, t))
  return child
}

export function PageHeader({ title, description, actions }) {
  const { t } = useLanguage()
  return (
    <div className="page-header">
      <div>
        <h2>{t(title)}</h2>
        {description ? <p>{t(description)}</p> : null}
      </div>
      {actions ? <div className="toolbar" style={{ margin: 0 }}>{actions}</div> : null}
    </div>
  )
}

export function Button({ variant = 'primary', size, children, ...props }) {
  const { t } = useLanguage()
  const classes = ['btn', `btn-${variant}`]
  if (size === 'sm') classes.push('btn-sm')
  return (
    <button className={classes.join(' ')} type={props.type ?? 'button'} {...props}>
      {translateChild(children, t)}
    </button>
  )
}

export function Field({ label, hint, children }) {
  const { t } = useLanguage()
  return (
    <label className="field">
      <span>{t(label)}</span>
      {children}
      {hint ? <span className="hint">{t(hint)}</span> : null}
    </label>
  )
}

export function Badge({ tone = 'muted', children }) {
  const { t } = useLanguage()
  return <span className={`badge badge-${tone}`}>{translateChild(children, t)}</span>
}

export function Callout({ tone = 'warn', title, children }) {
  const { t } = useLanguage()
  return (
    <div className={`callout ${tone === 'info' ? 'callout-info' : ''} ${tone === 'danger' ? 'callout-danger' : ''}`}>
      {title ? <strong>{t(title)}</strong> : null}
      {translateChild(children, t)}
    </div>
  )
}

export function EmptyState({ title, children }) {
  const { t } = useLanguage()
  return (
    <div className="empty">
      <h3>{t(title)}</h3>
      <p>{translateChild(children, t)}</p>
    </div>
  )
}

export function StatCard({ label, hint = 'Awaiting API' }) {
  const { t } = useLanguage()
  return (
    <article className="card">
      <h3>{t(label)}</h3>
      <div className="stat-value">—</div>
      <div className="stat-hint">{t(hint)}</div>
    </article>
  )
}

export function DataTable({ columns, rows, emptyTitle }) {
  const { t } = useLanguage()
  if (!rows.length) {
    return <EmptyState title={t(emptyTitle)}>{PENDING_COPY.data}</EmptyState>
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            {columns.map((column) => (
                <th key={column}>{t(column)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Modal({ title, children, onClose, actions }) {
  const { t } = useLanguage()
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{t(title)}</h3>
        {translateChild(children, t)}
        <div className="modal-actions">
          {actions}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PendingSaveButton({ children = 'Save', variant = 'primary' }) {
  const { pushToast } = useToast()
  const { t } = useLanguage()
  return (
    <Button variant={variant} onClick={() => pushToast(t(PENDING_COPY.save))}>
      {t(children)}
    </Button>
  )
}
