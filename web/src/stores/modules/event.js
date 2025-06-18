import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const form = {
  thumbnail: null,
  title: '',
  content: '',
  category: '',
  start_date: new Date(),
  end_date: new Date(),
  
  redirect_url: '',
}

const event = {
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
    report: {},

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
          url: `/event`,
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
    async GetReport(context, id) {
      context.commit("SET_LOADING", { key: "reports", value: true })

      try {
        const result = await axiosInstance({
          url: `/event/${id}`,
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
          url: `/event`,
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
    async SetFormUpdate(context, event_id){
      context.commit("SET_LOADING", { key: "form", value: true })
    
      try {
        const result = await axiosInstance({
          url: `/event/${event_id}`,
          method: "GET",
        })
    
        const data = result.data.data

        context.state.form = {
          thumbnail: data.thumbnail,
          title: data.title,
          content: data.content,
          category: data.category,
          start_date: data.start_date,
          end_date: data.end_date,

          redirect_url: data.redirect_url,
        }
    
        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    async Update(context, event_id) {
      context.commit("SET_LOADING", { key: "form", value: true })
      
      try {
        const result = await axiosInstance({
          url: `/event/${event_id}`,
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
    async Delete(context, event_id) {
      context.commit("SET_LOADING", { key: "form", value: true })
      
      try {
        const result = await axiosInstance({
          url: `/event/${event_id}`,
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

export default event
