export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  INSTITUTE_ADMIN: 'institute_admin',
  TEACHER: 'teacher',
}

export const ROLE_META = {
  [ROLES.SUPER_ADMIN]: {
    label: 'Super Admin',
    home: '/app/admin',
    previewName: 'Platform preview',
  },
  [ROLES.INSTITUTE_ADMIN]: {
    label: 'Institute Admin / Principal',
    home: '/app/institute',
    previewName: 'Principal preview',
    instituteName: 'Preview Institute',
  },
  [ROLES.TEACHER]: {
    label: 'Teacher',
    home: '/app/teacher',
    previewName: 'Teacher preview',
    instituteName: 'Preview Institute',
    assignedSubjects: ['Mathematics'],
  },
}
