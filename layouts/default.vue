<template>
  <v-app>
    <Header />

    <v-main class="background">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import getSiteMeta from '@/utils/getSiteMeta';
import Header from "@/components/Header";

export default {
  name: "App",
  components: {
    Header
  },
  computed: {
    meta() {
      const metaData = {
        url: this.$config.baseURL,
        coverImage: `${this.$config.baseURL}/images/main-image.jpeg`,
      };
      return getSiteMeta(metaData);
    },
  },
  head() {
    return {
      meta: [
        ...this.meta,
      ],
    };
  },
};
</script>

<style lang="scss">
.background {
  background-color: #FDF9F7;
}

body {
  min-height: 100vh;
}

#header a {
  color: transparent !important;
}
// Override Vuetify defaults
.v-card__text,
.v-card__title {
  word-break: normal !important;
}
</style>

