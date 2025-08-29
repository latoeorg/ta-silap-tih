<template>
  <div class="class-detail-container">
    <VCard
      class="main-card"
      elevation="0"
    >
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-4">
          <VIcon
            icon="tabler-users-group"
            size="32"
            class="primary"
          />
          <div>
            <h2 class="text-h5 font-weight-bold mb-1">
              {{ classGroup?.name || '-' }}
            </h2>
            <div class="text-body-2 text-medium-emphasis">
              Dibuat pada: {{ formatDate(classGroup?.createdAt) }}
            </div>
          </div>
        </div>
        <VBtn
          icon="tabler-arrow-left"
          variant="text"
          @click="$router.back()"
        />
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VTabs
          v-model="tab"
          grow
        >
          <VTab value="info">
            Info Rombel
          </VTab>
          <VTab value="students">
            Daftar Siswa
          </VTab>
        </VTabs>
        <VDivider class="mb-4" />
        <VWindow v-model="tab">
          <VWindowItem value="info">
            <div class="info-section">
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">
                  Wali Kelas
                </h3>
                <VCard
                  variant="outlined"
                  class="pa-4"
                >
                  <div class="d-flex align-center gap-4">
                    <VAvatar
                      color="primary"
                      size="48"
                    >
                      <span class="text-h6">{{ getInitials(classGroup?.homeroom?.name) }}</span>
                    </VAvatar>
                    <div>
                      <div class="font-weight-bold">
                        {{ classGroup?.homeroom?.name || '-' }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ classGroup?.homeroom?.email || '-' }}
                      </div>
                    </div>
                  </div>
                </VCard>
              </div>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold mb-2">
                  Info Rombel
                </h3>
                <VList
                  density="compact"
                  class="info-list"
                >
                  <VListItem>
                    <VListItemTitle>ID</VListItemTitle>
                    <VListItemSubtitle>{{ classGroup?.id }}</VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Nama Rombel</VListItemTitle>
                    <VListItemSubtitle>{{ classGroup?.name }}</VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Jumlah Siswa</VListItemTitle>
                    <VListItemSubtitle>{{ classGroup?.students?.length || 0 }}</VListItemSubtitle>
                  </VListItem>
                  <VListItem>
                    <VListItemTitle>Dibuat Pada</VListItemTitle>
                    <VListItemSubtitle>{{ formatDate(classGroup?.createdAt) }}</VListItemSubtitle>
                  </VListItem>
                </VList>
              </div>
            </div>
          </VWindowItem>
          <VWindowItem value="students">
            <div class="students-section">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">
                Daftar Siswa
              </h3>
              <VTable
                density="comfortable"
                class="students-table"
              >
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Dibuat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="student in classGroup?.students || []"
                    :key="student.id"
                  >
                    <td>{{ student.name }}</td>
                    <td>{{ student.email }}</td>
                    <td>{{ formatDate(student.createdAt) }}</td>
                  </tr>
                  <tr v-if="!classGroup?.students?.length">
                    <td
                      colspan="3"
                      class="text-center text-medium-emphasis"
                    >
                      Belum ada siswa di rombel ini.
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import axiosInstance from '@/utils/axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const classGroup = ref(null)
const tab = ref('info')

const fetchClassGroup = async () => {
  try {
    const { data } = await axiosInstance.get(`/class-group/${route.params.id}`)

    classGroup.value = data.data
  } catch (error) {
    // handle error
  }
}

onMounted(() => {
  fetchClassGroup()
})

const formatDate = dateStr => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: '2-digit' })
}

const getInitials = name => {
  if (!name) return ''
  
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
.class-detail-container {
  margin-block: 0;
  margin-inline: auto;
  max-inline-size: 800px;
  padding-block: 32px;
  padding-inline: 0;
}

.main-card {
  overflow: hidden;
  border-radius: 16px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-list {
  background: transparent;
}

.students-section {
  margin-block-start: 16px;
}

.students-table {
  overflow: hidden;
  border-radius: 12px;
  inline-size: 100%;
}
</style>
