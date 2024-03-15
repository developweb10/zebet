import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token-service';
import {v4 as uuidv4} from 'uuid';

@Injectable({
	providedIn: 'root',
})
export class SharedService {

	private baseUrl: string = '/3pay/pub/v1';
	token = localStorage.getItem('fnc_accessToken');

	

	

	filterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	filter$: Observable<any> = this.filterSubject.asObservable();

	private headers = {
	  accept: 'application/json',
	  websiteurl: `${environment.websiteUrl}`,
	  channel: 'Desktop',
	  Authorization: `Bearer ${this.token}`,
	};

	constructor(private httpClient: HttpClient, private _tokenService: TokenService) {
		
			
	}

	

	public HeadersLogged() {
		const authToken = localStorage.getItem('fnc_accessToken');
		return new HttpHeaders({
			accept: 'application/x.finbet.competitions+json',
			'Content-Type': 'application/x.finbet.sport.id+json',
			Authorization: `Bearer ${authToken}`,
		});
	}

	public getHeaders() {
		// this._tokenService.getTokenDetails().subscribe(tokenId => 
		// 	this.token = tokenId !== null && tokenId !== undefined ? tokenId.fnc_accessToken : ""
		// 	);

		return new HttpHeaders({
			accept: 'application/x.finbet.competitions+json',
			'Content-Type': 'application/x.finbet.sport.id+json',
		});
	}

	public getPaymentRoutes(paymentProvider:string,requestType:string ) {
		// const params = new HttpParams().set('requestType', 'deposit').set('paymentProvider', 'paystack');
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		
		return this.httpClient.get(`${this.baseUrl}/payment-routes?requestType=${requestType}&paymentProvider=${paymentProvider}`, options);
	}

	public getPaymentMethods(requestType: string) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.get(`${this.baseUrl}/payment-methods?requestType=${requestType}`,options )
	}

	public getPaymentRoute(paymentMethod: string, requestType: string) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.get(`${this.baseUrl}/payment-route?paymentMethod=${paymentMethod}&requestType=${requestType}`,options )
	}

	public getPaymentRoutesO(paymentMethod: string, requestType: string, paymentProvider: string) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.get(`${this.baseUrl}/payment-routes?paymentMethod=${paymentMethod}&requestType=${requestType}&paymentProvider=${paymentProvider}`,options )
	}

	public getPaymentInstrument(paymentRouteId: string) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.get(`${this.baseUrl}/payment-instruments?paymentInstrumentTemplateId=${paymentRouteId}`,options )
	}

	public withdrawalAmount(payload: object) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.post(`${this.baseUrl}/withdrawals`, payload, options )
	}

	public withdrawalAmountConfirmation(payload: object) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		// return this.httpClient.get(`/3pay/pub${link}`, options )
		return this.httpClient.post(`${this.baseUrl}/withdrawals`, payload, options )
	}

	public getWithdrawalStatus(route: string) {
		this.headers['X-Request-ID'] = uuidv4();

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.get(`/3pay/pub${route}`,options )
	}

	public resumeWithdrawal(paymentRequestId: string, version) {
		this.headers['X-Request-ID'] = uuidv4();
		this.headers['Entity-Version'] = version;

		this._tokenService.getTokenDetails().subscribe(tokenId => {
			this.token = tokenId.fnc_accessToken;
			this.headers.Authorization = `Bearer ${this.token}`
		})

		const options = {
			headers: this.headers,
		}
		return this.httpClient.post(`/3pay/pub/v1/payment-requests/${paymentRequestId}/resume`, {}, options )
	}


}

