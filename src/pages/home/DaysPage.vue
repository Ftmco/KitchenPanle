<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="روز ها"
        newTitle="روز جدید"
        :newAction="newDay"
        :reloadAction="loadDays"
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
        :items="days"
        :search="search"
        no-data-text="روزی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="error" text @click="removeDay(item)">
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
import { deleteDay, getDays } from "@/api/apis/day.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { ConfirmDialog, Dialog, TableHeaderModel } from "@/components/models";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    days: [] as Array<any>,
    headers: [
      {
        text: "روز",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "روز هفته",
        align: "start",
        sortable: true,
        value: "dayOfWeek",
      },
      {
        text: "",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ] as Array<TableHeaderModel>,
    isLoading: true,
    search: "",
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
        this.days.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadDays();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadDays() {
      this.isLoading = true;
      getDays()
        .then((dayRes) => {
          if (dayRes.status) this.days = dayRes.result.days;
        })
        .finally(() => (this.isLoading = false));
    },
    newDay() {
      const create: Dialog = {
        color: "primary",
        title: "ایجاد روز جدید",
        content: {
          component: () => import("@/components/day/Create.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    removeDay(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        title: "حذف روز",
        text: `آیا از حذف ${item.name} مطمئن هستید؟`,
        agreeText: "حذف",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(data: any) {
      deleteDay(data).then((delRes) => {
        if (delRes) this.findAndRemoveDay(data);
        this.showSnackbar(delRes.title);
      });
    },
    findAndRemoveDay(id: string) {
      let index = this.days.findIndex((d) => d.id == id);
      if (index != -1) this.days.splice(index, 1);
    },
  },
});
</script>