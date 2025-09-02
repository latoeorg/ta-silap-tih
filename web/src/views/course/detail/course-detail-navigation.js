export const CourseDetailTab = {
  summary: 'summary',
  students: 'students',
  attendance: 'attendance',
  grades: 'grades',
  assessmentWeight: 'assessmentWeight',
}

export const CourseDetailTabs = [
  {
    icon: 'tabler-file-text',
    title: 'Ringkasan',
    tab: CourseDetailTab.summary,
  },
  {
    icon: 'tabler-users-group',
    title: 'Siswa',
    tab: CourseDetailTab.students,
  },
  {
    icon: 'tabler-calendar-check',
    title: 'Absensi',
    tab: CourseDetailTab.attendance,
  },
  {
    icon: 'tabler-certificate',
    title: 'Nilai',
    tab: CourseDetailTab.grades,
  },
  {
    icon: 'tabler-scale',
    title: 'Bobot Penilaian',
    tab: CourseDetailTab.assessmentWeight,
  },
]
