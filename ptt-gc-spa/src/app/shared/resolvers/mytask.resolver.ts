import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { InitiativeList } from '@models/initiativeList';
import { InitiativeService } from '@services/initiative/initiative.service';
import { AuthService } from '@services/authentication/auth.service';

@Injectable()
export class MyTaskResolver implements Resolve<InitiativeList> {
  pageNumber = 1;
  pageSize   = 10;
  params: any = {};

  constructor(
    private authService: AuthService,
    private initiativeService: InitiativeService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<InitiativeList> {
    this.params.page              = 'myTask';
    this.params.progress          = true;
    this.params.complete          = true;
    this.params.cancel            = true;
    this.params.text              = '';
    this.params.column            = '';
    this.params.orderBy           = '';
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
    this.authService.getUser().subscribe((user) => this.params.username = user.username);
    return this.initiativeService.GetInitiatives(this.pageNumber, this.pageSize, this.params).pipe(
      catchError(error => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
