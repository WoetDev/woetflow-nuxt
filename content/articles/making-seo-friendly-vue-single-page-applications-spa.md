---
title: Making SEO-friendly Single Page Applications (SPA) in Vue
description: Learn how to improve SEO in your Vue Single Page Applications with meta tags, structured data, pre-rendering and clean routing so search engines can more easily understand what your pages are about.
coverImage: cover-image-making-seo-friendly-vue-single-page-applications-spa.jpeg
alt: cover-image-making-seo-friendly-vue-single-page-applications-spa
createdAt: 2021-01-19
---

##### 💡 Demo

The app we're using in this post contains a list of the first generation Pokémon with their sprites called from the PokéAPI and each Pokémon has a detail page showing more of their design and sprites. The app uses tailwind for the styles.

You can find a demo of it here: [Pokémon Sprites](https://pokemon-sprites.netlify.app/)

##### ⚙️ Code

The example project used for this blog post can be found in this repository on Github: [woetflow-demo-pokemon-sprites](https://github.com/WoetDev/woetflow-demo-pokemon-sprites).

-------
<br>

## 1. Ranking factors

There are a couple of important factors to consider when doing SEO, with content being the most important one. Having people engage with your content and having it linked from trustworthy sites will greatly impact your rankings. 

But besides that, there are also some technical best practices to consider:

* **Performance:** Make your site load as fast as possible, you can generate a report on the performance of your website using Lighthouse in the Chrome DevTools or Google PageSpeed Insights.

* **Mobile-friendliness & Accessibility:** Make your site easy to handle on any device and support assistive tech like screen-readers. You can also generate an Accessibility report with Lighthouse in the Chrome DevTools.

* **Security:** An SSL certificate (HTTPS) is a must-have for any website nowadays. It can be generated for free or most hosts will even offer this out-of-the-box.

* **Rich metadata:** Describe the content for each page with metatags for SEO (title, description) and social (Open Graph, Twitter Cards). To be included in Google’s special search results on top and make it more machine-readable, you can also include JSON-LD structured data. Additionally, you can provide an XML sitemap to give an overview of all your pages and if applicable, the versions of the page in different languages. 

So in short: make engaging content that’s machine-readable and accessible to everyone. The challenge with SPAs lies with the machine-readable part, so in this post we’ll be covering what we can do to optimize an SPA with dynamic content that doesn’t have server-side rendering. 

## 2. Meta tags

First thing we’ll do is add some meta tags for SEO and social to our app. 

Start off by adding the vue-meta package, this will give us a metaInfo property in our Vue instance which will enable us to set the data in our meta tags:

Run: ```yarn add vue-meta```

<br>

Once installed, add the package to the Vue instance.

```src/main.js:```

```javascript
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
```

<br>

Also, remove the title that gets added by the vue-cli by default in ```public/index.html```:

```html
<title><%= htmlWebpackPlugin.options.title %></title>
```

<br>

Now we can start defining our meta tags for the pages. 

I want all my meta tags to append the general string of “ | Pokémon Sprites” to them, so I’ll add a ```titleTemplate``` property in App.vue.

```src/App.vue:```

```javascript
<script>
import Header from "@/components/Header";

export default {
  name: "App",
  metaInfo: {
    titleTemplate: "%s | Pokémon Sprites"
  },
  components: {
    Header
  }
};
</script>
```

<br>

The ```titleTemplate``` serves as a default for the titles in all our pages, where the ```%s``` serves as a placeholder for where the title of the page will come.

After that, we’ll go to the index page where we have a list of Pokémon. Here, I want to add a title of the region, we’re only showing the Pokémon from one, so we can add this title as a static string. We can also start adding all the social tags we need.

```src/components/List.vue:```

```javascript
<script>
import api from "@/api";
import axios from "axios";

export default {
  name: "List",
  data: () => ({
    list: [],
    isLoading: true,
    description: "All pokémon from first generation in the Kanto region"
  }),
  metaInfo() {
    return {
      title: "Kanto",
      meta: [
        { vmid: "description", name: "description", content: this.description },
        {
          vmid: "og:title",
          property: "og:title",
          content: "Kanto | Pokémon Sprites"
        },
        {
          vmid: "og:description",
          property: "og:description",
          content: this.description
        },
        {
          vmid: "og:image:alt",
          property: "og:image:alt",
          content: this.description
        },
        {
          vmid: "og:url",
          property: "og:url",
          content: "https://pokemon-sprites.netlify.app/"
        },
        {
          vmid: "og:image",
          property: "og:image",
          content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`
        }
      ]
    };
  },
  ....
};
</script>
```

Here we added the meta tags for title & description as well as the Open Graph tags. You can add any other meta tags you'd need in the meta array.

You might notice that every meta object also has a vmid property, this property is used to identify a tag. If we wouldn't add a vmid, then we would end up with duplicate tags in case a parent component has already defined a tag with the same name.

And lastly, we also have a detail page that shows more sprites of every Pokémon, this data is dynamic so here we’ll need to add more meta tags based on our data properties. 

```src/components/Detail.vue:```

```javascript
<script>
import api from "@/api";

