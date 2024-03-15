import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SafePipe } from '../../pipes/safe-pipe.pipe';

@Component({
  selector: 'app-game-stat',
  standalone:true,
  templateUrl: './game-stat.component.html',
  styleUrls: ['./game-stat.component.css'],
  imports: [CommonModule, SafePipe],
})
export class GameStatComponent implements OnChanges, OnDestroy, OnInit {
  @Input() modalData : Observable<string>;
  @Input() notModal : boolean = false;
  @Input() modalCloseListener : Observable<boolean>;
  small = true;
  @Output() closeEvent = new EventEmitter<any>();
  private readonly ngUnSubscribe$ = new Subject<boolean>();
  
	// obtain reference ngTemplate named stats
	@ViewChild('gameStatTpl', { static: true, read: TemplateRef })
	statsRef!: TemplateRef<any>;

	// obtain reference to ng-container element
	@ViewChild('modalContainer', { static: true, read: ViewContainerRef })
	modalContainer!: ViewContainerRef;



  
  private readonly baseUrl = 'https://gsm-widgets.betstream.betgenius.com/multisportgametracker?productName=zebetng-dark&fixtureId=';

  constructor(){
   
  }

  ngOnInit(): void {
    if(this.modalData) this.assignPipe();
    if(this.modalCloseListener) this.closeOperation();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.['modalData'] && changes?.['modalData'].currentValue && !changes?.['modalData'].isFirstChange){
      this.ngUnSubscribe$.next(true);
      this.modalData = changes?.['modalData'].currentValue;
      this.assignPipe();
    }

    if(changes?.['modalCloseListener'] && changes?.['modalCloseListener'].currentValue && !changes?.['modalCloseListener'].isFirstChange){
      this.modalCloseListener = changes?.['modalCloseListener'].currentValue;
      this.closeOperation();
    }
  }

  assignPipe(){
    this.modalData.pipe(takeUntil(this.ngUnSubscribe$)).subscribe(val=>{this.openModal(val)});
  }

  closeOperation(){
    this.modalCloseListener.subscribe(val=>{
      if(!val) return;
      this.closeModal();
    })
  }

  closeModalEvent(){
    this.closeEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe$.next(true);
  }

  getUrl(s : string){
    return this.baseUrl + s;
  }



  animate(){
    setTimeout(()=>{this.small=!this.small;},1)
    // this.small = !this.small
  }

	openModal(variable : any){
		this.modalContainer.createEmbeddedView(this.statsRef, {data: variable});
    this.animate();
	}

	closeModal(){
    this.animate();
    setTimeout(()=>{this.modalContainer.clear();
      this.closeModalEvent();},500)
	}
}
