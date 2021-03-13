<template>
  <v-container>
    <v-row>
      <Profile />
    </v-row>
    <List />
  </v-container>
</template>

<script>
import Profile from "@/components/Profile.vue";

export default {
  name: "Index",
  components: {
    Profile
  }
};
</script>