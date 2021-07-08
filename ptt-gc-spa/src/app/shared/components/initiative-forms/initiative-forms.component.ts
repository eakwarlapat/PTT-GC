import { Component, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { InitiativeService } from '@services/initiative/initiative.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '@services/authentication/auth.service';
import { RemoveService } from '@services/remove/remove.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UnauthorizedService } from '@errors/unauthorized/unauthorized.service';
import { SuggestionService } from '@services/suggestion/suggestion.service';
import { SwalTool } from '@tools/swal.tools';
import { DateUtil } from '@utils/date.utils';
import { ResponseService } from '@errors/response/response.service';
import { ImpactService } from '@services/impact/impact.service';

@Component({
  selector: 'app-initiative-forms',
  templateUrl: './initiative-forms.component.html',
  styleUrls: ['./initiative-forms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InitiativeFormsComponent implements OnInit, OnDestroy {

  @ViewChild('InvestmentModal', { static: false }) InvestmentModal: ModalDirective;

  constructor(
    private impactService: ImpactService,
    private removeService: RemoveService,
    private fb: FormBuilder,
    private initiativeService: InitiativeService,
    private authService: AuthService,
    private suggestion: SuggestionService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private unauthorized: UnauthorizedService,
    private swalTool: SwalTool,
    private dateUtil: DateUtil,
    private response: ResponseService
  ) { }

  @Input() id: number;
  @Input() page: string;

  @Output() SendCim = new EventEmitter();
  @Output() SendCapex = new EventEmitter();
  @Output() SendStrategy = new EventEmitter();
  @Output() SendMax = new EventEmitter();

  @Output() Required = new EventEmitter();

  initiativesForm = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    year: ['2020', Validators.required],
    ownerName: [null, Validators.required],
    organization: [null, Validators.required],
    company: [null, Validators.required],
    specifyCompany: '',
    coDeveloper: [null],
    integration: '',
    plant: [null, Validators.required],
    specifyPlant: '',
    location: ['domestic'],
    specifyLocation: null,
    registeringDate: [new Date(), Validators.required],
    startingDate: [new Date(), Validators.required],
    finishingDate: [null, Validators.required],
    background: ['', Validators.required],
    resultObjective: ['', Validators.required],
    scopeOfWork: ['', Validators.required],
    initiativeType: [null],
    requestCapex: ['true', Validators.required],
    typeOfInvestment: [null, Validators.required],
    involveItDigital: false,
    requestProjectEngineer: '',
    budgetType: '',
    ram: '',
    jFactor: [null],
    irr: [null],
    wacc: [8.53],
    costEstCapex: [null],
    costEstCapexType: ['THB'],
    divestment: false,
    budgetSource: '',
    requestOpex: 'falseOpex',
    costEstOpex: { value: 0, disabled: true },
    costEstOpexType: { value: 'THB', disabled: true },
    typeBenefit: '',
    benefitAmount: null,
    benefitAmountType: ['THB'],
    payBackPeriod: null,
    fxExchange: [null],
    cim: { value: '', disabled: true },
    pim: { value: '', disabled: true },
    dim: { value: '', disabled: true },
    max: { value: '', disabled: true },
    cpi: { value: '', disabled: true },
    directCapex: { value: '', disabled: true },
    strategy: { value: '', disabled: true },
    randD: { value: '', disabled: true },
    other: { value: '', disabled: true },
    // trackMax: { value: '', disabled: true },
    createdBy: '',
    updatedBy: ''
  });

  bsConfigStart = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };
  bsConfigFinish = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false, minDate: new Date() };

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  params: any = {};

  username: string;
  ownerEmail: string;

  status = 'draft';
  stage: string;

  plants: any = [];
  organizations: any = [];
  coDevelopers: any = [];
  owners: any = [];
  typeOfInvestments: any = [];
  years: any = [];
  companyName: any = [];

  coDeveloperSelected: any = [];
  coDeveloperItems = [];

  isDisabledSubmit = false;
  isDisabledDraft = false;

  type: string;

  IsCim = false;
  IsPim = false;
  IsDim = false;
  IsCapex = false;
  IsMax = false;
  IsCpi = false;
  IsRandD = false;
  IsOther = false;
  IsStrategy = false;

  isLoadSuggest = false;

  showLocation = false;
  showSpecify = false;
  showBudget = false;
  showRam = false;
  showJFactor = false;
  showIrr = false;
  showWacc = false;
  showTypeBenefit = false;
  showBenefitAmount = false;
  showPayBackPeriod = false;
  showFxExchange = true;
  showCostEstCapex = true;
  showCostEstOpex = false;
  showCostEstCapexType = true;
  showCostEstOpexType = false;
  showBudgetSource = true;
  showTypeOfInvestment = true;
  showDivestment = false;

  condition: object;

  requestCapex: string;
  typeOfInvestment: string;
  budgetType: string;
  ram: string;
  jFactor: number;
  irr: number;
  costEstCapex: any;
  costEstCapexType: string;
  costEstOpex: any;
  costEstOpexType: string;
  typeBenefit: string;
  benefitAmount: number;
  benefitAmountType: string;
  payBackPeriod: number;
  fxExchange: number;
  involveItDigital: boolean;
  budgetSource: string;
  divestment: boolean;

  replace: string;
  obsolate: string;
  confirmText = 'Maintain Reliability';

  dateRegister: string;
  dateStart: string;
  dateFinish: string;
  dateRegisterDisplay: string;
  dateStartDisplay: string;
  dateFinishDisplay: string;

  initiativeCode: string;

  attachments: any = [];
  file: any = [];
  selectListCoDeveloper: any = [];

  admin: any = [];
  admins: any = [];
  userActions: any = [];
  actionUser: string;

  approverList: any = [];

  createdBy: string;

  ButtonNext = false;

  names: any = [];

  get Investment() {
    return this.initiativesForm.controls.typeOfInvestment.value;
  }

  get invalidName() {
    return this.initiativesForm.controls.name.touched && this.initiativesForm.controls.name.invalid;
  }

  get invalidOwnerName() {
    return this.initiativesForm.controls.ownerName.touched && this.initiativesForm.controls.ownerName.invalid;
  }

  get invalidOrganization() {
    return this.initiativesForm.controls.organization.touched && this.initiativesForm.controls.organization.invalid;
  }

  get invalidPlant() {
    return this.initiativesForm.controls.plant.touched && this.initiativesForm.controls.plant.invalid;
  }

  get invalidCompany() {
    return this.initiativesForm.controls.company.touched && this.initiativesForm.controls.company.invalid;
  }

  get invalidBackground() {
    return this.initiativesForm.controls.background.touched && this.initiativesForm.controls.background.invalid;
  }

  get invalidResultObjective() {
    return this.initiativesForm.controls.resultObjective.touched && this.initiativesForm.controls.resultObjective.invalid;
  }

  get invalidScopeOfWork() {
    return this.initiativesForm.controls.scopeOfWork.touched && this.initiativesForm.controls.scopeOfWork.invalid;
  }

  get invalidTypeOfInvestment() {
    return this.initiativesForm.controls.typeOfInvestment.touched && this.initiativesForm.controls.typeOfInvestment.invalid;
  }

  get invalidStartingDate() {
    return this.initiativesForm.controls.finishingDate.touched && this.initiativesForm.controls.finishingDate.invalid;
  }

  get invalidCostEstCapex() {
    return this.initiativesForm.controls.costEstCapex.touched && this.initiativesForm.controls.costEstCapex.invalid;
  }

  get invalidCostEstOpex() {
    return this.initiativesForm.controls.costEstOpex.touched && this.initiativesForm.controls.costEstOpex.invalid;
  }

  get invalidTypeOfBenefit() {
    return this.initiativesForm.controls.typeBenefit.touched && this.initiativesForm.controls.typeBenefit.invalid;
  }

  get invalidBenefitAmount() {
    return this.initiativesForm.controls.benefitAmount.touched && this.initiativesForm.controls.benefitAmount.invalid;
  }

  get invalidPayBack() {
    return this.initiativesForm.controls.payBackPeriod.touched && this.initiativesForm.controls.payBackPeriod.invalid;
  }

  get invalidBudget() {
    return this.initiativesForm.controls.budgetType.touched && this.initiativesForm.controls.budgetType.invalid;
  }

  get invalidJFactor() {
    return this.initiativesForm.controls.jFactor.touched && this.initiativesForm.controls.jFactor.invalid;
  }

  get invalidFX() {
    return this.initiativesForm.controls.fxExchange.touched && this.initiativesForm.controls.fxExchange.invalid;
  }

  get invalidRam() {
    return this.initiativesForm.controls.ram.touched && this.initiativesForm.controls.ram.invalid;
  }

  get invalidIrr() {
    return this.initiativesForm.controls.irr.touched && this.initiativesForm.controls.irr.invalid;
  }

  get CheckSuggestion() {
    return (this.IsCim || this.IsPim || this.IsDim || this.IsCapex || this.IsMax ||
      this.IsCpi || this.IsRandD || this.IsStrategy || this.IsOther);
  }

  get CheckOnlyMax() {
    return (this.IsCim || this.IsPim || this.IsDim || this.IsCapex ||
      this.IsCpi || this.IsRandD || this.IsStrategy || this.IsOther);
  }

  get CheckValidForm() {
    return this.initiativesForm.valid && this.CheckSuggestion;
  }

  get StageIL5() {
    const stages = ['IL0', 'IL1', 'IL2', 'IL3', 'IL4', 'IL5'];
    return stages.indexOf(this.stage) !== -1;
  }

  ngOnInit(): void {
    this.GetUser();
    this.GetYears();
    this.SetRegisterDate();
    this.GetPlants();
    this.GetOrganizations();
    this.GetTypeOfInvestments();
    this.IsInitiativesForm();
    this.CheckValidate();
    if (this.page === 'edit') { this.GetInitiative(); }
    this.GetCompany();
    this.SetGeneral();
  }

  ngOnDestroy() {
    sessionStorage.setItem('InitiativeValidated', this.stage === 'IL5' ? 'true' : JSON.stringify(this.CheckValidForm));
    sessionStorage.setItem('InitiativeValidate' , this.stage === 'IL5' ? 'true' : JSON.stringify(this.CheckValidForm));
    sessionStorage.setItem('InitiativeActive', 'true');
    switch (this.page) {
      case 'edit':
        sessionStorage.setItem('Status', this.status);
        sessionStorage.setItem('Stage', this.stage);
        if (this.initiativesForm.dirty) {
          this.PatchSetDate();
          this.PatchSuggest();
          sessionStorage.setItem('isInitiativesForm', 'true');
          sessionStorage.setItem('InitiativeCode', this.initiativeCode);
          sessionStorage.setItem('InitiativesForm', JSON.stringify(this.initiativesForm.value));
        }
        break;
    }
  }

  SetGeneral() {
    sessionStorage.setItem('InitiativeActive', 'true');
  }

  CheckRequired(event) {
    this.Required.emit(event);
  }

  CheckValidate() {
    if (sessionStorage.getItem('InitiativeValidate') === 'false') {
      setTimeout(() => this.SetMarkAsTouchedFormGeneral(), 50);
    }
  }

  PatchSetDate() {
    this.initiativesForm.patchValue({
      registeringDate: this.dateRegister ? this.dateRegister : this.dateUtil.SetDate(new Date()),
      startingDate: this.dateStart ? this.dateStart : null,
      finishingDate: this.dateFinish ? this.dateFinish : null,
    });
  }

  PatchGetDate(InitiativesForm) {
    this.dateRegisterDisplay = this.dateUtil.GetDate(new Date(InitiativesForm.registeringDate));
    this.dateStartDisplay = this.dateUtil.GetDate(new Date(InitiativesForm.startingDate));
    this.dateFinishDisplay = InitiativesForm.finishingDate ? this.dateUtil.GetDate(new Date(InitiativesForm.finishingDate)) : null;
    this.initiativesForm.patchValue({
      registeringDate: this.dateRegisterDisplay ? this.dateRegisterDisplay : null,
      startingDate: this.dateStartDisplay ? this.dateStartDisplay : null,
      finishingDate: this.dateFinishDisplay ? this.dateFinishDisplay : null,
    });
  }

  IsInitiativesForm() {
    if (sessionStorage.getItem('isInitiativesForm') === 'true') {
      const InitiativesForm = JSON.parse(sessionStorage.getItem('InitiativesForm'));
      const InitiativesCode = sessionStorage.getItem('InitiativeCode');
      this.createdBy = InitiativesForm.createdBy;
      this.initiativesForm.patchValue(InitiativesForm);
      if (InitiativesForm.requestOpex === 'trueOpex') {
        this.impactService.GetImpactTotalCostOPEX(this.id).subscribe((result) => {
          if (result) {
            if (result !== 0) {
              this.initiativesForm.patchValue({ costEstOpex: result });
            }
          }
        });
      }
      if (InitiativesForm.benefitAmount) {
        if (sessionStorage.getItem('TotalRecurringOneTime')) {
          const TotalRecurringOneTime = Number(sessionStorage.getItem('TotalRecurringOneTime'));
          this.initiativesForm.patchValue({ benefitAmount: TotalRecurringOneTime.toFixed(3) });
          this.CalculatePayBackPeriod();
        } else {
          this.impactService.GetImpactTotalRecurringOneTime(this.id).subscribe((result) => {
            if (result) {
              if (result !== 0) {
                this.initiativesForm.patchValue({ benefitAmount: result.toFixed(3) });
                this.CalculatePayBackPeriod();
              }
            }
          });
        }
      }
      setTimeout(() => {
        this.initiativeCode = InitiativesCode;
        this.status = sessionStorage.getItem('Status');
        this.stage = sessionStorage.getItem('Stage');
        this.ActiveSuggestion(InitiativesForm);
        this.CheckTypeOfInvestment(InitiativesForm.typeOfInvestment);
        this.CheckTypeBenefit(InitiativesForm.typeBenefit);
        this.CheckCostEstCapexType(InitiativesForm.costEstCapexType);
        this.CheckCostEstCapex(InitiativesForm.costEstCapex);
        this.CheckRequestCapex(InitiativesForm.requestCapex);
        this.CheckRequestOpex(InitiativesForm.requestOpex);
        this.PatchGetDate(InitiativesForm);
      }, 1500);
    }

    if (sessionStorage.getItem('InitiativeActive') === 'true') {
      if (sessionStorage.getItem('TotalRecurringOneTime')) {
        setTimeout(() => {
          const TotalRecurringOneTime = Number(sessionStorage.getItem('TotalRecurringOneTime'));
          this.initiativesForm.patchValue({ benefitAmount: TotalRecurringOneTime.toFixed(3) });
          this.CalculatePayBackPeriod();
        }, 1500);
      }
    }

    if (sessionStorage.getItem('Stage') === 'IL5') {
      setTimeout(() => this.initiativesForm.disable(), 100);
    }
  }

  CheckCostEstCapex(value) {
    if (value > 300) {
      this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'wacc']);
      this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod']);
      this.initiativesForm.patchValue({ typeBenefit: '' });
    }
  }

  CheckRequestCapex(value) {
    if (value === 'false') {
      this.EnableForm(['typeBenefit', 'divestment']);
      this.ShowForm(['typeBenefit', 'divestment']);
      this.HideForm(['investment', 'budgetType', 'ram', 'irr', 'jFactor',
        'costEstCapex', 'costEstCapexType', 'fxExchange', 'budgetSource']);
      this.DisableForm(['investment', 'budgetType', 'ram', 'irr', 'jFactor',
        'costEstCapex', 'costEstCapexType', 'fxExchange', 'budgetSource']);
    }
  }

  CheckRequestOpex(value) {
    if (value === 'falseOpex') {
      this.HideForm(['costEstOpex', 'costEstOpexType']);
      this.DisableForm(['costEstOpex', 'costEstOpexType']);
    } else {
      this.EnableForm(['costEstOpex', 'costEstOpexType']);
      this.ShowForm(['costEstOpex', 'costEstOpexType']);
    }
  }

  CheckOwner(ownerName, createdBy) {
    //   this.authService.getUser().subscribe((user) => {
    //     this.params.text = ownerName;
    //     this.initiativeService.GetOwnerName(this.params).subscribe(owners => {
    //       if (user.username !== owners.email) {
    //         if (user.username !== createdBy) {
    //           this.router.navigate(['']);
    //         }
    //       }
    //     });
    //   }, error => this.unauthorized.error(error));
  }

  SetGetInitiative(response) {
    this.initiativesForm.patchValue({
      budgetSource: response.budgetSource ? response.budgetSource : '',
      jFactor: response.jFactor !== 0 ? response.jFactor : null,
      irr: response.irr !== 0 ? response.irr : null,
      costEstCapex: response.costEstCapex !== 0 ? response.costEstCapex : null,
      benefitAmount: response.benefitAmount !== 0 ? response.benefitAmount : null,
      fxExchange: response.fxExchange !== 0 ? response.fxExchange : null,
      payBackPeriod: response.payBackPeriod !== 0 ? response.payBackPeriod : null
    });
  }

  GetSetDate(registeringDate, startingDate, finishingDate) {
    this.dateRegisterDisplay = this.dateUtil.GetDate(new Date(registeringDate));
    this.dateStartDisplay = this.dateUtil.GetDate(new Date(startingDate));
    this.dateFinishDisplay = finishingDate ? this.dateUtil.GetDate(new Date(finishingDate)) : null;
    this.dateRegister = this.dateUtil.SetDate(new Date(registeringDate));
    this.dateStart = this.dateUtil.SetDate(new Date(startingDate));
    this.dateFinish = finishingDate ? this.dateUtil.SetDate(new Date(finishingDate)) : null;
  }

  GetInitiative() {
    if (sessionStorage.getItem('isInitiativesForm') !== 'true') {
      this.initiativeService.GetInitiative(this.id).subscribe(response => {

        this.createdBy = response.createdBy;

        this.initiativeCode = response.initiativeCode;
        this.status = response.status;
        this.stage = response.stage;

        this.initiativesForm.patchValue(response);

        this.coDeveloperSelected = response.initiativeCoDevelopers;
        this.coDeveloperSelected.forEach((element) => {
          if (element.coDeveloperName) { this.selectListCoDeveloper.push(element.coDeveloperName); }
        });
        this.coDeveloperItems = this.selectListCoDeveloper;

        this.initiativesForm.patchValue({ coDeveloper: this.coDeveloperItems });
        this.ActiveSuggestion(response);
        this.CheckTypeOfInvestment(response.typeOfInvestment);
        this.CheckTypeBenefit(response.typeBenefit);
        this.CheckCostEstCapexType(response.costEstCapexType);
        this.CheckCostEstCapex(response.costEstCapex);
        this.CheckRequestCapex(response.requestCapex);
        this.CheckRequestOpex(response.requestOpex);
        this.SetGetInitiative(response);
        this.GetSetDate(response.registeringDate, response.startingDate, response.finishingDate);

        this.initiativesForm.patchValue({
          registeringDate: this.dateRegisterDisplay,
          startingDate: this.dateStartDisplay,
          finishingDate: this.dateFinishDisplay
        });

        if (response.requestOpex === 'trueOpex') {
          this.impactService.GetImpactTotalCostOPEX(this.id).subscribe((result) => {
            if (result) {
              if (result !== 0) {
                this.initiativesForm.patchValue({ costEstOpex: result });
              }
            }
          });
        }

        if (sessionStorage.getItem('InitiativesActive') !== 'true') {
          if (response.benefitAmount) {
            this.impactService.GetImpactTotalRecurringOneTime(this.id).subscribe((result) => {
              if (result) {
                if (result !== 0) {
                  this.initiativesForm.patchValue({ benefitAmount: result.toFixed(3) });
                  this.CalculatePayBackPeriod();
                }
              }
            });
          }
        }

        this.CheckOwner(response.ownerName, response.createdBy);

        if (this.stage === 'IL5') {
          this.initiativesForm.disable();
        }

      }, error => this.response.error(error));
    }
  }

  ActiveSuggestion(response) {
    if (response.cim) {
      this.initiativesForm.controls.cim.enable();
      this.initiativesForm.patchValue({ cim: true });
      this.IsCim = true;
      this.SendCim.emit(this.IsCim);
    }
    if (response.pim) {
      this.initiativesForm.controls.pim.enable();
      this.initiativesForm.patchValue({ pim: true });
      this.IsPim = true;
    }
    if (response.dim) {
      this.initiativesForm.controls.dim.enable();
      this.initiativesForm.patchValue({ dim: true });
      this.IsDim = true;
    }
    if (response.max) {
      this.initiativesForm.controls.max.enable();
      this.initiativesForm.patchValue({ max: true });
      this.IsMax = true;
      this.SendMax.emit(this.IsMax);
    }
    if (response.cpi) {
      this.initiativesForm.controls.cpi.enable();
      this.initiativesForm.patchValue({ cpi: true });
      this.IsCpi = true;
    }
    if (response.randD) {
      this.initiativesForm.controls.randD.enable();
      this.initiativesForm.patchValue({ randD: true });
      this.IsRandD = true;
    }
    if (response.other) {
      this.initiativesForm.controls.other.enable();
      this.initiativesForm.patchValue({ other: true });
      this.IsOther = true;
    }
    if (response.strategy) {
      this.initiativesForm.controls.strategy.enable();
      this.initiativesForm.patchValue({ strategy: true });
      this.IsStrategy = true;
      this.SendCim.emit(this.IsStrategy);
    }
    if (response.directCapex) {
      this.initiativesForm.controls.directCapex.enable();
      this.initiativesForm.patchValue({ directCapex: true });
      this.IsCapex = true;
      this.SendCapex.emit(this.IsCapex);
    }
  }

  CheckTypeBenefit(typeBenefit) {
    switch (typeBenefit) {
      case 'EBIT':
      case 'EBITDA':
        this.ShowForm(['typeBenefit', 'benefitAmount', 'payBackPeriod']);
        this.EnableForm(['benefitAmount', 'payBackPeriod']);
        break;
      case 'NON-FINANCIAL':
        this.ShowForm(['typeBenefit']);
        break;
    }
  }

  HideModal(): void {
    this.InvestmentModal.hide();
  }

  ConfirmInvestment(confirmText): void {
    this.initiativesForm.patchValue({ typeOfInvestment: confirmText });
    this.PatchForm();
    this.SetShowForm();
    this.SetValidateForm();
    this.SetMarkAsUntouchedForm();
    this.SetEnableFrom();
    switch (this.initiativesForm.controls.typeOfInvestment.value) {
      case 'Maintain Reliability':
        this.replace = 'not-in-kind';
        this.obsolate = 'no';
        this.confirmText = 'Maintain Reliability';
        this.InvestmentModal.show();
        this.HideForm(['ram', 'jFactor', 'budgetType', 'wacc']);
        this.DisableForm(['ram', 'jFactor', 'budgetType']);
        this.ShowForm(['irr', 'investment', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.ValidateForm(['irr', 'costEstCapex', 'typeBenefit']);
        break;
      case 'Replacement':
        this.replace = 'in-kind';
        this.obsolate = 'yes';
        this.confirmText = 'Replacement';
        this.InvestmentModal.show();
        this.HideForm(['ram', 'jFactor', 'irr', 'wacc']);
        this.ShowForm(['budgetType', 'investment', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.DisableForm(['ram', 'jFactor', 'irr']);
        this.ValidateForm(['costEstCapex', 'irr', 'budgetType', 'typeBenefit']);
        break;
    }
    this.InvestmentModal.hide();
  }

  GetUser() {
    this.authService.getUser().subscribe((response) => {
      this.username = response.username;
      this.params.text = this.username;
      this.initiativeService.GetOwnersEmail(this.params).subscribe(owners => {
        this.owners = owners;
        const owner = this.owners.filter(obj => {
          return obj.email.toLowerCase().trim() === this.username.toLowerCase().trim();
        });
        this.GetCoDevelopers();
        if (!this.id) {
          this.initiativesForm.patchValue({ ownerName: owner[0].ownerName });
        }
      });
    }, error => this.unauthorized.error(error));
  }

  GetCoDevelopers(Text?) {
    this.params.text = Text ? Text : '';
    this.initiativeService.GetCoDevelopers(this.params).subscribe(coDevelopers => {
      this.coDevelopers = coDevelopers;
      this.initiativeService.GetUser(this.username).subscribe(user => {
        if (user.ownerName === this.initiativesForm.controls.ownerName.value) {
          this.coDevelopers = this.coDevelopers.filter(obj => {
            return obj.email.toLowerCase().trim() !== this.username.toLowerCase().trim();
          });
        }
      });
    }, error => this.response.error(error));
  }

  GetOwners(Text?) {
    this.params.text = Text ? Text : '';
    this.initiativeService.GetOwners(this.params).subscribe(owners => {
      this.owners = owners;
    });
  }

  GetYears() {
    const year = new Date().getFullYear();
    for (let i = 1; i <= 5; i++) {
      this.years.push(year - i);
    }
    this.years.unshift(year + 1, year);
  }

  SetRegisterDate() {
    const dateNow = new Date();
    const date = this.dateUtil.GetDate(dateNow);
    this.initiativesForm.patchValue({ registeringDate: date });
  }

  GetPlants() {
    this.initiativeService.GetPlants().subscribe(plants => this.plants = plants);
    this.plants.push({ id: 9999, plantId: 'P9999', plantTitle: 'Others (please specify)' });
  }

  GetOrganizations() {
    this.initiativeService.GetOrganizations().subscribe(organizations => this.organizations = organizations);
  }

  GetCompany() {
    this.initiativeService.GetCompany().subscribe(companyName => this.companyName = companyName);
  }

  GetTypeOfInvestments() {
    this.initiativeService.GetTypeOfInvestments().subscribe(typeOfInvestments => {
      this.typeOfInvestments = typeOfInvestments;
      this.typeOfInvestments.push({ id: 9999, typeOfInvestmentId: 'Others', typeOfInvestmentTitle: 'Others' });
    });
  }

  DisabledButtonSave() {
    setTimeout(() => {
      this.isDisabledSubmit = false;
      this.isDisabledDraft = false;
    }, 1700);
  }

  EnabledButtonSave() {
    this.isDisabledSubmit = true;
    this.isDisabledDraft = true;
  }

  StartDateChange(value: Date): void {
    this.dateStart = this.dateUtil.SetDate(new Date(value));
    this.bsConfigFinish.minDate = new Date(value);
    this.initiativesForm.patchValue({ finishingDate: null });
  }

  FinishChange(value: Date): void {
    const time = new Date(value).getTime();
    if (time > 0) {
      this.dateFinish = this.dateUtil.SetDate(new Date(value));
      if (this.dateStart < this.dateFinish) {
        this.dateFinish = this.dateUtil.SetDate(new Date(value));
      } else {
        if (!(this.isDisabledSubmit || this.isDisabledDraft)) {
          this.dateFinish = null;
          this.swalTool.DateValid();
          this.initiativesForm.patchValue({ finishingDate: null });
        }
      }
    }
  }

  OnShowFinish() {
    this.initiativesForm.controls.finishingDate.clearValidators();
    this.initiativesForm.controls.finishingDate.updateValueAndValidity();
  }

  OnHiddenFinish() {
    if (!this.initiativesForm.controls.finishingDate.value) {
      this.initiativesForm.controls.finishingDate.setValidators([Validators.required]);
      this.initiativesForm.controls.finishingDate.updateValueAndValidity();
    }
  }

  SetMarkAsTouchedFormGeneral() {
    this.initiativesForm.controls.name.markAsTouched();
    this.initiativesForm.controls.year.markAsTouched();
    this.initiativesForm.controls.ownerName.markAsTouched();
    this.initiativesForm.controls.organization.markAsTouched();
    this.initiativesForm.controls.finishingDate.markAsTouched();
    this.initiativesForm.controls.plant.markAsTouched();
    this.initiativesForm.controls.background.markAsTouched();
    this.initiativesForm.controls.resultObjective.markAsTouched();
    this.initiativesForm.controls.scopeOfWork.markAsTouched();
    this.initiativesForm.controls.typeOfInvestment.markAsTouched();
    this.initiativesForm.controls.costEstCapex.markAsTouched();
    this.initiativesForm.controls.costEstOpex.markAsTouched();
    this.initiativesForm.controls.jFactor.markAsTouched();
    this.initiativesForm.controls.ram.markAsTouched();
    this.initiativesForm.controls.irr.markAsTouched();
    this.initiativesForm.controls.budgetType.markAsTouched();
    this.initiativesForm.controls.benefitAmount.markAsTouched();
    this.initiativesForm.controls.payBackPeriod.markAsTouched();
    this.initiativesForm.controls.typeBenefit.markAsTouched();
    this.initiativesForm.controls.fxExchange.markAsTouched();
    this.initiativesForm.controls.company.markAsTouched();
  }

  ClearValidateFormGeneral() {
    this.initiativesForm.controls.name.clearValidators();
    this.initiativesForm.controls.name.updateValueAndValidity();
    this.initiativesForm.controls.year.clearValidators();
    this.initiativesForm.controls.year.updateValueAndValidity();
    this.initiativesForm.controls.ownerName.clearValidators();
    this.initiativesForm.controls.ownerName.updateValueAndValidity();
    this.initiativesForm.controls.organization.clearValidators();
    this.initiativesForm.controls.organization.updateValueAndValidity();
    this.initiativesForm.controls.finishingDate.clearValidators();
    this.initiativesForm.controls.finishingDate.updateValueAndValidity();
    this.initiativesForm.controls.plant.clearValidators();
    this.initiativesForm.controls.plant.updateValueAndValidity();
    this.initiativesForm.controls.background.clearValidators();
    this.initiativesForm.controls.background.updateValueAndValidity();
    this.initiativesForm.controls.resultObjective.clearValidators();
    this.initiativesForm.controls.resultObjective.updateValueAndValidity();
    this.initiativesForm.controls.scopeOfWork.clearValidators();
    this.initiativesForm.controls.scopeOfWork.updateValueAndValidity();
    this.initiativesForm.controls.company.clearValidators();
    this.initiativesForm.controls.company.updateValueAndValidity();
  }

  SetValidateFormGeneral() {
    this.initiativesForm.controls.name.setValidators([Validators.required]);
    this.initiativesForm.controls.name.updateValueAndValidity();
    this.initiativesForm.controls.year.setValidators([Validators.required]);
    this.initiativesForm.controls.year.updateValueAndValidity();
    this.initiativesForm.controls.ownerName.setValidators([Validators.required]);
    this.initiativesForm.controls.ownerName.updateValueAndValidity();
    this.initiativesForm.controls.organization.setValidators([Validators.required]);
    this.initiativesForm.controls.organization.updateValueAndValidity();
    this.initiativesForm.controls.finishingDate.setValidators([Validators.required]);
    this.initiativesForm.controls.finishingDate.updateValueAndValidity();
    this.initiativesForm.controls.plant.setValidators([Validators.required]);
    this.initiativesForm.controls.plant.updateValueAndValidity();
    this.initiativesForm.controls.background.setValidators([Validators.required]);
    this.initiativesForm.controls.background.updateValueAndValidity();
    this.initiativesForm.controls.resultObjective.setValidators([Validators.required]);
    this.initiativesForm.controls.resultObjective.updateValueAndValidity();
    this.initiativesForm.controls.scopeOfWork.setValidators([Validators.required]);
    this.initiativesForm.controls.scopeOfWork.updateValueAndValidity();
    this.initiativesForm.controls.company.setValidators([Validators.required]);
    this.initiativesForm.controls.company.updateValueAndValidity();
  }

  ShowForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) { this.showTypeOfInvestment = true; }
    if (FormControl.indexOf('budgetType') !== -1) { this.showBudget = true; }
    if (FormControl.indexOf('ram') !== -1) { this.showRam = true; }
    if (FormControl.indexOf('jFactor') !== -1) { this.showJFactor = true; }
    if (FormControl.indexOf('irr') !== -1) { this.showIrr = true; }
    if (FormControl.indexOf('costEstCapex') !== -1) { this.showCostEstCapex = true; }
    if (FormControl.indexOf('costEstOpex') !== -1) { this.showCostEstOpex = true; }
    if (FormControl.indexOf('costEstCapexType') !== -1) { this.showCostEstCapexType = true; }
    if (FormControl.indexOf('costEstOpexType') !== -1) { this.showCostEstOpexType = true; }
    if (FormControl.indexOf('budgetSource') !== -1) { this.showBudgetSource = true; }
    if (FormControl.indexOf('typeBenefit') !== -1) { this.showTypeBenefit = true; }
    if (FormControl.indexOf('wacc') !== -1) { this.showWacc = true; }
    if (FormControl.indexOf('benefitAmount') !== -1) { this.showBenefitAmount = true; }
    if (FormControl.indexOf('payBackPeriod') !== -1) { this.showPayBackPeriod = true; }
    if (FormControl.indexOf('fxExchange') !== -1) { this.showFxExchange = true; }
    if (FormControl.indexOf('divestment') !== -1) { this.showDivestment = true; }
  }

  HideForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) { this.showTypeOfInvestment = false; }
    if (FormControl.indexOf('budgetType') !== -1) { this.showBudget = false; }
    if (FormControl.indexOf('ram') !== -1) { this.showRam = false; }
    if (FormControl.indexOf('jFactor') !== -1) { this.showJFactor = false; }
    if (FormControl.indexOf('irr') !== -1) { this.showIrr = false; }
    if (FormControl.indexOf('costEstCapex') !== -1) { this.showCostEstCapex = false; }
    if (FormControl.indexOf('costEstOpex') !== -1) { this.showCostEstOpex = false; }
    if (FormControl.indexOf('costEstCapexType') !== -1) { this.showCostEstCapexType = false; }
    if (FormControl.indexOf('costEstOpexType') !== -1) { this.showCostEstOpexType = false; }
    if (FormControl.indexOf('budgetSource') !== -1) { this.showBudgetSource = false; }
    if (FormControl.indexOf('typeBenefit') !== -1) { this.showTypeBenefit = false; }
    if (FormControl.indexOf('wacc') !== -1) { this.showWacc = false; }
    if (FormControl.indexOf('benefitAmount') !== -1) { this.showBenefitAmount = false; }
    if (FormControl.indexOf('payBackPeriod') !== -1) { this.showPayBackPeriod = false; }
    if (FormControl.indexOf('fxExchange') !== -1) { this.showFxExchange = false; }
    if (FormControl.indexOf('divestment') !== -1) { this.showDivestment = false; }

  }

  EnableForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) { this.initiativesForm.controls.typeOfInvestment.enable(); }
    if (FormControl.indexOf('budgetType') !== -1) { this.initiativesForm.controls.budgetType.enable(); }
    if (FormControl.indexOf('ram') !== -1) { this.initiativesForm.controls.ram.enable(); }
    if (FormControl.indexOf('jFactor') !== -1) { this.initiativesForm.controls.jFactor.enable(); }
    if (FormControl.indexOf('irr') !== -1) { this.initiativesForm.controls.irr.enable(); }
    if (FormControl.indexOf('fxExchange') !== -1) { this.initiativesForm.controls.fxExchange.enable(); }
    if (FormControl.indexOf('costEstCapex') !== -1) { this.initiativesForm.controls.costEstCapex.enable(); }
    if (FormControl.indexOf('costEstOpex') !== -1) { this.initiativesForm.controls.costEstOpex.enable(); }
    if (FormControl.indexOf('costEstCapexType') !== -1) { this.initiativesForm.controls.costEstCapexType.enable(); }
    if (FormControl.indexOf('costEstOpexType') !== -1) { this.initiativesForm.controls.costEstOpexType.enable(); }
    if (FormControl.indexOf('budgetSource') !== -1) { this.initiativesForm.controls.budgetSource.enable(); }
    if (FormControl.indexOf('typeBenefit') !== -1) { this.initiativesForm.controls.typeBenefit.enable(); }
    if (FormControl.indexOf('wacc') !== -1) { this.initiativesForm.controls.wacc.enable(); }
    if (FormControl.indexOf('benefitAmount') !== -1) { this.initiativesForm.controls.benefitAmount.enable(); }
    if (FormControl.indexOf('payBackPeriod') !== -1) { this.initiativesForm.controls.payBackPeriod.enable(); }
    if (FormControl.indexOf('divestment') !== -1) { this.initiativesForm.controls.divestment.enable(); }
  }

  DisableForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) { this.initiativesForm.controls.typeOfInvestment.disable(); }
    if (FormControl.indexOf('budgetType') !== -1) { this.initiativesForm.controls.budgetType.disable(); }
    if (FormControl.indexOf('ram') !== -1) { this.initiativesForm.controls.ram.disable(); }
    if (FormControl.indexOf('jFactor') !== -1) { this.initiativesForm.controls.jFactor.disable(); }
    if (FormControl.indexOf('irr') !== -1) { this.initiativesForm.controls.irr.disable(); }
    if (FormControl.indexOf('fxExchange') !== -1) { this.initiativesForm.controls.fxExchange.disable(); }
    if (FormControl.indexOf('costEstCapex') !== -1) { this.initiativesForm.controls.costEstCapex.disable(); }
    if (FormControl.indexOf('costEstOpex') !== -1) { this.initiativesForm.controls.costEstOpex.disable(); }
    if (FormControl.indexOf('costEstCapexType') !== -1) { this.initiativesForm.controls.costEstCapexType.disable(); }
    if (FormControl.indexOf('costEstOpexType') !== -1) { this.initiativesForm.controls.costEstOpexType.disable(); }
    if (FormControl.indexOf('budgetSource') !== -1) { this.initiativesForm.controls.budgetSource.disable(); }
    if (FormControl.indexOf('typeBenefit') !== -1) { this.initiativesForm.controls.typeBenefit.disable(); }
    if (FormControl.indexOf('wacc') !== -1) { this.initiativesForm.controls.wacc.disable(); }
    if (FormControl.indexOf('benefitAmount') !== -1) { this.initiativesForm.controls.benefitAmount.disable(); }
    if (FormControl.indexOf('payBackPeriod') !== -1) { this.initiativesForm.controls.payBackPeriod.disable(); }
    if (FormControl.indexOf('divestment') !== -1) { this.initiativesForm.controls.divestment.disable(); }

  }

  ValidateForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) {
      this.initiativesForm.controls.typeOfInvestment.setValidators([Validators.required]);
      this.initiativesForm.controls.typeOfInvestment.updateValueAndValidity();
    }
    if (FormControl.indexOf('budgetType') !== -1) {
      this.initiativesForm.controls.budgetType.setValidators([Validators.required]);
      this.initiativesForm.controls.budgetType.updateValueAndValidity();
    }
    if (FormControl.indexOf('ram') !== -1) {
      this.initiativesForm.controls.ram.setValidators([Validators.required]);
      this.initiativesForm.controls.ram.updateValueAndValidity();
    }
    if (FormControl.indexOf('jFactor') !== -1) {
      this.initiativesForm.controls.jFactor.setValidators([Validators.required]);
      this.initiativesForm.controls.jFactor.updateValueAndValidity();
    }
    if (FormControl.indexOf('irr') !== -1) {
      this.initiativesForm.controls.irr.setValidators([Validators.required]);
      this.initiativesForm.controls.irr.updateValueAndValidity();
    }
    if (FormControl.indexOf('fxExchange') !== -1) {
      this.initiativesForm.controls.fxExchange.setValidators([Validators.required]);
      this.initiativesForm.controls.fxExchange.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstCapex') !== -1) {
      this.initiativesForm.controls.costEstCapex.setValidators([Validators.required]);
      this.initiativesForm.controls.costEstCapex.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstCapexType') !== -1) {
      this.initiativesForm.controls.costEstCapexType.setValidators([Validators.required]);
      this.initiativesForm.controls.costEstCapexType.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstOpex') !== -1) {
      this.initiativesForm.controls.costEstOpex.setValidators([Validators.required]);
      this.initiativesForm.controls.costEstOpex.updateValueAndValidity();
    }
    if (FormControl.indexOf('typeBenefit') !== -1) {
      this.initiativesForm.controls.typeBenefit.setValidators([Validators.required]);
      this.initiativesForm.controls.typeBenefit.updateValueAndValidity();
    }
    if (FormControl.indexOf('wacc') !== -1) {
      this.initiativesForm.controls.wacc.setValidators([Validators.required]);
      this.initiativesForm.controls.wacc.updateValueAndValidity();
    }
    if (FormControl.indexOf('benefitAmount') !== -1) {
      this.initiativesForm.controls.benefitAmount.setValidators([Validators.required]);
      this.initiativesForm.controls.benefitAmount.updateValueAndValidity();
    }
    if (FormControl.indexOf('payBackPeriod') !== -1) {
      this.initiativesForm.controls.payBackPeriod.setValidators([Validators.required]);
      this.initiativesForm.controls.payBackPeriod.updateValueAndValidity();
    }
  }

  ClearInitiativeForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) { this.initiativesForm.patchValue({ typeOfInvestment: null }); }
    if (FormControl.indexOf('budgetType') !== -1) { this.initiativesForm.patchValue({ budgetType: null }); }
    if (FormControl.indexOf('ram') !== -1) { this.initiativesForm.patchValue({ ram: null }); }
    if (FormControl.indexOf('jFactor') !== -1) { this.initiativesForm.patchValue({ jFactor: null }); }
    if (FormControl.indexOf('irr') !== -1) { this.initiativesForm.patchValue({ irr: null }); }
    if (FormControl.indexOf('fxExchange') !== -1) { this.initiativesForm.patchValue({ fxExchange: null }); }
    if (FormControl.indexOf('costEstCapex') !== -1) { this.initiativesForm.patchValue({ costEstCapex: null }); }
    if (FormControl.indexOf('costEstOpex') !== -1) { this.initiativesForm.patchValue({ costEstOpex: null }); }
    if (FormControl.indexOf('costEstCapexType') !== -1) { this.initiativesForm.patchValue({ costEstCapexType: null }); }
    if (FormControl.indexOf('costEstOpexType') !== -1) { this.initiativesForm.patchValue({ costEstOpexType: null }); }
    if (FormControl.indexOf('budgetSource') !== -1) { this.initiativesForm.patchValue({ budgetSource: null }); }
    if (FormControl.indexOf('typeBenefit') !== -1) { this.initiativesForm.patchValue({ typeBenefit: null }); }
    if (FormControl.indexOf('wacc') !== -1) { this.initiativesForm.patchValue({ wacc: null }); }
    if (FormControl.indexOf('benefitAmount') !== -1) { this.initiativesForm.patchValue({ benefitAmount: null }); }
    if (FormControl.indexOf('payBackPeriod') !== -1) { this.initiativesForm.patchValue({ payBackPeriod: null }); }
    if (FormControl.indexOf('divestment') !== -1) { this.initiativesForm.patchValue({ divestment: false }); }

  }

  ClearValidateForm(FormControl) {
    if (FormControl.indexOf('investment') !== -1) {
      this.initiativesForm.controls.typeOfInvestment.clearValidators();
      this.initiativesForm.controls.typeOfInvestment.updateValueAndValidity();
    }
    if (FormControl.indexOf('budgetType') !== -1) {
      this.initiativesForm.controls.budgetType.clearValidators();
      this.initiativesForm.controls.budgetType.updateValueAndValidity();
    }
    if (FormControl.indexOf('ram') !== -1) {
      this.initiativesForm.controls.ram.clearValidators();
      this.initiativesForm.controls.ram.updateValueAndValidity();
    }
    if (FormControl.indexOf('jFactor') !== -1) {
      this.initiativesForm.controls.jFactor.clearValidators();
      this.initiativesForm.controls.jFactor.updateValueAndValidity();
    }
    if (FormControl.indexOf('irr') !== -1) {
      this.initiativesForm.controls.irr.clearValidators();
      this.initiativesForm.controls.irr.updateValueAndValidity();
    }
    if (FormControl.indexOf('fxExchange') !== -1) {
      this.initiativesForm.controls.fxExchange.clearValidators();
      this.initiativesForm.controls.fxExchange.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstCapex') !== -1) {
      this.initiativesForm.controls.costEstCapex.clearValidators();
      this.initiativesForm.controls.costEstCapex.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstCapexType') !== -1) {
      this.initiativesForm.controls.costEstCapexType.clearValidators();
      this.initiativesForm.controls.costEstCapexType.updateValueAndValidity();
    }
    if (FormControl.indexOf('costEstOpex') !== -1) {
      this.initiativesForm.controls.costEstOpex.clearValidators();
      this.initiativesForm.controls.costEstOpex.updateValueAndValidity();
    }
    if (FormControl.indexOf('typeBenefit') !== -1) {
      this.initiativesForm.controls.typeBenefit.clearValidators();
      this.initiativesForm.controls.typeBenefit.updateValueAndValidity();
    }
    if (FormControl.indexOf('wacc') !== -1) {
      this.initiativesForm.controls.wacc.clearValidators();
      this.initiativesForm.controls.wacc.updateValueAndValidity();
    }
    if (FormControl.indexOf('benefitAmount') !== -1) {
      this.initiativesForm.controls.benefitAmount.clearValidators();
      this.initiativesForm.controls.benefitAmount.updateValueAndValidity();
    }
    if (FormControl.indexOf('payBackPeriod') !== -1) {
      this.initiativesForm.controls.payBackPeriod.clearValidators();
      this.initiativesForm.controls.payBackPeriod.updateValueAndValidity();
    }
  }

  EnableSuggest(FormControl) {
    if (FormControl.indexOf('cim') !== -1) { this.initiativesForm.controls.cim.enable(); }
    if (FormControl.indexOf('pim') !== -1) { this.initiativesForm.controls.pim.enable(); }
    if (FormControl.indexOf('dim') !== -1) { this.initiativesForm.controls.dim.enable(); }
    if (FormControl.indexOf('max') !== -1) { this.initiativesForm.controls.max.enable(); }
    if (FormControl.indexOf('cpi') !== -1) { this.initiativesForm.controls.cpi.enable(); }
    if (FormControl.indexOf('randD') !== -1) { this.initiativesForm.controls.randD.enable(); }
    if (FormControl.indexOf('other') !== -1) { this.initiativesForm.controls.other.enable(); }
    if (FormControl.indexOf('strategy') !== -1) { this.initiativesForm.controls.strategy.enable(); }
    if (FormControl.indexOf('directCapex') !== -1) { this.initiativesForm.controls.directCapex.enable(); }
  }

  DisableSuggest(FormControl) {
    if (FormControl.indexOf('cim') !== -1) { this.initiativesForm.controls.cim.disable(); }
    if (FormControl.indexOf('pim') !== -1) { this.initiativesForm.controls.pim.disable(); }
    if (FormControl.indexOf('dim') !== -1) { this.initiativesForm.controls.dim.disable(); }
    if (FormControl.indexOf('max') !== -1) { this.initiativesForm.controls.max.disable(); }
    if (FormControl.indexOf('cpi') !== -1) { this.initiativesForm.controls.cpi.disable(); }
    if (FormControl.indexOf('randD') !== -1) { this.initiativesForm.controls.randD.disable(); }
    if (FormControl.indexOf('other') !== -1) { this.initiativesForm.controls.other.disable(); }
    if (FormControl.indexOf('strategy') !== -1) { this.initiativesForm.controls.strategy.disable(); }
    if (FormControl.indexOf('directCapex') !== -1) { this.initiativesForm.controls.directCapex.disable(); }
  }

  SetShowForm() {
    this.ShowForm(['investment', 'budgetType', 'ram', 'jFactor', 'irr', 'fxExchange', 'costEstCapex',
      'costEstCapexType', 'typeBenefit']);
    this.HideForm(['wacc', 'benefitAmount', 'payBackPeriod']);
  }

  SetValidateForm() {
    this.ValidateForm(['investment']);
    this.ClearValidateForm(['costEstCapex', 'costEstOpex', 'jFactor', 'ram', 'irr', 'budgetType', 'typeBenefit', 'fxExchange']);
  }

  SetMarkAsUntouchedForm() {
    this.initiativesForm.controls.costEstCapex.markAsUntouched();
    this.initiativesForm.controls.costEstOpex.markAsUntouched();
    this.initiativesForm.controls.jFactor.markAsUntouched();
    this.initiativesForm.controls.ram.markAsUntouched();
    this.initiativesForm.controls.irr.markAsUntouched();
    this.initiativesForm.controls.budgetType.markAsUntouched();
    this.initiativesForm.controls.typeBenefit.markAsUntouched();
    this.initiativesForm.controls.fxExchange.markAsUntouched();
  }

  SetMarkAsTouchedForm() {
    this.initiativesForm.controls.typeOfInvestment.markAsTouched();
    this.initiativesForm.controls.costEstCapex.markAsTouched();
    this.initiativesForm.controls.costEstOpex.markAsTouched();
    this.initiativesForm.controls.jFactor.markAsTouched();
    this.initiativesForm.controls.ram.markAsTouched();
    this.initiativesForm.controls.irr.markAsTouched();
    this.initiativesForm.controls.budgetType.markAsTouched();
    this.initiativesForm.controls.benefitAmount.markAsTouched();
    this.initiativesForm.controls.payBackPeriod.markAsTouched();
    this.initiativesForm.controls.typeBenefit.markAsTouched();
    this.initiativesForm.controls.fxExchange.markAsTouched();
  }

  OnChangeTypeOfBenefit() {
    const requestCapex = this.initiativesForm.controls.requestCapex.value;
    const typeBenefit = this.initiativesForm.controls.typeBenefit.value;
    if (typeBenefit !== 'NON-FINANCIAL') {
      this.ValidateForm(['benefitAmount']);
      if (requestCapex === 'true') {
        this.ValidateForm(['payBackPeriod']);
      }
      this.ShowForm(['benefitAmount', 'payBackPeriod']);
      this.EnableForm(['benefitAmount', 'payBackPeriod']);
    } else {
      this.initiativesForm.patchValue({ benefitAmount: '', payBackPeriod: '' });
      this.ClearValidateForm(['benefitAmount', 'payBackPeriod']);
      this.HideForm(['benefitAmount', 'payBackPeriod']);
      this.DisableForm(['benefitAmount', 'payBackPeriod']);
    }
  }

  SetEnableFrom() {
    this.EnableForm([
      'investment', 'budgetType', 'ram', 'jFactor', 'irr', 'wacc', 'costEstCapex',
      'costEstCapexType', 'typeBenefit', 'benefitAmount', 'payBackPeriod', 'fxExchange', 'budgetSource'
    ]);
  }

  PatchForm() {
    this.initiativesForm.patchValue({
      costEstCapexType: 'THB',
      typeBenefit: '',
      payBackPeriod: '',
      benefitAmount: '',
      irr: '',
      budgetType: '',
      ram: '',
      jFactor: ''
    });
  }

  PatchFormType() {
    this.initiativesForm.patchValue({
      typeBenefit: '',
      payBackPeriod: '',
      benefitAmount: '',
      irr: '',
      budgetType: '',
      ram: '',
      jFactor: ''
    });
  }

  OnChangeTypeOfInvestment() {
    this.PatchFormType();
    this.SetShowForm();
    this.SetValidateForm();
    this.SetMarkAsUntouchedForm();
    this.SetEnableFrom();
    this.CheckModalTypeOfInvestment();
    this.CheckTypeOfInvestment(this.initiativesForm.controls.typeOfInvestment.value);
    this.OnChangeCostEstimated();
  }

  CheckModalTypeOfInvestment() {
    switch (this.initiativesForm.controls.typeOfInvestment.value) {
      case 'Maintain Reliability':
        this.InvestmentModal.show();
        break;
      case 'Replacement':
        this.InvestmentModal.show();
        break;
    }
  }

  CheckTypeOfInvestment(typeOfInvestment) {
    switch (typeOfInvestment) {
      case 'Maintain Reliability':
        this.replace = 'not-in-kind';
        this.obsolate = 'no';
        this.confirmText = 'Maintain Reliability';
        this.HideForm(['ram', 'jFactor', 'budgetType', 'wacc']);
        this.DisableForm(['ram', 'jFactor', 'budgetType']);
        this.ShowForm(['investment', 'irr', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'irr', 'typeBenefit']);
        break;
      case 'Replacement':
        this.replace = 'in-kind';
        this.obsolate = 'yes';
        this.confirmText = 'Replacement';
        this.HideForm(['ram', 'jFactor', 'irr', 'wacc']);
        this.DisableForm(['ram', 'jFactor', 'irr']);
        this.ShowForm(['investment', 'budgetType', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'irr', 'budgetType', 'typeBenefit']);
        break;
      case 'CSR':
      case 'Digital CAPEX':
      case 'IT CAPEX':
      case 'Turnaround':
      case 'Others':
      case 'Overhaul':
      case 'R&D':
      case 'Lab & Quality':
      case 'Technical Support for R&D':
      case 'Welfare':
        this.HideForm(['ram', 'jFactor', 'irr', 'budgetType', 'wacc', 'benefitAmount', 'payBackPeriod']);
        this.DisableForm(['ram', 'jFactor', 'irr', 'budgetType', 'wacc', 'benefitAmount', 'payBackPeriod']);
        this.ShowForm(['investment', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'typeBenefit']);
        break;
      case 'Engineering Request ER':
        this.HideForm(['ram', 'jFactor', 'irr', 'wacc']);
        this.DisableForm(['ram', 'jFactor', 'irr']);
        this.ShowForm(['investment', 'budgetType', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'budgetType', 'typeBenefit']);
        break;
      case 'CVC':
        this.HideForm(['ram', 'jFactor', 'irr', 'budgetType', 'wacc', 'typeBenefit', 'payBackPeriod']);
        this.DisableForm(['ram', 'jFactor', 'irr', 'budgetType', 'typeBenefit', 'benefitAmount', 'payBackPeriod']);
        this.ValidateForm(['fxExchange', 'costEstCapex', 'costEstOpex']);
        this.initiativesForm.patchValue({ costEstCapexType: 'USD' });
        break;
      case 'Divest':
      case 'M&A':
        this.HideForm(['ram', 'jFactor', 'irr', 'budgetType', 'wacc', 'typeBenefit']);
        this.DisableForm(['ram', 'jFactor', 'irr', 'budgetType', 'typeBenefit', 'benefitAmount', 'payBackPeriod']);
        this.ShowForm(['investment', 'costEstCapex', 'costEstCapexType', 'fxExchange']);
        this.ValidateForm(['fxExchange', 'costEstCapex', 'costEstOpex']);
        break;
      case 'Growth: Backbone':
      case 'Growth: New business':
      case 'Growth: Build International Competitive base':
      case 'Growth: Diversify to performance chemicals':
      case 'Growth: Enhance green':
      case 'Sustain Core: Synergy':
      case 'Sustain Core: Operational Excellence':
      case 'Sustain Core: Marketing Excellence':
      case 'Sustain Core: Debot/Expansion':
      case 'Sustain Core: Chain Integration':
      case 'Sustain Core: New derivative':
      case 'Sustain Core: Map ta put retrofit':
        this.HideForm(['ram', 'jFactor', 'budgetType', 'wacc']);
        this.DisableForm(['budgetType', 'ram', 'jFactor']);
        this.ShowForm(['investment', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'irr', 'fxExchange']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'irr', 'typeBenefit']);
        break;
      case 'Sustain Core: Energy saving':
        this.HideForm(['ram', 'jFactor', 'budgetType']);
        this.DisableForm(['budgetType', 'ram', 'jFactor']);
        this.ShowForm(['investment', 'wacc', 'costEstCapex', 'costEstCapexType', 'typeBenefit', 'fxExchange']);
        this.EnableForm(['wacc']);
        this.ValidateForm(['costEstCapex', 'costEstOpex', 'irr', 'typeBenefit']);
        break;
      case 'Safety':
      case 'Environment':
      case 'Law & Regulation':
        this.HideForm(['irr', 'typeBenefit', 'budgetType', 'wacc']);
        this.DisableForm(['budgetType', 'irr', 'typeBenefit', 'benefitAmount', 'payBackPeriod']);
        this.ShowForm(['investment', 'ram', 'jFactor', 'costEstCapex', 'costEstCapexType', 'fxExchange']);
        this.ValidateForm(['jFactor', 'ram', 'costEstCapex', 'costEstOpex', 'typeBenefit']);
        break;
    }
  }

  CalculateUSD() {
    const costEstCapex = this.initiativesForm.controls.costEstCapex.value;
    const fx = this.initiativesForm.controls.fxExchange.value;
    switch (this.initiativesForm.controls.costEstCapexType.value) {
      case 'USD':
        this.ValidateForm(['costEstCapex', 'fxExchange']);
        if (this.initiativesForm.controls.costEstCapexType.value === 'USD') {
          if (fx) {
            const result = costEstCapex * fx;
            this.costEstCapex = Math.round(result * 100) / 100;
            if (result > 300) {
              this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
              this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
            } else {
              this.ShowForm(['typeBenefit', 'irr']);
              this.EnableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
            }
          } else {
            this.costEstCapex = 0;
          }
          this.costEstCapexType = 'THB';
        }
        break;
    }
  }

  CalculatePayBackPeriod() {
    switch (this.initiativesForm.controls.costEstCapexType.value) {
      case 'USD':
        const fx = this.initiativesForm.controls.fxExchange.value;
        this.costEstCapex = this.initiativesForm.controls.costEstCapex.value * fx;
        break;
      case 'THB':
        this.costEstCapex = this.initiativesForm.controls.costEstCapex.value;
        break;
      default:
        this.costEstCapex = 0.00;
        break;
    }
    switch (this.initiativesForm.controls.costEstOpexType.value) {
      case 'USD':
        const fx = this.initiativesForm.controls.fxExchange.value;
        this.costEstOpex = this.initiativesForm.controls.costEstOpex.value * fx;
        break;
      case 'THB':
        this.costEstOpex = this.initiativesForm.controls.costEstOpex.value;
        break;
      default:
        this.costEstOpex = 0.00;
        break;
    }
    const benefitAmount = this.initiativesForm.controls.benefitAmount.value;
    const result = (parseFloat(this.costEstCapex) + parseFloat(this.costEstOpex)) / parseFloat(benefitAmount);
    this.initiativesForm.patchValue({ payBackPeriod: isFinite(result) ? result.toFixed(3) : null });
  }

  OnChangeCostEstimated() {
    switch (this.initiativesForm.controls.typeOfInvestment.value) {
      case 'Maintain Reliability':
      case 'Replacement':
      case 'Turnaround':
      case 'Lab & Quality':
      case 'Technical Support for R&D':
      case 'R&D':
      case 'Overhaul':
      case 'CSR':
      case 'Welfare':
      case 'Engineering Request ER':
      case 'Others':
        if (this.initiativesForm.controls.costEstCapex.value > 300) {
          this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'wacc']);
          this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod']);
          this.initiativesForm.patchValue({ typeBenefit: '' });
        } else {
          this.ShowForm(['typeBenefit']);
          this.EnableForm(['typeBenefit']);
        }
        break;
      case 'Growth: Backbone':
      case 'Growth: New business':
      case 'Growth: Build International Competitive base':
      case 'Growth: Diversify to performance chemicals':
      case 'Growth: Enhance green':
      case 'Sustain Core: Synergy':
      case 'Sustain Core: Operational Excellence':
      case 'Sustain Core: Marketing Excellence':
      case 'Sustain Core: Debot/Expansion':
      case 'Sustain Core: Chain Integration':
      case 'Sustain Core: New derivative':
      case 'Sustain Core: Map ta put retrofit':
        if (this.initiativesForm.controls.costEstCapex.value > 300) {
          this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
          this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
          this.initiativesForm.patchValue({ typeBenefit: '' });
        } else {
          this.ShowForm(['irr', 'typeBenefit']);
          this.EnableForm(['irr', 'typeBenefit']);
        }
        break;
      case 'Digital CAPEX':
      case 'IT CAPEX':
        if (this.initiativesForm.controls.costEstCapex.value > 300) {
          this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
          this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
          this.initiativesForm.patchValue({ typeBenefit: '' });
        } else {
          this.ShowForm(['typeBenefit']);
          this.EnableForm(['typeBenefit']);
        }
        break;
    }
    this.CalculateUSD();
    this.CalculatePayBackPeriod();
  }

  OnChangeCostOPEX() {
    this.CalculatePayBackPeriod();
  }

  OnChangeBenefitAmount() {
    this.CalculatePayBackPeriod();
  }

  OnchangeCostEstCapexType() {
    const costEstCapex = this.initiativesForm.controls.costEstCapex.value;
    const fx = this.initiativesForm.controls.fxExchange.value;
    switch (this.initiativesForm.controls.costEstCapexType.value) {
      case 'USD':
        this.ValidateForm(['costEstCapex', 'fxExchange']);
        if (this.initiativesForm.controls.costEstCapexType.value === 'USD') {
          if (fx) {
            const result = costEstCapex * fx;
            this.costEstCapex = Math.round(result * 100) / 100;
            if (result > 300) {
              this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
              this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
            }
          } else {
            this.costEstCapex = 0;
          }
          this.costEstCapexType = 'THB';
        }
        break;
      case 'THB':
        this.CalculatePayBackPeriod();
        this.SetValidateForm();
        this.ValidateForm(['costEstCapex']);
        break;
    }
  }

  OnchangeCostEstOpexType() {
    const costEstOpex = this.initiativesForm.controls.costEstOpex.value;
    const fx = this.initiativesForm.controls.fxExchange.value;
    switch (this.initiativesForm.controls.costEstOpexType.value) {
      case 'USD':
        this.ValidateForm(['costEstOpex', 'fxExchange']);
        if (this.initiativesForm.controls.costEstOpexType.value === 'USD') {
          if (fx) {
            const result = costEstOpex * fx;
            this.costEstOpex = Math.round(result * 100) / 100;
          } else {
            this.costEstOpex = 0;
          }
          this.costEstOpexType = 'THB';
        }
        break;
      case 'THB':
        this.CalculatePayBackPeriod();
        this.SetValidateForm();
        this.ValidateForm(['costEstOpex']);
        break;
    }
  }

  OnChangeFx() {
    const costEstCapex = this.initiativesForm.controls.costEstCapex.value;
    const fx = this.initiativesForm.controls.fxExchange.value;
    switch (this.initiativesForm.controls.costEstCapexType.value) {
      case 'USD':
        this.ValidateForm(['costEstCapex', 'fxExchange']);
        if (this.initiativesForm.controls.costEstCapexType.value === 'USD' &&
          this.initiativesForm.controls.typeOfInvestment.value !== 'CVC') {
          if (fx) {
            const result = costEstCapex * fx;
            this.costEstCapex = Math.round(result * 100) / 100;
            if (result > 300) {
              this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
              this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
            } else {
              this.ShowForm(['typeBenefit', 'irr']);
              this.EnableForm(['typeBenefit', 'irr']);
            }
          } else {
            this.costEstCapex = 0;
          }
          this.costEstCapexType = 'THB';
        }
        break;
      case 'THB':
        this.CalculatePayBackPeriod();
        this.SetValidateForm();
        this.ValidateForm(['costEstCapex', 'typeBenefit']);
        break;
    }
  }

  CheckCostEstCapexType(costEstCapexType) {
    const typeOfInvestment = this.initiativesForm.controls.typeOfInvestment.value;
    const costEstCapex = this.initiativesForm.controls.costEstCapex.value;
    const fx = this.initiativesForm.controls.fxExchange.value;
    if (typeOfInvestment === 'CVC') {
      if (costEstCapexType === 'THB') {
        if (fx) {
          const result = costEstCapex / fx;
          this.costEstCapex = Math.round(result * 100) / 100;
        } else {
          this.costEstCapex = 0;
        }
        this.costEstCapexType = 'USD';
      } else {
        this.costEstCapex = costEstCapex * fx;
        this.costEstCapex = Math.round(costEstCapex * 100) / 100;
      }
    } else {
      if (costEstCapexType === 'USD') {
        if (fx) {
          const result = costEstCapex * fx;
          this.costEstCapex = Math.round(result * 100) / 100;
          if (result > 300) {
            this.HideForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
            this.DisableForm(['typeBenefit', 'benefitAmount', 'payBackPeriod', 'irr']);
          }
        } else {
          this.costEstCapex = 0;
        }
        this.costEstCapexType = 'THB';
      }
    }
  }

  CheckCim(event) {
    this.IsCim = event.target.checked ? true : false;
  }

  CheckPim(event) {
    this.IsPim = event.target.checked ? true : false;
  }

  CheckDim(event) {
    this.IsDim = event.target.checked ? true : false;
  }

  CheckCapex(event) {
    this.IsCapex = event.target.checked ? true : false;
  }

  CheckMax(event) {
    this.IsMax = event.target.checked ? true : false;
  }

  CheckCpi(event) {
    if (event.target.checked) {
      this.DisableSuggest(['strategy', 'randD', 'other']);
      this.IsCpi = true;
      this.initiativesForm.patchValue({ cpi: true, initiativeType: this.IsMax ? 'cpi,max' : 'cpi' });
    } else {
      this.EnableSuggest(['strategy', 'randD', 'other']);
      this.IsCpi = false;
      this.initiativesForm.patchValue({ cpi: false, initiativeType: null });
    }
  }

  CheckStrategy(event) {
    if (event.target.checked) {
      this.DisableSuggest(['cpi', 'randD', 'other']);
      this.IsStrategy = true;
      this.initiativesForm.patchValue({ strategy: true, initiativeType: this.IsMax ? 'strategy,max' : 'strategy' });
    } else {
      this.EnableSuggest(['cpi', 'randD', 'other']);
      this.IsStrategy = false;
      this.initiativesForm.patchValue({ strategy: false, initiativeType: null });
    }
  }

  CheckRAndD(event) {
    if (event.target.checked) {
      this.DisableSuggest(['cpi', 'strategy', 'other']);
      this.IsRandD = true;
      this.initiativesForm.patchValue({ randD: true, initiativeType: this.IsMax ? 'randD,max' : 'randD' });
    } else {
      this.EnableSuggest(['cpi', 'strategy', 'other']);
      this.IsRandD = false;
      this.initiativesForm.patchValue({ randD: false, initiativeType: null });
    }
  }

  CheckOther(event) {
    if (event.target.checked) {
      this.DisableSuggest(['cpi', 'strategy', 'randD']);
      this.IsOther = true;
      this.initiativesForm.patchValue({ other: true, initiativeType: this.IsMax ? 'other,max' : 'other' });
    } else {
      this.EnableSuggest(['cpi', 'strategy', 'randD']);
      this.IsOther = false;
      this.initiativesForm.patchValue({ other: false, initiativeType: null });
    }
  }

  ClearSuggestion() {
    this.DisableSuggest(['pim', 'cim', 'max', 'directCapex', 'dim', 'cpi', 'strategy', 'randD', 'other']);
    this.IsPim = false;
    this.initiativesForm.patchValue({ pim: false });
    this.IsCim = false;
    this.initiativesForm.patchValue({ cim: false });
    this.IsMax = false;
    this.initiativesForm.patchValue({ max: false });
    this.IsCapex = false;
    this.initiativesForm.patchValue({ directCapex: false });
    this.IsDim = false;
    this.initiativesForm.patchValue({ dim: false });
    this.IsCpi = false;
    this.initiativesForm.patchValue({ cpi: false });
    this.IsStrategy = false;
    this.initiativesForm.patchValue({ strategy: false });
    this.IsRandD = false;
    this.initiativesForm.patchValue({ randD: false });
    this.IsOther = false;
    this.initiativesForm.patchValue({ other: false });
  }

  OnChangeRequestCAPEX(event) {
    event.target.value === 'true' ? this.YesRequestCAPEXFrom() : this.NoRequestCAPEXFrom();
  }

  OnChangeRequestOPEX(event) {
    event.target.value === 'trueOpex' ? this.YesRequestOPEXFrom() : this.NoRequestOPEXFrom();
  }

  YesRequestCAPEXFrom() {
    this.HideForm(['budgetType', 'ram', 'jFactor', 'irr', 'wacc', 'typeBenefit', 'benefitAmount', 'payBackPeriod', 'divestment']);
    this.ClearInitiativeForm(['budgetType', 'ram', 'jFactor', 'irr', 'wacc',
      'typeBenefit', 'benefitAmount', 'payBackPeriod', 'divestment']);
    this.ShowForm(['investment', 'costEstCapex', 'costEstCapexType', 'fxExchange', 'budgetSource']);
    this.SetEnableFrom();
    if (!this.StageIL5) { this.ClearSuggestion(); }
    this.ValidateForm(['payBackPeriod']);
    this.initiativesForm.patchValue({ costEstCapex: null });
    this.initiativesForm.patchValue({ costEstCapexType: 'THB' });
    this.initiativesForm.controls.payBackPeriod.markAsTouched();
  }

  NoRequestCAPEXFrom() {
    this.EnableForm(['typeBenefit']);
    this.PatchForm();
    this.HideForm(['investment', 'budgetType', 'ram', 'irr', 'jFactor',
      'costEstCapex', 'costEstCapexType', 'benefitAmount', 'payBackPeriod', 'fxExchange', 'budgetSource']);
    this.ClearInitiativeForm(['investment', 'budgetType', 'ram', 'irr', 'jFactor',
      'costEstCapex', 'benefitAmount', 'payBackPeriod', 'fxExchange', 'budgetSource']);
    this.ShowForm(['typeBenefit', 'divestment']);
    this.DisableForm(['investment', 'budgetType', 'ram', 'irr', 'jFactor',
      'costEstCapex', 'costEstCapexType', 'fxExchange', 'budgetSource']);
    if (!this.StageIL5) { this.ClearSuggestion(); }
    this.ClearValidateForm(['payBackPeriod']);
    this.initiativesForm.patchValue({ costEstCapex: 0 });
    this.CalculatePayBackPeriod();
    this.initiativesForm.controls.payBackPeriod.markAsUntouched();
  }

  YesRequestOPEXFrom() {
    this.ShowForm(['costEstOpex', 'costEstOpexType']);
    this.EnableForm(['costEstOpex', 'costEstOpexType']);
    this.initiativesForm.patchValue({ costEstOpex: null });
    this.initiativesForm.patchValue({ costEstOpexType: 'THB' });
  }

  NoRequestOPEXFrom() {
    this.HideForm(['costEstOpex', 'costEstOpexType']);
    this.ClearInitiativeForm(['costEstOpex']);
    this.initiativesForm.patchValue({ costEstOpex: 0 });
    // this.DisableForm(['costEstOpex', 'costEstOpexType']);
    this.CalculatePayBackPeriod();
  }

  DisableSuggestion() {
    this.DisableSuggest(['pim', 'cim', 'max', 'directCapex', 'dim']);
    this.EnableSuggest(['cpi', 'strategy', 'randD', 'other']);
  }

  NoRequestCAPEX() {
    if (this.requestCapex === 'false') {
      this.DisableSuggestion();
      if (this.divestment) {
        this.CIM_ACTIVE(true);
      } else {
        if (this.typeBenefit) {
          if (this.typeBenefit === 'NON-FINANCIAL') {
            this.initiativesForm.patchValue({ max: false });
            this.initiativesForm.controls.max.disable();
            this.IsMax = false;
          } else {
            this.initiativesForm.patchValue({ max: true });
            this.initiativesForm.controls.max.enable();
            this.IsMax = true;
          }
        } else {
          this.initiativesForm.patchValue({ max: false });
          this.initiativesForm.controls.max.disable();
          this.IsMax = false;
        }
      }
    }
    this.CalculatePayBackPeriod();
  }

  InitVariable() {
    this.requestCapex = this.initiativesForm.controls.requestCapex.value;
    this.typeOfInvestment = this.initiativesForm.controls.typeOfInvestment.value;
    this.budgetType = this.initiativesForm.controls.budgetType.value;
    this.ram = this.initiativesForm.controls.ram.value;
    this.jFactor = this.initiativesForm.controls.jFactor.value;
    this.irr = this.initiativesForm.controls.irr.value;
    this.costEstCapex = this.initiativesForm.controls.costEstCapex.value;
    this.costEstCapexType = this.initiativesForm.controls.costEstCapexType.value;
    this.typeBenefit = this.initiativesForm.controls.typeBenefit.value;
    this.benefitAmount = this.initiativesForm.controls.benefitAmount.value;
    this.benefitAmountType = this.initiativesForm.controls.benefitAmountType.value;
    this.payBackPeriod = this.initiativesForm.controls.payBackPeriod.value;
    this.fxExchange = this.initiativesForm.controls.fxExchange.value;
    this.involveItDigital = this.initiativesForm.controls.involveItDigital.value;
    this.budgetSource = this.initiativesForm.controls.budgetSource.value;
    this.divestment = this.initiativesForm.controls.divestment.value;
  }

  Condition() {
    this.condition = {
      requestCapex: this.requestCapex,
      typeOfInvestment: this.typeOfInvestment,
      budgetType: this.budgetType,
      ram: this.ram,
      jFactor: this.jFactor,
      irr: this.irr,
      costEstCapex: this.costEstCapex,
      costEstCapexType: this.costEstCapexType,
      typeBenefit: this.typeBenefit,
      benefitAmount: this.benefitAmount,
      benefitAmountType: this.benefitAmountType,
      payBackPeriod: this.payBackPeriod,
      fxExchange: this.fxExchange,
      involveItDigital: this.involveItDigital,
      budgetSource: this.budgetSource,
      divestment: this.divestment
    };
  }

  PIM_ACTIVE(pim) {
    if (pim) {
      this.IsPim = true;
      this.initiativesForm.controls.pim.enable();
      this.initiativesForm.patchValue({ pim: true, initiativeType: 'pim' });
    }
  }

  CIM_ACTIVE(cim) {
    if (cim) {
      this.IsCim = true;
      this.initiativesForm.controls.cim.enable();
      this.initiativesForm.patchValue({ cim: true, initiativeType: 'cim' });
    }
  }

  DIM_ACTIVE(dim) {
    if (dim) {
      this.IsDim = true;
      this.initiativesForm.controls.dim.enable();
      this.initiativesForm.patchValue({ dim: true, initiativeType: 'dim' });
    }
  }

  CAPEX_ACTIVE(directCapex) {
    if (directCapex) {
      this.IsCapex = true;
      this.initiativesForm.controls.directCapex.enable();
      this.initiativesForm.patchValue({ directCapex: true, initiativeType: 'directCapex' });
    }
  }

  MAX_PIM_ACTIVE(MaxPim) {
    if (MaxPim) {
      this.IsPim = true;
      this.initiativesForm.controls.pim.enable();
      this.initiativesForm.patchValue({ pim: true });

      this.IsMax = true;
      this.initiativesForm.controls.max.enable();
      this.initiativesForm.patchValue({ max: true });

      this.initiativesForm.patchValue({ initiativeType: 'pim,max' });
    }
  }

  MAX_CAPEX_ACTIVE(MaxCapex) {
    if (MaxCapex) {
      this.IsCapex = true;
      this.SendCapex.emit(this.IsCapex);
      this.initiativesForm.controls.directCapex.enable();
      this.initiativesForm.patchValue({ directCapex: true });

      this.IsMax = true;
      this.initiativesForm.controls.max.enable();
      this.initiativesForm.patchValue({ max: true });

      this.initiativesForm.patchValue({ initiativeType: 'directCapex,max' });
    }
  }

  MAX_DIM_ACTIVE(MaxDim) {
    if (MaxDim) {
      this.IsDim = true;
      this.initiativesForm.controls.dim.enable();
      this.initiativesForm.patchValue({ dim: true });

      this.IsMax = true;
      this.initiativesForm.controls.max.enable();
      this.initiativesForm.patchValue({ max: true });

      this.initiativesForm.patchValue({ initiativeType: 'dim,max' });
    }
  }

  LoadSuggest() {
    this.isLoadSuggest = true;
    this.isDisabledSubmit = true;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.isLoadSuggest = false;
      this.isDisabledSubmit = false;
    }, 1300);
  }

  Suggest() {
    this.ClearValidateFormGeneral();
    this.SetMarkAsTouchedForm();
    this.InitVariable();
    this.CheckCostEstCapexType(this.initiativesForm.controls.costEstCapexType.value);
    this.ClearSuggestion();
    if (this.initiativesForm.valid) {
      this.LoadSuggest();
      this.Condition();
      this.suggestion.PIM_RAM_FACTOR_RAM_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.PIM_RAM_FACTOR_JFactor_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.MAX_Maintain_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.MAX_Growth_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.MAX_SustainCore_EnergySaving_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.MAX_Sustaincore_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.PIM_Maintain_NoCase(this.condition).subscribe(result => result ? this.swalTool.NoCase() : null);
      this.suggestion.PIM_RAM_FACTOR(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Maintain(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Growth_Criteria(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Growth_Criteria_TypeBenefit(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Growth_Criteria_PayBackPeriod(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_Criteria(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_Criteria_TypeBenefit(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_Criteria_PayBackPeriod(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_EnergySaving_Criteria(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_EnergySaving_Criteria_TypeBenefit(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_SustainCore_EnergySaving_Criteria_PayBackPeriod(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Maintain_Criteria(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Maintain_Criteria_TypeBenefit(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.PIM_Maintain_Criteria_PayBackPeriod(this.condition).subscribe(result => this.PIM_ACTIVE(result));
      this.suggestion.CAPEX_Replacement(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Replacement_Cost(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Replacement_Criteria(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Replacement_Criteria_TypeBenefit(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Replacement_Criteria_PayBackPeriod(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_ER_Growth_SustainCore(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_ER_Maintain(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_ER_Environment(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_CostCapex(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Criteria_TypeBenefit(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Criteria_PayBackPeriod(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Criteria(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Pool_Engineering(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Pool_Cost_Engineering(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Engineering_Cost(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Engineering_Criteria(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Engineering_Criteria_TypeBenefit(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CAPEX_Engineering_Criteria_PayBackPeriod(this.condition).subscribe(result => this.CAPEX_ACTIVE(result));
      this.suggestion.CIM_Growth(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.CIM_SustainCore(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.CIM_SustainCore_EnergySaving(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.CIM_Divest_MnA(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.CIM_CVC(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.CIM_ItCapex_DigitalCapex(this.condition).subscribe(result => this.CIM_ACTIVE(result));
      this.suggestion.DIM_ItCapex_DigitalCapex_Criteria(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_ItCapex_DigitalCapex_Criteria_TypeBenefit(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_ItCapex_DigitalCapex_Criteria_PayBackPeriod(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_NON_FINANCIAL_Growth_SustainCore(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_Growth_SustainCore(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_Maintain(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_NON_Maintain(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_CostCapex(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_NON_CostCapex(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_Environment(this.condition).subscribe(result => this.DIM_ACTIVE(result));
      this.suggestion.DIM_MAX_Maintain(this.condition).subscribe(result => this.MAX_DIM_ACTIVE(result));
      this.suggestion.DIM_MAX_CostCapex(this.condition).subscribe(result => this.MAX_DIM_ACTIVE(result));
      this.suggestion.CVC_SendEmail(this.condition).subscribe(result => result ? this.swalTool.SendMail() : null);
      this.suggestion.MAX_DIM_Growth_SustainCore(this.condition).subscribe(result => this.MAX_DIM_ACTIVE(result));
      this.suggestion.MAX_Maintain(this.condition).subscribe(result => this.MAX_PIM_ACTIVE(result));
      this.suggestion.MAX_Replacement(this.condition).subscribe(result => this.MAX_CAPEX_ACTIVE(result));
      this.suggestion.MAX_Growth(this.condition).subscribe(result => this.MAX_PIM_ACTIVE(result));
      this.suggestion.MAX_SustainCore(this.condition).subscribe(result => this.MAX_PIM_ACTIVE(result));
      this.suggestion.MAX_SustainCore_EnergySaving(this.condition).subscribe(result => this.MAX_PIM_ACTIVE(result));
      this.suggestion.MAX_ItCapex_DigitalCapex(this.condition).subscribe(result => this.MAX_DIM_ACTIVE(result));
      this.suggestion.MAX_CostCapex(this.condition).subscribe(result => this.MAX_CAPEX_ACTIVE(result));
      this.suggestion.MAX_Engineering(this.condition).subscribe(result => this.MAX_CAPEX_ACTIVE(result));
      this.NoRequestCAPEX();
    } else {
      this.swalTool.Required();
    }
    this.SetValidateFormGeneral();
  }

  SearchCoDeveloper(event) {
    this.GetCoDevelopers(event.term);
  }

  RemoveCoDeveloper() {
    this.GetCoDevelopers();
  }

  SearchOwnerName(event) {
    this.GetOwners(event.term);
  }

  ClearOwnerName() {
    this.GetOwners();
  }

  ChangeOwnerName() {
    this.GetCoDevelopers();
  }

  SelectCoDeveloper() {
    if (this.initiativesForm.controls.coDeveloper.value) {
      this.initiativeService.UpdateCoDeveloper(this.id, this.initiativesForm.controls.coDeveloper.value).subscribe(() => {
        this.CheckSwalType();
      });
    } else {
      this.initiativeService.DeleteCoDeveloper(this.id).subscribe(() => this.CheckSwalType());
    }
  }

  SetFormDate() {
    this.initiativesForm.patchValue({
      registeringDate: this.dateRegister ? this.dateRegister : this.dateUtil.SetDate(new Date()),
      startingDate: this.dateStart ? this.dateStart : null,
      finishingDate: this.dateFinish ? this.dateFinish : null,
      createdBy: this.createdBy ? this.createdBy : this.username,
    });
  }

  CheckSwalType() {
    switch (this.type) {
      case 'submit':
        if (this.ButtonNext) {
          if (((this.IsCim || this.IsStrategy) && !this.IsMax)) {
            this.swalTool.DetailCimStrategy();
          } else if (this.IsMax) {
            this.swalTool.DetailMax();
          } else if (this.IsCapex && !this.IsMax) {
            this.swalTool.DetailDirect();
          }
        } else {
          if (((this.IsCim || this.IsStrategy) && !this.IsMax) && (this.page === 'create')) {
            this.swalTool.DetailCimStrategy();
          } else if ((this.IsMax) && (this.page === 'create')) {
            this.swalTool.DetailMax();
          } else if ((this.IsCapex && this.page === 'create') && !this.IsMax) {
            this.swalTool.DetailDirect();
          }
        }
        break;
    }
  }

  SaveRequestOpex() {
    if (this.initiativesForm.controls.requestOpex.value === 'falseOpex') {
      this.impactService.DeleteImpiemantCost(this.id).subscribe(() => { });
    }
  }

  NextSubmit(value) {
    this.ButtonNext = value;
  }

  TypeRedirect() {
    this.DisabledButtonSave();
    this.RemoveFormSession();
    switch (this.type) {
      case 'draft':
        setTimeout(() => {
          if (this.page === 'create') {
            this.router.navigate(['/initiative/edit']);
          }
        }, 1700);
        break;
      case 'submit':
        if (this.ButtonNext) {
          if ((this.IsCim || this.IsStrategy) && !this.IsMax) {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/detail']), 1700);
          } else if (this.IsMax) {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/detail-max']), 1700);
          } else if ((this.IsCapex) && !this.IsMax) {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/direct']), 1700);
          } else {
            setTimeout(() => this.router.navigate(['/initiative/my-own']), 1700);
          }
        } else {
          if (((this.IsCim || this.IsStrategy) && !this.IsMax) && (this.page === 'create')) {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/detail']), 1700);
          } else if (this.IsMax && this.page === 'create') {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/detail-max']), 1700);
          } else if ((this.IsCapex && this.page === 'create') && !this.IsMax) {
            sessionStorage.setItem('InitiativeValidate', JSON.stringify(this.CheckValidForm));
            setTimeout(() => this.router.navigate(['/initiative/direct']), 1700);
          } else {
            setTimeout(() => this.router.navigate(['/initiative/my-own']), 1700);
          }
        }
        break;
    }
  }

  OnlyMax() {
    if (!this.CheckOnlyMax) {
      if (this.IsMax) { this.initiativesForm.patchValue({ initiativeType: 'max' }); }
    }
  }

  SaveDraft() {
    this.EnabledButtonSave();
    this.initiativesForm.controls.name.markAsTouched();
    if (this.initiativesForm.controls.name.valid) {
      this.OnlyMax();
      this.type = 'draft';
      this.SetFormDate();
      this.CurrentPage();
      this.DisabledButtonSave();
    } else {
      this.DisabledButtonSave();
      this.swalTool.Required();
    }
  }

  SaveSubmit() {
    this.EnabledButtonSave();
    if (this.CheckValidForm) {
      this.OnlyMax();
      this.SetFormDate();
      this.type = 'submit';
      this.CurrentPage();
      this.DisabledButtonSave();
    } else {
      this.DisabledButtonSave();
      if (this.initiativesForm.valid) {
        this.swalTool.SelectProcess();
      } else {
        this.SetMarkAsTouchedFormGeneral();
        this.swalTool.Required();
      }
    }
  }

  PatchSuggest() {
    this.initiativesForm.patchValue({
      cim: this.IsCim ? true : false,
      pim: this.IsPim ? true : false,
      dim: this.IsDim ? true : false,
      max: this.IsMax ? true : false,
      cpi: this.IsCpi ? true : false,
      directCapex: this.IsCapex ? true : false,
      strategy: this.IsStrategy ? true : false,
      randD: this.IsRandD ? true : false,
      other: this.IsOther ? true : false
    });
  }

  CreateDraftInitiative() {
    this.initiativeService.CreateDraftInitiative(this.initiativesForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      if (this.initiativesForm.controls.coDeveloper.value) {
        this.initiativeService.CreateCoDeveloper(response.id, this.initiativesForm.controls.coDeveloper.value).subscribe(() => { });
      }
      this.CheckSwalType();
      this.TypeRedirect();
    }, error => this.response.error(error));
  }

  CreateSubmitInitiative() {
    this.initiativeService.CreateSubmitInitiative(this.initiativesForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      if (this.initiativesForm.controls.coDeveloper.value) {
        this.initiativeService.CreateCoDeveloper(response.id, this.initiativesForm.controls.coDeveloper.value).subscribe(() => { });
      }
      this.CheckSwalType();
      this.TypeRedirect();
    }, error => this.response.error(error));
  }

  UpdateDraftInitiative() {
    this.initiativesForm.patchValue({ updatedBy: this.username });
    this.initiativeService.UpdateDraftInitiative(this.id, this.initiativesForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      this.GetSetDate(response.registeringDate, response.startingDate, response.finishingDate);
      this.initiativesForm.patchValue(response);
      this.initiativesForm.patchValue({
        registeringDate: this.dateRegisterDisplay,
        startingDate: this.dateStartDisplay,
        finishingDate: this.dateFinishDisplay,
        fxExchange: response.fxExchange !== 0 ? response.fxExchange : null,
      });
      this.initiativesForm.patchValue({
        cim: false, pim: false, dim: false, max: false, directCapex: false, cpi: false, strategy: false, randD: false, other: false
      });
      this.DisableSuggest(['cim', 'pim', 'dim', 'directCapex', 'cpi', 'strategy', 'randD', 'other', 'max']);
      this.ActiveSuggestion(response);
      this.SelectCoDeveloper();
      this.TypeRedirect();
    }, error => this.response.error(error));
  }

  UpdateSubmitInitiative() {
    this.initiativesForm.patchValue({ updatedBy: this.username });
    this.initiativeService.UpdateSubmitInitiative(this.id, this.initiativesForm.value).subscribe(response => {
      sessionStorage.setItem('id', response.id.toString());
      this.GetSetDate(response.registeringDate, response.startingDate, response.finishingDate);
      this.initiativesForm.patchValue(response);
      this.initiativesForm.patchValue({
        registeringDate: this.dateRegisterDisplay,
        startingDate: this.dateStartDisplay,
        finishingDate: this.dateFinishDisplay,
        fxExchange: response.fxExchange !== 0 ? response.fxExchange : null,
      });
      this.initiativesForm.patchValue({
        cim: false, pim: false, dim: false, max: false, directCapex: false, cpi: false, strategy: false, randD: false, other: false
      });
      this.DisableSuggest(['cim', 'pim', 'dim', 'directCapex', 'cpi', 'strategy', 'randD', 'other', 'max']);
      this.ActiveSuggestion(response);
      this.SelectCoDeveloper();
      this.TypeRedirect();
    }, error => this.response.error(error));
  }

  CurrentPage() {
    switch (this.page) {
      case 'create':
        switch (this.type) {
          case 'draft':
            this.CreateDraftInitiative();
            break;
          case 'submit':
            this.CreateSubmitInitiative();
            break;
        }
        break;
      case 'edit':
        this.EnableSuggest(['pim', 'cim', 'max', 'directCapex', 'dim', 'cpi', 'strategy', 'randD', 'other']);
        this.PatchSuggest();
        this.SaveRequestOpex();
        switch (this.type) {
          case 'draft':
            this.UpdateDraftInitiative();
            break;
          case 'submit':
            this.UpdateSubmitInitiative();
            break;
        }
        break;
    }
  }

  RemoveFormSession() {
    this.removeService.Form();
  }

  Draft(page) {
    if (['create', 'edit'].indexOf(page) !== -1) {
      this.SaveDraft();
    }
  }

  Submit(page) {
    if (['create', 'edit'].indexOf(page) !== -1) {
      this.SaveSubmit();
    }
  }
}
