export interface ImpactTracking {
    id: number;
    financialImpactArea: string;
    haveShareBenefit: boolean;
    iL4RunRateRecurring: number;
    iL5RunRateRecurring: number;
    iL4RunRateOnetime: number;
    iL5RunRateOnetime: number;
    iL5FixedFxRecurring: number;
    iL5FloatFxRecurring: number;
    iL5FixedFxOnetime: number;
    iL5FloatFxOnetime: number;
    firstRunRateMonth: Date;
    autoCalculate: number;
    indirectBenefit: string;
    explanation: string;
    impiemantCost: boolean;
    toComment: string;
    remark1: string;
    remark2: string;
    remark3: string;
    remark4: string;
    remark5: string;
    initiativeId: number;
    siL4Achievement: string;
    siL5Achievement: string;
}
