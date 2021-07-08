import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoveService } from '@services/remove/remove.service';
import { UnauthorizedService } from '@errors/unauthorized/unauthorized.service';
import { AuthService } from '@services/authentication/auth.service';

@Component({
  selector: 'app-initiativeredirector',
  templateUrl: './initiativeredirector.component.html',
  styleUrls: ['./initiativeredirector.component.css']
})
export class InitiativeredirectorComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private remove: RemoveService,
    private router: Router,
    private unauthorized: UnauthorizedService,
    private authService: AuthService, ) { }

  gotoId = null;
  gotoPage = null;
  userName = '';

  ngOnInit(): void {
    this.CheckAuth();
    this.CheckNewTabGoto();
  }


  CheckAuth() {
    this.authService.getUser().subscribe((user) => {
      this.userName = user.username;
    }, error => this.unauthorized.error(error));
  }

  CheckNewTabGoto() {
    this.route.queryParams.subscribe(params => {
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

          case 'edit': {
            this.Edit(this.gotoId);
            break;
          }

          default: {
            this.Information(this.gotoId);
            break;
          }
        }
      }
    });
  }

  Information(itemId: any) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', itemId.toString());
    this.router.navigate(['/initiative/information']);
  }

  Edit(itemId: any) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', itemId.toString());
    this.router.navigate(['/initiative/edit']);
  }

  Approve(id) {
    this.remove.Form();
    this.remove.Validate();
    sessionStorage.setItem('id', id.toString());
    this.router.navigate(['/initiative/approve']);
  }

}
