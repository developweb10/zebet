import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VirtualsComponent } from './virtuals.component';

const virtualSportsRoutes: Routes = [
    { path: '' , component: VirtualsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(virtualSportsRoutes)],
  exports: [RouterModule]
})
export class VirtualSportsRoutingModule { }
