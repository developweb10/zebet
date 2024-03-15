import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

export interface SearchMenuSport {
  id: string;
  version: number;
  name: string;
  nameTid: string;
  isActive: boolean;
  sortWeight: number;
  traderID: string;
  modifiedBy: string;
  properties: SearchMenuSportProperties;
  updatedAt: string;
  total?: number;
}

export interface SearchMenuSportProperties {
  isVirtual: boolean;
  isUsaSport: boolean;
}

export interface Competition {
  id: string
  version: number
  sportId: string
  name: string
  nameTid: string
  shortName: string
  properties: CompetitionProperties
  isActive: boolean
  traderId: string
  modifiedBy: string
  createdAt: string
  updatedAt: string
  competitionClass?: CompetitionClass[]
  matches?: {id: string, match: string, checked: boolean}[]
}

export interface CompetitionProperties {
  competitionClass: CompetitionClass
  sortWeight: number
  season: Season
  feedId: string
  genderId: string
  ageId: string
}

export interface CompetitionClass {
  id: string
  name: string
}

export interface Season {}


@Injectable({
  providedIn: 'root',
})
export class SearchMenuService {
  getAllSportsURL: string = '/sboffer/sports/';
  getCompetitionsBySportURL: string = '/sboffer/competitions/';

  private storeFavouritesMatches: BehaviorSubject<any> = new BehaviorSubject(null);
  public storeFavouritesMatches$ = this.storeFavouritesMatches.asObservable();

  sendFavouritesMatchesData(data: any) {
    this.storeFavouritesMatches.next(data);
  }

  isFavouritesMatchesDataEmpty(): Observable<boolean> {
    return this.storeFavouritesMatches$.pipe(isEmpty());
  }
  
  constructor(private http: HttpClient) {}

  getAllSports(): Observable<SearchMenuSport[]> {
    const headers = {
      accept: 'application/x.finbet.sports+json',
    };
    return this.http.get<SearchMenuSport[]>(this.getAllSportsURL, {
      headers: headers,
    });
  }

  getCompetitionsBySport(sportID : string): Observable<Competition[]> {
    const headers = {
      'accept': 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
    };

    return this.http.post<Competition[]>(
      this.getCompetitionsBySportURL,
      JSON.stringify(sportID),
      {headers:headers}
    );

  }
  searchUrl = '/search'
  searchEvent(opts : {key ?: string, size ?: number, from ?: string, to ?: string, lang ?: string}){
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };
    let url = this.searchUrl+'?';
    url = url + 'pname=' + opts.key;
    url = url + '&size=' + (opts.size ?? 50);
    url = url + '&from=' + (opts.from ?? 0) ;
    opts.to ? url = url + '&to=' + (opts.to ?? 0) : null;
    url = url + '&language=' + (opts.lang ?? 'en');


    return this.http.get<any>(
      url,
      {headers : headers}

    )
  }
}
