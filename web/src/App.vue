<script setup>
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import {
  initConfigStore,
  useConfigStore,
} from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { Toaster } from 'vue-sonner'
import { useTheme } from 'vuetify'

const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
initCore()
initConfigStore()

const configStore = useConfigStore()

const store = useVuex()

onMounted(() => {
  const token = localStorage.getItem('App-Token')
  const user = localStorage.getItem('App-User')

  
  if (token) {    
    store.commit("SET_TOKEN_APP", token)
    store.commit("SET_USER_APP", JSON.parse(user))
    
    store.dispatch('GetProfile')
    store.dispatch('FetchPermissions')
    store.commit("SET_PERMISSIONS_APP", JSON.parse(localStorage.getItem('App-Permissions')))
  }
})
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />

      <ScrollToTop />
      <Toaster rich-colors />
    </VApp>
  </VLocaleProvider>
</template>


<style lang="scss">
.container {
  margin-block: 0 !important;
  margin-inline: auto !important;
  max-inline-size: 1400px;
}

.align-items-center {
  align-items: center;
}

.align-items-end {
  align-items: flex-end;
}

.justify-content-center {
  justify-content: center;
}

.justify-content-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.mix-blend-difference	{
  mix-blend-mode: difference;
}

.w-fit {
  inline-size: fit-content;
}

.fw-500 {
  font-weight: 500;
}

.fw-600 {
  font-weight: 600;
}

.status-stepper-container {
  display: flex;
  overflow: auto hidden;

  .active {
    background: var(--stepper-color) !important;

    &::after{
      border-inline-start-color: var(--stepper-color) !important;
    }
  }
  
  .stepper-item {
    position: relative;
    background: #EBDBCF;
    color: white;
    cursor: pointer;
    padding-block: 0.5rem;
    padding-inline: 2rem;
    text-align: center;
    text-wrap: nowrap;
  }

  .stepper-item::after {
    position: absolute;
    z-index: 10;
    block-size: 0;
    border-block-end: 25px solid transparent;
    border-block-start: 25px solid transparent;
    border-inline-start: 15px solid #EBDBCF;
    content: '';
    inline-size: 0;
    inset-block-start: 0;
    inset-inline-end: -15px;
  }

  .stepper-item::before {
    position: absolute;
    z-index: 10;
    block-size: 0;
    border-block-end: 25px solid transparent;
    border-block-start: 25px solid transparent;
    border-inline-start: 15px solid #EBDBCF;
    content: '';
    inline-size: 0;
    inset-block-start: 0;
    inset-inline-end: -16px;
  }
}
</style>
