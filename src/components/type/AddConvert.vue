<template>
  <v-card elevation="4" class="rounded-lg">
    <v-col cols="12">
      <v-form ref="convertForm">
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
              v-model="convert.toTypeId"
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
              v-model="convert.fromValue"
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
              v-model="convert.toValue"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              :loading="inAction"
              block
              color="primary"
              elevation="5"
              class="rounded-lg"
              @click="submitConvert"
            >
              افزودن
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { addTypeConvert, getTypes } from "@/api/apis/type.api";
import { TypeConvert } from "@/api/models/inventory.model";
import { rules } from "@/constants";
import Vue from "vue";
export default Vue.extend({
  props: ["typeId"],
  data: () => ({
    inAction: false,
    rules: rules,
    types: [] as Array<any>,
    convert: {} as TypeConvert,
  }),
  mounted() {
    this.convert.fromTypeId = this.typeId;
    this.loadTypes();
  },
  methods: {
    loadTypes() {
      getTypes({page:0,count:0}).then((typesRes) => {
        if (typesRes.status) this.types = typesRes.result.types;
      });
    },
    submitConvert() {
      let isValid = (this.$refs.convertForm as any).validate();
      if (isValid) {
        this.inAction = true
        addTypeConvert(this.convert).then((addRes) => {
            
        }).finally(()=> this.inAction = false);
      }
    },
  },
});
</script>