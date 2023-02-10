<template>
  <v-col cols="12">
    <v-form ref="mealForm">
      <v-col cols="12">
        <v-text-field
          outlined
          label="تعداد"
          placeholder="تعداد"
          type="number"
          clearable
          class="rounded-lg"
          v-model="count"
          :rules="[rules.numberRequire]"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          outlined
          class="rounded-lg"
          label="توضیحات"
          placeholder="توضیحات"
          clearable
          v-model="description"
          auto-grow
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          color="primary"
          block
          class="rounded-lg"
          :loading="inAction"
          @click="submitMeal"
        >
          ثبت غذا
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { makeMeal } from "@/api/apis/dayfood.api";
import { norm } from "@/api/urls";
import { rules } from "@/constants";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["dayFoodId"],
  data: () => ({
    inAction: false,
    rules: rules,
    count: 0,
    description: "",
  }),
  methods: {
    ...mapMutations(DIALOG, ["hideModal"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    submitMeal() {
      let isValid = (this.$refs.mealForm as any).validate();
      if (isValid) {
        this.inAction = true;
        makeMeal({
          id: this.dayFoodId,
          count: this.count,
          description: this.description,
        })
          .then((mealRes) => {
            if (mealRes.status) this.hideModal();
            this.showSnackbar(mealRes.title);
          })
          .finally(() => (this.inAction = false));
      }
    },
  },
});
</script>