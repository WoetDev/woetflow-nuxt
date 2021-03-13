<template>
  <div id="header" class="background">
    <v-container>
      <v-row justify="center">
        <router-link to="/" class="my-5">
          <h1>
            <v-icon class="primary--text " large>{{ logo }}</v-icon>
            <span class="primary--text pl-2">Woet Flow</span>
          </h1>
        </router-link>
      </v-row>
      <!-- <v-row v-if="isAuthenticated" justify="center">
        <router-link to="/posts/new">
          <v-btn class="mr-2" color="success">New Post</v-btn>
        </router-link>
        <v-btn color="error" @click.prevent="signOut">Sign out</v-btn>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
import { mdiSineWave } from "@mdi/js";
export default {
  name: "Header",
  data: () => ({
    logo: mdiSineWave
  }),
  methods: {
    // signOut() {
    //   this.$http.secured
    //     .delete("/signin")
    //     .then(() => {
    //       delete localStorage.csrf;
    //       delete localStorage.signedIn;
    //       this.$store.dispatch("signOutState");
    //     })
    //     .catch(error => this.setError(error, "Cannot sign out"));
    // }
  },
  computed: {
    // isAuthenticated() {
    //   return this.$store.getters.isAuthenticated;
    // }
  }
};
</script>