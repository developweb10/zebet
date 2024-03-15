import { Injectable } from '@angular/core';
import { image } from 'html2canvas/dist/types/css/types/image';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class LoaderService {
  private loaderObservers = new BehaviorSubject<boolean>(false);
  public loaderSubject = new BehaviorSubject<boolean>(false);
  public showLoader = this.loaderSubject.asObservable().pipe();

  loadSearchResultBox = new BehaviorSubject<boolean>(false);
  searchResultBox = this.loadSearchResultBox.asObservable();

  isLoading = this.loaderObservers.asObservable();

  private BetslipIsVisible: boolean = false;
  private BetslipIsVisibleSubject = new BehaviorSubject<boolean>(false);
  public BetslipIsVisible$ = this.BetslipIsVisibleSubject.asObservable();

  private MyBetIsVisibleSubject = new BehaviorSubject<boolean>(false);
  public MyBetIsVisible$ = this.MyBetIsVisibleSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  show() {
    this.loaderObservers.next(true);
  }

  hide() {
    this.loaderObservers.next(false);
  }

  currentState(): boolean {
    return this.loaderObservers.getValue();
  }

  toggleVisibility() {
    this.BetslipIsVisibleSubject.next(!this.BetslipIsVisibleSubject.getValue());
    console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  setVisibility(flag: boolean) {
    this.BetslipIsVisibleSubject.next(flag);
    console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  toggleMyBetVisibility() {
    this.MyBetIsVisibleSubject.next(!this.MyBetIsVisibleSubject.getValue());
    //console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  setMyBetVisibility(flag: boolean) {
    this.MyBetIsVisibleSubject.next(flag);
    //console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  toggleLoggedIn() {
    this.isLoggedInSubject.next(!this.MyBetIsVisibleSubject.getValue());
    //console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  setLoggedIn(flag: boolean) {
    this.isLoggedInSubject.next(flag);
    //console.log('this.betlip', this.BetslipIsVisibleSubject);
  }

  getBetslipVisibility(): boolean {
    return this.BetslipIsVisibleSubject.getValue();
  }

  getVisibility() {
    return this.BetslipIsVisible;
  }

  getLoggedIn() {
    return this.isLoggedInSubject.getValue();
  }

  private openBetHistorySource = new Subject<void>();
  openBetHistory$ = this.openBetHistorySource.asObservable();

  triggerOpenBetHistory() {
    this.openBetHistorySource.next();
  }

}

