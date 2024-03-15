import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-underlined-tab',
  standalone: true,
  templateUrl: './underlined-tab.component.html',
  styleUrls: ['./underlined-tab.component.css'],
  imports: [CommonModule]
})
export class UnderlinedTabComponent implements OnInit, OnChanges {
  @Input() activeTab:string = "";
  @Output() activeTabChange = new EventEmitter<string>();
  activeTabs:string = "";
  @Input () tabs  : string[] = [];
  @Input () tab  : string[] = [];
  @Input () isUpper  : boolean = false;
  @Input () isJustify  : boolean = false;
  @Input () isDarkBg  : boolean = false;
  @Output ('tabClick') tabClickedEvent = new EventEmitter<string>()

  ngOnInit(): void {
    if (this.activeTab?.length<1 && this.tabs != null && this.tabs.length > 0)
    {
        this.activeTab = this.tabs[0];
        this.activeTabChange.emit(this.activeTab)
    }
  }

  toggleTab(tab:string){
    if (this.activeTab != tab)
    {
      this.activeTab = tab;
      this.activeTabChange.emit(this.activeTab)
      this.tabClickedEvent.emit(tab);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tabs != null && this.tabs.length > 0 && changes['tabs'] && this.activeTab?.length<1)
    {
        this.activeTab = this.tabs[0];
        this.activeTabChange.emit(this.activeTab)
    }
  }

  toggleTabs(tabs:string){
    if (this.activeTabs != tabs)
    {
      this.activeTabs = tabs;
      this.activeTabChange.emit(this.activeTab)
      this.tabClickedEvent.emit(tabs);      
    }
  }
}
