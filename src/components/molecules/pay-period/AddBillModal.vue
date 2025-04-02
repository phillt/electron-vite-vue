<!-- AddBillModal.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import type { Bill } from "../../../services/budgetService";
import BaseModal from "../../atoms/BaseModal.vue";
import BillForm from "../../forms/BillForm.vue";

const props = defineProps<{
  modelValue: boolean;
  payPeriodIndex: number;
  existingBills?: Bill[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", bill: Bill): void;
}>();

const handleSubmit = (bill: Bill) => {
  emit("submit", bill);
  emit("update:modelValue", false);
};
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Add Bill"
  >
    <BillForm
      :existing-bills="existingBills"
      @submit="handleSubmit"
      @cancel="emit('update:modelValue', false)"
    />
  </BaseModal>
</template>
