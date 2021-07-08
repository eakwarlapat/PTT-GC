import { StatusService } from '@services/status/status.service';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { InitiativeService } from '@services/initiative/initiative.service';

@Component({
  selector: 'app-form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.css']
})
export class FormTabsComponent implements OnChanges, OnDestroy, OnInit {

  constructor(
    private statusService: StatusService,
    private initiativeService: InitiativeService
  ) { }

  @Input() Required;
  @Input() isMax;

  id: number;
  page: string;

  status: string;
  stage: string;

  Cim: boolean;
  Capex: boolean;
  Strategy: boolean;
  Max: boolean;

  isDisabled = true;
  isRequired = { general: false, detail: false, max: false, impact: false, capex: false, progress: false };

  ApproveCapex: boolean;
  ApproveAdmin: boolean;

  requiredList: any = [];

  get CheckCreate() {
    return (this.page === 'create');
  }

  get CheckCapex() {
    const pages = ['direct-capex', 'capex-information'];
    return ((this.Capex && !this.Max) || pages.indexOf(this.page) !== -1);
  }

  get CheckEdit() {
    const pages = ['edit', 'detail', 'detail-Max', 'impact', 'progress', 'status', 'direct-capex', 'capex-information'];
    return pages.indexOf(this.page) !== -1;
  }

  get CheckDetailCIMStrategy() {
    return ((this.Cim || this.Strategy) && !this.Max) || (this.page === 'detail');
  }

  get CheckDetailMax() {
    return (this.Max) || (this.isMax) || (this.page === 'detail-Max');
  }

  ngOnInit(): void {
    this.id   = Number(sessionStorage.getItem('id'));
    this.page = sessionStorage.getItem('page');
    this.CheckValidate();
    this.CheckPage();
    if (this.id) { this.GetSuggestStatus(this.id); }

    this.ApproveAdmin = (sessionStorage.getItem('tab') === 'true') ? true : false;

    this.Cim       = (sessionStorage.getItem('cim')      === 'true') ? true : false;
    this.Strategy  = (sessionStorage.getItem('capex')    === 'true') ? true : false;
    this.Capex     = (sessionStorage.getItem('strategy') === 'true') ? true : false;
    this.Max       = (sessionStorage.getItem('max')      === 'true') ? true : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isMax) {
      this.Max = changes.isMax.currentValue;
    }
    if (typeof changes.Required !== 'undefined') {
      this.requiredList = changes.Required.currentValue;
      if (this.requiredList.length !== 0) {
        if (this.requiredList.indexOf('general') !== -1) {
          this.isRequired.general = true;
        }
        if (this.requiredList.indexOf('max') !== -1) {
          this.isRequired.max = true;
        }
        if (this.requiredList.indexOf('detail') !== -1) {
          this.isRequired.detail = true;
        }
        if (this.requiredList.indexOf('impact') !== -1) {
          this.isRequired.impact = true;
        }
        if (this.requiredList.indexOf('progress') !== -1) {
          this.isRequired.progress = true;
        }
      }
    }
    this.ApproveAdmin = (sessionStorage.getItem('tab') === 'true')  ? true : false;
    if (!this.ApproveAdmin) { this.GetSuggestStatus(Number(sessionStorage.getItem('id'))); }
  }

  ngOnDestroy() {
    this.Cim          ? sessionStorage.setItem('cim'     , 'true') : sessionStorage.removeItem('cim');
    this.Capex        ? sessionStorage.setItem('capex'   , 'true') : sessionStorage.removeItem('capex');
    this.Strategy     ? sessionStorage.setItem('strategy', 'true') : sessionStorage.removeItem('strategy');
    this.Max          ? sessionStorage.setItem('max'     , 'true') : sessionStorage.removeItem('max');
    this.ApproveAdmin ? sessionStorage.setItem('tab'     , 'true') : sessionStorage.removeItem('tab');
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      this.Cim      = response.cim         ? true : false;
      this.Capex    = response.directCapex ? true : false;
      this.Strategy = response.strategy    ? true : false;
      this.Max      = response.max         ? true : false;

      if (this.Max) { this.Capex = false; }

      const check = { status: response.status, stage: response.stage };
      this.statusService.CheckInitiativeDetail(check).subscribe(result => {
        this.ApproveCapex = this.Capex ? true : false;
        this.ApproveAdmin = result;
      });
    });
  }

  CheckValidate() {
    if (sessionStorage.getItem('InitiativeValidate') === 'false') {
      this.isRequired.general = true;
    }
    if (sessionStorage.getItem('DetailValidate') === 'false') {
      this.isRequired.detail = true;
    }
    if (sessionStorage.getItem('DetailMaxValidate') === 'false') {
      this.isRequired.max = true;
    }
    if (sessionStorage.getItem('ImpactValidate') === 'false') {
      this.isRequired.impact = true;
    }
    if (sessionStorage.getItem('PercentImpact') === 'true') {
      this.isRequired.impact = true;
    }
    if (sessionStorage.getItem('ProgressValidate') === 'false') {
      this.isRequired.progress = true;
    }
  }

  CheckPage() {
    switch (this.page) {
      case 'create':
        this.isDisabled = true;
        break;
      default:
        this.isDisabled = false;
        break;
    }
  }
}
