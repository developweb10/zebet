import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQComponent } from './faq.component';

const faqRoutes: Routes = [
    { path: '' , component: FAQComponent },
];

@NgModule({
  imports: [RouterModule.forChild(faqRoutes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
