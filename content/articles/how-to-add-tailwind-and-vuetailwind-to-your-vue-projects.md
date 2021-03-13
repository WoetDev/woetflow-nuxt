---
title: How to add Tailwind and VueTailwind to your Vue projects
description: A guide on how to install both Tailwind and VueTailwind in your Vue project.
coverUrl: https://images.pexels.com/photos/158658/bokeh-blur-blue-white-158658.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260
alt: cover-image-how-to-add-tailwind-and-vuetailwind-to-your-vue-projects
createdAt: 2021-01-20
---

## 1. Adding Tailwind
Run: ```yarn add tailwindcss```

```src/postcss.config.js:```

```javascript
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};
```

After installing tailwindcss and adding it as a postcss plugin, we can load the tailwind-related styles and add it to the entry point of our app.

```src/assets/styles/index.css:```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```src/main.js:```

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/index.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

### 1.1 Compatibility build
In some cases, you might get the following error when compiling: Error: PostCSS plugin tailwindcss requires PostCSS 8.

This is because as of v2.0, Tailwind CSS depends on PostCSS 8. But your app is currently running on an older PostCSS version.

Luckily it's easy to solve by installing the compatibility build from Tailwind:

```bash
yarn remove tailwindcss postcss autoprefixer
yarn add tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

The compatibility build is identical to the main build in every way, so you aren't missing out on any features or anything like that.

## 2. Adding VueTailwind
Run: ```yarn add vue-tailwind```

After that we can create a separate that will import the VueTailwind components and contain your settings.

You can choose to import the entire library, but here we'll only import the components we're using:

```src/plugins/vue-tailwind.js:```

```javascript
import TInput from "vue-tailwind/dist/t-input";
import TTextarea from "vue-tailwind/dist/t-textarea";

export const settings = {
  "t-input": {
    component: TInput,
    props: {
      fixedClasses:
        "block w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed",
      classes:
        "text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 ",
      variants: {
        danger: "border-red-300 bg-red-50 placeholder-red-200 text-red-900",
        success:
          "border-green-300 bg-green-50 placeholder-gray-400 text-green-900"
      }
    }
  },
  "t-textarea": {
    component: TTextarea,
    props: {
      fixedClasses:
        "block w-full px-3 py-2 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed",
      classes:
        "text-black placeholder-gray-400 bg-white border-gray-300 focus:border-blue-500 ",
      variants: {
        danger: "border-red-300 bg-red-50 placeholder-red-200 text-red-900",
        success:
          "border-green-300 bg-green-50 placeholder-gray-400 text-green-900"
      }
    }
  }
};
```

After that, we'll also need add the plugin to our main entry point:

```src/main.js:```

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/index.css";
import VueTailwind from "vue-tailwind";
import { settings } from "@/plugins/vue-tailwind.js";

Vue.config.productionTip = false;

Vue.use(VueTailwind, settings);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
```

And there you have it! You can now start using your VueTailwind components and customize everything further with all TailwindCSS capabilities.