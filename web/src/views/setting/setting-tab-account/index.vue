<template>
  <div>
    <SettingHeader title="Account" />

    <VForm
      validate-on="submit lazy"
      @submit.prevent="handleSubmit"
    >
      <VCard title="Change Password">
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :type="show_password ? 'text' : 'password'"
                :append-inner-icon="show_password ? 'tabler-eye-off' : 'tabler-eye'"
                :rules="[requiredValidator]"
                @click:append-inner="show_password = !show_password"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            />
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="new_password"
                label="New Password"
                placeholder="············"
                :type="show_new_password ? 'text' : 'password'"
                :append-inner-icon="show_new_password ? 'tabler-eye-off' : 'tabler-eye'"
                :rules="[requiredValidator]"
                @click:append-inner="show_new_password = !show_new_password"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="confirm_password"
                label="Confirm Password"
                placeholder="············"
                :type="show_confirm_password ? 'text' : 'password'"
                :append-inner-icon="show_confirm_password ? 'tabler-eye-off' : 'tabler-eye'"
                :rules="[requiredValidator, () => new_password === confirm_password || 'Password does not match']"
                @click:append-inner="show_confirm_password = !show_confirm_password"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Password Requirements:
          </h6>

          <VList class="card-list">
            <VListItem
              v-for="item in passwordRequirements"
              :key="item"
              :title="item"
              class="text-medium-emphasis"
            >
              <template #prepend>
                <VIcon
                  size="8"
                  icon="tabler-circle"
                  class="me-3"
                />
              </template>
            </VListItem>
          </VList>
        </VCardText>

        <VCardText class="d-flex flex-wrap gap-4">
          <VBtn
            type="submit"
            :loading="loading"
          >
            Save changes
          </VBtn>

          <VBtn
            type="reset"
            color="secondary"
            variant="tonal"
            :loading="loading"
            @click="onReset"
          >
            Reset
          </VBtn>
        </VCardText>
      </VCard>
    </VForm>
  </div>
</template>

<script setup>
import SettingHeader from '@/views/setting/setting-header.vue'

const store = useVuex()

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    await store.dispatch('profile/ChangePassword', {
      password: password.value,
      new_password: new_password.value,
    }).then(res => {
      if(res) onReset()
    })
  }
}

const onReset = () => {
  password.value = ''
  new_password.value = ''
  confirm_password.value = ''
}

const loading = computed(() => store.state.profile.loading.form)

const password = ref('')
const new_password = ref('')
const confirm_password = ref('')

const show_password = ref(false)
const show_new_password = ref(false)
const show_confirm_password = ref(false)

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]
</script>

