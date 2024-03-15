import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveSportsComponent } from './livesports/livesports.component';

const livesportsRoutes: Routes = [
    { path: '' , component: LiveSportsComponent,},
    { path: ':liveSportName' , component: LiveSportsComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(livesportsRoutes)],
  exports: [RouterModule]
})
export class LivesportsRoutingModule { }
