<template>
  <div>
    <VCard title="Class Groups">
      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Search..."
              append-inner-icon="tabler-search"
            />
          </div>

          <VBtn @click="handleDrawerForm(true)">
            <VIcon start icon="tabler-plus" />
            Add Class
          </VBtn>
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
          :items="reports"
          :loading="loading"
          class="text-no-wrap"
          @update:options="refetch"
        >
          <!-- Class Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VIcon size="22" icon="tabler-school" class="me-2" />
              <span class="text-body-1 font-weight-medium">{{
                item.name
              }}</span>
            </div>
          </template>

          <!-- Homeroom Teacher -->
          <template #item.homeroom="{ item }">
            <div class="d-flex align-center">
              <VIcon size="22" icon="tabler-user" class="me-2" />
              <span>{{ item.homeroom?.name || "No homeroom teacher" }}</span>
            </div>
          </template>

          <!-- Students Count -->
          <template #item.students="{ item }">
            <VChip size="small" color="primary">
              {{ item.students?.length || 0 }} students
            </VChip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1 justify-end">
              <IconBtn @click="viewStudents(item.id, item.name)">
                <VIcon icon="tabler-users" />
                <VTooltip activator="parent">View Students</VTooltip>
              </IconBtn>

              <IconBtn @click="handleUpdate(item.id)">
                <VIcon icon="tabler-edit" />
                <VTooltip activator="parent">Edit</VTooltip>
              </IconBtn>

              <IconBtn @click="handleDelete(item.id)">
                <VIcon icon="tabler-trash" />
                <VTooltip activator="parent">Delete</VTooltip>
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <!-- Class Form Drawer -->
    <ClassFormDrawer :open="drawerForm" @handle-close="handleDrawerForm" />

    <!-- Students Dialog -->
    <VDialog v-model="studentsDialog" max-width="800px">
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Students in {{ selectedClassName }}</span>
          <VBtn
            variant="text"
            icon="tabler-x"
            @click="studentsDialog = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <div class="d-flex justify-space-between align-center mb-4">
            <h4 class="text-h6">{{ selectedClassStudents.length }} Students</h4>
            <div class="d-flex gap-2">
              <VBtn
                v-if="selectedStudentsToRemove.length > 0"
                size="small"
                color="error"
                prepend-icon="tabler-trash"
                :loading="loadingRemoveStudents"
                @click="removeStudentsFromClass"
              >
                Remove Selected ({{ selectedStudentsToRemove.length }})
              </VBtn>
              
              <VBtn
                v-if="selectedClassId"
                size="small"
                prepend-icon="tabler-plus"
                @click="addStudentDialog = true"
              >
                Add Student
              </VBtn>
            </div>
          </div>
          
          <!-- Selected Students Chips - For Removal -->
          <div v-if="selectedStudentsToRemove.length > 0" class="mb-4">
            <VChipGroup class="student-chips">
              <VChip
                v-for="student in selectedStudentsToRemove"
                :key="student.id"
                closable
                color="error"
                variant="outlined"
                @click:close="toggleRemoveStudent(student)"
              >
                {{ student.name }}
              </VChip>
            </VChipGroup>
            <VDivider class="my-3" />
          </div>

          <!-- Student List -->
          <VDataTable
            v-if="selectedClassStudents.length"
            :headers="[
              { title: '', key: 'select', sortable: false, width: '60px' },
              { title: 'Name', key: 'name' },
              { title: 'Email', key: 'email' }
            ]"
            :items="selectedClassStudents"
            density="compact"
            class="elevation-1"
          >
            <!-- Select Column -->
            <template #item.select="{ item }">
              <VCheckbox
                :model-value="isStudentSelectedForRemoval(item)"
                @change="toggleRemoveStudent(item)"
                color="error"
                density="compact"
                hide-details
              />
            </template>
            
            <!-- Name Column -->
            <template #item.name="{ item }">
              <div class="d-flex align-center">
                <VAvatar size="30" color="primary" class="me-2">
                  <VIcon size="small" icon="tabler-user" />
                </VAvatar>
                {{ item.name }}
              </div>
            </template>
          </VDataTable>

          <div v-else class="text-center pa-4">
            <VIcon size="40" icon="tabler-mood-empty" class="mb-2" />
            <p>No students in this class yet</p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Add Student Dialog -->
    <VDialog v-model="addStudentDialog" max-width="700px">
      <VCard>
        <VCardTitle>
          <span>Add Students to {{ selectedClassName }}</span>
          <VBtn
            class="ms-auto"
            variant="text"
            icon="tabler-x"
            @click="addStudentDialog = false"
          />
        </VCardTitle>

        <VDivider />

        <VCardText>
          <!-- Selected Students Section -->
          <div v-if="selectedStudentsToAdd.length > 0" class="mb-4">
            <h4 class="text-subtitle-1 mb-2">Selected Students ({{ selectedStudentsToAdd.length }})</h4>
            <VChipGroup class="student-chips">
              <VChip
                v-for="student in selectedStudentsToAdd"
                :key="student.id"
                closable
                color="primary"
                @click:close="removeFromSelection(student)"
              >
                {{ student.name }}
              </VChip>
            </VChipGroup>
          </div>
          
          <VDivider v-if="selectedStudentsToAdd.length > 0" class="my-4" />
          
          <!-- Search Box -->
          <VTextField
            v-model="studentSearch"
            label="Search Students"
            prepend-inner-icon="tabler-search"
            density="compact"
            variant="outlined"
            class="mb-4"
          />

          <!-- Students Table -->
          <VDataTable
            :headers="studentHeaders"
            :items="filteredAvailableStudents"
            :loading="loadingAvailableStudents"
            item-value="id"
            class="elevation-1"
            density="compact"
            fixed-header
            height="300px"
          >
            <!-- Select Column -->
            <template #item.select="{ item }">
              <VCheckbox
                :model-value="isStudentSelected(item)"
                @change="toggleStudentSelection(item)"
                color="primary"
                density="compact"
                hide-details
              />
            </template>
            
            <!-- Name Column -->
            <template #item.name="{ item }">
              {{ item.name }}
            </template>
            
            <!-- Email Column -->
            <template #item.email="{ item }">
              {{ item.email }}
            </template>
          </VDataTable>
        </VCardText>

        <VCardActions>
          <div class="text-caption text-medium-emphasis">
            Available: {{ filteredAvailableStudents.length }} students
          </div>
          <VSpacer />
          <VBtn
            color="secondary"
            variant="tonal"
            @click="addStudentDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="primary"
            :loading="loadingAddStudents"
            :disabled="selectedStudentsToAdd.length === 0"
            @click="addStudentsToClass"
          >
            Add Selected ({{ selectedStudentsToAdd.length }})
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axios";
import { SwalDelete } from "@/utils/sweetalert";
import { useVuex } from "@/utils/vuex";
import { computed, onMounted, ref, watch } from "vue";
import { toast } from "vue-sonner";
import ClassFormDrawer from "./class-form-drawer.vue";
const headers = ref([
  { title: "Class Name", key: "name" },
  { title: "Homeroom Teacher", key: "homeroom" },
  { title: "Students", key: "students" },
  {
    title: "Created At",
    key: "createdAt",
    format: (value) => new Date(value).toLocaleDateString(),
  },
  { title: "Actions", align: "end", key: "actions", sortable: false },
]);

