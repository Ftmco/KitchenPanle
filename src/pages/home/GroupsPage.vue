<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="گروه ها"
        newTitle="گروه جدید"
        :hasNewAction="true"
        :newAction="newGroup"
        :reloadAction="loadGroups"
      >
        <template v-slot:search>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="جستجو"
            single-line
            hide-details
            @input="searchInput"
          ></v-text-field>
        </template>
      </table-header>
    </v-card>
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="isLoading"
        :headers="headers"
        :items="groups"        
        no-data-text="گروهی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-col>
              <v-btn block color="warning" text @click="editGroup(item)">
                ویرایش
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block color="error" text @click="removeGroup(item)">
                حذف
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          @input="pageChange"
        ></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { deleteGroup, getGroups } from "@/api/apis/group.api";
import TableHeader from "@/components/core/TableHeader.vue";
import {
  ConfirmDialog,
  defaultPage,
  Dialog,
  Pagination,
  TableHeaderModel,
} from "@/components/models";
import { pageListSize } from "@/constants";
import { searchList } from "@/services/search";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
export default Vue.extend({
  data: () => ({
    search: "",
    isLoading: true,
    headers: [
      {
        text: "نام",
        value: "name",
        align: "start",
        sortable: true,
      },
      {
        text: "تاریخ ایجاد",
        value: "createDate",
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
    groups: [] as Array<any>,
    pageCount: 1,
    page: 1,
  }),
  components: { TableHeader },
  computed: {
    ...mapState(DIALOG, {
      dialogResult: `dialogResult`,
      confirmDialogResult: `confirmDialogResult`,
    }),
  },
  watch: {
    dialogResult(result) {
      if (result != undefined && result.status) {
        this.findAndRemoveGroup(result.data.id);
        this.groups.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadGroups(defaultPage(this.search));
  },
  methods: {
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    pageChange(value: any) {
      this.loadGroups({ page: value - 1, count: pageListSize });
    },
    searchInput(value: string) {
     searchList(value,this.loadGroups);
    },
    loadGroups(pagination: Pagination) {
      this.isLoading = true;
      getGroups(pagination)
        .then((groupsRes) => {
          if (groupsRes.status) {
            this.page = pagination.page + 1;
            this.groups = groupsRes.result.groups;
            this.pageCount = groupsRes.result.pageCount + 1;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    newGroup() {
      const create: Dialog = {
        title: "گروه جدید",
        color: "primary",
        content: {
          component: () => import("@/components/group/Upsert.vue"),
          props: {},
        },
      };
      this.showModal(create);
    },
    editGroup(item: any) {
      const upadte: Dialog = {
        title: `ویرایش ${item.name}`,
        color: "warning",
        content: {
          component: () => import("@/components/group/Upsert.vue"),
          props: {
            updateGroup: item,
          },
        },
      };
      this.showModal(upadte);
    },
    removeGroup(item: any) {
      const confirm: ConfirmDialog = {
        data: item.id,
        text: `آیا از حذف ${item.name} مطمئن هستید؟`,
        title: "حذف گروه",
        agreeText: "بله",
        disagreeText: "لغو",
      };
      this.showConfirm(confirm);
    },
    deleteConfirm(id: string) {
      deleteGroup(id).then((deleteRes) => {
        if (deleteRes.status) this.findAndRemoveGroup(id);
        this.showSnackbar(deleteRes.title);
      });
    },
    findAndRemoveGroup(id: string) {
      let index = this.groups.findIndex((g) => g.id == id);
      if (index != -1) {
        this.groups.splice(index, 1);
      }
    },
  },
});
</script>