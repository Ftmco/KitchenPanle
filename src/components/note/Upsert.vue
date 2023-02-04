<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          outlined
          label="عنوان"
          placeholder="عنوان"
          clearable
          class="rounded-lg"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          outlined
          clearable
          label="سطح اهمیت"
          placeholder="سطح اهمیت"
          type="number"
          class="rounded-lg"
          :rules="[rules.requireSelect]"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          outlined
          label="متن"
          placeholder="متن"
          auto-grow
          rows="5"
          clearable
          class="rounded-lg"
          :rules="[rules.require]"
        />
      </v-col>

      <v-col cols="12">
        <v-btn block color="primary" elevation="4" class="rounded-lg">
          ثبت یادداشت
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { rules } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    rules: rules,
  }),
});
</script>