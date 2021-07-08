import { RemoveService } from '@services/remove/remove.service';
import { Component, OnChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalTool } from '@tools/swal.tools';
import { Pagination } from '@models/pagination';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { StatusService } from '@services/status/status.service';
import { CapexService } from '@services/capex/capex.service';
import { PermissionService } from '@services/permission/permission.service';

@Component({
  selector: 'app-initiative-list',
  templateUrl: './initiative-list.component.html',
  styleUrls: ['./initiative-list.component.css']
})
export class InitiativeListComponent implements OnInit, OnChanges {

  constructor(
    private remove: RemoveService,
    private swalTool: SwalTool,
    private router: Router,
    private fb: FormBuilder,
    private capexService: CapexService,
    public permissionService: PermissionService,
  ) { }



  @Input() name: string;

  @Input() text: string;

  @Input() IsRefresh: boolean;

  @Input() progress: boolean;
  @Input() complete: boolean;
  @Input() cancel: boolean;

  @Input() pagination: Pagination;

  @Input() initiatives: [];

  @Input() advanced;

  @Output() sortByColumn = new EventEmitter();
  @Output() deleteInitiative = new EventEmitter();
  @Output() OnPageChanged = new EventEmitter();

  maxSize = 10;

  isDelete = false;

  sortFrom = this.fb.group({
    column: null,
    orderBy: null,
    username: null,
    text: null,
    id: '',
    name: '',
    status: '',
    type: '',
    ownerName: null,
    organization: null,
    plant: null,
    typeOfInvestment: null,
    registerDateSince: null,
    registerDateTo: null,
    progress: [true],
    complete: [true],
    cancel: [true],
  });

  sortId = 'asc';
  sortName = 'asc';
  sortOwner = 'asc';
  sortAssign = 'asc';
  sortRegister = 'asc';
  sortOrganization = 'asc';
  sortType = 'asc';
  sortStatus = 'asc';

  ReqType: any;

  currentPage = 1;

  ngOnInit() {
    switch (this.name) { case 'Overview': this.SetCurrentPage(); break; }
  }

  ngOnChanges(): void {
    if (this.advanced) { this.sortFrom.patchValue(this.advanced); }
    this.text = this.text ? this.text : null;
    if (this.IsRefresh) { this.PatchSort(); }
  }

  SetCurrentPage() {
    if (sessionStorage.getItem('CurrentPageOverview')) {
      this.currentPage = Number(sessionStorage.getItem('CurrentPageOverview'));
    }
  }

  PatchSort() {
    this.sortFrom.patchValue({
      id: '',
      name: '',
      status: '',
      type: '',
      ownerName: null,
      organization: null,
      plant: null,
      typeOfInvestment: null,
      registerDateSince: null,
      registerDateTo: null,
    });
  }

