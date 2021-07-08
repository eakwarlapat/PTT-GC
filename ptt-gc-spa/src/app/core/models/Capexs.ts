
export interface Capexs {
    // StartingDate: Date,
    // ProjecctComRun: Date,
    // RequestIniNoDate: Date,
    // ProjectExePeriodYear: string,
    // ProjectExePeriodMonth: string,
    // CostCenterOfVP: string,
    // ProjectCost: number,
    // ReasonOfChanging: string,
    // BudgetForm: string,
    // BetweenYear: string,
    // TransferForm: string,
    // PoolBudgetForm: string,
    // SubmitTo: string
    betweenYear: string;
    budgetPeriod: string;
    capexInformationId: number;
    costCenterOfVP: string;
    codeCostCenterOfVP: string;
    initiativeId: number;
    poolBudgetForm: string;
    projecctComRun: Date;
    projectCost: number;
    projectExePeriodMonth: number;
    projectExePeriodYear: number;
    reasonOfChanging: string;
    requestIniNoDate: Date;
    startingDate: Date;
    submitTo: string;
    transferForm: string;
    additionalCost: string;
    actionYear: string;
    sequent: number;
    spendingActual: number;
    capexType: string;
    capexStatus: string;
    revistion: number;
    returnCost: number;

}
