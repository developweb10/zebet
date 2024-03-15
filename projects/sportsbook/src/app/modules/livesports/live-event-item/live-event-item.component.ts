import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventData } from '../../../dto/event-data.dto';
import { SportsData } from '../../../dto/live-data.dto';
import { BettingService } from '../../../services/betting-service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { LivesportsService } from '../livesports/livesports.service';
import { FavouritesService } from '../../sports-book/main/favourites.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-live-event-item',
  templateUrl: './live-event-item.component.html',
  styleUrls: ['../livesports/livesports.component.css']
})
export class LiveEventItemComponent implements OnInit, OnChanges, OnDestroy {
@Input() match : EventData;
// @Output() matchChange : EventEmitter<EventData> = new EventEmitter<EventData>();
time : string = '';
@Input() sport : SportsData;
@Input() overUnder : any;
@Input() currentEventMiniCouponData;
@Input() currentMarketTabIndex = 0;
@Input() latestMarketCount = 0;
@Input() compName : string;
@Input() isMultibet = true;
selectedMarketViewTab = null;
bettingSub : Subscription;
betBasketData: any;
selectedBetsData = [];
allSubs = [];
eventSub : Subscription;
ngUnSub = new Subject<boolean>();
private readonly eventsFeedLink: string = 'events/';
constructor(private bettingService : BettingService, private changeDetection : ChangeDetectorRef, private liveService : LivesportsService, private favService : FavouritesService, private router : Router, private route : ActivatedRoute ){}
eventLoading = false;

ngOnChanges(changes: SimpleChanges): void {
  if(changes['compName'] ){
    this.match.competitionName = changes['compName'].currentValue;
  }
  if(changes['isMultibet'] && !changes['isMultibet'].firstChange){
    if(changes['isMultibet'].currentValue && changes['isMultibet'].previousValue===false){
      this.match.marketData = [];
      this.setMarkets(this.match)
    }else if(!changes['isMultibet'].currentValue && changes['isMultibet'].previousValue===true && this.isLargeScreen()){
      this.allSubs.map((eachSub) => {
        if(eachSub) {
          eachSub?.unsubscribe();
        }
      })
      this.allSubs.length =0;
      this.match.marketData = [];
    }
     
  }
  if(changes['currentEventMiniCouponData']) {
    this.allSubs.map((eachSub) => {
      if(eachSub) {
        eachSub?.unsubscribe();
      }
    })
    this.allSubs.length =0;
    this.match.marketData = [];
    if(this.isMultibet) this.setMarkets(this.match)
  }
}

ngOnInit(): void {
  this.bettingSub = this.bettingService.betBasketData$.pipe(takeUntil(this.ngUnSub)).subscribe((data) => {
    const allSelection = [];
    if(data?.singles) {
      this.betBasketData = JSON.parse(JSON.stringify(data?.singles));
    } else {
      this.betBasketData = [];
      this.bettingService.betSlipList = [];
    }
    if(this.betBasketData && this.bettingService.betSlipList && (this.betBasketData?.length !== this.bettingService.betSlipList.length) && data?.singles && data?.singles.length) {
      this.bettingService.betSlipList = JSON.parse(JSON.stringify(data.singles));
    } else if(!this.betBasketData) {
      this.bettingService.betSlipList = [];
    }

    if (this.betBasketData) {
      this.betBasketData.forEach((item) => {
      item.selections.forEach((selection) => {
        this.selectedBetsData.push(selection);
        allSelection.push(selection);
      });
      });
    }
  
    const commonItems = this.selections.filter((item) => {
      const hasCommonItem = allSelection.some((singleItem) => {
      return (
        singleItem.side === item.side && singleItem.eventId === item.eventId && item.line === singleItem.line && item.name === singleItem.name
      );
      });
      item.isSelected = hasCommonItem;
      return hasCommonItem;
    });
    });


    this.liveService.ticker$.pipe(takeUntil(this.ngUnSub)).subscribe(val=>{this.updateClock()});
  
  if(!this.match.name){
    this.eventLoading = true;
    this.eventSub = this.bettingService.getEvents(
        `${this.eventsFeedLink}${this.match.id}`
        ).pipe(takeUntil(this.ngUnSub)).subscribe(event=>{          
          this.match = {
            ...this.match,
            ...event
          }
          this.eventLoading = false;
          if(!this.isLive(event)){
            this.liveService.removeMatch(event.id)
          }
          this.updateFavStatus();
          
          if(this.isMultibet && !this.match.marketData.length) this.setMarkets(this.match);
        })
  }

  this.liveService.marketViewTab$.pipe(takeUntil(this.ngUnSub)).subscribe(val=>{
    this.selectedMarketViewTab = val?.id ?? null;
  })
}
isFinished(data){
  if(data?.actual?.endtime){
    return true;
  }
  return false
}

ngOnDestroy(): void {
  this.allSubs.map((eachSub) => {
    if(eachSub) {
      eachSub?.unsubscribe();
    }
  })
  this.allSubs.length =0;
  if(this.eventSub) this.eventSub.unsubscribe(); 
  if(this.bettingSub) this.bettingSub.unsubscribe();
  this.ngUnSub.next(true);
  this.ngUnSub.complete();
}



@Output() openModalEvent = new EventEmitter<string>();
openModal(id : string){
this.openModalEvent.emit(id);

}

selections = [];

performOddOperation(selection : any){
  if(selection.uuid){
    selection.isSelected = !selection.isSelected;
    const clickedItem = this.selections.find((item) => item.uuid === selection.uuid);
    this.bettingService.betBasketAdd(clickedItem);
  }
}

loadingMarkets = false;


setMarkets(eventData) {
  this.loadingMarkets = true;
  if(eventData && this.currentEventMiniCouponData && eventData.miniCoupons && eventData.miniCoupons[this.currentEventMiniCouponData] && eventData.miniCoupons[this.currentEventMiniCouponData].length) {
    this.handleMarket(eventData.miniCoupons[this.currentEventMiniCouponData], eventData);
  } else {
    this.loadingMarkets = false;
  }

}
handleMarket(allMarketsBig, eventData) {
  const allMarkets = JSON.parse(JSON.stringify(allMarketsBig));
  if(this.sport.id === 'BKB' && this.currentEventMiniCouponData === 'TOT+HC+WIN') {
    allMarkets.unshift(allMarkets.pop())
  }
  if(allMarkets.length) {
    allMarkets.map((eachMarket) => {
    const newSub = this.bettingService
    .getMarkets(`markets/${eachMarket}`)
    .pipe(takeUntil(this.ngUnSub))
    .subscribe({
      next: (newData) => {
        const data = JSON.parse(JSON.stringify(newData));
      this.loadingMarkets = false;

        if(eventData.marketData?.length) {
        let cond  = false;
        eventData.marketData.map((eachMarketData) => {
          if(eachMarketData?.id === data?.id) {
          eachMarketData?.selections[0]?.map((eachMarketSD) => {
            data?.selections[0]?.map((eachData) => {
            if(eachMarketSD.id === eachData.id) {
              if(parseFloat(eachMarketSD?.price?.dec) < parseFloat(eachData?.price?.dec)) {
              eachMarketSD.hasIncreased = true;
              eachMarketSD.hasReduced = false;
              } else if (parseFloat(eachMarketSD?.price?.dec) > parseFloat(eachData?.price?.dec)) {
              eachMarketSD.hasReduced = true;
              eachMarketSD.hasIncreased = false;
              }
              if(eachMarketSD.id) {
              eachMarketSD.price.dec = eachData.price?.dec;
              eachMarketSD.tradestatus = eachData.tradestatus;
              eachMarketSD.status = eachData.status;
              }
             
              setTimeout(() => {
              eachMarketSD.hasIncreased = false;
              eachMarketSD.hasReduced = false;
              }, 3000)
            }
            })
          });
          eachMarketData.status = data?.status;
          eachMarketData.tradeStatus = data?.tradeStatus;
          cond = true;
          }
        })
        if(!cond) {
          this.handleMarketEdition(data, allMarkets, eventData);
        }
  
        } else {
        this.handleMarketEdition(data, allMarkets, eventData);
        }
        
      
      },
      error: (e) => { },
      complete: () => { },
    });
    this.allSubs.push(newSub);
    });
  } else {
    this.loadingMarkets = false;
  }
  
  }

  
  isLive(data : EventData){
    if((data?.actual?.startTime!=null && data?.actual?.endTime===null) && (data?.status !== 'ABANDONED' && data?.status !== 'RESULTED' && data?.status !== 'CLOSED')){
      // is live
      return true;
    }
    return false
  }

