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
    <AppDrawerHeaderSection
      title="Facility Form"
      @click="handleClose"
    />
  
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm
            validate-on="submit lazy"
            @submit.prevent="handleSubmit"
          >
            <VCardItem class="text-center">
              <VCardTitle class="text-h3 mb-3">
                {{ is_update ? 'Update' : 'Create' }} Facility
              </VCardTitle>
              <p class="mb-0">
                Please fill in the form below to  {{ is_update ? 'update' : 'create' }} a Facility
              </p>
            </VCardItem>

            <VRow>
              <VCol cols="12">
                <ContentFileSelect
                  v-model="icon"
                  type="ICON"
                >
                  <div class="d-flex gap-3 align-items-center justify-content-center border border-dashed cursor-pointer">
                    <div
                      v-if="!icon"
                      class="d-flex align-items-center gap-5 py-10"
                    >
                      <VIcon
                        rounded="0"
                        size="24"
                        icon="tabler-upload"
                      />

                      <p class="mb-0">
                        <span class="text-primary">Select an icon</span> <br>
                        <small>Click the icon to change</small>
                      </p>
                    </div>

    
                    <VImg
                      v-else
                      :src="icon"
                      :aspect-ratio="16/9"
                      cover
                    />
                  </div>
                </ContentFileSelect>
              </VCol>
              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  label="Facility*"
                  :rules="[requiredValidator]"
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

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['handleClose'])

const handleClose = () => {
  store.commit('setup/facility/SET_IS_UPDATE', false)
  store.commit('setup/facility/RESET_FORM')

  emit('handleClose', false)
}

const store = useVuex()

const handleSubmit = async e => {
  const { valid } = await e

  if(valid){
    if(is_update.value){
      store.dispatch('setup/facility/Update', is_update.value).then(res => {
        if(res) handleClose()
      })
    }else{
      store.dispatch('setup/facility/Store').then(res => {
        if(res) handleClose()
      })
    }
  }
}

const loading = computed(() => store.state.setup.facility.loading.form)
const is_update = computed(() => store.state.setup.facility.is_update)

const icon = computed({
  get: () => store.state.setup.facility.form.icon,
  set: value => store.commit('setup/facility/SET_FORM', {
    key: 'icon',
    value,
  }),
})

const name = computed({
  get: () => store.state.setup.facility.form.name,
  set: value => store.commit('setup/facility/SET_FORM', {
    key: 'name',
    value,
  }),
})

const description = computed({
  get: () => store.state.setup.facility.form.description,
  set: value => store.commit('setup/facility/SET_FORM', {
    key: 'description',
    value,
  }),
})
</script>
