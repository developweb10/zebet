import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../modules/auth/auth.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResisterApiService {
  private apiUrl= '/portal/player-properties/';
  storedData: any;
  fncToken: any;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  saveUserData(body, property: string): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();
    const headers = new HttpHeaders({
      accept: 'application/json',
      channel: 'Mobile',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    const url = `${this.apiUrl}${property}`;
    return this.http.put(url, body, { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  private handleUnauthorizedError(error: any): Observable<never> {
    // if (this.isUnauthorizedError(error)) {
    //   // Display an alert with the error message
    //   const errorMessage = error?.error?.description || 'Unauthorized Access. Please login again.';
    //   alert(errorMessage);

    //   // Redirect to login-account page after 5 seconds
    //   setTimeout(() => {
    //     this.router.navigate(['/auth/login-account']);
    //   }, 5000);
    // }
    return throwError(error);
  }

  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }
}
