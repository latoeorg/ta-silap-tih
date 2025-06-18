import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const form = {
  name: '',
  description: '',
  
  api_url: '/',
  api_method: 'GET',
  
  roles: [],
}

const permission = {
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
    reports: [],
    report: '',

    form: { ...form },
    is_update: false,
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
    SET_IS_UPDATE(state, payload) {
      state.is_update = payload
    },
  },
  actions: {
    async getReports(context, params) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        // const result = await axiosInstance({
        //   url: `/permission`,
        //   method: "GET",
        //   params: {
        //     ...params,
        //     search: context.state.table_options.search,
        //     page: context.state.table_options.page,
        //     page_size: context.state.table_options.page_size,
        //   },
        // })

        // context.commit("SET_REPORTS", result.data.data)

        // context.commit("SET_TABLE_OPTIONS", {
        //   page: result.data.pagination.page,
        //   page_size: result.data.pagination.page_size,
        //   total_pages: result.data.pagination.total_pages,
        //   total_items: result.data.pagination.total_items,
        // })

      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    async store(context) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/permission`,
          method: "POST",
          data: context.state.form,
        })

        toast.success(result.data.message)
        context.dispatch("getReports")

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async setFormUpdate(context, id) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/permission/${id}`,
          method: "GET",
        })

        context.state.form = {
          name: result.data.data.name,
          description: result.data.data.description,

          api_url: result.data.data.api_url,
          api_method: result.data.data.api_method,

          roles: result.data.data.roles.map(role => role.role_name),
        }

        context.commit("SET_IS_UPDATE", id)

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async update(context, id) {
      context.commit("SET_LOADING", { key: "form", value: true })

      try {
        const result = await axiosInstance({
          url: `/permission/${id}`,
          method: "PUT",
          data: context.state.form,
        })

        toast.success(result.data.message)
        context.dispatch("getReports")

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
  },
}

export default permission
