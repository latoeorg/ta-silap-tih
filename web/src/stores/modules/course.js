import axiosInstance from "@/utils/axios"
import { toast } from "vue-sonner"

const form = {
  name: "",
  subjectId: "",
  teacherId: "",
}

const course = {
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

      search: "",
    },
    reports: [],
    report: {},

    list_teacher: [],

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
    getReports: async (context, params) => {
      context.commit("SET_LOADING", {
        key: "reports",
        value: true,
      })

      try {
        const result = await axiosInstance({
          url: `/course`,
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
        console.log(error)
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", {
          key: "reports",
          value: false,
        })
      }
    },
    getReport: async (context, course_id) => {
      context.commit("SET_LOADING", {
        key: "report",
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/course/${course_id}`,
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        context.commit("SET_LOADING", {
          key: "report",
          value: false,
        })
      }
    },
    fetchBeforeForm: async context => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: { role: "TEACHER", page_size: 100 },
        })

        context.state.list_teacher = result.data.data
      } catch (error) {
        console.log(error)
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    create: async (context, payload) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      try {
        // Use provided payload or fall back to form state
        const data = payload || context.state.form

        // Convert from component format to API format if payload is provided
        const apiData = payload || data

        const result = await axiosInstance({
          method: "POST",
          url: `/course`,
          data: apiData,
        })

        toast.success(result.data.message)
        context.dispatch("getReports", {
          subjectId: apiData.subjectId,
        })

        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to create course")
        
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },
    setFormUpdate: async (context, course_id) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/course/${course_id}`,
        })

        const data = result.data.data

        context.commit("SET_IS_UPDATE", course_id)

        // Reset form first
        context.commit("RESET_FORM")

        // Use SET_FORM mutation for each field
        context.commit("SET_FORM", { key: "name", value: data.name })
        context.commit("SET_FORM", { key: "subjectId", value: data.subjectId })
        context.commit("SET_FORM", { key: "teacherId", value: data.teacherId })
      } catch (error) {
        console.log(error)
        toast.error("Failed to load course data")
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },
    update: async (context, payload) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      try {
        // Extract ID and data from payload if provided
        const course_id = payload?.id || context.state.is_update
        const data = payload?.data || context.state.form
        
        const result = await axiosInstance({
          method: "PUT",
          url: `/course/${course_id}`,
          data: data,
        })

        toast.success(result.data.message)
        context.dispatch("getReports", {
          subjectId: data.subjectId,
        })

        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to update course")
        
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },
    delete: async (context, course_id) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/course/${course_id}`,
        })

        toast.success(result.data.message)

        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },
  },
}

export default course
