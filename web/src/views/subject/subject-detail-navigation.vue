<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill mt-5"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        @click="() => router.push({ query: { tab: item.tab } })"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-5"
    >
      <VWindowItem value="courses">
        <Course :subject-id="route.params.id" :subject-name="subjectName" />
      </VWindowItem>
      
      <VWindowItem value="assessment-weight">
        <AssessmentWeight :subject-id="route.params.id" />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script setup>
import axiosInstance from '@/utils/axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AssessmentWeight from './assessment-weight.vue'
import Course from './course.vue'

const router = useRouter()
const route = useRoute()
const subjectName = ref('')

const activeTab = computed({
  get: () => route.query.tab || 'courses',
  set: () => route.query.tab, 
})

const tabs = [
  {
    icon: 'tabler-file-text',
    title: 'Mata Pelajaran',
    tab: 'courses',
  },
  {
    icon: 'tabler-calendar',
    title: 'Bobot Penilaian',
    tab: 'assessment-weight',
  },
]

// Fetch subject name for display
const fetchSubjectName = async () => {
  try {
    const response = await axiosInstance.get(`/subject/${route.params.id}`)
    subjectName.value = response.data?.name || 'Subject'
  } catch (error) {
    console.error('Error fetching subject details:', error)
  }
}

onMounted(() => {
  fetchSubjectName()
})
</script>
