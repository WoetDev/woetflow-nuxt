---
title: Doing a chained bulk/batch API request with axios
description: A quick tip on how to perform a bulk/batch API request chained to another API request with axios.
coverImage: cover-image-doing-a-chained-bulk-api-call-in-axios.jpeg
alt: cover-image-doing-a-chained-bulk-api-call-in-axios
createdAt: 2021-01-21
---

##### 💡 Demo

The app we're using in this post contains a list of the first generation Pokémon with their sprites called from the PokéAPI and each Pokémon has a detail page showing more of their design and sprites. The app uses tailwind for the styles.

You can find a demo of it here: [Pokémon Sprites](https://pokemon-sprites.netlify.app/)

##### ⚙️ Code

The example project used for this blog post can be found in this repository on Github: [woetflow-demo-pokemon-sprites](https://github.com/WoetDev/woetflow-demo-pokemon-sprites).

-------
<br>

## 1. Adding axios and vue-axios

I'm using axios in a Vue project, so first let's go over how we can setup axios after creating the Vue project.

Start by installing the packages and adding it to the entry point of the app.

Run: ```yarn add axios vue-axios```

```src/main.js:```

```javascript
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

After that, we'll create a new api.js file in the src directory where we can set our base axios settings and requests.
```

```src/api.js:```

```javascript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  timeout: 5000
});

export default {
  getPokemons() {
    return axiosInstance.get("/pokemon", { params: { limit: 151 } });
  }
};
```

Here we created an axios instance that will prepend https://pokeapi.co/api/v2/ to all our API requests, so we only need to define the path in the actual request.

We also added the GET request ```getPokemons()``` with a query parameter of limit=151, so it will only return the first 151 pokémon.

With things set up, let's continue to do the batch API request.

## 2. Doing a chained bulk/batch API request

On the homepage, we're showing a list of the first 151 pokémon with their sprite, name and types.

From our ```getPokemons()``` API request, we'll only get a JSON object with the name of the pokémon and the URL to their complete JSON object that contains their sprite & type(s):

```json
{
"name": "bulbasaur",
"url": "https://pokeapi.co/api/v2/pokemon/1/"
}
```

This means we'll need to do an API request to the URL we have returned here for every pokémon to get the sprite and type(s).

Luckily, the ```axios.all()``` method makes this easy for us.

Here below you can see how we're chaining the API requests to get every pokémon's sprite, name and type(s).

```src/components/List.vue:```
`
```javascript
<script>
import api from "@/api";
import axios from "axios";

export default {
  name: "List",
  data: () => ({
    list: [],
    isLoading: true
  }),
  created() {
    api
      .getPokemons()
      .then(response => {
        const requests = response.data.results.map(pokemon => {
          return axios.get(pokemon.url);
        });
        axios
          .all(requests)
          .then(
            axios.spread((...responses) => {
              this.list = responses.map(response => {
                let types = response.data.types.map(pokemon => {
                  return pokemon.type.name;
                });
                types = types.join(" / ");

                return {
                  id: response.data.id,
                  name: response.data.name,
                  types: types,
                  sprite: response.data.sprites.front_default
                };
              });
              this.isLoading = false;
            })
          )
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
};
</script>
```

So lots of things going on here but step by step this is what we're doing in ```created()``` that gets called as soon as our component is created for render:

1. We import our api file from the src directory.

1. ```api.getPokemons()``` from this file gets us the list of JSON objects with the name & url of the first 151 pokémon.

1. In the requests variable we create an array of GET requests to the url of each pokémon by returning ```axios.get(pokemon.url)```.

1. We send the api requests for all these urls at the same time using ```axios.all(requests)```

1. If we've received a successful response from the api, we use ```axios.spread()``` to unpack the values from the response array and use the JavaScript spread operator ```...``` to unpack the values of each response.

1. With the unpacked responses, we can then perform any logic we want on the data. Here we add the data we need to a new object and add it to the list array that we can iterate. Every item in the list array will then contain a nice looking object like this:

```javascript
id: 1
name: "bulbasaur"
sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
types: "grass / poison"
```

Something to note with catch and ```axios.all()```: if any request fails, then the Promise will immediately reject and the error in catch will only be the error of the first failed request.

And that's it! If you have other ways of tackling batch api requests using axios, I'd love to hear it!

