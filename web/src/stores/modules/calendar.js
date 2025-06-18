import axiosInstance from '@/utils/axios'

const calendar = {
  namespaced: true,
  state: {
    loading: {
      reports: false,
      report: false,
    },
    filter: [
      {
        color: 'error',
        label: 'Night Club Reservation',
        key: 'NC',
        value: true,
      },
      {
        color: 'success',
        label: 'Restaurant Reservation',
        key: 'RS',
        value: true,
      },

      // {
      //   color: 'info',
      //   label: 'Event',
      //   key: 'event',
      //   value: true,
      // },
    ],

    reports: [],
    report: {},
    report_booking: {},
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value
    },
    SET_FILTER(state, payload) {
      state.filter = payload
    },
    SET_ALL_FILTER(state, value) {
      state.filter.forEach(item => {
        item.value = value
      })
    },

    SET_REPORTS(state, payload) {
      state.reports = payload
    },
    SET_REPORT(state, payload) {
      state.report = payload
    },
    SET_REPORT_BOOKING(state, payload) {
      state.report_booking = payload
    },
    RESET_REPORT(state) {
      state.report = {}
      state.report_booking = {}

    },
  },
  actions: {
    async GetReports(context, payload){
      context.commit('SET_LOADING', {
        key: 'reports',
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: 'GET',
          url: `/calendar`,
          params: {
            ...payload,
          },
        })

        context.commit("SET_REPORTS", result.data.data)
        

        return result.data.data
      } catch (error) {
        console.log(error)
      } finally {
        context.commit('SET_LOADING', {
          key: 'reports',
          value: false,
        })
      }
    },
    async GetReport(context, calendar_id){
      context.commit('SET_LOADING', {
        key: 'report',
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: 'GET',
          url: `/calendar/${calendar_id}`,
        })

        context.commit('SET_REPORT', result.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        context.commit('SET_LOADING', {
          key: 'report',
          value: false,
        })
      }
    }, 
  },
}

export default calendar
