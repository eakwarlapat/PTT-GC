import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SwalTool } from '@tools/swal.tools';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Pagination } from '@models/pagination';
import { CustomReportHeader } from '@models/customReportHeader';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.css']
})
export class DashboardListComponent implements OnInit {
  customrReportService: any;

  constructor(private swalTool: SwalTool,
  ) { }

  @Input() dashboardType: string;
  @Input() allHeadersReport: CustomReportHeader[] = [];
  @Output() showModalType = new EventEmitter();
  @Output() getReportByID = new EventEmitter();
  @Output() deleteReportByID = new EventEmitter();
  @Output() OnPageChanged = new EventEmitter();
  @Output() OnPageLengthChanged = new EventEmitter();
  @Input() pagination: Pagination;
  @Output() OnSearchClick = new EventEmitter();
  @Output() OnRefreshData = new EventEmitter();

  length = [10, 25, 50, 100];

  ngOnInit(): void {
  }

  showModal(type: any, reportID: any) {
    //console.log(this.allHeadersReport);
    //console.log(reportID);
    this.showModalType.emit({ 'type': type, 'reportID': reportID });
    //this.getReportByID.emit(reportID);
  }

  DeleteCustomReport(reportID: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this report template ?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.deleteReportByID.emit(reportID);
        this.swalTool.Delete();
      }
    });
    setTimeout(() => {
    }, 1000);


  }


  PageChanged(e: any) {
    this.OnPageChanged.emit(e.page);
  }

  ChangePageLength(e) {
    this.OnPageLengthChanged.emit(e.target.value);
  }

  RefreshDataClick(e) {
    this.OnRefreshData.emit(e);
  }

  SearchClick(searchText: any) {
    this.OnSearchClick.emit(searchText);
  }

}
