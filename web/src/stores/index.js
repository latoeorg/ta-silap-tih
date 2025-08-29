import { Store } from 'vuex'

import app from './modules/app'

import dashboard from './modules/dashboard'

import subject from './modules/subject'

import profile from './modules/profile'
import setting from './modules/setting'
import user from './modules/user'

import setup from './modules/setup'

import classGroup from './modules/class'

const store = new Store({
  modules: {
    app,
    dashboard,
    subject,
    profile,
    setting,
    user,
    setup,
    class: classGroup,
  },
})

export default store
