import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddGamingLimitComponent } from './add-gaming-limit/add-gaming-limit.component';
import { BetHistoryComponent } from '../../shared/bet-history/bet-history.component';
import { BonusComponent } from './bonus/bonus.component';
import { CashoutOfferComponent } from '../../shared/cashout-offer/cashout-offer.component';
import { CashoutWidgetComponent } from '../../shared/cashout-widget/cashout-widget.component';
// import { DepositDebitPopUpComponent } from '../../shared/deposit/deposit-debit-pop-up/deposit-debit-pop-up.component';
// import { DepositPopUpComponent } from '../../shared/deposit/deposit-pop-up/deposit-pop-up.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { EditCommunicationComponent } from './edit-communication/edit-communication.component';
import { KycUpdatedComponent } from './kyc-updated/kyc-updated.component';
import { KycComponent } from './kyc/kyc.component';
import { LimitUpdateComponent } from './limit-update/limit-update.component';
import { LiveGameComponent } from '../../shared/live-game/live-game.component';
import { MyAccountComponent } from './my-account/my-account.components';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { OtherSettingsComponent } from './other-settings/other-settings.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { WebcamImageComponent } from './webcam-image/webcam-image.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { FilterCalenderComponent } from './transactions/filtercomponent/filter.component';
import { DepositComponent } from './deposit/deposit.component';
import { DepositValidationPopUpComponent } from './deposit/deposit-validation-pop-up/deposit-validation-pop-up.component';
import { DepositPopUpComponent } from './deposit/deposit-pop-up/deposit-pop-up.component';
import { ResponsibleGamingComponent } from './responsible-gaming/responsible-gaming.component';



@NgModule({
  declarations: [
    BonusComponent,
    WithdrawalComponent,
    ProfileUpdateComponent,
    KycComponent,
    MyProfileComponent,
    EditCommunicationComponent,
    EditAddressComponent,
    OtherSettingsComponent,
    TransactionsComponent,
    DepositComponent,
    MyAccountComponent,
    DepositValidationPopUpComponent,
    WebcamImageComponent,
    AddGamingLimitComponent,
    LimitUpdateComponent, 
    MyProfileComponent,
    DepositPopUpComponent,
    FilterCalenderComponent,
    KycUpdatedComponent,
    ResponsibleGamingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MyProfileRoutingModule,
    LiveGameComponent,
    CashoutOfferComponent,
    ReactiveFormsModule,
    BetHistoryComponent,
    CashoutWidgetComponent
  ],
  exports:[BetHistoryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyProfileModule{ 
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
		const customElement = createCustomElement(KycUpdatedComponent, { injector: this.injector });
		customElements.define('smart-camera-web', customElement);
	}

}
