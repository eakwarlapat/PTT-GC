import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveService } from '@services/remove/remove.service';
import { UnauthorizedService } from '@errors/unauthorized/unauthorized.service';
import { AuthService } from '@services/authentication/auth.service';
import { KeyValue } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {


  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private remove: RemoveService,
    private router: Router,
    private unauthorized: UnauthorizedService,
    private authService: AuthService,
  ) { }

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  show: boolean = false;

  isNoData: boolean = false;
  baseUrl = environment.apiUrl;  // Base URL
  queryParam = '';  // Get query string URL
  storeName = '';
  gotoId = null;
  gotoPage = null;
  userName = '';
  isApproverLogin: boolean = false;
  public chartJS: any = [];
  // result: Result[] = [];  // result from api
  ss: number[];
  result: Result[] = [];  // result from api
  dataTablez: any = null;
  ngOnInit() {
    this.SetDatatables();
    this.CheckAuth();
    this.CheckNewTabGoto();
  }


  SetDatatables() {
    this.dtOptions = {
      scrollX: true,
      scrollY: "800px",
      paging: false,
      lengthMenu: [[-1], ["All"]],
      autoWidth: true,
      scrollCollapse: true,
      processing: true,      
    };
  }

  showTable() {
    this.show = true;
    setTimeout(() => {
      this.dtTrigger.next();
    });
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  // Order by ascending property value
  valueAscOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value.localeCompare(b.value);
  }

  // Order by descending property key
  keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  CheckAuth() {
    this.authService.getUser().subscribe((user) => {
      this.userName = user.username;
    }, error => this.unauthorized.error(error));
  }

  CheckNewTabGoto() {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['reportid'] || null;
      this.storeName = params['storeName'] || null;
      this.gotoId = params['gotoId'] || null;
      this.gotoPage = params['gotoPage'] || null;

      if (this.gotoId != null && this.gotoPage != null) {
        switch (this.gotoPage) {
          case 'view': {
            this.Information(this.gotoId);
            break;
          }

          case 'approve': {
            this.Approve(this.gotoId);
            break;
          }

          default: {
            this.Information(this.gotoId);
            break;
          }
        }
      } else if (this.queryParam != null && this.storeName != null) {
        this.http.get<Result[]>(this.baseUrl + 'chart/customtable?storeName=' + this.storeName
          + '&reportid=' + this.queryParam).subscribe(r => {
            this.dataTablez = r;
            if (r.length == 0) this.isNoData = true;
            this.showTable();
            //console.log(this.dataTable[0]);
          }, error => {
            console.error(error);
            this.isNoData = true;
          });
      }
    });
  }

  Information(itemId: any) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', itemId.toString());
    this.router.navigate(['/initiative/information']);
  }

  Approve(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/approve']);
  }

  OpenNewTab(id: any, type: any) {
    window.open(window.location.origin + window.location.pathname + '?gotoId=' + id + '&gotoPage=' + type, '_blank');
  }
}

interface RootObject {
  result: Result[];
}
interface Result {
  titleText: string;
  dataLabel: string[];
  datasets: DatasetsChart[];
}
interface DatasetsChart {
  label: string;
  data: number[];
  backgroundColor: string[];
}
