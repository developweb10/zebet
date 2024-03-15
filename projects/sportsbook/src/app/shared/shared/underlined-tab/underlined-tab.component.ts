import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-underlined-tab',
  templateUrl: './underlined-tab.component.html',
  styleUrls: ['./underlined-tab.component.css']
})
export class UnderlinedTabComponent implements OnInit {
  activeTab:string = "";
  @Input () tabs  : string[] = [];
  @Output ('tabClick') tabClickedEvent = new EventEmitter<string>()

  ngOnInit(): void {
    if (!this.activeTab && this.tabs != null && this.tabs.length > 0)
    {
        this.activeTab = this.tabs[0];
    }
    console.log('tabs', this.tabs)
  }

  toggleTab(tab:string){
    if (this.activeTab != tab)
    {
      this.activeTab = tab;
      this.tabClickedEvent.emit(tab);
    }
  }
}
