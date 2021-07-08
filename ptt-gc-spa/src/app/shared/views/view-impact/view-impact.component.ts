import { SwalTool } from './../../tools/swal.tools';
import { MaxService } from '@services/max/max.service';
import { ResponseService } from '@errors/response/response.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ImpactService } from '@services/impact/impact.service';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { StatusService } from '@services/status/status.service';
import { InitiativeService } from '@services/initiative/initiative.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-impact',
  templateUrl: './view-impact.component.html',
  styleUrls: ['./view-impact.component.css']
})
export class ViewImpactComponent implements OnInit {

  @ViewChild('ViewLogHistoryModal', { static: false }) ViewLogHistoryModal: ModalDirective;

  @ViewChild('HistoryStatus', { static: false }) HistoryStatus: ModalDirective;

  @ViewChild('ContactIO', { static: false }) ContactIO: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private swalTool: SwalTool,
    private spinner: NgxSpinnerService,
    private maxService: MaxService,
    private response: ResponseService,
    private impactService: ImpactService,
    private statusService: StatusService,
    private initiativeService: InitiativeService
  ) { }

  @Input() id;
  @Input() stage;

  history: string;
  IsApprove: boolean;
  subWorkstream1: string;

  financialImpactArea = this.fb.group({ financialImpactArea: '' });

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

  explanationForm = this.fb.group({ explanation: '' });

  toCommentForm = this.fb.group({ toComment: '' });

  remarkForm = this.fb.group({
    remark1: '',
    remark2: '',
    remark3: '',
    remark4: '',
    remark5: '',
  });

  ImpactForm = this.fb.group({
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
    explanation: '',
    impiemantCost: '',
    toComment: '',
    remark1: '',
    remark2: '',
    remark3: '',
    remark4: '',
    remark5: '',
    initiativeId: ''
  });

  titleBenefit: any = [];
  FirstRunRateList: any = [];
  FirstRunRateTypeOfBenefit: any = [];
  recurringAndOneTime: any = [];
  groupBenefit: any = [];
  isCheckRecurring: any = [];
  isCheckOneTime: any = [];
  recurringAndOneTimeArray: any = [];
  recurring: any = [];
  onetime: any = [];
  FirstRunRateLength: number;
  FirstRunRateStart: number;

  TypeOfBenefitList: any = [];
  TypeOfBenefitSelect: any = [];
  TypeOfBenefitStart: number;
  TypeOfBenefitLength: number;

  titleIndirect: any = [];

  IndirectList: any = [];
  IndirectSelect: any = [];
  IndirectStart: number;
  IndirectLength: number;

  isIndirectRecurring: any = [];
  isIndirectOneTime: any = [];

  recurringAndOneTimeIndirect: any = [];
  recurringIndirect: any = [];
  onetimeIndirect: any = [];

  isHaveShareBenefit  = 'false';
  isHaveImpiemantCost = 'false';
  isIndirectBenefit   = 'false';

  ImpiemantCostList: any = [];

  monthRowTableLength: number;

  isRemoveFirstRunRate = true;
  isRemoveShareBenefit = true;

  HaveShareBenefit = this.fb.group({ haveShareBenefit: 'false' });

  ShareBenefitFrom = this.fb.group({ shareBenefitWorkstreams: this.fb.array([]) });

  monthForm = this.fb.group({ firstRunRateMonth: [(new Date())] });

  CalculateForm = this.fb.group({ calculate: true });

  HaveImpiemantCost = this.fb.group({ haveImpiemantCost: 'false' });

  itemsMonth: any = [];
  monthName: string;
  formattedDate: string;
  month: number;
  year: number;

  months = ['MONTH', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

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

  monthArray = Object.keys(this.monthObject);

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
    monthRows1: this.fb.group(this.monthObject),
    monthRows2: this.fb.group(this.monthObject),
    monthRows3: this.fb.group(this.monthObject)
  });

  ImpiemantCostForm = this.fb.group({
    id: [0],
    versionPrice: this.fb.group({
      row1: 'Estimate cost',
      row2: 'Actual',
    }),
    runRate: this.fb.group({
      row1: { value: '', disabled: true },
      row2: { value: '', disabled: true },
    }),
    monthRows1: this.fb.group(this.monthObject),
    monthRows2: this.fb.group(this.monthObject)
  });

  IndirectBenefit = this.fb.group({ indirectBenefit: 'false' });

  IndirectForm = this.fb.group({ indirectTable: this.fb.array([]) });

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
    monthRows1: this.fb.group(this.monthObject),
    monthRows2: this.fb.group(this.monthObject)
  });

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

  shareBenefitWorkstreams: any = [];

  IsFirstRunRate: boolean;

  isShowTable = false;
  isOpenCopy = true;

  ngOnInit(): void {
    this.GetImpactTracking();
    if (this.id) { this.GetSuggestStatus(this.id); }
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      const check = { status: response.status, stage: response.stage };
      this.statusService.CheckApproveInformation(check).subscribe((result) => this.IsApprove = result ? true : false);
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

  ShowContactIO() {
    this.ContactIO.show();
  }

  CloseContactIO() {
    this.ContactIO.hide();
  }

  ChangeMonth(value: Date): void {
    this.formattedDate = this.months[new Date(value).getMonth() + 1] + ' ' + new Date(value).getFullYear();
    this.year = new Date(value).getFullYear();
    this.month = new Date(value).getMonth();
    this.CalculateMonthYear();
    this.monthName = this.formattedDate;
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

  InitialFirstRunRate(): FormGroup {
    return this.fb.group({
      id: [0],
      typeOfBenefitGroup: 'recurring',
      typeOfBenefit: null,
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

  AddMonthRow() {
    const FirstRunRateForm = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
    const TypeBenefitForm = this.TypeBenefitForm.get('typeBenefitTable') as FormArray;
    FirstRunRateForm.push(this.InitialFirstRunRate());
    TypeBenefitForm.push(this.InitialTypeBenefit());
    this.isCheckRecurring.push(true);
    this.isCheckOneTime.push(false);
    this.monthRowTableLength = FirstRunRateForm.length;
    this.isRemoveFirstRunRate = FirstRunRateForm.length > 1 ? false : true;
    this.GetRecurringAndOnetimeArray();
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

  InitialShareBenefitFrom(): FormGroup {
    return this.fb.group({ id: [0], workstream: null, percent: '', initiativeId: this.id });
  }

  AddShareBenefit() {
    const control = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
    control.push(this.InitialShareBenefitFrom());
    this.isRemoveShareBenefit = control.length > 1 ? false : true;
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

  AddIndirect() {
    const Indirect = this.IndirectForm.get('indirectTable') as FormArray;
    Indirect.push(this.InitialIndirect());

    this.isIndirectRecurring.push(true);
    this.isIndirectOneTime.push(false);

    this.GetRecurringAndOnetimeIndirect();
  }

  FirstRunRateLoading() {
    setTimeout(() => {
      this.spinner.hide();
      this.IsFirstRunRate = false;
    }, 400);
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

  async GetImpactTracking() {
    this.impactService.GetShareBenefitWorkstream(this.id).subscribe(response => {
      this.shareBenefitWorkstreams = response.shareBenefitWorkstreams;
      if (this.shareBenefitWorkstreams !== 0) {
        const ShareBenefit = this.ShareBenefitFrom.get('shareBenefitWorkstreams') as FormArray;
        for (let i = 0; i < this.shareBenefitWorkstreams.length; i++) {
          ShareBenefit.push(this.InitialShareBenefitFrom());
          ShareBenefit.at(i).patchValue(this.shareBenefitWorkstreams[i]);
          ShareBenefit.at(i).get('id').patchValue(0);
          ShareBenefit.at(i).disable();
        }
        this.isRemoveShareBenefit = ShareBenefit.length > 1 ? false : true;
      }
    }, error => this.response.error(error));

    this.maxService.GetDetailMax(this.id).subscribe(response => {
      if (response.max) {
        this.subWorkstream1 = response.detailInformations.subWorkstream1;
      }
    });

    this.impactService.GetImpactTracking(this.id).subscribe(async response => {
      this.impactService.GetRecurringAndOneTimeSelect().subscribe(recurringAndOneTime => this.recurringAndOneTime = recurringAndOneTime);
      this.remarkForm.disable();
      this.toCommentForm.disable();
      this.explanationForm.disable();
      this.IndirectBenefit.disable();
      this.HaveImpiemantCost.disable();
      this.financialImpactArea.disable();
      this.HaveShareBenefit.disable();
      this.CalculateForm.disable();
      this.monthForm.disable();

      this.IsFirstRunRate = true;
      this.spinner.show();

      if (response) {
        this.financialImpactArea.patchValue(response);
        this.ChangeMonth(response.firstRunRateMonth);
        this.monthForm.patchValue({ firstRunRateMonth: this.formattedDate });
        this.remarkForm.patchValue(response);

        if (response.haveShareBenefit) {
          this.HaveShareBenefit.patchValue({ haveShareBenefit: 'true' });
          this.isHaveShareBenefit = 'true';
        } else {
          this.HaveShareBenefit.patchValue({ haveShareBenefit: 'false' });
          this.isHaveShareBenefit = 'false';
        }

        if (response.indirectBenefit) {
          this.IndirectBenefit.patchValue({ indirectBenefit: 'true' });
          this.isIndirectBenefit = 'true';
        } else {
          this.IndirectBenefit.patchValue({ indirectBenefit: 'false' });
          this.isIndirectBenefit = 'false';
        }

        if (response.impiemantCost) {
          this.HaveImpiemantCost.patchValue({ haveImpiemantCost: 'true' });
          this.isHaveImpiemantCost = 'true';
        } else {
          this.HaveImpiemantCost.patchValue({ haveImpiemantCost: 'false' });
          this.isHaveImpiemantCost = 'false';
        }

        if (response.autoCalculate) {
          this.CalculateForm.patchValue({ calculate: true });
          this.CalculateForm.controls.calculate.disable();
        } else {
          this.CalculateForm.patchValue({ calculate: false });
          this.CalculateForm.controls.calculate.disable();
        }

        this.explanationForm.patchValue({ explanation: response.explanation ? response.explanation : null });
        this.toCommentForm.patchValue({ toComment: response.toComment ? response.toComment : null });

        const FirstRunRate = this.FirstRunRateForm.get('firstRunRateTable') as FormArray;
        const Indirect     = this.IndirectForm.get('indirectTable')         as FormArray;
        const TypeBenefit  = this.TypeBenefitForm.get('typeBenefitTable')   as FormArray;

        const FirstRunRateList   = await this.impactService.GetFirstRunRate(this.id).toPromise();
        const IndirectList       = await this.impactService.GetIndirect(this.id).toPromise();
        const ImplementationList = await this.impactService.GetImplementationCost(this.id).toPromise();
        const TypeOfBenefit      = await this.impactService.GetTypeOfBenefit(this.id).toPromise();

        // -------------------- FirstRunRateList -------------------- //
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
            this.groupBenefit.push(typeOfBenefit[0].typeOfBenefitGroup);
            this.titleBenefit.push(typeOfBenefit[0].typeOfBenefitTitle);
            FirstRunRate.push(this.InitialFirstRunRate());
            TypeBenefit.push(this.InitialTypeBenefit());
            FirstRunRate.at(i - 1).patchValue({ typeOfBenefit: this.FirstRunRateTypeOfBenefit[i - 1] });
            TypeBenefit.at(i - 1).patchValue({ typeOfBenefit: this.FirstRunRateTypeOfBenefit[i - 1] });
            FirstRunRate.at(i - 1).disable();
            TypeBenefit.at(i - 1).disable();
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
                FirstRunRate.at(j).get('runRate').patchValue({ row1: this.FirstRunRateList[i].runRate });
                switch (typeOfBenefit[0].typeOfBenefitGroup) {
                  case 'Recurring': FirstRunRateRow.row1.push(this.FirstRunRateList[i].runRate); break;
                  case 'One time': FirstRunRateRow.row1.push(this.FirstRunRateList[i].runRate * 0.1); break;
                }
                FirstRunRateRowSum.row1 = FirstRunRateRow.row1.reduce((a, b) => a + b, 0);
              } else if (i % 3 === 1) {
                FirstRunRate.at(j).get('runRate').patchValue({ row2: this.FirstRunRateList[i].runRate });
                switch (typeOfBenefit[0].typeOfBenefitGroup) {
                  case 'Recurring': FirstRunRateRow.row2.push(this.FirstRunRateList[i].runRate); break;
                  case 'One time': FirstRunRateRow.row2.push(this.FirstRunRateList[i].runRate * 0.1); break;
                }
                FirstRunRateRowSum.row2 = FirstRunRateRow.row2.reduce((a, b) => a + b, 0);
              } else if (i % 3 === 2) {
                FirstRunRate.at(j).get('runRate').patchValue({ row3: this.FirstRunRateList[i].runRate });
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
              [name]: FirstRunRateRowSum[name] ? FirstRunRateRowSum[name].toFixed(3) : null
            });
          });

          Object.keys(this.monthObject).forEach(name => {
            this.FirstRunRateTotalForm.get('monthRows1').patchValue({
              [name]: FirstRunRateMonthRowSum.row1[name] ? FirstRunRateMonthRowSum.row1[name].toFixed(3) : null
            });
          });

          Object.keys(this.monthObject).forEach(name => {
            this.FirstRunRateTotalForm.get('monthRows2').patchValue({
              [name]: FirstRunRateMonthRowSum.row2[name] ? FirstRunRateMonthRowSum.row2[name].toFixed(3) : null
            });
          });

          Object.keys(this.monthObject).forEach(name => {
            this.FirstRunRateTotalForm.get('monthRows3').patchValue({
              [name]: FirstRunRateMonthRowSum.row3[name] ? FirstRunRateMonthRowSum.row3[name].toFixed(3) : null
            });
          });

          for (let j = 0; j < (this.FirstRunRateList.length / 3); j++) {
            FirstRunRate.at(j).disable();
          }

          this.iLForm.patchValue({ iL4RunRate: this.FirstRunRateTotalForm.controls.runRate.get('row1').value });
          this.iLForm.patchValue({ iL5RunRate: this.FirstRunRateTotalForm.controls.runRate.get('row2').value });

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
          iL5RunRateRecurringSum = iL5RunRateRecurring.reduce((a, b) => a + b, 0);
          iL4RunRateOnetimeSum   = iL4RunRateOnetime.reduce((a, b) => a + b, 0);
          iL5RunRateOnetimeSum   = iL5RunRateOnetime.reduce((a, b) => a + b, 0);

          const stage4 = ['IL4', 'SIL4'];
          const stage5 = ['IL5', 'SIL5'];

          if (stage4.indexOf(this.stage) !== -1) {
            this.iLForm.patchValue({
              iL4RunRateRecurring : response.iL4RunRateRecurring ?
              response.iL4RunRateRecurring.toFixed(3) : iL4RunRateRecurringSum.toFixed(3)
            });
            this.iLForm.patchValue({
              iL4RunRateOnetime   : response.iL4RunRateOnetime   ?
              response.iL4RunRateOnetime.toFixed(3)   : iL4RunRateOnetimeSum.toFixed(3)
            });
          }

          if (stage5.indexOf(this.stage) !== -1) {
            this.iLForm.patchValue({
              iL4RunRateRecurring : response.iL4RunRateRecurring ?
              response.iL4RunRateRecurring.toFixed(3) : iL4RunRateRecurringSum.toFixed(3)
            });
            this.iLForm.patchValue({
              iL4RunRateOnetime   : response.iL4RunRateOnetime   ?
              response.iL4RunRateOnetime.toFixed(3)   : iL4RunRateOnetimeSum.toFixed(3)
            });
            this.iLForm.patchValue({
              iL5RunRateRecurring : response.iL5RunRateRecurring ?
              response.iL5RunRateRecurring.toFixed(3) : iL5RunRateRecurringSum.toFixed(3)
            });
            this.iLForm.patchValue({
              iL5RunRateOnetime   : response.iL5RunRateOnetime   ?
              response.iL5RunRateOnetime.toFixed(3)   : iL5RunRateOnetimeSum.toFixed(3)
            });
          }

          this.FirstRunRateLoading();

        } else {
          this.FirstRunRateLoading();
          this.AddMonthRow();
        }
        // -------------------- IndirectList -------------------------- //
        this.IndirectList = IndirectList;
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
              Indirect.at(i - 1).disable();
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
        }
        // -------------------- ImplementationList -------------------- //
        this.ImpiemantCostList = ImplementationList;
        if (this.ImpiemantCostList.length !== 0) {
          for (let i = 0; i <= 1; i++) {
            this.ImpiemantCostForm.patchValue({ typeOfBenefit: this.ImpiemantCostList[0].typeOfBenefit });
            if (i === 0) {
              this.ImpiemantCostForm.get('versionPrice').patchValue({ row1: this.ImpiemantCostList[i].versionPrice });
              this.ImpiemantCostForm.get('runRate').patchValue({ row1: this.ImpiemantCostList[i].runRate });
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
        // -------------------- TypeOfBenefit -------------------- //
        setTimeout(() => {
          const BenefitRunRateRow    = { row1: [], row2: [] };
          const BenefitRunRateRowSum = { row1: 0, row2: 0 };
          const BenefitMonthRow = {
            row1: this.monthBenefitArrayRow1,
            row2: this.monthBenefitArrayRow2,
          };
          const BenefitMonthRowSum = {
            row1: this.monthBenefitSumRow1,
            row2: this.monthBenefitSumRow2,
          };
          this.TypeOfBenefitList = TypeOfBenefit;
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
              TypeBenefit.at(j).disable();
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
                  [name]: BenefitMonthRowSum.row2[name] ? BenefitMonthRowSum.row2[name] : null
                });
              });


              this.iLForm.patchValue({ iL4ActualPriceFixedFx: this.TypeBenefitTotalForm.controls.runRate.get('row1').value });
              this.iLForm.patchValue({ iL5ActualPriceFloatFx: this.TypeBenefitTotalForm.controls.runRate.get('row2').value });

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
          }
        }, 100);
      } else {
        this.FirstRunRateLoading();
        this.monthForm.patchValue({ firstRunRateMonth: new Date() });
        this.ChangeMonth(this.monthForm.controls.firstRunRateMonth.value);
        this.AddMonthRow();
        this.monthForm.patchValue({ firstRunRateMonth: this.formattedDate });
      }
    });
  }
}
