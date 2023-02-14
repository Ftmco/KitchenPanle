<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header title="موراد گزارش" :reloadAction="() => {}">
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
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="historyList"
        :search="search"
        no-data-text="موردی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import TableHeader from "../core/TableHeader.vue";
import { TableHeaderModel } from "../models";
export default Vue.extend({
  components: { TableHeader },
  props: ["historyList"],
  data: () => ({
    search: "",
    isLoading: false,
    headers: [
      {
        text: "عنوان",
        align: "center",
        sortable: true,
        value: "inventory.name",
      },
      {
        text: "مقدار",
        align: "center",
        sortable: true,
        value: "value",
      },
      {
        text: "موجودی قبلی",
        align: "center",
        sortable: true,
        value: "currentValue",
      },
      {
        text: "موجودی جدید",
        align: "center",
        sortable: true,
        value: "nextValue",
      },
    ] as Array<TableHeaderModel>,
  }),
});
</script>