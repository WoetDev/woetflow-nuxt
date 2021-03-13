<template>
  <v-app>
    <Header />

    <v-main class="background">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "App",
  components: {
    Header
  }
};
</script>

<style lang="scss">
.background {
  background-color: #ddc1bc38;
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

