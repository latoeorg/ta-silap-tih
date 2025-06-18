import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const form = {
  date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substr(0, 10),
  area: '',
  num_guest: 1,
  time: '07:00 PM',

  pronoun: 'Mr',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  birth_date: '',
  nationality: '',
  note: '',
}

const restaurantBooking = {
  namespaced: true,
  state: {
    loading: {
      reports: false,
      report: false,
      form: false,
    },
    table_options: {
      page: 1,
      page_size: 100,
      total_pages: 0,
      total_items: 0,

      search: '',
    },

    list_area: ['Lounge Bar', 'Dining Room', 'Lounge Dining'],
    list_time: ['07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'],

    reports: [],
    report: '',

    form: { ...form },
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value
    },
    SET_TABLE_OPTIONS(state, payload) {
      Object.assign(state.table_options, payload)
    },
    SET_REPORTS(state, payload) {
      state.reports = payload
    },
    SET_REPORT(state, payload) {
      state.report = payload
    },

    SET_FORM(state, payload) {
      state.form[payload.key] = payload.value
    },
    RESET_FORM(state) {
      state.form = { ...form }
    },
  },
  actions: {
    async GetReports(context, params) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        const result = await axiosInstance({
          url: `/booking/restaurant`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        })

        context.commit("SET_REPORTS", result.data.data)

        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination.page,
          page_size: result.data.pagination.page_size,
          total_pages: result.data.pagination.total_pages,
          total_items: result.data.pagination.total_items,
        })

      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    async GetReport(context, booking_id) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        const result = await axiosInstance({
          url: `/booking/restaurant/${booking_id}`,
          method: "GET",
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    async Create(context) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/booking/restaurant`,
          method: "POST",
          data: context.state.form,
        })

        toast.success(result.data.message)
        context.dispatch("GetReports")

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async SetFormUpdate(context, booking_id) {
      context.commit("SET_LOADING", { key: "form", value: true })
  
      try {
        const result = await axiosInstance({
          url: `/booking/restaurant/${booking_id}`,
          method: "GET",
        })
  
        const data = result.data.data
  
        context.state.form = {
          date: data.date,
          num_guest: data.num_guest,
          time: data.time,
        
          pronoun: data.pronoun,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          birth_date: data.birth_date,
          nationality: data.nationality,
          note: data.note,
        }
  
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async Update(context, booking_id) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/booking/restaurant/${booking_id}`,
          method: "PUT",
          data: context.state.form,
        })

        toast.success(result.data.message)
        context.dispatch("GetReports")

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async UpdateStatus(context, { booking_id, status }) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/booking/restaurant/status/${booking_id}`,
          method: "PUT",
          data: { status },
        })

        toast.success(result.data.message)
        context.dispatch("GetReports")

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
  },
}

export default restaurantBooking
