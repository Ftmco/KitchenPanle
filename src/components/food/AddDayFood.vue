<template>
  <v-col cols="12">
    <v-form ref="dayFoodForm">
      <v-row>
        <v-col cols="12" md="6" sm="6">
          <v-select
            outlined
            label="روز"
            placeholder="روز"
            clearable
            :items="days"
            item-text="name"
            item-value="id"
            class="rounded-lg"
            v-model="dayFood.dayId"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-select
            outlined
            label="غذا"
            placeholder="غذا"
            clearable
            :items="foods"
            item-text="name"
            item-value="id"
            class="rounded-lg"
            v-model="dayFood.foodId"
            @change="foodSelect"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            label="وعده غذایی"
            placeholder="وعده غذایی"
            clearable
            class="rounded-lg"
            v-model="dayFood.meal"
          />
        </v-col>
        <v-col cols="12">
          <v-select
            outlined
            label="نوع غذا"
            placeholder="نوع غذا"
            item-text="title"
            item-value="value"
            class="rounded-lg"
            :items="foodTypes"
            v-model="dayFood.type"
            readonly
          />
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary"
            block
            class="rounded-lg"
            :loading="inAction"
            @click="submiteDayFood"
          >
            ثبت غذا
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { getDays } from "@/api/apis/day.api";
import { getFoods } from "@/api/apis/food.api";
import { UpsertDayFood } from "@/api/models/food.model";
import { rules } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  data: () => ({
    dayFood: {} as UpsertDayFood,
    days: [] as Array<any>,
    foods: [] as Array<any>,
    rules: rules,
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
  beforeMount() {
    this.loadDays();
    this.loadFoods();
  },
  methods: {
    loadFoods() {
      getFoods(0, 0).then((foodsRes) => {
        if (foodsRes.status) this.foods = foodsRes.result.foods;
      });
    },
    loadDays() {
      getDays().then((daysRes) => {
        if (daysRes.status) this.days = daysRes.result.days;
      });
    },
    foodSelect(id: any) {
      let index = this.foods.findIndex((f) => f.id == id);
      if (index != -1) {
        let food = this.foods[index];
        this.dayFood.type = food.type;
      }
    },
    submiteDayFood() {},
  },
});
</script>