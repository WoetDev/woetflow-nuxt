<template>
  <img :src="imgSrc()" :alt="alt" class="article-image" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  methods: {
    imgSrc() {
      try {
        return require(`~/assets/images/${this.src}`)
      } catch (error) {
        return null
      }
    }
  }
}
</script>

<style scoped>
.article-image {
  width: 100%;
  border: 1px solid #ECEFF1;
  border-radius: 5px;
  margin: 10px auto;
}
</style>