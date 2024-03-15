import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromoPostComponent } from './promopost/promo-post.component';
import { PromotionsComponent } from './promotions.component';

const promotionRoutes: Routes = [
    { path: '' , component: PromotionsComponent },
    { path: ':slug' , component: PromoPostComponent },
];

@NgModule({
  imports: [RouterModule.forChild(promotionRoutes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