// Student headers for the selection table
const studentHeaders = ref([
  { title: "", key: "select", sortable: false, width: "60px" },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
]);

const store = useVuex();
const drawerForm = ref(false);
const studentsDialog = ref(false);
const addStudentDialog = ref(false);
const selectedClassId = ref(null);
const selectedClassName = ref("");
const selectedClassStudents = ref([]);
const selectedStudentsToAdd = ref([]);
const selectedStudentsToRemove = ref([]);
const loadingAvailableStudents = ref(false);
const loadingAddStudents = ref(false);
const loadingRemoveStudents = ref(false);
const studentSearch = ref("");

const loading = computed(() => store.state.class.loading.reports);
const reports = computed(() => store.state.class.reports);

// All students from the store
const storeStudents = computed(() => store.state.class.students || []);

// Available students (not already in class)
const availableStudents = computed(() => {
  const existingStudentIds = selectedClassStudents.value.map(s => s.id);
  return storeStudents.value.filter(student => 
    !existingStudentIds.includes(student.id)
  );
});

// Further filter by search term
const filteredAvailableStudents = computed(() => {
  if (!studentSearch.value) return availableStudents.value;
  
  const searchTerm = studentSearch.value.toLowerCase();
  return availableStudents.value.filter(student => 
    student.name?.toLowerCase().includes(searchTerm) || 
    student.email?.toLowerCase().includes(searchTerm)
  );
});

// Check if student is in selection
const isStudentSelected = (student) => {
  return selectedStudentsToAdd.value.some(s => s.id === student.id);
};

// Toggle student selection
const toggleStudentSelection = (student) => {
  if (isStudentSelected(student)) {
    removeFromSelection(student);
  } else {
    selectedStudentsToAdd.value.push(student);
  }
};

// Remove student from selection
const removeFromSelection = (student) => {
  selectedStudentsToAdd.value = selectedStudentsToAdd.value.filter(
    s => s.id !== student.id
  );
};

// Check if student is selected for removal
const isStudentSelectedForRemoval = (student) => {
  return selectedStudentsToRemove.value.some(s => s.id === student.id);
};

// Toggle student selection for removal
const toggleRemoveStudent = (student) => {
  if (isStudentSelectedForRemoval(student)) {
    selectedStudentsToRemove.value = selectedStudentsToRemove.value.filter(
      s => s.id !== student.id
    );
  } else {
    selectedStudentsToRemove.value.push(student);
  }
};

