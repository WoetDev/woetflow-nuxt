<template>
  <v-card class="mt-3" shaped>
    <v-img
      :src="item.coverUrl"
      class="pa-5 white--text align-end"
      gradient="to bottom left, rgba(100,115,201,.33), rgba(25,32,72,.8)"
      height="350px"
    >
      <v-card-title>{{ item.title }}</v-card-title>
      <v-card-text>{{ item.description }}</v-card-text>
      <v-card-actions>
        <NuxtLink :to="'/posts/' + item.slug"
          rel="noopener noreferrer"
          :aria-label="'Read more about ¨' + item.title + '¨'"
        >
          <v-btn
            color="primary"
            class="baseText--text"
          >
            Read more
          </v-btn>
        </NuxtLink>
      </v-card-actions>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: "Item",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>