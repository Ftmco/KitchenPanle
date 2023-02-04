<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="یادداشت ها"
        newTitle="یادداشت جدید"
        :newAction="addNote"
        :reloadAction="loadNotes"
      >
        <template v-slot:search>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="جستجو"
            single-line
            hide-details
          ></v-text-field>
        </template>
      </table-header>
    </v-card>
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="notes"
        :search="search"
        no-data-text="یادداشتی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.importance="{ item }">
          <v-chip :color="getNoteImportanceObj(item.importance).color">
            {{ getNoteImportanceObj(item.importance).title }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="warning" text>
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text>
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { getNotes } from "@/api/apis/note.api";
import TableHeader from "@/components/core/TableHeader.vue";
import { Dialog, TableHeaderModel } from "@/components/models";
import { getNoteImportanceObj } from "@/services/status";
import { DIALOG } from "@/store/store_types";
import Vue from "vue";
import { mapMutations } from "vuex";
export default Vue.extend({
  components: { TableHeader },
  data: () => ({
    search: "",
    page: 1,
    pageCount: 1,
    headers: [
      {
        text: "عنوان",
        value: "title",
        align: "start",
        sortable: true,
      },
      {
        text: "اهمیت",
        value: "importance",
        align: "center",
        sortable: true,
      },
      {
        text: "تاریخ ایجاد",
        value: "createDate",
        align: "start",
        sortable: true,
      },
      {
        text: "متن",
        value: "description",
        align: "start",
        sortable: true,
      },
      {
        text: "",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ] as Array<TableHeaderModel>,
    notes: [],
    isLoading: true,
  }),
  mounted() {
    this.loadNotes();
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal"]),
    loadNotes() {
      getNotes(0, 0)
        .then((notesRes) => {
          if (notesRes.status) {
            this.notes = notesRes.result.notes;
            this.pageCount = notesRes.result.pageCount;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    addNote() {
      const create: Dialog = {
        color: "primary",
        title: "ایجاد یادداشت جدید",
        content: {
          component: () => import("@/components/note/Upsert.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    getNoteImportanceObj,
  },
});
</script>