<template>
  <v-col cols="12">
    <v-form ref="foodForm">
      <v-col cols="12">
        <v-text-field
          outlined
          label="نام"
          placeholder="نام"
          clearable
          class="rounded-lg"
          v-model="food.name"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12">
        <v-select
          v-model="food.type"
          :items="foodTypes"
          item-text="title"
          item-value="value"
          outlined
          clearable
          label="نوع غذا"
          placeholder="نوع غذا"
          class="rounded-lg"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          :color="updateFood ? 'warning' : 'primary'"
          block
          class="rounded-lg"
          :loading="inAction"
          @click="submiteFood"
        >
          ثبت غذا
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { upsertFood } from "@/api/apis/food.api";
import { UpsertFood } from "@/api/models/food.model";
import { rules } from "@/constants";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["updateFood"],
  data: () => ({
    rules: rules,
    food: {} as UpsertFood,
    inAction: false,
    foodTypes: [
      {
        title: "سرباز",
        value: 0,
      },
      {
        title: "کارمند",
        value: 1,
      },
    ],
  }),
  mounted() {
    if (this.updateFood) {
      this.food = {
        name: this.updateFood.name,
        id: this.updateFood.id,
        type: this.updateFood.type,
      };
    }
  },
  methods: {
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    submiteFood() {
      let isValid = (this.$refs.foodForm as any).validate();
      if (isValid) {
        this.inAction = true;
        upsertFood(this.food)
          .then((upRes) => {
            if (upRes.status) {
              this.setDialogResult({
                status: true,
                data: upRes.result.food,
              });
              this.hideModal();
            }
          })
          .finally(() => (this.inAction = false));
      }
    },
  },
});
</script>