import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-betslip',
  templateUrl: './book-betslip.component.html',
  styleUrls: ['./book-betslip.component.css'],
})
export class BookBetslipComponent {
  isMobileBookaBet = true;
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
