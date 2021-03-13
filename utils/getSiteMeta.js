const type = "website";
const url = "https://woetflow.com";
const title = "Posts";
const description = "I write about web development in Vue.js and Ruby on Rails, agile, side projects or anything else that pops into my head.";
const coverImage = "https://woetflow.com/images/main-image.jpeg";

export default (meta) => {
  return [
    {
      hid: "description",
      name: "description",
      content: (meta && meta.description) || description,
    },
    {
      hid: "og:type",
      property: "og:type",
      content: (meta && meta.type) || type,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: (meta && meta.url) || url,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: (meta && meta.title) || title,
    },
    {
      hid: "og:description",
      property: "og:description",
      content: (meta && meta.description) || description,
    },
    {
      hid: "og:image",
      property: "og:image",
      content: (meta && meta.coverImage) || coverImage,
    },
    { 
      hid: "twitter:card",
      name: "twitter:card", 
      content: "summary_large_image" },
    {
      hid: "twitter:url",
      name: "twitter:url",
      content: (meta && meta.url) || url,
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: (meta && meta.title) || title,
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: (meta && meta.description) || description,
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: (meta && meta.coverImage) || coverImage,
    },
  ];
};