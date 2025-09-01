import axiosInstance from "@/utils/axios";
import { toast } from "vue-sonner";

const form_profile = {
  first_name: "",
  last_name: "",
  photo: null,
  phone: "",
  birth_date: null,
};

const form_profile_preview = {
  photo: null,
};

const profile = {
  namespaced: true,
  state: {
    loading: {
      report: false,
      form: false,
    },
    report: [],

    form_profile: { ...form_profile },
    form_profile_preview: { ...form_profile_preview },
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value;
    },
    SET_REPORT(state, payload) {
      state.report = payload;
    },

    SET_FORM_PROFILE(state, payload) {
      state.form_profile[payload.key] = payload.value;
    },
    SET_FORM_PROFILE_PREVIEW(state, payload) {
      state.form_profile_preview[payload.key] = payload.value;
    },
    RESET_FORM_PROFILE(state) {
      state.form_profile = { ...form_profile };
      state.form_profile_preview = { ...form_profile_preview };
    },
  },
  actions: {
    async SetFormUpdateProfile(context) {
      context.commit("SET_LOADING", {
        key: "report",
        value: true,
      });

      try {
        const result = await axiosInstance({
          url: `/auth/profile`,
          method: "GET",
        });

        const data = result.data.data;

        context.state.form_profile = {
          first_name: data.first_name,
          last_name: data.last_name,
          photo: null,
          phone: data.phone,
          birth_date: data.birth_date,
        };

        context.state.form_profile_preview = {
          photo: data.photo,
        };
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        context.commit("SET_LOADING", {
          key: "report",
          value: false,
        });
      }
    },
    async UpdateProfile(context) {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/user/profile/update`,
          data: context.state.form_profile,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        context.commit("SET_USER_APP", result.data.data);
        localStorage.setItem("App-User", JSON.stringify(result.data.data));

        toast.success(result.data.message);

        return true;
      } catch (error) {
        console.log(error);

        toast.error(error.response.data.message);
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },
    async ChangePassword(context, payload) {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        await axiosInstance({
          method: "PUT",
          url: `/profile/change-password`,
          data: payload,
        });

        toast.success("Password has been changed");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },

    async updateStudentProfile(context, payload) {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/user/profile/update`,
          data: payload,
        });

        toast.success("Profil berhasil diperbarui");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Gagal memperbarui profil"
        );
        return false;
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },
  },
};

export default profile;
