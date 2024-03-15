import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites/favorites.component';
import { FavoritesItemComponent } from './favorites-item/favorites-item.component';
import { AZMenuComponent } from 'projects/sportsbook/src/app/modules/a-z/a-z-menu/a-z-menu.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [FavoritesComponent, FavoritesItemComponent, AZMenuComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [FavoritesComponent, FavoritesItemComponent, AZMenuComponent]
})
export class AZModule { }
