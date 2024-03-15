import { Injectable, inject } from "@angular/core";
import { LiveDocService, StompHeaders } from "@livedoc";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Selection } from "../dto/odd-data.dto";
import { LocalStorageService } from "../util/local-storage.service";
import { SearchResult } from "./subscribe.data";
import { EventData } from "../dto/event-data.dto";
import { environment } from "../../environments/environment";
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from "./shared.service"
import { SportDuration } from "../modules/sports-book/main/search.data";
import { BetBasketResponse } from "../modules/bet-slip-desktop/bet-slip-desktop/bet-slip-desktop.component";
import { SportsData } from "../dto/live-data.dto";

@Injectable({
  providedIn: 'root'
})
export class BettingService {
  betBasketData: any;
  selectedBetsData = [];
  betBasketId: string;
  singleEventId: string;
  responseData: any;
  currentMarketTabIndex = 0
  readonly currentSearchMarketTabIndex = 0
  betCheckOutCheck: boolean = false;
  

  private betListBus$ = new BehaviorSubject<any>([]);
  betList$ = this.betListBus$.asObservable();
  betSlipListData: any[] = [];

  private responseDataSubject = new BehaviorSubject<any>(null);
  responseData$ = this.responseDataSubject.asObservable();

  private performOddOperationSubject = new BehaviorSubject<void>(null);
  performOddOperation$ = this.performOddOperationSubject.asObservable();


  private selectionsBus$ = new BehaviorSubject<Selection[]>([]);
  selections$ = this.selectionsBus$.asObservable();
  selections: Selection[] = [];

  // private betBasketDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private betBasketDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  betBasketData$: Observable<any> = this.betBasketDataSubject.asObservable();

  private miniCouponId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  miniCouponId$: Observable<any> = this.miniCouponId.asObservable();

  private marketHeadings: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  marketHeadings$: Observable<any> = this.marketHeadings.asObservable();

  private myBetRebet: BehaviorSubject<any> = new BehaviorSubject<any[]>([]);
  myBetRebet$: Observable<any[]> = this.myBetRebet.asObservable();

  public myBetLoader: BehaviorSubject<any> = new BehaviorSubject<string>('');
  myBetLoader$: Observable<string> = this.myBetLoader.asObservable();

  BETSLIP_KEY = "zebet_betslip_key";

  _localStorageService = inject(LocalStorageService);

  public betBasketIdSubject = new BehaviorSubject<string | null>(null);
  betBasketId$ = this.betBasketIdSubject.asObservable();
  private loginSubject = new Subject<boolean>();
  private betslipSubject = new Subject<boolean>();

  public offsetSubject: Subject<number> = new Subject<number>();
  private sportsDataUrl = 'assets/data/sports.json';


  constructor(
    private livedoc: LiveDocService,
    private httpClient: HttpClient,
    private sharedService: SharedService,
  ) { 
    this.clearDataArray(); //Make the search clean

    this.httpClient.get(this.sportsDataUrl).subscribe((sportsData: any) => {
      this.sportsData = sportsData.map(item => ({
        id: item.id,
        name: item.name,
        coupons: item.coupons,
        order: item.order,
        metaData : item.metaData
      }));
      }); 

  }

  upcomingGames(destination: string, headers: StompHeaders = null) {
    if (headers == null)

      return this.livedoc.getStream<any>(destination)

    return this.livedoc.getStream<any>(destination, headers)
  }
  outrightGames(destination: string, headers: StompHeaders = null) {
    if (headers == null)

      return this.livedoc.getStream<any>(destination)

    return this.livedoc.getStream<any>(destination, headers)
  }

  getReccomendedBets(destination : string, headers : StompHeaders = null) {
    if (headers == null)

    return this.livedoc.getStream<any>(destination)

  return this.livedoc.getStream<any>(destination, headers)
  }

  getBetBasket(destination) {
    return this.livedoc.getStream<any>(destination)
  }
  
  getBetwin(destination, headers: StompHeaders = null) {
    return this.livedoc.getStream<any>(destination, headers)
  }

  getMessages(destination) {
    return this.livedoc.getStream<any>(destination)
  }

  get betbasket(): Observable<any> {
    if (this._localStorageService.exists(this.BETSLIP_KEY))
      this.betSlipList = this._localStorageService.get(this.BETSLIP_KEY)!.data;
    return this.betListBus$;
  }

