import { Injectable, inject } from "@angular/core";
import { LiveDocService } from "@livedoc";
import { BehaviorSubject, Observable } from "rxjs";
import { Selection } from "../dto/odd-data.dto";
import { LocalStorageService } from "../util/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class BetslipService {

  private betListBus$ = new BehaviorSubject<any>([]);
  betList$ = this.betListBus$.asObservable();
  betSlipList: any[] = [];

  BETSLIP_KEY = "zebet_betslip_key";

  _localStorageService = inject(LocalStorageService);

  constructor(
    
  ) { }

 
  get betbasket(): Observable<any> {
    if(this._localStorageService.exists(this.BETSLIP_KEY))
    this.betSlipList = this._localStorageService.get(this.BETSLIP_KEY)!.data;
    this.betListBus$.next(this.betSlipList);

    return this.betListBus$;
  }

 

  addToBetSlip(bet: Selection){

    if(this._localStorageService.exists(this.BETSLIP_KEY))
    this.betSlipList = this._localStorageService.get(this.BETSLIP_KEY)!.data;

    this.betSlipList.push(bet);
    this.betListBus$.next(this.betSlipList);

    this._localStorageService.set(this.BETSLIP_KEY, this.betSlipList);
  }

  deleteToBetSlip(bet: Selection){

    this.betSlipList.forEach( (item, index) => {
      if(item.id === bet.id) this.betSlipList.splice(index,1);
    });
    //this.betSlipList.push(bet);c
    console.log("New Bet Slip", this.betSlipList);
    this.betListBus$.next(this.betSlipList);
    this._localStorageService.set(this.BETSLIP_KEY, this.betSlipList);
  }

  clearBetSlip(){

    this.betSlipList.length = 0;
    this.betListBus$.next(this.betSlipList);
    this._localStorageService.set(this.BETSLIP_KEY, this.betSlipList);
  }
}