<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="تبدیل نوع ها"
        newTitle="افزودن"
        :hasNewAction="true"
        :newAction="addConvert"
        :reloadAction="loadConversions"
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
    <br v-if="newConvert" />
    <add-convert v-if="newConvert" :typeId="type.id" />
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="conversions"
        :search="search"
        no-data-text="نوعی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="error" text @click="removeConvert(item)">
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import {
  deleteTypeConvert,
  getTypeConversions,
  getTypes,
} from "@/api/apis/type.api";
import { rules } from "@/constants";
import Vue from "vue";
import TableHeader from "../core/TableHeader.vue";
import AddConvert from "@/components/type/AddConvert.vue";
import { ConfirmDialog, TableHeaderModel } from "../models";
import { mapMutations, mapState } from "vuex";
import { DIALOG } from "@/store/store_types";
export default Vue.extend({
  components: { TableHeader, AddConvert },
  props: ["type"],
  data: () => ({
    rules: rules,
    search: "",
    isLoading: true,
    headers: [
      {
        text: "از نوع",
        align: "start",
        sortable: false,
        value: "fromType.name",
      },
      {
        text: "به نوع",
        align: "start",
        sortable: false,
        value: "toType.name",
      },
      {
        text: "از مقدار",
        align: "start",
        sortable: false,
        value: "fromValue",
      },
      {
        text: "به مقدار",
        align: "start",
        sortable: false,
        value: "toValue",
      },
      {
        text: "",
        align: "start",
        sortable: false,
        value: "actions",
      },
    ] as Array<TableHeaderModel>,
    conversions: [] as Array<any>,
    newConvert: false,
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
        this.conversions.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  created() {
    this.loadConversions();
  },
  methods: {
    ...mapMutations(DIALOG, ["showConfirm"]),
    loadConversions() {
      this.isLoading = true;
      getTypeConversions(this.type.id)
        .then((convertRes) => {
          if (convertRes.status) this.conversions = convertRes.result.conversions;
        })
        .finally(() => (this.isLoading = false));
    },
    addConvert() {
      this.newConvert = !this.newConvert;
    },
    removeConvert(item: any) {
      const confirm: ConfirmDialog = {
        title: "حذف تبدیل",
        text: ` آیا از حذف ${item.fromType.name} مطمئن هستید؟`,
        agreeText: "حذف",
        disagreeText: "لغو",
        data: item.id,
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(data: any) {
      deleteTypeConvert(data).then((delRes) => {
        if (delRes.status) {
          let index = this.conversions.findIndex((c) => c.id == data);
          if (index != -1) this.conversions.splice(index, 1);
        }
      });
    },
  },
});
</script>