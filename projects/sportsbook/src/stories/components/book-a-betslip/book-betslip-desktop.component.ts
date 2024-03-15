import { Component } from '@angular/core';  

@Component({
  selector: 'app-book-betslip-desktop',
  templateUrl: './book-betslip-desktop.component.html',
  styles: [
    `
     .wrapper-body input[type="text"] {
  border: 1px solid #4d585d;
  background: #2c3538;
}

:host .rounded-lg {
  border-radius: 10px;
}

.c-mb-20 {
  margin-bottom: 8px !important;
}
    `
  ],
})
export class BookBetslipDesktopComponent {

}
