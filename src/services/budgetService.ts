declare global {
  interface Window {
    electron: {
      dialog: {
        showOpenDialog: (options: any) => Promise<any>;
        showSaveDialog: (options: any) => Promise<any>;
      };
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
      settings: {
        get: () => Promise<{ lastBudgetPath: string | null }>;
        set: (settings: { lastBudgetPath: string | null }) => Promise<void>;
      };
      shell: {
        showItemInFolder: (filePath: string) => Promise<boolean>;
      };
    };
  }
}

export interface Item {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

export interface Income {
  name: string;
  amount: number;
  frequency: "bi-weekly";
  lastPayday: string; // ISO date string
  payPeriods: {
    start: string; // ISO date string
    end: string; // ISO date string
  }[];
}

export interface Bill {
  name: string;
  dueDay: number; // 1-31
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  isPaid: boolean;
}

export interface PayPeriodBill extends Bill {
  isPaid: boolean;
  dueDate: string; // ISO date string
}

export interface PayPeriod {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  bills: PayPeriodBill[];
  expenses: Expense[];
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalExpenses: number;
  paycheckAmount: number; // Store the paycheck amount at creation time
}

export interface Budget {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
  items: Item[];
  incomes: Income[];
  bills: Bill[];
  payPeriods: PayPeriod[];
  lastPayday?: string; // ISO date string
}

import { ref } from "vue";

class BudgetService {
  private static instance: BudgetService;
  private currentBudget = ref<Budget | null>(null);
  private isInitialized = false;

  private constructor() {}

