import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = environment.Sign_Out_API;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  signOut() {
    const signOutUrl = this.apiBaseUrl;
    return this.http.get(signOutUrl);
  }
  updateLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  

}
