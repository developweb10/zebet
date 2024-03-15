import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashComponent } from '../../components/splashPage/splashPage.component';

const splashRoutes: Routes = [
    { path: '' , component: SplashComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(splashRoutes)],
  exports: [RouterModule]
})

export class SplashRoutingModule { }
