import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { CustomreportService } from '@services/customreport/customreport.service';
import { SwalTool } from '@tools/swal.tools';
import { RouterLink, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '@services/authentication/auth.service';
declare var require: any;
@Component({
  selector: 'app-dashboard-forms',
  templateUrl: './dashboard-forms.component.html',
  styleUrls: ['./dashboard-forms.component.css']
})
export class DashboardFormsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private customrReportService: CustomreportService,
    private swalTool: SwalTool,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
  ) { }

  @Input() typeOpen: string;
  @Input() reportID: any;
  @Output() thisModalClose = new EventEmitter();

  isSaved = false;
  @Input() dataCustomReportMerge: any = null;

  username: any;

  reportTypeToDisabled: any = ['BGSlide', 'NewCapexReport', 'CapexReportByCompany', 'Cash-In'];
  isCapexExcel_Powerpoint: boolean = false;

  systemReportType: any = '';
  isBuiltinReport: boolean = false;

  canRemoveFieldY = false;
  canAddFieldY = true;
  canRemoveParam = false;
  canAddParam = true;
  isSaveAndView = false;
  isSubmitted = false;

  isShowXAxis = true;
  isShowYAxis = true;
  isShowParam = true;

  isPageShowXAxis = true;
  isPageShowYAxis = true;
  isPageShowXAxisLabel = true;
  isPageShowYAxisLabel = true;
  isPageShowStageType = true;
  isPageShowAccumulate = true;
  isPageShowAggregate = true;

  limitYAxis: number = 50;
  limitParam: number = 30;


  headerForm = this.fb.group({
    reportID: this.reportID,
    reportCode: [null],
    reportName: [null, Validators.required],
    graphType: [null, Validators.required],
    description: [null],
    x_AxisLabel: [null, Validators.required],
    y_AxisLabel: [null, Validators.required],
    otherTypeLabel: [null],
    createUser: [null],
    createDate: [null],
    updateUser: [null],
    updateDate: [null],
    stageType: [null, Validators.required],
    isAccumulate: false,
  });

  detailXForm = this.fb.group({
    reportID: { value: this.reportID, hidden: true },
    fieldName: [null, Validators.required],
    aggregateFunction: [null],
    axis: "X",
    sequence: 1,
    colorCode: [null],
  })

  detailYForm = this.fb.array([]);

  paramForm = this.fb.array([]);

  // ddlFieldXList = {
  //   "Stage IL0-IL4": [
  //     "CLevel",
  //     "TargetToIL4_Week"
  //   ],
  //   "Stage IL4-IL5": [
  //     "CLevel",
  //     "TargetToIL5_Week"
  //   ]
  // }

  // ddlFieldYList = {
  //   "Stage IL0-IL4": [
  //     "IL0Benefit_IL0",
  //     "IL1Benefit_IL1",
  //     "IL1Benefit_SIL1",
  //     "IL2Benefit_IL2",
  //     "IL2Benefit_SIL2",
  //     "IL3Benefit_IL3",
  //     "IL3Benefit_SIL3",
  //     "IL4Benefit_IL4",
  //     "IL4Benefit_SIL4",
  //   ],
  //   "Stage IL4-IL5": [
  //     "IL4Benefit_IL4_Converted",
  //     "IL4Benefit_SIL4_Converted",
  //     "IL5Benefit_IL5",
  //     "IL5Benefit_SIL5"
  //   ]
  // }

  ddlAggregateFunction = [
    "",
    "SUM",
    "COUNT",
  ];

  ddlFilterCondition: any = [
    "=",
    "<>",
    "IN",
    "NOT IN",
    ">",
    "<",
    "<=",
    ">=",
  ];

  ddlParamField: any = [];
  ddlStageType: any = [];


  ddlGraphType: any = [];

  ddlXAxis: any = [];

  ddlYAxis: any = [];





  ngOnInit(): void {
    this.GetUser();
    this.spinner.hide();
    this.setForm();
    //console.log(this.typeOpen);
  }

  GetUser() {
    this.authService.getUser().subscribe((user) => {
      this.username = user.username;
    });
  }

  resetForm() {
    this.headerForm.reset();
    this.detailXForm.reset();
    this.detailYForm.reset();
    this.paramForm.reset()
  }


  InitialPageShowElement() {
    this.isPageShowXAxis = true;
    this.isPageShowYAxis = true;
    this.isPageShowXAxisLabel = true;
    this.isPageShowYAxisLabel = true;
    this.isPageShowStageType = true;
    this.isPageShowAccumulate = true;
    this.isPageShowAggregate = true;
  }

  setForm() {
    this.resetForm();

    this.GetReportType();
    this.GetStageType();

    if (this.typeOpen == 'create') {
      this.reportID = null;
      this.ChangeStage();
      this.AddFieldY(); //initial Field Y 1 row      
      this.AddParam(); //initial Param 1 row    
    } else if (this.typeOpen == 'edit') {
      this.GetReport(this.reportID);
    }

  }

  SetEditForm() {
    this.PatchValueHeader();
    this.ChangeStage();
    this.InitialEditForm();
    this.SetValidatorsByFlag();
    this.PatchValueHeader();
    this.PatchValueXAxis();
    this.PatchValueYAxis();
    this.PatchValueParam();

    if (this.isPageShowYAxis == false) {
      this.SetValidatorsByFlag();         //if case no Y Axis , no stage, only param
    }
  }


  InitialEditForm() {
    switch (this.headerForm.value.graphType) {
      case "CustomExcel": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CustomTable": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CapexReportByCompany": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "NewCapexReport": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "BGSlide": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "Cash-In": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "Pie": {
        this.InitialPageShowElement();
        this.isPageShowXAxis = true;
        this.isPageShowXAxisLabel = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "Donut": {
        this.InitialPageShowElement();
        this.isPageShowXAxis = true;
        this.isPageShowXAxisLabel = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "Table": {
        this.isPageShowXAxis = true;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = true;
        this.isPageShowAccumulate = true;
        this.isPageShowAggregate = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "ApproverDashboardExcel": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "ApproverDashboardTable": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXReportGroupByandCompanyType": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXSummaryReportbyCompany": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXProjectApproved": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXAllProjectsSubmittedInPeriod": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXDepreciationForNewProjectReport": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXNewCapexGcGroupByProjectType": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }

      default: {
        this.InitialPageShowElement();
        this.SetValidatorsByFlag();
        //console.log(this.isPageShowXAxisLabel);
        break;
      }
    }

    this.GetAllParam(this.headerForm.value.graphType);

    switch (this.headerForm.value.graphType) {
      case "CapexReportByCompany": {
        this.SetValidatorsByFlag();
      }
      case "NewCapexReport": {
        this.SetValidatorsByFlag();
      }
    }
  }

  PatchValueHeader() {
    if (this.dataCustomReportMerge != null) {
      this.headerForm.patchValue(this.dataCustomReportMerge.reportHeader);
    }
  }

  PatchValueXAxis() {
    if (this.dataCustomReportMerge != null) {
      this.detailXForm.patchValue(this.dataCustomReportMerge.reportDetailX);
    }
  }

  PatchValueYAxis() {
    if (this.dataCustomReportMerge != null) {
      for (let i = 0; i < this.dataCustomReportMerge.reportDetailY.length; i++) {
        this.AddFieldY();
        let control = this.detailYForm as FormArray;
        //console.log(control);
        control.controls[i].patchValue(this.dataCustomReportMerge.reportDetailY[i]);
      }
      if (this.dataCustomReportMerge.reportDetailY.length = 0) {
        this.canRemoveFieldY = false;
        this.canAddFieldY = true;
      }
    }
  }
  PatchValueParam() {
    if (this.dataCustomReportMerge != null) {
      for (let i = 0; i < this.dataCustomReportMerge.reportParam.length; i++) {
        this.AddParam();
        let control = this.paramForm as FormArray;
        control.controls[i].patchValue(this.dataCustomReportMerge.reportParam[i]);
      }
      if (this.dataCustomReportMerge.reportParam.length = 0) {
        this.canRemoveParam = false;
        this.canAddParam = true;
      }
    }
  }

  InitialFieldY(): FormGroup {
    return this.fb.group({
      reportID: this.reportID,
      fieldName: [null, Validators.required],
      aggregateFunction: "SUM",
      axis: "Y",
      sequence: [null],
      colorCode: [null],
    })
  }

  InitialParam(): FormGroup {
    return this.fb.group({
      reportID: this.reportID,
      sequence: [null],
      parameterName: [null],
      parameterField: [null, Validators.required],
      filterCondition: ["=", Validators.required],
      parameterType: [null],
      required: [null],
      defaultValue: [null],
    })
  }

  AddParam() {
    const control = this.paramForm as FormArray;
    control.push(this.InitialParam());
    this.canRemoveParam = control.length > 0 ? true : false;
    this.canAddParam = control.length < this.limitParam ? true : false;
    //console.log(control.length)
  }

  RemoveParam(index: number) {
    //console.log(index);
    const control = this.paramForm as FormArray;
    control.removeAt(index);
    this.detailYForm.markAsDirty();
    this.canRemoveParam = control.length > 0 ? true : false;
    this.canAddParam = control.length < this.limitParam ? true : false;
  }

  AddFieldY() {
    const control = this.detailYForm as FormArray;
    control.push(this.InitialFieldY());
    this.canRemoveFieldY = control.length > 1 ? true : false;
    this.canAddFieldY = control.length < this.limitYAxis ? true : false;
    //console.log(control.length)
  }

  RemoveFieldY(index: number) {
    //console.log(index);
    const control = this.detailYForm as FormArray;
    control.removeAt(index);
    this.detailYForm.markAsDirty();
    this.canRemoveFieldY = control.length > 1 ? true : false;
    this.canAddFieldY = control.length < this.limitYAxis ? true : false;
  }

  ChangeStage() {
    this.GetXAxis(this.headerForm.value.stageType);
    this.GetYAxis(this.headerForm.value.stageType);
  }

  modalClose() {
    this.resetForm();
    this.thisModalClose.emit(this.isSaved);
    this.isSaved = false;
  }

  OnSaveClick() {
    this.isSubmitted = true;
    if (this.headerForm.invalid || this.detailXForm.invalid || this.detailYForm.invalid || this.paramForm.invalid) {
      console.log("header : " + this.headerForm.invalid);
      console.log("detailXForm : " + this.detailXForm.invalid);
      console.log("detailYForm : " + this.detailYForm.invalid);
      console.log("paramForm : " + this.paramForm.invalid);
      return;
    }

    if (this.typeOpen == "create") {
      this.headerForm.patchValue(
        {
          "createUser": this.username,
          "updateUser": this.username,
        });

      this.customrReportService.CreateReport(this.headerForm.value, this.detailXForm.value, this.detailYForm.value, this.paramForm.value).subscribe(
        result => {
          //console.log(result);
          this.isSaved = true;
          this.swalTool.Success();

          this.headerForm.patchValue(result.reportHeader);
          //console.log(result.reportHeader)
          this.typeOpen = "edit"
          if (this.isSaveAndView) {
            this.ViewGraph();
            this.isSaveAndView = false;
          }
          else {
            this.modalClose();
          }
        },
        err => {
          console.log(err);
          this.swalTool.Error("Data was not saved. !");
        });
    }
    else if (this.typeOpen == "edit") {
      this.headerForm.patchValue(
        {
          "updateUser": this.username,
        });

      this.customrReportService.UpdateReport(this.headerForm.value, this.detailXForm.value, this.detailYForm.value, this.paramForm.value).subscribe(
        result => {
          //console.log(result);
          this.isSaved = true;
          this.swalTool.Success();

          this.headerForm.patchValue(result.reportHeader);

          if (this.isSaveAndView) {
            this.ViewGraph();
            this.isSaveAndView = false;
          }
          else {
            this.modalClose();
          }
        },
        err => {
          console.log(err);
          this.swalTool.Error("Data was not saved. !");
        });
    }

  }

  SaveAndView() {
    this.isSaveAndView = true;
    this.OnSaveClick();
  }

  ViewGraph() {

    //window.location.href = 'https://gcinitiative-front-dev.azurewebsites.net/initiative/stacked-chart';
    switch (this.headerForm.value.graphType) {
      case "BarStacked": {
        this.router.navigateByUrl('initiative/stacked-chartjs?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "Pie": {
        this.router.navigateByUrl('initiative/pie-chartjs?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "Donut": {
        this.router.navigateByUrl('initiative/donut-chartjs?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "Bar": {
        this.router.navigateByUrl('initiative/bar-chartjs?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "Line": {
        this.router.navigateByUrl('initiative/line-chartjs?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "Table": {
        this.router.navigateByUrl('initiative/table-chart?reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "ApproverDashboardTable": {
        this.router.navigateByUrl('initiative/custom-table?storeName=sp_ApproverDashboard&reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "CustomTable": {
        this.router.navigateByUrl('initiative/custom-table?storeName=sp_CustomExcel&reportid=' + this.headerForm.value.reportID);
        break;
      }
      case "CustomExcel": {
        this.spinner.show();
        this.customrReportService.GetCustomExcel(this.headerForm.value.reportID).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);
          } else {
            alert('File not found in Blob!');
          }
          this.spinner.hide();
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "ApproverDashboardExcel": {
        this.spinner.show();
        this.customrReportService.GetApproverDashboard(this.headerForm.value.reportID).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);
          } else {
            alert('File not found in Blob!');
          }
          this.spinner.hide();
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "NewCapexReport": {
        this.spinner.show();
        //statements; 
        let storeProcedureName: string = 'sp_NewCapexReport';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CapexReportByCompany": {
        this.spinner.show();
        //statements; 
        let storeProcedureName: string = 'sp_CapexReportbyCompany';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "BGSlide": {
        this.spinner.show();
        //statements; 
        let storeProcedureName: string = 'sp_BGSlide';
        this.customrReportService.GetBGSlide(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.pptx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "Cash-In": {
        this.spinner.show();
        this.customrReportService.GetCashIn(this.headerForm.value.reportID).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXReportGroupByandCompanyType": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_CAPEX_ReportGroupByandCompanyType';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXSummaryReportbyCompany": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_CAPEX_SummaryReportbyCompany';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXProjectApproved": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_CAPEX_ProjectApproved';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXAllProjectsSubmittedInPeriod": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_CAPEX_AllProjectsSubmittedInPeriod';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXDepreciationForNewProjectReport": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_CAPEX_DepreciationForNewProjectReport';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }
      case "CAPEXNewCapexGcGroupByProjectType": {
        this.spinner.show();
        let storeProcedureName: string = 'sp_NewCapexGcGroupByProjectType';
        this.customrReportService.GetCustomExcelCapex(this.headerForm.value.reportID, storeProcedureName).subscribe((r: any) => {
          if (r.type !== 'text/plain') {
            const blob = new Blob([r]);
            const saveAs = require('file-saver');
            const file = this.headerForm.value.reportName + '.xlsx';
            saveAs(blob, file);

            this.spinner.hide();
          } else {
            this.spinner.hide();
            alert('File not found in Blob!');
          }
        },
          error => {
            console.log(error)
            this.spinner.hide();
            //this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            if (error.status == 500) {
              this.swalTool.Error((error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error')
            } else {
              this.swalTool.Error("Download cannot be completed. Reason: High Traffic. Please try again after 10 minutes.")
            }
          });
        break;
      }

      default: {
        //this.swalTool.Error("Graph Type Invalid !.");
        this.router.navigateByUrl('initiative/stacked-chart?reportid=' + this.headerForm.value.reportID);
        break;
      }
    }
  }


  GetReport(id: any) {
    this.customrReportService.GetReport(id).subscribe(
      result => {
        //console.log(result);
        this.dataCustomReportMerge = result;

        this.systemReportType = this.dataCustomReportMerge.reportHeader.systemReportType
        if (this.systemReportType == 'builtin') {
          this.isBuiltinReport = true;
        } else {
          this.isBuiltinReport = false;
        }

        this.SetEditForm();


        // Comment Disabled All Controls
        if (this.reportTypeToDisabled.includes(this.headerForm.controls.graphType.value)) {
          //this.isCapexExcel_Powerpoint = true;
          // ไม่ต้อง disable ปุ่มแล้ว

          //need disabled button ด้วย
          //this.SetAllDisabled();
        } else {
          this.isCapexExcel_Powerpoint = false;
        }

      }
    );
  }


  get HeaderFormValidator() {
    //console.log(this.headerForm.controls);
    return this.headerForm.controls;
  }

  get DetailXFormValidator() {
    return this.detailXForm.controls;
  }

  get DetailYFormValidator() {
    //console.log(this.detailYForm.controls); 
    return this.detailYForm.controls;
  }

  get ParamFormValidator() {
    //console.log(this.paramForm.controls);
    return this.paramForm.controls;
  }


  GetStageType() {
    this.customrReportService.GetStageType().subscribe(r => {
      this.ddlStageType = r;

      //this.headerForm.patchValue({"stageType": null});
      //console.log(this.ddlStageType)
    });
  }

  GetReportType() {
    this.customrReportService.GetReportType().subscribe(r => {
      this.ddlGraphType = r;
      //this.headerForm.patchValue({"graphType": null});
      //console.log(this.ddlGraphType)
    });
  }

  GetXAxis(stageType: any) {
    //console.log(stageType);
    this.isShowXAxis = false;
    this.customrReportService.GetXAxis(stageType).subscribe(r => {
      this.ddlXAxis = r;
      this.isShowXAxis = true;
    });
  }

  GetYAxis(stageType: any) {
    //console.log(stageType);
    this.isShowYAxis = false;
    switch (stageType) {
      case null: {
        //query by report type
        this.customrReportService.GetCustomYAxis(this.headerForm.value.graphType).subscribe(r => {
          this.ddlYAxis = r;
          this.isShowYAxis = true;
        });
        break;
      }
      default: {
        this.customrReportService.GetYAxis(stageType).subscribe(r => {
          this.ddlYAxis = r;
          this.isShowYAxis = true;
          //this.detailXForm.patchValue({"fieldName": null});
        });
        break;
      }
    }

  }

  GetAllParam(reportType: any) {
    this.isShowParam = false;
    this.customrReportService.GetAllParam(reportType).subscribe(r => {
      this.ddlParamField = r;
      this.isShowParam = true;
    });
  }


  ChangeReportType() {
    switch (this.headerForm.value.graphType) {
      case "CustomExcel": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CustomTable": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CapexReportByCompany": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "NewCapexReport": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "BGSlide": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "Cash-In": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "Pie": {
        this.InitialPageShowElement();
        this.isPageShowXAxis = true;
        this.isPageShowXAxisLabel = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "Donut": {
        this.InitialPageShowElement();
        this.isPageShowXAxis = true;
        this.isPageShowXAxisLabel = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "Table": {
        this.isPageShowXAxis = true;
        this.isPageShowYAxis = true;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = true;
        this.isPageShowAccumulate = true;
        this.isPageShowAggregate = true;
        this.SetValidatorsByFlag();
        break;
      }
      case "ApproverDashboardExcel": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "ApproverDashboardTable": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXReportGroupByandCompanyType": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXSummaryReportbyCompany": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXProjectApproved": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXAllProjectsSubmittedInPeriod": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXDepreciationForNewProjectReport": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }
      case "CAPEXNewCapexGcGroupByProjectType": {
        this.isPageShowXAxis = false;
        this.isPageShowYAxis = false;
        this.isPageShowXAxisLabel = false;
        this.isPageShowYAxisLabel = false;
        this.isPageShowStageType = false;
        this.isPageShowAccumulate = false;
        this.isPageShowAggregate = false;
        this.SetValidatorsByFlag();
        break;
      }

      default: {
        this.InitialPageShowElement();
        this.SetValidatorsByFlag();
        //console.log(this.isPageShowXAxisLabel);
        break;
      }
    }

    this.GetYAxis(this.headerForm.value.stageType);
    this.GetAllParam(this.headerForm.value.graphType);
  }

  SetValidatorsByFlag() {
    this.SetValidator(this.headerForm, "x_AxisLabel", this.isPageShowXAxisLabel);
    this.SetValidator(this.headerForm, "y_AxisLabel", this.isPageShowYAxisLabel);
    this.SetValidator(this.headerForm, "stageType", this.isPageShowStageType);
    this.SetValidator(this.detailXForm, "fieldName", this.isPageShowXAxis);

    for (let i = 0; i < this.detailYForm.length; i++) {
      let control = this.detailYForm as FormArray;
      let detailFormGroup = control.controls[i] as FormGroup;
      console.log(detailFormGroup);
      this.SetValidator(detailFormGroup, "fieldName", this.isPageShowYAxis);
      console.log("Y AXIS : " + this.isPageShowYAxis)
    }
  }

  SetValidator(formName: FormGroup, fieldName: string, isRequired: boolean) {

    if (isRequired) {
      formName.controls[fieldName].setValidators(Validators.required)
      formName.controls[fieldName].markAsPristine();
    }
    else {
      formName.controls[fieldName].clearValidators();
      formName.controls[fieldName].reset();
    }

    formName.controls[fieldName].updateValueAndValidity();
  }




  SetAllDisabled() {
    this.headerForm.disable();
    this.detailXForm.disable();

    for (let i = 0; i < this.detailYForm.length; i++) {
      let control = this.detailYForm as FormArray;
      let detailFormGroup = control.controls[i] as FormGroup;
      detailFormGroup.disable();
    }

    for (let i = 0; i < this.paramForm.length; i++) {
      let control = this.paramForm as FormArray;
      let detailFormGroup = control.controls[i] as FormGroup;
      detailFormGroup.disable();
    }
  }

}
