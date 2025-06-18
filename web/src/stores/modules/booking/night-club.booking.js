import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const form = {
  date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substr(0, 10),
  table_id: null,

  pronoun: 'Mr',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  birth_date: '',
  nationality: '',
  note: '',
}

const nightClubBooking = {
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

    list_table: [],
    table: {},

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
          url: `/booking/night-club`,
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
          url: `/booking/night-club/${booking_id}`,
          method: "GET",
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    async FetchBeforeForm(context) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        const tables = await axiosInstance({
          url: `/night-club-table`,
          method: "GET",
          params: {
            page: 1,
            page_size: 100,
          },
        })

        context.state.list_table = tables.data.data
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    async OnChangeTable(context, table_id) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        const tables = await axiosInstance({
          url: `/night-club-table/${table_id}`,
          method: "GET",
        })

        context.state.table = tables.data.data
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
          url: `/booking/night-club`,
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
  },
}

export default nightClubBooking
