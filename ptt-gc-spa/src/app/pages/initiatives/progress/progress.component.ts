import { InitiativeService } from '@services/initiative/initiative.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from '@services/progress/progress.service';
import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DateUtil } from '@utils/date.utils';
import { SwalTool } from '@tools/swal.tools';
import { Router } from '@angular/router';

export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 150 });
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class ProgressComponent implements OnInit, OnDestroy {

  constructor(
    private swalTool: SwalTool,
    private router: Router,
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private initiativeService: InitiativeService,
    private progressService: ProgressService
  ) { }

  Cim: boolean;
  Capex: boolean;
  Strategy: boolean;
  Max: boolean;

  name = 'Initiative Progress & Milestone';

  id: number;
  page = 'progress';

  status: string;
  stage: string;
  remark: string;

  bsConfig = { isAnimated: true, dateInputFormat: 'DD/MM/YYYY', showWeekNumbers: false };

  DetailForm = this.fb.group({ details: this.fb.array([]) });

  isDisabledProgress = true;

  planStatus: any = [];

  Details: any = [];

  get invalidSubmit() {
    return this.DetailForm.valid;
  }

  get StageIL5() {
    return this.stage === 'IL5';
  }

  ngOnInit(): void {
    this.id = Number(sessionStorage.getItem('id'));
    sessionStorage.setItem('page', 'progress');
    this.GetSuggestStatus(this.id);
    this.IsProgressDetail();
    this.SetGeneral();
  }

  SetGeneral() {
    if (sessionStorage.getItem('InitiativeValidated') === 'true') {
      sessionStorage.setItem('InitiativeValidate', 'true');
      sessionStorage.setItem('InitiativeActive'  , 'true');
    }
  }

  CheckValidate() {
    if (sessionStorage.getItem('ProgressValidate') === 'false') {
      this.SetMarkAsTouchedDetail();
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem('ProgressValidate'  , this.stage === 'IL5' ? 'true' : JSON.stringify(this.invalidSubmit));
    sessionStorage.setItem('ProgressValidated' , 'true');
    if (this.DetailForm.dirty) {
      this.SetDetailForm();
      sessionStorage.setItem('isProgressDetailForm', 'true');
      sessionStorage.setItem('ProgressDetailForm', JSON.stringify(this.DetailForm.value));
    }
  }

  SetValidateForm() {
    if (this.stage === 'IL2') {
      const control = this.DetailForm.get('details') as FormArray;
      for (let i = 0; i < control.length; i++) {
        control.at(i).get('milestone').setValidators([Validators.required]);
        control.at(i).get('milestone').updateValueAndValidity();
      }
    }
  }

  InvalidMilestone(i) {
    const control = this.DetailForm.get('details') as FormArray;
    return control.at(i).get('milestone').touched && control.at(i).get('milestone').invalid;
  }

  IsProgressDetail() {
    if (sessionStorage.getItem('isProgressDetailForm') === 'true') {
      const ProgressDetail = JSON.parse(sessionStorage.getItem('ProgressDetailForm'));
      if (ProgressDetail.details.length !== 0) {
        const Controls = this.DetailForm.get('details') as FormArray;
        for (let i = 0; i < ProgressDetail.details.length; i++) {
          if (this.stage === 'IL2') {
            Controls.push(this.InitialDetailFormIL2());
          } else {
            Controls.push(this.InitialDetailForm());
          }
          Controls.at(i).patchValue(ProgressDetail.details[i]);
          if (this.stage === 'IL5') { Controls.at(i).disable(); }
        }
        for (let i = 0; i < Controls.length; i++) {
          Controls.at(i).patchValue({
            start : ProgressDetail.details[i].start ?
            this.dateUtil.GetDate(new Date(ProgressDetail.details[i].start)) : null,
            planFinish : ProgressDetail.details[i].planFinish ?
            this.dateUtil.GetDate(new Date(ProgressDetail.details[i].planFinish)) : null,
            actualFinish : ProgressDetail.details[i].actualFinish ?
            this.dateUtil.GetDate(new Date(ProgressDetail.details[i].actualFinish)) : null,
          });
        }
        this.isDisabledProgress = Controls.length > 1 ? false : true;
        this.isDisabledProgress = this.stage === 'IL5' ? true  : false;
      }
      this.CheckValidate();
    }
    if (sessionStorage.getItem('Stage') === 'IL5') {
      this.DetailForm.disable();
    }
  }

  GetSuggestStatus(id) {
    this.initiativeService.GetSuggestStatus(id).subscribe(response => {
      this.status    = response.status;
      this.stage     = response.stage;
      this.remark    = response.remark;
      this.Cim       = response.cim         ? true : false;
      this.Capex     = response.directCapex ? true : false;
      this.Strategy  = response.strategy    ? true : false;
      this.Max       = response.max         ? true : false;
      this.SetValidateForm();
      this.GetProgressAndMilestone(id);

      if (this.stage === 'IL5') {
        this.DetailForm.disable();
      }

    });
  }

  GetProgressAndMilestone(id) {
    this.progressService.GetProgressAndMilestone(id).subscribe(response => {
      this.Details = response.progressDetails;
      if (sessionStorage.getItem('isProgressDetailForm') !== 'true') {
        if (this.Details.length === 0) {
          this.AddDetail();
        } else {
          const Controls = this.DetailForm.get('details') as FormArray;
          for (let i = 0; i < this.Details.length; i++) {
            if (this.stage === 'IL2') {
              Controls.push(this.InitialDetailFormIL2());
            } else {
              Controls.push(this.InitialDetailForm());
            }
            Controls.at(i).patchValue(this.Details[i]);
            if (this.stage === 'IL5') { Controls.at(i).disable(); }
          }
          for (let i = 0; i < Controls.length; i++) {
            Controls.at(i).patchValue({
              start : this.Details[i].start ? this.dateUtil.GetDate(new Date(this.Details[i].start)) : null,
              planFinish : this.Details[i].planFinish ? this.dateUtil.GetDate(new Date(this.Details[i].planFinish)) : null,
              actualFinish : this.Details[i].actualFinish ? this.dateUtil.GetDate(new Date(this.Details[i].actualFinish)) : null,
            });
          }
          this.isDisabledProgress = Controls.length > 1  ? false : true;
          this.isDisabledProgress = this.stage === 'IL5' ? true  : false;
        }
        this.CheckValidate();
      }
    });
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

  InitialDetailFormIL2(): FormGroup {
    return this.fb.group({
      id: 0,
      milestone: ['', Validators.required],
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
    if (this.stage === 'IL2') {
      control.push(this.InitialDetailFormIL2());
    } else {
      control.push(this.InitialDetailForm());
    }
    this.planStatus.push(null);
    this.isDisabledProgress = control.length > 1 ? false : true;
  }

  RemoveDetail(index: number) {
    const control = this.DetailForm.get('details') as FormArray;
    control.removeAt(index);
    this.planStatus.splice(index, 1);
    this.isDisabledProgress = control.length > 1 ? false : true;
  }

  ChangePlanDate(i, value: Date): void {
    const time    = new Date(value).getTime();
    const timeNow = new Date().getTime();
    const control = this.DetailForm.get('details') as FormArray;
    if (time > 0) {
      if (time < timeNow && !control.at(i).get('actualFinish').value) {
        this.planStatus[i] = 'max';
      } else {
        this.planStatus[i] = 'min';
      }
    }
  }

  ChangeActual(i) {
    const control = this.DetailForm.get('details') as FormArray;
    const time    = new Date(control.at(i).get('planFinish').value).getTime();
    const timeNow = new Date().getTime();
    if (time > 0) {
      if (time < timeNow && !control.at(i).get('actualFinish').value) {
        this.planStatus[i] = 'max';
      } else {
        this.planStatus[i] = 'min';
      }
    }
  }

  SetDetailForm() {
    const DetailControl = this.DetailForm.get('details') as FormArray;
    for (let i = 0; i < DetailControl.length; i++) {
      if (DetailControl.at(i).get('id').value === 0) {

        const startDate        = DetailControl.at(i).get('start').value;
        const planFinishDate   = DetailControl.at(i).get('planFinish').value;
        const actualFinishDate = DetailControl.at(i).get('actualFinish').value;

        if (startDate) {
          if (startDate.length) {
            const DateStartArray = startDate.split('/');
            const DateStart = DateStartArray[2] + '-' + DateStartArray[1] + '-' + DateStartArray[0];
            DetailControl.at(i).get('start').patchValue(DateStart);
          }
        } else {
          if (DetailControl.at(i).get('actualFinish').value) {
            const actualFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('actualFinish').value));
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          } else {
            const actualFinish = null;
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          }
        }

        if (planFinishDate) {
          if (planFinishDate.length) {
            const DatePlanArray = planFinishDate.split('/');
            const DatePlan      = DatePlanArray[2] + '-' + DatePlanArray[1] + '-' + DatePlanArray[0];
            DetailControl.at(i).get('planFinish').patchValue(DatePlan);
          }
        } else {
          if (DetailControl.at(i).get('planFinish').value) {
            const planFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('planFinish').value));
            DetailControl.at(i).get('planFinish').patchValue(planFinish);
          } else {
            const planFinish = null;
            DetailControl.at(i).get('planFinish').patchValue(planFinish);
          }
        }

        if (actualFinishDate) {
          if (actualFinishDate.length) {
            const DateActualArray = actualFinishDate.split('/');
            const DateActual      = DateActualArray[2] + '-' + DateActualArray[1] + '-' + DateActualArray[0];
            DetailControl.at(i).get('actualFinish').patchValue(DateActual);
          }
        } else {
          if (DetailControl.at(i).get('actualFinish').value) {
            const actualFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('actualFinish').value));
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          } else {
            const actualFinish = null;
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          }
        }

      } else {
        DetailControl.at(i).get('id').patchValue(0);

        const startDate        = DetailControl.at(i).get('start').value;
        const planFinishDate   = DetailControl.at(i).get('planFinish').value;
        const actualFinishDate = DetailControl.at(i).get('actualFinish').value;

        if (startDate) {
          if (startDate.length) {
            const DateStartArray = startDate.split('/');
            const DateStart = DateStartArray[2] + '-' + DateStartArray[1] + '-' + DateStartArray[0];
            DetailControl.at(i).get('start').patchValue(DateStart);
          }
        } else {
          if (DetailControl.at(i).get('actualFinish').value) {
            const actualFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('actualFinish').value));
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          } else {
            const actualFinish = null;
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          }
        }

        if (planFinishDate) {
          if (planFinishDate.length) {
            const DatePlanArray = planFinishDate.split('/');
            const DatePlan      = DatePlanArray[2] + '-' + DatePlanArray[1] + '-' + DatePlanArray[0];
            DetailControl.at(i).get('planFinish').patchValue(DatePlan);
          }
        } else {
          if (DetailControl.at(i).get('planFinish').value) {
            const planFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('planFinish').value));
            DetailControl.at(i).get('planFinish').patchValue(planFinish);
          } else {
            const planFinish = null;
            DetailControl.at(i).get('planFinish').patchValue(planFinish);
          }
        }

        if (actualFinishDate) {
          if (actualFinishDate.length) {
            const DateActualArray = actualFinishDate.split('/');
            const DateActual      = DateActualArray[2] + '-' + DateActualArray[1] + '-' + DateActualArray[0];
            DetailControl.at(i).get('actualFinish').patchValue(DateActual);
          }
        } else {
          if (DetailControl.at(i).get('actualFinish').value) {
            const actualFinish = this.dateUtil.SetDate(new Date(DetailControl.at(i).get('actualFinish').value));
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          } else {
            const actualFinish = null;
            DetailControl.at(i).get('actualFinish').patchValue(actualFinish);
          }
        }
      }
    }
  }

  Save(type) {
    this.SetDetailForm();
    this.progressService.CreateProgressDetail(this.id, this.DetailForm.value).subscribe((result) => {
      const DetailControl = this.DetailForm.get('details') as FormArray;
      for (let i = 0; i < DetailControl.length; i++) {
        DetailControl.at(i).patchValue({
          start: DetailControl.at(i).get('start').value ?
            this.dateUtil.GetDate(new Date(DetailControl.at(i).get('start').value)) : null,
          planFinish: DetailControl.at(i).get('planFinish').value ?
            this.dateUtil.GetDate(new Date(DetailControl.at(i).get('planFinish').value)) : null,
          actualFinish: DetailControl.at(i).get('actualFinish').value ?
            this.dateUtil.GetDate(new Date(DetailControl.at(i).get('actualFinish').value)) : null,
        });
      }
    });
  }

  Draft(page) {
    if (page === 'progress') { this.Save('draft'); }
  }

  SetMarkAsTouchedDetail() {
    setTimeout(() => {
      const control = this.DetailForm.get('details') as FormArray;
      for (let i = 0; i < control.length; i++) {
        control.at(i).get('milestone').markAsTouched();
      }
    }, 100);
  }

  Submit(page) {
    if (page === 'progress') {
      this.SetMarkAsTouchedDetail();
      this.SetValidateForm();
      if (this.DetailForm.valid) {
        this.Save('submit');
      } else {
        this.swalTool.Required();
      }
    }
  }
}
