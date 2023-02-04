<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12">
        <v-text-field
          outlined
          clearable
          label="عنوان"
          placeholder="عنوان"
          class="rounded-lg"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          outlined
          clearable
          label="مقدار"
          placeholder="مقدار"
          type="number"
          class="rounded-lg"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-text-field
          outlined
          clearable
          label="حد هشدار"
          placeholder="حد هشدار"
          type="number"
          class="rounded-lg"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          :items="types"
          item-text="name"
          item-value="id"
          outlined
          clearable
          label="نوع مقدار"
          placeholder="نوع مقدار"
          type="number"
          class="rounded-lg"
        />
      </v-col>

      <v-col cols="12">
        <v-textarea
          outlined
          label="توضیحات"
          placeholder="توضیحات"
          clearable
          class="rounded-lg"
          rows="5"
          auto-grow
          :rules="[rules.require]"
        />
      </v-col>

      <v-col cols="12">
        <v-btn block color="primary" elevation="4" class="rounded-lg">
          افزودن موجودی
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { getTypes } from "@/api/apis/type.api";
import { rules } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    rules: rules,
    types: [],
  }),
  mounted() {
    this.loadTypes();
  },
  methods: {
    loadTypes() {
      getTypes(0, 0).then((typesRes) => {
        if (typesRes.status) this.types = typesRes.result.types;
      });
    },
  },
});
</script>