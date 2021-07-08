import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SwalTool {

  constructor(private router: Router) { }

  SetTimeSubmit = 1500;
  SetTimeSuggestion = 1400;

  Submit() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Submit Successfully',
      showConfirmButton: false,
      timer: this.SetTimeSubmit
    });
    setTimeout(() => this.router.navigate(['/initiative/my-own']), 2000);
  }

  Approved() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Submit Successfully',
      showConfirmButton: false,
      timer: this.SetTimeSubmit
    });
    setTimeout(() => this.router.navigate(['/initiative/my-tasks']), 1500);
  }

  Draft() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Draft Successfully',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  Impact() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Next Impact Tracking',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  DetailCimStrategy() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Next Detail Information (Cim) & (Strategy)',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  DetailMax() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Next Detail Information (Max)',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  DetailDirect() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Next Detail Information (Direct CAPEX)',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  Success() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      html: 'Saved Successfully',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  Copied() {
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      html: 'Copy Successfully',
      showConfirmButton: false,
      timer: this.SetTimeSubmit,
      allowOutsideClick: false
    });
  }

  Delete() {
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      html: 'Your file has been deleted.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  DeleteInitiative() {
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      html: 'Your has been deleted.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  NoCase() {
    setTimeout(() => {
      Swal.fire({ icon: 'error', title: 'The criteria are not met', text: 'not recommended to invest' });
    }, this.SetTimeSuggestion);
  }

  Error(message) {
    setTimeout(() => {
      Swal.fire({ icon: 'error', title: 'Error!', text: message , footer: 'Please Contact Admin' });
    }, 1500);
  }

  Required() {
    Swal.fire({ icon: 'error', title: 'Required!', text: 'Please fill out all require fields.' });
  }

  RequiredComment() {
    Swal.fire({ icon: 'error', title: 'Required!', text: 'Please fill out all require comment.' });
  }

  RequiredTab(tab) {
    Swal.fire({ icon: 'error', title: 'Required!', html: 'Please fill out all require <p class="text-danger">' + tab + '</p>'});
  }

  FileNotFound() {
    Swal.fire({ icon: 'error', title: 'NotFound!', text: 'File not found in Blob.' });
  }

  InitiativeNotFound() {
    Swal.fire({ icon: 'error', title: 'Initiative NotFound!', text: 'Please save initiative before upload file.' });
  }


  SendMail() {
    setTimeout(() => {
      Swal.fire({ icon: 'info', title: 'Info', text: 'Send Email Success' });
    }, this.SetTimeSuggestion);
  }

  WaitingDev() {
    Swal.fire({ icon: 'info', title: 'Info', text: 'Waiting Developing' });
  }

  Message(text) {
    Swal.fire('Oops...!', text, 'error');
  }

  SumPercent() {
    Swal.fire('Oops...!', 'Percent is Over 100%', 'error');
  }

  UnderPercent() {
    Swal.fire('Oops...!', 'Percent is Under 100%', 'error');
  }

  UnderPercentImpact() {
    Swal.fire({
      title: 'Oops...!',
      icon: 'error',
      html: 'Percent is Under 100% <br><br> <p class="text-danger"> Impact Tracking Tab </p>',
      showCloseButton: true,
    });
  }

  DateValid() {
    Swal.fire('Finish Date is invalid!', 'Finish Date must not less than Starting Date', 'error');
  }

  DateTargetIL3() {
    Swal.fire('Target IL3 is invalid!', 'Target IL3 Date must less than target IL4 Date', 'error');
  }

  DateTargetIL5() {
    Swal.fire('Target IL5 is invalid!', 'Target IL5 Date must later than target IL4 Date', 'error');
  }

  SelectProcess() {
    Swal.fire('Required!', 'Please Select Process', 'error');
  }

  RequiredProduct() {
    Swal.fire('Can\'t Save Product', 'Product Name is required ', 'error');
  }

  DateBudgetStart() {
    Swal.fire('Please choose again.', 'Date must be between Starting Date And Project Commercial Run ', 'error');
  }

  SumCost() {
    Swal.fire('Oops...!', 'Annual Investment is Over Project Cost (MTHB)', 'error');
  }

  SumCostMonth() {
    Swal.fire('Oops...!', 'Monthly Investment Plan is Over Annual Investment Plan', 'error');
  }

  AlertAnnualInvestment() {
    Swal.fire('Oops...!', 'Please Add Annual Investment Plan', 'error');
  }

  SumCost_2() {
    Swal.fire('Oops...!', 'Annual Investment is Less than Project Cost (MTHB)', 'error');
  }

  SumCostMonth_2() {
    Swal.fire('Oops...!', 'Monthly Investment Plan is Less than Annual Investment Plan', 'error');
  }

  CannotSave() {
    Swal.fire('Oops...!', 'Cannot Save Data', 'error');
  }

  TotalAdd_Alert() {
    Swal.fire('Oops...!', 'Annual Total Additional is More than Additional Cost (MTHB)', 'error');
  }
}
