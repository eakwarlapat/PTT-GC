import { SwalTool } from '@tools/swal.tools';
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProgressService } from '@services/progress/progress.service';
import { ImpactService } from '@services/impact/impact.service';
import { InitiativeService } from '@services/initiative/initiative.service';
import { MaxService } from '@services/max/max.service';
import { FormBuilder, Validators } from '@angular/forms';
import { StatusService } from '@services/status/status.service';
import { DetailService } from '@services/detail/detail.service';
import { CapexService } from '@services/capex/capex.service';
import { SubmitService } from '@services/submit/submit.service';
import { PermissionService } from '@services/permission/permission.service';

@Component({
  selector: 'app-initiative-button',
  templateUrl: './initiative-button.component.html',
  styleUrls: ['./initiative-button.component.css']
})
export class InitiativeButtonComponent implements OnInit, OnDestroy {

  constructor(
    private swalTool: SwalTool,
    private fb: FormBuilder,
    private progressService: ProgressService,
    private initiativeService: InitiativeService,
    private detailService: DetailService,
    private impactService: ImpactService,
    private maxService: MaxService,
    private submitService: SubmitService,
    private statusService: StatusService,
    private capexService: CapexService,
    public permissionService: PermissionService,
  ) { }

  @ViewChild('AttachmentModal', { static: false }) AttachmentModal: ModalDirective;

  @Input() id;
  @Input() page;

  @Input() validate;
  @Input() draft = true;

  @Input() Cim;
  @Input() Strategy;
  @Input() Max;
  @Input() Capex;

  @Output() SaveDraft = new EventEmitter();
  @Output() SaveSubmit = new EventEmitter();

  @Output() Required = new EventEmitter();

  @Output() NextSubmit = new EventEmitter();

  submitToForm = this.fb.group({ status: 'forward', commentCancelled: '' });

  CheckSubmitTo: boolean;

  PercentImpact = false;

  stage: string;
  status: string;

  Comment = false;
  SuggestStatus = true;

  ButtonNext = false;
  ButtonSubmit = false;

  DisabledSubmit = false;

  lasttime = '';
  lastesttime = '';

  get StageIL4() {
    return this.stage === 'IL4';
  }

  get StageIL5() {
    return this.stage === 'IL5' ;
  }

  get CheckButton() {
    return (this.Cim || this.Strategy || this.Capex || this.Max);
  }

  get Suggest() {
    return !(this.Cim || this.Strategy || this.Capex || this.Max);
  }

  get invalidComment() {
    return this.submitToForm.controls.commentCancelled.touched && this.submitToForm.controls.commentCancelled.invalid;
  }

  ngOnInit(): void {
    if (this.id) {
      this.initiativeService.GetSuggestStatus(this.id).subscribe(response => {
        if (response.cim || response.directCapex || response.strategy || response.max) {
          this.SuggestStatus = false;
        } else {
          this.SuggestStatus = true;
        }
      });
      this.IsCancel();
    }
    this.permissionService.CheckSection(this.page, '0');
    if (sessionStorage.getItem('isSubmitToForm') === 'true') {
      const SubmitToForm = JSON.parse(sessionStorage.getItem('SubmitToForm'));
      this.submitToForm.patchValue(SubmitToForm);
    }
    this.id = Number(sessionStorage.getItem('id'));
    if (this.id) { this.permissionService.CheckSection(this.page, sessionStorage.getItem('id').toString()); }
    this.initiativeService.GetSuggestStatus(this.id).subscribe(response => {
      if (response) {
        this.stage = response.stage ? response.stage : null;
        const check = { status: response.status, stage: response.stage };
        this.statusService.CheckSubmitTo(check).subscribe(result => this.CheckSubmitTo = result);
      }
    });
  }

  ngOnDestroy() {
    if (this.submitToForm.dirty) {
      sessionStorage.setItem('isSubmitToForm', 'true');
      sessionStorage.setItem('SubmitToForm', JSON.stringify(this.submitToForm.value));
    }
  }

  IsCancel() {
    if (sessionStorage.getItem('cancel')) {
      this.submitToForm.patchValue({ status : 'cancelled' });
      this.Comment = true;
      this.submitToForm.controls.commentCancelled.setValidators([Validators.required]);
      this.submitToForm.controls.commentCancelled.updateValueAndValidity();
    }
  }

  OnChangeStatus() {
    switch (this.submitToForm.controls.status.value) {
      case 'cancelled':
        this.Comment = true;
        this.submitToForm.controls.commentCancelled.setValidators([Validators.required]);
        this.submitToForm.controls.commentCancelled.updateValueAndValidity();
        break;
      case 'backward':
      case 'forward':
        this.Comment = false;
        this.submitToForm.controls.commentCancelled.clearValidators();
        this.submitToForm.controls.commentCancelled.updateValueAndValidity();
        this.submitToForm.controls.commentCancelled.markAsUntouched();
        break;
    }
  }

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

  JsonParse(json) {
    return JSON.parse(sessionStorage.getItem(json));
  }

