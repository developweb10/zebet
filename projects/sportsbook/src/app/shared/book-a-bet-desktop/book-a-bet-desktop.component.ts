import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-a-bet-desktop',
  templateUrl: './book-a-bet-desktop.component.html',
  styleUrls: ['./book-a-bet-desktop.component.css'],
})
export class BookABetDesktopComponent {
  constructor(public dialogRef: MatDialogRef<BookABetDesktopComponent>) {}

  closeDialog(){
    this.dialogRef.close();
  }
}
