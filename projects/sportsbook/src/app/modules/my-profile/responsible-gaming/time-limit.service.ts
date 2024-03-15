import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class TimeLimitService {
	private baseUrl = '/portal/time-limit';
	private financialBaseUrl = '/portal/financial-limit';
	private exclusionBaseUrl = '/portal/exclusion';
	private setBaseUrl = '/portal/time-limit/set';
	private setFinancialBaseUrl = 'portal/financial-limit/set';
	private updateFinancialBaseUrl = 'portal/financial-limit/update';
	private setExclusionUrl = 'portal/exclusion/set';
	private revokeBaseUrl = '/portal/time-limit/revoke';
	private revokeFinancialBaseUrl = '/portal/financial-limit/revoke';
	private updateBaseUrl = 'portal/time-limit/update';
	token = localStorage.getItem('fnc_accessToken');

	private headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		accept: 'application/json',
		websiteurl: `${environment.websiteUrl}`,
		channel: 'Mobile',
		Authorization: `Bearer ${this.token}`,
	});

	private financialLimitsHeader = new HttpHeaders({
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		accept: 'application/json',
		websiteurl: `${environment.websiteUrl}`,
		channel: 'Mobile',
		Authorization: `Bearer ${this.token}`,
		currency: 'NGN',
	});
	cancelUpdateFinancialBaseUrl: string = '/portal/financial-limit/cancel_update';

	constructor(private http: HttpClient) {}

	// get time limits

	getHeader(){

		let token = localStorage.getItem('fnc_accessToken');

		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			accept: 'application/json',
			websiteurl: `${environment.websiteUrl}`,
			channel: 'Mobile',
			Authorization: `Bearer ${token}`,
		});

		return headers;
	}

	getFinancialLimitsHeader(){

		let token = localStorage.getItem('fnc_accessToken');
		
		let financialLimitsHeader = new HttpHeaders({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			accept: 'application/json',
			websiteurl: `${environment.websiteUrl}`,
			channel: 'Mobile',
			Authorization: `Bearer ${token}`,
			currency: 'NGN',
		});

		return financialLimitsHeader;
	}

	getLimits(): Observable<any> {
		return this.http.get<any[]>(this.baseUrl, {
			headers: this.headers,
		});
	}

	setTimeLimit(data: any): Observable<any> {
		return this.http.post<any[]>(this.setBaseUrl, JSON.stringify(data), {
			headers: this.getHeader(),
		});
	}

	revokeTimeLimit(data): Observable<any> {
		return this.http.post<any[]>(this.revokeBaseUrl, JSON.stringify(data), {
			headers: this.getHeader(),
		});
	}

	updateTimeLimit(data): Observable<any> {
		return this.http.post<any[]>(this.updateBaseUrl, JSON.stringify(data), {
			headers: this.getHeader(),
		});
	}

	// financial limits
	getFinancialLimits(): Observable<any> {
		return this.http.get<any[]>(this.financialBaseUrl, {
			headers: this.getFinancialLimitsHeader(),
		});
	}

	setFinancialLimit(data: any): Observable<any> {
		return this.http.post<any[]>(
			this.setFinancialBaseUrl,
			JSON.stringify(data),
			{
				headers: this.getHeader(),
			}
		);
	}

	updateFinancialLimit(data: any): Observable<any> {
		return this.http.post<any[]>(
			this.updateFinancialBaseUrl,
			JSON.stringify(data),
			{
				headers: this.getHeader(),
			}
		);
	}

	revokeFinancialLimit(data): Observable<any> {
		return this.http.post<any[]>(
			this.revokeFinancialBaseUrl,
			JSON.stringify(data),
			{
				headers: this.getHeader(),
			}
		);
	}

	canelUpdateFinancialLimit(data): Observable<any> {
		return this.http.post<any[]>(
			this.cancelUpdateFinancialBaseUrl,
			JSON.stringify(data),
			{
				headers: this.getHeader(),
			}
		);
	}

	// exclusions

	getExclusions(): Observable<any> {
		return this.http.get<any[]>(this.exclusionBaseUrl, {
			headers: this.getHeader(),
		});
	}

	setExclusion(data: any): Observable<any> {
		return this.http.post<any[]>(this.setExclusionUrl, JSON.stringify(data), {
			headers: this.getHeader(),
		});
	}
}
