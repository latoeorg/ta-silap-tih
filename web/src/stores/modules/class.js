import axiosInstance from "@/utils/axios"
import { toast } from "vue-sonner"

const form = {
  name: "",
  homeroomId: "",
}

const classGroup = {
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
    
    teachers: [], // For homeroom teacher selection
    students: [], // For student assignment
    
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
    SET_TEACHERS(state, payload) {
      state.teachers = payload
    },
    SET_STUDENTS(state, payload) {
      state.students = payload
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
          url: `/class-group`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
            // Add cache buster for fresh results
            _t: new Date().getTime()
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
        toast.error(error.response?.data?.message || "Failed to fetch class groups")
      } finally {
        context.commit("SET_LOADING", {
          key: "reports",
          value: false,
        })
      }
    },

    getReport: async (context, classId) => {
      context.commit("SET_LOADING", {
        key: "report",
        value: true,
      })
      
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/class-group/${classId}`,
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to fetch class details")
      } finally {
        context.commit("SET_LOADING", {
          key: "report",
          value: false,
        })
      }
    },

    fetchBeforeForm: async (context) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      
      try {
        // Fetch teachers for homeroom selection
        const teacherResult = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: {
            role: "TEACHER",
            page_size: 100, // Get more teachers
          }
        })

        context.commit("SET_TEACHERS", teacherResult.data.data)
        
        const studentResult = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: {
            role: "STUDENT",
            page_size: 100, // Get more students
          }
        })

        context.commit("SET_STUDENTS", studentResult.data.data)
      } catch (error) {
        console.log(error)
        toast.error("Failed to load form data")
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },

    create: async (context) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        const data = context.state.form

        const result = await axiosInstance({
          method: "POST",
          url: `/class-group`,
          data: {
            name: data.name,
            homeroomId: data.homeroomId,
          },
        })

        toast.success(result.data.message || "Class created successfully")
        context.dispatch("getReports")

        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to create class")
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    setFormUpdate: async (context, classId) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/class-group/${classId}`,
        })

        const data = result.data.data

        context.commit("SET_IS_UPDATE", classId)

        // Reset form first
        context.commit("RESET_FORM")

        // Use SET_FORM mutation for each field
        context.commit("SET_FORM", { key: "id", value: classId })
        context.commit("SET_FORM", { key: "name", value: data.name || "" })
        context.commit("SET_FORM", { key: "homeroomId", value: data.homeroomId || "" })
        
        // If there are students assigned, you might want to handle that too
        // context.commit("SET_FORM", { key: "students", value: data.students || [] })
      } catch (error) {
        console.log(error)
        toast.error("Failed to load class data")
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    update: async (context, classId) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        const data = context.state.form

        const result = await axiosInstance({
          method: "PUT",
          url: `/class-group/${classId}`,
          data: {
            name: data.name,
            homeroomId: data.homeroomId,
          },
        })

        toast.success(result.data.message || "Class updated successfully")
        context.dispatch("getReports")

        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to update class")
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    delete: async (context, classId) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/class-group/${classId}`,
        })

        toast.success(result.data.message || "Class deleted successfully")
        context.dispatch("getReports")
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to delete class")
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    // Additional methods for managing students in a class
    addStudentsToClass: async (context, { classId, studentIds }) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/class-group/${classId}/students`,
          data: {
            studentIds: Array.isArray(studentIds) ? studentIds : [studentIds],
          },
        })

        toast.success(result.data.message || "Students added to class successfully")
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to add students to class")
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    removeStudentFromClass: async (context, { classId, studentIds }) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      })
      
      try {
        // Handle single studentId or array of studentIds
        const idsArray = Array.isArray(studentIds) ? studentIds : [studentIds];
        
        // Process each student removal
        const promises = idsArray.map(studentId => 
          axiosInstance({
            method: "DELETE",
            url: `/class-group/${classId}/students/${studentId}`,
          })
        );
        
        // Wait for all removals to complete
        await Promise.all(promises);
        
        toast.success("Students removed from class successfully");
        
        // Refresh the class report to update student counts
        await context.dispatch("getReport", classId);
        
        return true
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Failed to remove students from class")
        return false
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        })
      }
    },

    // Get students in a class
    getClassStudents: async (context, classId) => {
      context.commit("SET_LOADING", {
        key: "report",
        value: true,
      })
      
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: {
            role: "STUDENT",
            class_group_id: classId,
            page_size: 100,
          }
        });

        // Save to store for reference
        context.commit("SET_REPORT", { ...context.state.report, students: result.data.data });
        return result.data.data;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to fetch class students");
        return [];
      } finally {
        context.commit("SET_LOADING", {
          key: "report",
          value: false,
        });
      }
    },

    fetchStudents: async (context, { classId } = {}) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      
      try {
        // Fetch students not in this class
        const result = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: {
            role: "STUDENT",
            class_group_id_not: classId,
            page_size: 100,
            // Add cache buster for fresh results
            _t: new Date().getTime()
          }
        });

        context.commit("SET_STUDENTS", result.data.data);
        return result.data.data;
      } catch (error) {
        console.log(error);
        toast.error("Failed to load students");
        return [];
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },
  },
}

export default classGroup
