import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.css']
})
export class SearchMenuComponent {
  games:string[]=[
    'football',
    'basketball',
    'volleyball',
    'tennis',
    'table tennis', 
    'handball',
    'rugby union',
    'ice hockey','american football',
    'baseball',
    'darts',
    'badmington',
    'cricket',
    'mma',
    'alpine',
    'aussie rule',
    'boxing',
    'cycling',
    'futsal',
    'specials',
    'golf',
    'snooker',
    'rugby league',
    'motorcycle racing',
    'stock car racing'
  ];

    @Input() hideMenu:boolean=true;
  @Output ('closeMenu') closeMenuClickedEvent = new EventEmitter<boolean>()

  toggleMenu()
  {
    this.hideMenu = true;
    this.closeMenuClickedEvent.emit(true);
  }
}
