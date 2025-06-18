<template>
  <VNavigationDrawer
    temporary
    location="end"
    class="scrollable-content w-100"
    style="max-width: 680px;"
    :model-value="props.open"
    @update:model-value="handleClose"
    @click:outside="handleClose"
  >
    <AppDrawerHeaderSection @click="handleClose" />
  
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm
            validate-on="submit lazy"
            @submit.prevent="handleSubmit"
          >
            <VCardItem class="text-center">
              <VCardTitle class="text-h3 mb-3">
                {{ is_update ? 'Update' : 'Add' }} {{ role }}
              </VCardTitle>
              <p class="mb-0">
                Please fill in the form below to  {{ is_update ? 'update' : 'Add' }} a {{ role }}
              </p>
            </VCardItem>

            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="first_name"
                  label="First Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="last_name"
                  label="Last Name*"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="phone"
                  label="Phone"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="birth_date"
                  label="Birth Date*"
                  prepend-inner-icon="tabler-calendar"                
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>

            <p class="text-overline border-b mt-3">
              Account
            </p>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="username"
                  label="Username*"
                  :rules="[requiredValidator]"
                  aria-autocomplete="none"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="email"
                  label="Email Address*"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="role_name"
                  :items="list_role"
                  item-title="name"
                  item-value="name"
                  label="Role*"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="password"
                  label="Password*"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :rules="[v => is_update ? true : requiredValidator]"
                  :hint="!is_update ? '' : 'Leave blank if you don\'t want to change the password'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>
            </VRow>
            <br>
            <div class="d-flex flex-row-reverse gap-3">
              <VBtn
                type="submit"
                :loading="loading"
              >
                Submit
              </VBtn>
              <VBtn
                variant="tonal"
                @click="handleClose"
              >
                Cancel
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  open: { type: Boolean, required: false },
  role: { type: String },
})

const emit = defineEmits(['handleClose'])

watch(() => props.open, () => { 
  if(props.role == 'PROMOTOR') role_name.value = 'Promotor'
})

const store = useVuex()
const isPasswordVisible = ref(false)

const handleClose = () => {
  store.commit('user/SET_IS_UPDATE', false)
  store.commit('user/RESET_FORM')

  emit('handleClose', false)
}

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    if(is_update.value){
      store.dispatch('user/update', is_update.value).then(res => {
        if(res) handleClose()
      })
    }else{
      store.dispatch('user/create').then(res => {
        if(res) handleClose()
      })
    }
  }
}

const loading = computed(() => store.state.user.loading.form)
const is_update = computed(() => store.state.user.is_update)
const list_role = computed(() => store.state.user.list_role)

const first_name = computed({
  get: () => store.state.user.form.first_name,
  set: value => store.commit('user/SET_FORM', {
    key: 'first_name',
    value,
  }),
})

const last_name = computed({
  get: () => store.state.user.form.last_name,
  set: value => store.commit('user/SET_FORM', {
    key: 'last_name',
    value,
  }),
})

const birth_date = computed({
  get: () => store.state.user.form.birth_date,
  set: value => store.commit('user/SET_FORM', {
    key: 'birth_date',
    value,
  }),
})

const phone = computed({
  get: () => store.state.user.form.phone,
  set: value => store.commit('user/SET_FORM', {
    key: 'phone',
    value,
  }),
})

const username = computed({
  get: () => store.state.user.form.username,
  set: value => store.commit('user/SET_FORM', {
    key: 'username',
    value,
  }),
})

const email = computed({
  get: () => store.state.user.form.email,
  set: value => store.commit('user/SET_FORM', {
    key: 'email',
    value,
  }),
})

const password = computed({
  get: () => store.state.user.form.password,
  set: value => store.commit('user/SET_FORM', {
    key: 'password',
    value,
  }),
})

const role_name = computed({
  get: () => store.state.user.form.role_name,
  set: value => store.commit('user/SET_FORM', {
    key: 'role_name',
    value,
  }),
})
</script>