  SortBy(column) {
    switch (column) {
      case 'id':
        this.sortId = this.sortId === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'id', orderBy: this.sortId });
        break;
      case 'name':
        this.sortName = this.sortName === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'name', orderBy: this.sortName });
        break;
      case 'owner':
        this.sortOwner = this.sortOwner === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'owner', orderBy: this.sortOwner });
        break;
      // case 'assign':
      //   this.sortAssign = this.sortAssign === 'asc' ? 'desc' : 'asc';
      //   this.sortFrom.patchValue({ column: 'assign', orderBy: this.sortAssign });
      //   break;
      case 'register':
        this.sortRegister = this.sortRegister === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'register', orderBy: this.sortRegister });
        break;
      case 'organization':
        this.sortOrganization = this.sortOrganization === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'organization', orderBy: this.sortOrganization });
        break;
      case 'type':
        this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'type', orderBy: this.sortType });
        break;
      case 'status':
        this.sortStatus = this.sortStatus === 'asc' ? 'desc' : 'asc';
        this.sortFrom.patchValue({ column: 'status', orderBy: this.sortStatus });
        break;
    }
    this.sortFrom.patchValue({ progress: this.progress, complete: this.complete, cancel: this.cancel });

    if (this.text) {
      this.PatchSort();
      this.sortFrom.patchValue({ text: this.text });
      this.sortByColumn.emit(this.sortFrom.value);
    } else {
      this.sortFrom.patchValue({ text: null });
      this.sortByColumn.emit(this.sortFrom.value);
    }
  }

  DefaultInitiative(status, id) {
    switch (this.name) {
      case 'My Tasks':
        switch (status) {
          case 'admin check':
          case 'wait for cancellation':
            this.router.navigate(['/initiative/approve']);
            break;
          case 'wait for submission':
          case 'revise':
          case 'revised':
          case 'add more':
            this.router.navigate(['/initiative/edit']);
            break;
          case 'add more pool':
            this.router.navigate(['/initiative/addmore-pool']);
            break;
        }
        break;
      case 'My Own Initiative':
        switch (status) {
          case 'draft':
          case 'wait for submission':
          case 'revise':
          case 'revised':
          case 'approved':
            this.router.navigate(['/initiative/edit']);
            break;
          case 'add more':
            this.router.navigate(['/initiative/addmore']);
            break;
          case 'add more pool':
            this.router.navigate(['/initiative/addmore-pool']);
            break;
          case 'admin check':
          case 'reject':
          case 'rejected':
          case 'cancelled':
          case 'wait for cancellation':
            this.router.navigate(['/initiative/information']);
            break;
          case 'finish':
            // this.router.navigate(['/initiative/addmore']);
            break;
        }
        break;
      case 'OverView':
        switch (status) {
          case 'draft':
          case 'admin check':
          case 'wait for submission':
          case 'revise':
          case 'reject':
          case 'wait for approval':
          case 'rejected':
          case 'cancelled':
          case 'approved':
          case 'finish':
          case 'wait for cancellation':
            this.router.navigate(['/initiative/information']);
        }
        break;
    }
  }

  ClearFormSetId(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
  }

  ActionInitiative(status, id, type) {
    if (!this.isDelete) {
      this.ClearFormSetId(id);
      switch (type) {
        case 'IT':
        case 'Digital':
          switch (sessionStorage.getItem('page')) {
            case 'overview': sessionStorage.setItem('page', 'dim-view'); break;
            case 'myown': sessionStorage.setItem('page', 'dim-edit'); break;
          }
          this.router.navigate(['/initiative/dim']);
          break;
        // case 'Request Pool' :
        //   switch (sessionStorage.getItem('page')) {
        //     case 'overview' : sessionStorage.setItem('page', 'pool-view'); break;
        //     case 'myown'    : sessionStorage.setItem('page', 'pool-edit'); break;
        //   }
        //   this.router.navigate(['/initiative/pool']);
        //   break;
        default:
          this.DefaultInitiative(status, id);
          break;
      }
    }
  }

  CheckOverView(status) {
    const statuses = [
      'draft', 'admin check', 'wait for submission', 'revise', 'reject', 'add more', 'add more pool',
      'wait for approval', 'rejected', 'revised', 'cancelled', 'approved',
      'finish', 'wait for review', 'wait for create App.', 'wait for create WBS', 'wait for cancellation', 'principle approved'
    ];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckViewMyOwn(status) {
    const statuses =
      ['admin check', 'reject', 'wait for approval', 'rejected', 'cancelled', 'finish',
        'wait for review', 'wait for create App.', 'wait for create WBS', 'wait for cancellation', 'principle approved'];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckAddmore(status) {
    const statuses = ['finish'];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckActionMyOwn(status) {
    const statuses = ['draft', 'wait for submission', 'revise', 'revised', 'approved', 'add more', 'add more pool', ''];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckFinishMyOwn(status, initiativeType) {
    // return Status == 'finish' || InitiativeType == 'directCapex';
    return status === 'wait for approval' && initiativeType === 'directCapex';
  }

  CheckPool(status, initiativeType) {
    return status === 'wait for approval' && initiativeType === 'Request Pool';
  }

  CheckApproveMyTask(status) {
    const statuses = [
      'admin check', 'wait for approval', 'wait for review',
      'wait for create App.', 'wait for create WBS', 'wait for cancellation'];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckActionMyTask(status) {
    const statuses = ['draft', 'wait for submission', 'revise', 'revised', 'approved', ''];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  DeleteInitiative(id, type, stage, status) {
    if (!stage && status === 'draft') {
      this.isDelete = true;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this initiative?!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.value) {
          this.deleteInitiative.emit(id);
          this.swalTool.DeleteInitiative();
          this.isDelete = false;
        } else {
          this.isDelete = false;
        }
      });
    } else {
      this.ClearFormSetId(id);
      switch (type) {
        case 'IT':
        case 'Digital':
          sessionStorage.setItem('page', 'dim-edit');
          this.router.navigate(['/initiative/dim']);
          break;
        case 'Request Pool':
          sessionStorage.setItem('page', 'pool-edit');
          this.router.navigate(['/initiative/pool']);
          break;
        default:
          sessionStorage.setItem('cancel', 'true');
          this.router.navigate(['/initiative/edit']);
          break;
      }
    }
  }

  PageChanged(e) {
    switch (this.name) { case 'Overview': sessionStorage.setItem('CurrentPageOverview', e.page.toString()); break; }
    this.OnPageChanged.emit(e.page);
  }

  Edit(id, type) {
    this.ClearFormSetId(id);
    switch (type) {
      case 'IT':
      case 'Digital':
        sessionStorage.setItem('page', 'dim-edit');
        this.router.navigate(['/initiative/dim']);
        break;
      case 'Request Pool':
        sessionStorage.setItem('page', 'pool-edit');
        this.router.navigate(['/initiative/pool']);
        break;
      default:
        this.router.navigate(['/initiative/edit']);
        break;
    }

    let ST = '';

    if (type === 'directCapex') {

      this.capexService.GetCapexsInfo(id, 'Createnew').subscribe(result => {

        ST = result.capexType;

        if (ST === 'Createnew') {

          switch (type) {
            case 'IT':
            case 'Digital':
              sessionStorage.setItem('page', 'dim-edit');
              this.router.navigate(['/initiative/dim']);
              break;
            case 'Request Pool':
              sessionStorage.setItem('page', 'pool-edit');
              this.router.navigate(['/initiative/pool']);
              break;
            default:
              this.router.navigate(['/initiative/edit']);
              break;
          }
        } else {
          this.router.navigate(['/initiative/addmore']);
        }
      });
    } else if (type === 'Request Pool') {
      this.capexService.GetCapexsInfo(id, 'Requestpool').subscribe(result => {
        ST = result.capexType;

        if (ST !== 'Addmorepool') {
          switch (type) {
            case 'IT':
            case 'Digital':
              sessionStorage.setItem('page', 'dim-edit');
              this.router.navigate(['/initiative/dim']);
              break;
            case 'Request Pool':
              sessionStorage.setItem('page', 'pool-edit');
              this.router.navigate(['/initiative/pool']);
              break;
            default:
              this.router.navigate(['/initiative/edit']);
              break;
          }
        } else {
          this.router.navigate(['/initiative/addmore-pool']);
        }

      });
    } else {
      switch (type) {
        case 'IT':
        case 'Digital':
          sessionStorage.setItem('page', 'dim-edit');
          this.router.navigate(['/initiative/dim']);
          break;
        case 'Requestpool':
          sessionStorage.setItem('page', 'pool-edit');
          this.router.navigate(['/initiative/pool']);
          break;
        default:
          this.router.navigate(['/initiative/edit']);
          break;
      }
    }
  }

  Approve(id) {
    this.ClearFormSetId(id);
    sessionStorage.setItem('page', 'approve');
    this.router.navigate(['/initiative/approve']);
  }

  ApproveOverview(id) {
    this.ClearFormSetId(id);
    sessionStorage.setItem('page', 'overview-approve');
    this.router.navigate(['/initiative/approve']);
  }

  CheckApproveOverview(status) {
    const statuses = ['wait for approval'];
    return statuses.indexOf(status) !== -1 ? true : false;
  }

  CheckInitiativeType(type) {
    const initiativeType = ['IT', 'Digital', 'Request Pool'];
    return initiativeType.indexOf(type) !== -1 ? true : false;
  }

  Information(id, type) {
    this.ClearFormSetId(id);
    switch (type) {
      case 'IT':
      case 'Digital':
        sessionStorage.setItem('page', 'dim-view');
        this.router.navigate(['/initiative/dim']);
        break;
      // case 'Request Pool':
      //   sessionStorage.setItem('page', 'pool-view');
      //   this.router.navigate(['/initiative/pool']);
      //   break;
      default:
        this.router.navigate(['/initiative/information']);
        break;
    }
  }

  Addmore(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/addmore']);
  }

  AddmorePool(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/addmore-pool']);
  }

  Return(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/return']);
  }

  carried(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/carried']);
  }
}
