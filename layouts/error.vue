<template>
  <v-app>
    <v-main class="background">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="12" md="8">
            <v-card class="pa-8" shaped>
              <v-row justify="center">
                <h1 v-if="error.statusCode === 404">
                  {{ pageNotFound }}
                </h1>
                <h1 v-else>
                  {{ otherError }}
                </h1>
              </v-row>
              <v-row justify="center">
                <NuxtLink to="/">
                  Back to articles
                </NuxtLink>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>