<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header title="گزارش غذا" :reloadAction="loadReports">
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
    <v-card elevation="4" class="rounded-lg"></v-card>
  </v-col>
</template>

<script lang="ts">
import { getHistory } from "@/api/apis/inventory.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { defaultPage, Pagination } from "@/components/models";
import { pageListSize } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    page: 1,
    pageCount: 1,
    reports: [] as Array<any>,
  }),
  mounted() {
    this.loadReports(defaultPage);
  },
  methods: {
    pageChange(value: any) {
      this.loadReports({ page: value - 1, count: pageListSize });
    },
    loadReports(pagination: Pagination) {
      this.isLoading = true;
      getHistory(pagination)
        .then((reportRes) => {
          if (reportRes.status) {
            this.page = pagination.page + 1;
            this.pageCount = reportRes.result.pageCount + 1;
            this.reports = reportRes.result.histories;
          }
        })
        .finally(() => (this.isLoading = false));
    },
  },
});
</script>