import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const form = {
  thumbnail: null,
  title: '',
  content: '',
  max_guest: 0,
  price: 0,
  
  facilities: [],
}

const nightClubTable = {
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
          url: `/night-club-table`,
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
    async Create(context) {
      context.commit("SET_LOADING", { key: "form", value: true })
    
      try {
        const result = await axiosInstance({
          url: `/night-club-table`,
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
    async SetFormUpdate(context, id){
      context.commit("SET_LOADING", { key: "form", value: true })
    
      try {
        const result = await axiosInstance({
          url: `/night-club-table/${id}`,
          method: "GET",
        })
    
        const data = result.data.data

        context.state.form = {
          thumbnail: data.thumbnail,
          title: data.title,
          content: data.content,
          max_guest: data.max_guest,
          price: data.price,
          facilities: data.facilities?.map(item => item.facility_id),
        }
    
        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async Update(context, id) {
      context.commit("SET_LOADING", { key: "form", value: true })
      
      try {
        const result = await axiosInstance({
          url: `/night-club-table/${id}`,
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
    async Delete(context, id) {
      context.commit("SET_LOADING", { key: "form", value: true })
      
      try {
        const result = await axiosInstance({
          url: `/night-club-table/${id}`,
          method: "DELETE",
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

export default nightClubTable
