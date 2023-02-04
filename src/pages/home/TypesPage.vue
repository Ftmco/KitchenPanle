<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="نوع ها"
        newTitle="نوع جدید"
        :newAction="addType"
        :reloadAction="loadTypes"
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
        :items="types"
        :search="search"
        no-data-text="نوعی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="warning" text @click="editType(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeType(item)">
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
import { deleteType, getTypes } from "@/api/apis/type.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { ConfirmDialog, Dialog, TableHeaderModel } from "@/components/models";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import {
  VCol,
  VCard,
  VTextField,
  VDataTable,
  VRow,
  VBtn,
  VIcon,
  VPagination,
} from "vuetify/lib";
import types, { mapMutations, mapState } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    page: 1,
    pageCount: 1,
    headers: [
      {
        text: "عنوان",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "تاریخ ایجاد",
        align: "start",
        sortable: true,
        value: "createDate",
      },
      {
        text: "",
        align: "center",
        sortable: false,
        value: "actions",
      },
    ] as Array<TableHeaderModel>,
    types: [] as Array<any>,
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
        this.findAndRemoveType(result.data.id);
        this.types.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadTypes();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "hideModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadTypes() {
      getTypes(0, 20)
        .then((typesRes) => {
          if (typesRes.status) {
            this.pageCount = typesRes.result.pageCount;
            this.types = typesRes.result.types;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addType() {
      const create: Dialog = {
        color: "primary",
        title: "ایجاد نوع جدید",
        content: {
          component: () => import("@/components/type/Upsert.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    editType(item: any) {
      const update: Dialog = {
        color: "warning",
        title: `ویرایش ${item.name}`,
        content: {
          component: () => import("@/components/type/Upsert.vue"),
          props: {
            updateType: item,
          },
        },
      };
      this.showModal(update);
    },
    findAndRemoveType(id: string) {
      let index = this.types.findIndex((type) => type.id == id);
      if (index != -1) {
        this.types.splice(index, 1);
      }
    },
    removeType(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        text: `آیا از حذف ${item.name} مطمئن هستید؟`,
        title: "حذف گروه",
        agreeText: "بله",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(data: any) {
      deleteType(data).then((delRes) => {
        if (delRes) {
          this.findAndRemoveType(data);
        }
        this.showSnackbar(delRes.title);
      });
    },
  },
});
</script>