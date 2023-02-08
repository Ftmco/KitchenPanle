<template>
  <v-col cols="12">
    <v-form ref="dayForm">
      <v-row>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            outlined
            label="نام"
            placeholder="نام"
            class="rounded-lg"
            clearable
            :rules="[rules.require]"
            v-model="day.name"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            outlined
            label="روز هفته"
            placeholder="روز هفته"
            class="rounded-lg"
            clearable
            :rules="[rules.require]"
            v-model="day.dayOfWeek"
            type="number"
          />
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            color="primary"
            class="rounded-lg"
            elevation="4"
            :loading="inAction"
            @click="submitDay"
          >
            ثبت روز
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { addDay } from "@/api/apis/day.api";
import { AddDay } from "@/api/models/day.model";
import { rules } from "@/constants";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  data: () => ({
    rules: rules,
    day: {} as AddDay,
    inAction: false,
  }),
  methods: {
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    submitDay() {
      addDay(this.day).then((addRes) => {
        if (addRes.status) {
          this.setDialogResult({
            status: true,
            data: addRes.result.day,
          });
          this.hideModal();
        }
        this.showSnackbar(addRes.title);
      });
    },
  },
});
</script>