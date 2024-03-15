import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VirtualSportsRoutingModule } from './virtual-sports-routing.module';
import { VirtualsComponent } from './virtuals.component';



@NgModule({
  declarations: [VirtualsComponent],
  imports: [
    CommonModule,
    SharedModule,
    VirtualSportsRoutingModule
  ]
})
export class VirtualSportsModule { }
