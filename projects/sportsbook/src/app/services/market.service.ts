import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  private isOtherMarketsOpenSource = new BehaviorSubject<boolean>(false);
  isOtherMarketsOpen$ = this.isOtherMarketsOpenSource.asObservable();

  setIsOtherMarketsOpen(value: boolean) {
    this.isOtherMarketsOpenSource.next(value);
  }
}
