import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '@services/authentication/auth.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { BroadcastService } from '@azure/msal-angular';
import { Subscription } from 'rxjs';
import { PermissionService } from '@services/permission/permission.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {


  user;
  register;

  private subscription: Subscription;

  constructor(
    private permissionService: PermissionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private broadcastService: BroadcastService
  ) { }

  showOverview = false;
  showDashboard = false;

  registerForm = this.fb.group({ username: [''], password: [''] });

  loginForm = this.fb.group({ username: [''], password: [''] });

  @HostListener('window:beforeunload') RefreshForm() {
    sessionStorage.removeItem('overview');
    sessionStorage.removeItem('dashboard');
  }

  ngOnInit() {
    this.showOverview = sessionStorage.getItem('overview') === 'true' ? true : null;
    this.showDashboard = sessionStorage.getItem('dashboard') === 'true' ? true : null;

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => this.getUserProfile());
    this.broadcastService.subscribe('msal:loginFailure', (payload) => null);
    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => null);
    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => null);

    if (this.authService.loggedIn()) {
      const username = localStorage.getItem('user');
      this.OverviewPermission(username);
      this.DashboardPermission(username);
    }
  }

  InitialActionForm(): FormGroup {
    return this.fb.group({ id: 0, username: '', role: '', userId: '' });
  }

  getUserProfile() {
    this.authService.getMsalUser().subscribe((response) => {
      this.user = response;
      this.authService.UserExists({ username: this.user.mail }).subscribe((result) => {
        if (result) {
          this.loginForm.patchValue({ username: this.user.mail, password: 'password' });
          this.authService.Login(this.loginForm.value).subscribe(() => {
            if (!this.authService.loggedIn()) {
              this.router.navigate(['']);
            } else {
              this.OverviewPermission(this.user.mail);
              this.DashboardPermission(this.user.mail);
            }
          });
        } else {
          this.registerForm.patchValue({ username: this.user.mail, password: 'password' });
          this.authService.Register(this.registerForm.value).subscribe((user) => {
            this.register = user;
            this.loginForm.patchValue({ username: this.register.username, password: 'password' });
            this.authService.Login(this.loginForm.value).subscribe(() => {
              if (!this.authService.loggedIn()) {
                this.router.navigate(['']);
              } else {
                this.OverviewPermission(this.user.mail);
                this.DashboardPermission(this.user.mail);
              }
            });
          });
        }
      });
    });
  }

  OverviewPermission(Email) {
    this.permissionService.CheckOverviewPermission({ email: Email }).subscribe((result) => {
      if (result) {
        this.showOverview = result;
        sessionStorage.setItem('overview', 'true');
      }
    });
  }

  DashboardPermission(Email) {
    this.permissionService.CheckDashboardPermission({ email: Email }).subscribe((result) => {
      if (result) {
        this.showDashboard = result;
        sessionStorage.setItem('dashboard', 'true');
      }
    });
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
