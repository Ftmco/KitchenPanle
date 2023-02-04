<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="موجودی"
        newTitle="افزودن"
        :newAction="addInventory"
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
          <v-chip :color="getBaseStatusObj(item.status).color">
            {{ getBaseStatusObj(item.status).title }}
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
import TableHeader from "@/components/core/TableHeader.vue";
import { Dialog, TableHeaderModel } from "@/components/models";
import { getBaseStatusObj } from "@/services/status";
import { DIALOG } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    headers: [
      {
        text: "عنوان",
        value: "title",
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
        value: "valueType",
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
  methods: {
    ...mapMutations(DIALOG, ["showModal"]),
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
    getBaseStatusObj,
  },
});
</script>