  General() {
    const InitiativesForm = JSON.parse(sessionStorage.getItem('InitiativesForm'));
    if (sessionStorage.getItem('TotalRecurringOneTime')) {
      const TotalRecurringOneTime = Number(sessionStorage.getItem('TotalRecurringOneTime'));
      InitiativesForm.benefitAmount = TotalRecurringOneTime ? TotalRecurringOneTime.toFixed(3) : 0;
    }
    this.initiativeService.UpdateDraftInitiative(this.id, InitiativesForm).subscribe(() => {});
  }

  Detail(type) {
    switch (type) {
      case 'detail':
        const Detail = JSON.parse(sessionStorage.getItem('InitiativesDetailForm'));
        Detail.id ?
          this.detailService.UpdateInitiativeDetail(this.id, Detail).subscribe(() => { }) :
          this.detailService.CreateInitiativeDetail(this.id, Detail).subscribe(() => { });
        break;
      case 'product':
        const Product = JSON.parse(sessionStorage.getItem('ProductForm'));
        this.detailService.CreateInitiativeProduct(this.id, Product).subscribe(() => { });
        break;
      case 'milestone':
        const Milestone = JSON.parse(sessionStorage.getItem('MilestoneForm'));
        this.detailService.CreateInitiativeMilestone(this.id, Milestone).subscribe(() => { });
        break;
      case 'financial':
        const Financial = JSON.parse(sessionStorage.getItem('FinancialForm'));
        const FinancialAvg = JSON.parse(sessionStorage.getItem('FinancialAvgForm'));
        this.detailService.CreateInitiativeFinancialIndicator(this.id, Financial).subscribe(() => { });
        this.detailService.CreateInitiativeFinancial(this.id, FinancialAvg).subscribe(() => { });
        break;
    }
  }

  DetailMax() {
    const DetailMax = JSON.parse(sessionStorage.getItem('DetailMax'));
    if (DetailMax.workstreamLead) {
      this.maxService.CreateWorkstreamLead(this.id, { email: DetailMax.workstreamLead }).subscribe(() => { });
    }
    if (DetailMax.sponsorEvp.length !== 0) {
      this.maxService.CreateSponsor(this.id, DetailMax.sponsorEvp).subscribe(() => { });
    }
    if (DetailMax.toFinance.length !== 0) {
      this.maxService.CreateFinance(this.id, DetailMax.toFinance).subscribe(() => { });
    }
    if (DetailMax.cfo.length !== 0) {
      this.maxService.CreateCFO(this.id, DetailMax.cfo).subscribe(() => { });
    }
    if (DetailMax.cto.length !== 0) {
      this.maxService.CreateCTO(this.id, DetailMax.cto).subscribe(() => { });
    }
    if (DetailMax.tot.length !== 0) {
      this.maxService.CreateTOTeam(this.id, DetailMax.tot).subscribe(() => { });
    }
    if (DetailMax.tfb.length !== 0) {
      this.maxService.CreateTfBtTO(this.id, DetailMax.tfb).subscribe(() => { });
    }
    DetailMax.id ?
      this.maxService.UpdateDetailInformation(this.id, DetailMax).subscribe(() => {
        if (DetailMax.kpisForm.kpis.length !== 0) {
          this.maxService.CreateKpi(this.id, DetailMax.kpisForm).subscribe(() => { });
        }
      }) :
      this.maxService.CreateDetailInformation(this.id, DetailMax).subscribe(() => {
        if (DetailMax.kpisForm.kpis.length !== 0) {
          this.maxService.CreateKpi(this.id, DetailMax.kpisForm).subscribe(() => { });
        }
      });
  }

