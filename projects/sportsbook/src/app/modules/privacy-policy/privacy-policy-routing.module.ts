import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy.component';

const livesportsRoutes: Routes = [
    { path: '' , component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(livesportsRoutes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
