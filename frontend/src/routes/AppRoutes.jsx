import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLE_META, ROLES } from '../constants/roles'
import { useSession } from '../context/SessionContext'
import { AppLayout } from '../layouts/AppLayout'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import {
  AdminSubscriptionsPage,
  AnalyticsPage,
  AuditLogsPage,
  BoardsPage,
  BooksPage,
  ChaptersPage,
  ClassesPage,
  InstitutesPage,
  PastPapersPage,
  PlansPage,
  SettingsPage,
  SubjectsPage,
  SupportPage,
  TopicsPage,
  UsersPage,
} from '../features/admin/AdminPages'
import { TeachersPage } from '../features/teachers/TeachersPage'
import { QuestionBankPage } from '../features/questionBank/QuestionBankPage'
import { TemplatesPage } from '../features/templates/TemplatesPage'
import { SubscriptionPage } from '../features/subscriptions/SubscriptionPage'
import { AssignedSubjectsPage, InstituteProfilePage } from '../features/institute/InstituteProfilePage'
import { PaperGeneratorPage } from '../features/paperGenerator/PaperGeneratorPage'
import { GuessPaperPage } from '../features/guessPaper/GuessPaperPage'
import { PaperEditorPage } from '../features/paperEditor/PaperEditorPage'
import { PapersListPage } from '../features/papers/PapersListPage'

function RequireSession({ children }) {
  const { session } = useSession()
  if (!session) return <Navigate to="/" replace />
  return children
}

function PreviewHome() {
  const { session } = useSession()
  if (!session) return <Navigate to="/" replace />
  return <Navigate to={ROLE_META[session.role].home} replace />
}

function RoleRoute({ role }) {
  const { session } = useSession()
  if (session.role !== role) return <Navigate to={ROLE_META[session.role].home} replace />
  return <AppLayout />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<PreviewHome />} />
      <Route
        path="/app/admin"
        element={
          <RequireSession>
            <RoleRoute role={ROLES.SUPER_ADMIN} />
          </RequireSession>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="institutes" element={<InstitutesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
        <Route path="boards" element={<BoardsPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="chapters" element={<ChaptersPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="questions" element={<QuestionBankPage canManage />} />
        <Route path="past-papers" element={<PastPapersPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="/app/institute"
        element={
          <RequireSession>
            <RoleRoute role={ROLES.INSTITUTE_ADMIN} />
          </RequireSession>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<InstituteProfilePage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="generate" element={<PaperGeneratorPage />} />
        <Route path="guess-paper" element={<GuessPaperPage />} />
        <Route path="papers" element={<PapersListPage />} />
        <Route path="editor" element={<PaperEditorPage />} />
        <Route path="templates" element={<TemplatesPage />} />
      </Route>
      <Route
        path="/app/teacher"
        element={
          <RequireSession>
            <RoleRoute role={ROLES.TEACHER} />
          </RequireSession>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="subjects" element={<AssignedSubjectsPage />} />
        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="generate" element={<PaperGeneratorPage />} />
        <Route path="guess-paper" element={<GuessPaperPage />} />
        <Route path="papers" element={<PapersListPage />} />
        <Route path="editor" element={<PaperEditorPage />} />
        <Route path="templates" element={<TemplatesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
