import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/auth.service';
import { Router } from '@angular/router';
import { BetHistoryQueryData, BetHistoryQueryDataV2, BetHistoryWrapper, CashoutReq, CashoutRule } from './bet-history.data';
import { TokenService } from '../../services/token-service';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BetHistoryService {
  private baseUrl = "/my/bethistory";
  private baseUrlV2 = environment.openBetUrl + "?page=1&size=1000";
  authToken = "";

  constructor(private http: HttpClient, private _tokenService: TokenService, private router: Router) {}

  private getHeaders(): HttpHeaders {
    
    this.authToken = localStorage.getItem('fnc_accessToken');
    return new HttpHeaders({
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      'Authorization': `Bearer ${this.authToken}`
    });
  }

  private getHeadersV2(): HttpHeaders {
    
    const authToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }

  getBetHistory(data: BetHistoryQueryData): Observable<BetHistoryWrapper> {
    const headers = this.getHeaders();

    console.log("MyBetHeaders", headers)

    return this.http.post<BetHistoryWrapper>(
      this.baseUrl,
      JSON.stringify(data),
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }

  getBetHistoryV2(data: BetHistoryQueryDataV2): Observable<BetHistoryWrapper> {
    const headers = this.getHeadersV2();

    console.log("MyBetHeaders", headers)

    return this.http.post<BetHistoryWrapper>(
      this.baseUrlV2,
      JSON.stringify(data),
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }

  
  performCashout(data: CashoutReq): Observable<any> {
    const headers = this.getHeaders();

    console.log("MyBetHeaders", headers)

    return this.http.post<any>(
      "/my/cashout",
      JSON.stringify(data),
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }


  createCashoutRule(data: CashoutRule): Observable<CashoutRule> {
    // this._tokenService.getTokenDetails().subscribe(tokenId => this.authToken = tokenId.fnc_accessToken);
    this.authToken = localStorage.getItem('fnc_accessToken');
    const headers = new HttpHeaders({
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      'Authorization': `Bearer ${this.authToken}`,
      'X-Request-ID' : '123456'
    });;

    
    console.log("MyBetHeaders", headers)

    return this.http.post<CashoutRule>(
      "/sbco/rule",
      JSON.stringify(data),
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }

  getCashoutRule(betId: string): Observable<any> {
    // this._tokenService.getTokenDetails().subscribe(tokenId => this.authToken = tokenId.fnc_accessToken);
    this.authToken = localStorage.getItem('fnc_accessToken');
    const headers = new HttpHeaders({
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      'Authorization': `Bearer ${this.authToken}`,
      'X-Request-ID' : `${this.getRandomInt(1, 99999999)}`
    });;

    
    console.log("MyBetHeaders", headers)

    return this.http.get(
      `/sbco/rule/${betId}`,
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }


  deleteCashoutRule(betId: string, version): Observable<any> {
    // this._tokenService.getTokenDetails().subscribe(tokenId => this.authToken = tokenId.fnc_accessToken);
    this.authToken = localStorage.getItem('fnc_accessToken');
    const headers = new HttpHeaders({
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      'Authorization': `Bearer ${this.authToken}`,
      'X-Request-ID' : '123456'
    });;

    
    console.log("MyBetHeaders", headers)

    return this.http.delete(
      `/sbco/rule/${betId}?version=${version}`,
      { headers }
    ).pipe(
      catchError((error) => this.handleBetHistoryError(error))
    );
  }

   getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

  private handleBetHistoryError(error: any): Observable<never> {
    console.log("Error Inspection", error)
    // if (this.isUnauthorizedError(error)) {
    //   // Display an alert with the error message
    //   const errorMessage = error?.error?.description || 'Unauthorized Access. Please login again.';
    //   //alert(errorMessage);

    //   // Redirect to login-account page after 5 seconds
    //   return timer(5000).pipe(
    //     mergeMap(() => {
    //       this.router.navigate(['/login-account']);
    //       return throwError(error);
    //     })
    //   );
    // }
    return throwError(error);
  }

  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }
}

// // Assume these types are defined in your application
// interface BetHistoryQueryData {
//   // Your data structure for the query
// }

// interface BetHistoryWrapper {
//   // Your data structure for the response
// }
