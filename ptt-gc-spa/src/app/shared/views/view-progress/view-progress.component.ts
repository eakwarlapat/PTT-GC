import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProgressService } from '@services/progress/progress.service';
import { DateUtil } from '@utils/date.utils';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { StatusService } from '@services/status/status.service';
import { InitiativeService } from '@services/initiative/initiative.service';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 150 });
}

@Component({
  selector: 'app-view-progress',
  templateUrl: './view-progress.component.html',
  styleUrls: ['./view-progress.component.css'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class ViewProgressComponent implements OnInit {

  @ViewChild('ViewLogHistoryModal', { static: false }) ViewLogHistoryModal: ModalDirective;

  @ViewChild('HistoryStatus', { static: false }) HistoryStatus: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private progressService: ProgressService,
    private statusService: StatusService,
    private initiativeService: InitiativeService,
  ) { }

  @Input() id;

  history: string;
  IsApprove: boolean;

  DetailForm = this.fb.group({ details: this.fb.array([]) });
  Details: any = [];
  planStatus: any = [];

  ngOnInit(): void {
    this.GetProgressDetail();
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

  InitialDetailForm(): FormGroup {
    return this.fb.group({
      id: 0,
      milestone: '',
      keyDeliverable: '',
      start: null,
      planFinish: null,
      actualFinish: null,
      activity: 'Critical',
      initiativeId: this.id
    });
  }

  AddDetail() {
    const control = this.DetailForm.get('details') as FormArray;
    this.planStatus.push(null);
    control.push(this.InitialDetailForm());
  }

  GetProgressDetail() {
    this.progressService.GetProgressAndMilestone(this.id).subscribe(response => {
      this.Details = response.progressDetails;
      if (this.Details.length === 0) {
        this.AddDetail();
        this.DetailForm.disable();
      } else {
        const Controls = this.DetailForm.get('details') as FormArray;
        for (let i = 0; i < this.Details.length; i++) {
          Controls.push(this.InitialDetailForm());
          Controls.at(i).patchValue(this.Details[i]);
          Controls.at(i).disable();
        }
        for (let i = 0; i < Controls.length; i++) {
          const time    = new Date(this.Details[i].planFinish).getTime();
          const timeNow = new Date().getTime();
          const control = this.DetailForm.get('details') as FormArray;
          if (time > 0) {
            if (time < timeNow && !control.at(i).get('actualFinish').value) {
              this.planStatus[i] = 'max';
            } else {
              this.planStatus[i] = 'min';
            }
          }
          Controls.at(i).patchValue({
            start: this.Details[i].start ? this.dateUtil.GetDate(new Date(this.Details[i].start)) : null,
            planFinish: this.Details[i].planFinish ? this.dateUtil.GetDate(new Date(this.Details[i].planFinish)) : null,
            actualFinish: this.Details[i].actualFinish ? this.dateUtil.GetDate(new Date(this.Details[i].actualFinish)) : null,
          });
        }
      }
    });

  }

}
