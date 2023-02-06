<template>
  <v-col cols="12">
    <v-form ref="groupForm">
      <v-row>
        <v-col cols="12">
          <v-text-field
            :rules="[rules.require]"
            v-model="group.name"
            outlined
            label="نام"
            placeholder="نام"
            clearable
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="group.status"
            label="وضعیت"
            placeholder="وضعیت"
            outlined
            clearable
            :items="status"
            item-value="value"
            item-text="title"
            class="rounded-lg"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-btn
            :loading="upserting"
            block
            :color="updateGroup ? 'warning' : 'primary'"
            @click="submitGroup"
            class="rounded-lg"
            elevation="5"
          >
            {{ updateGroup == null ? "ثبت گروه" : "ویرایش گروه" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import { rules, status } from "@/constants";
import { UpsertGroup } from "@/api/models/group.model";
import { mapMutations } from "vuex";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import { upsertGroup } from "@/api/apis/group.api";

export default Vue.extend({
  props: ["updateGroup"],
  data: () => ({
    group: {} as UpsertGroup,
    rules: rules,
    upserting: false,
    status: status,
  }),
  mounted() {
    this.setGroup();
  },
  methods: {
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    setGroup() {
      if (this.updateGroup != null) {
        this.group = {
          id: this.updateGroup.id,
          name: this.updateGroup.name,
          status: this.updateGroup.status,
        };
      }
    },
    submitGroup() {
      const isValid = (this.$refs.groupForm as any).validate();
      if (isValid) {
        this.upserting = true;
        upsertGroup(this.group).then((upRes) => {
          if (upRes.status) {
            this.setDialogResult({
              status: true,
              data: upRes.result.group,
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
