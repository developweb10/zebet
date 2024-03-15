import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
	LIVEDOC_SETTINGS,
	LiveDocService,
	LiveDocConfigLoaderService,
} from '@livedoc';
import { APP_LIVEDOC_SETTINGS } from './app.settings';
import { AuthFNCService } from './auth-fnc.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule
 } from '@angular/forms';
import { LoaderService } from './services/loader.service';
import { SplashComponent } from './components/splashPage/splashPage.component';
import { ScrollToTopComponent } from './components/scroll-to-top.component';
import { UserService } from './user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ToastService } from './shared/toast/toast.service';
import { AuthInterceptor } from './util/auth-interceptor';

import { BettingService } from './services/betting-service';

import { FooterModule } from './modules/footer/footer.module';
import { HeaderModule } from './modules/header/header.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { ResizeService } from './services/resize.service';
import { ChatIconModule } from './modules/chat-icon/chat-icon.module';
@NgModule({
	declarations: [
		AppComponent, //here
		SplashComponent,  //here
		ScrollToTopComponent, //here
	],
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		FormsModule,
		RouterModule,
		HeaderModule,
		FooterModule,
		CarouselModule,
		NgSelectModule,
		HttpClientModule,
		MatDialogModule,
		NoopAnimationsModule,
		ToastrModule.forRoot({
			enableHtml: true,
		}),
		ChatIconModule
	],
	exports: [
		// FooterComponent
	],
	providers: [
		UserService,
		ToastService,
		DatePipe,

		{
		  provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true
		},
		{
			provide: ResizeService,
		},
		{
			provide: LoaderService,
		},

		{
			provide: LIVEDOC_SETTINGS,
			useValue: APP_LIVEDOC_SETTINGS,
		},
		{
			provide: LiveDocService,
			useFactory: (
				loader: LiveDocConfigLoaderService,
				auth: AuthFNCService,
				settings: typeof APP_LIVEDOC_SETTINGS
			) => {
				return new LiveDocService(loader, settings, auth.token$);
			},
			deps: [LiveDocConfigLoaderService, AuthFNCService, LIVEDOC_SETTINGS],
		},
		{
			provide: BettingService
		},
		CustomPreloadingStrategy
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
