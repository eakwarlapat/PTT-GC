import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { InitiativeService } from '@services/initiative/initiative.service';
import { StatusService } from '@services/status/status.service';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-information-tabs',
  templateUrl: './information-tabs.component.html',
  styleUrls: ['./information-tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InformationTabsComponent implements OnInit {

  @ViewChild('informationTabs', { static: false }) informationTabs: TabsetComponent;

  constructor(
    private initiativeService: InitiativeService,
    private statusService: StatusService,
  ) { }

  id: number;

  status: string;
  stage: string;

  IsCim      = false;
  IsPim      = false;
  IsDim      = false;
  IsCapex    = false;
  IsMax      = false;
  IsCpi      = false;
  IsRandD    = false;
  IsStrategy = false;
  IsOther    = false;

  DetailName: string;

  get IsCimAndStrategy() {
    return ((this.IsCim === true) || (this.IsStrategy === true)) && !this.IsMax === true;
  }

  get IsMaxAndCapex() {
    return (this.IsMax === true) || (this.IsCapex === true);
  }

  get IsCheckCapex() {
    return (this.IsCapex === true) && (this.IsMax === false);
  }

  ApproveCapex: boolean;
  ApproveAdmin: boolean;

  CheckSubmitTo: boolean;

  value: string;

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    this.GetSuggestStatus();
  }

  CheckInformationTab() {
    switch (sessionStorage.getItem('InformationTab')) {
      case 'General Information' :
        this.informationTabs.tabs[0].active = true;
        break;
      case 'Detail Information (CIM & Strategy)' :
        this.informationTabs.tabs[1].active = true;
        break;
      case 'Detail Information (Max)' :
      case 'Detail Information (Direct CAPEX)' :
        this.informationTabs.tabs[1].active = true;
        break;
      case 'Impact Tracking' :
        this.informationTabs.tabs[2].active = true;
        break;
      case 'Progress' :
        this.informationTabs.tabs[3].active = true;
        break;
      case 'Status' :
        this.informationTabs.tabs[4].active = true;
        break;
      default:
        this.informationTabs.tabs[0].active = true;
        break;
    }
  }

  OnSelect(data: TabDirective): void {
    this.value = data.heading;
    sessionStorage.setItem('InformationTab', this.value);
  }

  CheckSubmit(submit) {
    this.CheckSubmitTo = submit;
  }

  GetSuggestStatus() {
    this.initiativeService.GetSuggestStatus(this.id).subscribe(response => {

      this.status     = response.status;
      this.stage      = response.stage;
      this.IsCim      = response.cim         ? true : false;
      this.IsCapex    = response.directCapex ? true : false;
      this.IsStrategy = response.strategy    ? true : false;
      this.IsMax      = response.max         ? true : false;

      if (this.IsMax) {
        this.DetailName = 'Detail Information (Max)';
        this.IsCapex = false;
      }

      if (this.IsCapex) {
        this.DetailName = 'Detail Information (Direct CAPEX)';
      }

      const check = { status : this.status, stage: this.stage };
      this.statusService.CheckInitiativeDetail(check).subscribe(result => {
        this.ApproveCapex = this.IsCapex ? true : false;
        this.ApproveAdmin = result;
      });

      if (!(['IT', 'Digital'].indexOf(response.initiativeType) !== -1)) {
        setTimeout(() => this.CheckInformationTab(), 10);
      }
    });
  }
}
