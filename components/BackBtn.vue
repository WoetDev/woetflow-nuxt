
<template>
  <NuxtLink to="/">
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          elevation="2"
          :bottom="small"
          fab
          fixed
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>{{ ArrowLeft }}</v-icon>
        </v-btn>
      </template>
      <span>Back to all posts</span>
    </v-tooltip>
  </NuxtLink>
</template>

<script>
import { mdiArrowLeft } from "@mdi/js";
export default {
  name: "BackBtn",
  data: () => ({
    ArrowLeft: mdiArrowLeft
  }),
  computed: {
    small() {
      return this.$vuetify.breakpoint.smAndDown ? true : false;
    }
  }
};
</script>