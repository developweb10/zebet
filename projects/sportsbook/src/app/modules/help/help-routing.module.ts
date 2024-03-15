import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';
import { HelpContentComponent } from './helpContent/help-content.component';

const helpRoutes: Routes = [
    { path: '' , component: HelpComponent },
    { path: ':slug' , component: HelpContentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(helpRoutes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
