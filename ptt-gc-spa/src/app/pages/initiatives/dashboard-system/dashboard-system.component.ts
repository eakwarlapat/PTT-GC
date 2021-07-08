import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';
import { Pagination } from '@models/pagination';
import { CustomreportService } from '@services/customreport/customreport.service';
import { SwalTool } from '@tools/swal.tools';
import { NgxSpinnerService } from 'ngx-spinner';
import { PermissionService } from '@services/permission/permission.service';
import { AuthService } from '@services/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-system',
  templateUrl: './dashboard-system.component.html',
  styleUrls: ['./dashboard-system.component.css']
})
export class DashboardSystemComponent implements OnInit {  

  name = 'System Report Overview';
  username: any;
  allHeader: any = [];
  typeOpenModal: string = '';
  customReportMerge: any = null
  reportID: any;
  isModalCanOpen: boolean = false;
  searchText: any = '';
  dashboardType: string = 'builtin';
  @ViewChild('dashboardModal', { static: true }) dashboardModal: ModalDirective;

  pagination: Pagination = {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": null,
    "totalPages": null,
  };

  constructor(
    private customrReportService: CustomreportService,
    private swalTool: SwalTool,
    private spinner: NgxSpinnerService,
    private permissionService: PermissionService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.CheckDashboardPermission();
    this.GetAllReports();
    //console.log(this.allHeader);
  }


  CheckDashboardPermission() {
    this.authService.getUser().subscribe((user) => {
      this.username = user.username;
      this.permissionService.CheckDashboardPermission({ email: user.username }).subscribe((result) => {
        if (!result) { this.router.navigate(['']); }
      });
    });
  }

  ShowModal(arrData: any): void {
    this.typeOpenModal = arrData.type
    this.isModalCanOpen = true;
    //console.log(arrData);
    if (arrData.type == 'create') {
      this.reportID = null;
      this.dashboardModal.show();
    } if (arrData.type == 'edit') {
      this.reportID = arrData.reportID;
      this.dashboardModal.show();
    }
  }

  CloseModal(isSaved: boolean) {
    if (isSaved == true) {
      this.GetAllReports();
    }

    this.dashboardModal.hide();
    this.isModalCanOpen = false;
  }

  GetAllReports() {
    this.customrReportService.GetAllReportsBuiltin(this.pagination.currentPage, this.pagination.itemsPerPage, this.searchText).subscribe(
      result => {
        //console.log(result);
        this.allHeader = result.allReportHeader;
        this.pagination = result.paginationHeader;

      }
    );
  }

  DeleteReport(id: any) {
    this.customrReportService.DeleteReport(id).subscribe(
      result => {
        this.GetAllReports(); //reload all reports
      },
      err => {
      }
    )
  }

  PageChange(page: number) {
    //console.log(page);
    this.pagination.currentPage = page;
    this.GetAllReports();
    //console.log(this.pagination);

  }

  PageLengthChange(pageLength: number) {
    this.InitialPagination();
    this.pagination.itemsPerPage = pageLength;
    this.GetAllReports();
  }

  InitialPagination() {
    this.pagination.currentPage = 1;
  }

  SearchClick(searchText: any) {
    this.InitialPagination();
    this.searchText = searchText;
    this.GetAllReports();

  }

  RefreshDataClick(e) {
    this.InitialPagination();
    this.searchText = "";
    this.GetAllReports();

  }

}
