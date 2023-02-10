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
              <v-btn block color="warning" text @click="editNote(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeNote(item)">
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount" @input="pageChange" />
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { deleteNote, getNotes } from "@/api/apis/note.api";
import TableHeader from "@/components/core/TableHeader.vue";
import {
  ConfirmDialog,
  defaultPage,
  Dialog,
  Pagination,
  TableHeaderModel,
} from "@/components/models";
import { pageListSize } from "@/constants";
import { getNoteImportanceObj } from "@/services/status";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
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
    notes: [] as Array<any>,
    isLoading: true,
  }),
  computed: {
    ...mapState(DIALOG, {
      dialogResult: `dialogResult`,
      confirmDialogResult: `confirmDialogResult`,
    }),
  },
  watch: {
    dialogResult(result) {
      if (result != undefined && result.status) {
        this.findAndRemoveNote(result.data.id);
        this.notes.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadNotes(defaultPage);
  },
  methods: {
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    pageChange(value: any) {
      this.loadNotes({ page: value - 1, count: pageListSize });
    },
    loadNotes(pagination: Pagination) {
      this.isLoading = true;
      getNotes(pagination)
        .then((notesRes) => {
          if (notesRes.status) {
            this.page = pagination.page + 1;
            this.notes = notesRes.result.notes;
            this.pageCount = notesRes.result.pageCount + 1;
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
    editNote(item: any) {
      const update: Dialog = {
        color: "warning",
        title: `ویرایش ${item.title}`,
        content: {
          component: () => import("@/components/note/Upsert.vue"),
          props: { updateNote: item },
        },
      };
      this.showModal(update);
    },
    removeNote(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        text: `آیا از حذف ${item.title} مطمئن هستید؟`,
        title: "حذف یادداشت",
        agreeText: "بله",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(id: any) {
      deleteNote(id).then((deleteRes) => {
        if (deleteRes.status) {
          this.findAndRemoveNote(id);
        }
        this.showSnackbar(deleteRes.title);
      });
    },
    findAndRemoveNote(id: string) {
      let index = this.notes.findIndex((note) => note.id == id);
      if (index != -1) this.notes.splice(index, 1);
    },
    getNoteImportanceObj,
  },
});
</script>