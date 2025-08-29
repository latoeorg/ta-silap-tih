import axiosInstance from "@/utils/axios"
import { toast } from "vue-sonner"

const form = {
  "subjectId": "",
  "examType": "",
  "weight": 0,
  "quota": 0,
}

const assessmentWeight = {
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
      context.commit("SET_LOADING", { key: "reports", value: true })
      try {
        const result = await axiosInstance({
          url: `/assessment-weight`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        })

        const reports = result.data?.data || []

        reports.forEach(report => {
          if (report.weight <= 1 && report.weight > 0) {
            report.weight = report.weight * 100
          }
        })
        context.commit("SET_REPORTS", reports)

        if (result.data && result.data.pagination) {
          context.commit("SET_TABLE_OPTIONS", {
            page: result.data.pagination.page,
            page_size: result.data.pagination.page_size,
            total_pages: result.data.pagination.total_pages,
            total_items: result.data.pagination.total_items,
          })
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Gagal memuat bobot penilaian')
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    getReport: async (context, assessmentWeight_id) => {
      context.commit("SET_LOADING", { key: "report", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/assessment-weight/${assessmentWeight_id}`,
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        context.commit("SET_LOADING", { key: "report", value: false })
      }
    },
    create: async (context, payload) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const apiData = { ...payload, weight: payload.weight / 100 }

        const result = await axiosInstance({
          method: "POST",
          url: `/assessment-weight`,
          data: apiData,
        })

        toast.success(result.data.message || "Bobot penilaian berhasil dibuat.")
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal membuat bobot penilaian.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    update: async (context, payload) => {
      // This action is now mainly for internal use by updateBulk
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const assessmentWeight_id = payload?.id
        const data = payload?.data
        const apiData = { ...data, weight: data.weight / 100 }

        const result = await axiosInstance({
          method: "PUT",
          url: `/assessment-weight/${assessmentWeight_id}`,
          data: apiData,
        })

        
        return result.data
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || `Gagal memperbarui bobot penilaian.`)
        throw error // Re-throw to be caught by Promise.all in updateBulk
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    updateBulk: async (context, weightsToUpdate) => {
      context.commit("SET_LOADING", { key: "reports", value: true })
      try {
        const updatePromises = weightsToUpdate.map(item => 
          context.dispatch('update', { id: item.id, data: item.data }),
        )

        await Promise.all(updatePromises)
        toast.success("Semua bobot penilaian berhasil disimpan.")
        
        return true
      } catch (error) {
        console.error("Satu atau lebih pembaruan gagal:", error)
        toast.error("Terjadi kesalahan saat menyimpan. Harap periksa kembali nilai dan coba lagi.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
    delete: async (context, assessmentWeight_id) => {
      context.commit("SET_LOADING", { key: "reports", value: true })
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/assessment-weight/${assessmentWeight_id}`,
        })

        toast.success(result.data.message || "Bobot penilaian berhasil dihapus.")
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal menghapus bobot penilaian.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },
  },
}

export default assessmentWeight
