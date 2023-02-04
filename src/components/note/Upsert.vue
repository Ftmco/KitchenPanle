<template>
  <v-col cols="12">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="note.title"
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
          v-model="note.importance"
          outlined
          clearable
          :items="importance"
          item-value="value"
          item-text="title"
          label="سطح اهمیت"
          placeholder="سطح اهمیت"
          type="number"
          class="rounded-lg"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="note.description"
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
        <v-btn
          :loading="inAction"
          block
          :color="updateNote? 'warning' : 'primary'"
          elevation="4"
          class="rounded-lg"
          @click="submitNote"
        >
          ثبت یادداشت
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { upsertNote } from "@/api/apis/note.api";
import { UpsertNote } from "@/api/models/note.model";
import { rules } from "@/constants";
import { importance } from "@/services/status.enum";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  props: ["updateNote"],
  data: () => ({
    rules: rules,
    importance: [
      {
        title: "بسیار",
        value: 0,
      },
      {
        title: "متوسط",
        value: 1,
      },
      {
        title: "کم",
        value: 2,
      },
    ],
    note: {} as UpsertNote,
    inAction: false,
  }),
  mounted() {
    this.setNote();
  },
  methods: {
    ...mapMutations(DIALOG, ["hideModal", "setDialogResult"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    setNote() {
      if (this.updateNote) {
        this.note = {
          id: this.updateNote.id,
          title: this.updateNote.title,
          description: this.updateNote.description,
          importance: this.updateNote.importance,
        };
      }
    },
    submitNote() {
      upsertNote(this.note)
        .then((upRes) => {
          if (upRes) {
            this.setDialogResult({
              status: true,
              data: upRes.result.note,
            });
            this.hideModal();
          }
          this.showSnackbar(upRes.title);
        })
        .finally(() => (this.inAction = false));
    },
  },
});
</script>