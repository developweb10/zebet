import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';

const aboutUsRoutes: Routes = [
    { path: '' , component: AboutComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(aboutUsRoutes)],
  exports: [RouterModule]
})
export class AboutUsRoutingModule { }
