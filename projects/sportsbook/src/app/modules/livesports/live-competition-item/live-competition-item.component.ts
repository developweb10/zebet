import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TrackByFunction } from '@angular/core';
import { SportsData, competitionEventData } from '../../../dto/live-data.dto';
import { BettingService } from '../../../services/betting-service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventData } from '../../../dto/event-data.dto';

@Component({
  selector: 'app-live-competition-item',
  templateUrl: './live-competition-item.component.html',
  styleUrls: ['../livesports/livesports.component.css']
})
export class LiveCompetitionItemComponent implements OnInit, OnChanges {
 @Input() compId : string;
 @Input() events : EventData[];
 @Input() sport : SportsData;
 @Input() overUnder;
 @Input() currentEventMiniCouponData
 @Input() latestMarketCount;
  @Input() currentMarketTabIndex = 0;
  @Input() isMultibet = true;
 compName : string;
 trackByFn : TrackByFunction<EventData> = (index,event)=>event.id;

 private readonly competitionsLink: string = 'competitions/';

 nameLoading = false;
 constructor(private bettingService : BettingService){

 }

  ngOnChanges(changes: SimpleChanges): void { 
    if(changes['compId'] && !changes['events'].firstChange){
      this.getCompName();
    }
  } 


 ngOnInit(): void {
   if(this.compId && (!this.compName || this.compName.trim().length === 0)){
    this.getCompName()
   }
 }

 getCompName(){
  this.nameLoading = true;
  this.bettingService.getCompetetion(
  `${this.competitionsLink}${this.compId}`
  ).pipe(take(1)).subscribe(val=>{
    this.nameLoading = false;
    this.compName = val.name;
  });
 }

 @Output() openModalEvent = new EventEmitter<string>();
 openModal(str : string){
  this.openModalEvent.emit(str)
 }

 
isLargeScreen(){
  if(window.innerWidth >= 1024) return true;
  return false;
}
}
