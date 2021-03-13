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
    </v-container>
  </div>
</template>

<script>
import { mdiSineWave } from "@mdi/js";
export default {
  name: "Header",
  data: () => ({
    logo: mdiSineWave
  })
};
</script>