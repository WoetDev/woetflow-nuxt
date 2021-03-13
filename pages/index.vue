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
  data: () => ({
    title: "Posts | Woet Flow",
    description: "I write about web development in Vue.js and Ruby on Rails, agile, side projects or anything else that pops into my head.",
    image: "https://images.pexels.com/photos/5253574/pexels-photo-5253574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  }),
  components: {
    Profile
  }
};
</script>