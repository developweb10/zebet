import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AffiliateProgramRoutingModule } from './affiliate-program-routing.module';
import { AffiliateProgramComponent } from './affiliate-program.component';



@NgModule({
  declarations: [AffiliateProgramComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    AffiliateProgramRoutingModule,
    CarouselModule
  ]
})
export class AffiliateProgramModule { }