  DetailCapex() {
    if (sessionStorage.getItem('InitiativeValidate_capex') === 'true') {
      const DetailCapex = JSON.parse(sessionStorage.getItem('DetailCapex'));
      const yearNext = JSON.parse(sessionStorage.getItem('Capex_year_next'));
      const yearNow = JSON.parse(sessionStorage.getItem('Capex_year_now'));
      const yearM = JSON.parse(sessionStorage.getItem('Capex_year_m'));
      const AnnualCapex = JSON.parse(sessionStorage.getItem('AnnualCapex'));

      let MonthCapex1;
      let MonthCapex2;
      let MonthCapex3;
      let MonthCapex4;
      let MonthCapex5;
      let MonthCapex6;
      let MonthCapex7;
      let MonthCapex8;
      let MonthCapex9;
      let MonthCapex10;

      if (JSON.parse(sessionStorage.getItem('MonthCapex1')) != null) {
        MonthCapex1 = JSON.parse(sessionStorage.getItem('MonthCapex1')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex2')) != null) {
        MonthCapex2 = JSON.parse(sessionStorage.getItem('MonthCapex2')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex3')) != null) {
        MonthCapex3 = JSON.parse(sessionStorage.getItem('MonthCapex3')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex4')) != null) {
        MonthCapex4 = JSON.parse(sessionStorage.getItem('MonthCapex4')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex5')) != null) {
        MonthCapex5 = JSON.parse(sessionStorage.getItem('MonthCapex5')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex6')) != null) {
        MonthCapex6 = JSON.parse(sessionStorage.getItem('MonthCapex6')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex7')) != null) {
        MonthCapex7 = JSON.parse(sessionStorage.getItem('MonthCapex7')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex8')) != null) {
        MonthCapex8 = JSON.parse(sessionStorage.getItem('MonthCapex8')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex9')) != null) {
        MonthCapex9 = JSON.parse(sessionStorage.getItem('MonthCapex9')).monthForm_list;
      }

      if (JSON.parse(sessionStorage.getItem('MonthCapex10')) != null) {
        MonthCapex10 = JSON.parse(sessionStorage.getItem('MonthCapex10')).monthForm_list;
      }

      let BudgetForm = '';
      let BetweenYear = '';
      let TransferForm = '';
      let PoolBudgetForm = '';

      if (DetailCapex.BudgetForm === 'Annual') {
        BudgetForm = DetailCapex.BudgetForm + ' (' + yearNext + ')';
      } else if (DetailCapex.BudgetForm === 'Mid Year') {
        BudgetForm = DetailCapex.BudgetForm + ' (' + yearNow + ')';
      } else {

        BudgetForm = DetailCapex.BudgetForm;

        if (DetailCapex.BetweenYear === 'BOD Approval on') {
          BetweenYear = DetailCapex.BetweenYear;
        } else if (DetailCapex.BetweenYear === 'Transfer') {
          BetweenYear = DetailCapex.BetweenYear + ' (' + yearNow + ')';
          TransferForm = DetailCapex.TransferForm;
        } else if (DetailCapex.BetweenYear === 'Pool Budget') {
          BetweenYear = DetailCapex.BetweenYear + ' (' + yearNow + ')';
          PoolBudgetForm = DetailCapex.PoolBudgetForm;
        } else {
          BetweenYear = DetailCapex.BetweenYear + ' (' + yearNow + ')';
        }
      }
    } else {
      this.swalTool.CannotSave();
    }
  }

  Impact(type) {
    switch (type) {
      case 'impact':
        const ImpactForm = JSON.parse(sessionStorage.getItem('ImpactForm'));
        ImpactForm.id ?
          this.impactService.UpdateImpact(this.id, ImpactForm).subscribe(() => { }) :
          this.impactService.CreateImpact(this.id, ImpactForm).subscribe(() => { });
        break;
      case 'shareBenefit':
        const ShareBenefitFrom = JSON.parse(sessionStorage.getItem('ShareBenefitFrom'));
        this.impactService.CreateShareBenefitWorkstream(this.id, ShareBenefitFrom).subscribe(() => { });
        break;
      case 'firstRunRate':
        const Impact = JSON.parse(sessionStorage.getItem('ImpactForm'));
        Impact.id ?
          this.impactService.UpdateImpact(this.id, Impact).subscribe(() => { }) :
          this.impactService.CreateImpact(this.id, Impact).subscribe(() => { });
        const FirstRunRateForm = JSON.parse(sessionStorage.getItem('FirstRunRateForm'));
        this.impactService.CreateFirstRunRate(this.id, FirstRunRateForm).subscribe(() => { });
        break;
      case 'firstRunRateGeneral':
        const ImpactGeneral = JSON.parse(sessionStorage.getItem('ImpactGeneral'));
        ImpactGeneral.id ?
          this.impactService.UpdateImpact(this.id, ImpactGeneral).subscribe(() => { }) :
          this.impactService.CreateImpact(this.id, ImpactGeneral).subscribe(() => { });
        const FirstRunRateGeneral = JSON.parse(sessionStorage.getItem('FirstRunRateGeneral'));
        this.impactService.CreateFirstRunRate(this.id, FirstRunRateGeneral).subscribe(() => { });
        break;
      case 'indirect':
        const IndirectForm = JSON.parse(sessionStorage.getItem('IndirectForm'));
        this.impactService.CreateIndirect(this.id, IndirectForm).subscribe(() => { });
        break;
      case 'impiemantCost':
        const ImpiemantCostForm = JSON.parse(sessionStorage.getItem('ImpiemantCostForm'));
        this.impactService.CreateImpiemantCost(this.id, ImpiemantCostForm).subscribe(() => { });
        break;
      case 'typeBenefit':
        const TypeBenefitForm = JSON.parse(sessionStorage.getItem('TypeBenefitForm'));
        this.impactService.CreateTypeBenefitForm(this.id, TypeBenefitForm).subscribe(() => { });
        break;
    }
  }

  Progress() {
    const ProgressDetail = JSON.parse(sessionStorage.getItem('ProgressDetailForm'));
    this.progressService.CreateProgressDetail(this.id, ProgressDetail).subscribe(() => { });
  }

  SaveGeneral() {
    if (sessionStorage.getItem('isInitiativesForm') === 'true') { this.General(); }
  }

  SaveDetail() {
    if ((sessionStorage.getItem('isInitiativesDetailForm') === 'true') ||
      (sessionStorage.getItem('isFinancialIndicatorForm') === 'true')) { this.Detail('detail'); }
    if ((sessionStorage.getItem('isInitiativesHaveProduct') === 'true') ||
      (sessionStorage.getItem('isProductForm') === 'true')) { this.Detail('product'); }
    if (sessionStorage.getItem('isMilestoneForm') === 'true') { this.Detail('milestone'); }
    if (sessionStorage.getItem('isFinancialForm') === 'true') { this.Detail('financial'); }
    if (sessionStorage.getItem('isNoteForm') === 'true') { this.Detail('detail'); }
  }

  SaveDetailMax() {
    if (sessionStorage.getItem('isDetailMax') === 'true') { this.DetailMax(); }
  }

  SaveImpact() {
    if (sessionStorage.getItem('isFinancialImpactArea') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isHaveShareBenefit') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isILForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isMonthForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isCalculateForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isExplanationForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isHaveImpiemantCost') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isIndirectBenefit') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isToCommentForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isRemarkForm') === 'true') { this.Impact('impact'); }
    if (sessionStorage.getItem('isShareBenefitFrom') === 'true') { this.Impact('shareBenefit'); }
    if (sessionStorage.getItem('isFirstRunRateForm') === 'true') { this.Impact('firstRunRate'); }
    if (sessionStorage.getItem('isIndirectForm') === 'true') { this.Impact('indirect'); }
    if (sessionStorage.getItem('isImpiemantCostForm') === 'true') { this.Impact('impiemantCost'); }
    if (sessionStorage.getItem('isTypeBenefitForm') === 'true') { this.Impact('typeBenefit'); }

    if (sessionStorage.getItem('isFirstRunRateGeneral') === 'true') { this.Impact('firstRunRateGeneral'); }
  }

  SaveProgress() {
    if (sessionStorage.getItem('isProgressDetailForm') === 'true') { this.Progress(); }
  }

  SaveCapex() {
    // this.DetailCapex();
  }

  PageSave() {
    switch (this.page) {
      case 'create':
      case 'edit':
        this.SaveDetail();
        this.SaveDetailMax();
        this.SaveImpact();
        this.SaveProgress();
        break;
      case 'detail':
      case 'detail-max':
      case 'direct-capex':
      case 'capex-information':
        this.SaveGeneral();
        this.SaveImpact();
        this.SaveProgress();
        break;
      case 'capex-information-addmore':
        this.SaveGeneral();
        this.SaveImpact();
        this.SaveProgress();
        break;
      case 'impact':
        this.SaveGeneral();
        this.SaveDetail();
        this.SaveDetailMax();
        // this.SaveCapex();
        this.SaveProgress();
        break;
      case 'progress':
        this.SaveGeneral();
        this.SaveDetail();
        this.SaveDetailMax();
        // this.SaveCapex();
        this.SaveImpact();
        break;
      case 'status':
        this.SaveGeneral();
        this.SaveDetail();
        this.SaveDetailMax();
        // this.SaveCapex();
        this.SaveImpact();
        this.SaveProgress();
        break;
      case 'general-information':
        this.SaveGeneral();
        break;
    }
  }

  RequiredGeneral() {
    this.Required.emit(['general']);
    this.swalTool.RequiredTab('General Information');
  }

  RequiredDetail() {
    this.Required.emit(['detail']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy)');
  }

  RequiredDetailGeneral() {
    this.Required.emit(['detail', 'general']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy), General');
  }

  RequiredDetailGeneralImpact() {
    this.Required.emit(['detail', 'general', 'impact']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy), General, Impact');
  }

  RequiredDetailGeneralProgress() {
    this.Required.emit(['detail', 'general', 'progress']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy), General, Progress');
  }

  RequiredDetailImpact() {
    this.Required.emit(['detail', 'impact']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy), Impact');
  }

  RequiredDetailProgress() {
    this.Required.emit(['detail', 'impact']);
    this.swalTool.RequiredTab('Detail (CIM & Strategy), Progress');
  }

  RequiredMax() {
    this.Required.emit(['max']);
    this.swalTool.RequiredTab('Detail (Max)');
  }

  RequiredMaxGeneral() {
    this.Required.emit(['max', 'general']);
    this.swalTool.RequiredTab('Detail (Max), General');
  }

  RequiredMaxGeneralImpact() {
    this.Required.emit(['max', 'general', 'impact']);
    this.swalTool.RequiredTab('Detail (Max), General, Impact');
  }

  RequiredMaxGeneralProgress() {
    this.Required.emit(['max', 'general', 'progress']);
    this.swalTool.RequiredTab('Detail (Max), General, Progress');
  }

  RequiredMaxImpact() {
    this.Required.emit(['max', 'impact']);
    this.swalTool.RequiredTab('Detail (Max), Impact');
  }

  RequiredMaxProgress() {
    this.Required.emit(['max', 'progress']);
    this.swalTool.RequiredTab('Detail (Max), Progress');
  }

  RequiredImpact() {
    this.Required.emit(['impact']);
    this.swalTool.RequiredTab('Impact');
  }

  RequiredImpactGeneral() {
    this.Required.emit(['impact', 'general']);
    this.swalTool.RequiredTab('Impact, General');
  }

  RequiredProgress() {
    this.Required.emit(['progress']);
    this.swalTool.RequiredTab('Progress');
  }

  RequiredProgressGeneral() {
    this.Required.emit(['max', 'progress']);
    this.swalTool.RequiredTab('Detail (Max), Progress');
  }

  Is(session) {
    return sessionStorage.getItem(session) === 'true' ? true : false;
  }

  Validate(session) {
    return sessionStorage.getItem(session) === 'true' ? true : false;
  }

  ValidateTrue(type1, type2?) {
    return type2 ? this.Validate(type1) && this.Validate(type2) : this.Validate(type1);
  }

  ValidateTrue3(type1, type2, type3) {
    return this.Validate(type1) && this.Validate(type2) && this.Validate(type3);
  }

  ValidateType(type1, type2?, type3?) {
    if (type3) {
      if (!this.Validate(type1) && !this.Validate(type2) && !this.Validate(type3)) { // 1 = false  2 = false 3 = false
        switch (type1) {
          case 'DetailValidate':
            switch (type2) {
              case 'InitiativeValidate':
                switch (type3) {
                  case 'ProgressValidate': this.RequiredDetailGeneralProgress(); break;
                  case 'ImpactValidate': this.RequiredDetailGeneralImpact(); break;
                }
                break;
            }
            break;
          case 'DetailMaxValidate':
            switch (type2) {
              case 'InitiativeValidate':
                switch (type3) {
                  case 'ProgressValidate': this.RequiredMaxGeneralProgress(); break;
                  case 'ImpactValidate': this.RequiredMaxGeneralImpact(); break;
                }
                break;
            }
            break;
        }
      } else if (this.Validate(type1) && this.Validate(type2) && !this.Validate(type3)) { // 1 = true  2 = true 3 = false
        switch (type3) {
          case 'ImpactValidate': this.RequiredImpact(); break;
          case 'ProgressValidate': this.RequiredProgress(); break;
        }
      } else if (this.Validate(type1) && !this.Validate(type2)) { // 1 = true  2 = false
        switch (type2) {
          case 'ImpactValidate': this.RequiredImpact(); break;
          case 'ProgressValidate': this.RequiredProgress(); break;
        }
      } else if (!this.Validate(type1) && this.Validate(type2)) { // 1 = false 2 = true
        switch (type1) {
          case 'InitiativeValidate': this.RequiredGeneral(); break;
          case 'DetailValidate': this.RequiredDetail(); break;
          case 'DetailMaxValidate': this.RequiredMax(); break;
        }
      } else if (!this.Validate(type1) && !this.Validate(type2)) { // 1 = false 2 = false
        switch (type1) {
          case 'InitiativeValidate':
            switch (type2) {
              case 'ImpactValidate': this.RequiredImpactGeneral(); break;
              case 'ProgressValidate': this.RequiredProgressGeneral(); break;
            }
            break;
          case 'DetailValidate':
            switch (type2) {
              case 'InitiativeValidate': this.RequiredDetailGeneral(); break;
              case 'ImpactValidate': this.RequiredDetailImpact(); break;
              case 'ProgressValidate': this.RequiredDetailProgress(); break;
            }
            break;
          case 'DetailMaxValidate':
            switch (type2) {
              case 'InitiativeValidate': this.RequiredMaxGeneral(); break;
              case 'ImpactValidate': this.RequiredMaxImpact(); break;
              case 'ProgressValidate': this.RequiredMaxProgress(); break;
            }
            break;
        }
      }
    } else if (type2) {
      if (this.Validate(type1) && !this.Validate(type2)) { // 1 = true  2 = false
        switch (type2) {
          case 'InitiativeValidate': this.RequiredGeneral();  break;
          case 'ImpactValidate'    : this.RequiredImpact();   break;
          case 'ProgressValidate'  : this.RequiredProgress(); break;
        }
      } else if (!this.Validate(type1) && this.Validate(type2)) { // 1 = false 2 = true
        switch (type1) {
          case 'InitiativeValidate': this.RequiredGeneral(); break;
          case 'DetailValidate'    : this.RequiredDetail();  break;
          case 'DetailMaxValidate' : this.RequiredMax();     break;
        }
      } else if (!this.Validate(type1) && !this.Validate(type2)) { // 1 = false 2 = false
        switch (type1) {
          case 'InitiativeValidate':
            switch (type2) {
              case 'ImpactValidate': this.RequiredImpactGeneral(); break;
              case 'ProgressValidate': this.RequiredProgressGeneral(); break;
            }
            break;
          case 'DetailValidate':
            switch (type2) {
              case 'InitiativeValidate': this.RequiredDetailGeneral(); break;
              case 'ImpactValidate': this.RequiredDetailImpact(); break;
              case 'ProgressValidate': this.RequiredDetailProgress(); break;
            }
            break;
          case 'DetailMaxValidate':
            switch (type2) {
              case 'InitiativeValidate': this.RequiredMaxGeneral(); break;
              case 'ImpactValidate': this.RequiredMaxImpact(); break;
              case 'ProgressValidate': this.RequiredMaxProgress(); break;
            }
            break;
        }
      }
    } else if (type1) {
      if (!this.Validate(type1)) {
        switch (type1) {
          case 'InitiativeValidate': this.RequiredGeneral(); break;
        }
      }
    }
  }

  ValidateGeneral() {
    if (this.validate) {
      if (this.Cim || this.Strategy) { this.Validate('DetailValidate') ? this.Save() : this.RequiredDetail(); }
      if (this.Max) { this.Validate('DetailMaxValidate') ? this.Save() : this.RequiredMax(); }
      if (this.Suggest) { this.Save(); }
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateGeneralProgress() {
    if (this.Cim || this.Strategy) {
      this.ValidateTrue('DetailValidate', 'ProgressValidate') ? this.Save() :
      this.ValidateType('DetailValidate', 'ProgressValidate');
    }
    if (this.Max) {
      this.ValidateTrue('DetailMaxValidate', 'ProgressValidate') ? this.Save() :
      this.ValidateType('DetailMaxValidate', 'ProgressValidate');
    }
    if (this.Suggest) { this.Save(); }
  }

  ValidateGeneralImpact() {
    if (this.Cim || this.Strategy) {
      this.ValidateTrue('DetailValidate', 'ImpactValidate') ? this.Save() :
      this.ValidateType('DetailValidate', 'ImpactValidate');
    }
    if (this.Max) {
      this.ValidateTrue('DetailMaxValidate', 'ImpactValidate') ? this.Save() :
      this.ValidateType('DetailMaxValidate', 'ImpactValidate');
    }
    if (this.Suggest) { this.Save(); }
  }

  ValidateDetail() {
    if (this.validate) {
      this.ValidateTrue('InitiativeValidate') ? this.Save() :
      this.ValidateType('InitiativeValidate');
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateDetail_capex() {
    if (this.validate) {
      this.ValidateTrue('InitiativeValidate_capex') ? this.Save() :
      this.ValidateType('InitiativeValidate_capex');
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateDetailImpact() {
    if (this.validate) {
      this.ValidateTrue('InitiativeValidate', 'ImpactValidate') ? this.Save() :
      this.ValidateType('InitiativeValidate', 'ImpactValidate');
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateDetailProgress() {
    if (this.validate) {
      this.ValidateTrue('InitiativeValidate', 'ProgressValidate') ? this.Save() :
      this.ValidateType('InitiativeValidate', 'ProgressValidate');
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateImpact() {
    if (this.validate) {
      if (this.Cim || this.Strategy) {
        this.ValidateTrue('DetailValidate', 'InitiativeValidate') ? this.Save() :
        this.ValidateType('DetailValidate', 'InitiativeValidate');
      }
      if (this.Max) {
        this.ValidateTrue('DetailMaxValidate', 'InitiativeValidate') ? this.Save() :
        this.ValidateType('DetailMaxValidate', 'InitiativeValidate');
      }
      if (this.Suggest) { this.Save(); }
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateImpactProgress() {
    if (this.validate) {
      if (this.Cim || this.Strategy) {
        this.ValidateTrue3('DetailValidate', 'InitiativeValidate', 'ProgressValidate') ? this.Save() :
        this.ValidateType('DetailValidate' , 'InitiativeValidate', 'ProgressValidate');
      }
      if (this.Max) {
        this.ValidateTrue3('DetailMaxValidate', 'InitiativeValidate', 'ProgressValidate') ? this.Save() :
        this.ValidateType('DetailMaxValidate' , 'InitiativeValidate', 'ProgressValidate');
      }
      if (this.Suggest) { this.Save(); }
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateProgress() {
    if (this.validate) {
      if (this.Cim || this.Strategy) {
        this.ValidateTrue('DetailValidate', 'InitiativeValidate') ? this.Save() :
          this.ValidateType('DetailValidate', 'InitiativeValidate');
      }
      if (this.Max) {
        this.ValidateTrue('DetailMaxValidate', 'InitiativeValidate') ? this.Save() :
          this.ValidateType('DetailMaxValidate', 'InitiativeValidate');
      }
      if (this.Suggest) { this.Save(); }
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateProgressImpact() {
    if (this.validate) {
      if (this.Cim || this.Strategy) {
        this.ValidateTrue3('DetailValidate', 'InitiativeValidate', 'ImpactValidate') ? this.Save() :
        this.ValidateType('DetailValidate' , 'InitiativeValidate', 'ImpactValidate');
      }
      if (this.Max) {
        this.ValidateTrue3('DetailMaxValidate', 'InitiativeValidate', 'ImpactValidate') ? this.Save() :
        this.ValidateType('DetailMaxValidate' , 'InitiativeValidate', 'ImpactValidate');
      }
      if (this.Suggest) { this.Save(); }
    } else {
      this.PageSave();
      this.SaveSubmit.emit(this.page);
    }
  }

  ValidateStatus() {
    if (this.Cim || this.Strategy) {
      this.ValidateTrue('DetailValidate', 'InitiativeValidate') ? this.Save() :
      this.ValidateType('DetailValidate', 'InitiativeValidate');
    }
    if (this.Max) {
      this.ValidateTrue('DetailMaxValidate', 'InitiativeValidate') ? this.Save() :
      this.ValidateType('DetailMaxValidate', 'InitiativeValidate');
    }
    if (this.Suggest) { this.Save(); }
  }

  ValidateStatusImpact() {
    if (this.Cim || this.Strategy) {
      this.ValidateTrue3('DetailValidate', 'InitiativeValidate', 'ImpactValidate') ? this.Save() :
      this.ValidateType('DetailValidate', 'InitiativeValidate', 'ImpactValidate');
    }
    if (this.Max) {
      this.ValidateTrue3('DetailMaxValidate', 'InitiativeValidate', 'ImpactValidate') ? this.Save() :
      this.ValidateType('DetailMaxValidate', 'InitiativeValidate', 'ImpactValidate');
    }
    if (this.Suggest) { this.Save(); }
  }

  ValidateStatusProgress() {
    if (this.Cim || this.Strategy) {
      this.ValidateTrue3('DetailValidate', 'InitiativeValidate', 'ProgressValidate') ? this.Save() :
      this.ValidateType('DetailValidate' , 'InitiativeValidate', 'ProgressValidate');
    }
    if (this.Max) {
      this.ValidateTrue3('DetailMaxValidate', 'InitiativeValidate', 'ProgressValidate') ? this.Save() :
      this.ValidateType('DetailMaxValidate' , 'InitiativeValidate', 'ProgressValidate');
    }
    if (this.Suggest) { this.Save(); }
  }

  CheckPercentImpact() {
    if (this.Is('isHaveShareBenefit')) {
      const HaveShareBenefit = this.JsonParse('HaveShareBenefit');
      if (HaveShareBenefit.haveShareBenefit === 'false') {
        sessionStorage.removeItem('PercentImpact');
        return false;
      }
    }
    if (this.Is('isShareBenefitFrom')) {
      const ShareBenefitFrom = this.JsonParse('ShareBenefitFrom');
      const arraySum = [];
      for (const item of ShareBenefitFrom.shareBenefitWorkstreams) {
        if (item.percent !== null) {
          arraySum.push(Number(item.percent));
        }
      }
      const sum = arraySum.reduce((a, b) => a + b, 0);
      if (sum < 100) {
        sessionStorage.setItem('PercentImpact', 'true');
        return false;
      } else {
        sessionStorage.removeItem('PercentImpact');
      }
    }
  }

  CheckBenefitAmountSubmit() {
    if (sessionStorage.getItem('InitiativeActive') === 'true') {
      if (sessionStorage.getItem('TotalRecurringOneTime')) {
        const Total   = Number(sessionStorage.getItem('TotalRecurringOneTime'));
        const Benefit = { benefitAmount : Total ? Total.toFixed(3) : 0 };
        this.initiativeService.UpdateBenefitAmount(this.id, Benefit).subscribe(() => this.SubmitSave());
      } else if (sessionStorage.getItem('SetWorkstream') === 'true') {
        const WorkstreamList = JSON.parse(sessionStorage.getItem('WorkstreamList'));
        if (WorkstreamList.toFinance.length !== 0) {
          this.maxService.CreateFinance(this.id, WorkstreamList.toFinance).subscribe(() => { });
        }
        if (WorkstreamList.cfo.length !== 0) {
          this.maxService.CreateCFO(this.id, WorkstreamList.cfo).subscribe(() => { });
        }
        if (WorkstreamList.cto.length !== 0) {
          this.maxService.CreateCTO(this.id, WorkstreamList.cto).subscribe(() => { });
        }
        if (WorkstreamList.tot.length !== 0) {
          this.maxService.CreateTOTeam(this.id, WorkstreamList.tot).subscribe(() => { });
        }
        if (WorkstreamList.tfb.length !== 0) {
          this.maxService.CreateTfBtTO(this.id, WorkstreamList.tfb).subscribe(() =>  {});
        }
        if (WorkstreamList.sponsorEvp.length !== 0) {
          this.maxService.CreateSponsor(this.id, WorkstreamList.sponsorEvp).subscribe(() => {});
        }
        if (WorkstreamList.workstreamLead) {
          this.maxService.CreateWorkstreamLead(this.id, { email: WorkstreamList.workstreamLead }).subscribe(() => this.SubmitSave());
        }
      } else if (sessionStorage.getItem('WorkstreamLead')) {
        const mail = sessionStorage.getItem('WorkstreamLead');
        this.maxService.CreateWorkstreamLead(this.id, { email: mail }).subscribe(() => this.SubmitSave());
      } else {
        this.SubmitSave();
      }
    } else {
      this.SubmitSave();
    }
  }

  CheckBenefitAmountDraft() {
    if (sessionStorage.getItem('InitiativeActive') === 'true') {
      if (sessionStorage.getItem('TotalRecurringOneTime')) {
        const TotalRecurringOneTime = Number(sessionStorage.getItem('TotalRecurringOneTime'));
        const Benefit = { benefitAmount : TotalRecurringOneTime ? TotalRecurringOneTime.toFixed(3) : 0 };
        this.initiativeService.UpdateBenefitAmount(this.id, Benefit).subscribe(() => {});
      }
    }
  }

  Save() {
    if (sessionStorage.getItem('PercentImpact') === 'true') {
      this.CheckPercentImpact();
      this.swalTool.UnderPercentImpact();
      this.Required.emit(['impact']);
    } else {
      this.CheckBenefitAmountSubmit();
    }
  }

  SaveGeneralSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        case 'IL1': this.ValidateGeneralImpact();   break;
        case 'IL2': this.ValidateGeneralProgress(); break;
        case 'IL3': this.ValidateGeneralImpact();   break;
        case 'IL4': this.ValidateGeneralImpact();   break;
        default: this.ValidateGeneral(); break;
      }
    }
  }

  SaveDetailSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        case 'IL1': this.ValidateDetailImpact();   break;
        case 'IL2': this.ValidateDetailProgress(); break;
        case 'IL3': this.ValidateDetailImpact();   break;
        case 'IL4': this.ValidateDetailImpact();   break;
        default: this.ValidateDetail(); break;
      }
    }
  }

  SaveDetailSubmit_capex() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        default: this.ValidateDetail_capex(); break;
      }
    }
  }

  SaveImpactSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        case 'IL2': this.ValidateImpactProgress(); break;
        default: this.ValidateImpact(); break;
      }
    }
  }

  SaveCAPEXSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        default: this.ValidateImpact(); break;
      }
    }
  }

  SaveProgressSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        case 'IL1': this.ValidateProgressImpact(); break;
        case 'IL3': this.ValidateProgressImpact(); break;
        case 'IL4': this.ValidateProgressImpact(); break;
        default: this.ValidateProgress(); break;
      }
    }
  }

  SaveStatusSubmit() {
    const check = ['backward', 'cancelled'];
    const status = this.submitToForm.controls.status.value;
    if (check.includes(status)) {
      this.GeneralSubmit();
    } else {
      switch (this.stage) {
        case 'IL1': this.ValidateStatusImpact();   break;
        case 'IL2': this.ValidateStatusProgress(); break;
        case 'IL3': this.ValidateStatusImpact();   break;
        case 'IL4': this.ValidateStatusImpact();   break;
        default: this.ValidateStatus(); break;
      }
    }
  }

  Submit() {
    if (this.submitToForm.valid) {
      switch (this.page) {
        case 'create':
        case 'general-information':
          this.PageSave();
          this.SaveSubmit.emit(this.page);
          break;
        case 'edit':
          this.initiativeService.GetSuggestStatus(this.id).subscribe(response => {
            if (!(response.cim || response.directCapex || response.strategy || response.max)) {
              this.PageSave();
              this.SaveSubmit.emit(this.page);
              this.NextSubmit.emit(true);
            } else {
              this.SaveGeneralSubmit();
            }
          });
          break;
        case 'capex-information':
          this.SaveDetailSubmit_capex();
          break;
        case 'capex-information-addmore':
          this.SaveDetailSubmit_capex();
          break;
        case 'direct-capex':
        case 'detail':
        case 'detail-max':
          this.NextSubmit.emit(true);
          this.SaveDetailSubmit();
          break;
        case 'impact':
          this.SaveImpactSubmit();
          break;
        case 'progress':
          this.SaveProgressSubmit();
          break;
        case 'status':
          this.SaveStatusSubmit();
          break;
      }
    } else {
      this.submitToForm.controls.commentCancelled.markAsTouched();
      this.swalTool.RequiredComment();
    }
  }

  GeneralSubmit() {
    if (this.submitToForm.valid) {
      this.SubmitSave();
      this.swalTool.Submit();
    } else {
      this.submitToForm.controls.commentCancelled.markAsTouched();
      this.swalTool.RequiredComment();
    }
  }

  SetButton() {
    this.DisabledSubmit = true;
    setTimeout(() => this.DisabledSubmit = false, 3000);
  }

  Draft() {
    this.SetButton();
    this.SaveDraft.emit(this.page);
    if (this.draft) {
      this.PageSave();
      this.CheckBenefitAmountDraft();
      this.swalTool.Draft();
    }
  }

  SubmitSave() {
    this.SetButton();
    this.PageSave();
    this.submitService.SubmitStageStatus(this.id, this.submitToForm.value).subscribe(() => {
      this.SaveSubmit.emit(this.page);
      this.swalTool.Submit();
    });
  }
}
