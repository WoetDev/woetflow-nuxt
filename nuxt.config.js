import colors from 'vuetify/es5/util/colors'
import getSiteMeta from './utils/getSiteMeta';
import getRoutes from "./utils/getRoutes";

const meta = getSiteMeta();

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Woet Flow',
    title: 'Posts',
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: "og:site_name", content: "Woet Flow" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: "canonical",
        rel: "canonical",
        href: "https://woetflow.com",
      },
    ]
  },

  env: {
    baseUrl: process.env.BASE_URL || "http://localhost:8080"
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/preview.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://redfern.dev/articles/adding-a-sitemap-using-nuxt-content
    '@nuxtjs/sitemap',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: "Woet Flow",
      ogSiteName: "Woet Flow",
      description: "I write about web development in Vue.js and Ruby on Rails, agile, side projects or anything else that pops into my head.",
      theme_color: "#CC3F14"
    },
    manifest: {
      name: "Woet Flow",
      short_name: "Woet Flow",
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css'
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: "#CC3F14",
          secondary: "#44318D",
          accentLight: "#E98074",
          accentGrey: "#A4B3B6",
          accentStrong: "#2A1B3D",
          baseText: "#FFF",
          contentBg: "#FFF",
          error: colors.red.lighten1
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  server: {
    port: 8080
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  sitemap: {
    hostname: process.env.BASE_URL || 'http://localhost:8080',
    routes() {
      return getRoutes();
    },
  },
}
