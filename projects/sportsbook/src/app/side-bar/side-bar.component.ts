import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
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
}
