<template>
  <v-container>
    <BackBtn />
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
                Posted on
                {{ formatDate(article.createdAt) }}
              </div>
            </v-img>
            <div class="pa-9">
              <nav class="toc">
                <h2>📋 Table of contents</h2>
                <ul>
                  <li v-for="link of article.toc" :key="link.id">
                    <NuxtLink :to="`#${link.id}`" :class="{'ml-4': link.depth === 3 }">{{ link.text }}</NuxtLink>
                  </li>
                </ul>
              </nav>
              <nuxt-content :document="article" />
            </div>
          </v-card>
        </article>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import getSiteMeta from '@/utils/getSiteMeta';

export default {
  name: 'ArticlePage',
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.article.title,
        description: this.article.description,
        url: `${process.env.baseUrl}/posts/${this.$route.params.slug}`,
        coverImage: `${process.env.baseUrl}/images/covers/${this.article.coverImage}`,
      };
      return getSiteMeta(metaData);
    },
  },
  head() {
    console.log(...this.meta)
    

    return {
      title: this.article.title,
      meta: [
        ...this.meta,
        {
          property: 'article:published_time',
          content: this.article.createdAt,
        },
        {
          property: 'article:modified_time',
          content: this.article.updatedAt,
        },
        {
          property: 'article:tag',
          content: this.article.tags ? this.article.tags.toString() : '',
        },
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: 'Woet' || '' },
        {
          name: 'twitter:data2',
          content: this.article.tags ? this.article.tags.toString() : '',
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${process.env.baseUrl}/posts/${this.$route.params.slug}`,
        },
      ],
    };
  },
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

<style lang="scss">
// Title styling
h1 {
  font-size: 2em;
}

.nuxt-article {
  .v-image {
    .v-responsive__sizer {
      padding: 0 !important;
    }
  }
}

// Table of contents styling
.toc {
  margin-bottom: 25px;

  ul {
    list-style: none;
    padding-left: 10px;

    li {
      margin: 10px 0;
      
      a {
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// Content styling
.nuxt-content {
  h2, h3, h4, h5 {
    margin-bottom: 10px;
  }

  h5 {
    font-size: 1.5em;

    .icon {
      display: none !important;
    }
  }

  p {
    code {
      padding: 6px !important;
    }
  }

  pre {
    border-radius: 5px;
    margin-bottom: 20px;

    code {
      background: transparent !important;
      padding: 0 !important;
      box-shadow: none;
    }
  }


  code,
  pre {
    color: #c3cee3 !important;
    background: #263238 !important;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }

  .icon.icon-link {
    position: relative;
    bottom: 2px;
    background-image: url('~assets/anchor-hashtag.svg');
    display: inline-block;
    width: 15px;
    height: 15px;
    background-size: 15px 15px;
    padding-right: 20px;
  }
}
</style>