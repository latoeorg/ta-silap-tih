<template>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill mt-5"
    >
      <VTab
        v-for="item in CourseDetailTabs"
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CourseDetailTab, CourseDetailTabs } from './course-detail-navigation'

const router = useRouter()
const route = useRoute()

const activeTab = computed({
  get: () => route.query.tab || CourseDetailTab.summary,
  set: () => route.query.tab, 
})
</script>
