<template>
  <div
    :id="galleryId"
    class="d-flex gap-2 overflow-auto"
  >
    <a
      v-for="(image, key) in images"
      :key="key"
      :href="image"
      target="_blank"
      rel="noopener noreferrer"
      data-pswp-width="1000" 
      data-pswp-height="1000"
    >
      <VImg
        :src="image"
        alt=""
        class=""
        :width="140"
        :aspect-ratio="16/13"
        cover
      />
    </a>
  </div>
</template>

<script setup>
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const galleryId = 'gallery-' + Math.random().toString(36).substr(2, 9)

onMounted(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#' + galleryId,
    children: 'a',
    pswpModule: () => import('photoswipe'),
  })

  lightbox.init()
})
</script>

<style lang="scss">
.pswp__img {
  object-fit: contain;
  object-position: center;
}
</style>
