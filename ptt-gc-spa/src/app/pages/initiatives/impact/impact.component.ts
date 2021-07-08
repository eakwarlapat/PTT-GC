import { InitiativeService } from '@services/initiative/initiative.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { ImpactService } from '@services/impact/impact.service';
import { MaxService } from '@services/max/max.service';
import { SwalTool } from '@tools/swal.tools';
import { DateUtil } from '@utils/date.utils';
import { ResponseService } from '@errors/response/response.service';
import { PermissionService } from '@services/permission/permission.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-impact',
  templateUrl: './impact.component.html',
  styleUrls: ['./impact.component.css']
})
export class ImpactComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private response: ResponseService,
    private swalTool: SwalTool,
    private initiativeService: InitiativeService,
    private impactService: ImpactService,
    private maxService: MaxService,
    private dateUtil: DateUtil,
    public permissionService: PermissionService,
  ) { }

  // permissionCheck: any;
  // isDisabled: any = [];
  // isHidden: any = [];

  id: number;
  page = 'impact';
  name = 'Initiative Impact Tracking';

  Cim: boolean;
  Capex: boolean;
  Strategy: boolean;
  Max: boolean;

  suggestion = { cim: false, strategy: false, max: false };

  status: string;
  remark: string;
  stage: string;

  isHaveShareBenefit  = 'false';
  isHaveImpiemantCost = 'false';
  isIndirectBenefit   = 'false';

  showSection = true;

  recurringAndOneTime: any = [];
  implementationCost: any = [];

  initiativeDetails: any;
  subWorkstreams: any;
  workStreams: any = [];
  entryModes: any = [];

  minMode: BsDatepickerViewMode = 'month';

  bsConfig: Partial<BsDatepickerConfig>;

  isAutoCalculate = true;

  itemsMonth: any = [];
  monthName: string;
  month: number;
  year: number;
  months = ['MONTH', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  monthObjectAuto = {
    month1: null,
    month2: null,
    month3: null,
    month4: null,
    month5: null,
    month6: null,
    month7: null,
    month8: null,
    month9: null,
    month10: null,
    month11: null,
    month12: null,
    month13: null,
    month14: null,
    month15: null,
    month16: null,
    month17: null,
    month18: null,
    month19: null,
    month20: null,
    month21: null,
    month22: null,
    month23: null,
    month24: null,
    month25: null,
    month26: null,
    month27: null,
    month28: null,
    month29: null,
    month30: null,
    month31: null,
    month32: null,
    month33: null,
    month34: null,
    month35: null,
    month36: null
  };

  monthObject = {
    month1: { value: null, disabled: true },
    month2: { value: null, disabled: true },
    month3: { value: null, disabled: true },
    month4: { value: null, disabled: true },
    month5: { value: null, disabled: true },
    month6: { value: null, disabled: true },
    month7: { value: null, disabled: true },
    month8: { value: null, disabled: true },
    month9: { value: null, disabled: true },
    month10: { value: null, disabled: true },
    month11: { value: null, disabled: true },
    month12: { value: null, disabled: true },
    month13: { value: null, disabled: true },
    month14: { value: null, disabled: true },
    month15: { value: null, disabled: true },
    month16: { value: null, disabled: true },
    month17: { value: null, disabled: true },
    month18: { value: null, disabled: true },
    month19: { value: null, disabled: true },
    month20: { value: null, disabled: true },
    month21: { value: null, disabled: true },
    month22: { value: null, disabled: true },
    month23: { value: null, disabled: true },
    month24: { value: null, disabled: true },
    month25: { value: null, disabled: true },
    month26: { value: null, disabled: true },
    month27: { value: null, disabled: true },
    month28: { value: null, disabled: true },
    month29: { value: null, disabled: true },
    month30: { value: null, disabled: true },
    month31: { value: null, disabled: true },
    month32: { value: null, disabled: true },
    month33: { value: null, disabled: true },
    month34: { value: null, disabled: true },
    month35: { value: null, disabled: true },
    month36: { value: null, disabled: true }
  };

  monthObjectArray = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthObjectSumRow = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthObjectArrayRow1 = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthObjectArrayRow2 = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthObjectArrayRow3 = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthObjectSumRow1 = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthObjectSumRow2 = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthObjectSumRow3 = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthBenefitArrayRow1 = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthBenefitArrayRow2 = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
    month13: [],
    month14: [],
    month15: [],
    month16: [],
    month17: [],
    month18: [],
    month19: [],
    month20: [],
    month21: [],
    month22: [],
    month23: [],
    month24: [],
    month25: [],
    month26: [],
    month27: [],
    month28: [],
    month29: [],
    month30: [],
    month31: [],
    month32: [],
    month33: [],
    month34: [],
    month35: [],
    month36: []
  };

  monthBenefitSumRow1 = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthBenefitSumRow2 = {
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    month13: 0,
    month14: 0,
    month15: 0,
    month16: 0,
    month17: 0,
    month18: 0,
    month19: 0,
    month20: 0,
    month21: 0,
    month22: 0,
    month23: 0,
    month24: 0,
    month25: 0,
    month26: 0,
    month27: 0,
    month28: 0,
    month29: 0,
    month30: 0,
    month31: 0,
    month32: 0,
    month33: 0,
    month34: 0,
    month35: 0,
    month36: 0
  };

  monthArray = Object.keys(this.monthObject);

  financialImpactArea = this.fb.group({ financialImpactArea: '' });

  HaveShareBenefit = this.fb.group({ haveShareBenefit: 'false' });

  ShareBenefitFrom = this.fb.group({ shareBenefitWorkstreams: this.fb.array([]) });

  iLForm = this.fb.group({
    iL4RunRateRecurring: null,
    iL5RunRateRecurring: null,
    iL4RunRateOnetime: null,
    iL5RunRateOnetime: null,
    iL5FixedFxRecurring: null,
    iL5FloatFxRecurring: null,
    iL5FixedFxOnetime: null,
    iL5FloatFxOnetime: null
  });

  monthForm = this.fb.group({ firstRunRateMonth: [(new Date())] });

  CalculateForm = this.fb.group({ calculate: true });

  FirstRunRateForm = this.fb.group({ firstRunRateTable: this.fb.array([]) });

  FirstRunRateTotalForm = this.fb.group({
    id: [0],
    typeOfBenefit: null,
    versionPrice: this.fb.group({
      row1: 'Target',
      row2: 'Revise',
      row3: 'Actual',
    }),
    runRate: this.fb.group({
      row1: null,
      row2: null,
      row3: null,
    }),
    monthRows1: this.fb.group(this.monthObjectAuto),
    monthRows2: this.fb.group(this.monthObjectAuto),
    monthRows3: this.fb.group(this.monthObjectAuto)
  });

  IndirectBenefit = this.fb.group({ indirectBenefit: 'false' });

  IndirectForm = this.fb.group({ indirectTable: this.fb.array([]) });

  explanationForm = this.fb.group({ explanation: '' });

  HaveImpiemantCost = this.fb.group({ haveImpiemantCost: 'false' });

  ImpiemantCostForm = this.fb.group({
    id: [0],
    versionPrice: this.fb.group({
      row1: 'Estimate cost',
      row2: 'Actual',
    }),
    runRate: this.fb.group({
      row1: null,
      row2: null,
    }),
    monthRows1: this.fb.group(this.monthObject),
    monthRows2: this.fb.group(this.monthObject)
  });

  TypeBenefitForm = this.fb.group({ typeBenefitTable: this.fb.array([]) });

  TypeBenefitTotalForm = this.fb.group({
    id: [0],
    typeOfBenefit: null,
    versionPrice: this.fb.group({
      row1: 'Target',
      row2: 'Actual',
    }),
    runRate: this.fb.group({
      row1: null,
      row2: null,
    }),
    monthRows1: this.fb.group(this.monthObjectAuto),
    monthRows2: this.fb.group(this.monthObjectAuto)
  });

  toCommentForm = this.fb.group({ toComment: '' });

  remarkForm = this.fb.group({
    remark1: '',
    remark2: '',
    remark3: '',
    remark4: '',
    remark5: ''
  });

  submitToForm = this.fb.group({ submitTo: 'forward' });

  Impact: number;

  ImpactForm = this.fb.group({
    id: 0,
    financialImpactArea: '',
    haveShareBenefit: '',
    iL4RunRateRecurring: '',
    iL5RunRateRecurring: '',
    iL4RunRateOnetime: '',
    iL5RunRateOnetime: '',
    iL5FixedFxRecurring: '',
    iL5FloatFxRecurring: '',
    iL5FixedFxOnetime: '',
    iL5FloatFxOnetime: '',
    firstRunRateMonth: '',
    autoCalculate: '',
    indirectBenefit: '',
    explanation: '',
    impiemantCost: '',
    toComment: '',
    remark1: '',
    remark2: '',
    remark3: '',
    remark4: '',
    remark5: '',
    totalRecurring: 0,
    totalOnetime: 0,
    totalCostOPEX: 0,
    sIL4Achievement: null,
    sIL5Achievement: null,
    initiativeId: ''
  });

  setMonth: string;

  isRemoveFirstRunRate = true;
  isRemoveShareBenefit = true;
  isRemoveIndirect = true;

  monthRowTableLength: number;

  groupBenefit: any = [];
  titleBenefit: any = [];

  titleIndirect: any = [];

  FirstRunRateList: any = [];
  FirstRunRateTypeOfBenefit: any = [];
  FirstRunRateLength: number;
  FirstRunRateStart: number;

  IndirectList: any = [];
  IndirectSelect: any = [];
  IndirectStart: number;
  IndirectLength: number;

  ImpiemantCostList: any = [];

  TypeOfBenefitList: any = [];
  TypeOfBenefitSelect: any = [];
  TypeOfBenefitStart: number;
  TypeOfBenefitLength: number;

  ImpiemantCostTooltip: string;

  recurringAndOneTimeArray: any = [];
  recurring: any = [];
  onetime: any = [];

  isCheckRecurring: any = [];
  isCheckOneTime: any = [];

  recurringAndOneTimeIndirect: any = [];
  recurringIndirect: any = [];
  onetimeIndirect: any = [];

  isIndirectRecurring: any = [];
  isIndirectOneTime: any = [];

  shareBenefitWorkstreams: any = [];

  isMax: any = false;
  subWorkstream1: string;
  detailInformations: any = {};

  isShowTable = false;
  isOpenCopy = true;

  startRunRate: number;
  startBenefit: number;

  iL4RunRateRecurringSum: number;
  iL5RunRateRecurringSum: number;
  iL4RunRateOnetimeSum: number;
  iL5RunRateOnetimeSum: number;

  requestOpex: string;
  costEstOpex: number;

  TypeOfBenefit = false;

  SIL4Achievement: string;
  SIL5Achievement: string;

  IsFirstRunRate: boolean;

  get StageIL1() {
    return this.stage === 'IL1';
  }

  get invalidFinancialImpactArea() {
    return this.financialImpactArea.controls.financialImpactArea.touched && this.financialImpactArea.controls.financialImpactArea.invalid;
  }

  get invalidSubmit() {
    switch (this.stage) {
      case 'IL1' :
      case 'IL3' :
      case 'IL4' :
      return this.financialImpactArea.valid && this.FirstRunRateForm.valid && !this.TypeOfBenefit;
      default: return true;
    }
  }

  ngOnInit() {
    this.permissionService.CheckSection(this.page, sessionStorage.getItem('id').toString());
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('page', 'impact');
    this.GetRecurringAndOnetime();
    this.impactService.GetImplementationCostSelect().subscribe(implementationCost => this.implementationCost = implementationCost);
    this.impactService.GetWorkStream().subscribe(workStreams => this.workStreams = workStreams);
    this.maxService.GetSubWorkstreamAll().subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
    this.bsConfig = Object.assign({}, { minMode: this.minMode, isAnimated: true, dateInputFormat: 'MMM YYYY' });
    this.GetSuggestStatus(this.id);
    this.SetGeneral();
    this.GetImpactTracking(this.id);
    this.GetInitiativeDetail(this.id);
    this.GetShareBenefitWorkstream(this.id);
    this.IsImpact();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') {
      sessionStorage.setItem('InitiativeValidate', 'true');
      sessionStorage.setItem('InitiativeActive'  , 'true');
    }
  }

  CheckValidate() {
    if (sessionStorage.getItem('ImpactValidate') === 'false') {
      this.SetMarkAsTouchedForm();
    }
  }

  InvalidTypeOfBenefit(i) {
    const control = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return control.at(i).get('typeOfBenefit').touched && control.at(i).get('typeOfBenefit').invalid;
  }

  InvalidRunRate(i) {
    const control = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return control.at(i).get('runRate').get('row1').touched && control.at(i).get('runRate').get('row1').invalid;
  }

  InvalidRevise(i) {
    const control = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return control.at(i).get('runRate').get('row2').touched && control.at(i).get('runRate').get('row2').invalid;
  }

  InvalidActual(i) {
    const control = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return control.at(i).get('runRate').get('row3').touched && control.at(i).get('runRate').get('row3').invalid;
  }

  SetValidateForm() {
    if (this.stage === 'IL1') {
      this.financialImpactArea.controls.financialImpactArea.setValidators([Validators.required]);
      this.financialImpactArea.controls.financialImpactArea.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.CheckPercent();
    sessionStorage.setItem('ImpactValidate', JSON.stringify(this.invalidSubmit));
    sessionStorage.setItem('ImpactValidated', 'true');
    if (this.financialImpactArea.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isFinancialImpactArea', 'true');
      sessionStorage.setItem('FinancialImpactArea', JSON.stringify(this.financialImpactArea.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.HaveShareBenefit.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isHaveShareBenefit', 'true');
      sessionStorage.setItem('isShareBenefitFrom', 'true');
      sessionStorage.setItem('HaveShareBenefit', JSON.stringify(this.HaveShareBenefit.value));
      sessionStorage.setItem('ShareBenefitFrom', JSON.stringify(this.ShareBenefitFrom.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.ShareBenefitFrom.dirty) {
      sessionStorage.setItem('isShareBenefitFrom', 'true');
      sessionStorage.setItem('ShareBenefitFrom', JSON.stringify(this.ShareBenefitFrom.value));
    }
    if (this.iLForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isILForm', 'true');
      sessionStorage.setItem('ILForm', JSON.stringify(this.iLForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.monthForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isMonthForm', 'true');
      sessionStorage.setItem('MonthForm', JSON.stringify(this.monthForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.CalculateForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isCalculateForm', 'true');
      sessionStorage.setItem('CalculateForm', JSON.stringify(this.CalculateForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.FirstRunRateForm.dirty) {
      this.PatchForm();
      this.CalculateTotal();
      this.StageSave();
      this.SetNumberFirstRunRate();
      const result = parseFloat(this.ImpactForm.controls.totalRecurring.value) + parseFloat(this.ImpactForm.controls.totalOnetime.value);
      result.toFixed(3);
      sessionStorage.setItem('isFirstRunRateForm', 'true');
      sessionStorage.setItem('FirstRunRateForm', JSON.stringify(this.FirstRunRateForm.value));
      sessionStorage.setItem('FirstRunRateTotalForm', JSON.stringify(this.FirstRunRateTotalForm.value));
      sessionStorage.setItem('TotalRecurringOneTime', JSON.stringify(result));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.explanationForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isExplanationForm', 'true');
      sessionStorage.setItem('explanationForm', JSON.stringify(this.explanationForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.IndirectBenefit.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isIndirectBenefit', 'true');
      sessionStorage.setItem('IndirectBenefit', JSON.stringify(this.IndirectBenefit.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.IndirectForm.dirty) {
      sessionStorage.setItem('isIndirectForm', 'true');
      sessionStorage.setItem('IndirectForm', JSON.stringify(this.IndirectForm.value));
    }
    if (this.HaveImpiemantCost.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isHaveImpiemantCost', 'true');
      sessionStorage.setItem('HaveImpiemantCost', JSON.stringify(this.HaveImpiemantCost.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.ImpiemantCostForm.dirty) {
      sessionStorage.setItem('isImpiemantCostForm', 'true');
      sessionStorage.setItem('ImpiemantCostForm', JSON.stringify(this.ImpiemantCostForm.value));
    }
    if (this.TypeBenefitForm.dirty) {
      this.SetNumberTypeBenefit();
      sessionStorage.setItem('isTypeBenefitForm', 'true');
      sessionStorage.setItem('TypeBenefitForm', JSON.stringify(this.TypeBenefitForm.value));
      sessionStorage.setItem('TypeBenefitTotalForm', JSON.stringify(this.TypeBenefitTotalForm.value));
    }
    if (this.toCommentForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isToCommentForm', 'true');
      sessionStorage.setItem('toCommentForm', JSON.stringify(this.toCommentForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
    if (this.remarkForm.dirty) {
      this.PatchForm();
      sessionStorage.setItem('isRemarkForm', 'true');
      sessionStorage.setItem('remarkForm', JSON.stringify(this.remarkForm.value));
      sessionStorage.setItem('ImpactForm', JSON.stringify(this.ImpactForm.value));
    }
  }

  CheckPercent() {
    if (this.isHaveShareBenefit === 'true') {
      const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
      const arraySum = [];
      for (let i = 0; i < control.length; i++) {
        if (control.at(i).get('percent').value !== null) {
          arraySum.push(Number(control.at(i).get('percent').value));
        }
      }
      const sum = arraySum.reduce((a, b) => a + b, 0);
      if (sum < 100) {
        sessionStorage.setItem('PercentImpact', 'true');
      } else {
        sessionStorage.removeItem('PercentImpact');
      }
    } else {
      sessionStorage.removeItem('PercentImpact');
    }
  }

  IsImpact() {
    if (sessionStorage.getItem('isFinancialImpactArea') === 'true') {
      const FinancialImpactArea = JSON.parse(sessionStorage.getItem('FinancialImpactArea'));
      setTimeout(() => this.financialImpactArea.patchValue(FinancialImpactArea), 100);
    }
    if (sessionStorage.getItem('isHaveShareBenefit') === 'true') {
      const HaveShareBenefit = JSON.parse(sessionStorage.getItem('HaveShareBenefit'));
      setTimeout(() => {
        if (HaveShareBenefit.haveShareBenefit === 'true') {
          this.isHaveShareBenefit = 'true';
        } else {
          this.isHaveShareBenefit = 'false';
        }
        this.HaveShareBenefit.patchValue(HaveShareBenefit);
      }, 100);
    }
    if (sessionStorage.getItem('isShareBenefitFrom') === 'true') {
      const ShareBenefitFrom = JSON.parse(sessionStorage.getItem('ShareBenefitFrom'));
      setTimeout(() => {
        if (ShareBenefitFrom.shareBenefitWorkstreams.length !== 0) {
          const ShareBenefit = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
          for (let i = 0; i < ShareBenefitFrom.shareBenefitWorkstreams.length; i++) {
            ShareBenefit.push(this.InitialShareBenefitFrom());
            ShareBenefit.at(i).patchValue(ShareBenefitFrom.shareBenefitWorkstreams[i]);
            ShareBenefit.at(i).get('id').patchValue(0);
          }
          this.isRemoveShareBenefit = ShareBenefit.length > 1 ? false : true;
        }
      }, 100);
    }
    if (sessionStorage.getItem('isILForm') === 'true') {
      const iLForm = JSON.parse(sessionStorage.getItem('ILForm'));
      setTimeout(() => this.iLForm.patchValue(iLForm), 100);
    }
    if (sessionStorage.getItem('isMonthForm') === 'true') {
      const MonthForm = JSON.parse(sessionStorage.getItem('MonthForm'));
      setTimeout(() => {
        this.monthForm.patchValue({ firstRunRateMonth: new Date(MonthForm.firstRunRateMonth) });
        this.ChangeMonth(MonthForm.firstRunRateMonth);
      }, 100);
    }
    if (sessionStorage.getItem('isCalculateForm') === 'true') {
      const CalculateForm = JSON.parse(sessionStorage.getItem('CalculateForm'));
      setTimeout(() => {
        if (CalculateForm.autoCalculate) {
          this.CalculateForm.patchValue({ calculate: true });
          this.isAutoCalculate = true;
        } else {
          this.CalculateForm.patchValue({ calculate: false });
          this.isAutoCalculate = false;
        }
      }, 100);
    }
    if (sessionStorage.getItem('isFirstRunRateForm') === 'true') {
      const FirstRunRateForm = JSON.parse(sessionStorage.getItem('FirstRunRateForm'));
      const FirstRunRateTotalForm = JSON.parse(sessionStorage.getItem('FirstRunRateTotalForm'));
      setTimeout(() => {
        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
        if (FirstRunRateForm.firstRunRateTable.length !== 0) {
          this.isOpenCopy = false;
          for (let i = 0; i < (FirstRunRateForm.firstRunRateTable.length); i++) {
            const typeOfBenefit = this.recurringAndOneTime.filter(
              obj => obj.typeOfBenefitCode === FirstRunRateForm.firstRunRateTable[i].typeOfBenefit
            );
            if (typeOfBenefit.length !== 0) {
              this.groupBenefit.push(typeOfBenefit[0].typeOfBenefitGroup);
              this.titleBenefit.push(typeOfBenefit[0].typeOfBenefitTitle);
              FirstRunRate.push(this.InitialFirstRunRate());
              TypeBenefit.push(this.InitialTypeBenefit());
              FirstRunRate.at(i).patchValue({ typeOfBenefit: FirstRunRateForm.firstRunRateTable[i].typeOfBenefit });
              TypeBenefit.at(i).patchValue({ typeOfBenefit: FirstRunRateForm.firstRunRateTable[i].typeOfBenefit });
              FirstRunRate.at(i).enable();
              TypeBenefit.at(i).enable();
              switch (typeOfBenefit[0].typeOfBenefitGroup) {
                case 'Recurring':
                  this.isCheckRecurring.push(true);
                  this.isCheckOneTime.push(false);
                  this.recurring = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
                  this.recurringAndOneTimeArray.push(this.recurring);
                  break;
                case 'One time':
                  this.isCheckRecurring.push(false);
                  this.isCheckOneTime.push(true);
                  this.onetime = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
                  this.recurringAndOneTimeArray.push(this.onetime);
                  break;
              }
              ['row1', 'row2', 'row3'].forEach(row => {
                if (FirstRunRateForm.firstRunRateTable[i].runRate[row] === 0) {
                  FirstRunRate.at(i).get('runRate').patchValue({ [row]: 0 });
                } else {
                  FirstRunRate.at(i).get('runRate').patchValue({
                    [row]: FirstRunRateForm.firstRunRateTable[i].runRate[row] ? FirstRunRateForm.firstRunRateTable[i].runRate[row] : null
                  });
                }
              });
              ['monthRows1', 'monthRows2', 'monthRows3'].forEach(row => {
                Object.keys(this.monthObject).forEach(name => {
                  if (FirstRunRateForm.firstRunRateTable[i][row][name] === 0) {
                    FirstRunRate.at(i).get(row).patchValue({ [name]: 0 });
                  } else {
                    FirstRunRate.at(i).get(row).patchValue({
                      [name]: FirstRunRateForm.firstRunRateTable[i][row][name] ? FirstRunRateForm.firstRunRateTable[i][row][name] : null
                    });
                  }
                });
              });
            }
          }
        }

        this.monthRowTableLength = FirstRunRateForm.firstRunRateTable.length;
        this.isRemoveFirstRunRate = FirstRunRateForm.firstRunRateTable.length > 1 ? false : true;

        if (this.monthRowTableLength > 1) {
          if (FirstRunRateTotalForm) {
            ['row1', 'row2', 'row3'].forEach(row => {
              this.FirstRunRateTotalForm.get('runRate').patchValue({ [row]: FirstRunRateTotalForm.runRate[row] });
            });
            ['monthRows1', 'monthRows2', 'monthRows3'].forEach(row => {
              Object.keys(this.monthObject).forEach(name => {
                this.FirstRunRateTotalForm.get(row).patchValue({
                  [name]: FirstRunRateTotalForm[row][name] ? FirstRunRateTotalForm[row][name] : null
                });
              });
            });
          }
        }

        const iL4RunRateRecurring = [];
        let iL4RunRateRecurringSum = 0;
        const iL5RunRateRecurring = [];
        let iL5RunRateRecurringSum = 0;
        const iL4RunRateOnetime = [];
        let iL4RunRateOnetimeSum = 0;
        const iL5RunRateOnetime = [];
        let iL5RunRateOnetimeSum = 0;

        // this.CalculateTotal();

        for (let i = 0; i < FirstRunRate.length; i++) {
          const typeOfBenefit = this.recurringAndOneTime.filter(
            obj => obj.typeOfBenefitCode === FirstRunRate.at(i).get('typeOfBenefit').value
          );
          if (typeOfBenefit.length !== 0) {
            switch (typeOfBenefit[0].typeOfBenefitGroup) {
              case 'Recurring':
                iL4RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row2));
                iL5RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row3));
                break;
              case 'One time':
                iL4RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row2 * 0.1));
                iL5RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row3 * 0.1));
                break;
            }
          }
          this.StageCheck(i);
          const stage45 = ['IL4', 'SIL4', 'IL5', 'SIL5'];
          if (!(stage45.indexOf(this.stage) !== -1)) {
            FirstRunRate.at(i).get('typeOfBenefit').enable();
          } else {
            FirstRunRate.at(i).get('typeOfBenefit').disable();
          }
        }

        iL4RunRateRecurringSum = iL4RunRateRecurring.reduce((a, b) => a + b, 0);
        iL5RunRateRecurringSum = iL5RunRateRecurring.reduce((a, b) => a + b, 0);
        iL4RunRateOnetimeSum   = iL4RunRateOnetime.reduce((a, b) => a + b, 0);
        iL5RunRateOnetimeSum   = iL5RunRateOnetime.reduce((a, b) => a + b, 0);

        this.iL4RunRateRecurringSum = iL4RunRateRecurringSum;
        this.iL4RunRateOnetimeSum   = iL4RunRateOnetimeSum;

        this.iL5RunRateRecurringSum = iL5RunRateRecurringSum;
        this.iL5RunRateOnetimeSum   = iL5RunRateOnetimeSum;

        const stage4 = ['IL4', 'SIL4'];
        const stage5 = ['IL5', 'SIL5'];

        if (stage4.indexOf(this.stage) !== -1) {
          this.iLForm.patchValue({ iL4RunRateRecurring: this.iL4RunRateRecurringSum.toFixed(3) });
          this.iLForm.patchValue({ iL4RunRateOnetime: this.iL4RunRateOnetimeSum.toFixed(3) });
        }

        if (stage5.indexOf(this.stage) !== -1) {
          this.iLForm.patchValue({ iL4RunRateRecurring: this.iL4RunRateRecurringSum.toFixed(3) });
          this.iLForm.patchValue({ iL4RunRateOnetime: this.iL4RunRateOnetimeSum.toFixed(3) });
          this.iLForm.patchValue({ iL5RunRateRecurring: this.iL5RunRateRecurringSum.toFixed(3) });
          this.iLForm.patchValue({ iL5RunRateOnetime: this.iL5RunRateOnetimeSum.toFixed(3) });
        }

        setTimeout(() => {
          if (this.stage === 'IL1') {
            for (let k = 0; k < FirstRunRate.length; k++) {
              FirstRunRate.at(k).get('runRate').get('row1').setValidators([Validators.required]);
              FirstRunRate.at(k).get('runRate').get('row1').updateValueAndValidity();
            }
          }
          if (this.stage === 'IL3') {
            for (let k = 0; k < FirstRunRate.length; k++) {
              FirstRunRate.at(k).get('runRate').get('row2').setValidators([Validators.required]);
              FirstRunRate.at(k).get('runRate').get('row2').updateValueAndValidity();
            }
          }
          if (this.stage === 'IL4') {
            for (let k = 0; k < FirstRunRate.length; k++) {
              FirstRunRate.at(k).get('runRate').get('row3').setValidators([Validators.required]);
              FirstRunRate.at(k).get('runRate').get('row3').updateValueAndValidity();
            }
          }
        }, 200);

        this.FirstRunRateLoading();
      }, 600);
    }
    if (sessionStorage.getItem('isIndirectBenefit') === 'true') {
      const IndirectBenefit = JSON.parse(sessionStorage.getItem('IndirectBenefit'));
      setTimeout(() => {
        if (IndirectBenefit.indirectBenefit === 'true') {
          this.isIndirectBenefit = 'true';
        } else {
          this.isHaveImpiemantCost = 'false';
        }
        this.IndirectBenefit.patchValue(IndirectBenefit);
      }, 100);
    }
    if (sessionStorage.getItem('isIndirectForm') === 'true') {
      const IndirectForm = JSON.parse(sessionStorage.getItem('IndirectForm'));
      setTimeout(() => {
        const Indirect = this.IndirectForm.get('indirectTable') as FormArray;
        if (IndirectForm.indirectTable.length !== 0) {
          for (let i = 0; i < (IndirectForm.indirectTable.length); i++) {
            if (IndirectForm.indirectTable[i].typeOfBenefit) {
              const typeOfBenefit = this.recurringAndOneTime.filter(
                obj => obj.typeOfBenefitCode === IndirectForm.indirectTable[i].typeOfBenefit
              );
              if (typeOfBenefit[0].typeOfBenefitGroup) {
                this.titleIndirect.push(typeOfBenefit[0].typeOfBenefitTitle);
                Indirect.push(this.InitialIndirect());
                Indirect.at(i).patchValue({ typeOfBenefit: IndirectForm.indirectTable[i].typeOfBenefit });
                Indirect.at(i).enable();
                switch (typeOfBenefit[0].typeOfBenefitGroup) {
                  case 'Recurring':
                    this.isIndirectRecurring.push(true);
                    this.isIndirectOneTime.push(false);
                    this.recurringIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
                    this.recurringAndOneTimeIndirect.push(this.recurringIndirect);
                    break;
                  case 'One time':
                    this.isIndirectRecurring.push(false);
                    this.isIndirectOneTime.push(true);
                    this.onetimeIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
                    this.recurringAndOneTimeIndirect.push(this.onetimeIndirect);
                    break;
                }
              }
              Indirect.at(i).patchValue({ typeOfBenefit: IndirectForm.indirectTable[i].typeOfBenefit });
              ['row1', 'row2'].forEach(row => {
                Indirect.at(i).get('versionPrice').patchValue({ [row]: IndirectForm.indirectTable[i].versionPrice[row] });
              });
              ['row1', 'row2'].forEach(row => {
                Indirect.at(i).get('runRate').patchValue({ [row]: IndirectForm.indirectTable[i].runRate[row] });
              });
            }
          }
        }
      }, 1000);
    }
    if (sessionStorage.getItem('isExplanationForm') === 'true') {
      const explanationForm = JSON.parse(sessionStorage.getItem('explanationForm'));
      setTimeout(() => this.explanationForm.patchValue(explanationForm), 100);
    }
    if (sessionStorage.getItem('isHaveImpiemantCost') === 'true') {
      const HaveImpiemantCost = JSON.parse(sessionStorage.getItem('HaveImpiemantCost'));
      setTimeout(() => {
        if (HaveImpiemantCost.haveImpiemantCost === 'true') {
          this.isHaveImpiemantCost = 'true';
          this.ImpiemantCostForm.enable();
        } else {
          this.isHaveImpiemantCost = 'false';
          this.ImpiemantCostForm.disable();
        }
        this.HaveImpiemantCost.patchValue(HaveImpiemantCost);
      }, 100);
    }
    if (sessionStorage.getItem('isImpiemantCostForm') === 'true') {
      const ImpiemantCostForm = JSON.parse(sessionStorage.getItem('ImpiemantCostForm'));
      setTimeout(() => {
        ['row1', 'row2'].forEach(row => {
          this.ImpiemantCostForm.get('runRate').patchValue({ [row]: ImpiemantCostForm.runRate[row] });
        });
        ['monthRows1', 'monthRows2'].forEach(row => {
          Object.keys(this.monthObject).forEach(name => {
            this.ImpiemantCostForm.get(row).patchValue({
              [name]: ImpiemantCostForm[row][name] ? ImpiemantCostForm[row][name] : null
            });
          });
        });
      }, 600);
    }
    if (sessionStorage.getItem('isTypeBenefitForm') === 'true') {
      const TypeBenefitForm = JSON.parse(sessionStorage.getItem('TypeBenefitForm'));
      const TypeBenefitTotalForm = JSON.parse(sessionStorage.getItem('TypeBenefitTotalForm'));
      setTimeout(() => {
        const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
        if (TypeBenefitForm.typeBenefitTable.length !== 0) {
          for (let i = 0; i < (TypeBenefitForm.typeBenefitTable.length); i++) {
            if (TypeBenefitForm.typeBenefitTable[i].typeOfBenefit) {
              TypeBenefit.at(i).patchValue({ typeOfBenefit: TypeBenefitForm.typeBenefitTable[i].typeOfBenefit });
              ['row1', 'row2'].forEach(row => {
                TypeBenefit.at(i).get('versionPrice').patchValue({ [row]: TypeBenefitForm.typeBenefitTable[i].versionPrice[row] });
              });
              ['row1', 'row2'].forEach(row => {
                TypeBenefit.at(i).get('runRate').patchValue({ [row]: TypeBenefitForm.typeBenefitTable[i].runRate[row] });
              });
              ['monthRows1', 'monthRows2'].forEach(row => {
                Object.keys(this.monthObject).forEach(name => {
                  TypeBenefit.at(i).get(row).patchValue({
                    [name]: TypeBenefitForm.typeBenefitTable[i][row][name] ? TypeBenefitForm.typeBenefitTable[i][row][name] : null
                  });
                });
              });
            }
          }
        }
        if (this.monthRowTableLength > 1) {
          ['row1', 'row2'].forEach(row => {
            this.TypeBenefitTotalForm.get('runRate').patchValue({ [row]: TypeBenefitTotalForm.runRate[row] });
          });
          ['monthRows1', 'monthRows2'].forEach(row => {
            Object.keys(this.monthObject).forEach(name => {
              this.TypeBenefitTotalForm.get(row).patchValue({
                [name]: TypeBenefitTotalForm[row][name] ? TypeBenefitTotalForm[row][name] : null
              });
            });
          });
        }
      }, 1000);
    }
    if (sessionStorage.getItem('isToCommentForm') === 'true') {
      const toCommentForm = JSON.parse(sessionStorage.getItem('toCommentForm'));
      setTimeout(() => this.toCommentForm.patchValue(toCommentForm), 100);
    }
    if (sessionStorage.getItem('isRemarkForm') === 'true') {
      const remarkForm = JSON.parse(sessionStorage.getItem('remarkForm'));
      setTimeout(() => this.remarkForm.patchValue(remarkForm), 100);
    }
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      this.status = response.status;
      this.stage = response.stage;
      this.remark = response.remark;
      this.Cim = response.cim ? true : false;
      this.Capex = response.directCapex ? true : false;
      this.Strategy = response.strategy ? true : false;
      this.Max = response.max ? true : false;
      this.SetValidateForm();
      this.CheckValidate();
    });
  }

  GetShareBenefitWorkstream(id) {
    this.impactService.GetShareBenefitWorkstream(id).subscribe(response => {
      if (sessionStorage.getItem('isShareBenefitFrom') !== 'true') {
        this.shareBenefitWorkstreams = response.shareBenefitWorkstreams;
        if (this.shareBenefitWorkstreams.length !== 0) {
          const ShareBenefit = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
          for (let i = 0; i < this.shareBenefitWorkstreams.length; i++) {
            ShareBenefit.push(this.InitialShareBenefitFrom());
            ShareBenefit.at(i).patchValue(this.shareBenefitWorkstreams[i]);
            ShareBenefit.at(i).get('id').patchValue(0);
          }
          this.isRemoveShareBenefit = ShareBenefit.length > 1 ? false : true;
        } else {
          this.AddShareBenefit();
          this.AddShareBenefit();
        }
      }
    }, error => this.response.error(error));
  }

  GetRecurringAndOnetime() {
    this.impactService.GetRecurringAndOneTimeSelect().subscribe(recurringAndOneTime => {
      this.recurringAndOneTime = recurringAndOneTime;
    });
  }

  GetRecurringAndOnetimeArray() {
    this.impactService.GetRecurringAndOneTimeSelect().subscribe(recurring => {
      this.recurring = recurring;
      this.recurring = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
      this.recurringAndOneTimeArray.push(this.recurring);
    });
  }

  GetRecurringAndOnetimeIndirect() {
    this.impactService.GetRecurringAndOneTimeSelect().subscribe(recurring => {
      this.recurringIndirect = recurring;
      this.recurringIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
      this.recurringAndOneTimeIndirect.push(this.recurringIndirect);
    });
  }

  GetInitiativeDetail(id) {
    this.maxService.GetDetailMax(id).subscribe(response => {
      this.requestOpex = response.requestOpex;
      this.costEstOpex = response.costEstOpex;
      if (response.requestOpex === 'trueOpex') { // response.impiemantCost
        this.HaveImpiemantCost.patchValue({ haveImpiemantCost: 'true' });
        this.isHaveImpiemantCost = 'true';
        this.ImpiemantCostForm.enable();
        this.ImpiemantCostForm.get('runRate').patchValue({ row1: response.costEstOpex });
      } else {
        this.HaveImpiemantCost.patchValue({ haveImpiemantCost: 'false' });
        this.isHaveImpiemantCost = 'false';
        this.ImpiemantCostForm.disable();
      }

      this.isMax = response.max;
      if (this.isMax) {
        this.detailInformations = response.detailInformations;
        if (this.detailInformations) {
          this.subWorkstream1 = this.detailInformations.subWorkstream1;
        }
      }
    });
  }

  FirstRunRateLoading() {
    setTimeout(() => {
      this.spinner.hide();
      this.IsFirstRunRate = false;
    }, 400);
  }

  async GetImpactTracking(id) {
    this.impactService.GetImpactTracking(id).subscribe(async response => {
      this.IsFirstRunRate = true;
      this.spinner.show();

      if (response) {
        this.Impact = response.id;

        this.SIL4Achievement = response.siL4Achievement;
        this.SIL5Achievement = response.siL4Achievement;

        this.financialImpactArea.patchValue({ financialImpactArea: response.financialImpactArea ? response.financialImpactArea : '' });
        this.monthForm.patchValue({ firstRunRateMonth: new Date(response.firstRunRateMonth) });
        this.remarkForm.patchValue(response);

        if (response.haveShareBenefit) {
          this.HaveShareBenefit.patchValue({ haveShareBenefit: 'true' });
          this.isHaveShareBenefit = 'true';
        } else {
          this.HaveShareBenefit.patchValue({ haveShareBenefit: 'false' });
          this.isHaveShareBenefit = 'false';
        }

        if (response.autoCalculate) {
          this.CalculateForm.patchValue({ calculate: true });
          this.isAutoCalculate = true;
        } else {
          this.CalculateForm.patchValue({ calculate: false });
          this.isAutoCalculate = false;
        }

        if (response.indirectBenefit) {
          this.IndirectBenefit.patchValue({ indirectBenefit: 'true' });
          this.isIndirectBenefit = 'true';
        } else {
          this.IndirectBenefit.patchValue({ indirectBenefit: 'false' });
          this.isIndirectBenefit = 'false';
        }

        this.explanationForm.patchValue({ explanation: response.explanation ? response.explanation : null });
        this.toCommentForm.patchValue({ toComment: response.toComment ? response.toComment : null });

        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        const Indirect     = this.IndirectForm.get('indirectTable')         as FormArray;
        const TypeBenefit  = this.TypeBenefitForm.get('typeBenefitTable')   as FormArray;

        if (sessionStorage.getItem('isFirstRunRateForm')  !== 'true') {
          const FirstRunRateList   = await this.impactService.GetFirstRunRate(this.id).toPromise();
          const FirstRunRateRow    = { row1: [], row2: [], row3: [] };
          const FirstRunRateRowSum = { row1: 0, row2: 0, row3: 0 };
          const FirstRunRateMonthRow = {
            row1: this.monthObjectArrayRow1,
            row2: this.monthObjectArrayRow2,
            row3: this.monthObjectArrayRow3
          };
          const FirstRunRateMonthRowSum = {
            row1: this.monthObjectSumRow1,
            row2: this.monthObjectSumRow2,
            row3: this.monthObjectSumRow3
          };
          this.FirstRunRateList = FirstRunRateList;
          if (this.FirstRunRateList.length !== 0) {
            this.isOpenCopy = false;
            for (let i = 0; i <= (this.FirstRunRateList.length); i++) {
              if (i !== 0) {
                if (i % 3 === 0) {
                  this.FirstRunRateTypeOfBenefit.push(this.FirstRunRateList[i - 1].typeOfBenefit);
                }
              }
            }

            for (let i = 1; i <= (this.FirstRunRateList.length / 3); i++) {
              const typeOfBenefit = this.recurringAndOneTime.filter(
                obj => obj.typeOfBenefitCode === this.FirstRunRateTypeOfBenefit[i - 1]
              );
              if (typeOfBenefit.length !== 0) {
                this.groupBenefit.push(typeOfBenefit[0].typeOfBenefitGroup);
                this.titleBenefit.push(typeOfBenefit[0].typeOfBenefitTitle);
                FirstRunRate.push(this.InitialFirstRunRate());
                TypeBenefit.push(this.InitialTypeBenefit());
                FirstRunRate.at(i - 1).patchValue({ typeOfBenefit: this.FirstRunRateTypeOfBenefit[i - 1] });
                TypeBenefit.at(i - 1).patchValue({ typeOfBenefit: this.FirstRunRateTypeOfBenefit[i - 1] });
                FirstRunRate.at(i - 1).enable();
                TypeBenefit.at(i - 1).enable();
                switch (typeOfBenefit[0].typeOfBenefitGroup) {
                  case 'Recurring':
                    this.isCheckRecurring.push(true);
                    this.isCheckOneTime.push(false);
                    this.recurring = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
                    this.recurringAndOneTimeArray.push(this.recurring);
                    break;
                  case 'One time':
                    this.isCheckRecurring.push(false);
                    this.isCheckOneTime.push(true);
                    this.onetime = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
                    this.recurringAndOneTimeArray.push(this.onetime);
                    break;
                }
              }
            }

            for (let j = 0; j < (this.FirstRunRateList.length / 3); j++) {
              if (j === 0) {
                this.FirstRunRateStart = 0;
                this.FirstRunRateLength = 2;
              } else {
                this.FirstRunRateStart = this.FirstRunRateStart + 3;
                this.FirstRunRateLength = this.FirstRunRateLength + 3;
              }

              for (let i = this.FirstRunRateStart; i <= this.FirstRunRateLength; i++) {
                const typeOfBenefit = this.recurringAndOneTime.filter(
                  obj => obj.typeOfBenefitCode === this.FirstRunRateList[i].typeOfBenefit
                );
                if (i % 3 === 0) {
                  FirstRunRate.at(j).get('runRate').patchValue({
                    row1: this.FirstRunRateList[i].runRate ? this.FirstRunRateList[i].runRate : null
                  });
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring': FirstRunRateRow.row1.push(this.FirstRunRateList[i].runRate); break;
                    case 'One time': FirstRunRateRow.row1.push(this.FirstRunRateList[i].runRate * 0.1); break;
                  }
                  FirstRunRateRowSum.row1 = FirstRunRateRow.row1.reduce((a, b) => a + b, 0);
                } else if (i % 3 === 1) {
                  FirstRunRate.at(j).get('runRate').patchValue({
                    row2: this.FirstRunRateList[i].runRate ? this.FirstRunRateList[i].runRate : null
                  });
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring': FirstRunRateRow.row2.push(this.FirstRunRateList[i].runRate); break;
                    case 'One time': FirstRunRateRow.row2.push(this.FirstRunRateList[i].runRate * 0.1); break;
                  }
                  FirstRunRateRowSum.row2 = FirstRunRateRow.row2.reduce((a, b) => a + b, 0);
                } else if (i % 3 === 2) {
                  FirstRunRate.at(j).get('runRate').patchValue({
                    row3: this.FirstRunRateList[i].runRate ? this.FirstRunRateList[i].runRate : null
                  });
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring': FirstRunRateRow.row3.push(this.FirstRunRateList[i].runRate); break;
                    case 'One time': FirstRunRateRow.row3.push(this.FirstRunRateList[i].runRate * 0.1); break;
                  }
                  FirstRunRateRowSum.row3 = FirstRunRateRow.row3.reduce((a, b) => a + b, 0);
                }
              }

              for (let i = this.FirstRunRateStart; i <= this.FirstRunRateLength; i++) {
                if (i % 3 === 0) {
                  Object.keys(this.monthObject).forEach(name => {
                    FirstRunRate.at(j).get('monthRows1').patchValue({[name]: this.FirstRunRateList[i][name]});
                  });
                } else if (i % 3 === 1) {
                  Object.keys(this.monthObject).forEach(name => {
                    FirstRunRate.at(j).get('monthRows2').patchValue({[name]: this.FirstRunRateList[i][name]});
                  });
                } else if (i % 3 === 2) {
                  Object.keys(this.monthObject).forEach(name => {
                    FirstRunRate.at(j).get('monthRows3').patchValue({[name]: this.FirstRunRateList[i][name]});
                  });
                }
              }

              for (let i = this.FirstRunRateStart; i <= this.FirstRunRateLength; i++) {
                const typeOfBenefit = this.recurringAndOneTime.filter(
                  obj => obj.typeOfBenefitCode === this.FirstRunRateList[i].typeOfBenefit
                );
                if (i % 3 === 0) {
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row1[name].push(this.FirstRunRateList[i][name]);
                      });
                      break;
                    case 'One time':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row1[name].push(this.FirstRunRateList[i][name] * 0.1);
                      });
                      break;
                  }
                } else if (i % 3 === 1) {
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row2[name].push(this.FirstRunRateList[i][name]);
                      });
                      break;
                    case 'One time':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row2[name].push(this.FirstRunRateList[i][name] * 0.1);
                      });
                      break;
                  }
                } else if (i % 3 === 2) {
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row3[name].push(this.FirstRunRateList[i][name]);
                      });
                      break;
                    case 'One time':
                      Object.keys(this.monthObject).forEach(name => {
                        FirstRunRateMonthRow.row3[name].push(this.FirstRunRateList[i][name] * 0.1);
                      });
                      break;
                  }
                }
                Object.keys(this.monthObject).forEach(name => {
                  FirstRunRateMonthRowSum.row1[name] = FirstRunRateMonthRow.row1[name].reduce((a, b) => a + b, 0);
                });
                Object.keys(this.monthObject).forEach(name => {
                  FirstRunRateMonthRowSum.row2[name] = FirstRunRateMonthRow.row2[name].reduce((a, b) => a + b, 0);
                });
                Object.keys(this.monthObject).forEach(name => {
                  FirstRunRateMonthRowSum.row3[name] = FirstRunRateMonthRow.row3[name].reduce((a, b) => a + b, 0);
                });
              }
            }

            Object.keys(FirstRunRateRowSum).forEach(name => {
              this.FirstRunRateTotalForm.get('runRate').patchValue({
                [name]: FirstRunRateRowSum[name] ? FirstRunRateRowSum[name] : null
              });
            });

            Object.keys(this.monthObject).forEach(name => {
              if (FirstRunRateMonthRowSum.row1[name] === 0) {
                this.FirstRunRateTotalForm.get('monthRows1').patchValue({
                  [name]: FirstRunRateMonthRowSum.row1[name] ? FirstRunRateMonthRowSum.row1[name] : 0
                });
              } else {
                this.FirstRunRateTotalForm.get('monthRows1').patchValue({
                  [name]: FirstRunRateMonthRowSum.row1[name] ? FirstRunRateMonthRowSum.row1[name] : null
                });
              }
            });

            Object.keys(this.monthObject).forEach(name => {
              this.FirstRunRateTotalForm.get('monthRows2').patchValue({
                [name]: FirstRunRateMonthRowSum.row2[name] ? FirstRunRateMonthRowSum.row2[name] : null
              });
            });

            Object.keys(this.monthObject).forEach(name => {
              this.FirstRunRateTotalForm.get('monthRows3').patchValue({
                [name]: FirstRunRateMonthRowSum.row3[name] ? FirstRunRateMonthRowSum.row3[name] : null
              });
            });

            this.monthRowTableLength = FirstRunRate.length;
            this.isRemoveFirstRunRate = FirstRunRate.length > 1 ? false : true;

            const iL4RunRateRecurring = [];
            let iL4RunRateRecurringSum = 0;
            const iL5RunRateRecurring = [];
            let iL5RunRateRecurringSum = 0;
            const iL4RunRateOnetime = [];
            let iL4RunRateOnetimeSum = 0;
            const iL5RunRateOnetime = [];
            let iL5RunRateOnetimeSum = 0;

            this.CalculateTotal();

            for (let i = 0; i < FirstRunRate.length; i++) {
              const typeOfBenefit = this.recurringAndOneTime.filter(
                obj => obj.typeOfBenefitCode === FirstRunRate.at(i).get('typeOfBenefit').value
              );
              if (typeOfBenefit.length !== 0) {
                switch (typeOfBenefit[0].typeOfBenefitGroup) {
                  case 'Recurring':
                    iL4RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row2));
                    iL5RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row3));
                    break;
                  case 'One time':
                    iL4RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row2 * 0.1));
                    iL5RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row3 * 0.1));
                    break;
                }
              }
              this.StageCheck(i);
              const stage45 = ['IL4', 'SIL4', 'IL5', 'SIL5'];
              if (!(stage45.indexOf(this.stage) !== -1)) {
                FirstRunRate.at(i).get('typeOfBenefit').enable();
              } else {
                FirstRunRate.at(i).get('typeOfBenefit').disable();
              }
            }

            iL4RunRateRecurringSum = iL4RunRateRecurring.reduce((a, b) => a + b, 0);
            iL5RunRateRecurringSum = iL5RunRateRecurring.reduce((a, b) => a + b, 0);
            iL4RunRateOnetimeSum   = iL4RunRateOnetime.reduce((a, b)   => a + b, 0);
            iL5RunRateOnetimeSum   = iL5RunRateOnetime.reduce((a, b)   => a + b, 0);

            this.iL4RunRateRecurringSum = response.iL4RunRateRecurring ? response.iL4RunRateRecurring : iL4RunRateRecurringSum;
            this.iL4RunRateOnetimeSum   = response.iL4RunRateOnetime   ? response.iL4RunRateOnetime   : iL4RunRateOnetimeSum;

            this.iL5RunRateRecurringSum = response.iL5RunRateRecurring ? response.iL5RunRateRecurring : iL5RunRateRecurringSum;
            this.iL5RunRateOnetimeSum   = response.iL5RunRateOnetime   ? response.iL5RunRateOnetime   : iL5RunRateOnetimeSum;

            const stage4 = ['IL4', 'SIL4'];
            const stage5 = ['IL5', 'SIL5'];

            if (stage4.indexOf(this.stage) !== -1) {
              // this.iLForm.patchValue({ iL4RunRateRecurring: iL4RunRateRecurringSum ? iL4RunRateRecurringSum : null });
              // this.iLForm.patchValue({ iL4RunRateOnetime  : iL4RunRateOnetimeSum   ? iL4RunRateOnetimeSum   : null });
              this.iLForm.patchValue({ iL4RunRateRecurring: this.iL4RunRateRecurringSum.toFixed(3) });
              this.iLForm.patchValue({ iL4RunRateOnetime  : this.iL4RunRateOnetimeSum.toFixed(3)   });
            }

            if (stage5.indexOf(this.stage) !== -1) {
              // this.iLForm.patchValue({ iL4RunRateRecurring: iL4RunRateRecurringSum ? iL4RunRateRecurringSum : null });
              // this.iLForm.patchValue({ iL4RunRateOnetime: iL4RunRateOnetimeSum ? iL4RunRateOnetimeSum : null });
              // this.iLForm.patchValue({ iL5RunRateRecurring: iL5RunRateRecurringSum ? iL5RunRateRecurringSum : null });
              // this.iLForm.patchValue({ iL5RunRateOnetime: iL5RunRateOnetimeSum ? iL5RunRateOnetimeSum : null });
              this.iLForm.patchValue({ iL4RunRateRecurring: this.iL4RunRateRecurringSum.toFixed(3) });
              this.iLForm.patchValue({ iL4RunRateOnetime  : this.iL4RunRateOnetimeSum.toFixed(3)   });
              this.iLForm.patchValue({ iL5RunRateRecurring: this.iL5RunRateRecurringSum.toFixed(3) });
              this.iLForm.patchValue({ iL5RunRateOnetime  : this.iL5RunRateOnetimeSum.toFixed(3)   });
            }

            setTimeout(() => {
              if (this.stage === 'IL1') {
                for (let k = 0; k < FirstRunRate.length; k++) {
                  FirstRunRate.at(k).get('runRate').get('row1').setValidators([Validators.required]);
                  FirstRunRate.at(k).get('runRate').get('row1').updateValueAndValidity();
                }
              }
              if (this.stage === 'IL3') {
                for (let k = 0; k < FirstRunRate.length; k++) {
                  FirstRunRate.at(k).get('runRate').get('row2').setValidators([Validators.required]);
                  FirstRunRate.at(k).get('runRate').get('row2').updateValueAndValidity();
                }
              }
              if (this.stage === 'IL4') {
                for (let k = 0; k < FirstRunRate.length; k++) {
                  FirstRunRate.at(k).get('runRate').get('row3').setValidators([Validators.required]);
                  FirstRunRate.at(k).get('runRate').get('row3').updateValueAndValidity();
                }
              }
            }, 200);

            this.FirstRunRateLoading();

          } else {
            this.FirstRunRateLoading();
            switch (this.stage) {
              case 'IL1' :
              case 'IL3' :
              case 'IL4' :
                this.TypeOfBenefit = true;
                break;
            }
            this.AddMonthRow();
          }
        }

        if (sessionStorage.getItem('isIndirectForm')      !== 'true') {
          if (this.isIndirectBenefit) {
            const IndirectList   = await this.impactService.GetIndirect(this.id).toPromise();
            this.IndirectList    = IndirectList;
            if (this.IndirectList.length !== 0) {
              for (let i = 0; i <= (this.IndirectList.length); i++) {
                if (i !== 0) {
                  if (i % 2 === 0) {
                    this.IndirectSelect.push(this.IndirectList[i - 1].typeOfBenefit);
                  }
                }
              }

              for (let i = 1; i <= (this.IndirectList.length / 2); i++) {
                const typeOfBenefit = this.recurringAndOneTime.filter(
                  obj => obj.typeOfBenefitCode === this.IndirectSelect[i - 1]
                );
                if (typeOfBenefit[0].typeOfBenefitGroup) {
                  this.titleIndirect.push(typeOfBenefit[0].typeOfBenefitTitle);
                  Indirect.push(this.InitialIndirect());
                  Indirect.at(i - 1).patchValue({ typeOfBenefit: this.IndirectSelect[i - 1] });
                  Indirect.at(i - 1).enable();
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring':
                      this.isIndirectRecurring.push(true);
                      this.isIndirectOneTime.push(false);
                      this.recurringIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
                      this.recurringAndOneTimeIndirect.push(this.recurringIndirect);
                      break;
                    case 'One time':
                      this.isIndirectRecurring.push(false);
                      this.isIndirectOneTime.push(true);
                      this.onetimeIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
                      this.recurringAndOneTimeIndirect.push(this.onetimeIndirect);
                      break;
                  }
                }
              }

              for (let j = 0; j < (this.IndirectList.length / 2); j++) {
                if (j === 0) {
                  this.IndirectStart  = 0;
                  this.IndirectLength = 1;
                } else {
                  this.IndirectStart  = this.IndirectStart + 2;
                  this.IndirectLength = this.IndirectLength + 2;
                }
                for (let i = this.IndirectStart; i <= this.IndirectLength; i++) {
                  if (i % 2 === 0) {
                    Indirect.at(j).get('runRate').patchValue({ row1: this.IndirectList[i].runRate });
                  } else if (i % 2 === 1) {
                    Indirect.at(j).get('runRate').patchValue({ row2: this.IndirectList[i].runRate });
                  }
                }
              }
              this.isRemoveIndirect = Indirect.length > 1 ? false : true;
            } else {
              this.AddIndirect();
            }
          }
        }

        if (sessionStorage.getItem('isImpiemantCostForm') !== 'true') {
          const ImplementationList = await this.impactService.GetImplementationCost(this.id).toPromise();
          this.ImpiemantCostList = ImplementationList;
          if (this.ImpiemantCostList.length !== 0) {
            for (let i = 0; i <= 1; i++) {
              if (i === 0) {
                this.ImpiemantCostForm.get('versionPrice').patchValue({ row1: this.ImpiemantCostList[i].versionPrice });
                this.ImpiemantCostForm.get('runRate').patchValue({
                  row1: this.ImpiemantCostList[i].runRate ? this.ImpiemantCostList[i].runRate : this.costEstOpex
                });
                Object.keys(this.monthObject).forEach(name => {
                  this.ImpiemantCostForm.get('monthRows1').patchValue({[name]: this.ImpiemantCostList[i][name]});
                });
              } else {
                this.ImpiemantCostForm.get('versionPrice').patchValue({ row2: this.ImpiemantCostList[i].versionPrice });
                this.ImpiemantCostForm.get('runRate').patchValue({ row2: this.ImpiemantCostList[i].runRate });
                Object.keys(this.monthObject).forEach(name => {
                  this.ImpiemantCostForm.get('monthRows2').patchValue({[name]: this.ImpiemantCostList[i][name]});
                });
              }
            }
          }
          if (this.ImpiemantCostForm.get('runRate').get('row2').value) {
            this.ImpiemantCostForm.get('runRate').patchValue({ row2: this.costEstOpex });
          } else {
            this.ImpiemantCostForm.get('runRate').patchValue({ row1: this.costEstOpex });
          }
        }

        if (sessionStorage.getItem('isTypeBenefitForm')   !== 'true') {
          setTimeout(async () => {
            const TypeBenefitList = await this.impactService.GetTypeOfBenefit(this.id).toPromise();
            const BenefitRunRateRow = { row1: [], row2: [] };
            const BenefitRunRateRowSum = { row1: 0, row2: 0 };
            const BenefitMonthRow = {
              row1: this.monthBenefitArrayRow1,
              row2: this.monthBenefitArrayRow2,
            };
            const BenefitMonthRowSum = {
              row1: this.monthBenefitSumRow1,
              row2: this.monthBenefitSumRow2,
            };
            this.TypeOfBenefitList = TypeBenefitList;
            if (this.TypeOfBenefitList.length !== 0) {
              for (let i = 0; i <= (this.TypeOfBenefitList.length); i++) {
                if (i !== 0) {
                  if (i % 2 === 0) {
                    this.TypeOfBenefitSelect.push(this.TypeOfBenefitList[i - 1].typeOfBenefit);
                  }
                }
              }
              for (let i = 1; i <= (this.TypeOfBenefitList.length / 2); i++) {
                TypeBenefit.at(i - 1).patchValue({ typeOfBenefit: this.TypeOfBenefitSelect[i - 1] });
              }
              for (let j = 0; j < (this.TypeOfBenefitList.length / 2); j++) {
                if (j === 0) {
                  this.TypeOfBenefitStart = 0;
                  this.TypeOfBenefitLength = 1;
                } else {
                  this.TypeOfBenefitStart = this.TypeOfBenefitStart + 2;
                  this.TypeOfBenefitLength = this.TypeOfBenefitLength + 2;
                }

                for (let i = this.TypeOfBenefitStart; i <= this.TypeOfBenefitLength; i++) {
                  if (i % 2 === 0) {
                    TypeBenefit.at(j).get('versionPrice').patchValue({ row1: this.TypeOfBenefitList[i].fixedFX });
                  } else if (i % 2 === 1) {
                    TypeBenefit.at(j).get('versionPrice').patchValue({ row2: this.TypeOfBenefitList[i].fixedFX });
                  }
                }

                for (let i = this.TypeOfBenefitStart; i <= this.TypeOfBenefitLength; i++) {
                  const typeOfBenefit = this.recurringAndOneTime.filter(
                    obj => obj.typeOfBenefitCode === this.TypeOfBenefitList[i].typeOfBenefit
                  );
                  if (i % 2 === 0) {
                    TypeBenefit.at(j).get('runRate').patchValue({ row1: this.TypeOfBenefitList[i].runRate });
                    switch (typeOfBenefit[0].typeOfBenefitGroup) {
                      case 'Recurring': BenefitRunRateRow.row1.push(this.TypeOfBenefitList[i].runRate); break;
                      case 'One time': BenefitRunRateRow.row1.push(this.TypeOfBenefitList[i].runRate * 0.1); break;
                    }
                    BenefitRunRateRowSum.row1 = BenefitRunRateRow.row1.reduce((a, b) => a + b, 0);
                  } else if (i % 2 === 1) {
                    TypeBenefit.at(j).get('runRate').patchValue({ row2: this.TypeOfBenefitList[i].runRate });
                    switch (typeOfBenefit[0].typeOfBenefitGroup) {
                      case 'Recurring': BenefitRunRateRow.row2.push(this.TypeOfBenefitList[i].runRate); break;
                      case 'One time': BenefitRunRateRow.row2.push(this.TypeOfBenefitList[i].runRate * 0.1); break;
                    }
                    BenefitRunRateRowSum.row2 = BenefitRunRateRow.row2.reduce((a, b) => a + b, 0);
                  }
                }

                for (let i = this.TypeOfBenefitStart; i <= this.TypeOfBenefitLength; i++) {
                  if (i % 2 === 0) {
                    Object.keys(this.monthObject).forEach(name => {
                      TypeBenefit.at(j).get('monthRows1').patchValue({[name]: this.TypeOfBenefitList[i][name]});
                    });
                  } else if (i % 2 === 1) {
                    Object.keys(this.monthObject).forEach(name => {
                      TypeBenefit.at(j).get('monthRows2').patchValue({[name]: this.TypeOfBenefitList[i][name]});
                    });
                  }
                }

                for (let i = this.TypeOfBenefitStart; i <= this.TypeOfBenefitLength; i++) {
                  const typeOfBenefit = this.recurringAndOneTime.filter(
                    obj => obj.typeOfBenefitCode === this.TypeOfBenefitList[i].typeOfBenefit
                  );
                  if (i % 2 === 0) {
                    switch (typeOfBenefit[0].typeOfBenefitGroup) {
                      case 'Recurring':
                        Object.keys(this.monthObject).forEach(name => {
                          BenefitMonthRow.row1[name].push(this.TypeOfBenefitList[i][name]);
                        });
                        break;
                      case 'One time':
                        Object.keys(this.monthObject).forEach(name => {
                          BenefitMonthRow.row1[name].push(this.TypeOfBenefitList[i][name] * 0.1);
                        });
                        break;
                    }
                  } else if (i % 2 === 1) {
                    switch (typeOfBenefit[0].typeOfBenefitGroup) {
                      case 'Recurring':
                        Object.keys(this.monthObject).forEach(name => {
                          BenefitMonthRow.row2[name].push(this.TypeOfBenefitList[i][name]);
                        });
                        break;
                      case 'One time':
                        Object.keys(this.monthObject).forEach(name => {
                          BenefitMonthRow.row2[name].push(this.TypeOfBenefitList[i][name] * 0.1);
                        });
                        break;
                    }
                  }
                  Object.keys(this.monthObject).forEach(name => {
                    BenefitMonthRowSum.row1[name] = BenefitMonthRow.row1[name].reduce((a, b) => a + b, 0);
                  });
                  Object.keys(this.monthObject).forEach(name => {
                    BenefitMonthRowSum.row2[name] = BenefitMonthRow.row2[name].reduce((a, b) => a + b, 0);
                  });
                }

                Object.keys(BenefitRunRateRowSum).forEach(name => {
                  this.TypeBenefitTotalForm.get('runRate').patchValue({
                    [name]: BenefitRunRateRowSum[name] ? BenefitRunRateRowSum[name] : null
                  });
                });

                Object.keys(this.monthObject).forEach(name => {
                  this.TypeBenefitTotalForm.get('monthRows1').patchValue({
                    [name]: BenefitMonthRowSum.row1[name] ? BenefitMonthRowSum.row1[name] : null
                  });
                });

                Object.keys(this.monthObject).forEach(name => {
                  this.TypeBenefitTotalForm.get('monthRows2').patchValue({
                    [name]: BenefitMonthRowSum.row1[name] ? BenefitMonthRowSum.row1[name] : null
                  });
                });

                this.iLForm.patchValue({ iL4ActualPriceFixedFx: this.TypeBenefitTotalForm.controls.runRate.get('row1').value });
                this.iLForm.patchValue({ iL5ActualPriceFloatFx: this.TypeBenefitTotalForm.controls.runRate.get('row2').value });
              }

              const iL5FixedFxRecurring = [];
              let iL5FixedFxRecurringSum = 0;

              const iL5FloatFxRecurring = [];
              let iL5FloatFxRecurringSum = 0;

              const iL5FixedFxOnetime = [];
              let iL5FixedFxOnetimeSum = 0;

              const iL5FloatFxOnetime = [];
              let iL5FloatFxOnetimeSum = 0;

              for (let i = 0; i < TypeBenefit.length; i++) {
                const typeOfBenefit = this.recurringAndOneTime.filter(
                  obj => obj.typeOfBenefitCode === TypeBenefit.at(i).get('typeOfBenefit').value
                );
                if (typeOfBenefit.length !== 0) {
                  switch (typeOfBenefit[0].typeOfBenefitGroup) {
                    case 'Recurring':
                      iL5FixedFxRecurring.push(Number(TypeBenefit.at(i).get('runRate').value.row1));
                      iL5FloatFxRecurring.push(Number(TypeBenefit.at(i).get('runRate').value.row2));
                      break;
                    case 'One time':
                      iL5FixedFxOnetime.push(Number(TypeBenefit.at(i).get('runRate').value.row1 * 0.1));
                      iL5FloatFxOnetime.push(Number(TypeBenefit.at(i).get('runRate').value.row2 * 0.1));
                      break;
                  }
                }
              }

              iL5FixedFxRecurringSum = iL5FixedFxRecurring.reduce((a, b) => a + b, 0);
              iL5FloatFxRecurringSum = iL5FloatFxRecurring.reduce((a, b) => a + b, 0);
              iL5FixedFxOnetimeSum = iL5FixedFxOnetime.reduce((a, b) => a + b, 0);
              iL5FloatFxOnetimeSum = iL5FloatFxOnetime.reduce((a, b) => a + b, 0);

              this.iLForm.patchValue({ iL5FixedFxRecurring: iL5FixedFxRecurringSum ? iL5FixedFxRecurringSum : null });
              this.iLForm.patchValue({ iL5FloatFxRecurring: iL5FloatFxRecurringSum ? iL5FloatFxRecurringSum : null });
              this.iLForm.patchValue({ iL5FixedFxOnetime: iL5FixedFxOnetimeSum ? iL5FixedFxOnetimeSum : null });
              this.iLForm.patchValue({ iL5FloatFxOnetime: iL5FloatFxOnetimeSum ? iL5FloatFxOnetimeSum : null });

            }
          }, 600);
        }

      } else {
        if (sessionStorage.getItem('isFirstRunRateForm') !== 'true') {
          this.FirstRunRateLoading();
          switch (this.stage) {
            case 'IL1' :
            case 'IL3' :
            case 'IL4' :
              this.TypeOfBenefit = true;
              break;
          }
          this.AddMonthRow();
        }
      }
    });
  }

  ChangeHaveShareBenefit(event) {
    this.isHaveShareBenefit = event.target.value;
    if (this.isHaveShareBenefit === 'true') {
      (this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray).controls.forEach(item => { item.enable(); });
      const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
      for (let i = 0; i < control.length; i++) {
        if (i === 0) {
          control.at(i).patchValue({ workstream: this.subWorkstream1 ? this.subWorkstream1 : '' });
        }
      }
    } else {
      (this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray).controls.forEach(item => { item.disable(); });
      const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
      for (let i = 0; i < control.length; i++) {
        control.at(i).patchValue({ percent: '' });
      }
    }
    this.CheckPercent();
  }

  ChangeHaveImpiemantCost(event) {
    this.isHaveImpiemantCost = event.target.value;
    if (this.isHaveImpiemantCost === 'true') {
      this.ImpiemantCostForm.enable();
    } else {
      this.ImpiemantCostForm.disable();
    }
  }

  ChangeIndirectBenefit(event) {
    this.isIndirectBenefit = event.target.value;
  }

  ChangePercent(index) {
    const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
    const arraySum = [];
    for (let i = 0; i < control.length; i++) {
      if (control.at(i).get('percent').value !== null) {
        arraySum.push(Number(control.at(i).get('percent').value));
      }
    }
    const sum = arraySum.reduce((a, b) => a + b, 0);
    if (sum > 100) {
      for (let i = 0; i < control.length; i++) {
        if (control.at(i).get('percent').value !== null) {
          control.at(index).get('percent').patchValue(null);
        }
      }
      this.swalTool.SumPercent();
    }
    this.CheckPercent();
  }

  ChangeMonth(value: Date): void {
    const formattedDate = this.months[new Date(value).getMonth() + 1] + ' ' + new Date(value).getFullYear();
    this.year = new Date(value).getFullYear();
    this.month = new Date(value).getMonth();
    this.CalculateMonthStage(value);
    this.CalculateMonthYear();
    setTimeout(() => this.monthName = formattedDate, 300);
  }

  CalculateMonthStage(value) {
    const stage3 = ['IL4', 'SIL5', 'IL5'];
    if (stage3.indexOf(this.stage) !== -1) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
      const monthRunRateArray = [
        'month1', 'month2', 'month3', 'month4', 'month5', 'month6',
        'month7', 'month8', 'month9', 'month10', 'month11', 'month12',
        'month13', 'month14', 'month15', 'month16', 'month17', 'month18',
        'month19', 'month20', 'month21', 'month22', 'month23', 'month24',
        'month25', 'month26', 'month27', 'month28', 'month29', 'month30',
        'month31', 'month32', 'month33', 'month34', 'month35', 'month36',
      ];
      const time = new Date(value).getTime();
      const timeNow = new Date().getTime();
      if (time > 0) {
        if (time < timeNow) {
          if (this.year === year) {
            const result = month - this.month;
            if (result) {
              for (let i = 0; i < FirstRunRate.length; i++) {
                for (let start = 0; start < 36; start++) {
                  if (start < (result + 1)) {
                    FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).enable();
                  } else {
                    FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).disable();
                  }
                }
              }
            } else {
              for (let i = 0; i < FirstRunRate.length; i++) {
                FirstRunRate.at(i).get('monthRows3').get('month1').enable();
                for (let start = 0; start < 36; start++) {
                  if (start === 0) {
                    FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).enable();
                  } else {
                    FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).disable();
                  }
                }
              }
            }
          } else {
            const result = month + (((year - this.year) * 12) - this.month);
            for (let i = 0; i < FirstRunRate.length; i++) {
              for (let start = 0; start < 36; start++) {
                if (start < (result + 1)) {
                  FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).enable();
                }
              }
            }
          }
        } else {
          for (let i = 0; i < FirstRunRate.length; i++) {
            for (let start = 0; start < 36; start++) {
              FirstRunRate.at(i).get('monthRows3').get([monthRunRateArray[start]]).disable();
            }
          }
        }
      }
    }
  }

  CalculateMonthYear() {
    this.itemsMonth = [];
    for (let i = 0; i <= 35; i++) {
      this.month++;
      if (this.month > 12) {
        this.year = ++this.year;
        this.month = this.month - 12;
      }
      this.itemsMonth.push((this.months[this.month]) + ' ' + this.year);
    }
  }

  InitialShareBenefitFrom(): FormGroup {
    return this.fb.group({ id: [0], workstream: '', percent: '', initiativeId: this.id });
  }

  AddShareBenefit() {
    const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
    control.push(this.InitialShareBenefitFrom());
    this.isRemoveShareBenefit = control.length > 1 ? false : true;
  }

  RemovedShareBenefit(index: number) {
    const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
    control.removeAt(index);
    this.ShareBenefitFrom.markAsDirty();
    this.isRemoveShareBenefit = control.length > 1 ? false : true;
    this.CheckPercent();
  }

  InitialFirstRunRate(): FormGroup {
    return this.fb.group({
      id: [0],
      typeOfBenefitGroup: 'recurring',
      typeOfBenefit: [null, Validators.required],
      versionPrice: this.fb.group({
        row1: 'Target',
        row2: 'Revise',
        row3: 'Actual',
      }),
      runRate: this.fb.group({
        row1: { value: null, disabled: true },
        row2: { value: null, disabled: true },
        row3: { value: null, disabled: true },
      }),
      monthRows1: this.fb.group(this.monthObject),
      monthRows2: this.fb.group(this.monthObject),
      monthRows3: this.fb.group(this.monthObject)
    });
  }

  InitialTypeBenefit(): FormGroup {
    return this.fb.group({
      id: [0],
      typeOfBenefitGroup: null,
      typeOfBenefit: null,
      versionPrice: this.fb.group({
        row1: { value: '', disabled: true },
        row2: null
      }),
      runRate: this.fb.group({
        row1: { value: '', disabled: true },
        row2: { value: '', disabled: true },
      }),
      monthRows1: this.fb.group(this.monthObject),
      monthRows2: this.fb.group(this.monthObject)
    });
  }

  InitialIndirect(): FormGroup {
    return this.fb.group({
      id: [0],
      typeOfBenefitGroup: null,
      typeOfBenefit: null,
      versionPrice: this.fb.group({
        row1: 'Target',
        row2: 'Revise',
      }),
      runRate: this.fb.group({
        row1: { value: '', disabled: true },
        row2: { value: '', disabled: true },
      })
    });
  }

  ChangeTypeOfBenefitGroup(event, index) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const TypeBenefit  = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;

    FirstRunRate.at(index).patchValue({ typeOfBenefit: null });
    TypeBenefit.at(index).patchValue({ typeOfBenefit: null });

    FirstRunRate.at(index).disable();
    FirstRunRate.at(index).get('typeOfBenefit').enable();

    TypeBenefit.at(index).disable();
    TypeBenefit.at(index).get('typeOfBenefit').enable();

    switch (event.target.value) {
      case 'recurring':
        this.recurring = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
        this.recurringAndOneTimeArray[index] = this.recurring;
        break;
      case 'onetime':
        this.onetime = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
        this.recurringAndOneTimeArray[index] = this.onetime;
        break;
    }
  }

  ChangeIndirectGroup(event, index) {
    const Indirect = this.IndirectForm.get('indirectTable') as FormArray;

    Indirect.at(index).patchValue({ typeOfBenefit: null });

    Indirect.at(index).disable();
    Indirect.at(index).get('typeOfBenefit').enable();

    switch (event.target.value) {
      case 'recurring':
        this.recurringIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'Recurring');
        this.recurringAndOneTimeIndirect[index] = this.recurringIndirect;
        break;
      case 'onetime':
        this.onetimeIndirect = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitGroup === 'One time');
        this.recurringAndOneTimeIndirect[index] = this.onetimeIndirect;
        break;
    }
  }

  StageCheck(i) {
    const FirstRunRateForm = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const stage1 = ['IL0', 'SIL1', 'IL1', 'SIL2', 'IL2', 'SIL3'];
    const stage2 = ['IL3', 'SIL4'];
    const stage3 = ['IL4', 'SIL5', 'IL5'];
    if (stage1.indexOf(this.stage) !== -1) {
      FirstRunRateForm.at(i).get('runRate').get('row2').disable();
      FirstRunRateForm.at(i).get('runRate').get('row3').disable();
      Object.keys(this.monthObject).forEach(name => {
        FirstRunRateForm.at(i).get('monthRows2').get([name]).disable();
        FirstRunRateForm.at(i).get('monthRows3').get([name]).disable();
      });
    } else if (stage2.indexOf(this.stage) !== -1) {
      if (FirstRunRateForm.at(i).get('runRate').value.row1 === FirstRunRateForm.at(i).get('runRate').value.row2) {
        FirstRunRateForm.at(i).get('runRate').patchValue({ row2: FirstRunRateForm.at(i).get('runRate').value.row1 });
        FirstRunRateForm.at(i).get('runRate').get('row1').disable();
        FirstRunRateForm.at(i).get('runRate').get('row3').disable();
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRateForm.at(i).get('monthRows2').patchValue({ [name]: FirstRunRateForm.at(i).get('monthRows1').value[name] });
          FirstRunRateForm.at(i).get('monthRows1').get([name]).disable();
          FirstRunRateForm.at(i).get('monthRows3').get([name]).disable();
        });
      } else if (FirstRunRateForm.at(i).get('runRate').value.row1 !== FirstRunRateForm.at(i).get('runRate').value.row2) {
        if (FirstRunRateForm.at(i).get('runRate').value.row2) {
          FirstRunRateForm.at(i).get('runRate').patchValue({ row2: FirstRunRateForm.at(i).get('runRate').value.row2 });
          FirstRunRateForm.at(i).get('runRate').get('row1').disable();
          FirstRunRateForm.at(i).get('runRate').get('row3').disable();
          Object.keys(this.monthObject).forEach(name => {
            FirstRunRateForm.at(i).get('monthRows2').patchValue({ [name]: FirstRunRateForm.at(i).get('monthRows2').value[name] });
            FirstRunRateForm.at(i).get('monthRows1').get([name]).disable();
            FirstRunRateForm.at(i).get('monthRows3').get([name]).disable();
          });
        } else {
          FirstRunRateForm.at(i).get('runRate').patchValue({ row2: FirstRunRateForm.at(i).get('runRate').value.row1 });
          FirstRunRateForm.at(i).get('runRate').get('row1').disable();
          FirstRunRateForm.at(i).get('runRate').get('row3').disable();
          Object.keys(this.monthObject).forEach(name => {
            const monthRow2 = FirstRunRateForm.at(i).get('monthRows2').value[name];
            if (monthRow2 === 0 || monthRow2 === '0') {
              FirstRunRateForm.at(i).get('monthRows2').patchValue({ [name]: 0 });
            } else {
              FirstRunRateForm.at(i).get('monthRows2').patchValue({ [name]: FirstRunRateForm.at(i).get('monthRows1').value[name] });
            }
            FirstRunRateForm.at(i).get('monthRows1').get([name]).disable();
            FirstRunRateForm.at(i).get('monthRows3').get([name]).disable();
          });
          this.CalculateMonthTotal(i, 'row2', 'monthRows2');
        }
      }
    } else if (stage3.indexOf(this.stage) !== -1) {
      FirstRunRateForm.at(i).get('runRate').get('row1').disable();
      FirstRunRateForm.at(i).get('runRate').get('row2').disable();
      if (this.stage === 'IL5') {
        FirstRunRateForm.at(i).get('runRate').get('row3').disable();
      }
      Object.keys(this.monthObject).forEach(name => {
        FirstRunRateForm.at(i).get('monthRows1').get([name]).disable();
        FirstRunRateForm.at(i).get('monthRows3').get([name]).disable();
      });
      this.ChangeMonth(this.monthForm.controls.firstRunRateMonth.value);
    }
  }

  ChangeTypeOfBenefit(i) {
    switch (this.stage) {
      case 'IL1' :
      case 'IL3' :
      case 'IL4' :
        this.TypeOfBenefit = false;
        break;
    }
    const FirstRunRateForm = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const TypeBenefitForm = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;

    FirstRunRateForm.at(i).enable();
    TypeBenefitForm.at(i).enable();

    const typeOfBenefit = this.recurringAndOneTime.filter(
      obj => obj.typeOfBenefitCode === FirstRunRateForm.at(i).get('typeOfBenefit').value
    );

    this.StageCheck(i);

    if (typeOfBenefit[0].typeOfBenefitGroup) {
      this.isOpenCopy = false;
      this.groupBenefit[i] = typeOfBenefit[0].typeOfBenefitGroup;
      this.titleBenefit[i] = typeOfBenefit[0].typeOfBenefitTitle;
    }

    TypeBenefitForm.at(i).patchValue({ typeOfBenefit: FirstRunRateForm.at(i).get('typeOfBenefit').value });

    const monthObject = { row1: 'monthRows1', row2: 'monthRows2', row3: 'monthRows3' };
    for (const [row, monthRow] of Object.entries(monthObject)) {
      this.CalculateMonthTotal(i, row, monthRow);
      this.CalculateRunRateTotal(row);
      if (row !== 'row3') {
        this.CalculateMonthBenefitTotal(i, row, monthRow);
        this.CalculateBenefitTotal(row);
      }
    }
  }

  ChangeIndirect(i) {
    const Indirect = this.IndirectForm.get('indirectTable') as FormArray;

    Indirect.at(i).enable();

    const typeOfBenefit = this.recurringAndOneTime.filter(obj => obj.typeOfBenefitCode === Indirect.at(i).get('typeOfBenefit').value);

    if (typeOfBenefit[0].typeOfBenefitGroup) { this.titleIndirect[i] = typeOfBenefit[0].typeOfBenefitTitle; }
  }

  FixPosition(event) {
    if (event.data === '-' || event.data === '0' || event.data === null || event.data === '.') {
      const text  = event.target;
      const start = text.selectionStart;
      text.value  = event.target.value;
      text.focus();
      const caretPos = start + event.target.value.length;
      text.setSelectionRange(caretPos, caretPos);
    }
  }

  CalculateRunRateTotal(Row, event?) {

    if (event) { this.FixPosition(event); }

    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;

    const runRateRow = [];
    let runRateRowSum = 0;

    for (let i = 0; i < FirstRunRate.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === FirstRunRate.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring': runRateRow.push(Number(FirstRunRate.at(i).get('runRate').value[Row])); break;
          case 'One time' : runRateRow.push(Number(FirstRunRate.at(i).get('runRate').value[Row] * 0.1)); break;
        }
      }
    }

    runRateRowSum = runRateRow.reduce((a, b) => a + b, 0);

    this.FirstRunRateTotalForm.get('runRate').patchValue({ [Row]: runRateRowSum ? runRateRowSum : null });

    const iL4RunRateRecurring = [];
    let iL4RunRateRecurringSum = 0;

    const iL5RunRateRecurring = [];
    let iL5RunRateRecurringSum = 0;

    const iL4RunRateOnetime = [];
    let iL4RunRateOnetimeSum = 0;

    const iL5RunRateOnetime = [];
    let iL5RunRateOnetimeSum = 0;

    for (let i = 0; i < FirstRunRate.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === FirstRunRate.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            iL4RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row2));
            iL5RunRateRecurring.push(Number(FirstRunRate.at(i).get('runRate').value.row3));
            break;
          case 'One time':
            iL4RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row2 * 0.1));
            iL5RunRateOnetime.push(Number(FirstRunRate.at(i).get('runRate').value.row3 * 0.1));
            break;
        }
      }
    }

    iL4RunRateRecurringSum = iL4RunRateRecurring.reduce((a, b) => a + b, 0);
    iL4RunRateOnetimeSum   = iL4RunRateOnetime.reduce((a, b) => a + b, 0);

    iL5RunRateRecurringSum = iL5RunRateRecurring.reduce((a, b) => a + b, 0);
    iL5RunRateOnetimeSum   = iL5RunRateOnetime.reduce((a, b) => a + b, 0);

    const stageIL3 = ['IL3', 'SIL3'];
    if (stageIL3.indexOf(this.stage) !== -1) {
      this.iL4RunRateRecurringSum = iL4RunRateRecurringSum;
      this.iL4RunRateOnetimeSum   = iL4RunRateOnetimeSum;
    }

    const stageIL4 = ['IL4', 'SIL4'];
    if (stageIL4.indexOf(this.stage) !== -1) {
      this.iL5RunRateRecurringSum = iL5RunRateRecurringSum;
      this.iL5RunRateOnetimeSum   = iL5RunRateOnetimeSum;
    }

    this.CalculateTotal();

    sessionStorage.removeItem('isFirstRunRateGeneral');
    sessionStorage.removeItem('FirstRunRateGeneral');
    sessionStorage.removeItem('ImpactGeneral');
  }

  CalculateMonthTotal(index, Row, monthRow, event?) {

    if (event) { this.FixPosition(event); }

    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;

    Object.keys(this.monthObject).forEach(name => {
      this.monthObjectArray[name] = [];
      this.monthObjectSumRow[name] = 0;
    });

    const monthRunRateArray = [
      'month1', 'month2', 'month3', 'month4', 'month5', 'month6',
      'month7', 'month8', 'month9', 'month10', 'month11', 'month12',
      'month13', 'month14', 'month15', 'month16', 'month17', 'month18',
      'month19', 'month20', 'month21', 'month22', 'month23', 'month24',
      'month25', 'month26', 'month27', 'month28', 'month29', 'month30',
      'month31', 'month32', 'month33', 'month34', 'month35', 'month36',
    ];

    const FirstRunRateMonthRow = {
      row1: this.monthObjectArray,
      row2: this.monthObjectArray,
      row3: this.monthObjectArray
    };

    const FirstRunRateMonthRowSum = {
      row1: this.monthObjectSumRow,
      row2: this.monthObjectSumRow,
      row3: this.monthObjectSumRow
    };

    const FirstRunRateYearRow = {
      row1: [],
      row2: [],
      row3: []
    };

    const FirstRunRateYearRowSum = {
      row1: 0,
      row2: 0,
      row3: 0
    };

    for (let i = 0; i < FirstRunRate.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === FirstRunRate.at(i).get('typeOfBenefit').value
      );

      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            Object.keys(this.monthObject).forEach(name => {
              FirstRunRateMonthRow[Row][name].push(Number(FirstRunRate.at(i).get(monthRow).value[name]));
            });
            break;
          case 'One time':
            Object.keys(this.monthObject).forEach(name => {
              FirstRunRateMonthRow[Row][name].push(Number(FirstRunRate.at(i).get(monthRow).value[name] * 0.1));
            });
            break;
        }
      }
    }

    Object.keys(this.monthObject).forEach(name => {
      FirstRunRateMonthRowSum[Row][name] = FirstRunRateMonthRow[Row][name].reduce((a, b) => a + b, 0);
    });

    Object.keys(this.monthObject).forEach(name => {
      this.FirstRunRateTotalForm.get(monthRow).patchValue({
        [name]: FirstRunRateMonthRowSum[Row][name] ? FirstRunRateMonthRowSum[Row][name] : null
      });
    });

    for (let start = 0; start < 36; start++) {
      if (FirstRunRate.at(index).get(monthRow).value[monthRunRateArray[start]]) {
        this.startRunRate = start;
        break;
      }
    }

    if (this.startRunRate != null) {
      monthRunRateArray.forEach((month, i) => {
        if ((this.startRunRate <= i) && (i < (this.startRunRate + 12))) {
          FirstRunRateYearRow[Row].push(Number(FirstRunRate.at(index).get(monthRow).value[month]));
        }
      });
    }

    FirstRunRateYearRowSum[Row] = FirstRunRateYearRow[Row].reduce((a, b) => a + b, 0).toFixed(3);

    const stage = ['IL4', 'SIL5', 'IL5'];
    if (!(stage.indexOf(this.stage) !== -1)) {
      FirstRunRate.at(index).get('runRate').patchValue({
        [Row]: FirstRunRateYearRowSum[Row] !== '0.000' ? FirstRunRateYearRowSum[Row] : 0
      });
    }

    this.CalculateRunRateTotal(Row);
  }

  CalculateBenefitTotal(Row) {
    const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
    const runRateRow = [];
    let runRateRowSum = 0;
    for (let i = 0; i < TypeBenefit.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === TypeBenefit.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring': runRateRow.push(Number(TypeBenefit.at(i).get('runRate').value[Row])); break;
          case 'One time': runRateRow.push(Number(TypeBenefit.at(i).get('runRate').value[Row] * 0.1)); break;
        }
      }
    }
    runRateRowSum = runRateRow.reduce((a, b) => a + b, 0);
    this.TypeBenefitTotalForm.get('runRate').patchValue({ [Row]: runRateRowSum ? runRateRowSum : null });

    const iL5FixedFxRecurring = [];
    let iL5FixedFxRecurringSum = 0;

    const iL5FloatFxRecurring = [];
    let iL5FloatFxRecurringSum = 0;

    const iL5FixedFxOnetime = [];
    let iL5FixedFxOnetimeSum = 0;

    const iL5FloatFxOnetime = [];
    let iL5FloatFxOnetimeSum = 0;

    for (let i = 0; i < TypeBenefit.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === TypeBenefit.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            iL5FixedFxRecurring.push(Number(TypeBenefit.at(i).get('runRate').value.row1));
            iL5FloatFxRecurring.push(Number(TypeBenefit.at(i).get('runRate').value.row2));
            break;
          case 'One time':
            iL5FixedFxOnetime.push(Number(TypeBenefit.at(i).get('runRate').value.row1 * 0.1));
            iL5FloatFxOnetime.push(Number(TypeBenefit.at(i).get('runRate').value.row2 * 0.1));
            break;
        }
      }
    }

    iL5FixedFxRecurringSum = iL5FixedFxRecurring.reduce((a, b) => a + b, 0);
    iL5FloatFxRecurringSum = iL5FloatFxRecurring.reduce((a, b) => a + b, 0);
    iL5FixedFxOnetimeSum = iL5FixedFxOnetime.reduce((a, b) => a + b, 0);
    iL5FloatFxOnetimeSum = iL5FloatFxOnetime.reduce((a, b) => a + b, 0);

    this.iLForm.patchValue({ iL5FixedFxRecurring: iL5FixedFxRecurringSum ? iL5FixedFxRecurringSum : null });
    this.iLForm.patchValue({ iL5FloatFxRecurring: iL5FloatFxRecurringSum ? iL5FloatFxRecurringSum : null });
    this.iLForm.patchValue({ iL5FixedFxOnetime: iL5FixedFxOnetimeSum ? iL5FixedFxOnetimeSum : null });
    this.iLForm.patchValue({ iL5FloatFxOnetime: iL5FloatFxOnetimeSum ? iL5FloatFxOnetimeSum : null });
  }

  CalculateMonthBenefitTotal(index, Row, monthRow) {

    const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;

    Object.keys(this.monthObject).forEach(name => {
      this.monthObjectArray[name] = [];
      this.monthObjectSumRow[name] = 0;
    });

    const monthRunRateArray = [
      'month1', 'month2', 'month3', 'month4', 'month5', 'month6',
      'month7', 'month8', 'month9', 'month10', 'month11', 'month12',
      'month13', 'month14', 'month15', 'month16', 'month17', 'month18',
      'month19', 'month20', 'month21', 'month22', 'month23', 'month24',
      'month25', 'month26', 'month27', 'month28', 'month29', 'month30',
      'month31', 'month32', 'month33', 'month34', 'month35', 'month36',
    ];

    const TypeBenefitMonthRow = {
      row1: this.monthObjectArray,
      row2: this.monthObjectArray
    };

    const TypeBenefitMonthRowSum = {
      row1: this.monthObjectSumRow,
      row2: this.monthObjectSumRow
    };

    const TypeBenefitYearRow = {
      row1: [],
      row2: [],
      row3: []
    };

    const TypeBenefitYearRowSum = {
      row1: 0,
      row2: 0,
      row3: 0
    };

    for (let i = 0; i < TypeBenefit.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === TypeBenefit.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            Object.keys(this.monthObject).forEach(name => {
              TypeBenefitMonthRow[Row][name].push(Number(TypeBenefit.at(i).get(monthRow).value[name]));
            });
            break;
          case 'One time':
            Object.keys(this.monthObject).forEach(name => {
              TypeBenefitMonthRow[Row][name].push(Number(TypeBenefit.at(i).get(monthRow).value[name] * 0.1));
            });
            break;
        }
      }
    }

    Object.keys(this.monthObject).forEach(name => {
      TypeBenefitMonthRowSum[Row][name] = TypeBenefitMonthRow[Row][name].reduce((a, b) => a + b, 0);
    });

    Object.keys(this.monthObject).forEach(name => {
      this.TypeBenefitTotalForm.get(monthRow).patchValue({
        [name]: TypeBenefitMonthRowSum[Row][name] ? TypeBenefitMonthRowSum[Row][name] : null
      });
    });

    for (let start = 0; start < 36; start++) {
      if (TypeBenefit.at(index).get(monthRow).value[monthRunRateArray[start]]) {
        this.startBenefit = start;
        break;
      }
    }

    if (this.startBenefit != null) {
      monthRunRateArray.forEach((month, i) => {
        if ((this.startBenefit <= i) && (i < (this.startBenefit + 12))) {
          TypeBenefitYearRow[Row].push(Number(TypeBenefit.at(index).get(monthRow).value[month]));
        }
      });
    }

    TypeBenefitYearRowSum[Row] = TypeBenefitYearRow[Row].reduce((a, b) => a + b, 0);

    TypeBenefit.at(index).get('runRate').patchValue({ [Row]: TypeBenefitYearRowSum[Row] ? TypeBenefitYearRowSum[Row] : null });

    this.CalculateBenefitTotal(Row);
  }

  CalculateImpiemantCostTotal(Row, monthRow) {
    const ImpiemantCostMonthRow = { row1: [], row2: [] };
    const ImpiemantCostMonthRowSum = { row1: 0, row2: 0 };
    Object.keys(this.monthObject).forEach(name => {
      ImpiemantCostMonthRow[Row].push(Number(this.ImpiemantCostForm.controls[monthRow].value[name]));
    });
    ImpiemantCostMonthRowSum[Row] = ImpiemantCostMonthRow[Row].reduce((a, b) => a + b, 0);
    this.ImpiemantCostForm.get('runRate').patchValue({ [Row]: ImpiemantCostMonthRowSum[Row] ? ImpiemantCostMonthRowSum[Row] : null });
  }

  UpdatePatch(index, row, monthRow, month, num) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    if (this.isAutoCalculate) {
      if (row !== 'row3') {
        const typeOfBenefit = this.recurringAndOneTime.filter(
          obj => obj.typeOfBenefitCode === FirstRunRate.at(index).get('typeOfBenefit').value
        );
        if (typeOfBenefit.length !== 0) {
          switch (typeOfBenefit[0].typeOfBenefitGroup) {
            case 'Recurring':
              if (month === 'month1') {
                for (let m = 0; m < 36; m++) { this.monthObjectAuto[this.monthArray[m]] = null; }
              } else {
                for (let m = 0; m < 36; m++) { this.monthObjectAuto[this.monthArray[m]] = null; }
                for (let m = 0; m < num; m++) { delete this.monthObjectAuto[this.monthArray[m]]; }
              }
              Object.keys(this.monthObjectAuto).forEach(name => {
                FirstRunRate.at(index).get(monthRow).patchValue(
                  { [name]: FirstRunRate.at(index).get(monthRow).value[month] }
                );
              });
              this.CalculateMonthTotal(index, row, monthRow);
              break;
          }
        }
      }
    }
  }

  ChangeAutoCalculate(event) {
    this.isAutoCalculate = event.target.checked ? true : false;
  }

  ChangeImpiemantCost() {
    this.ImpiemantCostTooltip = this.ImpiemantCostForm.controls.typeOfBenefit.value;
  }

  AddMonthRow() {
    const FirstRunRateForm = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const TypeBenefitForm = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;

    FirstRunRateForm.push(this.InitialFirstRunRate());
    TypeBenefitForm.push(this.InitialTypeBenefit());

    this.isCheckRecurring.push(true);
    this.isCheckOneTime.push(false);

    this.monthRowTableLength = FirstRunRateForm.length;
    this.isRemoveFirstRunRate = FirstRunRateForm.length > 1 ? false : true;

    setTimeout(() => {
      if (this.stage === 'IL1') {
        for (let i = 0; i < FirstRunRateForm.length; i++) {
          FirstRunRateForm.at(i).get('runRate').get('row1').setValidators([Validators.required]);
          FirstRunRateForm.at(i).get('runRate').get('row1').updateValueAndValidity();
        }
      }
      if (this.stage === 'IL3') {
        for (let i = 0; i < FirstRunRateForm.length; i++) {
          FirstRunRateForm.at(i).get('runRate').get('row2').setValidators([Validators.required]);
          FirstRunRateForm.at(i).get('runRate').get('row2').updateValueAndValidity();
        }
      }
      if (this.stage === 'IL4') {
        for (let i = 0; i < FirstRunRateForm.length; i++) {
          FirstRunRateForm.at(i).get('runRate').get('row3').setValidators([Validators.required]);
          FirstRunRateForm.at(i).get('runRate').get('row3').updateValueAndValidity();
        }
      }
    }, 200);

    this.GetRecurringAndOnetimeArray();
  }

  RemoveRow(index) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;

    FirstRunRate.removeAt(index);
    TypeBenefit.removeAt(index);

    FirstRunRate.markAsDirty();
    TypeBenefit.markAsDirty();

    this.monthRowTableLength = FirstRunRate.length;
    this.isRemoveFirstRunRate = FirstRunRate.length > 1 ? false : true;

    this.groupBenefit.splice(index, 1);
    this.titleBenefit.splice(index, 1);

    const monthObject = { row1: 'monthRows1', row2: 'monthRows2', row3: 'monthRows3' };

    for (let j = 0; j < FirstRunRate.length; j++) {
      for (const [Row, monthRow] of Object.entries(monthObject)) {
        this.CalculateMonthTotal(j, Row, monthRow);
        this.CalculateRunRateTotal(Row);
        if (Row !== 'row3') {
          this.CalculateMonthBenefitTotal(j, Row, monthRow);
          this.CalculateBenefitTotal(Row);
        }
      }
    }

  }

  AddIndirect() {
    const Indirect = this.IndirectForm.get('indirectTable') as FormArray;
    Indirect.push(this.InitialIndirect());

    this.isIndirectRecurring.push(true);
    this.isIndirectOneTime.push(false);

    this.isRemoveIndirect = Indirect.length > 1 ? false : true;

    this.GetRecurringAndOnetimeIndirect();
  }

  RemoveIndirect(index) {
    const Indirect = this.IndirectForm.get('indirectTable') as FormArray;
    Indirect.removeAt(index);
    this.isRemoveIndirect = Indirect.length > 1 ? false : true;
  }

  CopyTable() {
    this.isShowTable = true;
    setTimeout(() => {
      if (document.createRange && window.getSelection) {
        const selTable = document.querySelector('#CopyFirstRunRateForm');
        const range = document.createRange();
        window.getSelection().removeAllRanges();
        try {
          range.selectNode(selTable);
          window.getSelection().addRange(range);
        } catch (e) {
          range.selectNode(selTable);
          window.getSelection().addRange(range);
        }
      }
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      this.swalTool.Copied();
      this.isShowTable = false;
    }, 100);
  }

  typeOfBenefitTable(index) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const typeOfBenefit = this.recurringAndOneTime.filter(
      obj => obj.typeOfBenefitCode === FirstRunRate.at(index).get('typeOfBenefit').value
    );
    return typeOfBenefit[0].typeOfBenefitGroup + ' - ' + typeOfBenefit[0].typeOfBenefitTitle;
  }

  VersionPriceTable(index, row) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return FirstRunRate.at(index).get('versionPrice').value[row];
  }

  RunRateTable(index, row) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return FirstRunRate.at(index).get('runRate').value[row];
  }

  MonthTable(index, row, month) {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    return FirstRunRate.at(index).get(row).value[month];
  }

  VersionPriceTotal(row) {
    return this.FirstRunRateTotalForm.get('versionPrice').value[row];
  }

  RunRateTotal(row) {
    return this.FirstRunRateTotalForm.get('runRate').value[row];
  }

  MonthTotal(row, month) {
    return this.FirstRunRateTotalForm.get(row).value[month];
  }

  CalculateTotalImpact() {
    const FirstRunRateTotal = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;

    const totalRecurring = [];
    let totalRecurringSum = 0;

    const totalOnetime = [];
    let totalOnetimeSum = 0;

    for (let i = 0; i < FirstRunRateTotal.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === FirstRunRateTotal.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            if (this.FirstRunRateTotalForm.controls.runRate.value.row3) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row3));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row2) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row2));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row1) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row1));
            }
            break;
          case 'One time':
            if (this.FirstRunRateTotalForm.controls.runRate.value.row3) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row3 * 0.1));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row2) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row2 * 0.1));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row1) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row1 * 0.1));
            }
            break;
        }
      }
    }

    totalRecurringSum = totalRecurring.reduce((a, b) => a + b, 0);
    totalOnetimeSum   = totalOnetime.reduce((a, b) => a + b, 0);

    this.ImpactForm.patchValue({ totalRecurring: totalRecurringSum, totalOnetime: totalOnetimeSum });

    if (sessionStorage.getItem('TotalRecurringOneTime')) {
      const result = Number(sessionStorage.getItem('TotalRecurringOneTime'));
      this.initiativeService.UpdateBenefitAmount(this.id, { benefitAmount : result.toFixed(3)}).subscribe(() => {});
    } else {
      const result = parseFloat(this.ImpactForm.controls.totalRecurring.value) + parseFloat(this.ImpactForm.controls.totalOnetime.value);
      this.initiativeService.UpdateBenefitAmount(this.id, { benefitAmount : result.toFixed(3)}).subscribe(() => {});
    }
  }

  CalculateTotal() {
    const FirstRunRateTotal = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;

    const totalRecurring = [];
    let totalRecurringSum = 0;

    const totalOnetime = [];
    let totalOnetimeSum = 0;

    for (let i = 0; i < FirstRunRateTotal.length; i++) {
      const typeOfBenefit = this.recurringAndOneTime.filter(
        obj => obj.typeOfBenefitCode === FirstRunRateTotal.at(i).get('typeOfBenefit').value
      );
      if (typeOfBenefit.length !== 0) {
        // FirstRunRateTotal.at(i).enable();
        switch (typeOfBenefit[0].typeOfBenefitGroup) {
          case 'Recurring':
            if (this.FirstRunRateTotalForm.controls.runRate.value.row3) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row3));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row2) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row2));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row1) {
              totalRecurring.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row1));
            }
            break;
          case 'One time':
            if (this.FirstRunRateTotalForm.controls.runRate.value.row3) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row3 * 0.1));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row2) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row2 * 0.1));
            } else if (this.FirstRunRateTotalForm.controls.runRate.value.row1) {
              totalOnetime.push(Number(FirstRunRateTotal.at(i).get('runRate').value.row1 * 0.1));
            }
            break;
        }
      }
    }

    totalRecurringSum = totalRecurring.reduce((a, b) => a + b, 0);
    totalOnetimeSum   = totalOnetime.reduce((a, b) => a + b, 0);

    this.ImpactForm.patchValue({ totalRecurring: totalRecurringSum, totalOnetime: totalOnetimeSum });

    const result = parseFloat(this.ImpactForm.controls.totalRecurring.value) + parseFloat(this.ImpactForm.controls.totalOnetime.value);
    result.toFixed(3);
    sessionStorage.setItem('TotalRecurringOneTime', JSON.stringify(result));
  }

  CalculateTotalCostOPEX() {
    if (this.HaveImpiemantCost.controls.haveImpiemantCost.value === 'true') {
      if (this.ImpiemantCostForm.controls.runRate.value.row2) {
        const opex = { requestOpex: 'true', costEstOpex: this.ImpiemantCostForm.controls.runRate.value.row2 };
        this.initiativeService.UpdateRequestOpex(this.id, opex).subscribe(() => { });
        this.ImpactForm.patchValue({ totalCostOPEX: this.ImpiemantCostForm.controls.runRate.value.row2 });
      } else if (this.ImpiemantCostForm.controls.runRate.value.row1) {
        const opex = { requestOpex: 'true', costEstOpex: this.ImpiemantCostForm.controls.runRate.value.row1 };
        this.ImpactForm.patchValue({ totalCostOPEX: this.ImpiemantCostForm.controls.runRate.value.row1 });
      } else {
        const opex = { requestOpex: 'true', costEstOpex: this.costEstOpex };
        this.ImpactForm.patchValue({ totalCostOPEX: 0 });
      }
    } else {
      this.ImpactForm.patchValue({ totalCostOPEX: null });
      this.initiativeService.UpdateRequestOpex(this.id, { requestOpex: 'no' }).subscribe(() => { });
      this.impactService.DeleteImpiemantCost(this.id).subscribe(() => { });
    }
  }

  PatchForm() {
    this.ImpactForm.patchValue({
      id: this.Impact ? this.Impact : 0,
      financialImpactArea: this.financialImpactArea.controls.financialImpactArea.value,
      haveShareBenefit: this.HaveShareBenefit.controls.haveShareBenefit.value,
      iL4RunRateRecurring: this.iL4RunRateRecurringSum ? this.iL4RunRateRecurringSum.toFixed(3) : null,
      iL5RunRateRecurring: this.iL5RunRateRecurringSum ? this.iL5RunRateRecurringSum.toFixed(3) : null,
      iL4RunRateOnetime  : this.iL4RunRateOnetimeSum   ? this.iL4RunRateOnetimeSum.toFixed(3)   : null,
      iL5RunRateOnetime  : this.iL5RunRateOnetimeSum   ? this.iL5RunRateOnetimeSum.toFixed(3)   : null,
      iL5FixedFxRecurring: this.iLForm.controls.iL5FixedFxRecurring.value,
      iL5FloatFxRecurring: this.iLForm.controls.iL5FloatFxRecurring.value,
      iL5FixedFxOnetime: this.iLForm.controls.iL5FixedFxOnetime.value,
      iL5FloatFxOnetime: this.iLForm.controls.iL5FloatFxOnetime.value,
      firstRunRateMonth: this.dateUtil.SetDate(this.monthForm.controls.firstRunRateMonth.value),
      autoCalculate: this.CalculateForm.controls.calculate.value,
      indirectBenefit: this.IndirectBenefit.controls.indirectBenefit.value,
      explanation: this.explanationForm.controls.explanation.value,
      impiemantCost: this.HaveImpiemantCost.controls.haveImpiemantCost.value,
      toComment: this.toCommentForm.controls.toComment.value,
      remark1: this.remarkForm.controls.remark1.value,
      remark2: this.remarkForm.controls.remark2.value,
      remark3: this.remarkForm.controls.remark3.value,
      remark4: this.remarkForm.controls.remark4.value,
      remark5: this.remarkForm.controls.remark5.value,
      initiativeId: this.id
    });
  }

  StageSave() {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const stage1 = ['IL0', 'SIL1', 'IL1', 'SIL2', 'IL2', 'SIL3'];
    const stage2 = ['IL3', 'SIL4'];
    const stage3 = ['IL4', 'SIL5', 'IL5'];
    for (let i = 0; i < FirstRunRate.length; i++) {
      FirstRunRate.at(i).get('typeOfBenefit').enable();
      if (stage1.indexOf(this.stage) !== -1) {
        FirstRunRate.at(i).get('runRate').get('row2').enable();
        FirstRunRate.at(i).get('runRate').get('row3').enable();
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRate.at(i).get('monthRows2').get([name]).enable();
          FirstRunRate.at(i).get('monthRows3').get([name]).enable();
        });
      } else if (stage2.indexOf(this.stage) !== -1) {
        FirstRunRate.at(i).get('runRate').get('row1').enable();
        FirstRunRate.at(i).get('runRate').get('row3').enable();
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRate.at(i).get('monthRows1').get([name]).enable();
          FirstRunRate.at(i).get('monthRows3').get([name]).enable();
        });
      } else if (stage3.indexOf(this.stage) !== -1) {
        FirstRunRate.at(i).get('runRate').get('row1').enable();
        FirstRunRate.at(i).get('runRate').get('row2').enable();
        if (this.stage === 'IL5') {
          FirstRunRate.at(i).get('runRate').get('row3').enable();
        }
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRate.at(i).get('monthRows1').get([name]).enable();
          FirstRunRate.at(i).get('monthRows3').get([name]).enable();
        });
      }
    }
  }

  StageDraft() {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const stage1 = ['IL0', 'SIL1', 'IL1', 'SIL2', 'IL2', 'SIL3'];
    const stage2 = ['IL3', 'SIL4'];
    const stage3 = ['IL4', 'SIL5', 'IL5'];
    for (let i = 0; i < FirstRunRate.length; i++) {
      if (stage1.indexOf(this.stage) !== -1) {
        FirstRunRate.at(i).get('runRate').get('row2').disable();
        FirstRunRate.at(i).get('runRate').get('row3').disable();
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRate.at(i).get('monthRows2').get([name]).disable();
          FirstRunRate.at(i).get('monthRows3').get([name]).disable();
        });
      } else if (stage2.indexOf(this.stage) !== -1) {
        if (FirstRunRate.at(i).get('runRate').value.row1 === FirstRunRate.at(i).get('runRate').value.row2) {
          FirstRunRate.at(i).get('runRate').patchValue({ row2: FirstRunRate.at(i).get('runRate').value.row1 });
          FirstRunRate.at(i).get('runRate').get('row1').disable();
          FirstRunRate.at(i).get('runRate').get('row3').disable();
          Object.keys(this.monthObject).forEach(name => {
            FirstRunRate.at(i).get('monthRows2').patchValue({ [name]: FirstRunRate.at(i).get('monthRows1').value[name] });
            FirstRunRate.at(i).get('monthRows1').get([name]).disable();
            FirstRunRate.at(i).get('monthRows3').get([name]).disable();
          });
          this.CalculateMonthTotal(i, 'row2', 'monthRows2');
        } else if (FirstRunRate.at(i).get('runRate').value.row1 !== FirstRunRate.at(i).get('runRate').value.row2) {
          if (FirstRunRate.at(i).get('runRate').value.row2) {
            FirstRunRate.at(i).get('runRate').patchValue({ row2: FirstRunRate.at(i).get('runRate').value.row2 });
            FirstRunRate.at(i).get('runRate').get('row1').disable();
            FirstRunRate.at(i).get('runRate').get('row3').disable();
            Object.keys(this.monthObject).forEach(name => {
              FirstRunRate.at(i).get('monthRows2').patchValue({ [name]: FirstRunRate.at(i).get('monthRows2').value[name] });
              FirstRunRate.at(i).get('monthRows1').get([name]).disable();
              FirstRunRate.at(i).get('monthRows3').get([name]).disable();
            });
          } else {
            FirstRunRate.at(i).get('runRate').patchValue({ row2: FirstRunRate.at(i).get('runRate').value.row1 });
            FirstRunRate.at(i).get('runRate').get('row1').disable();
            FirstRunRate.at(i).get('runRate').get('row3').disable();
            Object.keys(this.monthObject).forEach(name => {
              if (FirstRunRate.at(i).get('monthRows2').value[name] === 0) {
                FirstRunRate.at(i).get('monthRows2').patchValue({ [name]: 0 });
              } else {
                FirstRunRate.at(i).get('monthRows2').patchValue({ [name]: FirstRunRate.at(i).get('monthRows1').value[name] });
              }
              FirstRunRate.at(i).get('monthRows1').get([name]).disable();
              FirstRunRate.at(i).get('monthRows3').get([name]).disable();
            });
            this.CalculateMonthTotal(i, 'row2', 'monthRows2');
          }
        }
      } else if (stage3.indexOf(this.stage) !== -1) {
        FirstRunRate.at(i).get('runRate').get('row1').disable();
        FirstRunRate.at(i).get('runRate').get('row2').disable();
        if (this.stage === 'IL5') {
          FirstRunRate.at(i).get('runRate').get('row3').disable();
        }
        Object.keys(this.monthObject).forEach(name => {
          FirstRunRate.at(i).get('monthRows1').get([name]).disable();
          FirstRunRate.at(i).get('monthRows3').get([name]).disable();
        });
        this.ChangeMonth(this.monthForm.controls.firstRunRateMonth.value);
      }
      const stage45 = ['IL4', 'SIL4', 'IL5', 'SIL5'];
      if (!(stage45.indexOf(this.stage) !== -1)) {
        FirstRunRate.at(i).get('typeOfBenefit').enable();
      } else {
        FirstRunRate.at(i).get('typeOfBenefit').disable();
      }
    }
  }

  CheckShareBenefit() {
    if (this.HaveShareBenefit.controls.haveShareBenefit.value === 'false') {
      if (this.shareBenefitWorkstreams.length !== 0) {
        this.impactService.DeleteShareBenefitWorkstream(this.id).subscribe(() => { });
      }
    }
  }

  SILAchievement() {
    const stage4 = ['IL4', 'SIL4'];
    const stage5 = ['IL5', 'SIL5'];

    if (stage4.indexOf(this.stage) !== -1) {
      if (!this.SIL4Achievement) {
        const yearDate = new Date(new Date().getFullYear(), 11, 31);
        const todaysDate = new Date();
        if (yearDate.toTimeString() === todaysDate.toTimeString()) {
          this.ImpactForm.patchValue({ sIL4Achievement: new Date().getFullYear() });
        }
      } else {
        this.ImpactForm.patchValue({ sIL4Achievement: this.SIL4Achievement });
      }
    }

    if (stage5.indexOf(this.stage) !== -1) {
      if (!this.SIL5Achievement) {
        const yearDate = new Date(new Date().getFullYear(), 11, 31);
        const todaysDate = new Date();
        if (yearDate.toTimeString() === todaysDate.toTimeString()) {
          this.ImpactForm.patchValue({ sIL5Achievement: new Date().getFullYear() });
        }
      } else {
        this.ImpactForm.patchValue({ sIL5Achievement: this.SIL5Achievement });
      }
    }
  }

  SetNumberFirstRunRate() {
    const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    for (let i = 0; i < FirstRunRate.length; i++) {
      if (FirstRunRate.at(i).get('runRate').value.row1) {
        FirstRunRate.at(i).get('runRate').patchValue( { row1 : Number(FirstRunRate.at(i).get('runRate').value.row1) });
      } else if (FirstRunRate.at(i).get('runRate').value.row1 === 0) {
        FirstRunRate.at(i).get('runRate').patchValue( { row1 : 0 });
      } else {
        FirstRunRate.at(i).get('runRate').patchValue( { row1 : null });
      }

      if (FirstRunRate.at(i).get('runRate').value.row2) {
        FirstRunRate.at(i).get('runRate').patchValue( { row2 : Number(FirstRunRate.at(i).get('runRate').value.row2) });
      } else if (FirstRunRate.at(i).get('runRate').value.row2 === 0) {
        FirstRunRate.at(i).get('runRate').patchValue( { row2 : 0 });
      } else {
        FirstRunRate.at(i).get('runRate').patchValue( { row2 : null });
      }

      if (FirstRunRate.at(i).get('runRate').value.row3) {
        FirstRunRate.at(i).get('runRate').patchValue( { row3 : Number(FirstRunRate.at(i).get('runRate').value.row3) });
      } else if (FirstRunRate.at(i).get('runRate').value.row3 === 0) {
        FirstRunRate.at(i).get('runRate').patchValue( { row3 : 0 });
      } else {
        FirstRunRate.at(i).get('runRate').patchValue( { row3 : null });
      }

      // FirstRunRate.at(i).get('runRate').patchValue( { row1 : Number(FirstRunRate.at(i).get('runRate').value.row1) });
      // FirstRunRate.at(i).get('runRate').patchValue( { row2 : Number(FirstRunRate.at(i).get('runRate').value.row2) });
      // FirstRunRate.at(i).get('runRate').patchValue( { row3 : Number(FirstRunRate.at(i).get('runRate').value.row3) });

      ['monthRows1', 'monthRows2', 'monthRows3'].forEach(row => {
        Object.keys(this.monthObject).forEach(name => {
          if (FirstRunRate.at(i).get([row]).value[name] === 0 || FirstRunRate.at(i).get([row]).value[name] === '0') {
            FirstRunRate.at(i).get([row]).patchValue({ [name]: 0 });
          } else {
            const value = Number(FirstRunRate.at(i).get([row]).value[name]);
            FirstRunRate.at(i).get([row]).patchValue({ [name]: value ? value : null });
          }
        });
      });
    }
  }

  SetNumberTypeBenefit() {
    const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
    for (let i = 0; i < TypeBenefit.length; i++) {
      ['monthRows1', 'monthRows2'].forEach(row => {
        Object.keys(this.monthObject).forEach(name => {
          const value = Number(TypeBenefit.at(i).get([row]).value[name]);
          TypeBenefit.at(i).get([row]).patchValue({ [name]: value ? value : null });
        });
      });
    }
  }

  Save(type) {
    this.SILAchievement();

    this.CheckShareBenefit();

    this.CalculateTotalCostOPEX();

    // this.CalculateTotal();

    this.PatchForm();

    this.Impact ?
      this.impactService.UpdateImpact(this.id, this.ImpactForm.value).subscribe(() => { }) :
      this.impactService.CreateImpact(this.id, this.ImpactForm.value).subscribe((result) => this.Impact = result.id);

    if (this.HaveShareBenefit.controls.haveShareBenefit.value === 'true') {
      this.impactService.CreateShareBenefitWorkstream(this.id, this.ShareBenefitFrom.value).subscribe(() => {});
    }

    setTimeout(() => {
      this.StageSave();
      this.SetNumberFirstRunRate();
      const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
      if (FirstRunRate.at(0).get('typeOfBenefit').value) {
        this.impactService.CreateFirstRunRate(this.id, this.FirstRunRateForm.value).subscribe(() => {});
      }
      setTimeout(() => this.StageDraft(), 500);
    }, 1000);

    setTimeout(() => {
      if (this.IndirectBenefit.controls.indirectBenefit.value === 'true') {
        if (this.IndirectForm.valid) {
          this.impactService.CreateIndirect(this.id, this.IndirectForm.value).subscribe(() => {});
        }
      }
    }, 1100);

    setTimeout(() => {
      if (this.HaveImpiemantCost.controls.haveImpiemantCost.value === 'true') {
        if (this.ImpiemantCostForm.valid) {
          this.impactService.CreateImpiemantCost(this.id, this.ImpiemantCostForm.value).subscribe(() => {});
        }
      }
    }, 1200);

    setTimeout(() => {
      this.SetNumberTypeBenefit();
      const TypeBenefit = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
      if (TypeBenefit.at(0).get('typeOfBenefit').value) {
        this.impactService.CreateTypeBenefitForm(this.id, this.TypeBenefitForm.value).subscribe(() => { });
      }
    }, 1300);
  }

  Draft(page) {
    if (page === 'impact') {
      this.Save('draft');
    }
  }

  SetMarkAsTouchedForm() {
    // Target
    if (this.stage === 'IL1') {
      this.financialImpactArea.controls.financialImpactArea.markAsTouched();
      setTimeout(() => {
        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        for (let i = 0; i < FirstRunRate.length; i++) {
          FirstRunRate.at(i).get('typeOfBenefit').markAsTouched();
          FirstRunRate.at(i).get('runRate').get('row1').markAsTouched();
        }
      }, 500);
    }
    // Revise
    if (this.stage === 'IL3') {
      setTimeout(() => {
        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        for (let i = 0; i < FirstRunRate.length; i++) {
          FirstRunRate.at(i).get('typeOfBenefit').markAsTouched();
          FirstRunRate.at(i).get('runRate').get('row2').markAsTouched();
        }
      }, 500);
    }
    // Actual
    if (this.stage === 'IL4') {
      setTimeout(() => {
        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        for (let i = 0; i < FirstRunRate.length; i++) {
          FirstRunRate.at(i).get('typeOfBenefit').markAsTouched();
          FirstRunRate.at(i).get('runRate').get('row3').markAsTouched();
        }
      }, 500);
    }
  }

  Submit(page) {
    if (page === 'impact') {
      this.SetMarkAsTouchedForm();
      if (this.invalidSubmit) {
        // this.CalculateTotalImpact();
        this.Save('submit');
      } else {
        this.swalTool.Required();
      }
    }
  }
}
