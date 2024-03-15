import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { Meta } from '@angular/platform-browser';



@NgModule({
  declarations: [],
  providers: [Meta],
  imports: [
    CommonModule,
    SharedModule,
    AboutUsRoutingModule
  ]
})
export class AboutUsModule { }
