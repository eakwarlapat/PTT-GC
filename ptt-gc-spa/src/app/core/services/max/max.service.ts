import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { DetailInformation } from '@models/detailInformation';
import { Kpi } from '@models/Kpi';
import { DetailMax } from '@models/detailMax';
import { KpiDetail } from '@models/KpiDetail';

@Injectable({
  providedIn: 'root'
})
export class MaxService {

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

  GetMaxApprover(workstreamName) {
    return this.http.post(this.baseUrl + 'MaxApprover/Workstream', workstreamName);
  }

  GetMaxApproverSubWorkstream(SubWorkstreamName) {
    return this.http.post(this.baseUrl + 'MaxApprover/SubWorkstream', SubWorkstreamName);
  }

  GetNameMaxApprover(Email): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Owner/NameMaxApprover', { Email });
  }

  GetSubWorkstreamAll() {
    return this.http.get(this.baseUrl + 'SubWorkstream');
  }

  CreateDetailInformation(id, DetailForm): Observable<DetailInformation> {
    return this.http.post<DetailInformation>(this.baseUrl + 'DetailInformation/' + id, DetailForm);
  }

  UpdateDetailInformation(id, DetailForm): Observable<DetailInformation> {
    return this.http.put<DetailInformation>(this.baseUrl + 'DetailInformation/' + id, DetailForm);
  }

  GetDetailInformation(id): Observable<DetailInformation> {
    return this.http.get<DetailInformation>(this.baseUrl + 'DetailInformation/' + id);
  }

  CreateKpi(id, KpiForm): Observable<Kpi> {
    return this.http.post<Kpi>(this.baseUrl + 'DetailInformation/CreateKpi/' + id, KpiForm);
  }

  GetKpiDetail(id): Observable<KpiDetail> {
    return this.http.get<KpiDetail>(this.baseUrl + 'initiative/KpiDetail/' + id);
  }

  GetDetailMax(id): Observable<DetailMax> {
    return this.http.get<DetailMax>(this.baseUrl + 'initiative/DetailMaxInformation/' + id);
  }

  GetWorkstreamLead(id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'MaxApprover/WorkstreamLead/' + id);
  }

  CreateWorkstreamLead(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/WorkstreamLead/' + id, form);
  }

  CreateSponsor(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/Sponsor/' + id, form);
  }

  CreateFinance(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/Finance/' + id, form);
  }

  CreateCFO(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/CFO/' + id, form);
  }

  CreateCTO(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/CTO/' + id, form);
  }

  CreateTOTeam(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/TOTeam/' + id, form);
  }

  CreateTfBtTO(id, form) {
    return this.http.post(this.baseUrl + 'MaxApprover/TfBtTO/' + id, form);
  }
}
