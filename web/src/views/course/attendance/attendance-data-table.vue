<template>
  <div>
    <VCard :title="title">
      <VDivider />

      <VCardText>
        <div class="d-flex align-end justify-between flex-wrap gap-4">
          <div class="d-flex align-center gap-4">
            <div style="inline-size: 20rem">
              <AppTextField
                v-model="table_options.search"
                density="compact"
                label="Cari siswa"
                placeholder="Cari siswa..."
                append-inner-icon="tabler-search"
              />
            </div>

            <VSelect
              v-if="!courseId"
              v-model="selectedCourse"
              :items="courses"
              item-title="name"
              item-value="id"
              label="Pilih Kursus"
              density="compact"
              style="inline-size: 15rem"
              clearable
            />

            <AppDateTimePicker
              v-model="selectedDate"
              label="Tanggal"
              density="compact"
              style="inline-size: 10rem"
            />
          </div>

          <div class="d-flex gap-2">
            <VBtn
              v-if="!hideAddButton"
              variant="outlined"
              @click="handleBatchForm"
            >
              <VIcon start icon="tabler-users-plus" />
              Absensi Massal
            </VBtn>

            <VBtn v-if="!hideAddButton" @click="handleDrawerForm(true)">
              <VIcon start icon="tabler-plus" />
              Tambah Absensi
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="px-0 pt-0">
        <VDataTableServer
          v-model:options="table_options"
          v-model:items-per-page="table_options.page_size"
          v-model:page="table_options.page"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="attendances"
          :loading="loading"
          class="text-no-wrap"
          @update:options="refetch"
        >
          <template #item.user="{ item }">
            <div class="d-flex align-center gap-3">
              <VAvatar size="32">
                <VImg
                  :src="item.user?.avatar || '/images/avatars/avatar-1.png'"
                  :alt="item.user?.name"
                />
              </VAvatar>
              <div>
                <div class="text-body-1 font-weight-medium">
                  {{ item.user?.name }}
                </div>
                <div class="text-caption text-disabled">
                  {{ item.user?.email }}
                </div>
              </div>
            </div>
          </template>

          <template #item.course="{ item }">
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ item.course?.name }}
              </div>
              <div class="text-caption text-disabled">
                {{ item.course?.subject?.name }}
              </div>
            </div>
          </template>

          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="getStatusColor(item.status)"
              size="small"
              variant="tonal"
            >
              {{ getStatusText(item.status) }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex gap-1 justify-end">
              <IconBtn @click="handleUpdate(item)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="handleDelete(item)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <!-- Single Attendance Form -->
    <AttendanceFormDrawer
      v-if="!hideAddButton"
      :open="drawerForm"
      :course-id="courseId"
      @handle-close="handleDrawerForm"
      @on-submit-success="refetch"
    />

    <!-- Batch Attendance Form -->
    <AttendanceBatchModal
      v-if="!hideAddButton"
      :open="batchModal"
      :course-id="courseId || selectedCourse"
      @handle-close="handleBatchForm"
      @on-submit-success="refetch"
    />
  </div>
</template>

<script setup>
import { SwalDelete } from "@/utils/sweetalert";
import { computed, onMounted, ref, watch } from "vue";
import AttendanceBatchModal from "./attendance-batch-modal.vue";
import AttendanceFormDrawer from "./attendance-form-drawer.vue";

const props = defineProps({
  hideAddButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Pengurusan Absensi",
  },
  courseId: {
    type: String,
    default: "",
  },
});

const store = useVuex();

// Local state
const drawerForm = ref(false);
const batchModal = ref(false);
const selectedCourse = ref("");
const selectedDate = ref("");

// Computed properties
const loading = computed(() => store.state.attendance.loading.attendances);
const attendances = computed(() => store.state.attendance.attendances);
const courses = computed(() => store.state.attendance.list_courses);
const searchQuery = ref("");

const table_options = computed({
  get: () => store.state.attendance.table_options,
  set: (val) => store.commit("attendance/SET_TABLE_OPTIONS", val),
});

// Table headers
const headers = ref(
  [
    { title: "Siswa", key: "user", sortable: false },
    { title: "Kursus", key: "course", sortable: false },
    { title: "Tanggal", key: "date" },
    { title: "Status", key: "status" },
    { title: "Tindakan", key: "actions", align: "end", sortable: false },
  ].filter((h) => !(props.courseId && h.key === "course"))
);

// Methods
const refetch = async () => {
  const params = {
    ...(props.courseId ? { course_id: props.courseId } : {}),
    ...(selectedCourse.value ? { course_id: selectedCourse.value } : {}),
    ...(selectedDate.value ? { date: selectedDate.value } : {}),
  };

  await store.dispatch("attendance/getAttendances", params);
};

const handleDrawerForm = (value) => {
  if (value) {
    store.dispatch("attendance/fetchPrerequisites");
  }
  drawerForm.value = value;
};

const handleBatchForm = () => {
  batchModal.value = !batchModal.value;
};

const handleUpdate = async (item) => {
  await store.dispatch("attendance/setFormUpdate", {
    userId: item.userId,
    courseId: item.courseId,
    attendance: item,
  });
  handleDrawerForm(true);
};

const handleDelete = async (item) => {
  const confirm = await SwalDelete();
  if (confirm) {
    const success = await store.dispatch("attendance/delete", {
      userId: item.userId,
      courseId: item.courseId,
    });

    if (success) {
      refetch();
    }
  }
};

// Utility functions
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "PRESENT":
      return "success";
    case "ABSENT":
      return "error";
    case "EXCUSED":
      return "warning";
    case "SICK":
      return "info";
    default:
      return "default";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "PRESENT":
      return "Hadir";
    case "ABSENT":
      return "Tidak Hadir";
    case "EXCUSED":
      return "Izin";
    case "SICK":
      return "Sakit";
    default:
      return status;
  }
};

// Watchers
watch(
  [selectedCourse, selectedDate],
  () => {
    refetch();
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  refetch();
  store.dispatch("attendance/fetchPrerequisites");
});
</script>
