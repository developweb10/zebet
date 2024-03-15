import { Injectable } from '@angular/core';
import { type HttpClient } from '@angular/common/http';
import { type Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root',
})
/**
 * Service for handling API-related operations.
 * @class
 */
export class ApiService {
	private readonly baseUrl = environment.ASSETS_URL;

	/**
	 * Creates an instance of the ApiService.
	 * @param {HttpClient} http - The HTTP client for making requests.
	 */
	constructor(private readonly http: HttpClient) {}

	/**
	 * Retrieves top navigation items.
	 * @returns An observable with the top navigation items.
	 */
	getTopNavItems(): Observable<any> {
		const url =
			this.baseUrl +
			'items/top_nav?fields=*,mobile_nav_items.mobile_nav_items_id.*';
		return this.http.get(url);
	}
}
