
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LiveDocService } from "@livedoc";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DemoBettingService {

    upcomingGamesUrl: string = "/assets/data/home_data.json";
    gameOddsUrl: string = "/assets/data/main_odd.json";
    sportsUrl: string = "/assets/data/sports.json";
 
    constructor(private http: HttpClient) {
    }



  upcomingGames(): Observable<any>
  {
    const headers = { 'content-type': 'application/json'}; 
    return this.http.get<any>(this.upcomingGamesUrl, {'headers':headers});
  }

  getMarkets(): Observable<any>
  {
    const headers = { 'content-type': 'application/json'}; 
    return this.http.get<any>(this.gameOddsUrl, {'headers':headers});
  }

  getSports(): Observable<any>
  {
    const headers = { 'content-type': 'application/json'}; 
    return this.http.get<any>(this.sportsUrl, {'headers':headers});
  }
  
  
}