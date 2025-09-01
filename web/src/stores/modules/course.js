import axiosInstance from "@/utils/axios"
import { toast } from "vue-sonner"

// Initial state for the course form
const form = {
  name: "",
  subjectId: "",
  teacherId: "",
  classGroupId: "",
}

const course = {
  namespaced: true,
  state: {
    loading: {
      courses: false, // Renamed from reports
      course: false,  // Renamed from report
      form: false,
    },
    table_options: {
      page: 1,
      page_size: 5,
      total_pages: 0,
      total_items: 0,
      search: "",
    },
    courses: [], // Renamed from reports
    course: {},  // Renamed from report

    // Lists to populate form dropdowns
    list_subject: [],
    list_teacher: [],
    list_class_group: [],

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
    SET_COURSES(state, payload) { // Renamed from SET_REPORTS
      state.courses = payload
    },
    SET_COURSE(state, payload) { // Renamed from SET_REPORT
      state.course = payload
    },
    
    SET_LIST_SUBJECT(state, payload) {
      state.list_subject = payload
    },
    SET_LIST_TEACHER(state, payload) {
      state.list_teacher = payload
    },
    SET_LIST_CLASS_GROUP(state, payload) {
      state.list_class_group = payload
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
    getCourses: async (context, params) => { // Renamed from getReports
      context.commit("SET_LOADING", { key: "courses", value: true })
      try {
        const result = await axiosInstance({
          url: `/course`, // Changed endpoint
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        })

        context.commit("SET_COURSES", result.data.data) // Use SET_COURSES
        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination.page,
          page_size: result.data.pagination.page_size,
          total_pages: result.data.pagination.total_pages,
          total_items: result.data.pagination.total_items,
        })
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to fetch courses")
      } finally {
        context.commit("SET_LOADING", { key: "courses", value: false })
      }
    },
    getCourse: async (context, course_id) => { // Renamed from getReport
      context.commit("SET_LOADING", { key: "course", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/course/${course_id}`, // Changed endpoint
        })

        context.commit("SET_COURSE", result.data.data) // Use SET_COURSE
      } catch (error) {
        console.log(error)
      } finally {
        context.commit("SET_LOADING", { key: "course", value: false })
      }
    },
    fetchPrerequisites: async context => { // Renamed and adapted from fetchBeforeForm
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        // Fetch subjects and teachers in parallel
        const [subjectsRes, teachersRes, classGroupRes] = await Promise.all([
          axiosInstance({ method: "GET", url: `/subject`, params: { page_size: 100 } }),
          axiosInstance({ method: "GET", url: `/user`, params: { page_size: 100, role: 'TEACHER' } }),
          axiosInstance({ method: "GET", url: `/class-group`, params: { page_size: 100 } }),

        ])
        
        context.commit("SET_LIST_SUBJECT", subjectsRes.data.data)
        context.commit("SET_LIST_TEACHER", teachersRes.data.data)
        context.commit("SET_LIST_CLASS_GROUP", classGroupRes.data.data)

      } catch (error) {
        console.log(error)
        toast.error("Failed to load form prerequisites")
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    create: async context => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "POST",
          url: `/course`, // Changed endpoint
          data: context.state.form,
        })

        toast.success(result.data.message)
        context.dispatch("getCourses")
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to create course")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    setFormUpdate: async (context, course_id) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/course/${course_id}`, // Changed endpoint
        })

        const data = result.data.data

        context.commit("SET_IS_UPDATE", course_id)
        context.commit("RESET_FORM")

        // Set form fields based on course data
        context.commit("SET_FORM", { key: "id", value: course_id })
        context.commit("SET_FORM", { key: "name", value: data.name || "" })
        context.commit("SET_FORM", { key: "subjectId", value: data.subjectId || "" })
        context.commit("SET_FORM", { key: "teacherId", value: data.teacherId || "" })
        context.commit("SET_FORM", { key: "classGroupId", value: data.classGroupId || "" })
      } catch (error) {
        console.log(error)
        toast.error("Failed to load course data for editing")
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    update: async context => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const course_id = context.state.is_update
        const data = { name: context.state.form.name } // Only send updatable fields as per docs

        const result = await axiosInstance({
          method: "PUT",
          url: `/course/${course_id}`, // Changed endpoint
          data: data,
        })

        toast.success(result.data.message)
        context.dispatch("getCourses")
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to update course")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    delete: async (context, course_id) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/course/${course_id}`, // Changed endpoint
        })

        toast.success(result.data.message)
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    
    updateStudents: async (context, { courseId, studentIds }) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/course/${courseId}/students`,
          data: { studentIds },
        })

        toast.success(result.data.message)
        context.dispatch("getCourse", courseId)
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to update course students")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
  },
}

export default course
