<template>
  <div class="profile-page">
    <!-- Page Header -->
    <VCard class="profile-header" color="primary" variant="elevated">
      <VCardText>
        <div class="d-flex align-center gap-4">
          <VIcon icon="tabler-user-edit" size="48" color="white" />
          <div>
            <h1 class="text-h4 font-weight-bold text-white mb-1">
              Profil {{ isStudent ? "Siswa" : "Dosen" }}
            </h1>
            <p class="text-white opacity-80">
              Kelola dan perbarui informasi profil Anda
            </p>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VRow class="mt-6">
      <!-- Profile Picture Section -->
      <VCol cols="12" md="4">
        <VCard class="profile-picture-card">
          <VCardTitle class="text-center">
            <VIcon icon="tabler-camera" class="me-2" />
            Foto Profil
          </VCardTitle>

          <VDivider />

          <VCardText class="text-center pa-6">
            <div class="profile-picture-container">
              <VAvatar size="150" class="mb-4" color="primary" variant="tonal">
                <VProgressCircular
                  v-if="uploadingPicture"
                  indeterminate
                  size="50"
                  color="primary"
                />
                <VImg
                  v-else-if="profileForm.profilePicture"
                  :src="profileForm.profilePicture"
                  cover
                />
                <span v-else class="text-h2">
                  {{ getInitials(profileForm.name) }}
                </span>
              </VAvatar>

              <div class="picture-actions">
                <VBtn
                  color="primary"
                  variant="outlined"
                  prepend-icon="tabler-upload"
                  size="small"
                  :loading="uploadingPicture"
                  @click="uploadProfilePicture"
                >
                  {{ uploadingPicture ? "Mengupload..." : "Upload Foto" }}
                </VBtn>

                <VBtn
                  v-if="profileForm.profilePicture && !uploadingPicture"
                  color="error"
                  variant="outlined"
                  prepend-icon="tabler-trash"
                  size="small"
                  class="mt-2"
                  @click="removeProfilePicture"
                >
                  Hapus Foto
                </VBtn>

                <VChip
                  v-if="profileForm.profilePictureFile"
                  color="success"
                  variant="tonal"
                  size="small"
                  class="mt-2"
                  prepend-icon="tabler-check"
                >
                  Foto siap diupload
                </VChip>
              </div>
            </div>
          </VCardText>
        </VCard>

        <!-- Quick Info -->
        <VCard class="mt-4">
          <VCardTitle>
            <VIcon icon="tabler-info-circle" class="me-2" />
            Informasi Akun
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div class="info-item">
              <VIcon icon="tabler-shield-check" color="success" size="20" />
              <div class="info-details">
                <strong>Status Akun</strong>
                <p class="text-success">Aktif</p>
              </div>
            </div>

            <div class="info-item">
              <VIcon icon="tabler-user-check" color="info" size="20" />
              <div class="info-details">
                <strong>Peran</strong>
                <p>{{ getRoleText(user.role) }}</p>
              </div>
            </div>

            <div class="info-item">
              <VIcon icon="tabler-calendar" color="info" size="20" />
              <div class="info-details">
                <strong>Bergabung Sejak</strong>
                <p>{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>

            <div class="info-item">
              <VIcon icon="tabler-clock" color="warning" size="20" />
              <div class="info-details">
                <strong>Terakhir Update</strong>
                <p>{{ formatDate(user.updatedAt) }}</p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Profile Form -->
      <VCol cols="12" md="8">
        <VCard class="profile-form-card">
          <VCardTitle>
            <VIcon icon="tabler-forms" class="me-2" />
            Informasi Pribadi
          </VCardTitle>

          <VDivider />

          <VCardText class="pa-6">
            <VForm ref="profileFormRef" @submit.prevent="updateProfile">
              <VRow>
                <!-- Basic Information -->
                <VCol cols="12">
                  <h6 class="text-h6 mb-4 text-primary">
                    <VIcon icon="tabler-user" class="me-2" />
                    Informasi Dasar
                  </h6>
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileForm.name"
                    label="Nama Lengkap *"
                    prepend-inner-icon="tabler-user"
                    variant="outlined"
                    :rules="[rules.required]"
                    required
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileForm.email"
                    label="Email *"
                    type="email"
                    prepend-inner-icon="tabler-mail"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                    disabled
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileForm.phone"
                    label="Nomor Telepon"
                    prepend-inner-icon="tabler-phone"
                    variant="outlined"
                    :rules="[rules.phone]"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="profileForm.gender"
                    label="Jenis Kelamin"
                    prepend-inner-icon="tabler-gender-genderfluid"
                    variant="outlined"
                    :items="genderOptions"
                    item-title="text"
                    item-value="value"
                  />
                </VCol>

                <!-- Birth Information -->
                <VCol cols="12">
                  <h6 class="text-h6 mb-4 mt-4 text-primary">
                    <VIcon icon="tabler-calendar-heart" class="me-2" />
                    Informasi Kelahiran
                  </h6>
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileForm.birthPlace"
                    label="Tempat Lahir"
                    prepend-inner-icon="tabler-map-pin"
                    variant="outlined"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    v-model="profileForm.birthDate"
                    label="Tanggal Lahir"
                    type="date"
                    prepend-inner-icon="tabler-calendar"
                    variant="outlined"
                  />
                </VCol>

                <!-- Teacher-specific fields -->
                <template v-if="!isStudent">
                  <VCol cols="12">
                    <h6 class="text-h6 mb-4 mt-4 text-primary">
                      <VIcon icon="tabler-school" class="me-2" />
                      Informasi Akademik
                    </h6>
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileForm.titlePrefix"
                      label="Gelar Depan"
                      prepend-inner-icon="tabler-award"
                      variant="outlined"
                      placeholder="Dr., Prof., dll"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileForm.titleSuffix"
                      label="Gelar Belakang"
                      prepend-inner-icon="tabler-award"
                      variant="outlined"
                      placeholder="S.Kom., M.Kom., Ph.D., dll"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VSelect
                      v-model="profileForm.religion"
                      label="Agama"
                      prepend-inner-icon="tabler-pray"
                      variant="outlined"
                      :items="religionOptions"
                      item-title="text"
                      item-value="value"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileForm.unit"
                      label="Unit/Departemen"
                      prepend-inner-icon="tabler-building"
                      variant="outlined"
                    />
                  </VCol>
                </template>

                <!-- Student-specific family information -->
                <template v-if="isStudent">
                  <VCol cols="12">
                    <h6 class="text-h6 mb-4 mt-4 text-primary">
                      <VIcon icon="tabler-users" class="me-2" />
                      Informasi Keluarga
                    </h6>
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileForm.fatherName"
                      label="Nama Ayah"
                      prepend-inner-icon="tabler-user"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileForm.motherName"
                      label="Nama Ibu"
                      prepend-inner-icon="tabler-user"
                      variant="outlined"
                    />
                  </VCol>
                </template>

                <!-- Address Information -->
                <VCol cols="12">
                  <h6 class="text-h6 mb-4 mt-4 text-primary">
                    <VIcon icon="tabler-home" class="me-2" />
                    Informasi Alamat
                  </h6>
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    v-model="profileForm.address"
                    label="Alamat Lengkap"
                    prepend-inner-icon="tabler-home"
                    variant="outlined"
                    rows="3"
                    auto-grow
                  />
                </VCol>
              </VRow>

              <VDivider class="my-6" />

              <!-- Action Buttons -->
              <div class="d-flex gap-4 justify-end">
                <VBtn
                  variant="outlined"
                  prepend-icon="tabler-arrow-left"
                  to="/"
                >
                  Kembali
                </VBtn>

                <VBtn
                  color="success"
                  prepend-icon="tabler-check"
                  type="submit"
                  :loading="loading"
                >
                  Simpan Perubahan
                </VBtn>
              </div>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- File Input (Hidden) -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup>
const store = useVuex();
const router = useRouter();

// Refs
const profileFormRef = ref();
const fileInput = ref();
const loading = ref(false);
const uploadingPicture = ref(false);

// Form data
const profileForm = ref({
  name: "",
  email: "",
  profilePicture: "",
  profilePictureFile: null, // Store the actual file for upload
  number: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  address: "",
  phone: "",
  status: "",

  // Student-specific fields
  fatherName: "",
  motherName: "",

  // Teacher-specific fields
  titlePrefix: "",
  titleSuffix: "",
  religion: "",
  unit: "",
});

// Computed
const user = computed(() => store.state.app.user);
const isStudent = computed(() => user.value.role === "STUDENT");

// Options
const genderOptions = [
  { text: "Laki-laki", value: "MALE" },
  { text: "Perempuan", value: "FEMALE" },
];

const statusOptions = computed(() => {
  if (isStudent.value) {
    return [
      { text: "Aktif", value: "ACTIVE" },
      { text: "Cuti", value: "LEAVE" },
      { text: "Non-Aktif", value: "INACTIVE" },
      { text: "Lulus", value: "GRADUATED" },
      { text: "Drop Out", value: "DROPOUT" },
    ];
  } else {
    return [
      { text: "Aktif", value: "ACTIVE" },
      { text: "Cuti", value: "LEAVE" },
      { text: "Non-Aktif", value: "INACTIVE" },
      { text: "Pensiun", value: "RETIRED" },
    ];
  }
});

const religionOptions = [
  { text: "Islam", value: "ISLAM" },
  { text: "Kristen", value: "CHRISTIAN" },
  { text: "Katolik", value: "CATHOLIC" },
  { text: "Hindu", value: "HINDU" },
  { text: "Buddha", value: "BUDDHIST" },
  { text: "Konghucu", value: "CONFUCIAN" },
  { text: "Lainnya", value: "OTHER" },
];

// Validation rules
const rules = {
  required: (value) => !!value || "Field ini wajib diisi",
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(value) || "Format email tidak valid";
  },
  phone: (value) => {
    if (!value) return true; // Optional field
    const pattern = /^[0-9+\-\s()]+$/;

    return pattern.test(value) || "Format nomor telepon tidak valid";
  },
};

