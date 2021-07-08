import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { InitiativeList } from '@models/initiativeList';
import { InitiativeService } from '@services/initiative/initiative.service';

@Injectable()
export class OverviewResolver implements Resolve<InitiativeList> {
  pageNumber = 1;
  pageSize   = 10;

  constructor(
    private initiativeService: InitiativeService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<InitiativeList> {
    return this.initiativeService.GetInitiatives(this.pageNumber, this.pageSize).pipe(
      catchError(error => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
