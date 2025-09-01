<template>
  <VCard class="logistics-card-statistics cursor-pointer">
    <VCardText>
      <div class="d-flex align-center gap-x-4 mb-2">
        <VAvatar
          variant="tonal"
          size="60"
          color="primary"
          rounded
        >
          <VIcon
            icon="tabler-users-group"
            size="38"
          />
        </VAvatar>
        <div>
          <h5 class="text-h5 font-weight-medium">
            <b>Kelas</b> {{ classGroup?.name || '-' }}
          </h5>
          <div class="text-disabled">
            Dibuat pada: {{ formatDate(classGroup?.createdAt) }}
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>

  <!-- <ClassDetailNavigation /> -->


  <ClassDetailSummary
    :report="classGroup"
    :loading="loading"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ClassDetailTab } from '@/views/class/detail/class-detail-navigation'

import ClassDetailSummary from '@/views/class/detail/class-detail-summary.vue'

const store = useVuex()
const route = useRoute()
const classId = ref(route.params.id)

const activeTab = computed(() => route.query.tab || ClassDetailTab.summary)

const loading = computed(() => store.state.classGroup.loading.report)
const classGroup = computed(() => store.state.classGroup.report)

const refetch = () => store.dispatch('classGroup/getReport', classId.value)

onMounted(() => refetch())
</script>


