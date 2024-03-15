import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { TooltipPosition } from 'projects/sportsbook/src/app/shared/tooltip/tooltip.enums';

@Component({
  selector: 'app-tooltip-story',
  templateUrl: './tooltip-story.component.html',
  styleUrls: ['./tooltip-story.component.css']
})
export class TooltipStoryComponent implements OnInit {
  public TooltipPositionEnum = TooltipPosition;
  public positionEnum = this.TooltipPositionEnum.ABOVE;
    /**
   * How large should the button be?
   */
    @Input()
    position: 'above' | 'below' | 'left' | 'right' = 'above';
    ngOnInit(): void {
      switch(this.position) { 
        case 'above': { 
           //statements; 
           this.positionEnum = this.TooltipPositionEnum.ABOVE;
           break; 
        } 
        case 'below': { 
          this.positionEnum = this.TooltipPositionEnum.BELOW;
          break; 
        } 
        case 'left': { 
          //statements; 
          this.positionEnum = this.TooltipPositionEnum.LEFT;
          break; 
       } 
       case 'right': { 
        //statements; 
        this.positionEnum = this.TooltipPositionEnum.RIGHT;
        break; 
     } 
      default: { 
           //statements; 
           this.positionEnum = this.TooltipPositionEnum.RIGHT;
           break; 
        }
      } 
  
    }
}
