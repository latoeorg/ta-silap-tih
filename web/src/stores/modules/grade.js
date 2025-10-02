import axiosInstance from "@/utils/axios";
import { toast } from "vue-sonner";

const form = {
  examType: "",
  courseId: "",
  userId: "",
  totalScore: 0,
};

const batchForm = {
  examType: "",
  courseId: "",
  grades: [], // Array of { userId, totalScore }
};

const componentForm = {
  gradeId: "",
  components: [], // Array of { score, index }
};

const grade = {
  namespaced: true,
  state: {
    loading: {
      grades: false,
      grade: false,
      form: false,
      batch: false,
      components: false,
    },
    table_options: {
      page: 1,
      page_size: 10,
      total_pages: 0,
      total_items: 0,
      search: "",
    },
    grades: [],
    grade: {},
    gradeComponents: [],
    computedComponents: [],

    // Lists for form dropdowns
    list_students: [],
    list_courses: [],

    form: { ...form },
    batchForm: { ...batchForm },
    componentForm: { ...componentForm },
    is_update: false,

    // Exam type options
    examTypeOptions: [
      { title: "Harian", value: "DAILY" },
      { title: "Kuis", value: "QUIZ" },
      { title: "UTS", value: "MID_TERM" },
      { title: "UAS", value: "FINAL" },
      { title: "Tugas", value: "ASSIGNMENT" },
    ],
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.loading[payload.key] = payload.value;
    },
    SET_TABLE_OPTIONS(state, payload) {
      Object.assign(state.table_options, payload);
    },
    SET_GRADES(state, payload) {
      state.grades = payload;
    },
    SET_GRADE(state, payload) {
      state.grade = payload;
    },
    SET_GRADE_COMPONENTS(state, payload) {
      state.gradeComponents = payload;
    },
    SET_COMPUTED_COMPONENTS(state, payload) {
      state.computedComponents = payload;
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
    SET_COMPONENT_FORM(state, payload) {
      state.componentForm[payload.key] = payload.value;
    },
    SET_BATCH_GRADE(state, { index, key, value }) {
      if (state.batchForm.grades[index]) {
        state.batchForm.grades[index][key] = value;
      }
    },
    SET_COMPONENT_ITEM(state, { index, key, value }) {
      if (state.componentForm.components[index]) {
        state.componentForm.components[index][key] = value;
      }
    },
    ADD_COMPONENT_ITEM(state, component = { score: 0, index: 1 }) {
      state.componentForm.components.push(component);
    },
    REMOVE_COMPONENT_ITEM(state, index) {
      state.componentForm.components.splice(index, 1);
    },
    RESET_FORM(state) {
      state.form = { ...form };
    },
    RESET_BATCH_FORM(state) {
      state.batchForm = { ...batchForm };
    },
    RESET_COMPONENT_FORM(state) {
      state.componentForm = { ...componentForm };
    },
    SET_IS_UPDATE(state, payload) {
      state.is_update = payload;
    },
  },
  actions: {
    getGrades: async (context, params) => {
      context.commit("SET_LOADING", { key: "grades", value: true });
      try {
        const result = await axiosInstance({
          url: `/grade`,
          method: "GET",
          params: {
            ...params,
            include: "components", // Include components in the response
            search: context.state.table_options.search,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        });

        context.commit("SET_GRADES", result.data.data);
        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination?.page || 1,
          page_size: result.data.pagination?.page_size || 10,
          total_pages: result.data.pagination?.total_pages || 0,
          total_items: result.data.pagination?.total_items || 0,
        });
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch grade data"
        );
      } finally {
        context.commit("SET_LOADING", { key: "grades", value: false });
      }
    },

    getMyGrades: async (context, params) => {
      context.commit("SET_LOADING", { key: "grades", value: true });
      try {
        const result = await axiosInstance({
          url: `/grade/my-grades`,
          method: "GET",
          params: {
            ...params,
            page: context.state.table_options.page,
            page_size: context.state.table_options.page_size,
          },
        });

        context.commit("SET_GRADES", result.data.data);
        context.commit("SET_TABLE_OPTIONS", {
          page: result.data.pagination?.page || 1,
          page_size: result.data.pagination?.page_size || 10,
          total_pages: result.data.pagination?.total_pages || 0,
          total_items: result.data.pagination?.total_items || 0,
        });
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch your grades"
        );
      } finally {
        context.commit("SET_LOADING", { key: "grades", value: false });
      }
    },

    getGradeComponents: async (context) => {
      context.commit("SET_LOADING", { key: "components", value: true });
      try {
        const result = await axiosInstance({
          url: `/gradeComponent`,
          method: "GET",
        });

        context.commit("SET_GRADE_COMPONENTS", result.data.data);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch grade components"
        );
      } finally {
        context.commit("SET_LOADING", { key: "components", value: false });
      }
    },

    getComputedComponents: async (context) => {
      context.commit("SET_LOADING", { key: "components", value: true });
      try {
        const result = await axiosInstance({
          url: `/grade/components`,
          method: "GET",
        });

        context.commit("SET_COMPUTED_COMPONENTS", result.data.data);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to fetch computed components"
        );
      } finally {
        context.commit("SET_LOADING", { key: "components", value: false });
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
        // Transform data to match backend expectations
        const requestData = {
          userId: context.state.form.userId,
          course_id: context.state.form.courseId,
          exam_type: context.state.form.examType,
          totalScore: context.state.form.totalScore,
        };

        const result = await axiosInstance({
          method: "POST",
          url: `/grade`,
          data: requestData,
        });

        toast.success(result.data.message);
        context.dispatch("getGrades");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to create grade");

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    batchCreate: async (context) => {
      context.commit("SET_LOADING", { key: "batch", value: true });
      try {
        const gradeData = context.state.batchForm.grades.map((grade) => ({
          exam_type: context.state.batchForm.examType,
          course_id: context.state.batchForm.courseId,
          userId: grade.userId,
          totalScore: grade.totalScore,
        }));

        const result = await axiosInstance({
          method: "POST",
          url: `/grade/batch`,
          data: { grades: gradeData },
        });

        toast.success(result.data.message);
        context.dispatch("getGrades");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to create batch grades"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "batch", value: false });
      }
    },

    update: async (context, { userId, courseId, examType }) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/grade/${userId}/${courseId}/${examType}`,
          data: { totalScore: context.state.form.totalScore },
        });

        toast.success(result.data.message);
        context.dispatch("getGrades");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to update grade");

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    delete: async (context, { userId, courseId, examType }) => {
      context.commit("SET_LOADING", { key: "form", value: true });
      try {
        const result = await axiosInstance({
          method: "DELETE",
          url: `/grade/${userId}/${courseId}/${examType}`,
        });

        toast.success(result.data.message);

        return true;
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to delete grade");

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "form", value: false });
      }
    },

    defineComponents: async (context) => {
      context.commit("SET_LOADING", { key: "components", value: true });
      try {
        const result = await axiosInstance({
          method: "POST",
          url: `/gradeComponent/define`,
          data: context.state.componentForm,
        });

        toast.success(result.data.message);
        context.dispatch("getGradeComponents");

        return true;
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Failed to define grade components"
        );

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "components", value: false });
      }
    },

    setFormUpdate: async (context, { userId, courseId, examType, grade }) => {
      context.commit("SET_IS_UPDATE", { userId, courseId, examType });
      context.commit("RESET_FORM");

      context.commit("SET_FORM", { key: "examType", value: examType });
      context.commit("SET_FORM", { key: "courseId", value: courseId });
      context.commit("SET_FORM", { key: "userId", value: userId });
      context.commit("SET_FORM", {
        key: "totalScore",
        value: grade.totalScore || 0,
      });
    },

    prepareBatchForm: async (context, { courseId, examType }) => {
      context.commit("SET_LOADING", { key: "batch", value: true });
      try {
        // Get students for the course
        const studentsRes = await axiosInstance({
          method: "GET",
          url: `/user`,
          params: { course_id: courseId, role: "STUDENT", page_size: 100 },
        });

        const students = studentsRes.data.data;

        const grades = students.map((student) => ({
          userId: student.id,
          userName: `${student.name}`,
          totalScore: 0,
        }));

        context.commit("RESET_BATCH_FORM");
        context.commit("SET_BATCH_FORM", { key: "courseId", value: courseId });
        context.commit("SET_BATCH_FORM", { key: "examType", value: examType });
        context.commit("SET_BATCH_FORM", { key: "grades", value: grades });

        return true;
      } catch (error) {
        console.log(error);
        toast.error("Failed to prepare batch form");

        return false;
      } finally {
        context.commit("SET_LOADING", { key: "batch", value: false });
      }
    },

    updateComponent: async (
      context,
      { userId, courseId, examType, componentIndex, score }
    ) => {
      try {
        const result = await axiosInstance({
          method: "PUT",
          url: `/grade/component`,
          data: {
            userId,
            courseId,
            examType,
            componentIndex,
            score,
          },
        });

        toast.success(
          result.data.message || "Grade component updated successfully"
        );

        return true;
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to update grade component"
        );

        return false;
      }
    },
  },
};

export default grade;
