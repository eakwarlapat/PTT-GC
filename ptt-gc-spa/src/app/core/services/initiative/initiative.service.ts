import { Injectable  } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable  } from 'rxjs';
import { map } from 'rxjs/operators';
import { Initiative  } from '@models/initiative';
import { Information  } from '@models/information';
import { Status  } from '@models/status';
import { InitiativeList  } from '@models/initiativeList';
import { PaginatedResult } from '@models/pagination';
import { Owner } from '@models/owner';


@Injectable({
  providedIn: 'root'
})
export class InitiativeService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetInitiatives(page?, itemsPerPage?, Params?): Observable<PaginatedResult<InitiativeList[]>> {
    const paginatedResult: PaginatedResult<InitiativeList[]> = new PaginatedResult<InitiativeList[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (Params != null) {
      params = params.append('page',              Params.page);
      params = params.append('progress',          Params.progress);
      params = params.append('complete',          Params.complete);
      params = params.append('cancel',            Params.cancel);
      params = params.append('text',              Params.text);

      params = params.append('username',          Params.username);

      params = params.append('id',                Params.id);
      params = params.append('name',              Params.name);
      params = params.append('status',            Params.status);
      params = params.append('type',              Params.type);
      params = params.append('ownerName',         Params.ownerName);
      params = params.append('organization',      Params.organization);
      params = params.append('plant',             Params.plant);
      params = params.append('typeOfInvestment',  Params.typeOfInvestment);
      params = params.append('registerDateSince', Params.registerDateSince);
      params = params.append('registerDateTo',    Params.registerDateTo);

      params = params.append('column',            Params.column);
      params = params.append('orderBy',           Params.orderBy);

      params = params.append('myOwner',           Params.myOwner);
    }

    return this.http.get<Initiative[]>(this.baseUrl + 'initiative', { observe: 'response', params }).pipe(
      map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
      }));
  }

  GetInitiative(id): Observable<Initiative> {
    return this.http.get<Initiative>(this.baseUrl + 'initiative/' + id);
  }

  GetInitiativeCode(id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'initiative/InitiativeCode/' + id);
  }

  GetSuggestStatus(id): Observable<Status> {
    return this.http.get<Status>(this.baseUrl + 'initiative/SuggestStatus/' + id);
  }

  GetInformation(id): Observable<Information> {
    return this.http.get<Information>(this.baseUrl + 'initiative/Information/' + id);
  }

  CreateDraftInitiative(initiativesForm: Initiative): Observable<Initiative> {
    return this.http.post<Initiative>(this.baseUrl + 'initiative/Draft', initiativesForm);
  }

  CreateSubmitInitiative(initiativesForm: Initiative): Observable<Initiative> {
    return this.http.post<Initiative>(this.baseUrl + 'initiative/Submit', initiativesForm);
  }

  UpdateDraftInitiative(id, initiativesForm: Initiative): Observable<Initiative> {
    return this.http.put<Initiative>(this.baseUrl + 'initiative/Draft/' + id, initiativesForm);
  }

  UpdateSubmitInitiative(id, initiativesForm: Initiative): Observable<Initiative> {
    return this.http.put<Initiative>(this.baseUrl + 'initiative/Submit/' + id, initiativesForm);
  }

  UpdateDraftAddMore(id, initiativesForm: Initiative): Observable<Initiative> {
    return this.http.put<Initiative>(this.baseUrl + 'initiative/Draft/Addmore/' + id, initiativesForm);
  }

  DeleteInitiative(id) {
    return this.http.delete(this.baseUrl + 'initiative/' + id);
  }

  LastInitiative() {
    return this.http.get(this.baseUrl + 'initiative/last');
  }

  GetPlants() {
    return this.http.get(this.baseUrl + 'plant');
  }

  GetOrganizations() {
    return this.http.get(this.baseUrl + 'Organization');
  }

  GetCoDevelopers(Params?) {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get(this.baseUrl + 'CoDeveloper', { params });
  }

  GetOwners(Params?) {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get(this.baseUrl + 'Owner', { params });
  }

  GetOwnersEmail(Params?) {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get(this.baseUrl + 'Owner/Email', { params });
  }

  GetOwnerName(Params?): Observable<Owner> {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get<Owner>(this.baseUrl + 'Owner/Name', { params });
  }

  GetUser(username): Observable<Owner> {
    return this.http.get<Owner>(this.baseUrl + 'Owner/User/' + username);
  }

  GetOwnersVP(Params) {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get(this.baseUrl + 'Owner/getVP', { params });
  }
  GetOwnerEmail(Params?): Observable<Owner> {
    let params = new HttpParams();
    if (Params != null) {
      params = params.append('text', Params.text);
    }
    return this.http.get<Owner>(this.baseUrl + 'Owner/OwnerEmail', { params });
  }

  GetTypeOfInvestments() {
    return this.http.get(this.baseUrl + 'TypeOfInvestment');
  }

  CreateCoDeveloper(id, coDeveloper) {
    return this.http.post(this.baseUrl + 'initiative/CoDeveloper/' + id, coDeveloper);
  }

  UpdateCoDeveloper(id, coDeveloper) {
    return this.http.put(this.baseUrl + 'initiative/CoDeveloper/' + id, coDeveloper);
  }

  DeleteCoDeveloper(id) {
    return this.http.delete(this.baseUrl + 'initiative/CoDeveloper/' + id);
  }

  UpdateRequestOpex(id, opex) {
    return this.http.put(this.baseUrl + 'initiative/RequestOpex/' + id, opex);
  }

  UpdateBenefitAmount(id, benefit) {
    return this.http.put(this.baseUrl + 'initiative/BenefitAmount/' + id, benefit);
  }

  GetCompany() {
    return this.http.get(this.baseUrl + 'hrwebservice/getCompany');   // getPositionLevel40
  }

  GetProjectManager() {
    return this.http.get(this.baseUrl + 'owner/getProjectManager');   // getPositionLevel40
  }

  // GetOrganizations() {
  //  return this.http.get(this.baseUrl + 'Organization');
  // }
}
