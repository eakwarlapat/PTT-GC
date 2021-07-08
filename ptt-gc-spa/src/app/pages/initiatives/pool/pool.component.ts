import { UnauthorizedService } from '@errors/unauthorized/unauthorized.service';
import { ResponseService } from '@errors/response/response.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { InitiativeService } from '@services/initiative/initiative.service';
import { SwalTool } from '@tools/swal.tools';
import { AuthService } from '@services/authentication/auth.service';
import { SubmitService } from '@services/submit/submit.service';
import { DateUtil } from '@utils/date.utils';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { MaxService } from '@services/max/max.service';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PoolComponent implements OnInit {

  @ViewChild('AttachmentModal', { static: false }) AttachmentModal: ModalDirective;

  @ViewChild('poolTabs', { static: false }) poolTabs: TabsetComponent;

  constructor(
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private swalTool: SwalTool,
    private authService: AuthService,
    private maxService: MaxService,
    private unauthorized: UnauthorizedService,
    private response: ResponseService,
    private submitService: SubmitService,
    private initiativeService: InitiativeService
  ) { }

  // --------------------  Investment Detail -------------------- //
  name = '';

  id: number;
  type: string;
  page: string;

  username: string;

  detail: number;

  PoolForm = this.fb.group({
    id: '',
    initiativeType: 'Request Pool',
    poolType: ['', Validators.required],
    registeringDate: null,
    name: [null, Validators.required],
    ownerName: [null, Validators.required],
    organization: [null, Validators.required],
    company: [null, Validators.required],
    plant: [null, Validators.required],
    createdBy: null,
    updatedBy: null
  });

  dateRegister: string;

  params: any = {};
  owners: any = [];
  companyName: any = [];
  organizations: any = [];
  plants: any = [];

  createdBy: string;

  // -------------------- Detail Information -------------------- //
  bsConfigDate = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };

  frequencies: any;
  kpises: any;
  kpiArray: any = [];
  kpiDetails: any;

  isDisableAddKpis = false;
  isRemoveKpis     = true;

  DetailForm = this.fb.group({
    id: 0,
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
    remark: null,
    otherKpis: null
  });

  get PoolView() {
    return this.page === 'pool-view';
  }

  get invalidName() {
    return this.PoolForm.controls.name.touched && this.PoolForm.controls.name.invalid;
  }

  get invalidOwnerName() {
    return this.PoolForm.controls.ownerName.touched && this.PoolForm.controls.ownerName.invalid;
  }

  get invalidOrganization() {
    return this.PoolForm.controls.organization.touched && this.PoolForm.controls.organization.invalid;
  }

  get invalidPlant() {
    return this.PoolForm.controls.plant.touched && this.PoolForm.controls.plant.invalid;
  }

  get invalidCompany() {
    return this.PoolForm.controls.company.touched && this.PoolForm.controls.company.invalid;
  }

  get invalidPoolType() {
    return this.PoolForm.controls.poolType.touched && this.PoolForm.controls.poolType.invalid;
  }

  get ValidGeneral() {
    return this.PoolForm.valid;
  }

  get ValidDetail() {
    return this.DetailForm.valid;
  }

  ngOnInit(): void {
    this.GetOwners();
    this.GetUser();
    this.GetCompany();
    this.GetOrganizations();
    this.GetPlants();
    this.CheckPage();
  }

  CheckPage() {
    this.page = ['pool-edit', 'pool-view'].indexOf(sessionStorage.getItem('page')) !== -1 ? sessionStorage.getItem('page') : 'pool-create';
    switch (this.page) {
      case 'pool-create':
        setTimeout(() => this.poolTabs.tabs[1].disabled = true, 100);
        this.name = 'New Investment Detail';
        break;
      case 'pool-edit'  :
        setTimeout(() => this.poolTabs.tabs[1].disabled = false, 100);
        this.name = 'Edit Investment Detail';
        this.id   = Number(sessionStorage.getItem('id'));
        if (this.id) { this.GetInitiative(); }
        break;
      case 'pool-view'  :
        setTimeout(() => this.poolTabs.tabs[1].disabled = false, 100);
        this.name = 'Investment Detail';
        this.id   = Number(sessionStorage.getItem('id'));
        if (this.id) { this.GetInitiative(); }
        this.PoolForm.disable();
        this.DetailForm.disable();
        break;
    }
  }

  // --------------------  Save --------------------------------- //
  Draft() {
    this.SaveDraftGeneral();
    this.SaveDraftDetail();
  }

  Submit() {
    this.SaveSubmitGeneral();
    this.SaveSubmitDetail();
  }

  // --------------------  Attachment --------------------------- //
  ShowAttachment() {
    if (this.id) {
      this.AttachmentModal.show();
    } else {
      this.swalTool.InitiativeNotFound();
    }
  }

  CloseAttachment() {
    this.AttachmentModal.hide();
  }

  // --------------------  Investment Detail -------------------- //
  GetUser() {
    this.authService.getUser().subscribe((response) => {
      this.username = response.username;
      this.params.text = this.username;
      this.initiativeService.GetOwnersEmail(this.params).subscribe(owners => {
        this.owners = owners;
        const owner = this.owners.filter(obj => {
          return obj.email.toLowerCase().trim() === this.username.toLowerCase().trim();
        });
        if (!this.id) {
          this.PoolForm.patchValue({ ownerName: owner[0].ownerName });
        }
      });
    }, error => this.unauthorized.error(error));
  }

  GetOwners(Text?) {
    this.params.text = Text ? Text : '';
    this.initiativeService.GetOwners(this.params).subscribe(owners => {
      this.owners = owners;
    });
  }

  GetCompany() {
    this.initiativeService.GetCompany().subscribe(companyName => this.companyName = companyName);
  }

  GetOrganizations() {
    this.initiativeService.GetOrganizations().subscribe(organizations => this.organizations = organizations);
  }

  GetPlants() {
    this.initiativeService.GetPlants().subscribe(plants => this.plants = plants);
    this.plants.push({ id: 9999, plantId: 'P9999', plantTitle: 'Others (please specify)' });
  }

  SearchOwnerName(event) {
    this.GetOwners(event.term);
  }

  ClearOwnerName() {
    this.GetOwners();
  }

  GetInitiative() {
    this.initiativeService.GetInitiative(this.id).subscribe(response => {
      this.PoolForm.patchValue(response);
      this.dateRegister = this.dateUtil.SetDate(new Date(response.registeringDate));
      this.createdBy    = response.createdBy;
      this.GetDetailInformation();
    }, error => this.response.error(error));
  }

  SetMarkAsTouchedForm() {
    this.PoolForm.controls.name.markAsTouched();
    this.PoolForm.controls.poolType.markAsTouched();
    this.PoolForm.controls.ownerName.markAsTouched();
    this.PoolForm.controls.organization.markAsTouched();
    this.PoolForm.controls.company.markAsTouched();
    this.PoolForm.controls.plant.markAsTouched();
  }

  SetForm() {
    this.PoolForm.patchValue({
      registeringDate : this.dateRegister ? this.dateRegister : this.dateUtil.SetDate(new Date()),
      createdBy       : this.createdBy    ? this.createdBy    : this.username
     });
  }

  SetEdit(id) {
    sessionStorage.setItem('id'  , id.toString());
    sessionStorage.setItem('page', 'pool-edit');
    this.page = 'pool-edit';
    this.name = 'Edit Investment Detail';
    this.poolTabs.tabs[1].disabled = false;
  }

  CreateDraftInitiative() {
    this.initiativeService.CreateDraftInitiative(this.PoolForm.value).subscribe(response => {
      this.id = response.id;
      this.PoolForm.patchValue(response);
      this.SetEdit(response.id);
      this.swalTool.Draft();
    }, error => this.response.error(error));
  }

  CreateSubmitInitiative() {
    this.initiativeService.CreateSubmitInitiative(this.PoolForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      this.submitService.SubmitStageStatus(response.id, { status: 'forward', comment: '' }).subscribe(() => this.swalTool.Submit());
    }, error => this.response.error(error));
  }

  UpdateDraftInitiative() {
    this.PoolForm.patchValue({ updatedBy : this.username });
    this.initiativeService.UpdateDraftInitiative(this.id, this.PoolForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      this.PoolForm.patchValue(response);
      this.swalTool.Draft();
    }, error => this.response.error(error));
  }

  UpdateSubmitInitiative() {
    this.PoolForm.patchValue({ updatedBy : this.username });
    this.initiativeService.UpdateSubmitInitiative(this.id, this.PoolForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      this.submitService.SubmitStageStatus(this.id, { status: 'forward', comment: '' }).subscribe(() => this.swalTool.Submit());
    }, error => this.response.error(error));
  }

  CurrentPage() {
    switch (this.page) {
      case 'pool-create':
        switch (this.type) {
          case 'draft':  this.CreateDraftInitiative();  break;
          case 'submit': this.CreateSubmitInitiative(); break;
        }
        break;
      case 'pool-edit':
        switch (this.type) {
          case 'draft':  this.UpdateDraftInitiative();  break;
          case 'submit': this.UpdateSubmitInitiative(); break;
        }
        break;
    }
  }

  SaveDraftGeneral() {
    this.PoolForm.controls.name.markAsTouched();
    if (this.PoolForm.controls.name.valid) {
      this.type = 'draft';
      this.SetForm();
      this.CurrentPage();
    } else {
      this.swalTool.Required();
    }
  }

  SaveSubmitGeneral() {
    if (this.ValidGeneral) {
      this.type = 'submit';
      this.SetForm();
      this.CurrentPage();
    } else {
      this.SetMarkAsTouchedForm();
      this.swalTool.Required();
    }
  }

  // -------------------- Detail Information -------------------- //
  GetDetailInformation() {
    this.GetFrequency();
    this.GetKpis();
  }

  GetFrequency() {
    this.maxService.GetFrequency().subscribe(frequency => this.frequencies = frequency);
  }

  GetKpis() {
    this.maxService.GetKpis().subscribe(kpis => {
      this.kpises = kpis;
      this.kpises.forEach(result => result.disabled = false);
      this.GetKpiDetail(this.id);
      this.GetDetail(this.id);
    });
  }

  GetKpiDetail(id) {
    this.maxService.GetKpiDetail(id).subscribe(response => {
      this.kpiDetails = response.kpiDetailInformations;
      if (this.kpiDetails.length !== 0) {
        const KpiControl = this.DetailForm.controls.kpisForm.get('kpis') as FormArray;
        for (let i = 0; i < this.kpiDetails.length; i++) {
          KpiControl.push(this.DetailKpisForm());
          KpiControl.at(i).patchValue(this.kpiDetails[i]);
          KpiControl.at(i).get('id').patchValue(0);
          this.kpiArray.push({ id: i, title: this.kpiDetails[i].kpis });
          if (this.page === 'pool-view') { KpiControl.at(i).disable(); }
        }
        this.SetKpiSelect();
        this.isRemoveKpis = KpiControl.length > 1 ? false : true;
        this.isDisableAddKpis = KpiControl.length === this.kpises.length ? true : false;
      } else {
        this.AddKpis();
      }
    });
  }

  GetDetail(id) {
    this.maxService.GetDetailInformation(id).subscribe(response => {
      if (response) {
        this.detail = response.id;
        this.DetailForm.patchValue(response);
      }
    });
  }

  OnchangeUsefulMonth() {
    if (this.DetailForm.controls.usefulMonth.value > 12) {
      this.DetailForm.patchValue({ usefulMonth: 12 });
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

  DetailKpisForm(): FormGroup {
    return this.fb.group({ id: [0], kpis: '', target: null, frequency: '', initiativeId: this.id });
  }

  AddKpis() {
    const control = this.DetailForm.controls.kpisForm.get('kpis') as FormArray;
    control.push(this.DetailKpisForm());
    this.isRemoveKpis     = control.length > 1 ? false : true;
    this.isDisableAddKpis = control.length === this.kpises.length ? true : false;
  }

  RemoveKpis(index: number) {
    this.kpiArray = this.kpiArray.filter(el => el.id !== index);
    this.SetKpiSelect();
    const control = this.DetailForm.controls.kpisForm.get('kpis') as FormArray;
    control.removeAt(index);
    this.DetailForm.controls.kpisForm.markAsDirty();
    this.isRemoveKpis     = control.length > 1 ? false : true;
    this.isDisableAddKpis = control.length === this.kpises.length ? true : false;
  }

  PatchDetail() {
    this.DetailForm.patchValue({ id: this.detail ? this.detail : 0 });
  }

  DetailDraft(response) {
    this.detail = response.id;
    this.DetailForm.patchValue(response);
    if (this.DetailForm.controls.kpisForm.valid) {
      this.maxService.CreateKpi(this.id, this.DetailForm.controls.kpisForm.value).subscribe(() => {});
    }
  }

  DetailSubmit() {
    if (this.DetailForm.controls.kpisForm.dirty) {
      this.maxService.CreateKpi(this.id, this.DetailForm.controls.kpisForm.value).subscribe(() => {});
    }
  }

  SaveDraftDetail() {
    this.PatchDetail();
    this.detail ?
    this.maxService.UpdateDetailInformation(this.id, this.DetailForm.value).subscribe((response) => this.DetailDraft(response)) :
    this.maxService.CreateDetailInformation(this.id, this.DetailForm.value).subscribe((response) => this.DetailDraft(response)) ;
  }

  SaveSubmitDetail() {
    if (this.ValidDetail) {
      this.PatchDetail();
      this.detail ?
      this.maxService.UpdateDetailInformation(this.id, this.DetailForm.value).subscribe(() => this.DetailSubmit()) :
      this.maxService.CreateDetailInformation(this.id, this.DetailForm.value).subscribe(() => this.DetailSubmit()) ;
    } else {
      this.swalTool.Required();
    }
  }
}
