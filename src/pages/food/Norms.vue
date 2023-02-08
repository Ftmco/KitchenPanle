<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="نورم ها"
        newTitle="افزودن"
        :newAction="addNorm"
        :reloadAction="loadNorms"
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
        :items="norms"
        :search="search"
        no-data-text="نورمی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="error" text @click="removeNorm(item)">
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
import { getNorms, removeNorm } from "@/api/apis/food.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { ConfirmDialog, Dialog, TableHeaderModel } from "@/components/models";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    foodId: "",
    search: "",
    isLoading: true,
    norms: [] as Array<any>,
    headers: [
      {
        text: "عنوان",
        value: "inventory.name",
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
        text: "تاریخ ایجاد",
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
        this.norms.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.foodId = this.$route.query.foodId.toString();
    this.loadNorms();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadNorms() {
      this.isLoading = true;
      getNorms(this.foodId)
        .then((normsRes) => {
          if (normsRes.status) {
            this.norms = normsRes.result.norms;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addNorm() {
      const add: Dialog = {
        color: "info",
        title: "افزودن نورم",
        content: {
          component: () => import("@/components/food/AddNorm.vue"),
          props: {
            foodId: this.foodId,
          },
        },
      };
      this.showModal(add);
    },
    removeNorm(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        title: "حذف نورم",
        text: `آیا از حذف ${item.inventory.name} مطمئن هستید؟`,
        agreeText: "حذف",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    findAndRemoveNorm(id: string) {
      let index = this.norms.findIndex((n) => n.id == id);
      if (index != -1) this.norms.splice(index, 1);
    },
    deleteConfirm(data: any) {
      removeNorm(data).then((removeRes) => {
        if (removeRes.status) {
          this.findAndRemoveNorm(data);
        }
        this.showSnackbar(removeRes.title);
      });
    },
  },
});
</script>