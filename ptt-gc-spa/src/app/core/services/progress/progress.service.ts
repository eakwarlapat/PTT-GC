import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProgressDetail } from '@models/progressDetail';
import { Observable } from 'rxjs';
import { ProgressAndMilestone } from '@models/ProgressAndMilestone';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  CreateProgressDetail(id, DetailForm): Observable<ProgressDetail> {
    return this.http.post<ProgressDetail>(this.baseUrl + 'Progress/CreateProgressDetail/' + id, DetailForm);
  }

  GetProgressAndMilestone(id): Observable<ProgressAndMilestone> {
    return this.http.get<ProgressAndMilestone>(this.baseUrl + 'initiative/ProgressAndMilestone/' + id);
  }
}
