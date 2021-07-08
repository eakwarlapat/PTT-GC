import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '@services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  baseUrl = environment.apiUrl + 'Permission/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  permissionCheck: any;
  isDisabled: any = [];
  isEnabled: any = [];
  isHidden: any = [];
  userEmail: string;

  CheckOverviewPermission(email): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'Overview', email);
  }

  // ----------------------------------------------------------------

  //   CheckSectionName(email): Observable<boolean> {  // email, page
  //     return this.http.post<boolean>(this.baseUrl + 'checksectionname', email);
  //  }

  CheckDashboardPermission(email): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'Dashboard', email);
  }

  CheckSectionName(email: string, page: string, initiativeId: string) {  // email, page, id
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('page', page);
    params = params.append('Initiativeid', initiativeId);
    return this.http.get(this.baseUrl + 'checksectionname', { params });
  }

  async CheckSection(page: string, initiativeId: string) {
    this.authService.getUser().subscribe(async (user) => {
      this.userEmail = await user.username;
      this.CheckSectionName(this.userEmail, page, initiativeId.toString()).subscribe(async (result) => {
        this.permissionCheck = await result;
        this.isHidden = [];
        this.isDisabled = [];
        this.isEnabled = [];
        this.permissionCheck.forEach(async element => {
          if (element.isVisible === false) {
            await this.isHidden.push(element.sectionName);
          }
          if (element.isEnable === false) {
            await this.isDisabled.push(element.sectionName);
          } else {
            await this.isEnabled.push(element.sectionName);
          }
        });
      });
    });
  }
}
