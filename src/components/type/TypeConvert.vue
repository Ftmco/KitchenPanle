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
        :items="converts"
        :search="search"
        no-data-text="نوعی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
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
import { getTypeConversions, getTypes } from "@/api/apis/type.api";
import { rules } from "@/constants";
import Vue from "vue";
import TableHeader from "../core/TableHeader.vue";
import AddConvert from "@/components/type/AddConvert.vue";
import { TableHeaderModel } from "../models";
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
    converts: [] as Array<any>,
    newConvert: false,
  }),
  created() {
    this.loadConversions();
  },
  methods: {
    loadConversions() {
      this.isLoading = true;
      getTypeConversions(this.type.id)
        .then((convertRes) => {
          if (convertRes.status) this.converts = convertRes.result.conversions;
        })
        .finally(() => (this.isLoading = false));
    },
    addConvert() {
      this.newConvert = !this.newConvert;
    },
  },
});
</script>