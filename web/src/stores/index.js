import { Store } from 'vuex'

import app from './modules/app'

import dashboard from './modules/dashboard'

import assessmentWeight from './modules/assessment-weight'
import course from './modules/course'
import subject from './modules/subject'

import classGroup from './modules/class'

import profile from './modules/profile'
import setting from './modules/setting'
import user from './modules/user'


const store = new Store({
  modules: {
    app,
    dashboard,
    
    course,
    subject,
    assessmentWeight,
    
    class: classGroup,
    profile,
    setting,
    user,
  },
})

export default store
