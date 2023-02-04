<template>
  <v-col cols="12">
    <v-card elevation="4" class="rounded-lg">
      <table-header
        title="گروه ها"
        newTitle="گروه جدید"
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
          ></v-text-field>
        </template>
      </table-header>
    </v-card>
    <br />
    <v-card elevation="4" class="rounded-lg">
      <v-data-table
        :loading="inLoading"
        :headers="headers"
        :items="groups"
        :search="search"
        no-data-text="گروهی یافت نشد"
        loading-text="کمی صبر کنید..."
        no-results-text="موردی یافت نشد"
        hide-default-footer
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="getBaseStatusObj(item.status).color">
            {{ getBaseStatusObj(item.status).title }}
          </v-chip>
        </template>
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
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { deleteGroup, getGroups } from "@/api/apis/group.apis";
import TableHeader from "@/components/core/TableHeader.vue";
import { ConfirmDialog, Dialog, TableHeaderModel } from "@/components/models";
import { getBaseStatusObj } from "@/services/status";
import { DIALOG, SNACKBAR } from "@/store/store_types";
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
export default Vue.extend({
  data: () => ({
    search: "",
    inLoading: true,
    headers: [
      {
        text: "نام",
        value: "name",
        align: "start",
        sortable: true,
      },
      {
        text: "وضیعت",
        value: "status",
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
        this.findAndRemoveGroup(result.data.id, true);
        this.groups.push(result.data);
      }
    },
    confirmDialogResult(result) {
      if (result.agree) this.deleteConfirm(result.data);
    },
  },
  mounted() {
    this.loadGroups();
  },
  methods: {
    ...mapMutations(SNACKBAR, ["showSnackbar"]),
    ...mapMutations(DIALOG, ["showModal", "showConfirm"]),
    loadGroups() {
      this.inLoading = true;
      getGroups(0, 10)
        .then((groupsRes) => {
          if (groupsRes.status) {
            this.groups = groupsRes.result.groups;
            this.pageCount = groupsRes.result.pageCount + 1;
          }
        })
        .finally(() => (this.inLoading = false));
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
        title: `ویرایش ${item.title}`,
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
        if (deleteRes.status) this.findAndRemoveGroup(id, false);
        this.showSnackbar(deleteRes.title);
      });
    },
    findAndRemoveGroup(id: string, remove: boolean) {
      let index = this.groups.findIndex((g) => g.id == id);
      if (index != -1) {
        let group = this.groups[index];
        this.groups.splice(index, 1);
        if (!remove) this.groups.push({ ...group, status: 2 });
      }
    },
    getBaseStatusObj,
  },
});
</script>