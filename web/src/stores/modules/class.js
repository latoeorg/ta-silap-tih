import axiosInstance from "@/utils/axios"
import { toast } from "vue-sonner"

// Bentuk data dasar untuk form pembuatan/pembaruan rombel
const form = {
  name: "",
  homeroomId: "", // ID untuk Wali Kelas
}

const classGroup = {
  namespaced: true,
  state: {
    // State untuk indikator loading pada berbagai operasi
    loading: {
      reports: false, // untuk get all
      report: false,  // untuk get by id
      form: false,    // untuk create, update, delete
    },

    // Opsi untuk tabel (paginasi & pencarian)
    table_options: {
      page: 1,
      page_size: 10,
      total_pages: 0,
      total_items: 0,
      search: "",
    },

    // Daftar semua rombel
    reports: [],

    // Data satu rombel yang dipilih
    report: {},
    
    // Daftar guru untuk pilihan Wali Kelas
    list_teacher: [],
    
    // Data yang sedang diisi di form
    form: { ...form },

    // Flag untuk menandakan mode update, berisi ID rombel yang diupdate
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
    SET_LIST_TEACHER(state, payload) {
      state.list_teacher = payload
    },
    SET_FORM(state, payload) {
      state.form[payload.key] = payload.value
    },
    RESET_FORM(state) {
      state.form = { ...form }
      state.is_update = false
    },
    SET_IS_UPDATE(state, payload) {
      state.is_update = payload
    },
  },
  actions: {
    // Mengambil daftar semua rombel dari server
    getReports: async (context, params) => {
      context.commit("SET_LOADING", { key: "reports", value: true })
      try {
        const result = await axiosInstance({
          url: `/class-group`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        })

        context.commit("SET_REPORTS", result.data?.data || [])

        if (result.data && result.data.pagination) {
          context.commit("SET_TABLE_OPTIONS", result.data.pagination)
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Gagal memuat daftar Rombel')
      } finally {
        context.commit("SET_LOADING", { key: "reports", value: false })
      }
    },

    // Mengambil data satu rombel berdasarkan ID
    getReport: async (context, classGroupId) => {
      context.commit("SET_LOADING", { key: "report", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/class-group/${classGroupId}`,
        })

        context.commit("SET_REPORT", result.data.data)
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Gagal memuat data Rombel')
      } finally {
        context.commit("SET_LOADING", { key: "report", value: false })
      }
    },
    
    getStudentIds: async (context, classGroupId) => {
      context.commit("SET_LOADING", { key: "report", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/class-group/${classGroupId}/students`,
        })

        return result.data.data
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Gagal memuat data Rombel')
      } finally {
        context.commit("SET_LOADING", { key: "report", value: false })
      }
    },
    
    // Mengambil data yang diperlukan sebelum menampilkan form (misal: daftar guru)
    fetchBeforeForm: async context => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user`, // Asumsi endpoint untuk mengambil user
          params: { role: "TEACHER", page_size: 1000 }, // Mengambil semua guru
        })

        context.commit("SET_LIST_TEACHER", result.data.data)
      } catch (error) {
        console.error(error)
        toast.error("Gagal memuat daftar guru.")
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },

    // Membuat rombel baru
    create: async (context, payload) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "POST",
          url: `/class-group`,
          data: payload || context.state.form,
        })

        toast.success(result.data.message || "Rombel berhasil dibuat.")
        context.dispatch("getReports") // Refresh daftar rombel
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal membuat Rombel.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    
    // Menyiapkan form untuk mode update dengan data yang ada
    setFormUpdate: async (context, classGroupId) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/class-group/${classGroupId}`,
        })

        const data = result.data.data

        context.commit("SET_IS_UPDATE", classGroupId)
        context.commit("SET_FORM", { key: "name", value: data.name })
        context.commit("SET_FORM", { key: "homeroomId", value: data.homeroom.id })
      } catch (error) {
        console.error(error)
        toast.error("Gagal memuat data Rombel untuk diubah.")
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },

    // Memperbarui data rombel
    update: async (context, payload) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const classGroupId = context.state.is_update

        const result = await axiosInstance({
          method: "PUT",
          url: `/class-group/${classGroupId}`,
          data: payload || context.state.form,
        })

        toast.success(result.data.message || "Rombel berhasil diperbarui.")
        context.dispatch("getReports") // Refresh daftar rombel
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal memperbarui Rombel.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },

    // Menghapus rombel
    delete: async (context, classGroupId) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/class-group/${classGroupId}`,
        })

        toast.success(result.data.message || "Rombel berhasil dihapus.")
        context.dispatch("getReports") // Refresh daftar rombel
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal menghapus Rombel.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
    
    // Menambahkan/memperbarui siswa dalam rombel
    updateStudents: async (context, { classGroupId, studentIds }) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/class-group/${classGroupId}/students`,
          data: { studentIds },
        })

        toast.success(result.data.message || "Siswa berhasil ditambahkan ke rombel.")
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal menambahkan siswa.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },

    // Menghapus siswa dari rombel
    removeStudents: async (context, { classGroupId, studentIds }) => {
      context.commit("SET_LOADING", { key: "form", value: true })
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/class-group/${classGroupId}/students`,
          data: { studentIds },
        })

        toast.success(result.data.message || "Siswa berhasil dihapus dari rombel.")
        
        return true
      } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || "Gagal menghapus siswa.")
        
        return false
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false })
      }
    },
  },
}

export default classGroup
