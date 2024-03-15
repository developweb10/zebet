import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-deposit-pop-up',
  templateUrl: './deposit-pop-up.component.html',
  styleUrls: ['./deposit-pop-up.component.css']
})
export class DepositPopUpComponent {
  panelOpenState: string | null = null;
  isAccordionDisabled:boolean=false;
  playerId:any;
  constructor(public dialogRef: DialogRef<string>) {
   this.playerId= localStorage.getItem('playerId');

  }
openLink() {
  const link = 'https://www.gtbank.com/';
  window.open(link, '_blank');
}
  
openLinkInNewTab() {
  console.log(this.playerId);
  // Open your link in a new tab
  this.dialogRef.close();
  let link = ` https://gtmt.gtbank.com/app_pilot/GTcollections_habari/gtcollections.aspx?custformid=33531`
  window.open(link, '_blank');
  // Disable the accordion after clicking
}
  onPanelOpened(panel: string): void {
    this.panelOpenState = panel;
  }

  onPanelClosed(panel: string): void {
    if (this.panelOpenState === panel) {
      this.panelOpenState = null;
    }
  }
}
