import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/sportsbook/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BonusService {
  private baseUrl = '/portal/player-bonuses';
  token = localStorage.getItem('fnc_accessToken');

  private headers = {
    accept: 'application/json',
    websiteurl: `${environment.websiteUrl}`,
    channel: 'Mobile',
    Authorization: `Bearer ${this.token}`,
  };

  getHeader() {

      let token = localStorage.getItem('fnc_accessToken');
       const headers = {
        accept: 'application/json',
        websiteurl: `${environment.websiteUrl}`,
        channel: 'Mobile',
        Authorization: `Bearer ${token}`,
      };

      return headers;
  }

  constructor(private http: HttpClient) {}

  getPlayerBonuses(data: any): Observable<any> {
    return this.http.post<any[]>(this.baseUrl, JSON.stringify(data), {
      headers: this.getHeader(),
    });
  }

  pauseBonus(bonusId: string, status: string): Observable<any> {
    const params = new HttpParams()
      .set('bonusId', bonusId)
      .set('status', status);
    return this.http.get('/portal/pause-unpause-bonus', {
      params,
      headers: this.getHeader(),
    });
  }
}