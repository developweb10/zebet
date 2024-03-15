import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { LiveDocConfigLoaderService, LiveDocService, StompHeaders } from '@livedoc';
import { BettingService } from '../../../services/betting-service';
import { LiveSportsTab, SportsData, competitionEventData } from '../../../dto/live-data.dto';
import { first, map, pluck, takeUntil } from 'rxjs/operators';
import { Subject, Subscription} from 'rxjs';
import { EventData } from '../../../dto/event-data.dto';
import { LivesportsService } from '../livesports/livesports.service';
import { FavouritesService } from '../../sports-book/main/favourites.service';

@Component({
  selector: 'app-livesports-listing',
  templateUrl: './livesports-listing.component.html',
  styleUrls: ['../livesports/livesports.component.css']
})
export class LivesportsListingComponent implements OnInit, OnChanges, OnDestroy{
@Input() singleSport = true;
@Input() sport : SportsData;
@Output() openMarkets = new EventEmitter<{id :string, compId : string}>();

@Input() marketViewtab : string;
@Input() isFirst = false;

result: 1;
eventsFeedLink: string = 'events/';
competitionsLink: string = 'competitions/';
marketsFeedLink: string = 'markets/';
selected: boolean = true;
@Input() isMultibet : boolean = true;
private sportsDataUrl = 'assets/data/sports.json';
sportsData: SportsData[];
sportsDatatab: LiveSportsTab[] = [];
bettingSub;
selectedSport : string = '';
bookingCodeInput: string;
subscription: Subscription;
upcomingSubscription : Subscription;
unSub : Subject<boolean> = new Subject<boolean>();
betBasketData: any;
latestMarketCount = 0;
anyLive : boolean;
marketData = [];
currentDropVal;
testing = true;
isLoaded = false;
miniCoupons = [];
isLoading = true;
overUnder = [];
overUnderNames = [];
selections = [];
selectedBetsData = [];
oddHadingNames = [];
allSubs =  [];
currentMarketTabIndex = 0;
currentEventMiniCouponData;
betslipShow : boolean = false;
singleOddHeadings = [];
eventsData : EventData[] = [];
ticker : Subscription;
competitionEventsData : competitionEventData[] = [];
@Input() selectedMarketViewTab : string;
@Input() selectedMarketCompId : string;
@Input() countChange : boolean;
@Output() openGameStat = new EventEmitter<string>();

  favData = [];


