import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Capexs } from '@models/Capexs';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CapexService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ================================= 2020-05-02 =============================

  CreateCapexsInfo(
    StartingDate?: string,
    ProjecctComRun?: string,
    ActionYear?: string,
    ProjectExePeriodYear?: string,
    ProjectExePeriodMonth?: string,
    CostCenterOfVP?: string,
    CodeCostCenterOfVP?: string,
    ProjectCost?: string,
    ReasonOfChanging?: string,
    BudgetPeriod?: string,
    BetweenYear?: string,
    TransferForm?: string,
    PoolBudgetForm?: string,
    SubmitTo?: string,
    Revistion?: string,
    CapexType?: string,
    BudgetYear?: string,
    CapexStatus?: string,
    IsMaxApprovedRev?: string,
    Sequent?: string,
    ExistingBudget?: string,
    SpendingActual?: string,
    AdditionalCost?: string,
    ReturnCost?: string,
    id?: string
  ): Observable<Capexs> {

    const body = {
      StartingDate: this.convertDate(StartingDate),
      ProjecctComRun: this.convertDate(ProjecctComRun),
      ActionYear: this.convertDate(ActionYear),
      ProjectExePeriodYear,
      ProjectExePeriodMonth,
      CostCenterOfVP,
      CodeCostCenterOfVP,
      ProjectCost,
      ReasonOfChanging,
      BudgetPeriod,
      BetweenYear,
      TransferForm,
      PoolBudgetForm,
      SubmitTo,
      Revistion,
      CapexType,
      BudgetYear,
      CapexStatus,
      IsMaxApprovedRev,
      Sequent,
      ExistingBudget,
      SpendingActual,
      AdditionalCost,
      ReturnCost

    };

    return this.http.post<Capexs>(this.baseUrl + 'CapexsInformations/' + id, body);
  }

  CreateAnnualInvestmentPlan(id?: string, Annual?, CapexInformationId?, type?) {

    // let data = [];

    const control = Annual.get('annualForm_list') as FormArray;

    const xx = +control.length;
    const x = [];

    let totalYear1 = 0;
    let totalYear2 = 0;
    let totalYear3 = 0;
    let totalYear4 = 0;
    let totalYear5 = 0;
    let totalYear6 = 0;
    let totalYear7 = 0;
    let totalYear8 = 0;
    let totalYear9 = 0;
    let totalYear10 = 0;
    let totalYearOverall = 0;

    for (let i = 0; i < xx; i++) {

      if (control.at(i).get('fx').value == null) {
        totalYear1 = totalYear1 + +control.at(i).get('y1').value;
        totalYear2 = totalYear2 + +control.at(i).get('y2').value;
        totalYear3 = totalYear3 + +control.at(i).get('y3').value;
        totalYear4 = totalYear4 + +control.at(i).get('y4').value;
        totalYear5 = totalYear5 + +control.at(i).get('y5').value;
        totalYear6 = totalYear6 + +control.at(i).get('y6').value;
        totalYear7 = totalYear7 + +control.at(i).get('y7').value;
        totalYear8 = totalYear8 + +control.at(i).get('y8').value;
        totalYear9 = totalYear9 + +control.at(i).get('y9').value;
        totalYear10 = totalYear10 + +control.at(i).get('y10').value;


      }
      else {
        totalYear1 = totalYear1 + (+control.at(i).get('y1').value * +control.at(i).get('fx').value);
        totalYear2 = totalYear2 + (+control.at(i).get('y2').value * +control.at(i).get('fx').value);
        totalYear3 = totalYear3 + (+control.at(i).get('y3').value * +control.at(i).get('fx').value);
        totalYear4 = totalYear4 + (+control.at(i).get('y4').value * +control.at(i).get('fx').value);
        totalYear5 = totalYear5 + (+control.at(i).get('y5').value * +control.at(i).get('fx').value);
        totalYear6 = totalYear6 + (+control.at(i).get('y6').value * +control.at(i).get('fx').value);
        totalYear7 = totalYear7 + (+control.at(i).get('y7').value * +control.at(i).get('fx').value);
        totalYear8 = totalYear8 + (+control.at(i).get('y8').value * +control.at(i).get('fx').value);
        totalYear9 = totalYear9 + (+control.at(i).get('y9').value * +control.at(i).get('fx').value);
        totalYear10 = totalYear10 + (+control.at(i).get('y10').value * +control.at(i).get('fx').value);
        // totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
        //   totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10

      }

      const body = {

        CapexInformationId: CapexInformationId,
        InitiativeId: id,
        Currency: control.at(i).get('currencyTitle').value,
        CurrencyFx: control.at(i).get('fx').value,
        Year1: control.at(i).get('y1').value,
        Year2: control.at(i).get('y2').value,
        Year3: control.at(i).get('y3').value,
        Year4: control.at(i).get('y4').value,
        Year5: control.at(i).get('y5').value,
        Year6: control.at(i).get('y6').value,
        Year7: control.at(i).get('y7').value,
        Year8: control.at(i).get('y8').value,
        Year9: control.at(i).get('y9').value,
        Year10: control.at(i).get('y10').value,
        YearOverall: control.at(i).get('overall').value,
        PlanType: "AdditionCost",
        ActualSpendingThisYear: "0",
        FutureSpendingThisYear: "0",
        CarryBudget: "0"
      };

      x.push(body);

    }

    totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
      totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10


    const body = {

      CapexInformationId: CapexInformationId,
      InitiativeId: id,
      Currency: "",
      CurrencyFx: "",
      Year1: totalYear1,
      Year2: totalYear2,
      Year3: totalYear3,
      Year4: totalYear4,
      Year5: totalYear5,
      Year6: totalYear6,
      Year7: totalYear7,
      Year8: totalYear8,
      Year9: totalYear9,
      Year10: totalYear10,
      YearOverall: totalYearOverall,
      PlanType: "TotalBahtbyRevision",
      ActualSpendingThisYear: "0",
      FutureSpendingThisYear: "0",
      CarryBudget: "0"
    };

    x.push(body);


    if (type == "submit") {
      const body = {

        CapexInformationId: CapexInformationId,
        InitiativeId: id,
        Currency: "",
        CurrencyFx: "",
        Year1: totalYear1,
        Year2: totalYear2,
        Year3: totalYear3,
        Year4: totalYear4,
        Year5: totalYear5,
        Year6: totalYear6,
        Year7: totalYear7,
        Year8: totalYear8,
        Year9: totalYear9,
        Year10: totalYear10,
        YearOverall: totalYearOverall,
        PlanType: "SumTotalBaht",
        ActualSpendingThisYear: "0",
        FutureSpendingThisYear: "0",
        CarryBudget: "0"
      };

      x.push(body);
    }


    const data = {
      AnnualInvestmentPlanTableDtos: x
    };

    console.log(data);
    return this.http.post(this.baseUrl + 'CapexsInformations/CreateAnnualInvestmentPlan/' +
      id + '/' + CapexInformationId, data);
  }

  CreateAnnualInvestmentPlan_addMore(id: string, Annual, CapexInformationId, type) {

    // let data = [];

    const control = Annual.get('annualForm_list') as FormArray;

    const xx = +control.length;
    const x = [];

    let totalYear1 = 0;
    let totalYear2 = 0;
    let totalYear3 = 0;
    let totalYear4 = 0;
    let totalYear5 = 0;
    let totalYear6 = 0;
    let totalYear7 = 0;
    let totalYear8 = 0;
    let totalYear9 = 0;
    let totalYear10 = 0;
    let totalYearOverall = 0;

    for (let i = 0; i < xx; i++) {

      if (control.at(i).get('fx').value == null) {
        totalYear1 = totalYear1 + +control.at(i).get('y1').value;
        totalYear2 = totalYear2 + +control.at(i).get('y2').value;
        totalYear3 = totalYear3 + +control.at(i).get('y3').value;
        totalYear4 = totalYear4 + +control.at(i).get('y4').value;
        totalYear5 = totalYear5 + +control.at(i).get('y5').value;
        totalYear6 = totalYear6 + +control.at(i).get('y6').value;
        totalYear7 = totalYear7 + +control.at(i).get('y7').value;
        totalYear8 = totalYear8 + +control.at(i).get('y8').value;
        totalYear9 = totalYear9 + +control.at(i).get('y9').value;
        totalYear10 = totalYear10 + +control.at(i).get('y10').value;


      }
      else {
        totalYear1 = totalYear1 + (+control.at(i).get('y1').value * +control.at(i).get('fx').value);
        totalYear2 = totalYear2 + (+control.at(i).get('y2').value * +control.at(i).get('fx').value);
        totalYear3 = totalYear3 + (+control.at(i).get('y3').value * +control.at(i).get('fx').value);
        totalYear4 = totalYear4 + (+control.at(i).get('y4').value * +control.at(i).get('fx').value);
        totalYear5 = totalYear5 + (+control.at(i).get('y5').value * +control.at(i).get('fx').value);
        totalYear6 = totalYear6 + (+control.at(i).get('y6').value * +control.at(i).get('fx').value);
        totalYear7 = totalYear7 + (+control.at(i).get('y7').value * +control.at(i).get('fx').value);
        totalYear8 = totalYear8 + (+control.at(i).get('y8').value * +control.at(i).get('fx').value);
        totalYear9 = totalYear9 + (+control.at(i).get('y9').value * +control.at(i).get('fx').value);
        totalYear10 = totalYear10 + (+control.at(i).get('y10').value * +control.at(i).get('fx').value);
        // totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
        //   totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10

      }

      if (i == 0) {
        const body = {

          CapexInformationId: CapexInformationId,
          InitiativeId: id,
          Currency: control.at(i).get('currencyTitle').value,
          CurrencyFx: control.at(i).get('fx').value,
          Year1: control.at(i).get('y1').value,
          Year2: control.at(i).get('y2').value,
          Year3: control.at(i).get('y3').value,
          Year4: control.at(i).get('y4').value,
          Year5: control.at(i).get('y5').value,
          Year6: control.at(i).get('y6').value,
          Year7: control.at(i).get('y7').value,
          Year8: control.at(i).get('y8').value,
          Year9: control.at(i).get('y9').value,
          Year10: control.at(i).get('y10').value,
          YearOverall: control.at(i).get('overall').value,
          PlanType: "BudgetAvailable",
          ActualSpendingThisYear: "0",
          FutureSpendingThisYear: "0",
          CarryBudget: "0"

        };

        x.push(body);

      }
      else {
        const body = {

          CapexInformationId: CapexInformationId,
          InitiativeId: id,
          Currency: control.at(i).get('currencyTitle').value,
          CurrencyFx: control.at(i).get('fx').value,
          Year1: control.at(i).get('y1').value,
          Year2: control.at(i).get('y2').value,
          Year3: control.at(i).get('y3').value,
          Year4: control.at(i).get('y4').value,
          Year5: control.at(i).get('y5').value,
          Year6: control.at(i).get('y6').value,
          Year7: control.at(i).get('y7').value,
          Year8: control.at(i).get('y8').value,
          Year9: control.at(i).get('y9').value,
          Year10: control.at(i).get('y10').value,
          YearOverall: control.at(i).get('overall').value,
          PlanType: "AdditionCost",
          ActualSpendingThisYear: "0",
          FutureSpendingThisYear: "0",
          CarryBudget: "0"
        };

        x.push(body);
      }



    }

    totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
      totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10


    const body = {

      CapexInformationId: CapexInformationId,
      InitiativeId: id,
      Currency: "",
      CurrencyFx: "",
      Year1: totalYear1,
      Year2: totalYear2,
      Year3: totalYear3,
      Year4: totalYear4,
      Year5: totalYear5,
      Year6: totalYear6,
      Year7: totalYear7,
      Year8: totalYear8,
      Year9: totalYear9,
      Year10: totalYear10,
      YearOverall: totalYearOverall,
      PlanType: "TotalBahtbyRevision",
      ActualSpendingThisYear: "0",
      FutureSpendingThisYear: "0",
      CarryBudget: "0"
    };

    x.push(body);


    if (type == "submit") {
      const body = {

        CapexInformationId: CapexInformationId,
        InitiativeId: id,
        Currency: "",
        CurrencyFx: "",
        Year1: totalYear1,
        Year2: totalYear2,
        Year3: totalYear3,
        Year4: totalYear4,
        Year5: totalYear5,
        Year6: totalYear6,
        Year7: totalYear7,
        Year8: totalYear8,
        Year9: totalYear9,
        Year10: totalYear10,
        YearOverall: totalYearOverall,
        PlanType: "SumTotalBaht",
        ActualSpendingThisYear: "0",
        FutureSpendingThisYear: "0",
        CarryBudget: "0"
      };

      x.push(body);
    }


    const data = {
      AnnualInvestmentPlanTableDtos: x
    };

    console.log(data);
    return this.http.post(this.baseUrl + 'CapexsInformations/CreateAnnualInvestmentPlan/' +
      id + '/' + CapexInformationId, data);
  }


  CreateAnnualInvestmentPlan_return(id: string, Annual, CapexInformationId, type) {

    // let data = [];

    const control = Annual.get('annualForm_list') as FormArray;

    const xx = +control.length;
    const x = [];

    let totalYear1 = 0;
    let totalYear2 = 0;
    let totalYear3 = 0;
    let totalYear4 = 0;
    let totalYear5 = 0;
    let totalYear6 = 0;
    let totalYear7 = 0;
    let totalYear8 = 0;
    let totalYear9 = 0;
    let totalYear10 = 0;
    let totalYearOverall = 0;

    for (let i = 0; i < xx; i++) {

      if (control.at(i).get('fx').value == null) {
        totalYear1 = totalYear1 + +control.at(i).get('y1').value;
        totalYear2 = totalYear2 + +control.at(i).get('y2').value;
        totalYear3 = totalYear3 + +control.at(i).get('y3').value;
        totalYear4 = totalYear4 + +control.at(i).get('y4').value;
        totalYear5 = totalYear5 + +control.at(i).get('y5').value;
        totalYear6 = totalYear6 + +control.at(i).get('y6').value;
        totalYear7 = totalYear7 + +control.at(i).get('y7').value;
        totalYear8 = totalYear8 + +control.at(i).get('y8').value;
        totalYear9 = totalYear9 + +control.at(i).get('y9').value;
        totalYear10 = totalYear10 + +control.at(i).get('y10').value;


      }
      else {
        totalYear1 = totalYear1 + (+control.at(i).get('y1').value * +control.at(i).get('fx').value);
        totalYear2 = totalYear2 + (+control.at(i).get('y2').value * +control.at(i).get('fx').value);
        totalYear3 = totalYear3 + (+control.at(i).get('y3').value * +control.at(i).get('fx').value);
        totalYear4 = totalYear4 + (+control.at(i).get('y4').value * +control.at(i).get('fx').value);
        totalYear5 = totalYear5 + (+control.at(i).get('y5').value * +control.at(i).get('fx').value);
        totalYear6 = totalYear6 + (+control.at(i).get('y6').value * +control.at(i).get('fx').value);
        totalYear7 = totalYear7 + (+control.at(i).get('y7').value * +control.at(i).get('fx').value);
        totalYear8 = totalYear8 + (+control.at(i).get('y8').value * +control.at(i).get('fx').value);
        totalYear9 = totalYear9 + (+control.at(i).get('y9').value * +control.at(i).get('fx').value);
        totalYear10 = totalYear10 + (+control.at(i).get('y10').value * +control.at(i).get('fx').value);
        // totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
        //   totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10

      }

      if (i == 0) {
        const body = {

          CapexInformationId: CapexInformationId,
          InitiativeId: id,
          Currency: control.at(i).get('currencyTitle').value,
          CurrencyFx: control.at(i).get('fx').value,
          Year1: control.at(i).get('y1').value,
          Year2: control.at(i).get('y2').value,
          Year3: control.at(i).get('y3').value,
          Year4: control.at(i).get('y4').value,
          Year5: control.at(i).get('y5').value,
          Year6: control.at(i).get('y6').value,
          Year7: control.at(i).get('y7').value,
          Year8: control.at(i).get('y8').value,
          Year9: control.at(i).get('y9').value,
          Year10: control.at(i).get('y10').value,
          YearOverall: control.at(i).get('overall').value,
          PlanType: "BudgetAvailable",
          ActualSpendingThisYear: "0",
          FutureSpendingThisYear: "0",
          CarryBudget: "0"

        };

        x.push(body);

      }
      else {
        const body = {

          CapexInformationId: CapexInformationId,
          InitiativeId: id,
          Currency: control.at(i).get('currencyTitle').value,
          CurrencyFx: control.at(i).get('fx').value,
          Year1: control.at(i).get('y1').value,
          Year2: control.at(i).get('y2').value,
          Year3: control.at(i).get('y3').value,
          Year4: control.at(i).get('y4').value,
          Year5: control.at(i).get('y5').value,
          Year6: control.at(i).get('y6').value,
          Year7: control.at(i).get('y7').value,
          Year8: control.at(i).get('y8').value,
          Year9: control.at(i).get('y9').value,
          Year10: control.at(i).get('y10').value,
          YearOverall: control.at(i).get('overall').value,
          PlanType: "TotalBahtbyRevision",
          ActualSpendingThisYear: "0",
          FutureSpendingThisYear: "0",
          CarryBudget: "0"
        };

        x.push(body);
      }



    }

    totalYearOverall = totalYearOverall + totalYear1 + totalYear2 + totalYear3 + totalYear4 + totalYear5 +
      totalYear6 + totalYear7 + totalYear8 + totalYear9 + totalYear10


    const body = {

      CapexInformationId: CapexInformationId,
      InitiativeId: id,
      Currency: "",
      CurrencyFx: "",
      Year1: totalYear1,
      Year2: totalYear2,
      Year3: totalYear3,
      Year4: totalYear4,
      Year5: totalYear5,
      Year6: totalYear6,
      Year7: totalYear7,
      Year8: totalYear8,
      Year9: totalYear9,
      Year10: totalYear10,
      YearOverall: totalYearOverall,
      PlanType: "TotalBahtbyRevision",
      ActualSpendingThisYear: "0",
      FutureSpendingThisYear: "0",
      CarryBudget: "0"
    };

    x.push(body);


    if (type == "submit") {
      const body = {

        CapexInformationId: CapexInformationId,
        InitiativeId: id,
        Currency: "",
        CurrencyFx: "",
        Year1: totalYear1,
        Year2: totalYear2,
        Year3: totalYear3,
        Year4: totalYear4,
        Year5: totalYear5,
        Year6: totalYear6,
        Year7: totalYear7,
        Year8: totalYear8,
        Year9: totalYear9,
        Year10: totalYear10,
        YearOverall: totalYearOverall,
        PlanType: "SumTotalBaht",
        ActualSpendingThisYear: "0",
        FutureSpendingThisYear: "0",
        CarryBudget: "0"
      };

      x.push(body);
    }


    const data = {
      AnnualInvestmentPlanTableDtos: x
    };

    console.log(data);
    return this.http.post(this.baseUrl + 'CapexsInformations/CreateAnnualInvestmentPlan/' +
      id + '/' + CapexInformationId, data);
  }

  CreateMonthlyInvestmentPlan(year?, form1?, form2?, form3?, form4?, form5?, form6?, form7?, form8?, form9?, form10?,
    id?, AnnualInvestmentPlanId?, CapexInformationId?) {

    const f1 = form1.get('monthForm_list') as FormArray;
    const f2 = form2.get('monthForm_list') as FormArray;
    const f3 = form3.get('monthForm_list') as FormArray;
    const f4 = form4.get('monthForm_list') as FormArray;
    const f5 = form5.get('monthForm_list') as FormArray;
    const f6 = form6.get('monthForm_list') as FormArray;
    const f7 = form7.get('monthForm_list') as FormArray;
    const f8 = form8.get('monthForm_list') as FormArray;
    const f9 = form9.get('monthForm_list') as FormArray;
    const f10 = form10.get('monthForm_list') as FormArray;
    // console.log(f1);

    const x = [];

    for (let i = 0; i < year.length; i++) {
      if (i === 0) {
        const xx = +f1.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f1.at(j).get('currencyTitle').value,
            InvestmentCostFx: f1.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f1.at(j).get('m1').value,
            Feb: f1.at(j).get('m2').value,
            Mar: f1.at(j).get('m3').value,
            Apr: f1.at(j).get('m4').value,
            May: f1.at(j).get('m5').value,
            Jun: f1.at(j).get('m6').value,
            Jul: f1.at(j).get('m7').value,
            Aug: f1.at(j).get('m8').value,
            Sep: f1.at(j).get('m9').value,
            Oct: f1.at(j).get('m10').value,
            Nov: f1.at(j).get('m11').value,
            Dec: f1.at(j).get('m12').value,
            MonthlyOverall: f1.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId
          };
          x.push(body);
        }
      } else if (i === 1) {
        const xx = +f2.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f2.at(j).get('currencyTitle').value,
            InvestmentCostFx: f2.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f2.at(j).get('m1').value,
            Feb: f2.at(j).get('m2').value,
            Mar: f2.at(j).get('m3').value,
            Apr: f2.at(j).get('m4').value,
            May: f2.at(j).get('m5').value,
            Jun: f2.at(j).get('m6').value,
            Jul: f2.at(j).get('m7').value,
            Aug: f2.at(j).get('m8').value,
            Sep: f2.at(j).get('m9').value,
            Oct: f2.at(j).get('m10').value,
            Nov: f2.at(j).get('m11').value,
            Dec: f2.at(j).get('m12').value,
            MonthlyOverall: f2.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 2) {
        const xx = +f3.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f3.at(j).get('currencyTitle').value,
            InvestmentCostFx: f3.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f3.at(j).get('m1').value,
            Feb: f3.at(j).get('m2').value,
            Mar: f3.at(j).get('m3').value,
            Apr: f3.at(j).get('m4').value,
            May: f3.at(j).get('m5').value,
            Jun: f3.at(j).get('m6').value,
            Jul: f3.at(j).get('m7').value,
            Aug: f3.at(j).get('m8').value,
            Sep: f3.at(j).get('m9').value,
            Oct: f3.at(j).get('m10').value,
            Nov: f3.at(j).get('m11').value,
            Dec: f3.at(j).get('m12').value,
            MonthlyOverall: f3.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 3) {
        const xx = +f4.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f4.at(j).get('currencyTitle').value,
            InvestmentCostFx: f4.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f4.at(j).get('m1').value,
            Feb: f4.at(j).get('m2').value,
            Mar: f4.at(j).get('m3').value,
            Apr: f4.at(j).get('m4').value,
            May: f4.at(j).get('m5').value,
            Jun: f4.at(j).get('m6').value,
            Jul: f4.at(j).get('m7').value,
            Aug: f4.at(j).get('m8').value,
            Sep: f4.at(j).get('m9').value,
            Oct: f4.at(j).get('m10').value,
            Nov: f4.at(j).get('m11').value,
            Dec: f4.at(j).get('m12').value,
            MonthlyOverall: f4.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 4) {
        const xx = +f5.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f5.at(j).get('currencyTitle').value,
            InvestmentCostFx: f5.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f5.at(j).get('m1').value,
            Feb: f5.at(j).get('m2').value,
            Mar: f5.at(j).get('m3').value,
            Apr: f5.at(j).get('m4').value,
            May: f5.at(j).get('m5').value,
            Jun: f5.at(j).get('m6').value,
            Jul: f5.at(j).get('m7').value,
            Aug: f5.at(j).get('m8').value,
            Sep: f5.at(j).get('m9').value,
            Oct: f5.at(j).get('m10').value,
            Nov: f5.at(j).get('m11').value,
            Dec: f5.at(j).get('m12').value,
            MonthlyOverall: f5.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 5) {
        const xx = +f6.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f6.at(j).get('currencyTitle').value,
            InvestmentCostFx: f6.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f6.at(j).get('m1').value,
            Feb: f6.at(j).get('m2').value,
            Mar: f6.at(j).get('m3').value,
            Apr: f6.at(j).get('m4').value,
            May: f6.at(j).get('m5').value,
            Jun: f6.at(j).get('m6').value,
            Jul: f6.at(j).get('m7').value,
            Aug: f6.at(j).get('m8').value,
            Sep: f6.at(j).get('m9').value,
            Oct: f6.at(j).get('m10').value,
            Nov: f6.at(j).get('m11').value,
            Dec: f6.at(j).get('m12').value,
            MonthlyOverall: f6.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 6) {
        const xx = +f7.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f7.at(j).get('currencyTitle').value,
            InvestmentCostFx: f7.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f7.at(j).get('m1').value,
            Feb: f7.at(j).get('m2').value,
            Mar: f7.at(j).get('m3').value,
            Apr: f7.at(j).get('m4').value,
            May: f7.at(j).get('m5').value,
            Jun: f7.at(j).get('m6').value,
            Jul: f7.at(j).get('m7').value,
            Aug: f7.at(j).get('m8').value,
            Sep: f7.at(j).get('m9').value,
            Oct: f7.at(j).get('m10').value,
            Nov: f7.at(j).get('m11').value,
            Dec: f7.at(j).get('m12').value,
            MonthlyOverall: f7.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 7) {
        const xx = +f8.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f8.at(j).get('currencyTitle').value,
            InvestmentCostFx: f8.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f8.at(j).get('m1').value,
            Feb: f8.at(j).get('m2').value,
            Mar: f8.at(j).get('m3').value,
            Apr: f8.at(j).get('m4').value,
            May: f8.at(j).get('m5').value,
            Jun: f8.at(j).get('m6').value,
            Jul: f8.at(j).get('m7').value,
            Aug: f8.at(j).get('m8').value,
            Sep: f8.at(j).get('m9').value,
            Oct: f8.at(j).get('m10').value,
            Nov: f8.at(j).get('m11').value,
            Dec: f8.at(j).get('m12').value,
            MonthlyOverall: f8.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 8) {
        const xx = +f9.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f9.at(j).get('currencyTitle').value,
            InvestmentCostFx: f9.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f9.at(j).get('m1').value,
            Feb: f9.at(j).get('m2').value,
            Mar: f9.at(j).get('m3').value,
            Apr: f9.at(j).get('m4').value,
            May: f9.at(j).get('m5').value,
            Jun: f9.at(j).get('m6').value,
            Jul: f9.at(j).get('m7').value,
            Aug: f9.at(j).get('m8').value,
            Sep: f9.at(j).get('m9').value,
            Oct: f9.at(j).get('m10').value,
            Nov: f9.at(j).get('m11').value,
            Dec: f9.at(j).get('m12').value,
            MonthlyOverall: f9.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      } else if (i === 9) {
        const xx = +f10.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f10.at(j).get('currencyTitle').value,
            InvestmentCostFx: f10.at(j).get('fx').value,
            AnnualInvestmentPlanId,
            Jan: f10.at(j).get('m1').value,
            Feb: f10.at(j).get('m2').value,
            Mar: f10.at(j).get('m3').value,
            Apr: f10.at(j).get('m4').value,
            May: f10.at(j).get('m5').value,
            Jun: f10.at(j).get('m6').value,
            Jul: f10.at(j).get('m7').value,
            Aug: f10.at(j).get('m8').value,
            Sep: f10.at(j).get('m9').value,
            Oct: f10.at(j).get('m10').value,
            Nov: f10.at(j).get('m11').value,
            Dec: f10.at(j).get('m12').value,
            MonthlyOverall: f10.at(j).get('overall').value,
            YearOfMonth: year[i],
            CapexInformationId: CapexInformationId

          };
          x.push(body);
        }
      }
    }

    const data = {
      MonthlyInvestmentPlanTableDtos: x
    };

    console.log(data);


    return this.http.post(this.baseUrl + 'CapexsInformations/CreateMonthlyInvestmentPlan/' + id + '/' + CapexInformationId, data);

  }

  convertDate(di) {
    const x = di.substring(6).substring(0, 4) + '-' + di.substring(3).substring(0, 2) + '-' + di.substring(0, 2);
    return x;
  }

  GetCapexsInfo(id?: string, type?: string): Observable<Capexs> {


    return this.http.get<any>(this.baseUrl + 'CapexsInformations/' + id + '/' + type);
  }

  GetAnnualInvestmentPlan(id?: string, capexid?: string): Observable<any[]> {


    return this.http.get<any[]>(this.baseUrl + 'CapexsInformations/GetAnnualInvestmentPlan/' + id + '/' + capexid);
  }

  GetMonthlyInvestmentPlan(id?: string, capexid?: string, YearOfMonth?): Observable<any[]> {

    const body = {
      YearOfMonth
    };


    return this.http.get<any[]>(this.baseUrl + 'CapexsInformations/GetMonthlyInvestmentPlan/' + id
      + '/' + capexid + '/' + YearOfMonth);
  }

  CreateAnnualInvestmentPlan_(id: string, Annual) {

    // let data = [];

    // const control = Annual.get('annualForm_list') as FormArray;

    const xx = +Annual.length;
    const x = [];

    for (let i = 0; i < xx; i++) {

      const body = {
        InvestmentPlan: Annual[i].currencyTitle,
        InvestmentPlanFx: Annual[i].fx,
        Year1: Annual[i].y1,
        Year2: Annual[i].y2,
        Year3: Annual[i].y3,
        Year4: Annual[i].y4,
        Year5: Annual[i].y5,
        Year6: Annual[i].y6,
        Year7: Annual[i].y7,
        Year8: Annual[i].y8,
        Year9: Annual[i].y9,
        Year10: Annual[i].y10,
        YearOverall: Annual[i].overall
      };

      console.log(body);
      x.push(body);

    }

    const data = {
      AnnualInvestmentPlanTableDtos: x
    };

    return this.http.post(this.baseUrl + 'CapexsInformations/CreateAnnualInvestmentPlan/' + id, data);
  }

  CreateMonthlyInvestmentPlan_(year, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, id, AnnualInvestmentPlanId) {


    // console.log(f1);

    const x = [];

    for (let i = 0; i < +year.length; i++) {
      if (i === 0) {
        const xx = +f1.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f1[j].currencyTitle,
            InvestmentCostFx: f1[j].fx,
            AnnualInvestmentPlanId,
            Jan: f1[j].m1,
            Feb: f1[j].m2,
            Mar: f1[j].m3,
            Apr: f1[j].m4,
            May: f1[j].m5,
            Jun: f1[j].m6,
            Jul: f1[j].m7,
            Aug: f1[j].m8,
            Sep: f1[j].m9,
            Oct: f1[j].m10,
            Nov: f1[j].m11,
            Dec: f1[j].m12,
            MonthlyOverall: f1[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 1) {
        const xx = +f2.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f2[j].currencyTitle,
            InvestmentCostFx: f2[j].fx,
            AnnualInvestmentPlanId,
            Jan: f2[j].m1,
            Feb: f2[j].m2,
            Mar: f2[j].m3,
            Apr: f2[j].m4,
            May: f2[j].m5,
            Jun: f2[j].m6,
            Jul: f2[j].m7,
            Aug: f2[j].m8,
            Sep: f2[j].m9,
            Oct: f2[j].m10,
            Nov: f2[j].m11,
            Dec: f2[j].m12,
            MonthlyOverall: f2[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 2) {
        const xx = +f3.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f3[j].currencyTitle,
            InvestmentCostFx: f3[j].fx,
            AnnualInvestmentPlanId,
            Jan: f3[j].m1,
            Feb: f3[j].m2,
            Mar: f3[j].m3,
            Apr: f3[j].m4,
            May: f3[j].m5,
            Jun: f3[j].m6,
            Jul: f3[j].m7,
            Aug: f3[j].m8,
            Sep: f3[j].m9,
            Oct: f3[j].m10,
            Nov: f3[j].m11,
            Dec: f3[j].m12,
            MonthlyOverall: f3[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 3) {
        const xx = +f4.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f4[j].currencyTitle,
            InvestmentCostFx: f4[j].fx,
            AnnualInvestmentPlanId,
            Jan: f4[j].m1,
            Feb: f4[j].m2,
            Mar: f4[j].m3,
            Apr: f4[j].m4,
            May: f4[j].m5,
            Jun: f4[j].m6,
            Jul: f4[j].m7,
            Aug: f4[j].m8,
            Sep: f4[j].m9,
            Oct: f4[j].m10,
            Nov: f4[j].m11,
            Dec: f4[j].m12,
            MonthlyOverall: f4[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 4) {
        const xx = +f5.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f5[j].currencyTitle,
            InvestmentCostFx: f5[j].fx,
            AnnualInvestmentPlanId,
            Jan: f5[j].m1,
            Feb: f5[j].m2,
            Mar: f5[j].m3,
            Apr: f5[j].m4,
            May: f5[j].m5,
            Jun: f5[j].m6,
            Jul: f5[j].m7,
            Aug: f5[j].m8,
            Sep: f5[j].m9,
            Oct: f5[j].m10,
            Nov: f5[j].m11,
            Dec: f5[j].m12,
            MonthlyOverall: f5[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 5) {
        const xx = +f6.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f6[j].currencyTitle,
            InvestmentCostFx: f6[j].fx,
            AnnualInvestmentPlanId,
            Jan: f6[j].m1,
            Feb: f6[j].m2,
            Mar: f6[j].m3,
            Apr: f6[j].m4,
            May: f6[j].m5,
            Jun: f6[j].m6,
            Jul: f6[j].m7,
            Aug: f6[j].m8,
            Sep: f6[j].m9,
            Oct: f6[j].m10,
            Nov: f6[j].m11,
            Dec: f6[j].m12,
            MonthlyOverall: f6[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 6) {
        const xx = +f7.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f7[j].currencyTitle,
            InvestmentCostFx: f7[j].fx,
            AnnualInvestmentPlanId,
            Jan: f7[j].m1,
            Feb: f7[j].m2,
            Mar: f7[j].m3,
            Apr: f7[j].m4,
            May: f7[j].m5,
            Jun: f7[j].m6,
            Jul: f7[j].m7,
            Aug: f7[j].m8,
            Sep: f7[j].m9,
            Oct: f7[j].m10,
            Nov: f7[j].m11,
            Dec: f7[j].m12,
            MonthlyOverall: f7[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 7) {
        const xx = +f8.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f8[j].currencyTitle,
            InvestmentCostFx: f8[j].fx,
            AnnualInvestmentPlanId,
            Jan: f8[j].m1,
            Feb: f8[j].m2,
            Mar: f8[j].m3,
            Apr: f8[j].m4,
            May: f8[j].m5,
            Jun: f8[j].m6,
            Jul: f8[j].m7,
            Aug: f8[j].m8,
            Sep: f8[j].m9,
            Oct: f8[j].m10,
            Nov: f8[j].m11,
            Dec: f8[j].m12,
            MonthlyOverall: f8[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 8) {
        const xx = +f9.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f9[j].currencyTitle,
            InvestmentCostFx: f9[j].fx,
            AnnualInvestmentPlanId,
            Jan: f9[j].m1,
            Feb: f9[j].m2,
            Mar: f9[j].m3,
            Apr: f9[j].m4,
            May: f9[j].m5,
            Jun: f9[j].m6,
            Jul: f9[j].m7,
            Aug: f9[j].m8,
            Sep: f9[j].m9,
            Oct: f9[j].m10,
            Nov: f9[j].m11,
            Dec: f9[j].m12,
            MonthlyOverall: f9[j].overall,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      } else if (i === 9) {
        const xx = +f10.length;
        for (let j = 0; j < xx; j++) {
          const body = {
            InvestmentCost: f10[j].currencyTitle,
            InvestmentCostFx: f10[j].fx,
            AnnualInvestmentPlanId,
            Jan: f10[j].m1,
            Feb: f10[j].m2,
            Mar: f10[j].m3,
            Apr: f10[j].m4,
            May: f10[j].m5,
            Jun: f10[j].m6,
            Jul: f10[j].m7,
            Aug: f10[j].m8,
            Sep: f10[j].m9,
            Oct: f10[j].m10,
            Nov: f10[j].m11,
            Dec: f10[j].m12,
            MonthlyOverall: f10[j].overall
            ,
            YearOfMonth: year[i]
          };
          x.push(body);
        }
      }
    }

    console.log(this.baseUrl + 'CapexsInformations/CreateMonthlyInvestmentPlan/' + id);

    const data = {
      MonthlyInvestmentPlanTableDtos: x
    };

    console.log(data);


    return this.http.post(this.baseUrl + 'CapexsInformations/CreateMonthlyInvestmentPlan/' + id, data);

  }

  GetCapexsInformationBySubmit(id: string): Observable<any>{

    return this.http.get<any>(this.baseUrl + 'CapexsInformations/GetCapexsInformationBySubmit/' + id);
  }

  PutUpdateCapexsinformations(
    StartingDate: string,
    ProjecctComRun: string,
    ActionYear: string,
    ProjectExePeriodYear: string,
    ProjectExePeriodMonth: string,
    CostCenterOfVP: string,
    CodeCostCenterOfVP: string,
    ProjectCost: string,
    ReasonOfChanging: string,
    BudgetPeriod: string,
    BetweenYear: string,
    TransferForm: string,
    PoolBudgetForm: string,
    SubmitTo: string,
    Revistion: string,
    CapexType: string,
    BudgetYear: string,
    CapexStatus: string,
    IsMaxApprovedRev: string,
    Sequent: string,
    ExistingBudget: string,
    SpendingActual: string,
    AdditionalCost: string,
    ReturnCost: string,
    id: string,
    capexid: string
    ): Observable<any>{

      const body = {
        StartingDate: this.convertDate(StartingDate),
        ProjecctComRun: this.convertDate(ProjecctComRun),
        ActionYear: this.convertDate(ActionYear),
        ProjectExePeriodYear,
        ProjectExePeriodMonth,
        CostCenterOfVP,
        CodeCostCenterOfVP,
        ProjectCost,
        ReasonOfChanging,
        BudgetPeriod,
        BetweenYear,
        TransferForm,
        PoolBudgetForm,
        SubmitTo,
        Revistion,
        CapexType,
        BudgetYear,
        CapexStatus,
        IsMaxApprovedRev,
        Sequent,
        ExistingBudget,
        SpendingActual,
        AdditionalCost,
        ReturnCost

      };

    return this.http.get<any>(this.baseUrl + 'CapexsInformations/' +id + '/' +capexid )
  }

}
