import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialsComponent } from '../sports-book/specials/specials.component';

const specialsRoutes: Routes = [
    { path: '' , component: SpecialsComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(specialsRoutes)],
  exports: [RouterModule]
})
export class SpecialsRoutingModule { }
