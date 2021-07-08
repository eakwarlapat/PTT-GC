import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Audit } from '@models/audit';
import { Observable } from 'rxjs';
import { PaginatedResult } from '@models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetAudits(page?, itemsPerPage?, Params?): Observable<PaginatedResult<Audit[]>> {
    const paginatedResult: PaginatedResult<Audit[]> = new PaginatedResult<Audit[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (Params != null) {
      params = params.append('code',      Params.code);
      params = params.append('keyword',   Params.keyword);
      params = params.append('startDate', Params.startDate);
      params = params.append('endDate',   Params.endDate);
    }

    return this.http.get<Audit[]>(this.baseUrl + 'audit', { observe: 'response', params }).pipe(
      map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
      }));
  }
}
