import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TNCComponent } from './tnc.component';

const termsAndConditionRoutes: Routes = [
    { path: '' , component: TNCComponent },
];

@NgModule({
  imports: [RouterModule.forChild(termsAndConditionRoutes)],
  exports: [RouterModule]
})
export class TermsAndConditionsRoutingModule { }
