<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header title="گزارش موجودی" :reloadAction="loadReports">
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
        :items="reports"
        :search="search"
        no-data-text="موردی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.count="{ item }">
          <v-chip color="primary">
            {{ item.historyList.length }}
          </v-chip>
        </template>

        <template v-slot:item.type="{ item }">
          <v-chip :color="item.type == 0 ? 'success' : 'warning'">
            {{ item.type == 0 ? "ورود" : "خروج" }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="info" text @click="showItemList(item)">
                مشاهده موارد
                <v-icon>mdi-list-status</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount" @input="pageChange" />
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { getHistory } from "@/api/apis/inventory.api";
import TableHeader from "@/components/core/TableHeader.vue";
import {
  defaultPage,
  Dialog,
  Pagination,
  TableHeaderModel,
} from "@/components/models";
import { pageListSize } from "@/constants";
import { searchList } from "@/services/search";
import { DIALOG } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    page: 1,
    pageCount: 1,
    reports: [] as Array<any>,
    headers: [
      {
        text: "تاریخ",
        align: "center",
        sortable: true,
        value: "createDate",
      },
      {
        text: "نوع",
        align: "center",
        sortable: true,
        value: "type",
      },
      {
        text: "توضیحات",
        align: "center",
        sortable: true,
        value: "description",
      },
      {
        text: "تعداد",
        align: "center",
        sortable: true,
        value: "count",
      },
      {
        text: "",
        align: "center",
        sortable: false,
        value: "actions",
      },
    ] as Array<TableHeaderModel>,
  }),
  mounted() {
    this.loadReports(defaultPage);
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal"]),
    pageChange(value: any) {
      this.loadReports({ page: value - 1, count: pageListSize, });
    },
    searchInput() {
      searchList(this.loadReports,this.search);
    },
    loadReports(pagination: Pagination, setPage: boolean = true) {
      this.isLoading = true;
      getHistory(pagination)
        .then((reportRes) => {
          if (reportRes.status) {
            this.reports = reportRes.result.histories;
            if (setPage) {
              this.page = pagination.page + 1;
              this.pageCount = reportRes.result.pageCount + 1;
            } else {
              this.page = 1;
              this.pageCount = 1;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    showItemList(item: any) {
      const list: Dialog = {
        color: "info",
        title: `موجودی ها`,
        content: {
          component: () => import("@/components/inventory/HistoryList.vue"),
          props: {
            historyList: item.historyList,
          },
        },
      };
      this.showModal(list);
    },
  },
});
</script>