<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="موجودی"
        newTitle="افزودن"
        :newAction="()=>{}"
        :reloadAction="()=>{}"
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
import TableHeader from "@/components/core/TableHeader.vue";
import Vue from "vue";
export default Vue.extend({
  components: { TableHeader },
    data:()=>({
        search:''
    })
});
</script>