import { ResponseService } from '@errors/response/response.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DetailService } from '@services/detail/detail.service';
import { DateUtil } from '@utils/date.utils';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { StatusService } from '@services/status/status.service';
import { InitiativeService } from '@services/initiative/initiative.service';


@Component({
  selector: 'app-view-cim-strategy',
  templateUrl: './view-cim-strategy.component.html',
  styleUrls: ['./view-cim-strategy.component.css']
})
export class ViewCimStrategyComponent implements OnInit {

  @ViewChild('ViewLogHistoryModal', { static: false }) ViewLogHistoryModal: ModalDirective;

  @ViewChild('HistoryStatus', { static: false }) HistoryStatus: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private response: ResponseService,
    private detailService: DetailService,
    private statusService: StatusService,
    private initiativeService: InitiativeService,
  ) { }

  @Input() id;

  history: string;
  IsApprove: boolean;

  initiativeCode: string;
  initiativeYear: string;

  strategicObjectives: any = [];
  strategies: any = [];
  entryModes: any = [];
  productUnits: any = [];
  milestoneStatuses: any = [];
  presidentList: any = [];
  managerList: any = [];

  checkProduct: boolean;

  initiativeDetails: any;
  products: any;
  milestones: any;
  financialIndicators: any;
  financials: any;
  details: any;

  showSpecify = false;
  ShowBOD = false;
  showGeography = false;
  showEntity = false;
  ShowProject = false;
  AfterApprove = false;

  BOD1Display: string;
  BOD2Display: string;

  bsBOD1 = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: null, maxDate: null };
  bsBOD2 = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: null, maxDate: null };

  initiativesDetailForm = this.fb.group({
    strategicObjective: null,
    strategyDetail: null,
    entryMode: null,
    specify: null,
    geography: null,
    geographySpecify: null,
    entity: null,
    entitySpecify: null,
    businessModel: null,
    shareOfInvestment: null,
    president: null,
    manager: null,
    requireBOD1: false,
    bod1: null,
    bod2: null,
    requireProject: false,
    projectDirector: null,
    projectManager: null,
    projectEngineer: null,
    ProcessEngineer: null,
    mgrOfProcessEngineer : null,
    haveProduct: null,
    fx: null,
    fxChoice: null,
    irr: null,
    npv: null,
    firstBudgetYear: null,
    note: null,
    initiativeId: null,
    productionProcess: null,
    listOfEquipment: null,
    comparison: null,
    otherInvestment: null,
    keySuccessFactor: null,
    synergyBenefit: null,
    othersStrategic: null,
    marketOverview: null,
    potentialCustomer: null,
    salesPlan: null,
    sourceOfFeedback: null,
    otherBusiness: null,
    safetyIndex: null,
    corporateImageIndex: null,
    otherQuality: null,
    baseCase: null,
    projectIrrBaseCase: null,
    npvBaseCase: null,
    paybackBaseCase: null,
    ebitdaBaseCase: null,
    optimisticCase: null,
    projectIrrOptimisticCase: null,
    npvOptimisticCase: null,
    paybackOptimisticCase: null,
    ebitdaOptimisticCase: null,
    pessimisticCase: null,
    projectIrrPessimisticCase: null,
    npvPessimisticCase: null,
    paybackPessimisticCase: null,
    ebitdaPessimisticCase: null
  });

  initiativesHaveProduct = this.fb.group({ haveProduct: ['true'] });

  financialIndicatorForm = this.fb.group({
    fx: null,
    fxChoice: null,
    shareOfInvestment: null,
    irr: null,
    npv: null,
    firstBudgetYear: null
  });

  financialAvgForm = this.fb.group({
    avgRevenue: null,
    avgEbitda: null,
    totalCapex: null,
    totalOpex: null,
    totalValuation: null,
    initiativeId: null
  });

  noteForm = this.fb.group({ note: null });

  productForm: FormGroup;
  milestoneForm: FormGroup;
  financialForm: FormGroup;

  ngOnInit(): void {
    this.GetDetailInformationCimStrategy();
    if (this.id) { this.GetSuggestStatus(this.id); }
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      const check = { status: response.status, stage: response.stage };
      this.statusService.CheckApproveInformation(check).subscribe(result => this.IsApprove = result ? true : false);
      this.statusService.CheckInitiativeDetail(check).subscribe(result => this.AfterApprove = result);
    });
  }

  ShowViewLogHistory() {
    this.ViewLogHistoryModal.show();
  }

  CloseViewLogHistory() {
    this.ViewLogHistoryModal.hide();
  }

  ShowHistory(stage) {
    this.history = stage;
    this.HistoryStatus.show();
  }

  CloseHistoryStatus() {
    this.HistoryStatus.hide();
  }

  GetDetailInformationCimStrategy() {
    this.CreateProductForm();
    this.CreateMilestoneForm();
    this.CreateFinancialForm();
    this.detailService.GetPositionLevel30().subscribe(systemName => this.presidentList = systemName);
    this.detailService.GetPositionLevel40().subscribe(systemName => this.managerList = systemName);
    this.detailService.GetEntryModes().subscribe(entryModes => this.entryModes = entryModes);
    this.detailService.GetProductUnits().subscribe(productUnits => this.productUnits = productUnits);
    this.detailService.GetMilestoneStatuses().subscribe(milestoneStatuses => this.milestoneStatuses = milestoneStatuses);
    this.GetInitiativeDetail();
  }

  CreateProductForm() {
    this.productForm = this.fb.group({ products: this.fb.array([]) });
  }

  CreateMilestoneForm() {
    this.milestoneForm = this.fb.group({ milestones: this.fb.array([]) });
  }

  CreateFinancialForm() {
    this.financialForm = this.fb.group({ financials: this.fb.array([]) });
  }

  InitialProductForm(): FormGroup {
    return this.fb.group({
      id: [0],
      name: [''],
      capacity: '',
      productUnit: '',
      other: { value: '', disabled: true },
      type: '',
      initiativeId: [this.id]
    });
  }

  InitialMilestoneForm(): FormGroup {
    return this.fb.group({
      id: [0],
      name: [''],
      detail: '',
      keyDeliverable: '',
      actionBy: '',
      fromDate: '',
      toDate: '',
      milestoneStatus: 'On_plan',
      initiativeId: [this.id]
    });
  }

  InitialFinancialForm(): FormGroup {
    return this.fb.group({
      id: [0],
      year: [],
      revenue: [],
      ebitda: [],
      capex: [],
      opex: [],
      valuation: [],
      initiativeId: [this.id]
    });
  }

  AddProduct() {
    const control = this.productForm.get('products') as FormArray;
    control.push(this.InitialProductForm());
  }

  AddMilestone() {
    const control = this.milestoneForm.get('milestones') as FormArray;
    control.push(this.InitialMilestoneForm());
  }

  GetInitiativeDetail() {
    this.detailService.GetInitiativeDetail(this.id).subscribe(response => {

      this.detailService.GetStrategicObjectives(response.year).subscribe(result => this.strategicObjectives = result);

      this.initiativeCode      = response.initiativeCode;
      this.initiativeYear      = response.year;
      this.initiativeDetails   = response.initiativeDetails;
      this.products            = response.products;
      this.milestones          = response.milestones;
      this.financialIndicators = response.financialIndicators;
      this.financials          = response.financials;

      if (this.initiativeDetails) {
        this.initiativesDetailForm.patchValue(this.initiativeDetails);

        this.showSpecify = this.initiativeDetails.entryMode === 'E009' ? true : false;
        this.ShowBOD     = this.initiativeDetails.requireBOD1          ? true : false;

        this.BOD1Display = this.dateUtil.GetDate(new Date(this.initiativeDetails.boD1));
        this.BOD2Display = this.dateUtil.GetDate(new Date(this.initiativeDetails.boD2));
        this.initiativesDetailForm.patchValue({ bod1: this.BOD1Display, bod2: this.BOD2Display });

        this.initiativesHaveProduct.patchValue({
          haveProduct: this.initiativeDetails.haveProduct ? this.initiativeDetails.haveProduct : 'true'
        });
        if (this.initiativeDetails.strategicObjective) {
          this.detailService.GetStrategies(this.initiativeDetails.strategicObjective).subscribe(result => this.strategies = result);
        }
        this.financialIndicatorForm.patchValue({
          fx: this.initiativeDetails.fx ? this.initiativeDetails.fx : '',
          fxChoice: this.initiativeDetails.fxChoice ? this.initiativeDetails.fxChoice : 'THB',
          shareOfInvestment: this.initiativeDetails.shareOfInvestment ? this.initiativeDetails.shareOfInvestment : '',
          firstBudgetYear: this.initiativeDetails.firstBudgetYear ? this.initiativeDetails.firstBudgetYear : new Date().getFullYear(),
        });
        this.noteForm.patchValue({ note: this.initiativeDetails.note });
        this.financialIndicatorForm.disable();
        this.initiativesDetailForm.disable();
        this.initiativesHaveProduct.disable();
        this.financialAvgForm.disable();
        this.noteForm.disable();
        switch (this.initiativeDetails.haveProduct) {
          case 'true':
            (this.productForm.get('products') as FormArray).controls.forEach(item => { item.enable(); });
            const ProductControl = this.productForm.get('products') as FormArray;
            for (let i = 0; i < ProductControl.length; i++) {
              ProductControl.at(i).get('other').disable();
            }
            break;
          case 'false':
            (this.productForm.get('products') as FormArray).controls.forEach(item => { item.disable(); });
            break;
        }
      } else {
        this.financialIndicatorForm.disable();
        this.initiativesDetailForm.disable();
        this.initiativesHaveProduct.disable();
        this.financialAvgForm.disable();
        this.noteForm.disable();
      }

      if (this.products.length !== 0) {
        this.checkProduct = true;
        const ProductControls = this.productForm.get('products') as FormArray;
        for (let i = 0; i < this.products.length; i++) {
          ProductControls.push(this.InitialProductForm());
          ProductControls.at(i).patchValue(this.products[i]);
          ProductControls.at(i).get('other').enable();
          ProductControls.at(i).disable();
        }
        for (let i = 0; i < ProductControls.length; i++) {
          if (ProductControls.at(i).get('productUnit').value === 'PU03') {
            ProductControls.at(i).get('other').enable();
            ProductControls.at(i).get('other').disable();
          } else {
            ProductControls.at(i).get('other').disable();
          }
        }
      } else {
        this.checkProduct = false;
      }

      if (this.milestones.length !== 0) {
        const MilestoneControls = this.milestoneForm.get('milestones') as FormArray;
        for (let i = 0; i < this.milestones.length; i++) {
          MilestoneControls.push(this.InitialMilestoneForm());
          MilestoneControls.at(i).patchValue(response.milestones[i]);
          MilestoneControls.at(i).disable();
        }
        for (let i = 0; i < MilestoneControls.length; i++) {
          const fromResponse = this.dateUtil.GetDate(new Date(this.milestones[i].fromDate));
          const toResponse   = this.dateUtil.GetDate(new Date(this.milestones[i].toDate));
          MilestoneControls.at(i).get('fromDate').patchValue(fromResponse);
          MilestoneControls.at(i).get('toDate').patchValue(toResponse);
          MilestoneControls.at(i).disable();
        }
      } else {
        this.AddMilestone();
        this.milestoneForm.disable();
      }

      if (this.financialIndicators.length !== 0) {
        const FinancialControls = this.financialForm.get('financials') as FormArray;
        for (let i = 0; i < this.financialIndicators.length; i++) {
          FinancialControls.push(this.InitialFinancialForm());
          FinancialControls.at(i).patchValue(response.financialIndicators[i]);
          FinancialControls.at(i).disable();
        }
      }

      if (this.financials) { this.financialAvgForm.patchValue(response.financials); }
    }, error => this.response.error(error));
  }
}
