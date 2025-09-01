import axiosInstance from "@/utils/axios";
import { toast } from "vue-sonner";

const form = {
  date: "",
  status: "PRESENT",
  userId: "",
  courseId: "",
};

const batchForm = {
  date: "",
  courseId: "",
  attendances: [], // Array of { userId, status }
};

const attendance = {
  namespaced: true,
  state: {
    loading: {
      attendances: false,
      attendance: false,
      form: false,
      batch: false,
    },
    table_options: {
      page: 1,
      page_size: 10,
      total_pages: 0,
      total_items: 0,
      search: "",
    },
    attendances: [],
    attendance: {},

    // Lists for form dropdowns
    list_students: [],
    list_courses: [],

    form: { ...form },
    batchForm: { ...batchForm },
    is_update: false,

    // Status options
    statusOptions: [
      { title: "Hadir", value: "PRESENT" },
      { title: "Tidak Hadir", value: "ABSENT" },
      { title: "Izin", value: "EXCUSED" },
      { title: "Sakit", value: "SICK" },
    ],
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value;
    },
    SET_TABLE_OPTIONS(state, payload) {
      Object.assign(state.table_options, payload);
    },
    SET_ATTENDANCES(state, payload) {
      state.attendances = payload;
    },
    SET_ATTENDANCE(state, payload) {
      state.attendance = payload;
    },

    SET_LIST_STUDENTS(state, payload) {
      state.list_students = payload;
    },
    SET_LIST_COURSES(state, payload) {
      state.list_courses = payload;
    },

    SET_FORM(state, payload) {
      state.form[payload.key] = payload.value;
    },
    SET_BATCH_FORM(state, payload) {
      state.batchForm[payload.key] = payload.value;
    },
    SET_BATCH_ATTENDANCE(state, { index, key, value }) {
      if (state.batchForm.attendances[index]) {
        state.batchForm.attendances[index][key] = value;
      }
    },
    RESET_FORM(state) {
      state.form = { ...form };
    },
    RESET_BATCH_FORM(state) {
      state.batchForm = { ...batchForm };
    },
    SET_IS_UPDATE(state, payload) {
      state.is_update = payload;
    },
  },
  actions: {
    getAttendances: async (context, params) => {
      context.commit("SET_LOADING", { key: "attendances", value: true });
      try {
        const result = await axiosInstance({
          url: `/attandance`,
          method: "GET",
          params: {
            ...params,
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        });

        context.commit("SET_ATTENDANCES", result.data.data);
        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination?.page || 1,
          page_size: result.data.pagination?.page_size || 10,
          total_pages: result.data.pagination?.total_pages || 0,
          total_items: result.data.pagination?.total_items || 0,
        });
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch attendance data"
        );
      } finally {
        context.commit("SET_LOADING", { key: "attendances", value: false });
      }
    },

    fetchPrerequisites: async (context) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axiosInstance({
            method: "GET",
            url: `/user`,
            params: { page_size: 100, role: "STUDENT" },
          }),
          axiosInstance({
            method: "GET",
            url: `/course`,
            params: { page_size: 100 },
          }),
        ]);

        context.commit("SET_LIST_STUDENTS", studentsRes.data.data);
        context.commit("SET_LIST_COURSES", coursesRes.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load form prerequisites");
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    create: async (context) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "POST",
          url: `/attandance`,
          data: context.state.form,
        });

        toast.success(result.data.message);
        context.dispatch("getAttendances");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to create attendance"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    batchCreate: async (context) => {
      context.commit("SET_LOADING", { key: "batch", value: true });
      try {
        const attendanceData = context.state.batchForm.attendances.map(
          (attendance) => ({
            date: context.state.batchForm.date,
            courseId: context.state.batchForm.courseId,
            userId: attendance.userId,
            status: attendance.status,
          })
        );

        const result = await axiosInstance({
          method: "POST",
          url: `/attandance/batch`,
          data: { attendances: attendanceData },
        });

        toast.success(result.data.message);
        context.dispatch("getAttendances");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to create batch attendance"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "batch", value: false });
      }
    },

    update: async (context, { userId, courseId }) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/attandance/${userId}/${courseId}`,
          data: { status: context.state.form.status },
        });

        toast.success(result.data.message);
        context.dispatch("getAttendances");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to update attendance"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    delete: async (context, { userId, courseId }) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/attandance/${userId}/${courseId}`,
        });

        toast.success(result.data.message);

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to delete attendance"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    setFormUpdate: async (context, { userId, courseId, attendance }) => {
      context.commit("SET_IS_UPDATE", { userId, courseId });
      context.commit("RESET_FORM");

      context.commit("SET_FORM", { key: "date", value: attendance.date || "" });
      context.commit("SET_FORM", {
        key: "status",
        value: attendance.status || "PRESENT",
      });
      context.commit("SET_FORM", { key: "userId", value: userId });
      context.commit("SET_FORM", { key: "courseId", value: courseId });
    },

    createOrUpdate: async (context, { userId, courseId, date, status }) => {
      try {
        // First try to update existing attendance
        try {
          const result = await axiosInstance({
            method: "PUT",
            url: `/attandance/${userId}/${courseId}`,
            data: {
              date,
              status,
            },
          });
          return true;
        } catch (updateError) {
          // If update fails (likely because record doesn't exist), create new one
          if (updateError.response?.status === 404) {
            const result = await axiosInstance({
              method: "POST",
              url: `/attandance`,
              data: {
                userId,
                courseId,
                date,
                status,
              },
            });
            return true;
          } else {
            throw updateError;
          }
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to save attendance"
        );
        return false;
      }
    },

    prepareBatchForm: async (context, { courseId }) => {
      context.commit("SET_LOADING", { key: "batch", value: true });
      try {
        // Get students for the course
        const studentsRes = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: { course_id: courseId, role: "STUDENT", page_size: 100 },
        });

        const students = studentsRes.data.data;

        const attendances = students.map((student) => ({
          userId: student.id,
          userName: `${student.name}`,
          status: "PRESENT",
        }));

        context.commit("RESET_BATCH_FORM");
        context.commit("SET_BATCH_FORM", { key: "courseId", value: courseId });
        context.commit("SET_BATCH_FORM", {
          key: "attendances",
          value: attendances,
        });

        return true;
      } catch (error) {
        console.log(error);
        toast.error("Failed to prepare batch form");

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "batch", value: false });
      }
    },
  },
};

export default attendance;
