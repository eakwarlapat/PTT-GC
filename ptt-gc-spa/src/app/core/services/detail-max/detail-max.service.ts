import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { DetailInformation } from '@models/detailInformation';
import { Kpi } from '@models/Kpi';

@Injectable({
  providedIn: 'root'
})
export class DetailMaxService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetFrequency() {
    return this.http.get(this.baseUrl + 'Frequency');
  }

  GetKpis() {
    return this.http.get(this.baseUrl + 'Kpis');
  }

  GetInitiativeTypeMax() {
    return this.http.get(this.baseUrl + 'InitiativeTypeMax');
  }

  GetSubWorkstream(workstreamName) {
    return this.http.get(this.baseUrl + 'SubWorkstream/' + workstreamName);
  }

  GetSubWorkstreamAll() {
    return this.http.get(this.baseUrl + 'SubWorkstream');
  }

  CreateDetailInformation(id, ImpactForm): Observable<DetailInformation> {
    return this.http.post<DetailInformation>(this.baseUrl + 'DetailInformation/' + id, ImpactForm);
  }

  GetDetailInformation(id): Observable<DetailInformation> {
    return this.http.get<DetailInformation>(this.baseUrl + 'DetailInformation/' + id);
  }

  CreateKpi(id, KpiForm): Observable<Kpi> {
    return this.http.post<Kpi>(this.baseUrl + 'DetailInformation/CreateKpi/' + id, KpiForm);
  }

}
