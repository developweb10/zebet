import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPageRoutingModule } from './custom-page-routing.module';
import { PageComponent } from './page/page.component';



@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    CommonModule,
    CustomPageRoutingModule
  ]
})
export class CustomPageModule { }
