import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TokenService } from '../../../services/token-service';

@Injectable({
	providedIn: 'root',
})
export class TransactionsService {
	private baseUrl = '/portal/transaction-type';
	token = localStorage.getItem('accessToken');

	private headers = {
		accept: 'application/json',
		websiteurl: `${environment.websiteUrl}`,
		channel: 'Mobile',
		Authorization: `Bearer ${this.token}`,
	};

	_tokenService = inject(TokenService);
	authToken: string;

	constructor(private http: HttpClient) {}

	private getHeaders(additionalHeaders: HttpHeaders = null): HttpHeaders {
		this.authToken = localStorage.getItem('fnc_accessToken');
		// this._tokenService.getTokenDetails().subscribe(tokenId => this.authToken = tokenId.fnc_accessToken);
		
		let headers = new HttpHeaders({
			accept: 'application/json',
			websiteurl: `${environment.websiteUrl}`,
			channel: 'Mobile',
			Authorization: `Bearer ${this.authToken}`,
		});
	  
		if (additionalHeaders) {
		  additionalHeaders.keys().forEach(header => {
			headers = headers.append(header, additionalHeaders.get(header));
		  });
		}
	
		return headers;
	  }

	getTransactionsHistoryData(data: any): Observable<any> {

		let headers = this.getHeaders();

		return this.http.post<any[]>(this.baseUrl, JSON.stringify(data), {
			headers,
		});
	}
}

// test
