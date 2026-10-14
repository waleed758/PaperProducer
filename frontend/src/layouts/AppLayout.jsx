import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark, Icon } from '../components/Icon'
import { ROLE_META } from '../constants/roles'
import { useSession } from '../context/SessionContext'
import { NAV } from './nav'
import { useLanguage } from '../context/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'

export function AppLayout() {
  const { session, leavePreview } = useSession()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const groups = NAV[session.role] ?? []
  const meta = ROLE_META[session.role]

  return (
    <div>
      <div className="preview-banner">
        <span>
          {t('Interface preview — not authenticated. Role shown:')} {t(meta.label)}. {t('Live login, permissions, and data will come from Django.')}
        </span>
        <button className="btn btn-sm btn-ghost" style={{ color: '#fff', borderColor: '#6b7c86' }} onClick={leavePreview}>
          {t('Exit preview')}
        </button>
      </div>
      <div className="app-shell">
        <aside className={`sidebar ${open ? 'is-open' : ''}`}>
          <div className="brand">
            <BrandMark />
            <div>
              <h1>{t('Paper Producer')}</h1>
              <p>{t('Just click to make it real')}</p>
            </div>
          </div>
          <nav className="nav-scroll" onClick={() => setOpen(false)}>
            {groups.map((group) => (
              <div key={group.group}>
                <div className="nav-group">{t(group.group)}</div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                  >
                    <Icon name={item.icon} />
                    {t(item.label)}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        <header className="topbar">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="icon-btn hamburger" aria-label={t('Open menu')} onClick={() => setOpen((value) => !value)}>
              <Icon name="menu" />
            </button>
            <div>
              <strong>{t(session.displayName)}</strong>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {t(meta.label)}
                {session.instituteName ? ` · ${t(session.instituteName)}` : ''}
              </div>
            </div>
          </div>
          <div className="toolbar topbar-actions" style={{ margin: 0 }}>
            <LanguageToggle />
            <button className="btn btn-ghost btn-sm" onClick={leavePreview}>
              <Icon name="logout" size={16} /> {t('Leave')}
            </button>
          </div>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
