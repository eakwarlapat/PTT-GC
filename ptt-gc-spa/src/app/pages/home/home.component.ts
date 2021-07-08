import { HomeService } from '@services/home/home.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/authentication/auth.service';
import { BroadcastService } from '@azure/msal-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading = false;

  MyTaskInProgress: number;
  MyTaskNotStarted: number;
  MyInitiativeDraft: number;
  MyInitiativeInProgress: number;
  MyInitiativeCompleted: number;
  MyInitiativeCanceled: number;

  user;

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit() {
    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      this.LoadingPage();
      setTimeout(() => this.SetResult(), 3000);
    });

    if (this.authService.loggedIn()) { this.SetResult(); }
  }

  SetResult() {
    this.authService.getUser().subscribe((user) => {
      this.homeService.MyTaskInProgress      (user.username).subscribe((result) => this.MyTaskInProgress       = Number(result));
      this.homeService.MyTaskNotStarted      (user.username).subscribe((result) => this.MyTaskNotStarted       = Number(result));
      this.homeService.MyInitiativeDraft     (user.username).subscribe((result) => this.MyInitiativeDraft      = Number(result));
      this.homeService.MyInitiativeInProgress(user.username).subscribe((result) => this.MyInitiativeInProgress = Number(result));
      this.homeService.MyInitiativeCompleted (user.username).subscribe((result) => this.MyInitiativeCompleted  = Number(result));
      this.homeService.MyInitiativeCanceled  (user.username).subscribe((result) => this.MyInitiativeCanceled   = Number(result));
    });
  }

  LoadingPage() {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2500);
  }

}
