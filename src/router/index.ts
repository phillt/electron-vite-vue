import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: () => import("../views/WelcomeScreen.vue"),
    },
    {
      path: "/create-budget",
      name: "create-budget",
      component: () => import("../views/CreateBudget.vue"),
    },
    {
      path: "/income-expenses",
      name: "income-expenses",
      component: () => import("../views/IncomeExpenses.vue"),
    },
  ],
});

export default router;
