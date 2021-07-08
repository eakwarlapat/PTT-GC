import { User } from '@models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  Login(loginFrom) {
    return this.http.post(this.baseUrl + 'auth/login', loginFrom).pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('token',  response.token);
            localStorage.setItem('user',   response.username );
          }
        })
    );
  }

  Register(registerForm) {
    return this.http.post(this.baseUrl + 'auth/register', registerForm);
  }

  GetAdmin(id) {
    return this.http.get(this.baseUrl + 'user/admin/', id);
  }

  UserExists(username) {
    return this.http.post(this.baseUrl + 'auth/userExists', username);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['']);
  }

  getUser(): Observable<User> {
    const username = localStorage.getItem('user');
    return this.http.post<User>(this.baseUrl + 'user', { username });
  }

  getMsalUser() {
    return this.http.get('https://graph.microsoft.com/v1.0/me');
  }
}
