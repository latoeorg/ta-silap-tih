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
    title: "Mata Pelajaran",
    icon: { icon: 'tabler-book' },
    to: { name: 'subject' },
    hidden: !IsCan("GET_SUBJECT"),
  },
  { 
    heading: 'Setup',     
  },
  {
    title: 'Kelas',
    icon: { icon: 'tabler-school' },
    to: { name: 'class' },
    hidden: !IsCan("GET_CLASS"),
  },
  {
    title: "Manajemen User",
    icon: { icon: 'tabler-user' },
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
