import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [
    TooltipComponent,
    TooltipDirective
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [TooltipDirective]
})
export class TooltipModule {
}