import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-a-bet',
  templateUrl: './book-a-bet.component.html',
  styleUrls: ['./book-a-bet.component.css'],
})
export class BookABetComponent {
  isMobileBookaBet = true;
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
