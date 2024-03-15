import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibleGamingComponent } from '../../components/Responsible gaming/Responsible-gaming.component';

const responsibleGamingRoutes: Routes = [
    { path: '' , component: ResponsibleGamingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(responsibleGamingRoutes)],
  exports: [RouterModule]
})
export class ResponsibleGamingRoutingModule { }
