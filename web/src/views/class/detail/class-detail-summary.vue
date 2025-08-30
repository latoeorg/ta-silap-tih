<template>
  <div class="class-detail-page">
    <div v-if="loading">
      <VSkeletonLoader type="article" />
      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <VSkeletonLoader type="list-item-avatar-two-line@4" />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <VSkeletonLoader type="card" />
        </VCol>
      </VRow>
    </div>

    <div v-else>
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <h1 class="text-h4 font-weight-bold">
              {{ report?.name || 'Detail Rombel' }}
            </h1>
            <p
              v-if="report?.homeroom"
              class="text-body-1 text-medium-emphasis"
            >
              Wali Kelas: {{ report.homeroom.name }}
            </p>
          </div>
        </div>
        <div class="header-actions">
          <VBtn
            color="primary"
            variant="elevated"
            prepend-icon="tabler-users-plus"
            @click="openStudentManagementModal"
          >
            Kelola Siswa
          </VBtn>
        </div>
      </div>

      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <UserDataTable
            title="Daftar Siswa"
            :class-group-id="report.id"
            hide-add-button
            hide-actions
          />
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VCard>
            <VCardText>
              <div class="info-section">
                <div class="section-title">
                  Wali Kelas
                </div>
                <VListItem
                  v-if="report?.homeroom"
                  lines="two"
                  class="pa-0"
                >
                  <template #prepend>
                    <VAvatar
                      color="secondary"
                      size="48"
                    >
                      <span class="text-h6">{{ getInitials(report.homeroom.name) }}</span>
                    </VAvatar>
                  </template>
                  <VListItemTitle class="font-weight-bold">
                    {{ report.homeroom.name }}
                  </VListItemTitle>
                  <VListItemSubtitle>
                    {{ report.homeroom.email }}
                  </VListItemSubtitle>
                </VListItem>
                <div
                  v-else
                  class="text-medium-emphasis"
                >
                  Wali kelas belum diatur.
                </div>
              </div>

              <VDivider class="my-4" />

              <div class="info-section">
                <div class="section-title">
                  Detail Rombel
                </div>
                <VList
                  density="compact"
                  class="detail-list"
                >
                  <VListItem
                    v-for="item in classDetails"
                    :key="item.label"
                  >
                    <template #prepend>
                      <VIcon
                        :icon="item.icon"
                        size="20"
                        class="me-3 text-medium-emphasis"
                      />
                    </template>
                    <div class="d-flex justify-space-between w-100">
                      <span class="text-caption">{{ item.label }}</span>
                      <span class="font-weight-medium text-body-2">{{ item.value }}</span>
                    </div>
                  </VListItem>
                </VList>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <ClassDetailStudentAssignModal
      v-model:open="isStudentModalOpen"
      :class-group-id="report.id"
    />
  </div>
</template>

<script setup>
import UserDataTable from '@/views/user/user-data-table.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import ClassDetailStudentAssignModal from './class-detail-student-assign-modal.vue'

const props = defineProps({
  report: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'refresh'])

const router = useRouter()
const isStudentModalOpen = ref(false)

const classDetails = computed(() => [
  {
    icon: 'tabler-hashtag',
    label: 'ID Rombel',
    value: props.report?.id?.slice(-8) || '-', // Tampilkan 8 karakter terakhir ID
  },
  {
    icon: 'tabler-calendar-plus',
    label: 'Dibuat Pada',
    value: formatDate(props.report?.createdAt),
  },
  {
    icon: 'tabler-calendar-time',
    label: 'Diperbarui Pada',
    value: formatDate(props.report?.updatedAt),
  },
])

const openStudentManagementModal = () => {
  isStudentModalOpen.value = true

  // alert('Membuka modal untuk mengelola siswa...')
}

const formatDate = dateStr => {
  if (!dateStr) return '-'
    
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const getInitials = name => {
  if (!name) return ''
    
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

  <style lang="scss" scoped>
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-block-end: 1.5rem;
  }

  .header-content {
    display: flex;
    align-items: center;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .card-title {
    display: flex;
    align-items: center;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .student-list {
    padding: 0;
    margin: -0.5rem;
  }

  .student-list-item {
    border-radius: 8px;
    margin-block-end: 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(var(--v-theme-on-surface), 0.04);
    }
  }

  .info-section {
    .section-title {
      color: rgba(var(--v-theme-on-surface), 0.6);
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      margin-block-end: 0.75rem;
      text-transform: uppercase;
    }
  }

  .detail-list {
    padding: 0;
    background-color: transparent;

    .v-list-item {
      min-block-size: auto;
      padding-inline: 0;
    }
  }

  .empty-state {
    color: rgba(var(--v-theme-on-surface), 0.5);
    padding-block: 4rem;
    padding-inline: 1rem;
    text-align: center;
  }
  </style>
