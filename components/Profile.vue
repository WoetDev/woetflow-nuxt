<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <v-card class="pa-5" shaped>
          <v-row justify="center">
            <v-col cols="12" sm="auto" class="text-center">
              <v-img
                :max-height="imgSize"
                :max-width="imgSize"
                contain
                class="rounded-circle elevation-3 mx-auto"
                :src="require('~/assets/images/profile_img.jpg')"
              ></v-img>
              <br />
              <a
                href="https://www.linkedin.com/in/wouter-bruynsteen/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <v-icon color="#0073b1" large>{{ linkedin }}</v-icon>
              </a>
              <a
                href="https://github.com/WoetDev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github profile"
              >
                <v-icon color="black" large>{{ github }}</v-icon>
              </a>
            </v-col>
            <v-col cols="12" sm="auto">
              <p>
                Hey 👋
              </p>
              <p>
                I'm Wouter, also known as Woet, and I'm a developer from
                Belgium.
              </p>
              <p>
                I like writing about web development in Vue.js and Ruby on
                Rails, Agile, side projects or anything else that pops into my
                head.
              </p>
              <p>
                If you've got any questions or remarks about some stuff I wrote,
                feel free to reach out to me! 🤙
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiLinkedin, mdiGithub } from "@mdi/js";
export default {
  name: "Profile",
  data: () => ({
    imgSize: 100,
    linkedin: mdiLinkedin,
    github: mdiGithub
  })
};
</script>