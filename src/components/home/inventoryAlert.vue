<template>
    <v-col cols="12">
      <v-card elevation="4" class="rounded-lg">
        <table-header
          title="هشدار موجودی"
          newTitle=""
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
              @input="searchInput"
            ></v-text-field>
          </template>
        </table-header>
      </v-card>
      <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="inventories"
        :search="search"
        no-data-text="هشداری یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="getInventoryStatus(item.status).color">
            {{ getInventoryStatus(item.status).title }}
          </v-chip>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount" @input="pageChange"/>
      </div>
    </v-card>
  </v-col>
    </v-col>
  </template>
  
  <script lang="ts">
import { getAlertLimit } from "@/api/apis/inventory.api";
import { pageListSize } from "@/constants";
import { searchList } from "@/services/search";
import { getInventoryStatus } from "@/services/status";
import Vue from "vue";
import TableHeader from "../core/TableHeader.vue";
import { defaultPage, Pagination, TableHeaderModel } from "../models";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    headers: [
      {
        text: "عنوان",
        value: "name",
        align: "start",
        sortable: true,
      },
      {
        text: "مقدار",
        value: "value",
        align: "start",
        sortable: true,
      },
      {
        text: "حد هشدار",
        value: "alertLimit",
        align: "start",
        sortable: true,
      },
      {
        text: "نوع مقدار",
        value: "type.name",
        align: "start",
        sortable: true,
      },
      {
        text: "وضعیت",
        value: "status",
        align: "start",
        sortable: true,
      },
      {
        text: "دسته بندی",
        value: "group.name",
        align: "start",
        sortable: true,
      },
      {
        text: "تاریخ ثبت",
        value: "createDate",
        align: "start",
        sortable: true,
      },
      {
        text: "",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ] as Array<TableHeaderModel>,
    inventories: [] as Array<any>,
    page: 1,
    pageCount: 1,
  }),
  mounted() {
    this.loadAlertLimit(defaultPage);
  },
  methods: {
    pageChange(value: any) {
      this.loadAlertLimit({ page: value - 1, count: pageListSize });
    },
    searchInput() {
      searchList(this.loadAlertLimit);
    },
    loadAlertLimit(pagination: Pagination, setPage: boolean = true) {
      this.isLoading = true;
      getAlertLimit(pagination)
        .then((limitRes) => {
          if (limitRes.status) {
            this.inventories = limitRes.result.inventory;
            this.$emit("alertCount", {
              alertCount: this.inventories.length,
            });
            if (setPage) {
              this.page = pagination.page + 1;
              this.pageCount = limitRes.result.pageCount + 1;
            } else {
              this.page = 1;
              this.pageCount = 1;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    getInventoryStatus,
  },
});
</script>