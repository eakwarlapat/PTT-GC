import { InitiativeService } from '@services/initiative/initiative.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ResponseService } from '@errors/response/response.service';
import { Pagination, PaginatedResult } from '@models/pagination';
import { InitiativeList  } from '@models/initiativeList';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveService } from '@services/remove/remove.service';
import { AuthService } from '@services/authentication/auth.service';
import { PermissionService } from '@services/permission/permission.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewInitiativeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private remove: RemoveService,
    private permissionService: PermissionService,
    private initiativeService: InitiativeService,
    private spinner: NgxSpinnerService,
    private response: ResponseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  @ViewChild('searchModal', { static: false }) searchModal: ModalDirective;

  name = 'Overview';

  initiatives: InitiativeList[];
  pagination: Pagination;
  params: any = {};

  currentPage  = 1;

  isLoading    = false;
  isRefresh    = false;

  advanced: object;

  ngOnInit() {
    this.CheckOverviewPermission();
    this.remove.Form();
    this.remove.Validate();
    this.remove.Suggestion();
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('box');
    sessionStorage.removeItem('tab');
    sessionStorage.removeItem('InformationTab');
    sessionStorage.removeItem('cancel');
    sessionStorage.removeItem('ActivePage');
    sessionStorage.setItem('page', 'overview');
    this.isLoading = true;
    this.spinner.show();
    this.route.data.subscribe(data => {
      this.initiatives = data.initiatives.result;
      this.pagination  = data.initiatives.pagination;
      this.spinner.hide();
      this.isLoading = false;
      this.params.page     = 'overview';
      this.params.progress = true;
      this.params.complete = true;
      this.params.cancel   = true;
      this.params.text     = '';
      this.params.username = '';
      this.params.column   = '';
      this.params.orderBy  = '';
      this.PatchAdvanced();
    });
  }

  CheckOverviewPermission() {
    this.authService.getUser().subscribe((user) => {
      this.permissionService.CheckOverviewPermission({ email : user.username }).subscribe((result) => {
        if (!result) { this.router.navigate(['']); }
      });
    });
  }

  PatchAdvanced() {
    this.params.id                = '';
    this.params.name              = '';
    this.params.status            = '';
    this.params.type              = '';
    this.params.ownerName         = '';
    this.params.organization      = '';
    this.params.plant             = '';
    this.params.typeOfInvestment  = '';
    this.params.registerDateSince = '';
    this.params.registerDateTo    = '';
  }

  PageChanged(page) {
    this.pagination.currentPage = page;
    this.GetInitiatives();
  }

  ShowModal(status): void {
    this.params.progress = status.progress;
    this.params.complete = status.complete;
    this.params.cancel   = status.cancel;
    this.searchModal.show();
  }

  HideModal(): void {
    this.searchModal.hide();
  }

  AdvancedSearch(advanced) {
    this.params.text              = '';
    this.params.id                = advanced.id;
    this.params.name              = advanced.name;
    this.params.status            = advanced.status;
    this.params.type              = advanced.type              ? advanced.type : '';
    this.params.ownerName         = advanced.ownerName         ? advanced.ownerName : '';
    this.params.organization      = advanced.organization      ? advanced.organization : '';
    this.params.plant             = advanced.plant             ? advanced.plant : '';
    this.params.typeOfInvestment  = advanced.typeOfInvestment  ? advanced.typeOfInvestment : '';
    this.params.registerDateSince = advanced.registerDateSince ? advanced.registerDateSince : '';
    this.params.registerDateTo    = advanced.registerDateTo    ? advanced.registerDateTo : '';
    this.GetInitiatives();
    this.searchModal.hide();
    this.pagination.currentPage = 1;
  }

  Search(searchForm) {
    if (searchForm.text) {
      this.params.text = searchForm.text;
      this.GetInitiatives();
    } else {
      this.params.text = '';
      this.GetInitiatives();
    }
    this.pagination.currentPage = 1;
  }

  ChangePageLength(itemsPerPage) {
    this.pagination.itemsPerPage = Number(itemsPerPage);
    this.GetInitiatives();
    this.pagination.currentPage = 1;
  }

  OnChangeStatus(typeStatus) {
    this.params.progress = typeStatus.progress;
    this.params.complete = typeStatus.complete;
    this.params.cancel   = typeStatus.cancel;
    this.params.text     = typeStatus.text;
    this.GetInitiatives();
    this.pagination.currentPage = 1;
  }

  Refresh() {
    this.params.text = '';
    this.isRefresh   = true;
    this.PatchAdvanced();
    this.GetInitiatives();
  }

  SortBy(sortFrom) {
    this.params.column  = sortFrom.column;
    this.params.orderBy = sortFrom.orderBy;
    this.params.text    = this.params.text ?  this.params.text : '';
    this.GetInitiatives();
  }

  GetInitiatives() {
    this.initiativeService.GetInitiatives(this.pagination.currentPage, this.pagination.itemsPerPage, this.params).subscribe(
      (res: PaginatedResult<InitiativeList[]>) => {
        this.initiatives = res.result;
        this.pagination  = res.pagination;
        this.isRefresh = false;
    });
  }

  DeleteInitiative(id) {
    this.initiativeService.DeleteInitiative(id).subscribe(() => {
      this.GetInitiatives();
    }, error => this.response.error(error));
  }
}
