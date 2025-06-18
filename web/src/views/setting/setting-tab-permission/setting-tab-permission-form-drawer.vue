<template>
  <VNavigationDrawer
    temporary
    location="end"
    class="scrollable-content w-100"
    style="max-width: 500px;"
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
                {{ is_update ? 'Edit' : 'Add' }} Permission
              </VCardTitle>
              <p class="mb-0">
                {{ is_update ? 'Edit' : 'Add' }} permission as per your requirements.
              </p>
            </VCardItem>

            <VAlert
              title="Warning!"
              text="By adding the permission name, you might break the system permissions functionality."
              type="warning"
              variant="tonal"
              icon="tabler-alert-triangle"
            
              class="mb-4"
            />

            <VRow>
              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  label="Permission*"
                  :rules="[requiredValidator]"
                  :disabled="is_update"
                />
              </VCol>
              <VCol cols="12">
                <AppTextarea
                  v-model="description"
                  label="Description"
                />
              </VCol>
              <VCol cols="3">
                <AppSelect
                  v-model="api_method"
                  :items="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
                  label="Method*"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="9">
                <AppTextField
                  v-model="api_url"
                  label="API URL*"
                  prefix="${{baseUrl}}"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <AppAutocomplete
                  v-model="roles"
                  v-model:search="search_roles"
                  label="Roles*"
                  :items="list_roles"
                  item-title="name"
                  item-value="name"
                  chips
                  closable-chips
                  multiple
                  @update:search="refetchRoles"
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

const props = defineProps({ open: { type: Boolean, required: true } })
const emit = defineEmits(['onOpen'])

const handleClose = () => {
  store.commit('setting/permission/SET_IS_UPDATE', false)
  store.commit('setting/permission/RESET_FORM')

  emit('onOpen', false)
}

const store = useVuex()

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    if(is_update.value){
      store.dispatch('setting/permission/update', is_update.value).then(res => {
        if(res) handleClose()
      })
    }else{
      store.dispatch('setting/permission/store').then(res => {
        if(res) handleClose()
      })
    }
  }
}

const search_roles = ref("")

const refetchRoles = () => store.dispatch('setting/role/getReports', {
  search: search_roles.value,
})

const list_roles = computed(() => store.state.setting.role.reports)

const loading = computed(() => store.state.setting.permission.loading.form)
const is_update = computed(() => store.state.setting.permission.is_update)

const name = computed({
  get: () => store.state.setting.permission.form.name,
  set: value => store.commit('setting/permission/SET_FORM', {
    key: 'name',
    value,
  }),
})

const description = computed({
  get: () => store.state.setting.permission.form.description,
  set: value => store.commit('setting/permission/SET_FORM', {
    key: 'description',
    value,
  }),
})

const api_url = computed({
  get: () => store.state.setting.permission.form.api_url,
  set: value => store.commit('setting/permission/SET_FORM', {
    key: 'api_url',
    value,
  }),
})

const api_method = computed({
  get: () => store.state.setting.permission.form.api_method,
  set: value => store.commit('setting/permission/SET_FORM', {
    key: 'api_method',
    value,
  }),
})

const roles = computed({
  get: () => store.state.setting.permission.form.roles,
  set: value => store.commit('setting/permission/SET_FORM', {
    key: 'roles',
    value,
  }),
})

onMounted(() => {
  refetchRoles()
})
</script>
