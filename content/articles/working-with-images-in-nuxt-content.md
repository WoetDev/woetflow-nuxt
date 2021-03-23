---
title: 'Working with images in Nuxt Content'
description: Learn more on how to add images as a cover, for social media sharing or inside the content of your Nuxt Content articles.
coverImage: cover-image-working-with-images-in-nuxt-content.jpg
alt: cover-image-working-with-images-in-nuxt-content
---

##### 💡 Demo

Since this blog is also built using Nuxt Content, I'll be taking this article as an example of how I added the images to it: [Creating a full-stack kanban board: the Vue SPA frontend](/posts/creating-a-full-stack-kanban-board-the-vue-spa-frontend)

##### ⚙️ Code

The example project's code is from this exact blog; the example code can be found here: [woetflow-nuxt](https://github.com/WoetDev/woetflow-nuxt)

---

<br>

Recently, I rebuilt my blog using Nuxt Content to be able to generate my blog as a static website, while also making my blogging life a little easier by using Markdown to write my posts.

The official Nuxt Blog has [a great article](<[https://nuxtjs.org/blog/creating-blog-with-nuxt-content](https://nuxtjs.org/blog/creating-blog-with-nuxt-content)>) that will take you through all the steps to set-up a basic blog with Nuxt Content, but it could've used some extra guidance on how to work with images for your articles, so that what we'll be covering here.

## 1. Images outside article content

Adding an image to your article outside the article content is relatively easy to do.

To add an image this way, we'll first add the image the `static` directory.

To keep the `static` directory more organised, I also add some sub-directories to manage the images:

Run: `mkdir -p static/images/covers`

So in `static/images/covers`, I'll add an image named `cover-image-working-with-images-in-nuxt-content.jpeg`.

To include this image as a cover so we can use it outside our main article content, all we need to do is include it as a custom injected variable in the YAML front matter inside the Markdown of our article:

`content/articles/creating-a-full-stack-kanban-board-the-vue-spa-frontend.md:`

```yaml
---
coverImage: cover-image-creating-a-full-stack-kanban-board-the-vue-spa-frontend.jpeg
alt: cover-image-creating-a-full-stack-kanban-board-the-vue-spa-frontend
---

```

So we added added the name of our image with the key `coverImage` and added the `alt` text as well. Notice we didn't specify the path here, that's something we'll add later when displaying the image.

I chose not to add the path here, in case I might want to change the organisation of the image directories. Otherwise I'd need to adjust the path in every single article, instead of only in the component(s).

Now that we've added the image, if we want to display it we simply need to provide it to a `src` attribute in an `img` element. I'm using Vuetify for my blog so instead of the standard `img` element, I'm using their `v-img` component, but the usage of the `src` attribute remains the same.

To use it as the cover for this article, we'll fetch the article's information from our API & then simply call `article.coverImage` to get the information we added in the YAML front matter of our article.

`pages/posts/_slug.vue:`

```html
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8">
        <article class="nuxt-article">
          <v-card shaped>
            <v-img
              :src="`/images/covers/${article.coverImage}`"
              class="pa-9 align-end"
              gradient="to bottom left, rgba(100,115,201,.33), rgba(25,32,72,.8)"
              min-height="300"
            >
              <h1 class="baseText--text">{{ article.title }}</h1>
              <div class="caption baseText--text">
                Posted on {{ formatDate(article.createdAt) }}
              </div>
            </v-img>
            ...
          </v-card>
        </article>
      </v-col>
    </v-row>
  </v-container>
</template>
```

```javascript
<script>
export default {
  name: 'ArticlePage',
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()

    return { article }
  },
  methods: {
    formatDate(date) {
      const options = { day: 'numeric', month: 'long', year: 'numeric'  }
      return new Date(date).toLocaleDateString('en-GB', options)
    }
  }
}
</script>
```

After adding the image, it will now be displayed on the background like this:

<article-image src="working-with-images-in-nuxt-content/cover-image-example.jpg" alt="cover-image-example"></article-image>

## 2. Images inside the article content

Since we can't simply access the information from our YAML frontmatter or paste an image directly inside the Markdown content, we'll need to perform some initial setup by creating a separate component for our images.

Before we can start importing components, we need to make sure that `components` is set to `true` in `nuxt.config.js`.

`nuxt.config.js:`

```javascript
export default {
  components: true,
}
```

Then we'll create a component that should be auto-imported. In order for auto-importing to work in `nuxt-content`, we need to register the desired components globally by adding a global directory inside the components directory.

Run: `mkdir components/global`

And then we'll also create the file for the new `ArticleImage` component.

Run: `touch components/global/ArticleImage.vue`

In this component, we'll add the following code:

```html
<template>
  <img :src="imgSrc()" :alt="alt" class="article-image" />
</template>
```

```javascript
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    }
  },
  methods: {
    imgSrc() {
      try {
        return require(`~/assets/images/${this.src}`)
      } catch (error) {
        return null
      }
    }
  }
}
</script>
```

So what did we do in this component?

- We're rendering a standard HTML `img` element and we'll pass the `src` and `alt` attributes as props when we'll call the component from the Markdown content.

- In order for the `src` attribute to contain the correct URL, we'll first pass our `src` prop into the method `imgSrc()` and generate the asset's URL with `` require( `~/assets/images/${this.src}`) ``

And that's all we need to do for this component to work!

Now whenever you want to add an image inside the Markdown content, you can simply call this component and add the props to it.

So if I want to display the image `complete-kanban-board.jpg` that is located in `assets/images/creating-a-full-stack-kanban-board-the-vue-spa-frontend` inside the content, I can simply do the following:

`content/articles/creating-a-full-stack-kanban-board-the-vue-spa-frontend.md:`

```html
<article-image
  src="creating-a-full-stack-kanban-board-the-vue-spa-frontend/complete-kanban-board.jpg"
  alt="complete-kanban-board"
></article-image>
```
