import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Budget from "../Budget.vue";
import { budgetService } from "../../services/budgetService";
import { createRouter, createWebHistory } from "vue-router";

// Mock the budgetService
vi.mock("../../services/budgetService", () => ({
  budgetService: {
    getCurrentBudget: vi.fn(),
    getCurrentPayPeriodIndex: vi.fn(),
    toggleBillPaid: vi.fn(),
    createPayPeriod: vi.fn(),
  },
}));

// Create a mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Budget,
    },
    {
      path: "/add-expense",
      name: "add-expense",
      component: { template: "<div>Add Expense</div>" },
    },
  ],
});

describe("Budget.vue", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Navigate to root to avoid router warnings
    router.push("/");
  });

  it("displays the correct paycheck amount of $3,500 for a biweekly pay period", async () => {
    // Mock the current budget data
    const mockBudget = {
      name: "Test Budget",
      payFrequency: "biweekly",
      incomes: [
        {
          name: "Main Job",
          amount: 3500,
          frequency: "biweekly",
          originalAmount: 3500,
          nextPayday: "2025-03-29",
        },
      ],
      payPeriods: [
        {
          startDate: "2025-03-29",
          endDate: "2025-04-12",
          bills: [],
          expenses: [],
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
          totalExpenses: 0,
        },
      ],
    };

    // Setup the mock return values
    vi.mocked(budgetService.getCurrentBudget).mockReturnValue(mockBudget);
    vi.mocked(budgetService.getCurrentPayPeriodIndex).mockReturnValue(0);

    // Mount the component with router
    const wrapper = mount(Budget, {
      global: {
        plugins: [router],
      },
    });

    // Wait for the component to update
    await wrapper.vm.$nextTick();
    await router.isReady();

    // Find the Expected Income section
    const incomeSection = wrapper.find(".bg-blue-50");
    expect(incomeSection.exists()).toBe(true);

    // Find all spans in the income section
    const spans = incomeSection.findAll("span");

    // Find the paycheck amount (it comes after the "Paycheck:" label)
    const paycheckLabel = spans.find((span) => span.text() === "Paycheck:");
    expect(paycheckLabel).toBeTruthy();

    const paycheckAmount =
      spans[spans.findIndex((span) => span.text() === "Paycheck:") + 1];
    expect(paycheckAmount.text().trim()).toBe("$3,500.00");

    // Find the remaining amount
    const remainingLabel = spans.find((span) => span.text() === "Remaining:");
    expect(remainingLabel).toBeTruthy();

    const remainingAmount =
      spans[spans.findIndex((span) => span.text() === "Remaining:") + 1];
    expect(remainingAmount.text().trim()).toBe("$3,500.00");
  });

  it("calculates remaining money correctly when there are bills and expenses", async () => {
    // Mock the current budget data with bills and expenses
    const mockBudget = {
      name: "Test Budget",
      payFrequency: "biweekly",
      incomes: [
        {
          name: "Main Job",
          amount: 3500,
          frequency: "biweekly",
          originalAmount: 3500,
          nextPayday: "2025-03-29",
        },
      ],
      payPeriods: [
        {
          startDate: "2025-03-29",
          endDate: "2025-04-12",
          bills: [
            {
              name: "Rent",
              amount: 1000,
              dueDate: "2025-04-01",
              isPaid: false,
            },
          ],
          expenses: [
            {
              id: "1",
              name: "Groceries",
              amount: 200,
              date: "2025-03-30",
            },
          ],
          totalAmount: 1000, // Total bills
          paidAmount: 0,
          unpaidAmount: 1000,
          totalExpenses: 200, // Total expenses
        },
      ],
    };

    // Setup the mock return values
    vi.mocked(budgetService.getCurrentBudget).mockReturnValue(mockBudget);
    vi.mocked(budgetService.getCurrentPayPeriodIndex).mockReturnValue(0);

    // Mount the component with router
    const wrapper = mount(Budget, {
      global: {
        plugins: [router],
      },
    });

    // Wait for the component to update
    await wrapper.vm.$nextTick();
    await router.isReady();

    // Find the Expected Income section
    const incomeSection = wrapper.find(".bg-blue-50");
    expect(incomeSection.exists()).toBe(true);

    // Find all spans in the income section
    const spans = incomeSection.findAll("span");

    // Find the paycheck amount
    const paycheckLabel = spans.find((span) => span.text() === "Paycheck:");
    expect(paycheckLabel).toBeTruthy();

    const paycheckAmount =
      spans[spans.findIndex((span) => span.text() === "Paycheck:") + 1];
    expect(paycheckAmount.text().trim()).toBe("$3,500.00");

    // Find the total outgoing amount
    const outgoingLabel = spans.find(
      (span) => span.text() === "Total Outgoing:"
    );
    expect(outgoingLabel).toBeTruthy();

    const outgoingAmount =
      spans[spans.findIndex((span) => span.text() === "Total Outgoing:") + 1];
    expect(outgoingAmount.text().trim()).toBe("$1,200.00"); // $1000 bills + $200 expenses

    // Find the remaining amount
    const remainingLabel = spans.find((span) => span.text() === "Remaining:");
    expect(remainingLabel).toBeTruthy();

    const remainingAmount =
      spans[spans.findIndex((span) => span.text() === "Remaining:") + 1];
    expect(remainingAmount.text().trim()).toBe("$2,300.00"); // $3500 - $1200
  });
});
