import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-favorites-item',
  templateUrl: './favorites-item.component.html',
  styleUrls: ['./favorites-item.component.css']
})
export class FavoritesItemComponent {
  @Input() Data;
}
