import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { JackpotRoutingModule } from './jackpot-routing.module';
import { JackpotComponent } from './jackpot.component';



@NgModule({
  declarations: [JackpotComponent],
  imports: [
    CommonModule,
    SharedModule,
    JackpotRoutingModule
  ],
  exports: [JackpotComponent]
})
export class JackpotModule { }
