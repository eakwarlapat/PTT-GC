import { Injectable  } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ImpactTracking } from '@models/impactTracking';
import { ShareBenefitWorkstream } from '@models/shareBenefitWorkStream';
import { ShareBenefitWorkstreamDetail } from '@models/shareBenefitWorkstreamDetail';

@Injectable({
  providedIn: 'root'
})
export class ImpactService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetWorkStream() {
    return this.http.get(this.baseUrl + 'WorkStream');
  }

  GetRecurringAndOneTimeSelect() {
    return this.http.get(this.baseUrl + 'TypeofBenefit/RecurringAndOneTime');
  }

  GetImplementationCostSelect() {
    return this.http.get(this.baseUrl + 'TypeofBenefit/ImplementationCost');
  }

  CreateImpact(id, ImpactForm): Observable<ImpactTracking> {
    return this.http.post<ImpactTracking>(this.baseUrl + 'ImpactTracking/' + id, ImpactForm);
  }

  UpdateImpact(id, ImpactForm): Observable<ImpactTracking> {
    return this.http.put<ImpactTracking>(this.baseUrl + 'ImpactTracking/' + id, ImpactForm);
  }

  CreateShareBenefitWorkstream(id, ShareBenefitFrom): Observable<ShareBenefitWorkstream> {
    return this.http.post<ShareBenefitWorkstream>(this.baseUrl + 'ImpactTracking/CreateShareBenefitWorkstream/' + id, ShareBenefitFrom);
  }

  DeleteShareBenefitWorkstream(id) {
    return this.http.delete(this.baseUrl + 'ImpactTracking/DeleteShareBenefitWorkstream/' + id);
  }

  GetImpactTotalRecurringOneTime(id): Observable<number> {
    return this.http.get<number>(this.baseUrl + 'ImpactTracking/TotalRecurringOneTime/' + id);
  }

  GetImpactTotalCostOPEX(id): Observable<number> {
    return this.http.get<number>(this.baseUrl + 'ImpactTracking/TotalCostOPEX/' + id);
  }

  GetImpactTracking(id): Observable<ImpactTracking> {
    return this.http.get<ImpactTracking>(this.baseUrl + 'ImpactTracking/' + id);
  }

  CreateIndirect(id, IndirectForm) {
    return this.http.post(this.baseUrl + 'ImpactTracking/CreateIndirect/' + id, IndirectForm);
  }

  GetIndirect(id) {
    return this.http.get(this.baseUrl + 'ImpactTracking/GetIndirect/' + id);
  }

  CreateImpiemantCost(id, ImpiemantCostForm) {
    return this.http.post(this.baseUrl + 'ImpactTracking/CreateImpiemantCost/' + id, ImpiemantCostForm);
  }

  DeleteImpiemantCost(id) {
    return this.http.delete(this.baseUrl + 'ImpactTracking/DeleteImpiemantCost/' + id);
  }

  GetImplementationCost(id) {
    return this.http.get(this.baseUrl + 'ImpactTracking/GetImpiemantCost/' + id);
  }

  CreateFirstRunRate(id, FirstRunRateForm) {
    return this.http.post(this.baseUrl + 'ImpactTracking/CreateFirstRunRate/' + id, FirstRunRateForm);
  }

  GetFirstRunRate(id) {
    return this.http.get(this.baseUrl + 'ImpactTracking/GetFirstRunRate/' + id);
  }

  CreateTypeBenefitForm(id, TypeBenefitForm) {
    return this.http.post(this.baseUrl + 'ImpactTracking/CreateTypeOfBenefit/' + id, TypeBenefitForm);
  }

  GetTypeOfBenefit(id) {
    return this.http.get(this.baseUrl + 'ImpactTracking/GetTypeOfBenefit/' + id);
  }

  GetShareBenefitWorkstream(id): Observable<ShareBenefitWorkstreamDetail> {
    return this.http.get<ShareBenefitWorkstreamDetail>(this.baseUrl + 'initiative/ShareBenefitWorkstream/' + id);
  }

  GetDownloadImpactExcel() {
    return this.http.get(this.baseUrl + 'initiative/DownloadImpactExcel',  { responseType: 'blob' });
  }

}
