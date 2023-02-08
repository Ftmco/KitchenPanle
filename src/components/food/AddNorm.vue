<template>
  <v-col cols="12">
    <v-form ref="normForm">
      <v-row>
        <v-col cols="12" md="6" sm="6">
          <v-select
            outlined
            class="rounded-lg"
            label="ماده غذایی"
            placeholder="ماده غذایی"
            clearable
            :items="inventories"
            item-text="name"
            item-value="id"
            v-model="norm.inventoryId"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-select
            outlined
            class="rounded-lg"
            label="نوع اندازه گیری"
            placeholder="نوع اندازه گیری"
            clearable
            :items="types"
            item-text="name"
            item-value="id"
            v-model="norm.typeId"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            outlined
            class="rounded-lg"
            label="مقدار"
            placeholder="مقدار"
            clearable
            type="number"
            v-model="norm.value"
          />
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            color="primary"
            class="rounded-lg"
            elevation="4"
            :loading="inAction"
            @click="submitNorm"
          >
            ثبت نورم
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { addNorm } from "@/api/apis/food.api";
import {
  getPreviewInventories,
} from "@/api/apis/inventory.api";
import { getTypes } from "@/api/apis/type.api";
import { AddNorm } from "@/api/models/food.model";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["foodId"],
  data: () => ({
    inventories: [] as Array<any>,
    types: [] as Array<any>,
    norm: {} as AddNorm,
    inAction: false,
  }),
  beforeMount() {
    this.loadInventories();
    this.loadTypes();
  },
  mounted() {
    this.norm.foodId = this.foodId;
  },
  methods: {
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadInventories() {
      getPreviewInventories().then((invRes) => {
        if (invRes.status) this.inventories = invRes.result.inventory;
      });
    },
    loadTypes() {
      getTypes(0, 0).then((typeRes) => {
        if (typeRes.status) this.types = typeRes.result.types;
      });
    },
    submitNorm() {
      let isValid = (this.$refs.normForm as any).validate();
      if (isValid) {
        this.inAction = true;
        addNorm(this.norm).then((addRes) => {
          if (addRes.status) {
            this.setDialogResult({
              status: true,
              data: addRes.result.norm,
            });
            this.hideModal();
          }
          this.showSnackbar(addRes.title);
        });
      }
    },
  },
});
</script>