  set betSlipList(val){
    this.betSlipListData = val;
    this.betListBus$.next(this.betSlipListData);
    this._localStorageService.set(this.BETSLIP_KEY, this.betSlipListData);
  }

  get betSlipList(){
    if(!this.betSlipListData || (this.betSlipListData.length===0 && this._localStorageService.exists(this.BETSLIP_KEY))) this.betSlipListData = this._localStorageService.get(this.BETSLIP_KEY)!.data
    return this.betSlipListData;
  }

  getEvents(destination) {
    return this.livedoc.getStream<any>({ document: destination });
  }

  getCompetetion(destination) {
    return this.livedoc.getStream<any>(destination);
  }

  getMarkets(destination) {
    return this.livedoc.getStream<any>( destination)
  }

  addToBetSlip(bet: Selection) {
    if (this._localStorageService.exists(this.BETSLIP_KEY))
    this.betSlipList = [...this.betSlipList, bet]
  }

  // deleteToBetSlip(bet: Selection){

  //   this.betSlipList.forEach( (item, index) => {
  //     if(item.id === bet.id) this.betSlipList.splice(index,1);
  //   });
  //   // this.betSlipList.push(bet);c
  //   console.log("New Bet Slip", this.betSlipList);
  //   this.betListBus$.next(this.betSlipList);
  //   this._localStorageService.set(this.BETSLIP_KEY, this.betSlipList);
  // }

  deleteToBetSlip(bet: Selection) {
    this.betSlipList.forEach((item) => {
      if (item.participantId === bet.participantId) {
        const index = this.betSlipList.indexOf(item);
        if (index !== -1) {
          if(index+1<this.betSlipList.length) this.betSlipList = [...this.betSlipList.slice(0,index), ...this.betSlipList.slice(index+1,)]
          else this.betSlipList = [...this.betSlipList.slice(0,index-1)]
        }
      }
    });
  }

  getBetSlipList(): any[] {
    return this.betSlipList;
  }

  get betSlipListObservable(): Observable<any[]> {
    return this.betListBus$.asObservable();
  }

  clearBetSlip() {
    this.betSlipList.length = 0;
    this.betListBus$.next(this.betSlipList);
    this._localStorageService.set(this.BETSLIP_KEY, this.betSlipList);
  }

  setResponseData(responseData: any) {
    this.responseDataSubject.next(responseData);
  }

  setMiniCouponId(miniCoupon: string) {
    this.miniCouponId.next(miniCoupon);
  }

  setMarketHeadings(marketHeadings: any) {
    this.marketHeadings.next(marketHeadings);
  }

  setMyBetRebet(myBetRebet: any) {
    this.myBetRebet.next(myBetRebet);
  }
  
  getResponseData(): Observable<any> {
    return this.responseDataSubject.asObservable();
  }

  triggerPerformOddOperation() {
    this.performOddOperationSubject.next();
  }

  setBetBasketData(data: any): void {
    this.betBasketDataSubject.next(data);
  }

  getBetBasketData(): any {
    return this.betBasketDataSubject.value;
  }

  getBetBasketDataObserve(): Observable<any> {
    return this.betBasketDataSubject.asObservable();
  }

  setSelections(selections: Selection[]) {
    this.selections = selections;
    this.selectionsBus$.next(this.selections);
  }

  getSelections(): Selection[] {
    return this.selections;
  }
  
  private dataArraySubject = new BehaviorSubject<SearchResult[]>([]);
  
  get dataArray(){
    return this.dataArraySubject.getValue();
  }

  set dataArray(val){
      localStorage.setItem("A-Z_Search_Result", JSON.stringify(val))
    this.dataArraySubject.next(val);
  }

  dataArray$ = this.dataArraySubject.asObservable();

  updateDataArray(newArray: SearchResult[]) {
    console.log('Updating array:', newArray);
      localStorage.setItem("A-Z_Search_Result", JSON.stringify(newArray))
    this.dataArraySubject.next(newArray);
  }

  private timeSubject = new BehaviorSubject<SportDuration>({});
  timeSubject$ = this.timeSubject.asObservable();

  updateTimeMenu(data: SportDuration) {
    console.log('Updating time:', data);
    this.timeSubject.next(data);
  }

  clearDataArray() {
    this.timeSubject.next(null);
    this.updateDataArray([]);
  }

