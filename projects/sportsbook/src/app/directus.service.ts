import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DirectusService {
  private apiUrl = 'http://your-directus-api-url';

  constructor(private http: HttpClient) {}

  getItems(collectionName: string) {
    return this.http.get(`${this.apiUrl}/items/${collectionName}`);
  }
}
