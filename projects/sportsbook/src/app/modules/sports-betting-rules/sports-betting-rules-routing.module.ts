import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsBettingRuleComponent } from './Sportsbettingrule.component';

const sportsBettingRulesRoutes: Routes = [
    { path: '' , component: SportsBettingRuleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(sportsBettingRulesRoutes)],
  exports: [RouterModule]
})
export class SportsBettingRulesRoutingModule { }
