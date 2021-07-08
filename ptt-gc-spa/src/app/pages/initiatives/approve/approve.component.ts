import { SubmitService } from '@services/submit/submit.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InitiativeService } from '@services/initiative/initiative.service';
import { Router } from '@angular/router';
import { AuthService } from '@services/authentication/auth.service';
import { ActionService } from '@services/action/action.service';
import { ResponseService } from '@errors/response/response.service';
import { SwalTool } from '@tools/swal.tools';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ApproveInitiativeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private actionService: ActionService,
    private authService: AuthService,
    private submitService: SubmitService,
    private initiativeService: InitiativeService,
    private router: Router,
    private response: ResponseService,
    private swalTool: SwalTool
  ) {}

  id: number;
  page: string;
  status: string;
  stage: string;
  username: string;
  updatedBy: string;

  approveForm = this.fb.group({ approver : null });

  submitForm  = this.fb.group({
    status: 'approve',
    remark: null,
    secretProject: null,
    goToStage: '',
    username : null,
    updatedBy: null,
  });

  isApprove: any = false;

  ShowSecret    = false;
  ShowGoToStage = false;

  isCim    = false;
  isCvcMA  = false;
  isDivest = false;

  cvc: any = ['Pre-DD', 'DD', 'Execution'];
  divest: any = ['Seeking', 'DD', 'Execution'];
  cim: any = ['Detail F/S', 'BEP', 'Execution'];

  projects: any = [];

  approver: any = [];

  CancelCondition = false;

  Secret = false;

  DisabledSubmit = false;

  ItDigital = false;

  get invalidSecretProject() {
    return this.submitForm.controls.secretProject.touched && this.submitForm.controls.secretProject.invalid;
  }

  get invalidGoToStage() {
    return this.submitForm.controls.goToStage.touched && this.submitForm.controls.goToStage.invalid;
  }

  get invalidRemark() {
    return this.submitForm.controls.remark.touched && this.submitForm.controls.remark.invalid;
  }

  ngOnInit(): void {
    this.id   = Number(sessionStorage.getItem('id'));
    this.page = sessionStorage.getItem('page');
    this.SetApprove();
  }

  SetApprove() {
    this.initiativeService.GetInitiative(this.id).subscribe(response => {
      this.updatedBy = response.updatedBy;
      const typeOfInvestment = ['CVC', 'M&A', 'Divest'];
      const cvc = ['CVC', 'M&A'];
      if (response.cim || typeOfInvestment.indexOf(response.typeOfInvestment) !== -1 || response.divestment) {
        this.Secret = true;
        this.submitForm.controls.secretProject.setValidators([Validators.required]);
        this.submitForm.controls.secretProject.updateValueAndValidity();
        this.ShowSecret = true;
        if (response.cim) { this.projects = this.cim; }
        if (cvc.indexOf(response.typeOfInvestment) !== -1) { this.projects = this.cvc; }
        if (response.typeOfInvestment === 'Divest' || response.divestment)  { this.projects = this.divest; }
      }
      this.status = response.status;
      this.stage  = response.stage;
      if (this.status === 'wait for cancellation') {
        this.CancelCondition = true;
        this.submitForm.patchValue({ status : 'approve cancellation' });
      }
      this.SetUserApprove();

      if (['IT', 'Digital'].indexOf(response.initiativeType) !== -1) {
        this.ItDigital = true;
      }

    }, error => this.response.error(error));
  }

  SetUserApprove() {
    switch (this.page) {
      case 'overview-approve':
        this.authService.getUser().subscribe((user) => {
          this.actionService.GetInitiativeAction(this.id).subscribe(approver => {
            this.approver = approver;
            this.approveForm.patchValue({ approver : this.approver[0].actionBy});
          });
          this.username = user.username;
          this.submitForm.patchValue({ updatedBy : this.username });
          this.isApprove = true;
        });
        break;
      case 'approve':
        this.authService.getUser().subscribe((user) => {
          this.username = user.username;
          this.submitForm.patchValue({ username  : this.username });
          this.submitForm.patchValue({ updatedBy : this.updatedBy });
          this.CheckApprove();
        });
        break;
    }
  }

  CheckApprove() {
    this.submitService.CheckApprove(this.id, this.username).subscribe(result => this.isApprove = result);
  }

  OnChangeStatus(event) {
    const value = event.target.value;
    switch (value) {
      case 'approve' :
        this.submitForm.controls.remark.clearValidators();
        this.submitForm.controls.remark.updateValueAndValidity();
        break;
      case 'revise' :
        this.submitForm.controls.remark.setValidators([Validators.required]);
        this.submitForm.controls.remark.updateValueAndValidity();
        break;
      case 'reject' :
        this.submitForm.controls.remark.setValidators([Validators.required]);
        this.submitForm.controls.remark.updateValueAndValidity();
        break;
      case 'approve cancellation' :
        this.submitForm.controls.remark.clearValidators();
        this.submitForm.controls.remark.updateValueAndValidity();
        break;
      case 'reject cancellation' :
        this.submitForm.controls.remark.setValidators([Validators.required]);
        this.submitForm.controls.remark.updateValueAndValidity();
        break;
    }
  }

  OnChangeSecret(event) {
    const value = event.target.value;
    switch (value) {
      case 'yes' :
        this.Secret = true;
        this.ShowGoToStage = true;
        this.submitForm.controls.goToStage.setValidators([Validators.required]);
        this.submitForm.controls.goToStage.updateValueAndValidity();
        break;
      case 'no'  :
        this.Secret = false;
        this.ShowGoToStage = false;
        this.submitForm.controls.goToStage.clearValidators();
        this.submitForm.controls.goToStage.updateValueAndValidity();
        break;
    }
  }

  OverviewApprove() {
    this.submitService.ActionSubmit(this.id, this.submitForm.value).subscribe(() => {
      this.swalTool.Approved();
    }, error => this.response.error(error));
  }

  SubmitApprove() {
    this.submitService.CheckApprove(this.id, this.username).subscribe(result => {
      if (result) {
        this.submitService.ActionSubmit(this.id, this.submitForm.value).subscribe(() => {
          this.swalTool.Approved();
        }, error => this.response.error(error));
      } else {
        Swal.fire({
          title: 'This initiative was retreated for revision!',
          html: 'Please refresh your My Tasks and approve this initiative later.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((res) => {
          if (res.value) {
            this.router.navigate(['/initiative/my-tasks']);
          }
        });
      }
    });
  }

  SetButton() {
    this.DisabledSubmit = true;
    setTimeout(() => this.DisabledSubmit = false, 3000);
  }

  OnSubmit() {
    if (this.page === 'overview-approve') { this.submitForm.patchValue({ username : this.approveForm.controls.approver.value }); }
    if (this.Secret) {
      this.submitForm.controls.secretProject.markAsTouched();
      this.submitForm.controls.goToStage.markAsTouched();
    }
    if (this.submitForm.valid) {
      if (this.submitForm.controls.status.value === 'reject') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to reject this initiative!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.value) { this.SubmitApprove(); }
        });
      } else {
        this.SetButton();
        switch (this.page) {
          case 'overview-approve': this.OverviewApprove(); break;
          case 'approve'         : this.SubmitApprove();   break;
        }
      }
    } else {
      this.swalTool.Required();
      this.submitForm.controls.remark.markAsTouched();
    }
  }
}
