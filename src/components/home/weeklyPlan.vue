<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="برنامه غذایی"
        newTitle="افزودن"
        :hasNewAction="true"
        :newAction="addFood"
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
        :items="daysFoods"
        :search="search"
        no-data-text="گروهی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
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
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
import TableHeader from "../core/TableHeader.vue";
import { Dialog, TableHeaderModel } from "../models";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    isLoading: true,
    headers: [
      {
        text: "روز",
        align: "start",
        sortable: true,
        value: "day",
      },
      {
        text: "وعده غذایی",
        align: "start",
        sortable: true,
        value: "meal",
      },
      {
        text: "نوع غذا",
        align: "start",
        sortable: true,
        value: "foodType",
      },
      {
        text: "غذا",
        align: "start",
        sortable: true,
        value: "food",
      },
      {
        text: "",
        align: "start",
        sortable: false,
        value: "actions",
      },
    ] as Array<TableHeaderModel>,
    daysFoods: [] as Array<any>,
  }),
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadDaysFoods() {},
    addFood() {
      const add: Dialog = {
        color: "primary",
        title: "افزودن غذای روز",
        content: {
          component: () => import("@/components/food/AddDayFood.vue"),
          props: {},
        },
      };
      this.showModal(add);
    },
  },
});
</script>