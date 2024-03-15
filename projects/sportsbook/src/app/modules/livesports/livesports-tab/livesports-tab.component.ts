import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LiveSportsTab } from '../../../dto/live-data.dto';


@Component({
  selector: 'app-livesports-tab',
  templateUrl: './livesports-tab.component.html',
  styleUrls: ['./livesports-tab.component.css']
})
export class LivesportsTabComponent implements OnChanges, OnInit{
  @Input() sportsDatatab : LiveSportsTab[];
  @Input() selectedSport = '';
  @Input() favCounter = 0;
  @Output() sportChange = new EventEmitter<string>();

  constructor(){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.['sportsDatatab'] && changes?.['sportsDatatab'].currentValue && !changes?.['sportsDatatab'].isFirstChange){
      this.sportsDatatab = changes?.['sportsDatatab'].currentValue;
      if(this.sportsDatatab.length>0 && this.sportsDatatab.findIndex(ele=>ele.id===this.selectedSport)===-1) this.selectedSport = this.sportsDatatab[0].id;
    }
    if(changes?.['selectedSport'] && changes?.['selectedSport'].currentValue && !changes?.['selectedSport'].isFirstChange){
      this.selectedSport = changes['selectedSport'].currentValue;
    }
  }

  ngOnInit(): void {
    
  }
  
	isLargeScreen(){
		if(window.innerWidth >= 1024) return true;
		return false;
	}
  isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }


  selectSport(id){
	if(this.selectedSport===id) return;
	this.selectedSport = id;
    this.sportChange.emit(id);
  }


  private readonly initialScrollState = 0;
	private currScrollState = this.initialScrollState;
	private isVisible(ele, container) {
	  const eleLeft = ele.offsetLeft;
	  const eleEnd = eleLeft + ele.clientWidth;
  
	  const containerLeft = container.scrollLeft + container.offsetLeft;
	  const containerEnd = containerLeft + container.clientWidth ;
	  return (
		  (eleLeft >= containerLeft && eleEnd <= containerEnd) ||
		  (eleLeft < containerLeft && containerLeft < eleEnd) ||
		  (eleLeft < containerEnd && containerEnd < eleEnd)
	  );
	};
  
	scrollEvent(e : Event, htmlRefEle : HTMLDivElement, isLeft : boolean, tabs){
	  if(!htmlRefEle) return;
	  if(htmlRefEle.scrollWidth <= htmlRefEle.offsetWidth) return;
	  if(isLeft){
		if(this.currScrollState === 0){ //first element, scroll to last
		  htmlRefEle.children?.item(tabs.length-1)?.scrollIntoView({block: 'nearest'});
		  this.currScrollState = tabs.length-1;
		}else{
		  let temp = this.currScrollState - 1;
		  if(this.isVisible(htmlRefEle.children?.item(temp), htmlRefEle)){
			for(let j = this.currScrollState; j >= 0; j--){
			  if(!this.isVisible(htmlRefEle.children?.item(j), htmlRefEle)){
				temp = j;
				break
			  }
			}
		  }
		  htmlRefEle.children?.item(temp).scrollIntoView({block: 'nearest'});
		  this.currScrollState = temp;
  
		}
	  }else{
		if(this.currScrollState === tabs.length-1){
		  htmlRefEle.children?.item(0)?.scrollIntoView({block: 'nearest'})
		  this.currScrollState = 0;
		}else{
		  let temp = this.currScrollState + 1;
		  if(this.isVisible(htmlRefEle.children?.item(temp), htmlRefEle)){
			for(let j = this.currScrollState; j < tabs.length; j++){
			  if(!this.isVisible(htmlRefEle.children?.item(j), htmlRefEle)){
				temp = j;
				break
			  }
			}
		  }
		  htmlRefEle.children?.item(temp).scrollIntoView({block: 'nearest'});
		  this.currScrollState = temp;
		}
	  }
	}
}
