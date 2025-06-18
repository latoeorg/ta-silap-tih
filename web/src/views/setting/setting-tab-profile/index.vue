<template>
  <div>
    <SettingHeader title="Profile" />

    <VForm
      validate-on="submit lazy"
      @submit.prevent="handleSubmit"
    >
      <VRow>
        <VCol cols="12">
          <p class="text-sm mb-2">
            Profile Picture
          </p>
          <VMenu>
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="position-relative cursor-pointer w-fit"
              >
                <VImg
                  :src="photo_preview || 'https://via.placeholder.com/170'"
                  :aspect-ratio="1"
                  cover
                  :width="170"
                  variant="text"
                  class="rounded-pill"
                />

                <div class="profile-picture-actions">
                  <VBtn
                    v-bind="props"
                    variant="flat"
                    size="small"
                  >
                    <VIcon
                      start
                      icon="tabler-pencil"
                    />

                    Edit
                  </VBtn>
                </div>
              </div>
            </template>

            <VList style="width: fit-content;">
              <VListItem
                title="Upload a photo"
                @click="refInputEl?.click()"
              />
              <VListItem
                title="Remove photo"
                @click="resetProfilePicture"
              />
            </VList>
          </VMenu>

          <input
            ref="refInputEl"
            type="file"
            name="file"
            accept=".jpeg,.png,.jpg,GIF"
            hidden
            @input="changeProfilePicture"
          >
        </VCol>
        <VCol cols="12">
          <div style="max-inline-size: 500px;">
            <AppTextField
              v-model="first_name"
              label="First Name"
              placeholder="Enter your first name"
              :rules="[requiredValidator]"
            />
          </div>
        </VCol>
        <VCol cols="12">
          <div style="max-inline-size: 500px;">
            <AppTextField
              v-model="last_name"
              label="Last Name"
              placeholder="Enter your last name"
              :rules="[requiredValidator]"
              messages="Your name will be displayed on your profile"
            />
          </div>
        </VCol>
        <VCol cols="12">
          <div style="max-inline-size: 500px;">
            <AppDateTimePicker
              v-model="birth_date"
              label="Birth Date"
              placeholder="Select your birth date"
              :rules="[requiredValidator]"
            />
          </div>
        </VCol>
        <VCol cols="12">
          <div
            class="d-flex gap-3"
            style="max-inline-size: 500px;"
          >
            <VBtn
              variant="flat"
              type="submit"
              :loading="loading"
            >
              Update Profile
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<script setup>
import SettingHeader from '@/views/setting/setting-header.vue'

const store = useVuex()
const refInputEl = ref()

const handleCancel = () => refetch()

const changeProfilePicture = file => {
  const fileReader = new FileReader()
  const { files } = file.target

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        photo_preview.value = fileReader.result
    }

    photo.value = files[0]
  }
}

const resetProfilePicture = () => {
  photo_preview.value = null
  refInputEl.value.value = ''
}

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    await store.dispatch('profile/UpdateProfile').then(res => {
      if(res) refetch()
    })
  }
}

const loading = computed(() => store.state.profile.loading.form)

const photo_preview = computed({
  get: () => store.state.profile.form_profile_preview.photo,
  set: value => store.commit('profile/SET_FORM_PROFILE_PREVIEW', { key: 'photo', value }),
})

const first_name = computed({
  get: () => store.state.profile.form_profile.first_name,
  set: value => store.commit('profile/SET_FORM_PROFILE', { key: 'first_name', value }),
})

const last_name = computed({
  get: () => store.state.profile.form_profile.last_name,
  set: value => store.commit('profile/SET_FORM_PROFILE', { key: 'last_name', value }),
})

const photo = computed({
  get: () => store.state.profile.form_profile.photo,
  set: value => store.commit('profile/SET_FORM_PROFILE', { key: 'photo', value }),
})

const phone = computed({
  get: () => store.state.profile.form_profile.phone,
  set: value => store.commit('profile/SET_FORM_PROFILE', { key: 'phone', value }),
})

const birth_date = computed({
  get: () => store.state.profile.form_profile.birth_date,
  set: value => store.commit('profile/SET_FORM_PROFILE', { key: 'birth_date', value }),
})

onMounted(() => refetch())

const refetch = () => store.dispatch('profile/SetFormUpdateProfile')
</script>

<style lang="scss" scoped>
.profile-picture-actions {
  position: absolute;
  bottom: -5px;
  left: -5px;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;

}
</style>
