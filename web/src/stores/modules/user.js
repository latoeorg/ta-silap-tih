import axiosInstance from "@/utils/axios";
import { toast } from "vue-sonner";

const form = {
  name: "",
  email: "",
  password: "",
  role: "",
};

const user = {
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

    list_role: [],

    form: { ...form },
    is_update: false,
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value;
    },
    SET_TABLE_OPTIONS(state, payload) {
      Object.assign(state.table_options, payload);
    },
    SET_REPORTS(state, payload) {
      state.reports = payload;
    },
    SET_REPORT(state, payload) {
      state.report = payload;
    },

    SET_FORM(state, payload) {
      state.form[payload.key] = payload.value;
    },
    RESET_FORM(state) {
      state.form = { ...form };
    },
    SET_IS_UPDATE(state, payload) {
      state.is_update = payload;
    },
  },
  actions: {
    getReports: async (context, params) => {
      context.commit("SET_LOADING", {
        key: "reports",
        value: true,
      });

      try {
        const result = await axiosInstance({
          url: `/user`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        });

        context.commit("SET_REPORTS", result.data.data);

        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination.page,
          page_size: result.data.pagination.page_size,
          total_pages: result.data.pagination.total_pages,
          total_items: result.data.pagination.total_items,
        });
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        context.commit("SET_LOADING", {
          key: "reports",
          value: false,
        });
      }
    },
    getReport: async (context, user_id) => {
      context.commit("SET_LOADING", {
        key: "report",
        value: true,
      });
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user/${user_id}`,
        });

        context.commit("SET_REPORT", result.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        context.commit("SET_LOADING", {
          key: "report",
          value: false,
        });
      }
    },
    fetchBeforeForm: async (context) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user/role`,
        });

        context.state.list_role = result.data.data;
      } catch (error) {
        console.log(error);
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },
    create: async (context, payload) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        // Use provided payload or fall back to form state
        const data = payload || context.state.form;

        // Convert from component format to API format if payload is provided
        const apiData = payload || data;

        const result = await axiosInstance({
          method: "POST",
          url: `/user`,
          data: apiData,
        });

        toast.success(result.data.message);
        context.dispatch("getReports");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to create user");
        return false;
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },
    setFormUpdate: async (context, user_id) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        const result = await axiosInstance({
          method: "GET",
          url: `/user/${user_id}`,
        });

        const data = result.data.data;

        context.commit("SET_IS_UPDATE", user_id);

        // Reset form first
        context.commit("RESET_FORM");

        // Use SET_FORM mutation for each field
        console.log(data);
        context.commit("SET_FORM", { key: "id", value: user_id }); // Add ID field
        context.commit("SET_FORM", { key: "name", value: data.name || "" });
        context.commit("SET_FORM", { key: "email", value: data.email || "" });
        context.commit("SET_FORM", { key: "role", value: data.role || "" });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user data");
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },
    update: async (context, payload) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        // Extract ID and data from payload if provided
        const user_id = payload?.id || context.state.is_update;
        const data = payload?.data || context.state.form;
        
        const result = await axiosInstance({
          method: "PUT",
          url: `/user/${user_id}`,
          data: data,
        });

        toast.success(result.data.message);
        context.dispatch("getReports");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to update user");
        return false;
      } finally {
        context.commit("SET_LOADING", {
          key: "form",
          value: false,
        });
      }
    },
    delete: async (context, user_id) => {
      context.commit("SET_LOADING", {
        key: "form",
        value: true,
      });
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/user/${user_id}`,
        });

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
  },
};

export default user;