  isLargeScreen(){
    if(window.innerWidth >= 1024) return true;
    return false;
  }

  handleMarketEdition(marketData, allMarkets, eventData) {
  if (this.latestMarketCount < allMarkets.length) {
    this.latestMarketCount = allMarkets.length;
  } 
  let isLine = 0;
  marketData?.selections[0].map((eachSelections) => {
    isLine = eachSelections.line;
    eachSelections.eventId = eventData?.id;
    eachSelections.marketId = marketData.id;
    eachSelections.eventName = eventData?.participants[0][0]?.name + ' vs ' + eventData?.participants[0][1]?.name;
    eachSelections.isSelected = false;
    this.selectedBetsData = JSON.parse(JSON.stringify(this.bettingService.betSlipList));
    for (const item of this.selectedBetsData) {
    if (item.eventId == eachSelections.eventId) {
      if (item['selections'][0]?.name == eachSelections.name && eachSelections.side === item['selections'][0]?.side && eachSelections.eventId === item['selections'][0]?.eventId && item['selections'][0]?.line === eachSelections.line && item['selections'][0]?.price?.dec === eachSelections?.price?.dec) {
      eachSelections.isSelected = true;
      }
    }
    }
    eachSelections.uuid = "id" + Math.random().toString(16).slice(2);
    this.selections.push(eachSelections);
    this.bettingService.setSelections(this.selections);

  });
  if (isLine) {
    let term = 'GOAL';
    if(this.match.sportId === 'BKB') {
    term = 'POINTS';
    } else if (this.match.sportId === 'TNS') {
    term = 'GAMES';
    }
    marketData.selections[0].unshift({price: {dec: isLine}})
  }
    this.loadingMarkets = false;
    if(!eventData?.marketData && !eventData?.marketData?.length) {
      eventData.marketData = [];
    }
    eventData.marketData.push(marketData);
    const tempMarkData = [];
    allMarkets.map((eachMar, index) => {
      if(eachMar) {
      eventData.marketData.map((eachMarketD) => {
        if(eachMarketD?.id === eachMar) {
          if(eachMarketD.selections[0]?.length !== this.overUnder[index]?.overUnder.length) {
            eachMarketD.selections[0].unshift({price: {dec: 0}})
          }
          tempMarkData.push(eachMarketD);
        }
      });
      } else {
      tempMarkData.push({selections: []})
      }
    
    });

    eventData.marketData = tempMarkData;
    this.changeDetection.detectChanges();


  }

