import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'reader-stomp-tokens-dialog',
  templateUrl: './stomp-tokens-dialog.component.html',
  styleUrls: ['./stomp-tokens-dialog.component.scss']
})
export class StompTokensDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<StompTokensDialogComponent>
  ) { }

  close(token: string) {
    this.dialogRef.close(token);
  }

}
