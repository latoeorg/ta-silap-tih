<template>
  <VCard
    title="Select Facility"
    subtitle="Select facility for this table"
  >
    <VDivider />
    <VCardText>
      <div class="d-flex align-center justify-end flex-wrap gap-4">
        <div style="inline-size: 20rem;">
          <AppTextField
            v-model="table_options.search"
            density="compact"
            placeholder="Search ..."
            append-inner-icon="tabler-search"
            clearable
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <VCardText class="px-0 pt-0">
      <VDataTableServer
        v-model="selected"
        v-model:options="table_options"
        v-model:items-per-page="table_options.page_size"
        v-model:page="table_options.page"
        :items-length="table_options.total_items"
        :search="table_options.search"
        :headers="headers"
        :items="reports"
        :loading="loading"
        show-select
        class="text-no-wrap"
        @update:options="refetch"
      >
        <template #item.name="{ item }">
          <div class="d-flex gap-3">
            <VAvatar
              :image="item.icon"
              rounded="sm"
              variant="tonal"
              color="secondary"
              icon="tabler-building"
              size="40"
            />

            <div class="d-flex flex-column justify-center">
              <p class="mb-0">
                <span class="text-primary">{{ item.name }}</span> <br>
                <small>{{ item.description }}</small>
              </p>
            </div>
          </div>
        </template>
      </VDataTableServer>
    </VCardText>
  </VCard>
</template>


<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ([]),
  },
})

const emit = defineEmits(['update:modelValue'])

const headers = ref([
  { title: 'Facility',  key: 'name' },
  { title: 'Created At',  key: 'created_at', value: item => formatCalendar(item.created_at) },
])

const store = useVuex()
const selected = ref([])

watch(() => props.modelValue, newValue => {
  selected.value = newValue
})

watch(() => selected.value, value => {
  emit('update:modelValue', value)
})

const refetch = () => store.dispatch('setup/facility/GetReports')

onMounted(() => refetch())

const table_options = computed({
  get: () => store.state.setup.facility.table_options,
  set: value => store.commit('setup/facility/SET_TABLE_OPTIONS', value),
})

const loading = computed(() => store.state.setup.facility.loading.reports)
const reports = computed(() => store.state.setup.facility.reports)
</script>
