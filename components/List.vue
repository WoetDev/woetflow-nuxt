<template>
  <div>
    <v-row v-if="$fetchState.pending">
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />
    </v-row>
    <v-row v-else>
      <v-col v-for="article of articles" :key="article.slug" cols="12" sm="12" md="6">
        <Item :item="article" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {
        articles: []
      }
    },
    async fetch() {
      this.articles = await this.$content('articles')
        .only(['title', 'description', 'coverImage', 'slug'])
        .sortBy('createdAt', 'desc')
        .fetch()
    }
  }
</script>