  private dataSource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  sendData(data: any) {
    this.dataSource.next(data);
  }

  private source = new Subject<any>();
  infoSource$ = this.source.asObservable();
  send(infoSource: any) {
    this.source.next(infoSource);
  }

  private azMenu = new Subject<any>();
  azMenu$ = this.azMenu.asObservable();
  closeAZMenu(competitionId: any) {
    this.azMenu.next(competitionId);
  }

  private azMenuMobile = new Subject<any>();
  azMenuMobile$ = this.azMenuMobile.asObservable();
  closeAZMenuMobile(competitionId: any) {
    this.azMenuMobile.next(competitionId);
  }

  private favoriteSubject = new BehaviorSubject<EventData[]>([]);
  favoriteSubject$ = this.favoriteSubject.asObservable();

  favoritesArray(newArray: EventData[]) {
    console.log('Updating array:', newArray);
    this.favoriteSubject.next(newArray);
  }

  private favNamesSubject = new BehaviorSubject<string[]>([]);
  favNamesSubject$ = this.favNamesSubject.asObservable();

  favNamesSubjectArray(value) {
    // const index = this.dataArray.indexOf(value);
    // if (index === -1) {

    //   this.dataArray.push(value);
    // } else {

    //   this.dataArray.splice(index, 1);
    // }
    this.favNamesSubject.next(value);
    // this.favNamesSubject.next([...this.dataArray]);
  }

  private removeFavourite = new BehaviorSubject<string>('');
  removeFavouriteSubject$ = this.removeFavourite.asObservable();

  removeFavouriteF(value: string){
    this.removeFavourite.next(value);
  }

  private goToMarketsMobile = new Subject<any>();
  goToMarketsMobile$ = this.goToMarketsMobile.asObservable();

  goToMarketsMobileF(value: any){
    this.goToMarketsMobile.next(value);
  }

