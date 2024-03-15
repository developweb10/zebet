import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OtherSettingsService {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private currenciesApiUrl = '/portal/trihubconfig/domain-currencies';
  private languageApiUrl = '/portal/trihubconfig/domain-languages';

  getDomainCurrencies(): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': 'dgp-zbet',
      'channel': 'Desktop',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    return this.http.get(this.currenciesApiUrl, { headers }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  getDomainLanguage(): Observable<any> {
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'accept': 'application/json',
      'websiteurl': 'dgp-zbet',
      'channel': 'Desktop',
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    return this.http.get(this.languageApiUrl, { headers }).pipe(
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
    //     this.router.navigate(['/login-account']);
    //   }, 5000);
    // }
    return throwError(error);
  }

  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }
}
