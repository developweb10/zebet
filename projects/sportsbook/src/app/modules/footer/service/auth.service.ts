import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = 'https://it40d0oae9.execute-api.us-east-1.amazonaws.com/dev';

  constructor(private http: HttpClient) {}

  signOut() {
    const signOutUrl = `${this.apiBaseUrl}/api/user/sign-out`;
    return this.http.get(signOutUrl);
  }
}
