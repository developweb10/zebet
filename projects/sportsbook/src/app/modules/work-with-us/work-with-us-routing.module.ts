import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkWithUsComponent } from './workwithus.component';

const workWithUsRoutes: Routes = [
    { path: '' , component: WorkWithUsComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(workWithUsRoutes)],
  exports: [RouterModule]
})
export class WorkWithUsRoutingModule { }
