import { IsCan, hasRole } from "@/utils/permission"

export default [
  {
    heading: "Main",
  },
  {
    title: "Beranda",
    icon: { icon: "tabler-smart-home" },
    to: { name: "root" },
  },
  {
    title: "Penilaian",
    icon: { icon: "tabler-clipboard-list" },
    to: { name: "course" },
    hidden: !IsCan("GET_COURSE"),
  },
  {
    heading: "Setup",
    hidden: hasRole("STUDENT"), // Hide entire section for students
  },
  {
    title: "Kelas",
    icon: { icon: "tabler-school" },
    to: { name: "class" },
    hidden: !IsCan("GET_CLASS"),
  },
  {
    title: "Jurusan",
    icon: { icon: "tabler-book" },
    to: { name: "subject" },
    hidden: !IsCan("GET_SUBJECT"),
  },
  {
    heading: "User Management",
    hidden: !IsCan("GET_USER"), // Only admin can see this
  },
  {
    title: "Guru",
    icon: { icon: "tabler-users" },
    to: { name: "user-teacher" },
    hidden: !IsCan("GET_USER"), // Only admin can see this
  },
  {
    title: "Siswa",
    icon: { icon: "tabler-users" },
    to: { name: "user-student" },
    hidden: !IsCan("GET_USER"), // Only admin can see this
  },

  // {
  //   title: "Pengaturan",
  //   icon: { icon: "tabler-settings" },
  //   to: { name: "settings" },
  //   hidden: !IsCan("GET_SETTINGS"), // Only admin can see this
  // },
]
  .map(item => {
    if (item.children) {
      item.children = item.children.filter(child => !child.hidden)
    }

    return item
  })
  .filter(item => !item.hidden)
