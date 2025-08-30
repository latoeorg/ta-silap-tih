import { IsCan } from "@/utils/permission"

export default [
  { 
    heading: 'Main',     
  },
  {
    title: 'Beranda',
    icon: { icon: 'tabler-smart-home' },
    to: { name: 'root' },
  },
  {
    title: 'Penilaian',
    icon: { icon: 'tabler-clipboard-list' },
    to: { name: 'course' },
  },
  { 
    heading: 'Pengaturan',     
  },
  {
    title: 'Kelas',
    icon: { icon: 'tabler-school' },
    to: { name: 'class' },
    hidden: !IsCan("GET_CLASS"),
  },
  {
    title: "Mata Pelajaran",
    icon: { icon: 'tabler-book' },
    to: { name: 'subject' },
    hidden: !IsCan("GET_SUBJECT"),
  },
  {
    title: "Pengguna",
    icon: { icon: 'tabler-users' },
    to: { name: 'user' },
    hidden: !IsCan("GET_USER"),
  },

  // {
  //   title: 'Pengaturan',
  //   icon: { icon: 'tabler-settings' },
  //   to: { name: 'settings' },
  //   hidden: !IsCan("GET_SETTINGS"),
  // },
].map(item => {
  if (item.children) {
    item.children = item.children.filter(child => !child.hidden)
  }

  return item
}).filter(item => !item.hidden)
