import { Component } from '@angular/core';  
import { BookABetDesktopComponent } from '../book-a-bet-desktop/book-a-bet-desktop.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-betslip-desktop',
  templateUrl: './book-betslip-desktop.component.html',
  styleUrls: ['./book-betslip-desktop.component.css'],
})
export class BookBetslipDesktopComponent {
  constructor(public dialogRef: MatDialogRef<BookABetDesktopComponent>) {}

  closeDialog(){
    this.dialogRef.close();
  }
}
