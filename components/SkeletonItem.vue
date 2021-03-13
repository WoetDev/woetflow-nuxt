<template>
  <v-col cols="12" sm="12" md="6">
    <v-card class="mt-3" shaped>
      <v-skeleton-loader
        type="card"
        transition="scroll-y-transition"
      ></v-skeleton-loader>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "SkeletonItem"
};
</script>