<template>
  <AppAutocomplete
    v-bind="{
      ...$attrs
    }"
    v-model="selected"
    :items="countries"
    item-title="name.common"
    item-value="name.common"
  >
    <template #item="{ props: listItemProp, item }">
      <VListItem v-bind="listItemProp">
        <template #prepend>
          <VImg
            :src="item.raw.flags.png"
            :width="24"
            :aspect-ratio="16/9"
            class="me-2"
          />
        </template>
      </VListItem>
    </template>

    <template
      v-if="props.modelValue"
      #prepend-inner
    >
      <VImg
        :src="countries.find(c => c.name.common === props.modelValue)?.flags.png"
        :width="24"
        :aspect-ratio="16/9"
      />
    </template>
  </AppAutocomplete>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = ref(null)

watch(() => props.modelValue, value => {
  selected.value = value
})

watch(() => selected.value, value => {
  emit('update:modelValue', value)
})

defineOptions({
  name: 'AppAutocompleteCountry',
  inheritAttrs: false,
})

const store = useVuex()
const countries = computed(() => store.state.util.countries)

onMounted(() => {
  store.dispatch('util/getCountries')
})
</script>
