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
            icon="tabler-school"
            size="38"
          />
        </VAvatar>
        <div>
          <h5 class="text-h5 font-weight-medium">
            <b>Jurusan</b> {{ report?.name }}
          </h5>
          <div class="text-disabled">
            Terakhir diperbarui: {{ formatCalendar(report?.updatedAt) }}
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>

  <Navigation />
</template>
<script setup>
import Navigation from '@/views/subject/subject-detail-navigation.vue'
const store = useVuex()
const route = useRoute()
const subjectId = ref(route.params.id)

const activeTab = computed(() => route.query.tab || 'courses')

const loading = computed(() => store.state.subject.loading.report)
const report = computed(() => store.state.subject.report)

const refetch = () => store.dispatch('subject/GetReport', subjectId.value)

onMounted(() => refetch())
</script>
