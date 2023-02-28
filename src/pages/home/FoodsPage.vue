<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="غذا ها"
        newTitle="غذای جدید"
        :hasNewAction="true"
        :newAction="addFood"
        :reloadAction="loadFoods"
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
        :items="foods"
        no-data-text="نظری یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.type="{ item }">
          <v-chip :color="item.type == 0 ? 'primary' : 'success'">
            {{ item.type == 0 ? "سرباز" : "کارمند" }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getBaseStatusObj(item.status).color">
            {{ getBaseStatusObj(item.status).title }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn
                block
                color="info"
                text
                :to="{
                  name: 'Norms',
                  query: { name: item.name, foodId: item.id },
                }"
              >
                مشاهده نورم
                <v-icon>mdi-list-status</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="warning" text @click="editFood(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeFood(item)">
                حذف
                <v-icon>mdi-delete</v-icon>
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
import { deleteFood, getFoods } from "@/api/apis/food.api";
import TableHeader from "@/components/core/TableHeader.vue";
import {
  ConfirmDialog,
  defaultPage,
  Dialog,
  Pagination,
  TableHeaderModel,
} from "@/components/models";
import { pageListSize } from "@/constants";
import router from "@/router";
import { searchList } from "@/services/search";
import { getBaseStatusObj } from "@/services/status";
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
        text: "نام",
        value: "name",
        align: "start",
        sortable: true,
      },
      {
        text: "نوع غذا",
        value: "type",
        align: "start",
        sortable: true,
      },
      {
        text: "تاریخ ایجاد",
        value: "createDate",
        align: "center",
        sortable: true,
      },
      {
        text: "وضعیت",
        value: "status",
        align: "center",
        sortable: true,
      },
      {
        text: "",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ] as Array<TableHeaderModel>,
    foods: [] as Array<any>,
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
        this.findAndRemoveFood(result.data.id);
        this.foods.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadFoods(defaultPage(this.search));
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    pageChange(value: any) {
      this.loadFoods({ page: value - 1, count: pageListSize });
    },
    searchInput(value: string) {
     searchList(value,this.loadFoods);
    },
    loadFoods(pagination: Pagination) {
      this.isLoading = true;
      getFoods(pagination)
        .then((foodsRes) => {
          if (foodsRes.status) {
            this.page = pagination.page + 1;
            this.pageCount = foodsRes.result.pageCount + 1;
            this.foods = foodsRes.result.foods;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addFood() {
      const create: Dialog = {
        color: "primary",
        title: "افزودن غذای جدید",
        content: {
          component: () => import("@/components/food/Upsert.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    editFood(item: any) {
      const update: Dialog = {
        color: "warning",
        title: `ویرایش ${item.name}`,
        content: {
          component: () => import("@/components/food/Upsert.vue"),
          props: {
            updateFood: item,
          },
        },
      };
      this.showModal(update);
    },
    removeFood(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        text: `آیا از حذف ${item.name} مطمئن هستید؟`,
        agreeText: "حذف",
        disagreeText: "لغو",
        title: "حذف غذا",
      };
      this.showConfirm(confirm);
    },
    findAndRemoveFood(id: string) {
      let index = this.foods.findIndex((f) => f.id == id);
      if (index != -1) this.foods.splice(index, 1);
    },
    deleteConfirm(data: any) {
      deleteFood(data).then((delRes) => {
        if (delRes.status) {
          this.findAndRemoveFood(data);
        }
        this.showSnackbar(delRes.title);
      });
    },
    getBaseStatusObj,
  },
});
</script>