// Methods
const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
};

const getRoleText = (role) => {
  const roleMap = {
    STUDENT: "Siswa",
    TEACHER: "Dosen",
    ADMIN: "Administrator",
  };

  return roleMap[role] || role;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const uploadProfilePicture = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadingPicture.value = true;

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        const { toast } = await import("vue-sonner");

        toast.error("File harus berupa gambar");

        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const { toast } = await import("vue-sonner");

        toast.error("Ukuran file maksimal 5MB");

        return;
      }

      // Store the file for upload
      profileForm.value.profilePictureFile = file;

      // Create preview URL
      const reader = new FileReader();

      reader.onload = (e) => {
        profileForm.value.profilePicture = e.target.result;
        uploadingPicture.value = false;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      uploadingPicture.value = false;

      const { toast } = await import("vue-sonner");

      toast.error("Gagal memuat gambar");
    }
  }
};

const removeProfilePicture = () => {
  profileForm.value.profilePicture = "";
  profileForm.value.profilePictureFile = null;

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const updateProfile = async () => {
  // Validate form
  const { valid } = await profileFormRef.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add profile picture file if present
    if (profileForm.value.profilePictureFile) {
      formData.append("profilePicture", profileForm.value.profilePictureFile);
    }

    // Prepare other form data based on user role
    const formFields = {};

    if (isStudent.value) {
      // UpdateStudentProfileInput fields
      formFields.name = profileForm.value.name;
      formFields.number = profileForm.value.number;
      formFields.birthPlace = profileForm.value.birthPlace;
      formFields.birthDate = profileForm.value.birthDate || null;
      formFields.gender = profileForm.value.gender;
      formFields.address = profileForm.value.address;
      formFields.phone = profileForm.value.phone;
      formFields.status = profileForm.value.status;
      formFields.fatherName = profileForm.value.fatherName;
      formFields.motherName = profileForm.value.motherName;
    } else {
      // UpdateTeacherProfileInput fields
      formFields.name = profileForm.value.name;
      formFields.number = profileForm.value.number;
      formFields.birthPlace = profileForm.value.birthPlace;
      formFields.birthDate = profileForm.value.birthDate || null;
      formFields.gender = profileForm.value.gender;
      formFields.address = profileForm.value.address;
      formFields.phone = profileForm.value.phone;
      formFields.status = profileForm.value.status;
      formFields.titlePrefix = profileForm.value.titlePrefix;
      formFields.titleSuffix = profileForm.value.titleSuffix;
      formFields.religion = profileForm.value.religion;
      formFields.unit = profileForm.value.unit;
    }

    // Remove empty values and append to FormData
    Object.keys(formFields).forEach((key) => {
      const value = formFields[key];
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    // Call the profile update API with FormData
    const action = isStudent.value
      ? "profile/updateStudentProfile"
      : "profile/updateTeacherProfile";
    const result = await store.dispatch(action, formData);

    if (result) {
      // Update the user data in the store
      const updatedUser = { ...user.value, ...result.data };

      store.commit("SET_USER_APP", updatedUser);
      localStorage.setItem("App-User", JSON.stringify(updatedUser));

      // Show success message
      const { toast } = await import("vue-sonner");

      toast.success("Profil berhasil diperbarui");

      // Reset the file input
      profileForm.value.profilePictureFile = null;
      if (fileInput.value) {
        fileInput.value.value = "";
      }

      // Navigate back to dashboard
      router.push("/");
    }
  } catch (error) {
    console.error("Failed to update profile:", error);

    const { toast } = await import("vue-sonner");

    toast.error("Gagal memperbarui profil");
  } finally {
    loading.value = false;
  }
};

// Initialize profile form
const initializeProfileForm = () => {
  profileForm.value = {
    name: user.value.name || "",
    email: user.value.email || "",
    profilePicture: user.value.profilePicture || "",
    profilePictureFile: null, // Always start with no file selected
    number: user.value.number || "",
    birthPlace: user.value.birthPlace || "",
    birthDate: user.value.birthDate
      ? new Date(user.value.birthDate).toISOString().split("T")[0]
      : "",
    gender: user.value.gender || "",
    address: user.value.address || "",
    phone: user.value.phone || "",
    status: user.value.status || "",

    // Student-specific fields
    fatherName: user.value.fatherName || "",
    motherName: user.value.motherName || "",

    // Teacher-specific fields
    titlePrefix: user.value.titlePrefix || "",
    titleSuffix: user.value.titleSuffix || "",
    religion: user.value.religion || "",
    unit: user.value.unit || "",
  };
};

// Watch for changes in user data
watch(
  () => user.value,
  () => {
    initializeProfileForm();
  },
  { immediate: true }
);

// Mount
onMounted(() => {
  initializeProfileForm();
});
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 24px;
}

.profile-header {
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.8) 100%
  );
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.3);
}

.profile-picture-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.picture-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.profile-form-card {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 10%);
}

.info-item {
  display: flex;
  align-items: center;
  border-block-end: 1px solid rgba(var(--v-theme-outline), 0.12);
  gap: 12px;
  padding-block: 12px;
  padding-inline: 0;

  &:last-child {
    border-block-end: none;
  }
}

.info-details {
  flex: 1;

  strong {
    display: block;
    color: rgb(var(--v-theme-on-surface));
    font-size: 0.875rem;
    font-weight: 600;
    margin-block-end: 2px;
  }

  p {
    margin: 0;
    color: rgb(var(--v-theme-on-surface-variant));
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .profile-picture-card {
    position: static;
  }
}
</style>
