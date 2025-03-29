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
    };
  }
}

export interface Budget {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
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
    budget: Omit<Budget, "createdAt" | "updatedAt" | "filePath">
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
      };

      // Save the budget to file
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: result.filePath,
        content: JSON.stringify(newBudget, null, 2),
      });

      this.currentBudget = newBudget;
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
        this.currentBudget = budget;
        return budget;
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