export default {
  name: "Detail",
  data: () => ({
    pokemon: "",
    description: ""
  }),
  metaInfo() {
    const pokemon = this.pokemon;
    return {
      title:
        pokemon &&
        pokemon.name.charAt(0).toUpperCase() +
          pokemon.name.slice(1).toLowerCase(),
      meta: [
        { vmid: "description", name: "description", content: this.description },
        {
          vmid: "og:title",
          property: "og:title",
          content:
            pokemon &&
            pokemon.name.charAt(0).toUpperCase() +
              pokemon.name.slice(1).toLowerCase(),
          template: chunk => `${chunk} | Pokémon Sprites`
        },
        {
          vmid: "og:description",
          property: "og:description",
          content: this.description
        },
        {
          vmid: "og:image:alt",
          property: "og:image:alt",
          content: this.description
        },
        {
          vmid: "og:url",
          property: "og:url",
          content: `${window.location.origin}/pokemon/${pokemon.name}`
        },
        {
          vmid: "og:image",
          property: "og:image",
          content: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
        }
      ]
    };
  },
  ...
};
</script>
```

In both cases, we also defined metaInfo as a function, this was necessary in order for us have access to the data or computed properties.

## 3. Structured data

So next thing we can add to our website is the JSON-LD structured data. You can read more about what structured data is all about here, but summarized it'll enable Google to have more information about each page and they'll show that information in their special search results. Those search results usually appear at the top of the page and have a special look in the UI.

For this app, we’ll keep it simple and as an example add some structured data that would enable Google to show our logo when people are searching for the website as described here. 

We can also run a test here to see if the JSON-LD we want to create is valid.

Run: ```yarn add vue-jsonld```

```src/main.js:```

```javascript
import VueJsonLD from 'vue-jsonld' 

Vue.use(VueJsonLD)

src/App.vue:

export default {
  ...
  jsonld() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "url": "https://pokemon-sprites.netlify.app/",
      "logo": "https://i.imgur.com/bhxp07I.png"
    }
  },
  ...
};
```

<br>

## 4. Pre-rendering

Single Page Applications (SPAs) send all of the site's code within one page load and use JavaScript to dynamically change and asynchronously load content depending on how the user navigates. This means it only provides an empty app shell or container and no actual content is in the inital markup.

Search engines really like content, so it's probably a good idea to have some in there. When crawlers visit your site for the first time, they don't always execute the JavaScript so that means most of the content won't get indexed. This doesn't mean crawlers can't view the content on your website, but it's likely that they'll only execute the JavaScript on their second wave of visiting.

This is where pre-rendering comes in.

Pre-rendering works by booting up a headless browser that generates a rendered version of your SPA at build time and delivering it to crawlers.

For our app, we'll use pre-rendering with the ```prerender-spa-plugin``` package.

Note that if you want to also pre-render user generated content, you will have to switch to Server-Side Rendering, there are no other options.

<br>

This time we'll install it using the vue-cli so it saves us some time in configuration:

Run: ```vue add prerender-spa```

And then we'll get some questions for the configuration:

```Which routes to pre-render? (separate with comma) (only with Vue Router history mode):``` /

```Use a render event to trigger the snapshot?:``` Y

```Use a headless browser to render the application? (recommended):``` Y

```Only use prerendering for production builds? (recommended):``` Y

<br>

Once everything has run, you'll see that the ```vue.config.js``` file in the root directory now has the pre-rendering options defined.

Since most of the content on the page is from an API call, it won't pre-render all of this, but it will make sure that our meta tags and structured data is ready for indexing.

## 5. Clean routing

On a final note, it's also important to ensure that you have clean routing from both an SEO and UX perspective. For example in the app instead of routing to a detail page with /pokemon/1, we'll use the name in the URL instead: /pokemon/bulbasaur.

To enable this is very simple by adding a dynamic segment to our path in the router index.

```src/router/index.js:```

```javascript
const routes = [
  ...
  {
    path: "/pokemon/:name",
    name: "Detail",
    component: () =>
      import(/* webpackChunkName: "detail" */ "../components/Detail.vue")
  }
];
```

<br>

Then, we can build our path when calling it in the router-link component:

```src/components/List.vue:```

```html
<router-link target="_blank" :to="'/pokemon/' + pokemon.name">
```

<br>

## 6. Recap

So we saw that SEO for Single Page Applications will require some more work so it's important to consider if the extra effort will be worth it for your use case. Do keep in mind, SPAs can certainly rank well since Googlebot and other search engines can render JavaScript and this will likely only improve over time. Start with setting up pre-rendering or server-side rendering and start adding the content from there.

If you're an SEO-master with SPAs and I glossed over anything, I'd also love to hear how you tackle SEO!