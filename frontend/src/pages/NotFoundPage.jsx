import { Link } from 'react-router-dom'
import { Button, PageHeader } from '../components/ui'
import { useLanguage } from '../context/LanguageContext'

export function NotFoundPage() {
  const { t } = useLanguage()
  return (
    <div className="main">
      <PageHeader title="Page not found" description="That route is not part of the Paper Producer interface." />
      <Link to="/">
        <Button>{t('Back to sign in')}</Button>
      </Link>
    </div>
  )
}
