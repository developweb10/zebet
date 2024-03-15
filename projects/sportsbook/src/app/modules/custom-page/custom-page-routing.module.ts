import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { custompageComponent } from './custompage.component';
import { PageComponent } from './page/page.component';

const customPageRoutes: Routes = [
    { path: '' , component: custompageComponent },
    { path: ':title' , component: PageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(customPageRoutes)],
  exports: [RouterModule]
})
export class CustomPageRoutingModule { }
