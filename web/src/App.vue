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
  max-width: 1400px;
  margin: 0 auto !important;
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
  width: fit-content;
}

.fw-500 {
  font-weight: 500;
}

.fw-600 {
  font-weight: 600;
}

.status-stepper-container {
  display: flex;  
  overflow-y: hidden;
  overflow-x: auto;

  .active {
    background: var(--stepper-color) !important;

    &::after{
        border-left-color: var(--stepper-color) !important;
    }
  }
  
  .stepper-item {
    position: relative;
    text-align: center;
    padding: 0.5rem 2rem;
    color: white;
    text-wrap: nowrap;
    background: #EBDBCF;

    cursor: pointer;
  }
  .stepper-item:after {
      border-bottom: 25px solid transparent;
      border-left: 15px solid #EBDBCF;
      border-top: 25px solid transparent;
      content: '';
      height: 0;
      position: absolute;
      right: -15px;
      top: 0;
      width: 0;
      z-index: 10;
  }
  .stepper-item:before {
      border-bottom: 25px solid transparent;
      border-left: 15px solid #EBDBCF;
      border-top: 25px solid transparent;
      content: '';
      height: 0;
      position: absolute;
      right: -16px;
      top: 0;
      width: 0;
      z-index: 10;
  }
}
</style>
