<template>
  <div>
    <div
      ref="mapContainer"
      class="map-wrapper"
      style="width: 100%; height: 500px;"
    />
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

// Define props and emits
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lng: 0, lat: 0 }), // Default position
  },
})

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, newValue => {
  if (map.value && marker.value) {
    map.value.setCenter([newValue.lng, newValue.lat])
    marker.value.setLngLat([newValue.lng, newValue.lat])
  }
})

const map = ref(null)
const geocoder = ref(null)

const marker = ref(null)
const mapContainer = ref(null)

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_GL_TOKEN

  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [props.modelValue.lng, props.modelValue.lat], // Use prop value for initial center
    zoom: 12,
    width: '100%',
  })

  geocoder.value = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
  })

  const markerEl = document.createElement('div')

  markerEl.className = 'custom-marker'

  marker.value = new mapboxgl.Marker({ 
    draggable: true, 
    element: markerEl,
  })
    .setLngLat([props.modelValue.lng, props.modelValue.lat]) // Use prop value for initial marker position
    .addTo(map.value)

  function onDragEnd() {
    const lngLat = marker.value.getLngLat()

    emit('update:modelValue', { lng: lngLat.lng, lat: lngLat.lat })
  }

  marker.value.on('dragend', onDragEnd)

  map.value.addControl(geocoder.value)

  geocoder.value.on('result', e => {
    const [lng, lat] = e.result.geometry.coordinates

    marker.value.setLngLat([lng, lat])
    map.value.flyTo({ center: [lng, lat], zoom: 14 })
    emit('update:modelValue', { lng, lat })
  })
})
</script>

<style lang="scss">
.custom-marker {
  background-image: url('https://staging-assets.lekliffbykclub.com/bxs_map1721975997377.webp');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
