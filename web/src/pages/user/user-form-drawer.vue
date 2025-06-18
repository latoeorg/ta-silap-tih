<template>
  <VNavigationDrawer
    temporary
    location="end"
    :width="500" 
    :model-value="open"
    @update:model-value="handleClose"
  >
    <VCard class="h-100 overflow-auto">
      <VCardItem>
        <VCardTitle>
          {{ isEditMode ? 'Edit' : 'Add' }} User
        </VCardTitle>
        <template #append>
          <VBtn
            variant="text"
            color="default"
            icon="tabler-x"
            @click="handleClose"
          />
        </template>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <VCol cols="12">
              <VAlert
                v-if="showProfileFields"
                density="compact"
                type="info"
                variant="tonal"
                class="mb-4"
                icon="tabler-info-circle"
              >
                {{ selectedRole }} profile information will be created automatically.
              </VAlert>
            </VCol>

            <!-- Basic User Information -->
            <VCol cols="12">
              <div class="text-subtitle-1 font-weight-medium mb-2">Basic Information</div>
            </VCol>

            <!-- Name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                label="Full Name"
                :rules="[v => !!v || 'Name is required']"
                density="compact"
                variant="outlined"
              />
            </VCol>
            
            <!-- Email -->
            <VCol cols="12">
              <VTextField
                v-model="email"
                label="Email"
                type="email"
                :rules="[
                  v => !!v || 'Email is required',
                  v => /.+@.+\..+/.test(v) || 'Email must be valid'
                ]"
                density="compact"
                variant="outlined"
              />
            </VCol>

            <!-- Password (only shown when adding new user) -->
            <VCol
              v-if="!isEditMode"
              cols="12"
            >
              <VTextField
                v-model="password"
                label="Password"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                density="compact"
                variant="outlined"
              />
            </VCol>

            <!-- Role -->
            <VCol cols="12">
              <VSelect
                v-model="role"
                label="Role"
                :items="roleOptions"
                :rules="[v => !!v || 'Role is required']"
                density="compact"
                variant="outlined"
              />
            </VCol>

            <!-- Profile Fields Based on Role -->
            <template v-if="showProfileFields">
              <VCol cols="12" class="pt-3">
                <VDivider />
                <div class="text-subtitle-1 font-weight-medium my-2">
                  {{ selectedRole }} Profile Information
                </div>
              </VCol>

              <!-- Common Fields for Both Student and Teacher -->
              <VCol cols="12">
                <VTextField
                  v-model="profileData.birthPlace"
                  label="Birth Place"
                  density="compact"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="6">
                  <VTextField
                  v-model="profileData.birthDate"
                  label="Birth Date"
                  type="date"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VSelect
                  v-model="profileData.gender"
                  label="Gender"
                  :items="['MALE', 'FEMALE']"
                  density="compact"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField
                  v-model="profileData.phone"
                  label="Phone Number"
                  density="compact"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="profileData.address"
                  label="Address"
                  auto-grow
                  rows="2"
                  density="compact"
                  variant="outlined"
                />
              </VCol>

              <!-- Student-specific fields -->
              <template v-if="role === 'STUDENT'">
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.number"
                    label="NIK (Student ID)"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.fatherName"
                    label="Father's Name"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.motherName"
                    label="Mother's Name"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>
              </template>

              <!-- Teacher-specific fields -->
              <template v-else-if="role === 'TEACHER'">
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.number"
                    label="NIP (Teacher ID)"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.titlePrefix"
                    label="Title Prefix"
                    placeholder="e.g., Dr., Prof."
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.titleSuffix"
                    label="Title Suffix"
                    placeholder="e.g., PhD, M.Ed."
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileData.unit"
                    label="Unit/Department"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="profileData.religion"
                    label="Religion"
                    :items="religionOptions"
                    density="compact"
                    variant="outlined"
                  />
                </VCol>
              </template>

            
            </template>
          </VRow>

          <VCardActions class="pt-6">
            <VSpacer />
            <VBtn
              variant="tonal"
              color="secondary"
              @click="handleClose"
            >
              Cancel
            </VBtn>
            <VBtn
              type="submit"
              :loading="loading"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>

<script setup>
import { useVuex } from "@/utils/vuex";
import { computed, ref, watch } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['handleClose']);

const store = useVuex();
const formRef = ref(null);
const profilePictureFile = ref(null);
const profilePicturePreview = ref(null);

const loading = computed(() => store.state.user.loading.form);
const isEditMode = computed(() => Boolean(store.state.user.is_update))

// Role options
const roleOptions = ref([
  'ADMIN',
  'TEACHER',
  'STUDENT'
])

// Religion options
const religionOptions = ref([
  'ISLAM',
  'CHRISTIAN',
  'CATHOLIC',
  'HINDU',
  'BUDDHA',
  'KONGHUCU',
  'OTHER'
])

// Form fields using computed with getters and setters to match the store's structure
const name = computed({
  get: () => store.state.user.form.name,
  set: value => store.commit('user/SET_FORM', { key: 'name', value })
})

const email = computed({
  get: () => store.state.user.form.email,
  set: value => store.commit('user/SET_FORM', { key: 'email', value })
})

const password = computed({
  get: () => store.state.user.form.password,
  set: value => store.commit('user/SET_FORM', { key: 'password', value })
})

