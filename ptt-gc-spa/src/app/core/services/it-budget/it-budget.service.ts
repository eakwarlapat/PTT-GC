import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ITBudget } from '@models/itBudget';
import { ITBudgetCapex } from '@models/itBudgetCapex';
import { ITBudgetOpex  } from '@models/itBudgetOpex';

@Injectable({
  providedIn: 'root'
})
export class ItBudgetService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetITBudget(id) {
    return this.http.get<ITBudget>(this.baseUrl + 'ITBudget/' + id);
  }

  CreateITBudgetCapex(id, data) {
    return this.http.post<ITBudgetCapex>(this.baseUrl + 'ITBudget/Capex/' + id, data);
  }

  UpdateITBudgetCapex(id, data) {
    return this.http.put<ITBudgetCapex>(this.baseUrl + 'ITBudget/Capex/' + id, data);
  }

  CreateITBudgetOpex(id, data) {
    return this.http.post<ITBudgetOpex>(this.baseUrl + 'ITBudget/Opex/' + id, data);
  }

  UpdateITBudgetOpex(id, data) {
    return this.http.put<ITBudgetOpex>(this.baseUrl + 'ITBudget/Opex/' + id, data);
  }

  GetHardwareList() {
    return this.http.get(this.baseUrl + 'ITBudget/Hardware');
  }

  GetSoftwareList() {
    return this.http.get(this.baseUrl + 'ITBudget/Software');
  }

  CreateHardware(id, data) {
    return this.http.post(this.baseUrl + 'ITBudget/Hardware/' + id, data);
  }

  CreateSoftware(id, data) {
    return this.http.post(this.baseUrl + 'ITBudget/Software/' + id, data);
  }

  GetHardware(id) {
    return this.http.get(this.baseUrl + 'ITBudget/Hardware/' + id);
  }

  GetSoftware(id) {
    return this.http.get(this.baseUrl + 'ITBudget/Software/' + id);
  }

  GetCapexTopic() {
    return this.http.get(this.baseUrl + 'ITBudget/CapexTopic');
  }

  CreateCapexBudgetSurvey(id, data) {
    return this.http.post(this.baseUrl + 'ITBudget/CapexBudgetSurvey/' + id, data);
  }

  GetCapexBudgetSurvey(id) {
    return this.http.get(this.baseUrl + 'ITBudget/CapexBudgetSurvey/' + id);
  }
}
