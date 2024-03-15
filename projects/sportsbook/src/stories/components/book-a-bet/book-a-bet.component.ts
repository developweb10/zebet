import { Component } from '@angular/core';

@Component({
  selector: 'app-book-a-bet',
  templateUrl: './book-a-bet.component.html',
  styles: [
    `
      .wrapper-body input[type='text'] {
        border: 1px solid #4d585d;
        background: #2c3538;
      }
.boxheight{
  height:450px;
}
      :host .rounded-lg {
        border-radius: 10px;
      }

      .c-mb-20 {
        margin-bottom: 8px !important;
      }

      .wrapper-body {
        background-color: #18242a;
        border-radius: 6px;
        padding: 70px 100px;
        margin: 25px 60px;
      }
    `
  ],
})
export class BookABetComponent {
}
