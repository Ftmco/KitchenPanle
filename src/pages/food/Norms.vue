<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="نورم ها"
        newTitle="افزودن"
        :newAction="() => {}"
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
import { getNorms } from "@/api/apis/food.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { TableHeaderModel } from "@/components/models";
import Vue from "vue";
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
  mounted() {
    this.foodId = this.$route.query.foodId.toString();
    this.loadNorms();
  },
  methods: {
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
  },
});
</script>