const role = computed({
  get: () => store.state.user.form.role,
  set: value => {
    store.commit('user/SET_FORM', { key: 'role', value });
    // Reset profile data when role changes
    if (value === 'ADMIN') {
      resetProfileData();
    }
  }
})

// Show profile fields for STUDENT or TEACHER
const showProfileFields = computed(() => 
  role.value === 'STUDENT' || role.value === 'TEACHER'
)

// Get proper role name for display
const selectedRole = computed(() => {
  return role.value ? role.value.charAt(0) + role.value.slice(1).toLowerCase() : '';
});

// Profile data ref (will be sent as profileData to the API)
const profileData = ref({
  birthPlace: '',
  birthDate: null,
  gender: null,
  address: '',
  phone: '',
  number: '',
  profilePicture: null,
  // Student fields
  fatherName: '',
  motherName: '',
  // Teacher fields
  titlePrefix: '',
  titleSuffix: '',
  religion: null,
  unit: '',
});

// Reset profile data
const resetProfileData = () => {
  profileData.value = {
    birthPlace: '',
    birthDate: null,
    gender: null,
    address: '',
    phone: '',
    number: '',
    profilePicture: null,
    fatherName: '',
    motherName: '',
    titlePrefix: '',
    titleSuffix: '',
    religion: null,
    unit: '',
  };
  profilePictureFile.value = null;
  profilePicturePreview.value = null;
};

// Handle profile picture change
// const handleProfilePictureChange = (file) => {
//   if (!file) {
//     profilePicturePreview.value = null;
//     profileData.value.profilePicture = null;
//     return;
//   }
  
//   // Create a preview URL
//   profilePicturePreview.value = URL.createObjectURL(file);
  
//   // Convert to base64 or handle according to your API requirements
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     profileData.value.profilePicture = e.target.result;
//   };
//   reader.readAsDataURL(file);
// };

// Handle close
const handleClose = () => {
  store.commit('user/SET_IS_UPDATE', false);
  store.commit('user/RESET_FORM');
  resetProfileData();
  emit('handleClose', false);
}

// Initialize form when drawer opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    store.dispatch('user/fetchBeforeForm');
    resetProfileData();
    
    // If editing, load profile data
    if (isEditMode.value) {
      loadUserProfileData();
    }
  }
}, { immediate: true })

// Load user profile data when editing
const loadUserProfileData = async () => {
  const userId = store.state.user.is_update;
  if (!userId) return;
  
  try {
    // Get user details including profile
    const result = await store.dispatch('user/getReport', userId);
    
    // If user has a profile, set the profile data
    const user = store.state.user.report;
    
    if (user.role === 'STUDENT' && user.studentProfile) {
      const profile = user.studentProfile;
      profileData.value = {
        birthPlace: profile.birthPlace || '',
        birthDate: profile.birthDate.split('T')[0] || null,
        gender: profile.gender || null,
        address: profile.address || '',
        phone: profile.phone || '',
        number: profile.number || '',
        fatherName: profile.fatherName || '',
        motherName: profile.motherName || '',
        // Keep other fields
        titlePrefix: '',
        titleSuffix: '',
        religion: null,
        unit: '',
      };
      
      // Set profile picture preview if exists
      if (profile.profilePicture) {
        profilePicturePreview.value = profile.profilePicture;
        profileData.value.profilePicture = profile.profilePicture;
      }
    } 
    else if (user.role === 'TEACHER' && user.teacherProfile) {
      const profile = user.teacherProfile;
      console.log(profile);
      profileData.value = {
        birthPlace: profile.birthPlace || '',
        birthDate: profile.birthDate.split('T')[0] || null,
        gender: profile.gender || null,
        address: profile.address || '',
        phone: profile.phone || '',
        number: profile.number || '',
        titlePrefix: profile.titlePrefix || '',
        titleSuffix: profile.titleSuffix || '',
        religion: profile.religion || null,
        unit: profile.unit || '',
        // Keep other fields
        fatherName: '',
        motherName: '',
      };
      
      // Set profile picture preview if exists
      if (profile.profilePicture) {
        profilePicturePreview.value = profile.profilePicture;
        profileData.value.profilePicture = profile.profilePicture;
      }
    }
  } catch (error) {
    console.error('Failed to load user profile data:', error);
  }
};

// Submit form
const onSubmit = async () => {
  const { valid } = await formRef.value.validate();
  
  if (!valid) return;
  
  try {
    // Create payload based on form data
    const payload = {
      name: name.value,
      email: email.value,
      role: role.value,
    };
    
    // Add password for new users
    if (!isEditMode.value) {
      payload.password = password.value;
    }
    
    // Add profile data if role is STUDENT or TEACHER
    if (showProfileFields.value) {
      payload.profileData = { ...profileData.value, birthDate: new Date(profileData.value.birthDate).toISOString()  };
    }
    
    if (isEditMode.value) {
      await store.dispatch('user/update', { 
        id: store.state.user.is_update,
        data: payload
      }).then(res => {
        if (res) handleClose();
      });
    } else {
      await store.dispatch('user/create', payload).then(res => {
        if (res) handleClose();
      });
    }
  } catch (error) {
    console.error('Form submission error:', error);
  }
};
</script>
