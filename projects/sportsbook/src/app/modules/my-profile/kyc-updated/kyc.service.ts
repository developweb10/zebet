import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class KycService {
	accessToken: string;
	public partnerId: string = environment.kycSmileIdPartnerId;
	public callbackUrl: string =
		'https://webhook.site/cd518a08-118c-4b4c-b46e-8b171238642b';

	kycUrl: string = environment.kycSmildIdUrl;
	constructor(
		private http: HttpClient,
		private authService: AuthService
	) {
		this.accessToken = this.authService.getAccessToken();
	}

	getHeaders() {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'X-Request-ID': uuidv4(),
			Authorization: `Bearer ${this.accessToken}`,
		});
		return headers;
	}

	enhancedKyc(payload: object) {
		return this.http.post(`${this.kycUrl}v1/async_id_verification`, payload);
	}

	checkKycStatus(payload: object) {
		return this.http.post(`${this.kycUrl}v1/job_status`, payload);
	}

	documentVerificationUploadUrl(payload: object) {
		return this.http.post(`${this.kycUrl}v1/upload`, payload);
	}

	uploadKYCDocuments(url:string, payload) {
		return this.http.put(url, payload)
	}
}
