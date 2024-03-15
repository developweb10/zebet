import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simple-button-tab',
  templateUrl: './simple-button-tab.component.html',
  styleUrls: ['./simple-button-tab.component.css']
})
export class SimpleButtonTabComponent implements OnInit {
  activeTab:string = "";
  @Input () tabs  : string[] = ['One','Two','Three'];
  
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  primary = false;

  /**
   * What background color to use
   */
  @Input()
  backgroundColor?: string;

  /**
   * How large should the button be?
   */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  @Output ('tabClick') tabClickedEvent = new EventEmitter<string>()

  ngOnInit(): void {
    if (!this.activeTab && this.tabs != null && this.tabs.length > 0)
    {
        this.activeTab = this.tabs[0];
    }
  }

  toggleTab(tab:string){
    if (this.activeTab != tab)
    {
      this.activeTab = tab;
      this.tabClickedEvent.emit(tab);
    }
  }

  public get classes(): string[] {
    const mode = this.primary ? 'text-[#A3A7AA]' : 'text-[#ffc600]';
    let size = 'text-[11px]';
    switch(this.size) { 
      case 'small': { 
         //statements; 
         size = 'text-[8px]';
         break; 
      } 
      case 'medium': { 
         //statements; 
         size = 'text-[11px]';
         break; 
      } 
      case 'large': { 
        //statements; 
        size = 'text-[13px]';
        break; 
     } 
      default: { 
         //statements; 
         size = 'text-[11px]';
         break; 
      } 
   } 

    return ['flex', 'rounded-l', 'bg-[#2c3538]', 'pl-1.5', size, 'font-semibold' , mode];
  }
}
