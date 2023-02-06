<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="موجودی"
        newTitle="افزودن"
        :newAction="addInventory"
        :reloadAction="loadInventories"
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
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="inventories"
        :search="search"
        no-data-text="موجودی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="getInventoryStatus(item.status).color">
            {{ getInventoryStatus(item.status).title }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="warning" text>
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text>
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { getInventories } from "@/api/apis/inventory.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { Dialog, TableHeaderModel } from "@/components/models";
import { getBaseStatusObj, getInventoryStatus } from "@/services/status";
import { DIALOG } from "@/store/store_types";
import Vue from "vue";
import { VCol, VCard, VTextField, VDataTable, VChip, VRow, VBtn, VIcon, VPagination } from "vuetify/lib";
import { mapMutations } from "vuex";
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
        text: "تاریخ ثبت",
        value: "createDate",
        align: "start",
        sortable: true,
      },
      {
        text: "توضیحات",
        value: "description",
        align: "center",
        sortable: false,
      },
      {
        text: "",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ] as Array<TableHeaderModel>,
    inventories: [],
    page: 1,
    pageCount: 1,
  }),
  mounted() {
    this.loadInventories();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal"]),
    loadInventories() {
      getInventories(0, 20)
        .then((invRes) => {
          if (invRes.status) {
            this.pageCount = invRes.result.pageCount;
            this.inventories = invRes.result.inventory;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addInventory() {
      const create: Dialog = {
        color: "primary",
        title: "افزودن موجودی",
        content: {
          component: () => import("@/components/inventory/Upsert.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    getInventoryStatus,
  },
});
</script>