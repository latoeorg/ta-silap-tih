import axiosInstance from "@/utils/axios"
import { toast } from 'vue-sonner'

const app = {
  state: {
    loading: false,
    user: "",
    token: "",

    permissions: [],
  },
  mutations: {
    SET_LOADING_APP(state, payload) {
      state.loading = payload
    },
    SET_USER_APP(state, payload) {
      state.user = payload
    },
    SET_TOKEN_APP(state, payload) {
      state.token = payload
    },
    
    SET_PERMISSIONS_APP(state, payload) {
      state.permissions = payload
    },
  },
  actions: {
    async Login(context, payload) {
      context.commit("SET_LOADING_APP", true)

      try {
        const result = await axiosInstance({
          url: `/login`,
          method: "POST",
          data: {
            email: payload?.uid,
            password: payload?.password,
          },
        })
        context.commit("SET_USER_APP", result.data.data.user)
        localStorage.setItem("App-User", JSON.stringify(result.data.data.user))

        context.commit("SET_TOKEN_APP", result.data.data.token)
        localStorage.setItem("App-Token", result.data.data.token)

        window.location.href = "/"

        return true
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING_APP", false)
      }
    },
    async Logout(context) {
      context.commit("SET_USER_APP", "")
      localStorage.removeItem("App-User")

      context.commit("SET_TOKEN_APP", "")
      localStorage.removeItem("App-Token")

      context.commit("SET_PERMISSIONS_APP", [])
      localStorage.removeItem("App-Permissions")

      window.location.href = "/login"
    },

    async FetchPermissions(context) {
      context.commit("SET_LOADING_APP", true)

      try {
        // const result = await axiosInstance({
        //   url: `/permission`,
        //   method: "GET",
        //   params: {
        //     page_size: 1000,
        //   },
        // })

        // context.commit("SET_PERMISSIONS_APP", result.data.data)
        // localStorage.setItem("App-Permissions", JSON.stringify(result.data.data))
      } catch (error) {
        toast.error(error.response.data.message)
      } finally {
        context.commit("SET_LOADING_APP", false)
      }
    },
  },
}

export default app
