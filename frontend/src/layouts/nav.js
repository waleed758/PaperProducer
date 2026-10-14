import { ROLES } from '../constants/roles'

export const NAV = {
  [ROLES.SUPER_ADMIN]: [
    { group: 'Overview', items: [{ to: '/app/admin', label: 'Dashboard', icon: 'grid', end: true }] },
    {
      group: 'Organizations',
      items: [
        { to: '/app/admin/institutes', label: 'Institutes', icon: 'building' },
        { to: '/app/admin/users', label: 'Users', icon: 'users' },
        { to: '/app/admin/teachers', label: 'Teachers', icon: 'users' },
      ],
    },
    {
      group: 'Subscriptions',
      items: [
        { to: '/app/admin/plans', label: 'Plans', icon: 'card' },
        { to: '/app/admin/subscriptions', label: 'Institute subscriptions', icon: 'card' },
      ],
    },
    {
      group: 'Academic content',
      items: [
        { to: '/app/admin/boards', label: 'Boards', icon: 'book' },
        { to: '/app/admin/classes', label: 'Classes', icon: 'book' },
        { to: '/app/admin/subjects', label: 'Subjects', icon: 'book' },
        { to: '/app/admin/books', label: 'Books', icon: 'book' },
        { to: '/app/admin/chapters', label: 'Chapters', icon: 'book' },
        { to: '/app/admin/topics', label: 'Topics', icon: 'book' },
        { to: '/app/admin/questions', label: 'Question bank', icon: 'file' },
        { to: '/app/admin/past-papers', label: 'Past papers', icon: 'file' },
        { to: '/app/admin/templates', label: 'Templates', icon: 'template' },
      ],
    },
    {
      group: 'Platform',
      items: [
        { to: '/app/admin/analytics', label: 'Analytics', icon: 'chart' },
        { to: '/app/admin/audit', label: 'Audit logs', icon: 'shield' },
        { to: '/app/admin/support', label: 'Support', icon: 'life' },
        { to: '/app/admin/settings', label: 'System settings', icon: 'settings' },
      ],
    },
  ],
  [ROLES.INSTITUTE_ADMIN]: [
    { group: 'Institute', items: [{ to: '/app/institute', label: 'Dashboard', icon: 'grid', end: true }] },
    {
      group: 'People',
      items: [
        { to: '/app/institute/profile', label: 'Institute profile', icon: 'building' },
        { to: '/app/institute/teachers', label: 'Teachers', icon: 'users' },
        { to: '/app/institute/subscription', label: 'Subscription', icon: 'card' },
      ],
    },
    {
      group: 'Papers',
      items: [
        { to: '/app/institute/question-bank', label: 'Question bank', icon: 'book' },
        { to: '/app/institute/generate', label: 'Generate paper', icon: 'file' },
        { to: '/app/institute/guess-paper', label: 'Guess paper', icon: 'spark' },
        { to: '/app/institute/papers', label: 'Institute papers', icon: 'file' },
        { to: '/app/institute/editor', label: 'Paper editor', icon: 'template' },
        { to: '/app/institute/templates', label: 'Templates', icon: 'template' },
      ],
    },
  ],
  [ROLES.TEACHER]: [
    { group: 'Teaching', items: [{ to: '/app/teacher', label: 'Dashboard', icon: 'grid', end: true }] },
    {
      group: 'Work',
      items: [
        { to: '/app/teacher/subjects', label: 'Assigned subjects', icon: 'book' },
        { to: '/app/teacher/question-bank', label: 'Question bank', icon: 'book' },
        { to: '/app/teacher/generate', label: 'Generate paper', icon: 'file' },
        { to: '/app/teacher/guess-paper', label: 'Guess paper', icon: 'spark' },
        { to: '/app/teacher/papers', label: 'My papers', icon: 'file' },
        { to: '/app/teacher/editor', label: 'Paper editor', icon: 'template' },
        { to: '/app/teacher/templates', label: 'Templates', icon: 'template' },
      ],
    },
  ],
}
