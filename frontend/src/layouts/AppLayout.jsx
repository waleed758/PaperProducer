import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark, Icon } from '../components/Icon'
import { ROLE_META } from '../constants/roles'
import { useSession } from '../context/SessionContext'
import { NAV } from './nav'
import { useLanguage } from '../context/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../services/api'

export function AppLayout() {
  const { session, signOut } = useSession()
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const groups = NAV[session.role] ?? []
  const meta = ROLE_META[session.role]

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (error) {
      pushToast(t(getErrorMessage(error)))
    }
  }

  return (
    <div>
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
            <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
              <Icon name="logout" size={16} /> {t('Sign out')}
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
