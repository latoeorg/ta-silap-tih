<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill mt-5"
    >
      <VTab
        v-for="item in SubjectDetailTabs"
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

    <!--
      <VWindow
      v-model="activeTab"
      class="mt-5"
      >
      <VWindowItem value="courses">
      <Course
      :subject-id="route.params.id"
      :subject-name="subjectName"
      />
      </VWindowItem>
      
      <VWindowItem value="assessment-weight">
      <AssessmentWeight :subject-id="route.params.id" />
      </VWindowItem>
      </VWindow> 
    -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SubjectDetailTab, SubjectDetailTabs } from './subject-detail-navigation'

const router = useRouter()
const route = useRoute()

const activeTab = computed({
  get: () => route.query.tab || SubjectDetailTab.summary,
  set: () => route.query.tab, 
})
</script>
