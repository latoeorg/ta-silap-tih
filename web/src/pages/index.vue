
<template>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, dolore corporis? Vel corporis aut sit architecto provident ut natus laudantium ex, odit labore excepturi quia rem quod pariatur. Soluta, natus.
  </p>
</template>

<script setup>
const store = useVuex()

const user = computed(() => store.state.app.user)
</script>
