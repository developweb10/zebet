import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveSportsComponent } from './livesports/livesports.component';
import { LivesportsListingComponent } from './livesports-listing/livesports-listing.component';
import { LivesportsTabComponent } from './livesports-tab/livesports-tab.component';
import { BetSlipDesktopModule } from '../bet-slip-desktop/bet-slip-desktop.module';
import { SharedModule } from '../shared/shared.module';
import { SportsbookNoRoutesModule } from '../sports-book/sports-book-no-routes.module';
import { LivesportsRoutingModule } from './livesports-routing.module';
import { LiveCompetitionItemComponent } from './live-competition-item/live-competition-item.component';
import { LiveEventItemComponent } from './live-event-item/live-event-item.component';
import { LivesportsService } from './livesports/livesports.service';


@NgModule({
  declarations: [
    LiveSportsComponent,
    LivesportsListingComponent,
    LivesportsTabComponent,
    LiveCompetitionItemComponent,
    LiveEventItemComponent,
  ],
  imports: [
    CommonModule,
    BetSlipDesktopModule,
    SharedModule,
    LivesportsRoutingModule,
    SportsbookNoRoutesModule
  ],
  exports : [
  ],  
	providers : [LivesportsService]
})
export class LivesportsModule { }
