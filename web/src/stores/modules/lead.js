import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const lead = {
  namespaced: true,
  state: {
    loading: {
      reports: false,
      report: false,
      form: false,
    },
    table_options: {
      page: 1,
      page_size: 5,
      total_pages: 0,
      total_items: 0,

      search: '',
    },
    reports: [],
  },
  mutations: {
    SET_LOADING_LEAD(state, payload) {
      state.loading[payload.key] = payload.value
    },
    SET_TABLE_OPTIONS(state, payload) {
      Object.assign(state.table_options, payload)
    },
    SET_REPORTS_LEAD(state, payload) {
      state.reports = payload
    },
  },
  actions: {
    async GetReports(context, params) {
      context.commit("SET_LOADING_LEAD", { key: "reports", value: true })

      try {
        const result = await axiosInstance({
          url: `/lead`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        })

        context.commit("SET_REPORTS_LEAD", result.data.data)

        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination.page,
          page_size: result.data.pagination.page_size,
          total_pages: result.data.pagination.total_pages,
          total_items: result.data.pagination.total_items,
        })
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING_LEAD", { key: "reports", value: false })
      }
    },
  },
}

export default lead
