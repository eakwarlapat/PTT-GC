import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ActionService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  GetInitiativeAction(id) {
    return this.http.get(this.baseUrl + 'InitiativeAction/' + id);
  }
}
