import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const file = {
  namespaced: true,
  state: {
    loading: {
      reports: false,
      modal_reports: false,
      form: false,
    },
    type_list: ['IMAGE', 'ICON', 'VIDEO', 'MEDIA'],
    type: 'IMAGE',
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
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value
    },
    SET_TYPE(state, payload) {
      state.type = payload
    },
    SET_OPTIONS_TABLE(state, payload) {
      Object.assign(state.table_options, payload)
    },
    SET_REPORTS(state, payload) {
      state.reports = payload
    },
  },
  actions: {
    async GetReports(context, params) {
      context.commit("SET_LOADING", {
        key: "reports",
        value: true,
      })

      try {
        const result = await axiosInstance({
          url: `/content/file`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,

            type: context.state.type,
          },
        })

        context.commit("SET_REPORTS", result.data.data)
        
        context.commit("SET_OPTIONS_TABLE", {
          page: result.data.pagination.page,
          page_size: result.data.pagination.page_size,
          total_pages: result.data.pagination.total_pages,
          total_items: result.data.pagination.total_items,
        })

      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", {
          key: "reports",
          value: false,
        })
      }
    },
    async GetFileInfinityScroll(context, params) {
      context.commit("SET_LOADING", {
        key: "modal_reports",
        value: true,
      })

      try {
        const result = await axiosInstance({
          url: `/content/file`,
          method: "GET",
          params: {
            search: params.search,
            page: params.page,
            page_size: params.page_size,
            type: params.type,
          },
        })

        return result.data
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", {
          key: "modal_reports",
          value: false,
        })
      }
    },
    async BulkUpload(context, payload){
      context.commit('SET_LOADING', {
        key: 'form',
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: 'POST',
          url: `/content/file`,
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.success(result.data.message)
        context.dispatch('GetReports')
        
        return true
      } catch (error) {
        console.log(error)

        toast.error(error.response.data.message)
      } finally {
        context.commit('SET_LOADING', {
          key: 'form',
          value: false,
        })
      }
    },
    async Delete(context, file_id){
      context.commit('SET_LOADING', {
        key: 'form',
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: 'DELETE',
          url: `/content/file/${file_id}`,
        })

        toast.success(result.data.message)
        context.dispatch('GetReports')
        
        return true
      } catch (error) {
        console.log(error)

        toast.error(error.response.data.message)
      } finally {
        context.commit('SET_LOADING', {
          key: 'form',
          value: false,
        })
      }
    },
  },
}

export default file
