import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TokenService } from '../../../services/token-service';
import { AuthService } from '../../auth/auth.service';
import { LocalStorageService } from '../../../util/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserBalanceService {
  private baseUrl = '/portal/account-balance';

  private headers = {
    'Content-Type': 'application/json',
    accept: 'application/json',
    websiteurl: `${environment.websiteUrl}`,
    channel: 'Mobile',
    Authorization: '',
  };

  localStorageService = inject(LocalStorageService)

  BALANCE_KEY: string = 'zebet_balance_key_encrypt';

  private balanceSubject = new BehaviorSubject<any>({});
  private balanceObservable = this.balanceSubject.asObservable();



  constructor(private http: HttpClient, private tokenService: TokenService, private authService: AuthService) {}

  private updateHeadersWithToken() {
    //this.tokenService.getTokenDetails().subscribe((data) => {
      this.headers.Authorization = `Bearer ${localStorage.getItem('fnc_accessToken')}`;
   // });
  }
  
  getUserBalance(data: any): Observable<any> {

    //let localObserver: Observable<any> = null;

    //if(this.localStorageService.exists(this.BALANCE_KEY))
    //{
        // this.balanceSubject.next(JSON.parse(this.localStorageService.get(this.BALANCE_KEY).data));
        // return this.balanceSubject.asObservable();
    // }
    // else
    // {
      this.updateHeadersWithToken(); // Call the method when needed
      return this.http.post<any[]>(this.baseUrl, JSON.stringify(data), {
        headers: this.headers,
      })
      // .subscribe(balance => {
      //   this.balanceSubject.next(balance);
      //   //this.localStorageService.set(this.BALANCE_KEY, JSON.stringify(balance));
      // });
      // return this.balanceSubject.asObservable();
    // }

    
    
  }

  refreshUserBalance() {

      const requestBody = {
        products: ['sportsbook', 'casino'],
      };

      this.updateHeadersWithToken(); // Call the method when needed
      this.http.post<any[]>(this.baseUrl, JSON.stringify(requestBody), {
        headers: this.headers,
      }).subscribe(balance => {
        this.balanceSubject.next(balance);
        //this.localStorageService.set(this.BALANCE_KEY, JSON.stringify(balance));
      }); 

  }

  setUserBalance(balance) {
    this.balanceSubject.next(balance);
    //this.localStorageService.set(this.BALANCE_KEY, JSON.stringify(balance));
  }

  populateUserBalance(): Observable<any> {

    const requestBody = {
      products: ['sportsbook', 'casino'],
    };
      this.updateHeadersWithToken(); // Call the method when needed
      return this.http.post<any[]>(this.baseUrl, JSON.stringify(requestBody), {
        headers: this.headers,
      })
    
  }


  removeUserBalance() {

    
        this.balanceSubject.next(null);
        this.localStorageService.clear(this.BALANCE_KEY);
    
  }

  private refreshSource = new Subject<void>();

  refresh$ = this.refreshSource.asObservable();

  triggerRefresh() {
    this.refreshSource.next();
  }
}
