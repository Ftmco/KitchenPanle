<template>
  <v-navigation-drawer app v-model="drawer" fixed temporary>
    <v-list nav dense>
      <v-list-item-group v-model="group" active-class="text--accent-4">
        <NavigationListItems :items="items" />
        <v-list-item @click="changeTheme">
          <v-list-item-icon>
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ theme }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changeDirection">
          <v-list-item-icon>
            <v-icon>mdi-directions</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ dir }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>


<script lang="ts">
import Vue from "vue";
import { navigationItems } from "@/constants/";
import NavigationListItems from "./NavigationListItems.vue";

export default Vue.extend({
  data: () => ({
    drawer: false,
    items: navigationItems,
    group: null,
    theme: "روشن",
    dir: "LTR",
    active: 0,
  }),
  created() {
    this.$root.$refs.navigationDrawer = this;
  },
  methods: {
    open() {
      this.drawer = true;
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.theme = this.$vuetify.theme.dark ? "تاریک" : "روشن";
      localStorage.setItem(
        "theme",
        this.$vuetify.theme.dark ? "Dark" : "Ligth"
      );
    },
    changeDirection() {
      this.$vuetify.rtl = !this.$vuetify.rtl;
      this.dir = this.$vuetify.rtl ? "RTL" : "LTR";
      localStorage.setItem(
        "dir",
        this.$vuetify.rtl ? "RTL" : "LTR"
      );
    },
  },
  components: { NavigationListItems },
});
</script>