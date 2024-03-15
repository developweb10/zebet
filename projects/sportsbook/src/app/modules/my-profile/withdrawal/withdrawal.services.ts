import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {
  private apiUrl = 'http://k8s-node01.finbet.com:30434/v1/withdrawals';

  constructor(private http: HttpClient, private authService: AuthService) { }

  initiateWithdrawal(withdrawalData: any): Observable<any> {
    const accessToken = this.authService.getAccessToken();

    if (!accessToken) {
      console.error('Access token is not available.');
      return Observable.throw('Access token is not available.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Request-ID': this.generateRandomUUID(),
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post<any>(this.apiUrl, withdrawalData, { headers });
  }

  private generateRandomUUID(): string {

    return 'your_generated_uuid';
  }
}
