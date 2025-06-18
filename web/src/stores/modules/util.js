import axiosInstance from '@/utils/axios'
import { toast } from 'vue-sonner'

const util = {
  namespaced: true,
  state: {
    loading: {
      countries: false,
    },
    countries: [],
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value
    },
  },
  actions: {
    async getCountries(context) {
      context.commit("SET_LOADING", { key: "countries", value: true })

      try {
        const result = await axiosInstance({
          url: `/util/country`,
          method: "GET",
        })

        context.state.countries = result.data.data
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING", { key: "countries", value: false })
      }
    },
  },
}

export default util