  constructor(		public liveDocService: LiveDocService,
		public liveDockConfigMockLoader: LiveDocConfigLoaderService,
		private changeDetection: ChangeDetectorRef,
		private bettingService: BettingService,
    private favService : FavouritesService,
    private liveSportService : LivesportsService
    ){
    }

ngOnChanges(changes: SimpleChanges): void {
  if(changes['sport'] && !changes['sport'].firstChange){
    this.sport = changes['sport'].currentValue;
    this.eventsLoading = true;
    // this.liveSportService.setMarketView(null,null)
    this.updateData(this.sport);
    this.updateOddNames();
  }


  if(changes['isMultibet'] && !changes['isMultibet'].firstChange){
    this.isMultibet = changes['isMultibet'].currentValue;
      
    if((this.singleSport || (!this.singleSport && this.isFirst)) && !this.selectedMarketViewTab){
    if(!this.isMultibet && this.isLargeScreen()){
      this.liveSportService.setMarketView(this.compsMap?.[0]?.events?.[0]?.id, this.compsMap?.[0]?.competitionId)
    }
    }
  }
}


updateData(sport){
  if(this.subscription) this.subscription.unsubscribe();
		this.setSportId(sport.id);
    this.miniCoupons = sport.coupons; 
    this.overUnder = this.miniCoupons[0]?.overUnder;
    this.currentDropVal = this.miniCoupons[0]?.key;
    this.currentEventMiniCouponData = this.miniCoupons[0]?.key;
    if(this.singleSport) {
      this.subscribeToLiveGames(this.sport.id);
      
    } else {
      this.handleFavs(this.sport.id);
    }
}
setSportId(id){ 
  this.selectedSport = id;
  this.latestMarketCount = 0;
  this.oddHadingNames = [];
  this.currentMarketTabIndex = 0;
  this.overUnder = [];
}

eventsLoading = false;
ngOnInit(): void {
  this.bettingSub = this.bettingService.betBasketData$.pipe(takeUntil(this.unSub)).subscribe((data) => {
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
  if(this.sport){
    this.miniCoupons = this.sport.coupons; 
    if(!this.currentDropVal) {
    this.overUnder = this.miniCoupons?.[0]?.overUnder;
    this.currentDropVal = this.miniCoupons?.[0]?.key;
    this.currentEventMiniCouponData = this.miniCoupons?.[0]?.key;
    }
    this.eventsLoading = true;
    
    this.liveSportService.setMarketView(this.compsMap?.[0]?.events?.[0]?.id, this.compsMap?.[0]?.competitionId)

    this.updateOddNames();
    if(this.singleSport) {
      this.subscribeToLiveGames(this.sport.id);
    } else {
      this.handleFavs(this.sport.id);
    }
   
    this.liveSportService.removeMatch$.pipe(takeUntil(this.unSub)).subscribe(id=>{
      this.filterEvents(this.eventsData, this.eventsData.filter(ele=>ele.id!=id),this.compsMap)

      if(this.isFav(id)) this.favService.removeLiveFav(id);
      
    })
  }
}

ngOnDestroy(): void {
  if(this.subscription) this.subscription.unsubscribe();
  if(this.upcomingSubscription) this.upcomingSubscription.unsubscribe();
  if(this.unSub) this.unSub.next(true); this.unSub.complete();
  if(this.bettingSub) this.bettingSub.unsubscribe();
  this.allSubs.map((eachSub) => {
    if(eachSub) {
      eachSub?.unsubscribe();
    }
  })
  this.allSubs.length =0;

}

filterEvents(accArr : EventData[], newArr : EventData[], compArr : competitionEventData[]){
  if(newArr.length===0){
    compArr.length = 0;
    accArr.length = 0;
  }
  
  let toCallApi = newArr.reduce((result : EventData[], element : EventData) => {
    if (accArr.findIndex(oldEle=>oldEle.id===element.id) === -1) {
        result.push(element);
    }
    return result;
  }, []);
  let toDelete = accArr.reduce((result : EventData[], element : EventData) => {
    if (newArr.findIndex(oldEle=>oldEle.id===element.id) === -1) {
        result.push(element);
    }
    return result;
  }, []);
  toDelete.forEach(ele=>{
    const comp = compArr?.find(comp=>comp.competitionId === ele?.competitionId);
    if(comp) comp?.events.splice(comp.events.findIndex(aE=>aE.id===ele.id),1);
    if(comp && comp.events.length===0) compArr.splice(compArr.findIndex(aE=>aE.competitionId===comp.competitionId),1)
    accArr.splice(accArr.findIndex(aE=>aE.id===ele.id),1);
  })

  toCallApi.forEach(ele=>{
    const index = compArr.findIndex(comp=>comp.competitionId === ele.competitionId)
    if(index===-1){
      const newObj : competitionEventData = {
        competitionId : ele?.competitionId,
        events : [ele]
      }
      if(ele?.competitionName) newObj.competitionName = ele.competitionName;
      compArr.push(newObj)
    }else{
      compArr[index].events.push(ele)
    }

    accArr.push(ele);
  })

}

compsMap : competitionEventData[] = [];
subscribeToLiveGames(id: string){
  let header: StompHeaders = {};
  const link =`eventmap/live${id}`;
  if(id){
    header = {
      'X-Sort': 'date'
    }
    this.subscription = this.bettingService
    .upcomingGames(link, header)
    .pipe(
      pluck('events'),
      map((events) => Object.values(events))
    ).pipe(takeUntil(this.unSub))
    .subscribe(dataD => {
				let data : EventData[] = JSON.parse(JSON.stringify(dataD));
        this.filterEvents(this.eventsData, data, this.compsMap);
        this.eventsLoading = false;

        this.liveSportService.setMarketView(this.compsMap?.[0]?.events?.[0]?.id, this.compsMap?.[0]?.competitionId)
    });
  }
}


isFav(id : string){
  if(Array.isArray(this.favService.liveFavs) && this.favService.liveFavs.findIndex(ele=>ele.id===id)!=-1) return true;
  return false;
}


handleFavs(id: string){
  this.compsMap = [];
  this.eventsData = [];
  let firstTime = true;
  this.favService.filteredLiveFavs$(id).pipe(takeUntil(this.unSub)).subscribe(favData=>{
    const favEvents = favData.map(ele=>{
      return {
        id : ele.id,
        competitionId : ele.compId,
        sportId : ele.sportId
      }
    });
    this.filterEvents(this.eventsData, favEvents, this.compsMap);
    this.eventsLoading = false;
    if(this.isFirst && !this.singleSport && !this.liveSportService.getMarketView()?.id){
      setTimeout(()=>{
        this.liveSportService.setMarketView(this.compsMap?.[0]?.events?.[0]?.id, this.compsMap?.[0]?.competitionId);
      },10)
    }
  })

}


  
  isLive(data : EventData){
    if((data?.actual?.startTime!=null && data?.actual?.endTime===null) && (data?.status !== 'ABANDONED' && data?.status !== 'RESULTED' && data?.status !== 'CLOSED')){
      // is live
      return true;
    }
    return false
  }



// mobile functions

updateOddNames(){
  this.overUnderNames = this.overUnder?.map(ele=>ele.name)
  if(this.overUnderNames?.length) this.selectedTab = this.overUnderNames[0];
}
selectedTab : string;
onOddsChange(tab){
  this.selectedTab = tab;
  const index = this.overUnder.findIndex(ele=>ele.name===tab);
  if(index===-1) return;
  this.currentMarketTabIndex = index;
  this.changeDetection.detectChanges();
}



isLargeScreen(){
  if(window.innerWidth >= 1024) return true;
  return false;
}

openModal(variable : string){
  this.openGameStat.emit(variable)
}


removeEmptyElements(arr) {
  // Find positions with all elements empty
  const positionsToRemove = [];
  
  // Iterate over the sub-arrays to find positions with all empty elements
  for (let i = 0; i < arr && arr[0].length; i++) {
    const allEmpty = arr.every(subArray => {
    if(subArray) {
      return subArray[i] === ''
    } else {
      return true;
    }
    });
    if (allEmpty) {
    positionsToRemove.push(i);
    }
  }
  
  // If positions are found, remove the elements at those positions
  if (positionsToRemove.length > 0) {
    return arr.map(subArray => {
    const newArray = subArray.filter((_, index) => !positionsToRemove.includes(index));
    return newArray;
    });
  }
  
  // Otherwise, return the array as is
  return arr;
  }

handleMiniCouponChange(option) {
  this.oddHadingNames = [];
  this.miniCoupons.map((each) => {
    if(each.key === option) {
      this.overUnder = each.overUnder;
    }
  });
  this.currentMarketTabIndex = 0;
  this.latestMarketCount = 0;
  this.currentEventMiniCouponData = option;
  this.updateOddNames();

  
  }

  
	setMarketTab(event){    
		this.selectedMarketViewTab=event?.id;
		this.selectedMarketCompId =event?.compId;
		this.openMarkets.emit(event);
		// this.changeDetection.detectChanges();
	}

}
