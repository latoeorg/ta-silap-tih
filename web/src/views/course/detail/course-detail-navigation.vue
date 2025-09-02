<template>
  <div>
    <VTabs v-model="activeTab" class="v-tabs-pill mt-5">
      <VTab
        v-for="item in filteredTabs"
        :key="item.icon"
        :value="item.tab"
        @click="() => router.push({ query: { tab: item.tab } })"
      >
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CourseDetailTab, CourseDetailTabs } from "./course-detail-navigation";

const router = useRouter();
const route = useRoute();
const store = useVuex();

const user = computed(() => store.state.app.user);

const filteredTabs = computed(() => {
  if (user.value?.role === "STUDENT") {
    // Students can only see summary, attendance, and grades tabs
    return CourseDetailTabs.filter(
      (tab) =>
        tab.tab === CourseDetailTab.summary ||
        tab.tab === CourseDetailTab.attendance ||
        tab.tab === CourseDetailTab.grades
    );
  } else if (user.value?.role === "TEACHER") {
    // Teachers can see all tabs
    return CourseDetailTabs;
  } else {
    // Admins can see all tabs
    return CourseDetailTabs;
  }
});

const activeTab = computed({
  get: () => route.query.tab || CourseDetailTab.summary,
  set: () => route.query.tab,
});
</script>
