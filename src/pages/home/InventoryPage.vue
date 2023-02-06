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
              <v-btn block color="warning" text @click="editInventory(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeInventory(item)">
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
import { deleteInventory, getInventories } from "@/api/apis/inventory.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { ConfirmDialog, Dialog, TableHeaderModel } from "@/components/models";
import { getBaseStatusObj, getInventoryStatus } from "@/services/status";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
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
        text: "خد هشدار",
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
    inventories: [] as Array<any>,
    page: 1,
    pageCount: 1,
  }),
  computed: {
    ...mapState(DIALOG, {
      dialogResult: `dialogResult`,
      confirmDialogResult: `confirmDialogResult`,
    }),
  },
  watch: {
    dialogResult(result) {
      if (result != undefined && result.status) {
        this.findAndRemoveInventory(result.data.id);
        this.inventories.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadInventories();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
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
    editInventory(item: any) {
      const update: Dialog = {
        color: "warning",
        title: `ویرایش ${item.name}`,
        content: {
          component: () => import("@/components/inventory/Upsert.vue"),
          props: {
            updateInventory: item,
          },
        },
      };
      this.showModal(update);
    },
    removeInventory(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        text: `آیا از حذف ${item.name} مطمئن هستید؟`,
        title: "حذف موجودی",
        agreeText: "حذف",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    findAndRemoveInventory(id: string) {
      let index = this.inventories.findIndex((inv) => inv.id == id);
      if (index != -1) this.inventories.splice(index, 1);
    },
    deleteConfirm(data: any) {
      deleteInventory(data).then((delRes) => {
        if (delRes.status) {
          this.findAndRemoveInventory(data);
        }
        this.showSnackbar(delRes.title);
      });
    },
    getInventoryStatus,
  },
});
</script>