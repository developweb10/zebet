import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JackpotComponent } from '../../components/jackpot/jackpot.component';

const jackpotRoutes: Routes = [
    { path: '' , component: JackpotComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(jackpotRoutes)],
  exports: [RouterModule]
})

export class JackpotRoutingModule { }
