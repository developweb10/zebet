import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBetComponent } from './my-bet/my-bet.component';
import { BetSlipComponent } from './bet-slip/bet-slip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnderlinedTabComponent } from '../../shared/underlined-tab/underlined-tab.component';
import { MatSliderModule } from '@angular/material/slider';
import { BetHistoryComponent } from '../../shared/bet-history/bet-history.component';



@NgModule({
  declarations: [MyBetComponent, BetSlipComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UnderlinedTabComponent,
    FormsModule,
    MatSliderModule,
    BetHistoryComponent

  ],
  exports: [MyBetComponent, BetSlipComponent]
})
export class BetslipModule { }
