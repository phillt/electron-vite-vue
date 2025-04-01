<!-- Sidebar.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import NavItem from "../molecules/NavItem.vue";
import { useFontAwesome } from "../../composables/useFontAwesome";

const router = useRouter();
const route = useRoute();
const { FontAwesomeIcon } = useFontAwesome();

const navigation = [
  {
    name: "Budget",
    path: "/budget",
    icon: "receipt",
  },
  {
    name: "Income & Bills",
    path: "/income-expenses",
    icon: "money-bill-transfer",
  },
];
</script>

<template>
  <nav class="bg-white h-full w-48 p-4 border-r border-gray-300 flex flex-col">
    <div class="flex-grow">
      <NavItem
        v-for="item in navigation"
        :key="item.name"
        v-bind="item"
        :is-active="route.path === item.path"
        @click="router.push(item.path)"
      />
    </div>
    <button
      class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors"
      :class="[
        route.path === '/settings'
          ? 'bg-black text-white'
          : 'text-brand-muted hover:bg-brand-background hover:text-brand-text',
        'text-left',
      ]"
      @click="router.push('/settings')"
    >
      <FontAwesomeIcon icon="sliders" class="mr-2" />
      Settings
    </button>
    <button
      class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors text-brand-muted hover:bg-brand-background hover:text-brand-text text-left"
      @click="router.push('/')"
    >
      <FontAwesomeIcon icon="folder-plus" class="mr-2" />
      Open/Create
    </button>
  </nav>
</template>
