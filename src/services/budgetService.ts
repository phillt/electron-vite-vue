declare global {
  interface Window {
    electron: {
      dialog: {
        showOpenDialog: (options: any) => Promise<any>;
        showSaveDialog: (options: any) => Promise<any>;
      };
    };
  }
}

export interface Budget {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class BudgetService {
  private static instance: BudgetService;
  private currentBudget: Budget | null = null;

  private constructor() {}

  static getInstance(): BudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  async createBudget(
    budget: Omit<Budget, "createdAt" | "updatedAt">
  ): Promise<Budget> {
    const newBudget: Budget = {
      ...budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Implement file saving logic
    this.currentBudget = newBudget;
    return newBudget;
  }

  async openBudget(): Promise<Budget | null> {
    try {
      const result = await window.electron.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Budget Files", extensions: ["json"] }],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        // TODO: Implement file loading logic
        return null;
      }
      return null;
    } catch (error) {
      console.error("Error opening budget:", error);
      return null;
    }
  }

  getCurrentBudget(): Budget | null {
    return this.currentBudget;
  }
}

export const budgetService = BudgetService.getInstance();
