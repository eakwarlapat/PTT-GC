import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MaxService } from '@services/max/max.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DateUtil } from '@utils/date.utils';
import { ImpactService } from '@services/impact/impact.service';
import { SwalTool } from '@tools/swal.tools';
import { DetailService } from '@services/detail/detail.service';
import { InitiativeService } from '@services/initiative/initiative.service';

@Component({
  selector: 'app-initiative-detail',
  templateUrl: './initiative-detail.component.html',
  styleUrls: ['./initiative-detail.component.css']
})
export class InitiativeDetailComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private initiativeService: InitiativeService,
    private detailService: DetailService,
    private impactService: ImpactService,
    private maxService: MaxService,
    private dateUtil: DateUtil,
    private swalTool: SwalTool
  ) { }

  @Input() id: number;
  @Input() page: string;
  @Input() name: string;

  kpiDetailInformations: any = [];

  Cim: boolean;
  Capex: boolean;
  Strategy: boolean;
  Max: boolean;

  status: string;
  remark: string;
  stage: string;

  initiativeDetails: any;
  frequencies: any;
  kpises: any;
  types: any;
  workStreams: any;
  subWorkstreams: any;

  strategicObjectives: any = [];
  strategies: any = [];
  years: any = [];

  workstreamLeader: string;

  workstreamLead: any = [];
  workstreamList: any = [];
  sponsor: any = [];
  sponsorList: any = [];
  toFinance: any = [];
  toFinanceList: any = [];
  cfo: any = [];
  cfoList: any = [];
  cto: any = [];
  ctoList: any = [];
  tot: any = [];
  totList: any = [];
  tfBt: any = [];
  tfBtList: any = [];

  projectManagerList: any = [];

  TOTeamSelect: any = [];
  TfBtTOSelect: any = [];

  presidentList: any = [];
  managerList: any = [];
  params: any = {};

  procurementCategoryList: any = [];
  procurementSubCategoryList: any = [];
  procurementLeverList: any = [];

  StartDate: string;
  FinishDate: string;
  Irr: number;
  PaybackPeriod: number;

  IL3Date: string;
  IL4Date: string;
  IL5Date: string;

  IL3DateDisplay: string;
  IL4DateDisplay: string;
  IL5DateDisplay: string;

  CutFeedDate: string;
  StartUpDate: string;
  CycleDate: string;

  CutFeedDateDisplay: string;
  StartUpDateDisplay: string;
  CycleDateDisplay: string;

  ReplacementDate: string;
  ReplacementDateDisplay: string;

  isDisabledSubmit = false;

  bsConfig: Partial<BsDatepickerConfig>;

  InitiativeDetail = { code: null, name: null, year: null, owner: null, organization: null };

  bsConfigIL3Date = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };
  bsConfigIL4Date = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: new Date(), maxDate: null };
  bsConfigIL5Date = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: new Date() };
  bsConfigDate    = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };

  Detail: number;

  DetailMaxForm = this.fb.group({
    id: 0,
    initiativeYear: null,
    strategicObjective: '',
    strategy: { value: '', disabled: true },
    initiativeTypeMax: '',
    workstream: '',
    subWorkstream1: null,
    subWorkstream2: { value: '', disabled: true },
    proCategory: null,
    proSubCategory: null,
    proLever: null,
    baseline: '',
    baselineHistorical: '',
    baselineNonHistorical: '',
    saving: '',
    savingHistorical: '',
    savingNonHistorical: '',
    il3Date: [null],
    il4Date: [null],
    il5Date: [null],
    sponsorEvp: { value: '', disabled: true },
    workstreamLead: { value: '', disabled: true },
    toFinance: { value: '', disabled: true },
    cto: { value: '', disabled: true },
    cfo: { value: '', disabled: true },
    tot: null,
    tfb: null,
    president: null,
    manager: null,
    projectManager: null,
    productionProcess: null,
    milestoneSchedule: null,
    expectedTarget: null,
    comparisonWithOther: null,
    otherResources: null,
    otherInvestment: null,
    consistent: null,
    keySuccessFactor: null,
    synergyBenefit: null,
    otherStrategic: null,
    marketOverview: null,
    potentialCustomer: null,
    salesPlan: null,
    sourceOfFeedback: null,
    sourceOfFeedstock: null,
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
    ebitdaPessimisticCase: null,
    depreciationCost: null,
    usefulYear: null,
    usefulMonth: null,
    kpisForm: this.fb.group({ kpis: this.fb.array([]) }),
    forEnvironment: 'true',
    forTurnaround: 'true',
    cutFeedDate: null,
    startUpDate: null,
    cycleYear: null,
    cycleMonth: null,
    replaceEquipment: 'true',
    equipmentName: null,
    replacementDate: null,
    oldAssetCondition: '',
    oldAssetNo: null,
    equipmentOrAsset: null,
    boi: 'true',
    boiNo: null,
    haveAdditional: 'true',
    capital: null,
    catalyst: null,
    software: null,
    rightOfUse: null,
    checklist: null,
    coordinate: 'false',
    parties: null,
    remark: null,
    otherKpis: null,
    // Detail-Dim
    valueChain: '',
    projectCategory: null,
    baselineStartDate: null,
    baselineFinishDate: null,
    reviseForecastStartDate: null,
    reviseForecastFinishDate: null,
    actualStartDate: null,
    actualFinishDate: null,
    isDeliverAsPerCommittedScope: null,
    scopeDetail: null,
    isDeliverAsPerCommittedDateL: null,
    timelineDetail: null,
    isDeliverAsPerCommittedCost: null,
    costDetail: null,
    userFeedback: null
  });

  isRemoveKpis = true;
  isDisableAddKpis = false;

  IsShowFormCondition = false;
  IsShowProcurement = false;
  IsRequestCapex = false;
  IsShowTurnAround = true;
  IsShowReplace = true;
  IsShowOldAsset = false;
  IsShowBOI = true;
  IsShowParties = false;
  IsShowAdditional = true;
  IsShowReturn = true;

  CheckCapex: boolean;
  CheckMax: boolean;
  CheckDim: boolean;

  typeOfInvestment: string;
  words: any = [];

  kpiArray: any = [];

  WorkstreamLeader: string;

  get NoStage() {
    return !this.stage;
  }

  get StageIL0() {
    return this.stage === 'IL0';
  }

  get StageIL1() {
    return this.stage === 'IL1';
  }

  get invalidPresident() {
    return this.DetailMaxForm.controls.president.touched && this.DetailMaxForm.controls.president.invalid;
  }

  get invalidManager() {
    return this.DetailMaxForm.controls.manager.touched && this.DetailMaxForm.controls.manager.invalid;
  }

  get invalidWorkstream() {
    return this.DetailMaxForm.controls.workstream.touched && this.DetailMaxForm.controls.workstream.invalid;
  }

  get invalidProjectManager() {
    return this.DetailMaxForm.controls.projectManager.touched && this.DetailMaxForm.controls.projectManager.invalid;
  }

  get invalidInitiativeType() {
    return this.DetailMaxForm.controls.initiativeTypeMax.touched && this.DetailMaxForm.controls.initiativeTypeMax.invalid;
  }

  get invalidSubWorkstream() {
    return this.DetailMaxForm.controls.subWorkstream2.touched && this.DetailMaxForm.controls.subWorkstream2.invalid;
  }

  get invalidSubAndWorkstream() {
    return (this.DetailMaxForm.controls.workstream.valid) && (this.DetailMaxForm.controls.subWorkstream2.valid);
  }

  get invalidSponsor() {
    return this.DetailMaxForm.controls.sponsorEvp.touched && this.DetailMaxForm.controls.sponsorEvp.invalid;
  }

  get invalidWorkstreamLead() {
    return this.DetailMaxForm.controls.workstreamLead.touched && this.DetailMaxForm.controls.workstreamLead.invalid;
  }

  get invalidToFinance() {
    return this.DetailMaxForm.controls.toFinance.touched && this.DetailMaxForm.controls.toFinance.invalid;
  }

  get invalidCTO() {
    return this.DetailMaxForm.controls.cto.touched && this.DetailMaxForm.controls.cto.invalid;
  }

  get invalidIl3() {
    return this.DetailMaxForm.controls.il3Date.touched && this.DetailMaxForm.controls.il3Date.invalid;
  }

  get invalidIl4() {
    return this.DetailMaxForm.controls.il4Date.touched && this.DetailMaxForm.controls.il4Date.invalid;
  }

  get invalidBaseCase() {
    return this.DetailMaxForm.controls.baseCase.touched && this.DetailMaxForm.controls.baseCase.invalid;
  }

  get invalidProjectIrrBaseCase() {
    return this.DetailMaxForm.controls.projectIrrBaseCase.touched && this.DetailMaxForm.controls.projectIrrBaseCase.invalid;
  }

  get invalidNpvBaseCase() {
    return this.DetailMaxForm.controls.npvBaseCase.touched && this.DetailMaxForm.controls.npvBaseCase.invalid;
  }

  get invalidPaybackBaseCase() {
    return this.DetailMaxForm.controls.paybackBaseCase.touched && this.DetailMaxForm.controls.paybackBaseCase.invalid;
  }

  get invalidEbitdaBaseCase() {
    return this.DetailMaxForm.controls.ebitdaBaseCase.touched && this.DetailMaxForm.controls.ebitdaBaseCase.invalid;
  }

  get invalidDepreciationCost() {
    return this.DetailMaxForm.controls.depreciationCost.touched && this.DetailMaxForm.controls.depreciationCost.invalid;
  }

  get invalidCutFeedDate() {
    return this.DetailMaxForm.controls.cutFeedDate.touched && this.DetailMaxForm.controls.cutFeedDate.invalid;
  }

  get invalidStartUpDate() {
    return this.DetailMaxForm.controls.startUpDate.touched && this.DetailMaxForm.controls.startUpDate.invalid;
  }

  get invalidCycleYear() {
    return this.DetailMaxForm.controls.cycleYear.touched && this.DetailMaxForm.controls.cycleYear.invalid;
  }

  get invalidEquipmentName() {
    return this.DetailMaxForm.controls.equipmentName.touched && this.DetailMaxForm.controls.equipmentName.invalid;
  }

  get invalidReplacementDate() {
    return this.DetailMaxForm.controls.replacementDate.touched && this.DetailMaxForm.controls.replacementDate.invalid;
  }

  get invalidOldAssetCondition() {
    return this.DetailMaxForm.controls.oldAssetCondition.touched && this.DetailMaxForm.controls.oldAssetCondition.invalid;
  }

  get invalidOldAssetNo() {
    return this.DetailMaxForm.controls.oldAssetNo.touched && this.DetailMaxForm.controls.oldAssetNo.invalid;
  }

  get invalidEquipmentOrAsset() {
    return this.DetailMaxForm.controls.equipmentOrAsset.touched && this.DetailMaxForm.controls.equipmentOrAsset.invalid;
  }

  get invalidBoiNo() {
    return this.DetailMaxForm.controls.boiNo.touched && this.DetailMaxForm.controls.boiNo.invalid;
  }

  get invalidParties() {
    return this.DetailMaxForm.controls.parties.touched && this.DetailMaxForm.controls.parties.invalid;
  }

  get invalidCycleMonth() {
    return this.DetailMaxForm.controls.cycleMonth.touched && this.DetailMaxForm.controls.cycleMonth.invalid;
  }

  get invalidIl5() {
    return this.DetailMaxForm.controls.il5Date.touched && this.DetailMaxForm.controls.il5Date.invalid;
  }

  get invalidAdditional() {
    return (this.DetailMaxForm.controls.capital.touched    && this.DetailMaxForm.controls.capital.invalid)    &&
           (this.DetailMaxForm.controls.catalyst.touched   && this.DetailMaxForm.controls.catalyst.invalid)   &&
           (this.DetailMaxForm.controls.software.touched   && this.DetailMaxForm.controls.software.invalid)   &&
           (this.DetailMaxForm.controls.rightOfUse.touched && this.DetailMaxForm.controls.rightOfUse.invalid) ;
  }

  get invalidSubmit() {
    return this.DetailMaxForm.valid;
  }

  ngOnInit(): void {
    this.bsConfig = Object.assign({}, { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false });
    this.maxService.GetFrequency().subscribe(frequency => this.frequencies = frequency);
    this.maxService.GetKpis().subscribe(kpis => {
      this.kpises = kpis;
      this.kpises.forEach(result => result.disabled = false);
      this.GetKpiDetail(this.id);
    });
    this.maxService.GetInitiativeTypeMax().subscribe(type => this.types = type);
    this.impactService.GetWorkStream().subscribe(workStreams => this.workStreams = workStreams);
    this.GetYears();
    this.IsDetailMax();
    this.id = Number(sessionStorage.getItem('id'));
    this.GetSuggestStatus(this.id);
    this.SetGeneral();
    this.GetPresident();
    this.GetManager();
    this.GetProjectManager();
    this.GetProcurementCategory();
    this.GetProcurementSubCategory();
    this.GetProcurementLever();
    this.CheckPage();
  }

  SearchProjectManager(event) {
    this.GetProjectManager(event.term);
  }

  GetProjectManager(Text?) {
    this.params.text = Text ? Text : '';
    this.initiativeService.GetOwners(this.params).subscribe(owners => {
      this.projectManagerList = owners;
    });
  }

  GetProcurementCategory() {
    this.detailService.GetProcurementCategory().subscribe(procurementName => this.procurementCategoryList = procurementName);
  }

  GetProcurementSubCategory() {
    this.detailService.GetProcurementSubCategory().subscribe(procurementName => this.procurementSubCategoryList = procurementName);
  }

  GetProcurementLever() {
    this.detailService.GetProcurementLever().subscribe(procurementName => this.procurementLeverList = procurementName);
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') {
      sessionStorage.setItem('InitiativeValidate', 'true');
      sessionStorage.setItem('InitiativeActive'  , 'true');
    }
  }

  GetPresident() {
    this.detailService.GetPositionLevel30().subscribe(systemName => this.presidentList = systemName);
  }

  GetManager() {
    this.detailService.GetPositionLevel40().subscribe(systemName => this.managerList = systemName);
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
      this.SetValidateForm();

      if (this.stage === 'IL5') {
        this.DetailMaxForm.disable();
      }

    });
  }

  CheckValidate() {
    if (sessionStorage.getItem('DetailMaxValidate') === 'false') {
      this.SetMarkAsTouchedForm();
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('DetailMaxValidated', 'true');
    sessionStorage.setItem('DetailMaxValidate' , this.stage === 'IL5' ? 'true' : JSON.stringify(this.invalidSubmit));

    if (this.DetailMaxForm.dirty) {
      this.PatchForm();
      this.DetailMaxForm.get('sponsorEvp').enable();
      this.DetailMaxForm.get('toFinance').enable();
      this.DetailMaxForm.get('cfo').enable();
      this.DetailMaxForm.get('cto').enable();
      sessionStorage.setItem('isDetailMax', 'true');
      sessionStorage.setItem('DetailMax', JSON.stringify(this.DetailMaxForm.value));
    }
  }

  CheckPage() {
    switch (this.page) {
      case 'direct-capex':
        this.CheckCapex = true;
        break;
      case 'detail-max':
        this.CheckMax = true;
        this.DetailMaxForm.controls.strategy.enable();
        this.DetailMaxForm.patchValue({ strategicObjective: '1' });
        this.detailService.GetStrategies(1).subscribe(strategies => this.strategies = strategies);
        this.DetailMaxForm.patchValue({ strategy: 'S2020_004' });
        break;
    }
  }

  SetValidateForm() {
    if (this.CheckCapex) {
      if (!this.stage) {
        this.DetailMaxForm.controls.president.setValidators([Validators.required]);
        this.DetailMaxForm.controls.president.updateValueAndValidity();
        this.DetailMaxForm.controls.manager.setValidators([Validators.required]);
        this.DetailMaxForm.controls.manager.updateValueAndValidity();
        this.DetailMaxForm.controls.projectManager.setValidators([Validators.required]);
        this.DetailMaxForm.controls.projectManager.updateValueAndValidity();
        this.DetailMaxForm.controls.baseCase.setValidators([Validators.required]);
        this.DetailMaxForm.controls.baseCase.updateValueAndValidity();
        this.DetailMaxForm.controls.projectIrrBaseCase.setValidators([Validators.required]);
        this.DetailMaxForm.controls.projectIrrBaseCase.updateValueAndValidity();
        this.DetailMaxForm.controls.npvBaseCase.setValidators([Validators.required]);
        this.DetailMaxForm.controls.npvBaseCase.updateValueAndValidity();
        this.DetailMaxForm.controls.paybackBaseCase.setValidators([Validators.required]);
        this.DetailMaxForm.controls.paybackBaseCase.updateValueAndValidity();
        this.DetailMaxForm.controls.ebitdaBaseCase.setValidators([Validators.required]);
        this.DetailMaxForm.controls.ebitdaBaseCase.updateValueAndValidity();
        this.DetailMaxForm.controls.depreciationCost.setValidators([Validators.required]);
        this.DetailMaxForm.controls.depreciationCost.updateValueAndValidity();
        this.DetailMaxForm.controls.cutFeedDate.setValidators([Validators.required]);
        this.DetailMaxForm.controls.cutFeedDate.updateValueAndValidity();
        this.DetailMaxForm.controls.startUpDate.setValidators([Validators.required]);
        this.DetailMaxForm.controls.startUpDate.updateValueAndValidity();
        this.DetailMaxForm.controls.cycleMonth.setValidators([Validators.required]);
        this.DetailMaxForm.controls.cycleMonth.updateValueAndValidity();
        this.DetailMaxForm.controls.cycleYear.setValidators([Validators.required]);
        this.DetailMaxForm.controls.cycleYear.updateValueAndValidity();
        this.DetailMaxForm.controls.equipmentName.setValidators([Validators.required]);
        this.DetailMaxForm.controls.equipmentName.updateValueAndValidity();
        this.DetailMaxForm.controls.replacementDate.setValidators([Validators.required]);
        this.DetailMaxForm.controls.replacementDate.updateValueAndValidity();
        this.DetailMaxForm.controls.oldAssetCondition.setValidators([Validators.required]);
        this.DetailMaxForm.controls.oldAssetCondition.updateValueAndValidity();
        this.DetailMaxForm.controls.equipmentOrAsset.setValidators([Validators.required]);
        this.DetailMaxForm.controls.equipmentOrAsset.updateValueAndValidity();
        this.DetailMaxForm.controls.boiNo.setValidators([Validators.required]);
        this.DetailMaxForm.controls.boiNo.updateValueAndValidity();
        this.DetailMaxForm.controls.capital.setValidators([Validators.required]);
        this.DetailMaxForm.controls.capital.updateValueAndValidity();
        this.DetailMaxForm.controls.catalyst.setValidators([Validators.required]);
        this.DetailMaxForm.controls.catalyst.updateValueAndValidity();
        this.DetailMaxForm.controls.software.setValidators([Validators.required]);
        this.DetailMaxForm.controls.software.updateValueAndValidity();
        this.DetailMaxForm.controls.rightOfUse.setValidators([Validators.required]);
        this.DetailMaxForm.controls.rightOfUse.updateValueAndValidity();
      }
    }
    if (this.CheckMax) {
      if (!this.stage) {
        this.SetValidateNullStage();
        this.SetValidateWorkstreamLead();
      } else {
        switch (this.stage) {
          case 'IL0':
          case 'IL2':
          case 'IL3':
          case 'IL4':
          case 'IL5':
            this.SetValidateWorkstreamLead();
            break;
          case 'IL1':
            this.SetValidateStageIL1();
            this.SetValidateWorkstreamLead();
            break;
        }
      }
    }
    this.CheckValidate();
  }

  SetValidateNullStage() {
    this.DetailMaxForm.controls.initiativeTypeMax.setValidators([Validators.required]);
    this.DetailMaxForm.controls.initiativeTypeMax.updateValueAndValidity();
    this.DetailMaxForm.controls.workstream.setValidators([Validators.required]);
    this.DetailMaxForm.controls.workstream.updateValueAndValidity();
    this.DetailMaxForm.controls.subWorkstream2.setValidators([Validators.required]);
    this.DetailMaxForm.controls.subWorkstream2.updateValueAndValidity();
  }

  SetValidateWorkstreamLead() {
    this.DetailMaxForm.controls.workstreamLead.setValidators([Validators.required]);
    this.DetailMaxForm.controls.workstreamLead.updateValueAndValidity();
  }

  SetValidateStageIL1() {
    this.DetailMaxForm.controls.il3Date.setValidators([Validators.required]);
    this.DetailMaxForm.controls.il3Date.updateValueAndValidity();
    this.DetailMaxForm.controls.il4Date.setValidators([Validators.required]);
    this.DetailMaxForm.controls.il4Date.updateValueAndValidity();
    this.DetailMaxForm.controls.il5Date.setValidators([Validators.required]);
    this.DetailMaxForm.controls.il5Date.updateValueAndValidity();
  }

  IsDetailMax() {
    if (sessionStorage.getItem('isDetailMax') === 'true') {
      const DetailMax = JSON.parse(sessionStorage.getItem('DetailMax'));

      this.Detail = DetailMax.id;

      if (DetailMax.strategicObjective) {
        this.detailService.GetStrategies(DetailMax.strategicObjective).subscribe(strategies => this.strategies = strategies);
      }

      if (DetailMax.strategy) {
        this.DetailMaxForm.controls.strategy.enable();
      } else {
        this.DetailMaxForm.controls.strategy.disable();
      }

      this.DetailMaxForm.patchValue({ strategy: DetailMax.strategy ? DetailMax.strategy : '' });

      if (DetailMax.workstream) {
        this.DetailMaxForm.get('subWorkstream2').enable();
        this.DetailMaxForm.get('subWorkstream2').updateValueAndValidity();
        this.maxService.GetSubWorkstream(DetailMax.workstream).subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
        this.DetailMaxForm.get('workstreamLead').enable();
        this.WorkstreamLead(DetailMax.workstream);
        this.DetailMaxForm.patchValue({ workstreamLead: DetailMax.workstreamLead ? DetailMax.workstreamLead : ''  });
      } else {
        this.DetailMaxForm.controls.subWorkstream2.disable();
        this.DetailMaxForm.controls.workstreamLead.disable();
      }

      if (DetailMax.subWorkstream2) {
        this.SubWorkstream(DetailMax.subWorkstream2);
        this.DetailMaxForm.controls.subWorkstream2.enable();
      } else {
        this.DetailMaxForm.controls.subWorkstream2.disable();
      }

      this.CheckProcurement(DetailMax.workstream);

      this.DetailMaxForm.patchValue(DetailMax);

      this.DetailMaxForm.patchValue({ subWorkstream2: DetailMax.subWorkstream2 ? DetailMax.subWorkstream2 : '' });

      this.IL3DateDisplay = DetailMax.il3Date ? this.dateUtil.GetDate(new Date(DetailMax.il3Date)) : null;
      this.IL4DateDisplay = DetailMax.il4Date ? this.dateUtil.GetDate(new Date(DetailMax.il4Date)) : null;
      this.IL5DateDisplay = DetailMax.il5Date ? this.dateUtil.GetDate(new Date(DetailMax.il5Date)) : null;

      this.IL3Date = DetailMax.il3Date;
      this.IL4Date = DetailMax.il4Date;
      this.IL5Date = DetailMax.il5Date;

      this.CutFeedDateDisplay = DetailMax.cutFeedDate ? this.dateUtil.GetDate(new Date(DetailMax.cutFeedDate)) : null;
      this.StartUpDateDisplay = DetailMax.startUpDate ? this.dateUtil.GetDate(new Date(DetailMax.startUpDate)) : null;
      this.CycleDateDisplay = DetailMax.cycle ? this.dateUtil.GetDate(new Date(DetailMax.cycle)) : null;

      this.ReplacementDateDisplay = DetailMax.replacementDate ? this.dateUtil.GetDate(new Date(DetailMax.replacementDate)) : null;

      this.DetailMaxForm.patchValue({
        il3Date: this.IL3DateDisplay,
        il4Date: this.IL4DateDisplay,
        il5Date: this.IL5DateDisplay,
        cutFeedDate: this.CutFeedDateDisplay,
        startUpDate: this.StartUpDateDisplay,
        cycle: this.CycleDateDisplay,
        replacementDate: this.ReplacementDateDisplay
      });

      if (DetailMax.kpisForm.kpis.length !== 0) {
        const KpiControl = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
        for (let i = 0; i < DetailMax.kpisForm.kpis.length; i++) {
          if (i >= this.kpiDetailInformations.length) {
            KpiControl.push(this.DetailKpisForm());
            KpiControl.at(i).patchValue(DetailMax.kpisForm.kpis[i]);
            KpiControl.at(i).get('id').patchValue(0);
          }
        }
        this.isRemoveKpis = KpiControl.length > 1 ? false : true;
      }

    }
    if (sessionStorage.getItem('Stage') === 'IL5') {
      this.DetailMaxForm.disable();
    }
  }

  GetYears() {
    const year = new Date().getFullYear();
    for (let i = 1; i <= 5; i++) {
      this.years.push(year - i);
    }
    this.years.unshift(year + 1, year);
  }

  GetKpiDetail(id) {
    this.maxService.GetKpiDetail(id).subscribe(response => {
      this.Irr = response.irr;
      this.PaybackPeriod = response.payBackPeriod;

      this.StartDate  = this.dateUtil.GetDate(new Date(response.startingDate));
      this.FinishDate = response.finishingDate ? this.dateUtil.GetDate(new Date(response.finishingDate)) : null;

      // const finishingDate = new Date(response.finishingDate);
      // this.bsConfigIL3Date.maxDate = response.finishingDate ? new Date(finishingDate.setDate(finishingDate.getDate())) : null;

      if (response.requestCapex === 'true') {
        this.CheckShowForm(response);
        this.IsRequestCapex = true;
      } else {
        this.IsRequestCapex = false;
        if (response.strategy) {
          this.IsShowFormCondition = true;
        } else {
          this.IsShowFormCondition = false;
        }
      }

      if (response.typeBenefit === 'NON-FINANCIAL') {
        this.IsShowReturn = false;
      } else {
        this.IsShowReturn = true;
      }

      const year = response.year;

      this.detailService.GetStrategicObjectives(year).subscribe(result => this.strategicObjectives = result);

      this.DetailMaxForm.patchValue({ initiativeYear: response.year });

      this.kpiDetailInformations = response.kpiDetailInformations;
      if (this.kpiDetailInformations.length !== 0) {
        const KpiControl = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
        for (let i = 0; i < this.kpiDetailInformations.length; i++) {
          KpiControl.push(this.DetailKpisForm());
          KpiControl.at(i).patchValue(this.kpiDetailInformations[i]);
          KpiControl.at(i).get('id').patchValue(0);
          this.kpiArray.push({ id: i, title: this.kpiDetailInformations[i].kpis });
        }
        this.SetKpiSelect();
        this.isRemoveKpis = KpiControl.length > 1 ? false : true;
        this.isDisableAddKpis = KpiControl.length === this.kpises.length ? true : false;
      } else {
        if (sessionStorage.getItem('isDetailMax') !== 'true') {
          this.AddKpis();
        }
      }

      this.GetDetailInformation(this.id);
    });
  }

  CheckShowForm(response) {
    const typeOfInvestment = response.typeOfInvestment;
    if (typeOfInvestment) {
      if (typeOfInvestment.indexOf('Growth') !== -1 || typeOfInvestment.indexOf('Sustain Core') !== -1) {
        const words = typeOfInvestment.split(':');
        if (words[0]) {
          if (['Growth', 'Sustain Core'].indexOf(words[0]) !== -1) {
            switch (words[0]) {
              case 'Growth':
              case 'Sustain Core':
                this.IsShowFormCondition = true;
                break;
              default:
                this.IsShowFormCondition = false;
                break;
            }
          }
        }
      }
    }
  }

  GetSetDate(response) {
    this.IL3Date = response.iL3Date ? this.dateUtil.SetDate(new Date(response.iL3Date)) : null;
    this.IL4Date = response.iL4Date ? this.dateUtil.SetDate(new Date(response.iL4Date)) : null;
    this.IL5Date = response.iL5Date ? this.dateUtil.SetDate(new Date(response.iL5Date)) : null;

    this.CutFeedDate = response.cutFeedDate ? this.dateUtil.SetDate(new Date(response.cutFeedDate)) : null;
    this.StartUpDate = response.startUpDate ? this.dateUtil.SetDate(new Date(response.startUpDate)) : null;
    this.CycleDate = response.cycle ? this.dateUtil.SetDate(new Date(response.cycle)) : null;

    this.ReplacementDate = response.replacementDate ? this.dateUtil.SetDate(new Date(response.replacementDate)) : null;

    this.IL3DateDisplay = response.iL3Date ? this.dateUtil.GetDate(new Date(response.iL3Date)) : this.StartDate;
    this.IL4DateDisplay = response.iL4Date ? this.dateUtil.GetDate(new Date(response.iL4Date)) : this.FinishDate;
    this.IL5DateDisplay = response.iL5Date ? this.dateUtil.GetDate(new Date(response.iL5Date)) : null;

    this.CutFeedDateDisplay = response.cutFeedDate ? this.dateUtil.GetDate(new Date(response.cutFeedDate)) : null;
    this.StartUpDateDisplay = response.startUpDate ? this.dateUtil.GetDate(new Date(response.startUpDate)) : null;
    this.CycleDateDisplay = response.cycle ? this.dateUtil.GetDate(new Date(response.cycle)) : null;

    this.ReplacementDateDisplay = response.replacementDate ? this.dateUtil.GetDate(new Date(response.replacementDate)) : null;


    this.DetailMaxForm.patchValue({
      il3Date: this.IL3DateDisplay,
      il4Date: this.IL4DateDisplay,
      il5Date: this.IL5DateDisplay,
      cutFeedDate: this.CutFeedDateDisplay,
      startUpDate: this.StartUpDateDisplay,
      cycle: this.CycleDateDisplay,
      replacementDate: this.ReplacementDateDisplay
    });

  }

  CheckProcurement(workstream) {
    if (workstream === 'Procurement') {
      this.IsShowProcurement = true;
      this.DetailMaxForm.controls.proCategory.enable();
      this.DetailMaxForm.controls.proSubCategory.enable();
      this.DetailMaxForm.controls.proLever.enable();
      this.DetailMaxForm.patchValue({ proCategory: null, proSubCategory: null, proLever: null });
    } else {
      this.IsShowProcurement = false;
      this.DetailMaxForm.controls.proCategory.disable();
      this.DetailMaxForm.controls.proSubCategory.disable();
      this.DetailMaxForm.controls.proLever.disable();
    }
  }

  GetDetailInformation(id) {
    if (sessionStorage.getItem('isDetailMax') !== 'true') {
      this.maxService.GetDetailInformation(id).subscribe(response => {
        if (response) {
          this.Detail = response.id;

          if (response.strategicObjective) {
            this.detailService.GetStrategies(response.strategicObjective).subscribe(strategies => this.strategies = strategies);
          }
          if (response.strategy) {
            this.DetailMaxForm.controls.strategy.enable();
          } else {
            this.DetailMaxForm.controls.strategy.disable();
          }

          if (response.workstream) {
            this.DetailMaxForm.get('subWorkstream2').enable();
            this.maxService.GetSubWorkstream(response.workstream).subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
            this.DetailMaxForm.get('workstreamLead').enable();
            this.WorkstreamLead(response.workstream);
            this.maxService.GetWorkstreamLead(this.id).subscribe(approve => {
              if (approve) {
                this.WorkstreamLeader = approve.approverEmail;
                this.DetailMaxForm.patchValue({ workstreamLead: approve.approverEmail });
              } else {
                this.WorkstreamLeader = null;
                this.DetailMaxForm.patchValue({ workstreamLead: '' });
              }
            });
          } else {
            this.DetailMaxForm.controls.subWorkstream2.disable();
            this.DetailMaxForm.controls.workstreamLead.disable();
          }

          if (response.subWorkstream2) {
            this.SubWorkstream(response.subWorkstream2);
          }

          this.CheckProcurement(response.workstream);

          this.DetailMaxForm.patchValue(response);

          this.GetSetDate(response);

          this.DetailMaxForm.patchValue({
            projectIrrBaseCase: response.projectIrrBaseCase ? response.projectIrrBaseCase : this.Irr,
            paybackBaseCase: response.paybackBaseCase ? response.paybackBaseCase : this.PaybackPeriod,
          });

          this.DetailMaxForm.patchValue({
            oldAssetCondition: response.oldAssetCondition ? response.oldAssetCondition : '',
          });

          if (this.CheckCapex) {
            this.OnChangeBOI();
            this.OnChangeTurnaround();
            this.OnChangeOldAsset();
            this.OnChangeReplaceEquipment();
            this.OnChangeCoordinate();
          }

          if (this.stage === 'IL5') {
            this.DetailMaxForm.disable();
          }

        } else {
          this.DetailMaxForm.patchValue({
            il3Date: null,
            il4Date: this.FinishDate,
            projectIrrBaseCase: this.Irr,
            paybackBaseCase: this.PaybackPeriod,
          });
        }
      });
    }
  }

  OnChangeStrategic(event) {
    this.DetailMaxForm.get('strategy').enable();
    this.DetailMaxForm.get('strategy').updateValueAndValidity();
    this.DetailMaxForm.patchValue({ strategy: '' });
    const strategicObjectiveId = event.target.value;
    this.detailService.GetStrategies(strategicObjectiveId).subscribe(strategies => this.strategies = strategies);
  }

  WorkstreamLead(workstreamName) {
    this.workstreamList = [];
    this.maxService.GetMaxApprover({ name: workstreamName }).subscribe(workstreamList => {
      this.workstreamLead = workstreamList;
      this.workstreamLead.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.workstreamList.push({ name: owner.ownerName, email: owner.email });
        });
      });
    });
  }

  OnChangeWorkstreamLeader(event) {
    const workstreamLead = event.target.value;
    if (this.WorkstreamLeader !== workstreamLead) {
      if (this.Detail) {
        this.SetWorkstream();
      }
    }
  }

  SetWorkstream() {
    if (this.Detail) {
      setTimeout(() => {
        this.DetailMaxForm.get('sponsorEvp').enable();
        this.DetailMaxForm.get('toFinance').enable();
        this.DetailMaxForm.get('cfo').enable();
        this.DetailMaxForm.get('cto').enable();
        sessionStorage.setItem('SetWorkstream' , 'true');
        sessionStorage.setItem('WorkstreamList', JSON.stringify(this.DetailMaxForm.value));
        this.DetailMaxForm.get('sponsorEvp').disable();
        this.DetailMaxForm.get('toFinance').disable();
        this.DetailMaxForm.get('cfo').disable();
        this.DetailMaxForm.get('cto').disable();
      }, 100);
    }
  }

  OnChangeWorkstream(event) {
    this.DetailMaxForm.get('subWorkstream2').enable();
    this.DetailMaxForm.get('subWorkstream2').updateValueAndValidity();

    this.DetailMaxForm.patchValue({ subWorkstream2: '' });

    this.DetailMaxForm.get('workstreamLead').enable();

    if (!this.stage) {
      this.DetailMaxForm.controls.workstreamLead.setValidators([Validators.required]);
      this.DetailMaxForm.controls.workstreamLead.updateValueAndValidity();
    } else if (this.stage === 'IL5') {
      this.DetailMaxForm.get('workstreamLead').disable();
    }

    const workstreamName = event.target.value;
    this.maxService.GetSubWorkstream(workstreamName).subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
    this.WorkstreamLead(workstreamName);

    this.DetailMaxForm.patchValue({ workstreamLead: '' });

    if (workstreamName === 'Procurement') {
      this.IsShowProcurement = true;
      this.DetailMaxForm.controls.proCategory.enable();
      this.DetailMaxForm.controls.proSubCategory.enable();
      this.DetailMaxForm.controls.proLever.enable();
      this.DetailMaxForm.patchValue({ proCategory: null, proSubCategory: null, proLever: null });
    } else {
      this.IsShowProcurement = false;
      this.DetailMaxForm.controls.proCategory.disable();
      this.DetailMaxForm.controls.proSubCategory.disable();
      this.DetailMaxForm.controls.proLever.disable();
    }

    this.SetWorkstream();
  }

  SubWorkstream(value) {
    const sponsorSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'Sponsor' }).subscribe(result => {
      this.sponsor = result;
      this.sponsor.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.sponsorList = [...this.sponsorList, { name: owner.ownerName, email: owner.email }];
          sponsorSelect.push(owner.email);
          this.DetailMaxForm.patchValue({ sponsorEvp: sponsorSelect });
        });
      });
    });

    const toFinanceSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'TO Finance' }).subscribe(result => {
      this.toFinance = result;
      this.toFinance.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.toFinanceList = [...this.toFinanceList, { name: owner.ownerName, email: owner.email }];
          toFinanceSelect.push(owner.email);
          this.DetailMaxForm.patchValue({ toFinance: toFinanceSelect });
        });
      });
    });

    const cfoSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'CFO' }).subscribe(result => {
      this.cfo = result;
      this.cfo.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.cfoList = [...this.cfoList, { name: owner.ownerName, email: owner.email }];
          cfoSelect.push(owner.email);
          this.DetailMaxForm.patchValue({ cfo: cfoSelect });
        });
      });
    });

    const ctoSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'CTO' }).subscribe(result => {
      this.cto = result;
      this.cto.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.ctoList = [...this.ctoList, { name: owner.ownerName, email: owner.email }];
          ctoSelect.push(owner.email);
          this.DetailMaxForm.patchValue({ cto: ctoSelect });
        });
      });
    });

    const TOTeamSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'TOTeam' }).subscribe(result => {
      this.tot = result;
      this.tot.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.totList = [...this.totList, { name: owner.ownerName, email: owner.email }];
          TOTeamSelect.push(owner.email);
          this.TOTeamSelect = TOTeamSelect;
          this.DetailMaxForm.patchValue({ tot: TOTeamSelect });
        });
      });
    });

    const TfBtTOSelect = [];
    this.maxService.GetMaxApproverSubWorkstream({ name: value, Indicator: 'TF-BT-TO' }).subscribe(result => {
      this.tfBt = result;
      this.tfBt.forEach((e) => {
        this.maxService.GetNameMaxApprover(e.approverEmail).subscribe(owner => {
          this.tfBtList = [...this.tfBtList, { name: owner.ownerName, email: owner.email }];
          TfBtTOSelect.push(owner.email);
          this.TfBtTOSelect = TfBtTOSelect;
          this.DetailMaxForm.patchValue({ tfb: TfBtTOSelect });
        });
      });
    });
  }

  OnChangeSubWorkstream(event) {
    this.SubWorkstream(event.target.value);
    const subWorkstream = this.subWorkstreams.filter(obj => obj.subWorkstream2 === event.target.value);
    this.DetailMaxForm.patchValue({ subWorkstream1: subWorkstream[0].subWorkstream1 });
    this.SetWorkstream();
  }

  OnchangeUsefulMonth() {
    if (this.DetailMaxForm.controls.usefulMonth.value > 12) {
      this.DetailMaxForm.patchValue({ usefulMonth: 12 });
    }
  }

  OnchangeCycleMonth() {
    if (this.DetailMaxForm.controls.cycleMonth.value > 12) {
      this.DetailMaxForm.patchValue({ cycleMonth: 12 });
    }
  }

  OnChangeTurnaround() {
    if (this.DetailMaxForm.controls.forTurnaround.value === 'true') {
      this.IsShowTurnAround = true;
      this.DetailMaxForm.controls.cutFeedDate.enable();
      this.DetailMaxForm.controls.startUpDate.enable();
      this.DetailMaxForm.controls.cycleYear.enable();
      this.DetailMaxForm.controls.cycleMonth.enable();
      this.DetailMaxForm.controls.cutFeedDate.setValidators([Validators.required]);
      this.DetailMaxForm.controls.cutFeedDate.updateValueAndValidity();
      this.DetailMaxForm.controls.startUpDate.setValidators([Validators.required]);
      this.DetailMaxForm.controls.startUpDate.updateValueAndValidity();
      this.DetailMaxForm.controls.cycleYear.setValidators([Validators.required]);
      this.DetailMaxForm.controls.cycleYear.updateValueAndValidity();
      this.DetailMaxForm.controls.cycleMonth.setValidators([Validators.required]);
      this.DetailMaxForm.controls.cycleMonth.updateValueAndValidity();
    } else {
      this.IsShowTurnAround = false;
      this.DetailMaxForm.controls.cutFeedDate.disable();
      this.DetailMaxForm.controls.startUpDate.disable();
      this.DetailMaxForm.controls.cycleMonth.disable();
      this.DetailMaxForm.controls.cycleYear.disable();
      this.DetailMaxForm.patchValue({
        cutFeedDate: this.CutFeedDateDisplay,
        startUpDate: this.StartUpDateDisplay,
      });
      this.DetailMaxForm.controls.cutFeedDate.clearValidators();
      this.DetailMaxForm.controls.cutFeedDate.updateValueAndValidity();
      this.DetailMaxForm.controls.startUpDate.clearValidators();
      this.DetailMaxForm.controls.startUpDate.updateValueAndValidity();
      this.DetailMaxForm.controls.cycleYear.clearValidators();
      this.DetailMaxForm.controls.cycleYear.updateValueAndValidity();
      this.DetailMaxForm.controls.cycleMonth.clearValidators();
      this.DetailMaxForm.controls.cycleMonth.updateValueAndValidity();
    }
  }

  OnChangeReplaceEquipment() {
    if (this.DetailMaxForm.controls.replaceEquipment.value === 'true') {
      this.IsShowReplace = true;
      this.DetailMaxForm.controls.equipmentName.enable();
      this.DetailMaxForm.controls.replacementDate.enable();
      this.DetailMaxForm.controls.oldAssetCondition.enable();
      this.DetailMaxForm.controls.equipmentName.setValidators([Validators.required]);
      this.DetailMaxForm.controls.equipmentName.updateValueAndValidity();
      this.DetailMaxForm.controls.replacementDate.setValidators([Validators.required]);
      this.DetailMaxForm.controls.replacementDate.updateValueAndValidity();
      this.DetailMaxForm.controls.oldAssetCondition.setValidators([Validators.required]);
      this.DetailMaxForm.controls.oldAssetCondition.updateValueAndValidity();
    } else {
      this.IsShowReplace = false;
      this.IsShowOldAsset = false;
      this.DetailMaxForm.controls.equipmentName.disable();
      this.DetailMaxForm.controls.replacementDate.disable();
      this.DetailMaxForm.controls.oldAssetCondition.disable();
      this.DetailMaxForm.controls.oldAssetNo.disable();
      this.DetailMaxForm.patchValue({ equipmentName: null, replacementDate: null, oldAssetCondition: null });
      this.DetailMaxForm.controls.equipmentName.clearValidators();
      this.DetailMaxForm.controls.equipmentName.updateValueAndValidity();
      this.DetailMaxForm.controls.replacementDate.clearValidators();
      this.DetailMaxForm.controls.replacementDate.updateValueAndValidity();
      this.DetailMaxForm.controls.oldAssetCondition.clearValidators();
      this.DetailMaxForm.controls.oldAssetCondition.updateValueAndValidity();
    }
  }

  OnChangeOldAsset() {
    if (this.DetailMaxForm.controls.oldAssetCondition.value === 'repair') {
      this.IsShowOldAsset = true;
      this.DetailMaxForm.controls.oldAssetNo.enable();
      this.DetailMaxForm.controls.oldAssetNo.setValidators([Validators.required]);
      this.DetailMaxForm.controls.oldAssetNo.updateValueAndValidity();
    } else {
      this.IsShowOldAsset = false;
      this.DetailMaxForm.controls.oldAssetNo.disable();
      this.DetailMaxForm.patchValue({ oldAssetNo: null });
      this.DetailMaxForm.controls.oldAssetNo.clearValidators();
      this.DetailMaxForm.controls.oldAssetNo.updateValueAndValidity();
    }
  }

  OnChangeBOI() {
    if (this.DetailMaxForm.controls.boi.value === 'true') {
      this.IsShowBOI = true;
      this.DetailMaxForm.controls.boiNo.enable();
      this.DetailMaxForm.controls.boiNo.setValidators([Validators.required]);
      this.DetailMaxForm.controls.boiNo.updateValueAndValidity();
    } else {
      this.IsShowBOI = false;
      this.DetailMaxForm.controls.boiNo.disable();
      this.DetailMaxForm.patchValue({ boiNo: null });
      this.DetailMaxForm.controls.boiNo.clearValidators();
      this.DetailMaxForm.controls.boiNo.updateValueAndValidity();
    }
  }

  OnChangeCoordinate() {
    if (this.DetailMaxForm.controls.coordinate.value === 'true') {
      this.IsShowParties = true;
      this.DetailMaxForm.controls.parties.enable();
      this.DetailMaxForm.controls.parties.setValidators([Validators.required]);
      this.DetailMaxForm.controls.parties.updateValueAndValidity();
    } else {
      this.IsShowParties = false;
      this.DetailMaxForm.controls.parties.disable();
      this.DetailMaxForm.controls.parties.clearValidators();
      this.DetailMaxForm.controls.parties.updateValueAndValidity();
    }
  }

  OnChangeAdditional() {
    if (this.DetailMaxForm.controls.haveAdditional.value === 'true') {
      this.IsShowAdditional = true;
      this.DetailMaxForm.controls.capital.enable();
      this.DetailMaxForm.controls.catalyst.enable();
      this.DetailMaxForm.controls.software.enable();
      this.DetailMaxForm.controls.rightOfUse.enable();
    } else {
      this.IsShowAdditional = false;
      this.DetailMaxForm.controls.capital.disable();
      this.DetailMaxForm.controls.catalyst.disable();
      this.DetailMaxForm.controls.software.disable();
      this.DetailMaxForm.controls.rightOfUse.disable();
    }
  }

  ChangeKpis(index, event) {
    this.kpiArray = this.kpiArray.filter(el => el.id !== index);
    this.kpiArray.push({ id: index, title: event.target.value });
    this.SetKpiSelect();
  }

  SetKpiSelect() {
    this.kpises.forEach(result => {
      if (this.kpiArray.some(e => e.title === result.kpisTitle)) {
        result.disabled = true;
      } else {
        result.disabled = false;
      }
    });
  }

  ChangeIl3Date(value: Date): void {
    this.IL3Date = value ? this.dateUtil.SetDate(new Date(value)) : null;
    const time = new Date(value).getTime();
    this.bsConfigIL4Date.minDate = new Date(value);
    if (this.IL3Date) {
      if (time > 0) {
        if (this.IL4Date) {
          if (this.IL3Date <= this.IL4Date) {
            this.IL3Date = this.dateUtil.SetDate(new Date(value));
          } else {
            this.IL3Date = null;
            this.swalTool.DateTargetIL3();
            this.DetailMaxForm.patchValue({ il3Date: null });
          }
        }
      }
    }
  }

  ChangeIl4Date(value: Date): void {
    this.IL4Date = value ? this.dateUtil.SetDate(new Date(value)) : null;
    const time = new Date(value).getTime();
    this.bsConfigIL5Date.minDate = new Date(value);
    if (this.IL3Date) {
      if (time > 0) {
        if (this.IL3Date <= this.IL4Date) {
          this.IL4Date = this.dateUtil.SetDate(new Date(value));
        } else {
          this.IL4Date = null;
          this.swalTool.DateValid();
          this.DetailMaxForm.patchValue({ il4Date: null, il5Date: null });
        }
        if (this.IL4Date > this.IL5Date) {
          this.IL5Date = null;
          this.swalTool.DateValid();
          this.DetailMaxForm.patchValue({ il5Date: null });
        }
      }
    }
  }

  ChangeIl5Date(value: Date): void {
    this.IL5Date = value ? this.dateUtil.SetDate(new Date(value)) : null;
    const time = new Date(value).getTime();
    if (time > 0) {
      this.IL5Date = this.dateUtil.SetDate(new Date(value));
      if (this.IL4Date <= this.IL5Date) {
        this.IL5Date = this.dateUtil.SetDate(new Date(value));
        this.bsConfigIL4Date.maxDate = new Date(value.setDate(value.getDate()));
      } else {
        this.IL5Date = null;
        this.swalTool.DateTargetIL5();
        this.DetailMaxForm.patchValue({ il5Date: null });
      }
    }
  }

  ChangeCutFeedDate(value: Date): void {
    this.CutFeedDate = this.dateUtil.SetDate(new Date(value));
  }

  ChangeStartUpDate(value: Date): void {
    this.StartUpDate = this.dateUtil.SetDate(new Date(value));
  }

  ChangeCycleDate(value: Date): void {
    this.CycleDate = this.dateUtil.SetDate(new Date(value));
  }

  ChangeReplacementDate(value: Date): void {
    this.ReplacementDate = this.dateUtil.SetDate(new Date(value));
  }

  OnChangeBaseline() {
    this.CalculateBaseline();
  }

  OnChangeSaving() {
    this.CalculateSaving();
  }

  CalculateBaseline() {
    const baselineHistorical = this.DetailMaxForm.controls.baselineHistorical.value;
    const baselineNonHistorical = this.DetailMaxForm.controls.baselineNonHistorical.value;
    const result = Number(baselineHistorical) + Number(baselineNonHistorical);
    this.DetailMaxForm.patchValue({ baseline: result.toFixed(2) });
  }

  CalculateSaving() {
    const savingHistorical = this.DetailMaxForm.controls.savingHistorical.value;
    const savingNonHistorical = this.DetailMaxForm.controls.savingNonHistorical.value;
    const result = Number(savingHistorical) + Number(savingNonHistorical);
    this.DetailMaxForm.patchValue({ saving: result.toFixed(2) });
  }

  PatchForm() {
    this.DetailMaxForm.patchValue({
      id: this.Detail ? this.Detail : 0,
      il3Date: this.IL3Date ? this.IL3Date : null,
      il4Date: this.IL4Date ? this.IL4Date : null,
      il5Date: this.IL5Date ? this.IL5Date : null,
      cutFeedDate: this.CutFeedDate ? this.CutFeedDate : null,
      startUpDate: this.StartUpDate ? this.StartUpDate : null,
      cycle: this.CycleDate ? this.CycleDate : null,
      replacementDate: this.ReplacementDate ? this.ReplacementDate : null
    });
  }

  DetailKpisForm(): FormGroup {
    return this.fb.group({ id: [0], kpis: '', target: null, frequency: '', initiativeId: this.id });
  }

  AddKpis() {
    const control = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
    control.push(this.DetailKpisForm());
    this.isRemoveKpis = control.length > 1 ? false : true;
    this.isDisableAddKpis = control.length === this.kpises.length ? true : false;
  }

  RemoveKpis(index: number) {
    this.kpiArray = this.kpiArray.filter(el => el.id !== index);
    this.SetKpiSelect();
    const control = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
    control.removeAt(index);
    this.DetailMaxForm.controls.kpisForm.markAsDirty();
    this.isRemoveKpis = control.length > 1 ? false : true;
    this.isDisableAddKpis = control.length === this.kpises.length ? true : false;
  }

  SaveMaxApprover() {
    if (this.invalidSubAndWorkstream) {
      if (this.DetailMaxForm.controls.workstreamLead.valid) {
        this.maxService.CreateWorkstreamLead(this.id, { email: this.DetailMaxForm.controls.workstreamLead.value }).subscribe(() => {});
      }
      if (this.DetailMaxForm.controls.sponsorEvp.valid) {
        this.maxService.CreateSponsor(this.id, this.DetailMaxForm.controls.sponsorEvp.value).subscribe(() => {});
      }
      if (this.DetailMaxForm.controls.toFinance.valid) {
        this.maxService.CreateFinance(this.id, this.DetailMaxForm.controls.toFinance.value).subscribe(() => {});
      }
      if (this.DetailMaxForm.controls.cfo.valid) {
        this.maxService.CreateCFO(this.id, this.DetailMaxForm.controls.cfo.value).subscribe(() => {});
      }
      if (this.DetailMaxForm.controls.cto.valid) {
        this.maxService.CreateCTO(this.id, this.DetailMaxForm.controls.cto.value).subscribe(() => {});
      }
      if (this.TOTeamSelect.length !== 0) {
        this.maxService.CreateTOTeam(this.id, this.TOTeamSelect).subscribe(() => {});
      }
      if (this.TfBtTOSelect.length !== 0) {
        this.maxService.CreateTfBtTO(this.id, this.TfBtTOSelect).subscribe(() => {});
      }
    }
  }

  DetailDraft(response) {
    this.DetailMaxForm.get('sponsorEvp').enable();
    this.DetailMaxForm.get('toFinance').enable();
    this.DetailMaxForm.get('cfo').enable();
    this.DetailMaxForm.get('cto').enable();

    this.SaveMaxApprover();

    this.DetailMaxForm.get('sponsorEvp').disable();
    this.DetailMaxForm.get('toFinance').disable();
    this.DetailMaxForm.get('cfo').disable();
    this.DetailMaxForm.get('cto').disable();

    if (response.subWorkstream2) {
      this.SubWorkstream(response.subWorkstream2);
    }

    this.DetailMaxForm.patchValue(response);

    this.GetSetDate(response);

    if (response.workstream) {
      this.DetailMaxForm.patchValue({ workstreamLead: this.DetailMaxForm.controls.workstreamLead.value });
    }
    if (this.DetailMaxForm.controls.kpisForm.valid) {
      this.maxService.CreateKpi(this.id, this.DetailMaxForm.controls.kpisForm.value).subscribe(() => { });
    }
  }

  DetailSubmit() {
    this.DetailMaxForm.get('sponsorEvp').enable();
    this.DetailMaxForm.get('toFinance').enable();
    this.DetailMaxForm.get('cfo').enable();
    this.DetailMaxForm.get('cto').enable();

    if (!this.Detail) { this.SaveMaxApprover(); }

    if (this.DetailMaxForm.controls.kpisForm.dirty) {
      this.maxService.CreateKpi(this.id, this.DetailMaxForm.controls.kpisForm.value).subscribe(() => {});
    }
  }

  SaveDraft() {
    this.PatchForm();
    this.Detail ?
    this.maxService.UpdateDetailInformation(this.id, this.DetailMaxForm.value).subscribe((response) => this.DetailDraft(response)) :
    this.maxService.CreateDetailInformation(this.id, this.DetailMaxForm.value).subscribe((response) => this.DetailDraft(response));
  }

  CheckAdditional() {
    if (!this.invalidAdditional) {
      this.DetailMaxForm.controls.capital.clearValidators();
      this.DetailMaxForm.controls.capital.updateValueAndValidity();
      this.DetailMaxForm.controls.catalyst.clearValidators();
      this.DetailMaxForm.controls.catalyst.updateValueAndValidity();
      this.DetailMaxForm.controls.software.clearValidators();
      this.DetailMaxForm.controls.software.updateValueAndValidity();
      this.DetailMaxForm.controls.rightOfUse.clearValidators();
      this.DetailMaxForm.controls.rightOfUse.updateValueAndValidity();
    }
  }

  SetMarkAsTouchedForm() {
    if (this.CheckMax) {
      if (!this.stage) {
        this.DetailMaxForm.controls.initiativeTypeMax.markAsTouched();
        this.DetailMaxForm.controls.workstream.markAsTouched();
        this.DetailMaxForm.controls.subWorkstream2.markAsTouched();
        this.DetailMaxForm.controls.workstreamLead.markAsTouched();
      } else {
        switch (this.stage) {
          case 'IL0':
          case 'IL2':
          case 'IL3':
          case 'IL4':
          case 'IL5':
            this.DetailMaxForm.controls.workstreamLead.markAsTouched();
            break;
          case 'IL1':
            this.DetailMaxForm.controls.il3Date.markAsTouched();
            this.DetailMaxForm.controls.il4Date.markAsTouched();
            this.DetailMaxForm.controls.il5Date.markAsTouched();
            this.DetailMaxForm.controls.workstreamLead.markAsTouched();
            break;
        }
      }
    }
    if (this.CheckCapex) {
      this.DetailMaxForm.controls.president.markAsTouched();
      this.DetailMaxForm.controls.manager.markAsTouched();
      this.DetailMaxForm.controls.projectManager.markAsTouched();
      this.DetailMaxForm.controls.baseCase.markAsTouched();
      this.DetailMaxForm.controls.projectIrrBaseCase.markAsTouched();
      this.DetailMaxForm.controls.npvBaseCase.markAsTouched();
      this.DetailMaxForm.controls.paybackBaseCase.markAsTouched();
      this.DetailMaxForm.controls.ebitdaBaseCase.markAsTouched();
      this.DetailMaxForm.controls.depreciationCost.markAsTouched();
      this.DetailMaxForm.controls.equipmentOrAsset.markAsTouched();
      this.DetailMaxForm.controls.cycleYear.markAsTouched();
      this.DetailMaxForm.controls.cycleMonth.markAsTouched();
      this.DetailMaxForm.controls.boiNo.markAsTouched();
      if (this.DetailMaxForm.controls.forTurnaround.value === 'true') {
        this.DetailMaxForm.controls.cutFeedDate.markAsTouched();
        this.DetailMaxForm.controls.startUpDate.markAsTouched();
      }
      if (this.DetailMaxForm.controls.replaceEquipment.value === 'true') {
        this.DetailMaxForm.controls.equipmentName.markAsTouched();
        this.DetailMaxForm.controls.replacementDate.markAsTouched();
        this.DetailMaxForm.controls.oldAssetCondition.markAsTouched();
      }
      if (this.DetailMaxForm.controls.oldAssetCondition.value === 'repair') {
        this.DetailMaxForm.controls.oldAssetNo.markAsTouched();
      }
      if (this.DetailMaxForm.controls.boi.value === 'true') {
        this.DetailMaxForm.controls.boi.markAsTouched();
      }
      if (this.DetailMaxForm.controls.coordinate.value === 'true') {
        this.DetailMaxForm.controls.parties.markAsTouched();
      }
      this.DetailMaxForm.controls.capital.markAsTouched();
      this.DetailMaxForm.controls.catalyst.markAsTouched();
      this.DetailMaxForm.controls.software.markAsTouched();
      this.DetailMaxForm.controls.rightOfUse.markAsTouched();
    }
  }

  SaveSubmit() {
    this.SetMarkAsTouchedForm();
    this.CheckAdditional();
    if (this.invalidSubmit) {
      this.PatchForm();
      this.DetailSubmit();
      this.Detail ?
      this.maxService.UpdateDetailInformation(this.id, this.DetailMaxForm.value).subscribe((response) => this.GetSetDate(response)) :
      this.maxService.CreateDetailInformation(this.id, this.DetailMaxForm.value).subscribe((response) => this.GetSetDate(response));
    } else {
      this.swalTool.Required();
    }
  }

  Draft(page) {
    if (page === 'detail-max' || page === 'direct-capex') {
      this.SaveDraft();
    }
  }

  Submit(page) {
    if (page === 'detail-max' || page === 'direct-capex') {
      this.SaveSubmit();
    }
  }
}
