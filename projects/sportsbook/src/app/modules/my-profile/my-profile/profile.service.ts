import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private playerPropertiesApiUrl = '/portal/player-properties';
  public myProfileSubject: Subject<any> = new Subject();
  public depostiSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loginPageSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private headers = {
    'Content-Type': 'application/json',
    accept: 'application/json',
    websiteurl: `${environment.websiteUrl}`,
    channel: 'Mobile',
    Authorization: '',
  };

  constructor(private http: HttpClient, private authService: AuthService,private tokenService: TokenService, private router: Router) {}

  private updateHeadersWithToken() {
    const fnc_accessToken = localStorage.getItem('fnc_accessToken');
   // this.tokenService.getTokenDetails().subscribe((data) => {
      this.headers.Authorization = `Bearer ${fnc_accessToken}`;
    //});
  }

  getPlayerProperties(): Observable<any> {
    this.updateHeadersWithToken();
    return this.http.get(this.playerPropertiesApiUrl, {  headers: this.headers, }).pipe(
      catchError((error) => this.handleUnauthorizedError(error))
    );
  }

  private apiUrl = 'my/userdetails/';

  getUserDetails(): Observable<any> {
    const fnc_accessToken = localStorage.getItem('fnc_accessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${fnc_accessToken}`,
    });

    // Include headers in the request
    const options = { headers: headers };

    return this.http.get(this.apiUrl, options).pipe(
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
    //   }, 0);
    // }
    return throwError(error);
  }

  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }


}
