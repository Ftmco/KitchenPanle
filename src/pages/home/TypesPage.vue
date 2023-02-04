<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="نوع ها"
        newTitle="نوع جدید"
        :newAction="() => {}"
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
import { TableHeaderModel } from "@/components/models";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
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
        value: "title",
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
  mounted() {},
  methods: {
    ...mapMutations(DIALOG, ["showModal", "hideModal"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadTypes() {},
  },
});
</script>