  betBasketAdd(clickedItem) {
    // console.log("clickItem", clickedItem)
    if(localStorage.getItem('betBasketId')){
      if (clickedItem.isSelected) {
        if (this.betBasketData && !['OPEN', 'INCLUDED'].includes(this.betBasketData[0].status)) {
          this.reopenBetBasket(clickedItem);
        } else {
          this.placeBet(clickedItem);
        }
      } else {
        this.singleEventId = `${clickedItem.marketId}.${clickedItem.id}`;
        this.removeSingleEventBetslip();
      }
    }else{
      const payload = {
        currency: 'NGN',
        id: '',
      };
      const headers = new HttpHeaders({
        accept: 'application/x.finbet.competitions+json',
        'Content-Type': 'application/x.finbet.sport.id+json',
      });
  
      this.httpClient
        .post<any>('/betbasket/', payload, { headers: headers })
        .subscribe(
          (response) => {
            const betBasketId = response.id;
            localStorage.setItem('betBasketId', betBasketId);
            sessionStorage.setItem('betBasketId', betBasketId);
            if (clickedItem.isSelected) {
              if (this.betBasketData && !['OPEN', 'INCLUDED'].includes(this.betBasketData[0].status)) {
                this.reopenBetBasket(clickedItem);
              } else {
                this.placeBet(clickedItem);
              }
            } else {
              this.singleEventId = `${clickedItem.marketId}.${clickedItem.id}`;
              this.removeSingleEventBetslip();
            }
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }
  }

  reopenBetBasket(clickedItem) {
    const headersLogged = this.sharedService.getHeaders();
    const payload = { singles: 'DELETE' };
    this.httpClient
      .put(`/betbasket/${localStorage.getItem('betBasketId')}/reopen`, payload, { headers: headersLogged })
      .subscribe(
        (response) => {
          this.betBasketData = response;
          if (this.betBasketData.status == 'OPEN') {
            this.placeBet(clickedItem);
          }
        },
        (error) => {
          console.error('Bet basket reopening error:', error);
        }
      );
  }

  placeBet(clickedItem) {
    const payload = {
      side: clickedItem.side,
      line: clickedItem.line,
      marketid: clickedItem.marketId,
      price: {
        up: clickedItem.price.up,
        dec: clickedItem.price.dec,
        down: clickedItem.price.down,
      },
      selectionids: [clickedItem.id],
      stake: 0,
    };

    // console.log("Place Bet", JSON.stringify(payload));

    if (localStorage.getItem("fnc_accessToken")) {
      const headers = this.sharedService.HeadersLogged();
      const dynamicLink = `${environment.liveDocLocal}betbasket/${localStorage.getItem('betBasketId')}/single`;

      this.httpClient.post(dynamicLink, payload, { headers: headers }).subscribe(
        (response) => {
          this.setResponseData(response);
          this.triggerPerformOddOperation();
        },
        (error) => {
          console.error('Bet slip error:', error);
        }
      );
    } else {
      const headers = this.sharedService.getHeaders();
      const dynamicLink = `${environment.liveDocLocal}betbasket/${localStorage.getItem('betBasketId')}/single`;

      this.httpClient.post(dynamicLink, payload, { headers: headers }).subscribe(
        (response) => {
          this.setResponseData(response);
          this.triggerPerformOddOperation();
        },
        (error) => {
          console.error('Bet slip error:', error);
        }
      );
    }
  }

  removeSingleEventBetslip() {
    const headersLogged = this.sharedService.HeadersLogged();
    const headers = this.sharedService.getHeaders();

    const betBasketId = localStorage.getItem('betBasketId');
    if (localStorage.getItem('accessToken')) {
      this.httpClient.delete('/betbasket/' + betBasketId + '/single/' + this.singleEventId, { headers: headersLogged })
        .subscribe(response => {
          this.responseData = response;
          if (this.responseData.singles == null || this.responseData.singles == undefined) {
            this.responseData = [];
            // this.showBets = false;
            return;
          }
          // this.showBets = true;
        }, error => {
          console.error('delete error:', error);
        });
    } else {
      this.httpClient.delete('/betbasket/' + betBasketId + '/single/' + this.singleEventId, { headers: headers })
        .subscribe(response => {
          this.responseData = response;
          if (this.responseData.singles == null || this.responseData.singles == undefined) {
            this.responseData = [];
            return;
          }
        }, error => {
          console.error('delete error:', error);
        });
    }
  }

  generateBetbasketId() {
    const betbasketIDinLocal = localStorage.getItem('betBasketId');
    if (localStorage.getItem('fnc_accessToken')) {
      const idLocal = localStorage.getItem('betBasketId');
      const payload = {
        currency: 'NGN',
        id: idLocal,
      };
      const authToken = localStorage.getItem('fnc_accessToken');
      const headers = new HttpHeaders({
        accept: 'application/x.finbet.competitions+json',
        'Content-Type': 'application/x.finbet.sport.id+json',
        Authorization: `Bearer ${authToken}`,
      });

      this.httpClient
        .post<BetBasketResponse>('/betbasket/', payload, { headers: headers })
        .subscribe(
          (response) => {
            const betBasketId = response.id;
            // console.log(' betbasketID', betBasketId);
            localStorage.setItem('betBasketId', betBasketId);
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    } else if (!betbasketIDinLocal) {
      // console.log('api hit')
      const payload = {
        currency: 'NGN',
        id: '',
      };
      const headers = new HttpHeaders({
        accept: 'application/x.finbet.competitions+json',
        'Content-Type': 'application/x.finbet.sport.id+json',
      });

      this.httpClient
        .post<BetBasketResponse>('/betbasket/', payload, { headers: headers })
        .subscribe(
          (response) => {
            const betBasketId = response.id;
            this.betBasketId = response.id;
            localStorage.setItem('betBasketId', betBasketId);
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }
  }
  
  loginStatus$ = this.loginSubject.asObservable();
  setLoginStatus(status: boolean) {
    this.loginSubject.next(status);
  }
  
  betSlipStatus$ = this.betslipSubject.asObservable();
  setBetslipOpenStatus(status: boolean) {
    this.betslipSubject.next(status);
  }

  setOffset(offset: number): void {
    this.offsetSubject.next(offset);
  }

  resetOffset(): void {
    this.setOffset(0);
  }

  checkAZExclusion (): boolean {
    if(localStorage.getItem("current_url") === 'MARKETS')
      return true;

    return false;
  }


  sportsDataSubject = new BehaviorSubject<Array<SportsData>>([]);
  sportsData$ = this.sportsDataSubject.asObservable();
  set sportsData(val){
    this.sportsDataSubject.next(val);
  }
  get sportsData(){
    return this.sportsDataSubject.getValue();
  }

}