  updateFavStatus(){
    this.match.isFavourite = this.favService.isLiveFav(this.match.id);
  }
  
  removeFav(match : EventData){
    this.favService.removeLiveFav(match.id);
    if(this.liveService.getMarketView()?.id===match.id) this.liveService.setMarketView(null,null)
    this.updateFavStatus();
  }
  addFav(match : EventData){
    this.favService.addLiveFav({
      id : match.id,
      compId : match.competitionId,
      sportId : match.sportId
    })
    this.updateFavStatus();
  }

secondsToMinutes = E=>E <= 0 ? "00:00" : Math.floor(E / 60) + ":" + ("0" + Math.floor(E % 60)).slice(-2);
secondsToHours =  E=>E <= 0 ? "00:00" : Math.floor(E / 3600) + ":" +  ("0" + Math.floor(Math.floor(E / 60)%60)).slice(-2) + ":" + ("0" + Math.floor(E % 60)).slice(-2);
calculateTime = E=>{
  let w;
  const L = new Date; const oe = new Date(E.referenceTime);
  // eslint-disable-next-line no-return-assign
  return w = E.isCountdown ? E.current - Math.ceil(L.getTime() / 1e3) + Math.ceil(oe.getTime() / 1e3) : E.current + Math.ceil(L.getTime() / 1e3) - Math.ceil(oe.getTime() / 1e3), w > 216e3 ? "~" : this.secondsToMinutes(w)
}

updateClock(){
  const event = this.match;
  if(event?.actual?.startTime && !event?.actual?.endTime){
    // event is live
    if(event?.result?.clock?.displayClock=== false) this.time = '';
    else if(event?.result?.clock?.isRunning){
      this.time = this.calculateTime(event.result.clock) ?? "0"
    }
    else{
      if(event?.result?.currentPeriod?.isPeriodFinished){
        this.time = 'FINISHED'
      }else{								
        this.time = this.secondsToMinutes(event.result.clock.current)
      }
    }
  }
}

setMarketTab(){
  this.liveService.setMarketView(this.match.id,this.match.competitionId)
}


openMultiBetMarket(){
  const queryParams = {
    event : this.match?.id?.toLowerCase() ?? '',
    comp : this.match.competitionName?.toLowerCase() ?? ''
  }


  this.router.navigate([],{
    relativeTo : this.route,
    queryParams,
    queryParamsHandling : 'merge'
  })
}

}
