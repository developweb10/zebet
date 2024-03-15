import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-tab',
  templateUrl: './button-tab.component.html',
  styleUrls: ['./button-tab.component.css']
})
export class ButtonTabComponent implements OnInit {
  activeTab:string = "";
  @Input () tabs  : string[] = [];
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
}
