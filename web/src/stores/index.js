import { Store } from 'vuex'

import app from './modules/app'

import calendar from './modules/calendar'
import dashboard from './modules/dashboard'

import booking from './modules/booking'
import booster from './modules/booster'
import subject from './modules/subject'

import menu from './modules/menu'
import night_club_table from './modules/night-club-table'

import content from './modules/content'
import event from './modules/event'
import lead from './modules/lead'
import profile from './modules/profile'
import setting from './modules/setting'
import user from './modules/user'

import database from './modules/database'
import setup from './modules/setup'
import util from './modules/util'

import service from './modules/service'

import classGroup from './modules/class'

const store = new Store({
  modules: {
    app,
    dashboard,
    calendar,

    booking,

    booster,

    menu,
    night_club_table,

    event,

    service,
    subject,

    lead,
    content,
    user,
    setting,
    profile,

    database,
    setup,
    util,
    class: classGroup,
  },
})

export default store
