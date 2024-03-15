import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { UnderlinedTabComponent } from '../../shared/underlined-tab/underlined-tab.component';
import { ButtonTabComponent } from './button-tab/button-tab.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { ToastComponent } from '../../shared/toast/toast.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { WebcamModule } from 'ngx-webcam';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { GameStatComponent } from '../../components/game-stat/game-stat.component';
import { TopRecommendedBetsComponent } from './top-recommended-bets/top-recommended-bets.component';
import { NaLockComponent } from './na-lock/na-lock.component';
import { SafePipe } from '../../pipes/safe-pipe.pipe';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    LoaderComponent,
	NaLockComponent,
	TopRecommendedBetsComponent,
    ButtonTabComponent,
    OnlyNumberDirective,
    HighlightDirective,
    ToastComponent,
	FilterPipe
  ],
  imports: [
		CommonModule,
		MatSlideToggleModule,
		FormsModule,
		RouterModule,
		SafePipe,
		UnderlinedTabComponent,
		GameStatComponent,
		// HttpClientModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSliderModule,
		CarouselModule,
		MatTooltipModule,
		MatTabsModule,
		ClipboardModule,
		WebcamModule,
		MatSnackBarModule,
		// NoopAnimationsModule,
		MatDialogModule,
		MatTooltipModule,
		NgOtpInputModule,
		NgSelectModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
  ],
  providers : [
	DatePipe,
	{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
],
  exports: [
    LoaderComponent,
	GameStatComponent,
	TopRecommendedBetsComponent,
	NaLockComponent,
    UnderlinedTabComponent,
    ButtonTabComponent,
    OnlyNumberDirective,
    HighlightDirective,
    ToastComponent,		
    CommonModule,
	FormsModule,
	MatSlideToggleModule,
	RouterModule,
	// HttpClientModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatInputModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatSliderModule,
	CarouselModule,
	MatTabsModule,
	MatTooltipModule,
	ClipboardModule,
	WebcamModule,
	MatSnackBarModule,
	MatDialogModule,
	ToastrModule,
	NgOtpInputModule,
	NgSelectModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	SafePipe,
	FilterPipe
  ],	
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
