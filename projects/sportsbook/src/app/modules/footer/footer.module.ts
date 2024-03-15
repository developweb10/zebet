import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BetSlipDesktopModule } from '../bet-slip-desktop/bet-slip-desktop.module';
import { BetslipModule } from '../betslip/betslip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileFooterComponent } from './mobile-footer/mobile-footer.component';
import { FooterComponent } from './footer.component';


@NgModule({
  declarations: [MobileFooterComponent, FooterComponent],
  imports: [
    CommonModule,   
    RouterModule,
    BetSlipDesktopModule,
    BetslipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [MobileFooterComponent, FooterComponent]
})
export class FooterModule { }
