<template>
  <v-col cols="12">
    <v-form ref="typeForm">
      <v-col cols="12">
        <v-text-field
          outlined
          label="عنوان"
          placeholder="عنوان"
          clearable
          class="rounded-lg"
          v-model="name"
          :rules="[rules.require]"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          block
          :loading="inAction"
          :color="updateType ? 'warning' : 'primary'"
          class="rounded-lg"
          elevation="4"
          @click="submitType"
        >
          ثبت نوع
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { upsertType } from "@/api/apis/type.api";
import { rules } from "@/constants";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["updateType"],
  data: () => ({
    rules: rules,
    name: "",
    inAction: false,
  }),
  mounted() {
    if (this.updateType) {
      this.name= this.updateType.name;
    }
  },
  methods: {
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    submitType() {
      let isValid = (this.$refs.typeForm as any).validate();
      if (isValid) {
        upsertType({
          name: this.name,
          id: this.updateType ? this.updateType.id : null,
        }).then((upRes) => {
          if (upRes) {
            this.setDialogResult({
              status: true,
              data: upRes.result.measurement,
            });
            this.hideModal();
          }
          this.showSnackbar(upRes.title);
        });
      }
    },
  },
});
</script>