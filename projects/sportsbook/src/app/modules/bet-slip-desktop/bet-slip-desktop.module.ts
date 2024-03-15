import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetSlipDesktopComponent } from './bet-slip-desktop/bet-slip-desktop.component';
// import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { UnderlinedTabComponent } from '../../shared/underlined-tab/underlined-tab.component';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
  declarations: [BetSlipDesktopComponent],
  imports: [
    CommonModule,
    FormsModule,
    UnderlinedTabComponent,
    RouterModule
    // SharedModule
  ],
  exports : [
    BetSlipDesktopComponent,
    RouterModule
  ]
})
export class BetSlipDesktopModule { }
