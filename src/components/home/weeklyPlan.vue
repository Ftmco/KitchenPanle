<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="برنامه غذایی"
        newTitle="روز جدید"
        :newAction="() => {}"
        :reloadAction="() => {}"
      >
        <template v-slot:search>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="جستجو"
            single-line
            hide-details
          ></v-text-field>
        </template>
      </table-header>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import TableHeader from "../core/TableHeader.vue";
export default Vue.extend({
  components: { TableHeader },
  data:()=>({
    search:""
  })
});
</script>