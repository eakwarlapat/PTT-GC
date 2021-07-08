import { AuthService } from '@services/authentication/auth.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BroadcastService } from '@azure/msal-angular';
import { MsalService } from '@azure/msal-angular';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('profileModal', { static: false }) profileModal: ModalDirective;

  @Input() showOverview: boolean;
  @Input() showDashboard: boolean;

  username: string;

  displayName: string;
  fullName: string;
  mailAccount: string;
  jobTitle: string;
  userPrincipalName: string;

  isExpanded   = false;

  userMsal;

  LoadPage = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  // private subscription: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private msalService: MsalService,
    private broadcastService: BroadcastService
  ) {}

  ngOnInit() {

    this.broadcastService.subscribe('msal:loginFailure', (payload) => {});

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      this.LoadPage = true;
      this.spinner.show();
      setTimeout(() => {
        this.LoadPage = false;
        this.spinner.hide();
      }, 2500);
    });

    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {});

    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => this.msalService.loginRedirect());

    this.getProfile();
  }

  getProfile() {
    this.authService.getMsalUser().subscribe((response) => {
      this.userMsal    = response;
      this.displayName = this.userMsal.displayName;
      this.fullName    = this.userMsal.givenName + ' ' + this.userMsal.surname;
      this.jobTitle    = this.userMsal.jobTitle;
      this.mailAccount = this.userMsal.mail;
      this.userPrincipalName = this.userMsal.userPrincipalName;
    });
  }

  logout() {
    this.msalService.logout();
    this.authService.Logout();
  }

  showChildModal(): void {
    this.profileModal.show();
  }

  hideChildModal(): void {
    this.profileModal.hide();
  }

  onHidden(): void {}

  BudgetSurvey() {
    setTimeout(() => sessionStorage.clear(), 50);
    if (sessionStorage.getItem('page') === 'dim-edit') { window.location.reload(); }
  }

  RequestPool() {
    setTimeout(() => sessionStorage.clear(), 50);
    if (sessionStorage.getItem('page') === 'pool-edit') { window.location.reload(); }
  }
}
