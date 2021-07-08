import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable  } from 'rxjs';
import { Product } from '@models/product';
import { Detail } from '@models/detail';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Detail Information (CIM & Strategy)
  GetOwners(Params?) {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get(this.baseUrl + 'Owner', { params });
  }

  GetStrategicObjectives(year) {
    return this.http.get(this.baseUrl + 'StrategicObjective/' + year);
  }

  GetStrategies(strategicObjectiveId) {
    return this.http.get(this.baseUrl + 'Strategy/' + strategicObjectiveId);
  }

  GetEntryModes() {
    return this.http.get(this.baseUrl + 'EntryMode');
  }

  GetProductUnits() {
    return this.http.get(this.baseUrl + 'ProductUnit');
  }

  GetMilestoneStatuses() {
    return this.http.get(this.baseUrl + 'MilestoneStatus');
  }

  CreateInitiativeDetail(id, detailForm) {
    return this.http.post<Detail>(this.baseUrl + 'initiative/Detail/' + id, detailForm);
  }

  UpdateInitiativeDetail(id, detailForm) {
    return this.http.put<Detail>(this.baseUrl + 'initiative/Detail/' + id, detailForm);
  }

  GetInitiativeDetail(id): Observable<Detail> {
    return this.http.get<Detail>(this.baseUrl + 'initiative/Detail/' + id);
  }

  CreateInitiativeProduct(id, productForm): Observable<Product> {
    return this.http.post<Product>(this.baseUrl + 'initiative/Product/' + id, productForm);
  }

  CreateInitiativeMilestone(id, milestoneForm): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'initiative/Milestone/' + id, milestoneForm);
  }

  CreateInitiativeFinancialIndicator(id, financialForm): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'initiative/FinancialIndicator/' + id, financialForm);
  }

  CreateInitiativeFinancial(id, financialAvgForm): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'initiative/Financial/' + id, financialAvgForm);
  }

  GetPositionLevel30() {
    return this.http.get(this.baseUrl + 'hrwebservice/getPositionLevel30');   // getPositionLevel40
  }

  GetPositionLevel40() {
    return this.http.get(this.baseUrl + 'hrwebservice/getPositionLevel40');   // getPositionLevel40
  }

  GetProcurementCategory() {
    return this.http.get(this.baseUrl + 'procurement/getProcurementCategory');   // procurement
  }
  GetProcurementSubCategory() {
    return this.http.get(this.baseUrl + 'procurement/getProcurementSubCategory');   // procurement
  }
  GetProcurementLever() {
    return this.http.get(this.baseUrl + 'procurement/getProcurementLever');   // procurement
  }

}
