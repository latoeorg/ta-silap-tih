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
                {{ is_update ? 'Edit' : 'Add' }} Role
              </VCardTitle>
              <p class="mb-0">
                Please fill in the form below to  {{ is_update ? 'Edit' : 'Add' }} a Role
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
                  label="Role*"
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
  store.commit('setting/role/SET_IS_UPDATE', false)
  store.commit('setting/role/RESET_FORM')

  emit('onOpen', false)
}

const store = useVuex()

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    if(is_update.value){
      store.dispatch('setting/role/updateRole', is_update.value).then(res => {
        if(res) handleClose()
      })
    }else{
      store.dispatch('setting/role/storeRole').then(res => {
        if(res) handleClose()
      })
    }
  }
}

const loading = computed(() => store.state.setting.role.loading.form)
const is_update = computed(() => store.state.setting.role.is_update)

const name = computed({
  get: () => store.state.setting.role.form.name,
  set: value => store.commit('setting/role/SET_FORM', {
    key: 'name',
    value,
  }),
})

const description = computed({
  get: () => store.state.setting.role.form.description,
  set: value => store.commit('setting/role/SET_FORM', {
    key: 'description',
    value,
  }),
})
</script>
