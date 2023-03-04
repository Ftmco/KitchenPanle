<template>
  <v-col cols="12">
    <v-form ref="inventoryForm">
      <v-row>
        <v-col cols="12">
          <v-text-field
            outlined
            clearable
            label="عنوان"
            placeholder="عنوان"
            class="rounded-lg"
            :rules="[rules.require]"
            v-model="inventory.name"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            v-model="inventory.value"
            outlined
            clearable
            label="مقدار"
            placeholder="مقدار"
            type="number"
            class="rounded-lg"
            :rules="[rules.require]"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-text-field
            v-model="inventory.alertLimit"
            outlined
            clearable
            label="حد هشدار"
            placeholder="حد هشدار"
            type="number"
            class="rounded-lg"
            :rules="[rules.require]"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-select
            v-model="inventory.typeId"
            :items="types"
            item-text="name"
            item-value="id"
            outlined
            clearable
            label="نوع مقدار"
            placeholder="نوع مقدار"
            class="rounded-lg"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <v-select
            v-model="inventory.groupId"
            :items="groups"
            item-text="name"
            item-value="id"
            outlined
            clearable
            label="دسته بندی"
            placeholder="دسته بندی"
            class="rounded-lg"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="inventory.description"
            outlined
            label="توضیحات"
            placeholder="توضیحات"
            clearable
            class="rounded-lg"
            rows="5"
            auto-grow
            :rules="[rules.require]"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            block
            :color="updateInventory ? 'warning' : 'primary'"
            elevation="4"
            class="rounded-lg"
            @click="submitInventory"
            :loading="inAction"
          >
            ثبت موجودی
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script lang="ts">
import { getGroups } from "@/api/apis/group.api";
import { upsertInventory } from "@/api/apis/inventory.api";
import { getTypes } from "@/api/apis/type.api";
import { UpsertInventory } from "@/api/models/inventory.model";
import { rules } from "@/constants";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["updateInventory"],
  data: () => ({
    rules: rules,
    types: [],
    groups: [] as Array<any>,
    inventory: {} as UpsertInventory,
    inAction: false,
  }),
  mounted() {
    this.setInventory();
    this.loadTypes();
    this.loadGroups();
  },
  methods: {
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    loadTypes() {
      getTypes({ page: 0, count: 0 }).then((typesRes) => {
        if (typesRes.status) this.types = typesRes.result.types;
      });
    },
    loadGroups() {
      getGroups({ page: 0, count: 0, q: "" }).then((groupsRes) => {
        if (groupsRes.status) {
          this.groups = groupsRes.result.groups;
        }
      });
    },
    setInventory() {
      if (this.updateInventory) {
        this.inventory = {
          name: this.updateInventory.name,
          id: this.updateInventory.id,
          alertLimit: this.updateInventory.alertLimit,
          description: this.updateInventory.description,
          typeId: this.updateInventory.type.id,
          value: this.updateInventory.value,
          groupId: this.updateInventory.group.id,
        };
      }
    },
    submitInventory() {
      let isValid = (this.$refs.inventoryForm as any).validate();
      if (isValid) {
        this.inAction = true;
        upsertInventory(this.inventory)
          .then((upRes) => {
            if (upRes.status) {
              this.setDialogResult({
                status: true,
                data: upRes.result.inventory,
              });
              this.hideModal();
            }
            this.showSnackbar(upRes.title);
          })
          .finally(() => (this.inAction = false));
      }
    },
  },
});
</script>