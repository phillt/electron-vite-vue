<!-- Welcome.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";
import { computed } from "vue";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());

const handleOpenBudget = async () => {
  const budget = await budgetService.openBudget();
  if (budget) {
    router.push("/budget");
  }
};
</script>

<template>
  <div class="min-h-full flex items-center justify-center bg-gray-200">
    <BaseCard class="max-w-md w-full bg-white/95">
      <template #header>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-brand-text mb-2">Astreos</h1>
          <p class="text-brand-muted">
            Welcome to Astreos! Get started by creating a new budget or opening
            an existing one.
          </p>
        </div>
      </template>

      <div class="space-y-4 mt-8">
        <BaseButton
          variant="primary"
          size="lg"
          class="w-full"
          @click="router.push('/create-budget')"
        >
          Create New Budget
        </BaseButton>

        <BaseButton
          variant="outline"
          size="lg"
          class="w-full"
          @click="handleOpenBudget"
        >
          Open Existing Budget
        </BaseButton>

        <template v-if="currentBudget">
          <hr class="border-brand-surface my-4" />
          <BaseButton
            variant="outline"
            size="lg"
            class="w-full"
            @click="router.push('/budget')"
          >
            Return to {{ currentBudget.name }}
          </BaseButton>
        </template>
      </div>
    </BaseCard>
  </div>
</template>
