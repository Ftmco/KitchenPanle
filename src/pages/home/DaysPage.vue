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
        no-data-text="گروهی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="warning" text @click="editDay(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
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
import TableHeader from "@/components/core/TableHeader.vue";
import { TableHeaderModel } from "@/components/models";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
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
  mounted() {},
  methods: {
    ...mapMutations(DIALOG, ["showModal"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadDays() {},
    newDay() {},
    editDay(item: any) {},
    removeDay(item: any) {},
  },
});
</script>