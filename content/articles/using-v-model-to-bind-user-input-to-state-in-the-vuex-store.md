---
title: Using v-model to bind user input to state in the Vuex store
description: Learn how to use v-model to bind user input to a piece of state in your Vuex store using computed setters instead of using input events and value bindings.
coverImage: cover-image-using-v-model-to-bind-user-input-to-state-in-the-vuex-store.jpeg
alt: cover-image-using-v-model-to-bind-user-input-to-state-in-the-vuex-store
createdAt: 2021-01-16
---

##### ⚙️ Code

The example project used for this blog post can be found in this repository on Github: [woetflow-demo-user-input-vuex-state](https://github.com/WoetDev/woetflow-demo-user-input-vuex-state)

All this app contains is a component with the input and a component that prints the value from the state. It uses vue-tailwind for some styles and basic components.

--------
<br>

## 1. Creating the store
We'll start off by creating the store, since this will look the same for both methods.

```src/store/index.js:```

```javascript

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    values: {
      example: "Change my value to see the state update!"
    }
  },
  mutations: {
    setValues(state, values) {
      state.values = Object.assign({}, state.values, values);
    }
  }
});
```
<br>

So the store is quite straightforward: we create a values object with the example property set to a default value.

We're then creating a mutation that when commited, will set the state's values object to a newly created object. This new object uses the state's values object and the values object from the parameters as sources to set its properties.

## 2. Using input event and value bindings to manage state
One solution to bind user input to a piece of state in the Vuex store is using the input event and a value binding. This works, but it's not as intuitive as the usual way of keeping track of user input with v-model.

As you can see from the practical example here below, if you have lots of inputs it could start looking quite messy.

```src/components/events/EventsExample.vue:```
```html
<template>
  <div>
    <t-card
      header="This input uses the input event and a value binding to manage its state in the Vuex store"
    >
      <t-input-group>
        <t-input
          :value="values.example"
          @input="updateExample"
          id="example"
          name="example"
        />
      </t-input-group>
      <PrintStateEvents />
    </t-card>
  </div>
</template>
```
```javascript
<script>
import { mapState } from "vuex";
import PrintStateEvents from "@/components/events/PrintStateEvents";

export default {
  name: "EventsExample",
  components: {
    PrintStateEvents
  },
  computed: mapState(["values"]),
  methods: {
    updateExample(example) {
      this.$store.commit("setValues", { example: example });
    }
  }
};
</script>
```

So this would work, but there's a better way.

## 3. Using v-model with computed setters to manage state
In the previous example, we couldn't simply use v-model on the input because the store state must be immutable and v-model is two-way data binding. But luckily, computed setters are here to help!

So as you'll see from the code example below, when using v-model on the input, we don't need to make separate methods anymore and can remove the corresponding input event and value binding. All we to need is make a computer setter that will commit a mutation to the store and a computed getter to read it.

```src/components/setters/SettersExample.vue:```

```html
<template>
  <div>
    <t-card
      header="This input uses v-model with computed setters to manage its state in the Vuex store"
    >
      <t-input-group>
        <t-input
          name="example"
          v-model="example"
        />
      </t-input-group>
      <PrintStateSetters />
    </t-card>
  </div>
</template>
```
```javascript
<script>
import { mapState } from "vuex";
import PrintStateSetters from "@/components/setters/PrintStateSetters";

export default {
  name: "SettersExample",
  components: {
    PrintStateSetters
  },
  computed: {
    ...mapState(["values"]),
    example: {
      set(example) {
        this.$store.commit("setValues", { example });
      },
      get() {
        // Or remove mapState and use this.$store.state.values.example
        return this.values.example;
      }
    }
  }
};
</script>
```

And that's all there is to it! You can now happily apply v-model again combined with your Vuex state.