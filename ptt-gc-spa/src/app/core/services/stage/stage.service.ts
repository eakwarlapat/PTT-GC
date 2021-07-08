import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Stage } from '@models/Stage';
import { History } from '@models/history';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetApproveComment(id, stage): Observable<History> {
    return this.http.post<History>(this.baseUrl + 'StatusTracking/ApproveComment/' + id, stage);
  }

  GetStatusTracking(id): Observable<Stage> {
    return this.http.get<Stage>(this.baseUrl + 'StatusTracking/' + id);
  }

  GetHistoryStatus(id, stage): Observable<History> {
    return this.http.post<History>(this.baseUrl + 'StatusTracking/HistoryStatus/' + id, stage);
  }

  GetHistoryStatusList(id): Observable<History> {
    return this.http.get<History>(this.baseUrl + 'StatusTracking/HistoryStatus/' + id);
  }
}
