import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DateUtil } from '@utils/date.utils';
import { SwalTool } from '@tools/swal.tools';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { DetailService } from '@services/detail/detail.service';
import { InitiativeService } from '@services/initiative/initiative.service';
import { StatusService } from '@services/status/status.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailInitiativeComponent implements OnInit, OnDestroy {

  constructor(
    private statusService: StatusService,
    private initiativeService: InitiativeService,
    private fb: FormBuilder,
    private detailService: DetailService,
    private dateUtil: DateUtil,
    private swalTool: SwalTool
  ) { }

  id: number;
  name = 'Initiatives Progress Tracking';
  page = 'detail';

  Cim: boolean;
  Capex: boolean;
  Strategy: boolean;
  Max: boolean;

  financial = 10;

  initiativeCode: string;
  initiativeYear: string;

  status: string;
  remark: string;
  stage: string;

  minMode: BsDatepickerViewMode = 'year';
  bsConfig: Partial<BsDatepickerConfig>;
  bsConfigYear: Partial<BsDatepickerConfig>;

  bsBOD1 = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: null, maxDate: null };
  bsBOD2 = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: null, maxDate: null };

  strategicObjectives: any = [];
  strategies: any = [];
  entryModes: any = [];
  productUnits: any = [];
  owners: any = [];
  milestoneStatuses: any = [];
  presidentList: any = [];
  managerList: any = [];
  isHaveProduct = 'true';

  year: string;
  setYear: string;

  initiativeDetails: any;
  products: any;
  milestones: any;
  financialIndicators: any;
  financials: any;

  BOD1Date: string;
  BOD2Date: string;
  BOD1Display: string;
  BOD2Display: string;

  isDisabledMilestone = true;
  isDisabledProduct = true;
  isAddFinancial = false;
  isRemoveFinancial = false;
  showSpecify = false;
  showGeography = false;
  showEntity = false;
  ShowProject = false;
  financialLength: number;

  Detail: number;

  ShowBOD = false;

  initiativesDetailForm = this.fb.group({
    id: 0,
    strategicObjective: ['', Validators.required],
    strategyDetail: { value: '', disabled: true },
    entryMode: '',
    specify: '',
    geography: '',
    geographySpecify: '',
    entity: '',
    entitySpecify: '',
    businessModel: '',
    shareOfInvestment: '',
    president: null,
    manager: null,
    requireBOD1: false,
    bod1: null,
    bod2: null,
    requireProject: false,
    projectDirector: '',
    projectManager: '',
    projectEngineer: '',
    ProcessEngineer: '',
    mgrOfProcessEngineer : '',
    haveProduct: '',
    fx: '',
    fxChoice: 'THB',
    irr: '',
    npv: '',
    firstBudgetYear: '',
    note: '',
    initiativeId: '',
    productionProcess: '',
    listOfEquipment: '',
    comparison: '',
    otherInvestment: '',
    keySuccessFactor: '',
    synergyBenefit: '',
    othersStrategic: '',
    marketOverview: '',
    potentialCustomer: '',
    salesPlan: '',
    sourceOfFeedback: '',
    otherBusiness: '',
    safetyIndex: '',
    corporateImageIndex: '',
    otherQuality: '',
    baseCase: '',
    projectIrrBaseCase: '',
    npvBaseCase: '',
    paybackBaseCase: '',
    ebitdaBaseCase: '',
    optimisticCase: '',
    projectIrrOptimisticCase: '',
    npvOptimisticCase: '',
    paybackOptimisticCase: '',
    ebitdaOptimisticCase: '',
    pessimisticCase: '',
    projectIrrPessimisticCase: '',
    npvPessimisticCase: '',
    paybackPessimisticCase: '',
    ebitdaPessimisticCase: ''
   });

  financialIndicatorForm = this.fb.group({
    fx: [''],
    fxChoice: ['THB'],
    irr: [''],
    npv: [''],
    firstBudgetYear: [new Date().getFullYear()]
  });

  financialAvgForm = this.fb.group({
    id: [''],
    initiativeId: [''],
    avgRevenue: [null],
    avgEbitda: [null],
    totalCapex: [null],
    totalOpex: [null],
    totalValuation: [null],
  });

  initiativesHaveProduct = this.fb.group({ haveProduct: ['true'] });

  noteForm = this.fb.group({ note: [''] });

  productForm = this.fb.group({ products: this.fb.array([]) });
  milestoneForm = this.fb.group({ milestones: this.fb.array([]) });
  financialForm = this.fb.group({ financials: this.fb.array([]) });

  ValidateProduct = false;

  typeOfInvestment: string;

  startDate: Date;
  finishDate: Date;

  AfterApprove = false;

  get invalidBOD1() {
    return this.initiativesDetailForm.controls.bod1.touched && this.initiativesDetailForm.controls.bod1.invalid;
  }

  get invalidSpecify() {
    return this.initiativesDetailForm.controls.specify.touched && this.initiativesDetailForm.controls.specify.invalid;
  }

  get invalidGeographySpecify() {
    return this.initiativesDetailForm.controls.geographySpecify.touched && this.initiativesDetailForm.controls.geographySpecify.invalid;
  }

  get invalidEntitySpecify() {
    return this.initiativesDetailForm.controls.entitySpecify.touched && this.initiativesDetailForm.controls.entitySpecify.invalid;
  }

  get invalidStrategicObjective() {
    return this.initiativesDetailForm.controls.strategicObjective.touched && this.initiativesDetailForm.controls.strategicObjective.invalid;
  }

  get invalidStrategyDetail() {
    return this.initiativesDetailForm.controls.strategyDetail.touched && this.initiativesDetailForm.controls.strategyDetail.invalid;
  }

  get invalidProjectManager() {
    return this.initiativesDetailForm.controls.projectManager.touched && this.initiativesDetailForm.controls.projectManager.invalid;
  }

  get invalidProjectEngineer() {
    return this.initiativesDetailForm.controls.projectEngineer.touched && this.initiativesDetailForm.controls.projectEngineer.invalid;
  }

  get invalidShare() {
    return this.initiativesDetailForm.controls.shareOfInvestment.touched && this.initiativesDetailForm.controls.shareOfInvestment.invalid;
  }

  get invalidAvgEbitda() {
    return this.financialAvgForm.controls.avgEbitda.touched && this.financialAvgForm.controls.avgEbitda.invalid;
  }

  get invalidTotalCapex() {
    return this.financialAvgForm.controls.totalCapex.touched && this.financialAvgForm.controls.totalCapex.invalid;
  }

  get invalidTotalValuation() {
    return this.financialAvgForm.controls.totalValuation.touched && this.financialAvgForm.controls.totalValuation.invalid;
  }

  get invalidSubmit() {
    return this.initiativesDetailForm.valid && this.ValidateProduct && this.financialAvgForm.valid;
  }

  get invalidPresident() {
    return this.initiativesDetailForm.controls.president.touched && this.initiativesDetailForm.controls.president.invalid;
  }

  get invalidManager() {
    return this.initiativesDetailForm.controls.manager.touched && this.initiativesDetailForm.controls.manager.invalid;
  }

  get invalidBaseCase() {
    return this.initiativesDetailForm.controls.baseCase.touched && this.initiativesDetailForm.controls.baseCase.invalid;
  }

  get invalidProjectIrrBaseCase() {
    return this.initiativesDetailForm.controls.projectIrrBaseCase.touched && this.initiativesDetailForm.controls.projectIrrBaseCase.invalid;
  }

  get invalidNpvBaseCase() {
    return this.initiativesDetailForm.controls.npvBaseCase.touched && this.initiativesDetailForm.controls.npvBaseCase.invalid;
  }

  get invalidPaybackBaseCase() {
    return this.initiativesDetailForm.controls.paybackBaseCase.touched && this.initiativesDetailForm.controls.paybackBaseCase.invalid;
  }

  get invalidEbitdaBaseCase() {
    return this.initiativesDetailForm.controls.ebitdaBaseCase.touched && this.initiativesDetailForm.controls.ebitdaBaseCase.invalid;
  }

  InvalidProduct(i) {
    const control = this.productForm.get('products') as FormArray;
    return control.at(i).get('name').touched && control.at(i).get('name').invalid;
  }

  ngOnInit() {
    this.detailService.GetEntryModes().subscribe(entryModes => this.entryModes = entryModes);
    this.detailService.GetProductUnits().subscribe(productUnits => this.productUnits = productUnits);
    this.detailService.GetMilestoneStatuses().subscribe(milestoneStatuses => this.milestoneStatuses = milestoneStatuses);
    this.detailService.GetOwners().subscribe(owners => this.owners = owners);
    this.bsConfig     = Object.assign({}, { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false });
    this.bsConfigYear = Object.assign({}, { isAnimated: true, dateInputFormat: 'YYYY'      , minMode: this.minMode  });
    this.IsInitiativesDetail();
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('id', this.id.toString());
    sessionStorage.setItem('page', 'detail');
    this.GetSuggestStatus(this.id);
    this.GetInitiativeDetail(this.id);
    this.GetPresident();
    this.GetManager();
    this.CheckValidate();
    this.SetGeneral();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') {
      sessionStorage.setItem('InitiativeValidate', 'true');
      sessionStorage.setItem('InitiativeActive'  , 'true');
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('DetailValidated', 'true');
    sessionStorage.setItem('DetailValidate', JSON.stringify(this.invalidSubmit));

    if (this.initiativesDetailForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isInitiativesDetailForm', 'true');
      sessionStorage.setItem('InitiativesDetailForm', JSON.stringify(this.initiativesDetailForm.value));
    }
    if (this.initiativesHaveProduct.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isInitiativesHaveProduct', 'true');
      sessionStorage.setItem('InitiativesHaveProduct', JSON.stringify(this.initiativesHaveProduct.value));
      sessionStorage.setItem('InitiativesDetailForm', JSON.stringify(this.initiativesDetailForm.value));
    }
    if (this.productForm.dirty) {
      this.PatchForm();
      const ProductControl = this.productForm.get('products') as FormArray;
      for (let i = 0; i < ProductControl.length; i++) { ProductControl.at(i).get('id').patchValue(0); }
      sessionStorage.setItem('isProductForm', 'true');
      sessionStorage.setItem('ProductForm', JSON.stringify(this.productForm.value));
    }
    if (this.milestoneForm.dirty) {
      this.PatchForm();
      this.SetMilestoneForm();
      sessionStorage.setItem('isMilestoneForm', 'true');
      sessionStorage.setItem('MilestoneForm', JSON.stringify(this.milestoneForm.value));
    }
    if (this.financialIndicatorForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isFinancialIndicatorForm', 'true');
      sessionStorage.setItem('FinancialIndicatorForm', JSON.stringify(this.financialIndicatorForm.value));
      sessionStorage.setItem('InitiativesDetailForm', JSON.stringify(this.initiativesDetailForm.value));
    }
    if (this.financialForm.dirty) {
      this.PatchForm();
      const FinancialControl = this.financialForm.get('financials') as FormArray;
      for (let i = 0; i < FinancialControl.length; i++) { FinancialControl.at(i).get('id').patchValue(0); }
      this.financialAvgForm.patchValue({ id: 0, initiativeId: this.id });
      sessionStorage.setItem('isFinancialForm', 'true');
      sessionStorage.setItem('FinancialForm', JSON.stringify(this.financialForm.value));
      sessionStorage.setItem('FinancialAvgForm', JSON.stringify(this.financialAvgForm.value));
    }
    if (this.noteForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isNoteForm', 'true');
      sessionStorage.setItem('NoteForm', JSON.stringify(this.noteForm.value));
      sessionStorage.setItem('InitiativesDetailForm', JSON.stringify(this.initiativesDetailForm.value));
    }
  }

  CheckValidate() {
    if (sessionStorage.getItem('DetailValidate') === 'false') {
      this.SetMarkAsTouchedDetail();
    }
  }

  IsInitiativesDetail() {
    if (sessionStorage.getItem('isInitiativesDetailForm') === 'true') {
      const initiativesDetail = JSON.parse(sessionStorage.getItem('InitiativesDetailForm'));
      if (initiativesDetail.strategyDetail) {
        this.initiativesDetailForm.controls.strategyDetail.enable();
      } else {
        this.initiativesDetailForm.controls.strategyDetail.disable();
      }
      if (initiativesDetail.strategicObjective) {
        this.detailService.GetStrategies(initiativesDetail.strategicObjective).subscribe(result => this.strategies = result);
      }
      this.initiativesDetailForm.patchValue(initiativesDetail);
      this.initiativesDetailForm.patchValue({
        strategyDetail: initiativesDetail.strategyDetail ? initiativesDetail.strategyDetail : ''
      });

      this.BOD1Date    = initiativesDetail.bod1;
      this.BOD2Date    = initiativesDetail.bod2;
      this.BOD1Display = initiativesDetail.bod1 ? this.dateUtil.GetDate(new Date(initiativesDetail.bod1)) : null;
      this.BOD2Display = initiativesDetail.bod2 ? this.dateUtil.GetDate(new Date(initiativesDetail.bod2)) : null;

      this.initiativesDetailForm.patchValue({ bod1: this.BOD1Display, bod2: this.BOD2Display });

    }
    if (sessionStorage.getItem('isInitiativesHaveProduct') === 'true') {
      const initiativesHaveProduct = JSON.parse(sessionStorage.getItem('InitiativesHaveProduct'));
      this.initiativesHaveProduct.patchValue({
        haveProduct: initiativesHaveProduct.haveProduct ? initiativesHaveProduct.haveProduct : 'true'
      });
      switch (initiativesHaveProduct.haveProduct) {
        case 'true':
          this.isHaveProduct = 'true';
          break;
        case 'false':
          this.isHaveProduct = 'false';
          break;
      }
    }
    if (sessionStorage.getItem('isProductForm') === 'true') {
      const productForm = JSON.parse(sessionStorage.getItem('ProductForm'));
      if (productForm.products.length !== 0) {
        const ProductControl = this.productForm.get('products') as FormArray;
        for (let i = 0; i < productForm.products.length; i++) {
          ProductControl.push(this.InitialProductForm());
          ProductControl.at(i).patchValue(productForm.products[i]);
          if (ProductControl.at(i).get('productUnit').value === 'PU03') {
            ProductControl.at(i).get('other').enable();
          } else {
            ProductControl.at(i).get('other').disable();
          }
        }
        this.isDisabledProduct = ProductControl.length > 1 ? false : true;
      }
    }
    if (sessionStorage.getItem('isMilestoneForm') === 'true') {
      const milestoneForm = JSON.parse(sessionStorage.getItem('MilestoneForm'));
      if (milestoneForm.milestones.length !== 0) {
        const MilestoneControl = this.milestoneForm.get('milestones') as FormArray;
        for (let i = 0; i < milestoneForm.milestones.length; i++) {
          MilestoneControl.push(this.InitialMilestoneForm());
          MilestoneControl.at(i).patchValue(milestoneForm.milestones[i]);
        }
        for (let i = 0; i < MilestoneControl.length; i++) {
          const fromResponse = this.dateUtil.GetDate(new Date(milestoneForm.milestones[i].fromDate));
          const toResponse = this.dateUtil.GetDate(new Date(milestoneForm.milestones[i].toDate));
          MilestoneControl.at(i).get('fromDate').patchValue(fromResponse);
          MilestoneControl.at(i).get('toDate').patchValue(toResponse);
        }
        this.isDisabledMilestone = MilestoneControl.length > 1 ? false : true;
      }
    }
    if (sessionStorage.getItem('isFinancialIndicatorForm') === 'true') {
      const financialIndicatorForm = JSON.parse(sessionStorage.getItem('FinancialIndicatorForm'));
      this.financialIndicatorForm.patchValue(financialIndicatorForm);
    }
    if (sessionStorage.getItem('isFinancialForm') === 'true') {
      const financialForm = JSON.parse(sessionStorage.getItem('FinancialForm'));
      const financialAvgForm = JSON.parse(sessionStorage.getItem('FinancialAvgForm'));
      if (financialForm.financials.length !== 0) {
        const FinancialControls = this.financialForm.get('financials') as FormArray;
        for (let i = 0; i < financialForm.financials.length; i++) {
          FinancialControls.push(this.InitialFinancialForm());
          FinancialControls.at(i).setValue(financialForm.financials[i]);
        }
        this.financialLength = FinancialControls.length;
      }
      this.financialAvgForm.patchValue(financialAvgForm);
    }
    if (sessionStorage.getItem('isNoteForm') === 'true') {
      const noteForm = JSON.parse(sessionStorage.getItem('NoteForm'));
      this.noteForm.patchValue(noteForm);
    }
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      this.status = response.status;
      this.stage = response.stage;
      this.remark = response.remark ? response.remark : null;

      this.Cim = response.cim ? true : false;
      this.Capex = response.directCapex ? true : false;
      this.Strategy = response.strategy ? true : false;
      this.Max = response.max ? true : false;

      const check = { status: response.status, stage: response.stage };
      this.statusService.CheckInitiativeDetail(check).subscribe(result => this.AfterApprove = result);
    });
  }

  SetValidateTotal() {
    switch (this.typeOfInvestment) {
      case 'Divest':
        this.financialAvgForm.controls.totalValuation.setValidators([Validators.required]);
        this.financialAvgForm.controls.totalValuation.updateValueAndValidity();
        break;
      default:
        this.financialAvgForm.controls.avgEbitda.setValidators([Validators.required]);
        this.financialAvgForm.controls.avgEbitda.updateValueAndValidity();
        this.financialAvgForm.controls.totalCapex.setValidators([Validators.required]);
        this.financialAvgForm.controls.totalCapex.updateValueAndValidity();
        break;
    }
  }

  SetMarkAsTouchedTotal() {
    switch (this.typeOfInvestment) {
      case 'Divest':
        this.financialAvgForm.controls.totalValuation.markAsTouched();
        break;
      default:
        this.financialAvgForm.controls.avgEbitda.markAsTouched();
        this.financialAvgForm.controls.totalCapex.markAsTouched();
        break;
    }
  }

  GetInitiativeDetail(id) {
    this.detailService.GetInitiativeDetail(id).subscribe(response => {
      if (response) {
        this.startDate  = new Date(response.startingDate);
        this.finishDate = new Date(response.finishingDate);

        this.bsBOD1.minDate = response.startingDate  ? new Date(this.startDate.setDate(this.startDate.getDate()))   : null;
        this.bsBOD1.maxDate = response.finishingDate ? new Date(this.finishDate.setDate(this.finishDate.getDate())) : null;

        this.bsBOD2.minDate = response.startingDate  ? new Date(this.startDate.setDate(this.startDate.getDate()))   : null;
        this.bsBOD2.maxDate = response.finishingDate ? new Date(this.finishDate.setDate(this.finishDate.getDate())) : null;

        this.typeOfInvestment = response.typeOfInvestment;
        this.initiativeCode   = response.initiativeCode;
        this.initiativeYear   = response.year;
        this.detailService.GetStrategicObjectives(response.year).subscribe(result => this.strategicObjectives = result);
        this.financialIndicatorForm.patchValue({ fx: response.fxExchange });
        this.initiativeDetails = response.initiativeDetails;
        this.products = response.products;
        this.milestones = response.milestones;
        this.financialIndicators = response.financialIndicators;
        this.financials = response.financials;

        if (sessionStorage.getItem('isInitiativesDetailForm') !== 'true') {
          if (this.initiativeDetails) {

            this.Detail = this.initiativeDetails.id;

            if (this.initiativeDetails.strategyDetail) {
              this.initiativesDetailForm.controls.strategyDetail.enable();
            } else {
              this.initiativesDetailForm.controls.strategyDetail.disable();
            }

            if (this.initiativeDetails.requireBOD1) {
              this.ShowBOD = true;
            } else {
              this.ShowBOD = false;
            }

            if (this.initiativeDetails.strategicObjective) {
              this.detailService.GetStrategies(this.initiativeDetails.strategicObjective).subscribe(result => this.strategies = result);
            }

            if (this.initiativeDetails.entryMode === 'E009') {
              this.showSpecify = true;
              this.initiativesDetailForm.controls.specify.enable();
            } else {
              this.showSpecify = false;
              this.initiativesDetailForm.controls.specify.disable();
              this.initiativesDetailForm.patchValue({ specify: null });
            }

            this.initiativesDetailForm.patchValue(this.initiativeDetails);

            this.initiativesDetailForm.patchValue({
              strategyDetail: this.initiativeDetails.strategyDetail ? this.initiativeDetails.strategyDetail : ''
            });

            if (sessionStorage.getItem('isInitiativesHaveProduct') !== 'true') {
              this.initiativesHaveProduct.patchValue({
                haveProduct: this.initiativeDetails.haveProduct ? this.initiativeDetails.haveProduct : 'true'
              });
              switch (this.initiativeDetails.haveProduct) {
                case 'true':
                  (this.productForm.get('products') as FormArray).controls.forEach(item => { item.enable(); });
                  const ProductControl = this.productForm.get('products') as FormArray;
                  for (let i = 0; i < ProductControl.length; i++) {
                    ProductControl.at(i).get('other').disable();
                  }
                  this.isHaveProduct = 'true';
                  break;
                case 'false':
                  (this.productForm.get('products') as FormArray).controls.forEach(item => { item.disable(); });
                  this.isHaveProduct = 'false';
                  break;
              }
            }

            this.BOD1Date    = this.initiativeDetails.boD1 ? this.dateUtil.SetDate(new Date(this.initiativeDetails.boD1)) : null;
            this.BOD2Date    = this.initiativeDetails.boD2 ? this.dateUtil.SetDate(new Date(this.initiativeDetails.boD2)) : null;
            this.BOD1Display = this.initiativeDetails.boD1 ? this.dateUtil.GetDate(new Date(this.initiativeDetails.boD1)) : null;
            this.BOD2Display = this.initiativeDetails.boD2 ? this.dateUtil.GetDate(new Date(this.initiativeDetails.boD2)) : null;

            this.initiativesDetailForm.patchValue({ bod1: this.BOD1Display, bod2: this.BOD2Display });

            this.financialIndicatorForm.patchValue({
              irr: this.initiativeDetails.irr ? this.initiativeDetails.irr : '',
              npv: this.initiativeDetails.npv ? this.initiativeDetails.npv : '',
              fx : this.initiativeDetails.fx  ? this.initiativeDetails.fx  : '',
              fxChoice: this.initiativeDetails.fxChoice ? this.initiativeDetails.fxChoice : 'THB',
              shareOfInvestment: this.initiativeDetails.shareOfInvestment ? this.initiativeDetails.shareOfInvestment : '',
              firstBudgetYear: this.initiativeDetails.firstBudgetYear ? this.initiativeDetails.firstBudgetYear : new Date().getFullYear(),
            });

            if (sessionStorage.getItem('isNoteForm') !== 'true') {
              this.noteForm.patchValue({ note: this.initiativeDetails.note });
            }

          } else {
            this.initiativesDetailForm.patchValue({ initiativeId: this.id });
          }
        }

        if (sessionStorage.getItem('isProductForm') !== 'true') {
          if (this.products.length === 0) {
            this.AddProduct();
          } else {
            const ProductControls = this.productForm.get('products') as FormArray;
            for (let i = 0; i < this.products.length; i++) {
              ProductControls.push(this.InitialProductForm());
              ProductControls.at(i).setValue(this.products[i]);
              ProductControls.at(i).get('other').enable();
            }
            for (let i = 0; i < ProductControls.length; i++) {
              if (ProductControls.at(i).get('productUnit').value === 'PU03') {
                ProductControls.at(i).get('other').enable();
              } else {
                ProductControls.at(i).get('other').disable();
              }
            }
            this.isDisabledProduct = ProductControls.length > 1 ? false : true;
          }
        }

        if (sessionStorage.getItem('isMilestoneForm') !== 'true') {
          if (this.milestones.length === 0) {
            this.AddMilestone();
          } else {
            const MilestoneControls = this.milestoneForm.get('milestones') as FormArray;
            for (let i = 0; i < this.milestones.length; i++) {
              MilestoneControls.push(this.InitialMilestoneForm());
              MilestoneControls.at(i).setValue(response.milestones[i]);
            }
            for (let i = 0; i < MilestoneControls.length; i++) {
              const fromResponse = this.dateUtil.GetDate(new Date(this.milestones[i].fromDate));
              const toResponse = this.dateUtil.GetDate(new Date(this.milestones[i].toDate));
              MilestoneControls.at(i).get('fromDate').patchValue(fromResponse);
              MilestoneControls.at(i).get('toDate').patchValue(toResponse);
            }
            this.isDisabledMilestone = MilestoneControls.length > 1 ? false : true;
          }
        }

        if (sessionStorage.getItem('isFinancialForm') !== 'true') {
          if (this.financialIndicators.length === 0) {
            this.AddFinancial();
          } else {
            const FinancialControls = this.financialForm.get('financials') as FormArray;
            for (let i = 0; i < this.financialIndicators.length; i++) {
              FinancialControls.push(this.InitialFinancialForm());
              FinancialControls.at(i).setValue(response.financialIndicators[i]);
            }
            this.financialLength = FinancialControls.length;
          }
          if (this.financials) { this.financialAvgForm.setValue(response.financials); }
        }
      }
      this.SetValidateTotal();
    });
  }

  GetPresident() {
    this.detailService.GetPositionLevel30().subscribe(systemName => this.presidentList = systemName);
  }

  GetManager() {
    this.detailService.GetPositionLevel40().subscribe(systemName => this.managerList = systemName);
  }

  InitialProductForm(): FormGroup {
    return this.fb.group({
      id: [0],
      name: ['', Validators.required],
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
      actionBy: null,
      fromDate: new Date(),
      toDate: new Date(),
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
    this.isDisabledProduct = control.length > 1 ? false : true;
  }

  RemoveProduct(index: number) {
    const control = this.productForm.get('products') as FormArray;
    control.removeAt(index);
    this.productForm.markAsDirty();
    this.isDisabledProduct = control.length > 1 ? false : true;
  }

  AddMilestone() {
    const control = this.milestoneForm.get('milestones') as FormArray;
    control.push(this.InitialMilestoneForm());
    this.isDisabledMilestone = control.length > 1 ? false : true;
  }

  RemoveMilestone(index: number) {
    const control = this.milestoneForm.get('milestones') as FormArray;
    control.removeAt(index);
    this.milestoneForm.markAsDirty();
    this.isDisabledMilestone = control.length > 1 ? false : true;
  }

  AddFinancial() {
    const control  = this.financialForm.get('financials') as FormArray;
    this.financial = control.length >= 10 ? 5 : 10;
    for (let i = 1; i <= this.financial; i++) {
      if (control.length < 20) { control.push(this.InitialFinancialForm()); }
    }
    const year = this.year;
    for (let i = 0; i < control.length; i++) {
      if (i < 20) { control.at(i).get('year').patchValue(year + i); }
    }
    this.financialLength = control.length;
    this.isRemoveFinancial = control.length === 1 ? true : false;
    this.isAddFinancial = control.length === 20 ? true : false;
  }

  RemoveFinancial(index) {
    const control = this.financialForm.get('financials') as FormArray;
    control.removeAt(index);
    this.financialLength = control.length;
    this.isRemoveFinancial = control.length > 1 ? false : true;
    this.isAddFinancial = control.length === 20 ? true : false;
    this.RevenueChange();
    this.EbitdaChange();
    this.CapexChange();
    this.OpexChange();
    this.ValuationChange();
    this.financialForm.markAsDirty();
  }

  OnChangeStrategic(event) {
    this.initiativesDetailForm.controls.strategyDetail.enable();
    this.initiativesDetailForm.controls.strategyDetail.setValidators([Validators.required]);
    this.initiativesDetailForm.controls.strategyDetail.updateValueAndValidity();
    const strategicObjectiveId = event.target.value;
    this.detailService.GetStrategies(strategicObjectiveId).subscribe(strategies => this.strategies = strategies);
  }

  OnChangeUnit(i) {
    const control = this.productForm.get('products') as FormArray;
    if (control.at(i).get('productUnit').value === 'PU03') {
      control.at(i).get('other').enable();
    } else {
      control.at(i).get('other').patchValue('');
      control.at(i).get('other').disable();
    }
  }

  RequireBOD1(event) {
    if (event.target.checked) {
      this.ShowBOD = true;
      this.initiativesDetailForm.controls.bod1.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.bod1.updateValueAndValidity();
    } else {
      this.ShowBOD = false;
      this.bsBOD2.minDate = new Date(this.startDate);
      this.initiativesDetailForm.controls.bod1.clearValidators();
      this.initiativesDetailForm.controls.bod1.updateValueAndValidity();
    }
  }

  RequireProject() {
    if (this.initiativesDetailForm.controls.requireProject.value === false) {
      this.ShowProject = true;
      this.initiativesDetailForm.controls.projectDirector.enable();
      this.initiativesDetailForm.controls.projectManager.enable();
      this.initiativesDetailForm.controls.projectEngineer.enable();
      this.initiativesDetailForm.controls.ProcessEngineer.enable();
      this.initiativesDetailForm.controls.mgrOfProcessEngineer.enable();
      this.initiativesDetailForm.controls.projectManager.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.projectManager.updateValueAndValidity();
      this.initiativesDetailForm.controls.projectEngineer.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.projectEngineer.updateValueAndValidity();
    } else {
      this.ShowProject = false;
      this.initiativesDetailForm.controls.projectDirector.disable();
      this.initiativesDetailForm.controls.projectManager.disable();
      this.initiativesDetailForm.controls.projectEngineer.disable();
      this.initiativesDetailForm.controls.ProcessEngineer.disable();
      this.initiativesDetailForm.controls.mgrOfProcessEngineer.disable();
      this.initiativesDetailForm.controls.projectManager.clearValidators();
      this.initiativesDetailForm.controls.projectManager.updateValueAndValidity();
      this.initiativesDetailForm.controls.projectEngineer.clearValidators();
      this.initiativesDetailForm.controls.projectEngineer.updateValueAndValidity();
    }
  }

  OnChangeEntryMode() {
    if (this.initiativesDetailForm.controls.entryMode.value === 'E009') {
      this.showSpecify = true;
      this.initiativesDetailForm.controls.specify.enable();
      this.initiativesDetailForm.controls.specify.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.specify.updateValueAndValidity();
    } else {
      this.showSpecify = false;
      this.initiativesDetailForm.controls.specify.disable();
      this.initiativesDetailForm.patchValue({ specify: null});
      this.initiativesDetailForm.controls.specify.clearValidators();
      this.initiativesDetailForm.controls.specify.updateValueAndValidity();
    }
  }

  OnChangeGeography() {
    if (this.initiativesDetailForm.controls.geography.value === 'other') {
      this.showGeography = true;
      this.initiativesDetailForm.controls.geographySpecify.enable();
      this.initiativesDetailForm.controls.geographySpecify.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.geographySpecify.updateValueAndValidity();
    } else {
      this.showGeography = false;
      this.initiativesDetailForm.controls.geographySpecify.disable();
      this.initiativesDetailForm.patchValue({ geographySpecify: null});
      this.initiativesDetailForm.controls.geographySpecify.clearValidators();
      this.initiativesDetailForm.controls.geographySpecify.updateValueAndValidity();
    }
  }

  OnChangeEntity() {
    if (this.initiativesDetailForm.controls.entity.value === 'other') {
      this.showEntity = true;
      this.initiativesDetailForm.controls.entitySpecify.enable();
      this.initiativesDetailForm.controls.entitySpecify.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.entitySpecify.updateValueAndValidity();
    } else {
      this.showEntity = false;
      this.initiativesDetailForm.controls.entitySpecify.disable();
      this.initiativesDetailForm.patchValue({ entitySpecify: null});
      this.initiativesDetailForm.controls.entitySpecify.clearValidators();
      this.initiativesDetailForm.controls.entitySpecify.updateValueAndValidity();
    }
  }

  ChangeYear(value) {
    const controls = this.financialForm.get('financials') as FormArray;
    this.year = value.getFullYear();
    for (let i = 0; i < controls.length; i++) { controls.at(i).get('year').patchValue(this.year + i); }
    this.setYear = this.dateUtil.SetYear(new Date(value));
  }

  ChangeBOD1(value: Date): void {
    const time = new Date(value).getTime();
    if (time > 0) {
      this.BOD1Date = this.dateUtil.SetDate(new Date(value));
      this.bsBOD2.minDate = new Date(value);
      this.initiativesDetailForm.patchValue({ bod2: null });
    }
  }

  OnShowBOD1() {
    this.initiativesDetailForm.controls.bod1.clearValidators();
    this.initiativesDetailForm.controls.bod1.updateValueAndValidity();
  }

  OnHiddenBOD1() {
    if (!this.initiativesDetailForm.controls.bod1.value) {
      this.initiativesDetailForm.controls.bod1.setValidators([Validators.required]);
      this.initiativesDetailForm.controls.bod1.updateValueAndValidity();
    }
  }

  ChangeBOD2(value: Date): void {
    this.BOD2Date = this.dateUtil.SetDate(new Date(value));
  }

  OnChangeShareOfInvestment() {
    const shareOfInvestment = this.initiativesDetailForm.controls.shareOfInvestment.value;
    if (shareOfInvestment > 1000) {
      this.initiativesDetailForm.patchValue({ shareOfInvestment: 1000 });
    }
  }

  RevenueChange() {
    this.CalculateFinancial('revenue');
  }

  EbitdaChange() {
    this.CalculateFinancial('ebitda');
  }

  CapexChange() {
    this.CalculateFinancial('capex');
  }

  OpexChange() {
    this.CalculateFinancial('opex');
  }

  ValuationChange() {
    this.CalculateFinancial('valuation');
  }

  CalculateFinancial(type) {
    const controls = this.financialForm.get('financials') as FormArray;
    const value = [];
    let table = 0;
    for (let i = 0; i < controls.length; i++) {
      if (controls.at(i).get(type).value !== null) { value.push(controls.at(i).get(type).value); table += 1; }
    }
    const sum = value.reduce((a, b) => a + b, 0);
    const result = (sum / table);
    switch (type) {
      case 'revenue': this.financialAvgForm.patchValue({ avgRevenue: isNaN(result) ? 0 : result }); break;
      case 'ebitda': this.financialAvgForm.patchValue({ avgEbitda: isNaN(result) ? 0 : result }); break;
      case 'capex': this.financialAvgForm.patchValue({ totalCapex: isNaN(sum) ? 0 : sum }); break;
      case 'opex': this.financialAvgForm.patchValue({ totalOpex: isNaN(sum) ? 0 : sum }); break;
      case 'valuation': this.financialAvgForm.patchValue({ totalValuation: isNaN(sum) ? 0 : sum }); break;
    }
  }

  ChangeHaveProduct(event) {
    this.isHaveProduct = event.target.value;
    if (this.isHaveProduct === 'true') {
      this.ValidateProduct = false;
      (this.productForm.get('products') as FormArray).controls.forEach(item => item.enable());
      const control = this.productForm.get('products') as FormArray;
      for (let i = 0; i < control.length; i++) {
        control.at(i).get('other').disable();
      }
    } else {
      this.ValidateProduct = true;
      (this.productForm.get('products') as FormArray).controls.forEach(item => item.disable());
    }
  }

  CheckProductValid() {
    if (this.isHaveProduct === 'true') {
      this.productForm.controls.products.markAsTouched();
      const control = this.productForm.get('products') as FormArray;
      for (let i = 0; i < control.length; i++) {
        this.ValidateProduct = control.at(i).get('name').value ? true : false;
      }
    } else {
      this.ValidateProduct = true;
    }
  }

  SetMarkAsTouchedDetail() {
    this.initiativesDetailForm.controls.strategicObjective.markAsTouched();
    this.initiativesDetailForm.controls.strategyDetail.markAsTouched();
    this.initiativesDetailForm.controls.specify.markAsTouched();
    this.initiativesDetailForm.controls.shareOfInvestment.markAsTouched();
    this.initiativesDetailForm.controls.baseCase.markAsTouched();
    this.initiativesDetailForm.controls.projectIrrBaseCase.markAsTouched();
    this.initiativesDetailForm.controls.npvBaseCase.markAsTouched();
    this.initiativesDetailForm.controls.paybackBaseCase.markAsTouched();
    this.initiativesDetailForm.controls.ebitdaBaseCase.markAsTouched();
    if (this.ShowBOD) { this.initiativesDetailForm.controls.bod1.markAsTouched(); }
    if (this.isHaveProduct === 'true') {
      this.productForm.controls.products.markAsTouched();
      const control = this.productForm.get('products') as FormArray;
      for (let i = 0; i < control.length; i++) { control.at(i).get('name').markAsTouched(); }
    }
  }

  PatchForm() {
    this.initiativesDetailForm.patchValue({
      id: this.Detail ? this.Detail : 0,
      bod1: this.BOD1Date ? this.BOD1Date : null,
      bod2: this.BOD2Date ? this.BOD2Date : null,
      haveProduct: this.initiativesHaveProduct.controls.haveProduct.value,
      irr: this.financialIndicatorForm.controls.irr.value,
      npv: this.financialIndicatorForm.controls.npv.value,
      fx: this.financialIndicatorForm.controls.fx.value,
      fxChoice: this.financialIndicatorForm.controls.fxChoice.value,
      firstBudgetYear: this.setYear,
      note: this.noteForm.controls.note.value
    });
  }

  SetMilestoneForm() {
    const MilestoneControl = this.milestoneForm.get('milestones') as FormArray;
    for (let i = 0; i < MilestoneControl.length; i++) {
      if (MilestoneControl.at(i).get('id').value === 0) {
        const from = this.dateUtil.SetDate(new Date(MilestoneControl.at(i).get('fromDate').value));
        const to = this.dateUtil.SetDate(new Date(MilestoneControl.at(i).get('toDate').value));
        MilestoneControl.at(i).get('fromDate').patchValue(from);
        MilestoneControl.at(i).get('toDate').patchValue(to);
      } else {
        MilestoneControl.at(i).get('id').patchValue(0);
        const fromDate = MilestoneControl.at(i).get('fromDate').value;
        const toDate = MilestoneControl.at(i).get('toDate').value;
        if (fromDate.length) {
          const DateFromArray = fromDate.split('/');
          const DateFrom = DateFromArray[2] + '-' + DateFromArray[1] + '-' + DateFromArray[0];
          MilestoneControl.at(i).get('fromDate').patchValue(DateFrom);
        } else {
          const from = this.dateUtil.SetDate(new Date(MilestoneControl.at(i).get('fromDate').value));
          MilestoneControl.at(i).get('fromDate').patchValue(from);
        }
        if (toDate.length) {
          const DateToArray = toDate.split('/');
          const DateTo = DateToArray[2] + '-' + DateToArray[1] + '-' + DateToArray[0];
          MilestoneControl.at(i).get('toDate').patchValue(DateTo);
        } else {
          const to = this.dateUtil.SetDate(new Date(MilestoneControl.at(i).get('toDate').value));
          MilestoneControl.at(i).get('toDate').patchValue(to);
        }
      }
    }
  }

  SetForm(response) {
    this.Detail      = response.id;
    this.BOD1Date    = this.dateUtil.SetDate(new Date(response.boD1));
    this.BOD2Date    = this.dateUtil.SetDate(new Date(response.boD2));
    this.BOD1Display = this.dateUtil.GetDate(new Date(response.boD1));
    this.BOD2Display = this.dateUtil.GetDate(new Date(response.boD2));
    this.initiativesDetailForm.patchValue({ bod1: this.BOD1Display, bod2: this.BOD2Display });
  }

  SaveDetail(status) {
    this.noteForm.patchValue({ note: this.noteForm.controls.note.value });
    if (this.isHaveProduct === 'true') {
      if (this.productForm.valid) {
        const ProductControl = this.productForm.get('products') as FormArray;
        for (let i = 0; i < ProductControl.length; i++) { ProductControl.at(i).get('id').patchValue(0); }
        this.detailService.CreateInitiativeProduct(this.id, this.productForm.value).subscribe(() => { });
      } else {
        if (status === 'submit') {
          this.swalTool.RequiredProduct();
          return false;
        }
      }
    }
    if (this.milestoneForm.valid) {
      this.SetMilestoneForm();
      const MilestoneControl = this.milestoneForm.get('milestones') as FormArray;
      this.detailService.CreateInitiativeMilestone(this.id, this.milestoneForm.value).subscribe((result) => {
        for (let i = 0; i < MilestoneControl.length; i++) {
          const fromResult = this.dateUtil.GetDate(new Date(result.milestones[i].fromDate));
          const toResponse = this.dateUtil.GetDate(new Date(result.milestones[i].toDate));
          MilestoneControl.at(i).get('fromDate').patchValue(fromResult);
          MilestoneControl.at(i).get('toDate').patchValue(toResponse);
          MilestoneControl.at(i).get('id').patchValue(result.milestones[i].id);
        }
      });
    }
    if (this.financialAvgForm.valid) {
      const FinancialControl = this.financialForm.get('financials') as FormArray;
      for (let i = 0; i < FinancialControl.length; i++) { FinancialControl.at(i).get('id').patchValue(0); }
      this.financialAvgForm.patchValue({ id: 0, initiativeId: this.id });
      this.detailService.CreateInitiativeFinancialIndicator(this.id, this.financialForm.value).subscribe(() => { });
      this.detailService.CreateInitiativeFinancial(this.id, this.financialAvgForm.value).subscribe(() => { });
    }
  }

  SaveDraft() {
    this.PatchForm();
    this.Detail ?
    this.detailService.UpdateInitiativeDetail(this.id, this.initiativesDetailForm.value).subscribe((response) => this.SetForm(response)) :
    this.detailService.CreateInitiativeDetail(this.id, this.initiativesDetailForm.value).subscribe((response) => this.SetForm(response));
    this.SaveDetail('draft');
  }

  SaveSubmit() {
    this.CheckProductValid();
    this.SetMarkAsTouchedDetail();
    this.SetMarkAsTouchedTotal();
    if (this.invalidSubmit) {
      this.PatchForm();
      this.Detail ?
        this.detailService.UpdateInitiativeDetail(this.id, this.initiativesDetailForm.value).subscribe(() => { }) :
        this.detailService.CreateInitiativeDetail(this.id, this.initiativesDetailForm.value).subscribe((result) => this.Detail = result.id);
      this.SaveDetail('submit');
    } else {
      this.swalTool.Required();
    }
  }

  Draft(page) {
    if (page === 'detail') { this.SaveDraft(); }
  }

  Submit(page) {
    if (page === 'detail') { this.SaveSubmit(); }
  }
}
