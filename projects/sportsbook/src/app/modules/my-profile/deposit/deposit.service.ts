import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DepositRequest, DepositResponse, DepositResumeResponse, ExistingInstrument, PaymentProvider, PaymentRequestResumePayload, paymentSelectOptions } from './deposit.data';
import {v4 as uuidv4} from 'uuid';
import { TokenService } from '../../../services/token-service';

type DepostiSubjectType = DepositResumeResponse | null;

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private baseUrl = "/3pay/pub/v1";
  authToken = "";
  requestType: string = 'deposit';
  depositUrl: string = "/3pay/pub/v1/deposits";
  paymentRequestID: string;

  depositStatusSubject: BehaviorSubject<DepostiSubjectType> = new BehaviorSubject(null);
  showApproveBtnSubject: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(private http: HttpClient, private _tokenService: TokenService, private router: Router) {}


  private getHeaders(additionalHeaders: HttpHeaders = null): HttpHeaders {
    this.authToken = localStorage.getItem('fnc_accessToken');
    
    let headers = new HttpHeaders({
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      'Authorization': `Bearer ${this.authToken}`
    });
  
    if (additionalHeaders) {
      additionalHeaders.keys().forEach(header => {
        headers = headers.append(header, additionalHeaders.get(header));
      });
    }

    return headers;
  }

  getPaymentProvider(paymentProvider: string): Observable<PaymentProvider[]> {
    const additionalHeaders = new HttpHeaders({
      'X-Request-ID': uuidv4()
    });
    const headers = this.getHeaders(additionalHeaders);

    const params = new HttpParams();
    params.append('paymentProvider', paymentProvider);

    console.log("MyBetHeaders", headers)

    return this.http.get<PaymentProvider[]>(
      `${this.baseUrl}/payment-routes?paymentProvider=${paymentProvider}&requestType=${this.requestType}`,
      { headers }
    ).pipe(
      catchError((error) => this.handleDepositError(error))
    );
  }

  doDepositOperation(req: DepositRequest): Observable<DepositResponse> {
    const headers = this.getHeaders();

    return this.http.post<DepositResponse>(
      `${this.depositUrl}`,
      JSON.stringify(req),
      { headers }
    ).pipe(
      catchError((error) => this.handleDepositError(error))
    );
  }

  private handleDepositError(error: any): Observable<never> {
    console.log("Error Inspection", error)
    // if (this.isUnauthorizedError(error)) {
    //   // Display an alert with the error message
    //   const errorMessage = error?.error?.description || 'Unauthorized Access. Please login again.';
    //   alert(errorMessage);

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

  getPaymentSelectOptions(requestData: paymentSelectOptions) {
      return this.http.get(requestData.url);
  }

  paymentRequestResume(paymentRequestId: string, entityVersion: string, payload: PaymentRequestResumePayload) {
    const additionalHeaders = new HttpHeaders({
      'X-Request-ID': uuidv4(), 
      'Entity-Version': entityVersion
    });

    const headers = this.getHeaders(additionalHeaders);

    return this.http.post<DepositResumeResponse>(
      `${this.baseUrl}/payment-requests/${paymentRequestId}/resume`, payload , {headers: headers}
    ).pipe(
      catchError((error) => this.handleDepositError(error))
    );
  }

  getPaymentInstrument(paymentInstrumentTemplateId: string) {
    const additionalHeaders = new HttpHeaders({
      'X-Request-ID': uuidv4(), 
    });
    const headers = this.getHeaders(additionalHeaders);
    const params = new HttpParams().set('paymentInstrumentTemplateId', paymentInstrumentTemplateId);
    return this.http.get<ExistingInstrument[]>(`${this.baseUrl}/payment-instruments`, { params, headers });
  }
 
  private isUnauthorizedError(error: any): boolean {
    // Check the error response to determine if it's a 401 Unauthorized error
    return error.status === 401;
  }


   getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } 

  resumeAlternative(url: string): any {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/${url.substring(4)}`, { headers: headers});
  }

  paystackBankDebitRefresh(url: string) {
    const headers = this.getHeaders();
    url = url.substring(3);
    return this.http.get(`${this.baseUrl}${url}`, { headers: headers });
  }
  
  getdepositHistory(initial: any, endDate: any, requestType: string, limit: number, offset: number): Observable<any> {
    // Define common filters
    const filters = '&statuses=complete,denied,processing,waiting_for_approval';
    let url: string;

    // Construct URL based on requestType
    if (requestType === 'deposit' || requestType === 'withdrawal') {
        url = `${this.baseUrl}/payment-requests?requestType=${requestType}&createdAt=gt:${initial}&createdAt=lt:${endDate}${filters}`;
    } else {
        url = `${this.baseUrl}/payment-requests?createdAt=gt:${initial}&createdAt=lt:${endDate}${filters}&offset=${offset}&limit=${limit}`;
    }

    const additionalHeaders = new HttpHeaders({
        'X-Request-ID': 'as54sde8fd521s245',
    });

    const headers = this.getHeaders(additionalHeaders);

    return this.http.get(url, { headers: headers });
}

  getWithdrawaltHistory(params: any): Observable<any> {
    // Construct URL with parameters
    const withdarwalUrl ="/3pay/pub/v1/withdrawals"
    const additionalHeaders = new HttpHeaders({
      'X-Request-ID': "as54sde8fd521s245",
    });

    const headers = this.getHeaders(additionalHeaders);
    // Set parameters if they exist
    if (params) {
      let httpParams = new HttpParams();
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
      return this.http.get(withdarwalUrl, { params: httpParams,headers:headers  });
    } else {
      return this.http.get(withdarwalUrl);
    }
  }

 getStatus(url:string): Observable<any> {
    // Construct URL with parameters
    const modifyUrl ="/3pay/pub"+url;
    const additionalHeaders = new HttpHeaders({
      'X-Request-ID': "as54sde8fd521s245",
    });

    const headers = this.getHeaders(additionalHeaders);
    // Set parameters if they exist
   
      return this.http.get(modifyUrl, {headers:headers  });
  }
}


// // Assume these types are defined in your application
// interface BetHistoryQueryData {
//   // Your data structure for the query
// }

// interface BetHistoryWrapper {
//   // Your data structure for the response
// }