  static getInstance(): BudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("Initializing budget service...");
      await this.loadLastBudget();
      this.isInitialized = true;
      console.log("Budget service initialized");
    } catch (error) {
      console.error("Error initializing budget service:", error);
    }
  }

  private async loadLastBudget(): Promise<void> {
    try {
      console.log("Loading last budget...");
      const settings = await window.electron.settings.get();
      console.log("Settings loaded:", settings);

      if (settings.lastBudgetPath) {
        console.log("Found last budget path:", settings.lastBudgetPath);
        // Try to load the last budget
        const content = await window.electron.ipcRenderer.invoke(
          "file:read",
          settings.lastBudgetPath
        );
        const budget = JSON.parse(content) as Budget;

        // Ensure all required arrays and properties exist
        if (!budget.incomes) {
          budget.incomes = [];
        }
        if (!budget.bills) {
          budget.bills = [];
        }
        if (!budget.payPeriods) {
          budget.payPeriods = [];
        }
        if (!budget.lastPayday) {
          budget.lastPayday = new Date().toISOString();
        }

        // Initialize expenses array and totalExpenses for each pay period
        budget.payPeriods.forEach((period) => {
          if (!period.expenses) {
            period.expenses = [];
          }
          if (typeof period.totalExpenses !== "number") {
            period.totalExpenses = period.expenses.reduce(
              (sum, expense) => sum + expense.amount,
              0
            );
          }
        });

        this.currentBudget.value = budget;
        console.log("Last budget loaded successfully");
      } else {
        console.log("No last budget path found in settings");
      }
    } catch (error) {
      console.error("Error loading last budget:", error);
    }
  }

  private async saveLastBudgetPath(filePath: string): Promise<void> {
    try {
      console.log("Saving last budget path:", filePath);
      await window.electron.settings.set({ lastBudgetPath: filePath });
      console.log("Last budget path saved successfully");
    } catch (error) {
      console.error("Error saving last budget path:", error);
      throw error;
    }
  }

  async createBudget(
    budget: Omit<
      Budget,
      | "createdAt"
      | "updatedAt"
      | "filePath"
      | "items"
      | "incomes"
      | "bills"
      | "payPeriods"
    >
  ): Promise<Budget> {
    try {
      const result = await window.electron.dialog.showSaveDialog({
        title: "Save Budget",
        defaultPath: `${budget.name}.bdgtmn`,
        filters: [
          { name: "Budget Manager Files", extensions: ["bdgtmn"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled || !result.filePath) {
        throw new Error("Save operation cancelled");
      }

      const newBudget: Budget = {
        ...budget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        filePath: result.filePath,
        items: [],
        incomes: [],
        bills: [],
        payPeriods: [],
        lastPayday: budget.lastPayday || new Date().toISOString(),
      };

      // Save the budget to file
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: result.filePath,
        content: JSON.stringify(newBudget, null, 2),
      });

      this.currentBudget.value = newBudget;
      // Save the path to settings
      await this.saveLastBudgetPath(result.filePath);
      return newBudget;
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error;
    }
  }

  async openBudget(): Promise<Budget | null> {
    try {
      const result = await window.electron.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          { name: "Budget Manager Files", extensions: ["bdgtmn"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = await window.electron.ipcRenderer.invoke(
          "file:read",
          filePath
        );
        const budget = JSON.parse(content) as Budget;

        // Ensure all required arrays and properties exist
        if (!budget.incomes) {
          budget.incomes = [];
        }
        if (!budget.bills) {
          budget.bills = [];
        }
        if (!budget.payPeriods) {
          budget.payPeriods = [];
        }
        if (!budget.lastPayday) {
          budget.lastPayday = new Date().toISOString();
        }

        // Initialize expenses array and totalExpenses for each pay period
        budget.payPeriods.forEach((period) => {
          if (!period.expenses) {
            period.expenses = [];
          }
          if (typeof period.totalExpenses !== "number") {
            period.totalExpenses = period.expenses.reduce(
              (sum, expense) => sum + expense.amount,
              0
            );
          }
        });

        budget.filePath = filePath;
        this.currentBudget.value = budget;

        // Save the path to settings
        await this.saveLastBudgetPath(filePath);
        return budget;
      }
      return null;
    } catch (error) {
      console.error("Error opening budget:", error);
      throw error;
    }
  }

  async addItem(item: Omit<Item, "id" | "date">): Promise<Item> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    this.currentBudget.value.items.push(newItem);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }

    return newItem;
  }

  async addIncome(income: Income): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure incomes array exists
    if (!this.currentBudget.value.incomes) {
      this.currentBudget.value.incomes = [];
    }

    this.currentBudget.value.incomes.push(income);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteIncome(name: string): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.value.incomes.splice(index, 1);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updateIncome(name: string, updatedIncome: Income): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.value.incomes[index] = updatedIncome;
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async addBill(bill: Bill): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure bills array exists
    if (!this.currentBudget.value.bills) {
      this.currentBudget.value.bills = [];
    }

    this.currentBudget.value.bills.push(bill);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteBill(name: string): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure bills array exists
    if (!this.currentBudget.value.bills) {
      this.currentBudget.value.bills = [];
    }

    const index = this.currentBudget.value.bills.findIndex(
      (bill) => bill.name === name
    );
    if (index === -1) {
      throw new Error("Bill not found");
    }

    // Remove the bill
    this.currentBudget.value.bills = this.currentBudget.value.bills.filter(
      (bill) => bill.name !== name
    );
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updateBill(name: string, updatedBill: Bill): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.bills.findIndex(
      (bill) => bill.name === name
    );
    if (index === -1) {
      throw new Error("Bill not found");
    }

    this.currentBudget.value.bills[index] = updatedBill;
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  getCurrentBudget(): Budget | null {
    return this.currentBudget.value;
  }

  refreshCurrentBudget(): void {
    if (this.currentBudget.value) {
      this.currentBudget.value = { ...this.currentBudget.value };
    }
  }

  getItems(type?: "income" | "expense"): Item[] {
    if (!this.currentBudget.value) return [];
    if (!type) return this.currentBudget.value.items;
    return this.currentBudget.value.items.filter((item) => item.type === type);
  }

  getTotalIncome(): number {
    if (!this.currentBudget.value) return 0;
    return this.currentBudget.value.incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
  }

  getTotalExpenses(): number {
    return this.getItems("expense").reduce((sum, item) => sum + item.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  private calculateNextPayday(lastPayday: string): Date {
    const date = new Date(lastPayday);
    date.setDate(date.getDate() + 14); // Always biweekly
    return date;
  }

  private getBillsForPayPeriod(
    startDate: Date,
    endDate: Date,
    bills: Bill[]
  ): PayPeriodBill[] {
    const payPeriodBills: PayPeriodBill[] = [];

    for (const bill of bills) {
      // Create a date object for this month with the bill's due day
      const billDate = new Date(startDate);
      billDate.setDate(bill.dueDay);

      // If the bill date is before the start date, try next month
      if (billDate < startDate) {
        billDate.setMonth(billDate.getMonth() + 1);
      }

      // If the bill falls within this pay period, add it
      if (billDate >= startDate && billDate <= endDate) {
        payPeriodBills.push({
          ...bill,
          isPaid: false,
          dueDate: billDate.toISOString(),
        });
      }
    }

    return payPeriodBills;
  }

  private calculatePaycheckAmount(): number {
    if (!this.currentBudget.value) return 0;
    return this.currentBudget.value.incomes.reduce(
      (total, income) => total + income.amount,
      0
    );
  }

  async createPayPeriod(): Promise<PayPeriod | null> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const budget = this.currentBudget.value;

    // Determine the start date (either today or the day after the last pay period)
    let startDate: Date;
    if (budget.payPeriods.length === 0) {
      if (!budget.lastPayday) {
        throw new Error("No last payday set");
      }
      startDate = new Date(budget.lastPayday);
      startDate.setDate(startDate.getDate() + 1); // Add one day to start date
    } else {
      const lastPayPeriod = budget.payPeriods[budget.payPeriods.length - 1];
      startDate = new Date(lastPayPeriod.endDate);
      startDate.setDate(startDate.getDate() + 1);
    }

    // Calculate the end date (always biweekly)
    const endDate = this.calculateNextPayday(startDate.toISOString());
    endDate.setDate(endDate.getDate() - 1); // Subtract one day from end date

    // Get bills for this period
    const bills = this.getBillsForPayPeriod(startDate, endDate, budget.bills);

    // Calculate totals
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

    const payPeriod: PayPeriod = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      bills,
      expenses: [],
      totalAmount,
      paidAmount: 0,
      unpaidAmount: totalAmount,
      totalExpenses: 0,
      paycheckAmount: this.calculatePaycheckAmount(),
    };

    budget.payPeriods.push(payPeriod);
    budget.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (budget.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: budget.filePath,
        content: JSON.stringify(budget, null, 2),
      });
    }

    return payPeriod;
  }

  async toggleBillPaid(
    payPeriodIndex: number,
    billName: string
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const bill = payPeriod.bills.find((b) => b.name === billName);
    if (!bill) {
      throw new Error("Bill not found");
    }

    // Toggle the paid status
    bill.isPaid = !bill.isPaid;

    // Recalculate paid and unpaid amounts
    payPeriod.paidAmount = payPeriod.bills.reduce(
      (sum, b) => sum + (b.isPaid ? b.amount : 0),
      0
    );
    payPeriod.unpaidAmount = payPeriod.totalAmount - payPeriod.paidAmount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  getCurrentPayPeriodIndex(): number {
    if (
      !this.currentBudget.value ||
      this.currentBudget.value.payPeriods.length === 0
    ) {
      return -1;
    }

    const now = new Date();
    return this.currentBudget.value.payPeriods.findIndex((period) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return now >= startDate && now <= endDate;
    });
  }

  async addExpense(
    payPeriodIndex: number,
    expense: Omit<Expense, "id" | "date">
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isPaid: false,
    };

    payPeriod.expenses.push(newExpense);
    payPeriod.totalExpenses += newExpense.amount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async toggleExpensePaid(
    payPeriodIndex: number,
    expenseId: string
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const expense = payPeriod.expenses.find((e) => e.id === expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // Toggle the paid status
    expense.isPaid = !expense.isPaid;

    // Update the paid and unpaid amounts to include expenses
    const paidBills = payPeriod.bills.reduce(
      (sum, bill) => sum + (bill.isPaid ? bill.amount : 0),
      0
    );
    const paidExpenses = payPeriod.expenses.reduce(
      (sum, exp) => sum + (exp.isPaid ? exp.amount : 0),
      0
    );
    payPeriod.paidAmount = paidBills + paidExpenses;

    const totalAmount = payPeriod.bills.reduce(
      (sum, bill) => sum + bill.amount,
      0
    );
    const totalExpenses = payPeriod.expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    payPeriod.totalAmount = totalAmount;
    payPeriod.totalExpenses = totalExpenses;
    payPeriod.unpaidAmount = totalAmount + totalExpenses - payPeriod.paidAmount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteExpense(
    payPeriodIndex: number,
    expenseId: string
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const expenseIndex = payPeriod.expenses.findIndex(
      (e) => e.id === expenseId
    );
    if (expenseIndex === -1) {
      throw new Error("Expense not found");
    }

    // Remove the expense
    payPeriod.expenses.splice(expenseIndex, 1);

    // Recalculate totals
    const totalExpenses = payPeriod.expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const paidBills = payPeriod.bills.reduce(
      (sum, b) => sum + (b.isPaid ? b.amount : 0),
      0
    );
    const paidExpenses = payPeriod.expenses.reduce(
      (sum, e) => sum + (e.isPaid ? e.amount : 0),
      0
    );

    payPeriod.totalExpenses = totalExpenses;
    payPeriod.paidAmount = paidBills + paidExpenses;
    payPeriod.unpaidAmount =
      payPeriod.totalAmount + totalExpenses - payPeriod.paidAmount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteLastPayPeriod(): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    if (this.currentBudget.value.payPeriods.length === 0) {
      throw new Error("No pay periods to delete");
    }

    // Get the current pay period index
    const currentIndex = this.getCurrentPayPeriodIndex();

    // Don't allow deleting if it's the current or past pay period
    if (currentIndex === this.currentBudget.value.payPeriods.length - 1) {
      throw new Error("Cannot delete the current pay period");
    }

    // Remove the last pay period
    this.currentBudget.value.payPeriods.pop();
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updatePayPeriodBillAmount(
    payPeriodIndex: number,
    billName: string,
    newAmount: number
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const bill = payPeriod.bills.find((b) => b.name === billName);
    if (!bill) {
      throw new Error("Bill not found");
    }

    // Update the bill amount
    bill.amount = newAmount;

    // Recalculate totals
    const totalAmount = payPeriod.bills.reduce((sum, b) => sum + b.amount, 0);
    const paidBills = payPeriod.bills.reduce(
      (sum, b) => sum + (b.isPaid ? b.amount : 0),
      0
    );
    const paidExpenses = payPeriod.expenses.reduce(
      (sum, e) => sum + (e.isPaid ? e.amount : 0),
      0
    );

    payPeriod.totalAmount = totalAmount;
    payPeriod.paidAmount = paidBills + paidExpenses;
    payPeriod.unpaidAmount =
      totalAmount + payPeriod.totalExpenses - payPeriod.paidAmount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updatePayPeriodExpenseAmount(
    payPeriodIndex: number,
    expenseId: string,
    newAmount: number
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    const expense = payPeriod.expenses.find((e) => e.id === expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // Update the expense amount
    expense.amount = newAmount;

    // Recalculate totals
    const totalExpenses = payPeriod.expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const paidBills = payPeriod.bills.reduce(
      (sum, b) => sum + (b.isPaid ? b.amount : 0),
      0
    );
    const paidExpenses = payPeriod.expenses.reduce(
      (sum, e) => sum + (e.isPaid ? e.amount : 0),
      0
    );

    payPeriod.totalExpenses = totalExpenses;
    payPeriod.paidAmount = paidBills + paidExpenses;
    payPeriod.unpaidAmount =
      payPeriod.totalAmount + totalExpenses - payPeriod.paidAmount;

    this.currentBudget.value.updatedAt = new Date().toISOString();

    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updatePayPeriodPaycheckAmount(
    payPeriodIndex: number,
    newAmount: number
  ): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const payPeriod = this.currentBudget.value.payPeriods[payPeriodIndex];
    if (!payPeriod) {
      throw new Error("Pay period not found");
    }

    // Update the paycheck amount
    payPeriod.paycheckAmount = newAmount;
    this.currentBudget.value.updatedAt = new Date().toISOString();

    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }
}

export const budgetService = BudgetService.getInstance();
