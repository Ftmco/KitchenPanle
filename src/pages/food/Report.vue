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
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="reports"
        :search="search"
        no-data-text="نظری یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.food.type="{ item }">
          <v-chip :color="item.food.type == 0 ? 'primary' : 'success'">
            {{ item.food.type == 0 ? "سرباز" : "کارمند" }}
          </v-chip>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { getHistory } from "@/api/apis/dayfood.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { defaultPage, Pagination, TableHeaderModel } from "@/components/models";
import Vue from "vue";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    reports: [] as Array<any>,
    headers: [
      {
        text: "وعده",
        align: "center",
        sortable: true,
        value: "meal",
      },
      {
        text: "غذا",
        align: "center",
        sortable: true,
        value: "food.name",
      },
      {
        text: "روز",
        align: "center",
        sortable: true,
        value: "day.name",
      },
      {
        text: "تعداد",
        align: "center",
        sortable: true,
        value: "count",
      },
      {
        text: "تاریخ",
        align: "center",
        sortable: true,
        value: "createDate",
      },
      {
        text: "نوع غذا",
        align: "center",
        sortable: true,
        value: "food.type",
      },
      {
        text: "توضیحات",
        align: "center",
        sortable: true,
        value: "description",
      },
    ] as Array<TableHeaderModel>,
    isLoading: true,
    search: "",
    pageCount: 1,
    page: 1,
  }),
  mounted() {
    this.loadReports(defaultPage);
  },
  methods: {
    loadReports(pagination: Pagination) {
      this.isLoading = true;
      getHistory(pagination)
        .then((reportRes) => {
          if (reportRes.status) {
            this.page = pagination.page + 1;
            this.pageCount = reportRes.result.pageCount + 1;
            this.reports = reportRes.result.history;
          }
        })
        .finally(() => (this.isLoading = false));
    },
  },
});
</script>