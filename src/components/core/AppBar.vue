<template>
  <div>
    <v-app-bar app>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon v-if="!hasBack" @click="drawer"></v-app-bar-nav-icon>

        <v-btn icon v-if="hasBack" @click="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title>{{ title }}</v-card-title>
        <v-spacer></v-spacer>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <TheNavigation />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TheNavigation from "./TheNavigation.vue";

export default Vue.extend({
  name: "AppBar",
  data: () => ({
    title: "Home",
    hasBack: false,
  }),
  components: {
    TheNavigation,
  },
  mounted() {
    this.setData();
  },
  watch: {
    $route() {
      this.setData();
    },
  },
  methods: {
    drawer() {
      (this.$root.$refs.navigationDrawer as any).open();
    },
    setData() {
      let meta = (this.$route as any).meta(this.$route);
      this.title = meta.title;
      this.hasBack = meta.hasBack;
    },

    back() {
      this.$router.back();
    },
  },
});
</script>