import { ResponseService } from '@errors/response/response.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MaxService } from '@services/max/max.service';
import { DetailService } from '@services/detail/detail.service';
import { ImpactService } from '@services/impact/impact.service';
import { DateUtil } from '@utils/date.utils';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { StatusService } from '@services/status/status.service';
import { InitiativeService } from '@services/initiative/initiative.service';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-view-max-capex',
  templateUrl: './view-max-capex.component.html',
  styleUrls: ['./view-max-capex.component.css']
})
export class ViewMaxCapexComponent implements OnInit {

  @ViewChild('ViewLogHistoryModal', { static: false }) ViewLogHistoryModal: ModalDirective;

  @ViewChild('HistoryStatus', { static: false }) HistoryStatus: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private impactService: ImpactService,
    private response: ResponseService,
    private detailService: DetailService,
    private maxService: MaxService,
    private statusService: StatusService,
    private initiativeService: InitiativeService
  ) { }

  @Input() id;
  @Input() name;
  @Input() max;
  @Input() capex;

  history: string;
  IsApprove: boolean;

  strategicObjectives: any = [];
  strategies: any = [];

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

  procurementCategoryList: any = [];
  procurementSubCategoryList: any = [];
  procurementLeverList: any = [];

  IL3DateDisplay: string;
  IL4DateDisplay: string;
  IL5DateDisplay: string;

  CutFeedDateDisplay: string;
  StartUpDateDisplay: string;

  ReplacementDateDisplay: string;

  subWorkstreams: any;
  frequencies: any;
  kpises: any;
  types: any;
  workStreams: any;

  DetailMaxForm = this.fb.group({
    initiativeYear: null,
    strategicObjective: '',
    strategy: { value: '', disabled: true },
    initiativeTypeMax: '',
    workstream: '',
    subWorkstream1: null,
    subWorkstream2: { value: '', disabled: true },
    proCategory: '',
    proSubCategory: '',
    proLever: '',
    baseline: '',
    baselineHistorical: '',
    baselineNonHistorical: '',
    saving: '',
    savingHistorical: '',
    savingNonHistorical: '',
    il3Date: [null],
    il4Date: [null],
    il5Date: [null],
    sponsorEvp: '',
    workstreamLead: '',
    toFinance: null,
    cto: '',
    cfo: null,
    president: '',
    manager: '',
    projectManager: '',
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
    cutFeedDate: new Date(),
    startUpDate: new Date(),
    cycleYear: null,
    cycleMonth: null,
    replaceEquipment: 'true',
    equipmentName: null,
    replacementDate: new Date(),
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
    coordinate: 'false',
    parties: null,
    remark: null,
    otherKpis: null
  });

  kpiDetailInformations: any = [];

  isMax: any = false;

  detailInformations: any = {};

  CheckMax: boolean;
  CheckCapex: boolean;

  IsShowFormCondition = false;
  IsShowProcurement = false;
  IsRequestCapex = false;
  IsShowTurnAround = true;
  IsShowReplace = true;
  IsShowOldAsset = false;
  IsShowBOI = true;
  IsShowParties = false;
  IsShowAdditional = true;
  IsShowReturn = false;

  ngOnInit(): void {
    this.CheckType();
    this.GetDetailInformation();
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

  CheckType() {
    this.CheckMax = this.max ? true : false;
    this.CheckCapex = this.capex ? true : false;
  }

  DetailKpisForm(): FormGroup {
    return this.fb.group({ id: [0], kpis: '', target: null, frequency: '', initiativeId: this.id });
  }

  AddKpis() {
    const control = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
    control.push(this.DetailKpisForm());
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
  }

  GetDetailInformation() {
    this.DetailMaxForm.disable();
    this.maxService.GetFrequency().subscribe(frequency => this.frequencies = frequency);
    this.maxService.GetKpis().subscribe(kpis => this.kpises = kpis);
    this.detailService.GetProcurementCategory().subscribe(procurementName => this.procurementCategoryList = procurementName);
    this.detailService.GetProcurementSubCategory().subscribe(procurementName => this.procurementSubCategoryList = procurementName);
    this.detailService.GetProcurementLever().subscribe(procurementName => this.procurementLeverList = procurementName);
    this.maxService.GetKpiDetail(this.id).subscribe(response => {
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

      this.detailService.GetStrategicObjectives(response.year).subscribe(result => this.strategicObjectives = result);

      this.kpiDetailInformations = response.kpiDetailInformations;
      if (this.kpiDetailInformations !== 0) {
        const KpiControl = this.DetailMaxForm.controls.kpisForm.get('kpis') as FormArray;
        for (let i = 0; i < this.kpiDetailInformations.length; i++) {
          KpiControl.push(this.DetailKpisForm());
          KpiControl.at(i).patchValue(this.kpiDetailInformations[i]);
          KpiControl.at(i).disable();
        }
      } else {
        this.AddKpis();
      }
    }, error => this.response.error(error));

    this.maxService.GetDetailInformation(this.id).subscribe(response => {
      this.maxService.GetInitiativeTypeMax().subscribe(type => this.types = type);
      this.impactService.GetWorkStream().subscribe(workStreams => this.workStreams = workStreams);
      if (response) {
        if (response.strategicObjective) {
          this.detailService.GetStrategies(response.strategicObjective).subscribe(strategies => this.strategies = strategies);
        }

        if (response.workstream) {
          this.maxService.GetSubWorkstream(response.workstream).subscribe(subWorkstream => this.subWorkstreams = subWorkstream);
          this.WorkstreamLead(response.workstream);
          this.maxService.GetWorkstreamLead(this.id).subscribe(approve => {
            if (approve) {
              this.DetailMaxForm.patchValue({ workstreamLead: approve.approverEmail });
            } else {
              this.DetailMaxForm.patchValue({ workstreamLead: '' });
            }
          });
        }

        if (response.subWorkstream2) {
          this.SubWorkstream(response.subWorkstream2);
        } else {
          this.DetailMaxForm.controls.subWorkstream2.disable();
        }

        if (response.workstream === 'Procurement') {
          this.IsShowProcurement = true;
        } else {
          this.IsShowProcurement = false;
          this.DetailMaxForm.controls.proCategory.disable();
          this.DetailMaxForm.controls.proSubCategory.disable();
          this.DetailMaxForm.controls.proLever.disable();
        }

        this.DetailMaxForm.patchValue(response);

        if (this.DetailMaxForm.controls.boi.value === 'true') {
          this.IsShowBOI = true;
        } else {
          this.IsShowBOI = true;
        }

        if (this.DetailMaxForm.controls.forTurnaround.value === 'true') {
          this.IsShowTurnAround = true;
        } else {
          this.IsShowTurnAround = false;
        }

        if (this.DetailMaxForm.controls.oldAssetCondition.value === 'repair') {
          this.IsShowOldAsset = true;
        } else {
          this.IsShowOldAsset = false;
        }

        if (this.DetailMaxForm.controls.replaceEquipment.value === 'true') {
          this.IsShowReplace = true;
        } else {
          this.IsShowReplace = false;
        }

        if (this.DetailMaxForm.controls.coordinate.value === 'true') {
          this.IsShowParties = true;
        } else {
          this.IsShowParties = false;
        }
        if (this.DetailMaxForm.controls.haveAdditional.value === 'true') {
          this.IsShowAdditional = true;
        } else {
          this.IsShowAdditional = false;
        }

        this.IL3DateDisplay = response.iL3Date ? this.dateUtil.GetDate(new Date(response.iL3Date)) : null;
        this.IL4DateDisplay = response.iL4Date ? this.dateUtil.GetDate(new Date(response.iL4Date)) : null;
        this.IL5DateDisplay = response.iL5Date ? this.dateUtil.GetDate(new Date(response.iL5Date)) : null;

        this.CutFeedDateDisplay = response.cutFeedDate ? this.dateUtil.GetDate(new Date(response.cutFeedDate)) : null;
        this.StartUpDateDisplay = response.startUpDate ? this.dateUtil.GetDate(new Date(response.startUpDate)) : null;
        this.ReplacementDateDisplay = response.replacementDate ? this.dateUtil.GetDate(new Date(response.replacementDate)) : null;

        this.DetailMaxForm.patchValue({
          il3Date: this.IL3DateDisplay,
          il4Date: this.IL4DateDisplay,
          il5Date: this.IL5DateDisplay,
          cutFeedDate: this.CutFeedDateDisplay,
          startUpDate: this.StartUpDateDisplay,
          replacementDate: this.ReplacementDateDisplay
        });
      }
    });
  }
}
