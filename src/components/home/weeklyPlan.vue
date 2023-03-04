<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="برنامه غذایی"
        newTitle="افزودن"
        :hasNewAction="true"
        :newAction="addFood"
        :reloadAction="loadDaysFoods"
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
        :items="daysFoods"
        :search="search"
        no-data-text="موردی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.food.type="{ item }">
          <v-chip :color="item.food.type == 0 ? 'primary' : 'success'">
            {{ item.food.type == 0 ? "سرباز" : "کارمند" }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="info" text @click="makeMeal(item)">
                ایجاد وعده
                <v-icon>mdi-food-fork-drink</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="warning" text @click="editDayFood(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeDayFood(item)">
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          @input="pageChange"
        ></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { deleteDayFood, getDaysFoods } from "@/api/apis/dayfood.api";
import { pageListSize } from "@/constants";
import { searchList } from "@/services/search";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
import TableHeader from "../core/TableHeader.vue";
import {
  ConfirmDialog,
  defaultPage,
  Dialog,
  Pagination,
  TableHeaderModel,
} from "../models";
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
        value: "day.name",
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
        value: "food.type",
      },
      {
        text: "غذا",
        align: "start",
        sortable: true,
        value: "food.name",
      },
      {
        text: "",
        align: "start",
        sortable: false,
        value: "actions",
      },
    ] as Array<TableHeaderModel>,
    daysFoods: [] as Array<any>,
    pageCount: 1,
    page: 1,
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
        this.findAndRemoveDayFood(result.data.id);
        this.daysFoods.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadDaysFoods(defaultPage);
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    pageChange(value: any) {
      this.loadDaysFoods({ page: value - 1, count: pageListSize });
    },
    searchInput() {
      searchList(this.loadDaysFoods);
    },
    loadDaysFoods(pagination: Pagination, setPage: boolean = true) {
      this.isLoading = true;
      getDaysFoods(pagination)
        .then((foodsRes) => {
          if (foodsRes.status) {
            this.daysFoods = foodsRes.result.dayFoods;
            if (setPage) {
              this.pageCount = foodsRes.result.pageCount + 1;
              this.page = pagination.page + 1;
            } else {
              this.page = 1;
              this.pageCount = 1;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addFood() {
      const add: Dialog = {
        color: "primary",
        title: "افزودن غذای روز",
        content: {
          component: () => import("@/components/food/UpsertDayFood.vue"),
          props: {},
        },
      };
      this.showModal(add);
    },
    editDayFood(item: any) {
      const edit: Dialog = {
        color: "warning",
        title: "ویرایش غذای روز",
        content: {
          component: () => import("@/components/food/UpsertDayFood.vue"),
          props: {
            dayFoodUpdate: item,
          },
        },
      };
      this.showModal(edit);
    },
    makeMeal(item: any) {
      const meal: Dialog = {
        color: "info",
        title: "ایجاد وعده",
        content: {
          component: () => import("@/components/food/MakeMeal.vue"),
          props: {
            dayFoodId: item.id,
          },
        },
      };
      this.showModal(meal);
    },
    findAndRemoveDayFood(id: string) {
      let index = this.daysFoods.findIndex((df) => df.id == id);
      if (index != -1) this.daysFoods.splice(index, 1);
    },
    removeDayFood(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        title: "حذف غذای روزانه",
        text: `آیا از حذف ${item.food.name} از روز ${item.day.name} مطمئن هستید؟`,
        agreeText: "حذف",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(data: any) {
      deleteDayFood(data).then((delRes) => {
        if (delRes.status) this.findAndRemoveDayFood(data);
        this.showSnackbar(delRes.title);
      });
    },
  },
});
</script>