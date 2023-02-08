<template>
  <v-card elevation="4" class="rounded-lg">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-select
            outlined
            clearable
            label="به نوع"
            placeholder="به نوع"
            :rules="[rules.requireSelect]"
            item-value="id"
            item-text="name"
            :items="types"
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            outlined
            clearable
            label="هر واحد"
            placeholder="هر واحد"
            type="number"
            :rules="[rules.numberRequire]"
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            outlined
            clearable
            label="معادل واحد"
            placeholder="معادل واحد"
            type="number"
            :rules="[rules.numberRequire]"
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12">
          <v-btn block color="primary" elevation="5" class="rounded-lg">
            افزودن
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { getTypes } from "@/api/apis/type.api";
import { rules } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    rules: rules,
    types: [] as Array<any>,
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