const table_options = computed({
  get: () => store.state.class.table_options,
  set: (value) => store.commit("class/SET_TABLE_OPTIONS", value),
});

const handleDrawerForm = async (value) => {
  if (value) {
    await store.dispatch("class/fetchBeforeForm");
  }
  drawerForm.value = value;
};

const handleUpdate = async (id) => {
  await store.dispatch("class/setFormUpdate", id);
  handleDrawerForm(true);
};

const handleDelete = async (id) => {
  const confirm = await SwalDelete({
    title: "Are you sure?",
    text: "This will delete the class and remove all student associations.",
    confirmButtonText: "Yes, delete class",
  });

  if (confirm) {
    await store.dispatch("class/delete", id).then((res) => {
      if (res) {
        refetch();
        
      }
    });
  }
};

// Improved viewStudents function to ensure fresh data
const viewStudents = async (classId, className) => {
  selectedClassId.value = classId;
  selectedClassName.value = className;

  // Reset all student lists
  selectedClassStudents.value = [];
  selectedStudentsToAdd.value = [];
  selectedStudentsToRemove.value = [];

  // Fetch students for this class using query parameters
  try {
    loadingAvailableStudents.value = true;
    
    // Update to use the user endpoint with query parameters
    const result = await axiosInstance({
      method: "GET",
      url: `/user`,
      params: {
        role: "STUDENT",
        class_group_id: classId,
        // Add a cache buster to ensure fresh data
        _t: new Date().getTime()
      }
    });
    
    selectedClassStudents.value = result.data.data || [];
    studentsDialog.value = true;
    
    console.log(`Loaded ${selectedClassStudents.value.length} students for class ${classId}`);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    toast.error("Failed to load class students");
  } finally {
    loadingAvailableStudents.value = false;
  }
};

// Refactored function to remove multiple students from class using store
const removeStudentsFromClass = async () => {
  if (!selectedStudentsToRemove.value.length) return;

  // Temporarily store the values we need
  const classId = selectedClassId.value;
  const studentIds = selectedStudentsToRemove.value.map(student => student.id);
  
  // Close the students dialog before showing confirmation
  studentsDialog.value = false;
  
  // Wait a moment to ensure the first dialog is fully closed
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Ask for confirmation
  const confirm = await SwalDelete({
    title: `Remove ${studentIds.length} students?`,
    text: "This will remove the selected students from this class.",
    confirmButtonText: "Yes, remove students",
  });

  if (!confirm) {
    // If cancelled, reopen the students dialog
    studentsDialog.value = true;
    return;
  }

  loadingRemoveStudents.value = true;
  
  try {
    // Process student removal using the store action
    await store.dispatch("class/removeStudentFromClass", {
      classId,
      studentIds
    });

    toast.success("Students successfully removed from class");

    // Reset selections
    selectedStudentsToRemove.value = [];
    
    // IMPORTANT: Refresh the main table first to update student counts
    await refetch();
    
    // Then reload the specific class's students
    await viewStudents(classId, selectedClassName.value);
    
  } catch (error) {
    console.error("Failed to remove students:", error);
    toast.error("Failed to remove students from class");
    studentsDialog.value = true;
  } finally {
    loadingRemoveStudents.value = false;
  }
};

// Refactored function to add students to class using store
const addStudentsToClass = async () => {
  if (!selectedStudentsToAdd.value.length) return;

  // Store the values we need
  const classId = selectedClassId.value;
  const studentIds = selectedStudentsToAdd.value.map(student => student.id);
  
  // Close dialog
  addStudentDialog.value = false;
  
  loadingAddStudents.value = true;

  try {
    // Use the store action to add students
    await store.dispatch("class/addStudentsToClass", {
      classId,
      studentIds
    });
    
    // Reset and show success
    selectedStudentsToAdd.value = [];
    studentSearch.value = "";
    
    // IMPORTANT: Refresh the main table first
    await refetch();
    
    // Then reload the specific class's students
    await viewStudents(classId, selectedClassName.value);
    
  } catch (error) {
    console.error("Failed to add students:", error);
    studentsDialog.value = true;
  } finally {
    loadingAddStudents.value = false;
  }
};

// Improved fetchAvailableStudents to pass classId for proper filtering
const fetchAvailableStudents = async () => {
  try {
    // Pass the current class ID to ensure proper filtering
    await store.dispatch("class/fetchStudents", {
      classId: selectedClassId.value
    });
  } catch (error) {
    console.error("Failed to fetch available students:", error);
  }
};

// Add this watch for addStudentDialog to fetch students when opened
watch(() => addStudentDialog.value, async (isOpen) => {
  if (isOpen && selectedClassId.value) {
    await fetchAvailableStudents();
  }
});

const refetch = () => store.dispatch("class/getReports");

onMounted(() => {
  refetch();
  store.dispatch("class/fetchBeforeForm");
});
</script>

<style scoped>
.student-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
