import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';

export const routes: Routes = [
	{ path: '', loadChildren: () => import('../app/modules/splash/splash.module').then((m) => m.SplashModule)},
	{ path: 'sports-book', loadChildren: () => import('../app/modules/sports-book/sports-book.module').then((m) => m.SportsBookModule), data: { preload: true } }, 
	{ path: 'live-sports', loadChildren: () => import('../app/modules/livesports/livesports.module').then((m) => m.LivesportsModule), data: { preload: true } },
	{ path: 'virtual-sports', loadChildren: () => import('../app/modules/virtual-sports/virtual-sports.module').then((m) => m.VirtualSportsModule) },
	{ path: 'jackpot', loadChildren: () => import('../app/modules/jackpot/jackpot.module').then((m) => m.JackpotModule) },
	{ path: 'edit-profile', loadChildren: () => import('../app/modules/my-profile/my-profile.module').then((m) => m.MyProfileModule) },
	{ path: 'auth', loadChildren: () => import('../app/modules/auth/auth.module').then((m) => m.AuthModule) },
	
	{ path: 'promotion', loadChildren: () => import('./modules/promotion/promotion.module').then(m => m.PromotionModule) },
	{ path: 'help', loadChildren: () => import('./modules/help/help.module').then(m => m.HelpModule) },
	{ path: 'blog', loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule) },
	{ path: 'about-us', loadChildren: () => import('./modules/about-us/about-us.module').then(m => m.AboutUsModule) },
	{ path: 'work-with-us', loadChildren: () => import('./modules/work-with-us/work-with-us.module').then(m => m.WorkWithUsModule) },
	{ path: 'privacy-policy', loadChildren: () => import('./modules/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
	{ path: 'terms-and-conditions', loadChildren: () => import('./modules/terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule) },
	{ path: 'sports-betting-rules', loadChildren: () => import('./modules/sports-betting-rules/sports-betting-rules.module').then(m => m.SportsBettingRulesModule) },
	{ path: 'responsible-gaming', loadChildren: () => import('./modules/responsible-gaming/responsible-gaming.module').then(m => m.ResponsibleGamingModule) },
	{ path: 'faq', loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule) },
	{ path: 'contact-us', loadChildren: () => import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule) },
	{ path: 'specials', loadChildren: () => import('./modules/specials/specials.module').then(m => m.SpecialsModule) },
	{ path: 'page', loadChildren: () => import('./modules/custom-page/custom-page.module').then(m => m.CustomPageModule) },
	{ path: 'affiliate-program', loadChildren: () => import('./modules/affiliate-program/affiliate-program.module').then(m => m.AffiliateProgramModule) },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: CustomPreloadingStrategy, onSameUrlNavigation : 'ignore', scrollPositionRestoration: "enabled",
	scrollOffset: [0, 0], })],
	exports: [RouterModule],
})
export class AppRoutingModule { }
