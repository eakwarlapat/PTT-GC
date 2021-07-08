import { ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StageService } from '@services/stage/stage.service';
import { InitiativeService } from '@services/initiative/initiative.service';
import { StatusService } from '@services/status/status.service';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})
export class ViewStatusComponent implements OnInit {

  @ViewChild('ViewLogHistoryModal', { static: false }) ViewLogHistoryModal: ModalDirective;
  @ViewChild('HistoryStatus', { static: false }) HistoryStatus: ModalDirective;

  constructor(
    private statusService: StatusService,
    private initiativeService: InitiativeService,
    private stageService: StageService
  ) { }

  @Input() id;

  statusTrackings: any = [];
  historyStatus: any = [];
  stages: any = [];

  history: string;

  IsApprove: boolean;

  ngOnInit(): void {
    this.GetHistoryStatusList(this.id);
    this.GetSuggestStatus(this.id);
    this.GetStatusDetail();
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      const check = { status: response.status, stage: response.stage };
      this.statusService.CheckApproveInformation(check).subscribe((result) => this.IsApprove = result ? true : false);
    });
  }

  GetHistoryStatusList(id) {
    this.stageService.GetHistoryStatusList(id).subscribe(response => {
      this.historyStatus = response;
      this.historyStatus.forEach(result => {
        if (!(this.stages.indexOf(result.stage) !== -1)) {
          this.stages.push(result.stage);
        }
      });
    });
  }

  CheckStage(stage) {
    const stages =
    ['SIL1', 'SIL2', 'SIL3', 'SIL4', 'SIL5',
    'DM', 'VP', 'EVP/MD/SEVP/PSD/COE/CEO',
    'Budget Team', 'BOD', 'App. Request',
    'WBS Request', 'Budget Distribute'];
    return this.stages.indexOf(stage) !== -1;
  }

  GetStatusDetail() {
    this.stageService.GetStatusTracking(this.id).subscribe(response => this.statusTrackings = response);
  }

  ShowViewLogHistory() {
    this.ViewLogHistoryModal.show();
  }

  CloseViewLogHistory() {
    this.ViewLogHistoryModal.hide();
  }

  ShowHistory(id, stage) {
    this.history = stage;
    this.HistoryStatus.show();
  }

  CloseHistoryStatus() {
    this.HistoryStatus.hide();
  }
}
