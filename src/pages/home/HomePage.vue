<template>
  <div>
    <weekly-plan />
    <inventory-alert v-if="showAlertLimitiation" @alertCount="alertCount" />
  </div>
</template>

<script lang="ts">
import AppSparkline from "@/components/core/AppSparkline.vue";
import InventoryAlert from "@/components/home/inventoryAlert.vue";
import WeeklyPlan from "@/components/home/weeklyPlan.vue";
import router from "@/router";
import Vue from "vue";
export default Vue.extend({
  components: { AppSparkline, WeeklyPlan, InventoryAlert },

  data: () => ({
    showAlertLimitiation: true,
  }),
  methods: {
    alertCount(count: any) {
      this.showAlertLimitiation = count.alertCount >= 1;
    },
  },
});
</script>